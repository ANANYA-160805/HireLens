const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

function createServiceError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function ensureApiKeyConfigured() {
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    throw createServiceError(
      "Resume generation is not configured. Please contact support.",
      503
    );
  }
}

function parseJsonResponse(responseText, label) {
  if (!responseText || typeof responseText !== "string") {
    throw new Error(`${label} returned an empty response.`);
  }

  try {
    return JSON.parse(responseText);
  } catch (error) {
    throw new Error(
      `${label} returned invalid JSON: ${error.message}`
    );
  }
}

// -----------------------------------------------------------------------------
// INTERVIEW REPORT SCHEMA
// -----------------------------------------------------------------------------

const interviewReportSchema = z.object({
  matchScore: z.number().min(0).max(100),

  technicalQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      })
    )
    .min(5),

  behavioralQuestions: z
    .array(
      z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string(),
      })
    )
    .min(5),

  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),

  preparationPlan: z
    .array(
      z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string()),
      })
    )
    .min(5),

  title: z.string(),
});

// -----------------------------------------------------------------------------
// GENERATE INTERVIEW REPORT
// -----------------------------------------------------------------------------

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    ensureApiKeyConfigured();

    const prompt = `
Generate a complete interview preparation report using the candidate details below.

Requirements:
- Provide at least 5 technical questions and 5 behavioral questions.
- Each question must include the question, interviewer intention, and answer guidance.
- Provide a preparation plan covering at least 5 days.
- Include genuine skill gaps and their severity.
- Set matchScore between 0 and 100.
- Set title to the target job title.
- Do not invent candidate experience or skills.

RESUME:
${resume || "Not provided"}

SELF-DESCRIPTION:
${selfDescription || "Not provided"}

JOB DESCRIPTION:
${jobDescription || "Not provided"}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(interviewReportSchema),
      },
    });

    const parsedResponse = parseJsonResponse(
      response.text,
      "Interview report"
    );

    return interviewReportSchema.parse(parsedResponse);
  } catch (error) {
    console.error("Failed to generate interview report:", error);

    throw new Error(
      `Unable to generate interview report: ${
        error.message || "Unknown error"
      }`
    );
  }
}

// -----------------------------------------------------------------------------
// VALIDATE GENERATED RESUME HTML
// -----------------------------------------------------------------------------

function validateResumeHtml(html) {
  if (typeof html !== "string" || !html.trim()) {
    throw new Error("The resume generator returned empty HTML.");
  }

  const requiredPatterns = [
    /<!doctype\s+html/i,
    /<html\b/i,
    /<head\b/i,
    /<style\b/i,
    /<body\b/i,
    /<\/body\s*>/i,
    /<\/html\s*>/i,
  ];

  for (const pattern of requiredPatterns) {
    if (!pattern.test(html)) {
      throw new Error(
        `Generated resume HTML is missing a required element: ${pattern}`
      );
    }
  }

  return html;
}

// -----------------------------------------------------------------------------
// CONVERT HTML TO PDF USING PUPPETEER
// -----------------------------------------------------------------------------

async function generatePdfFromHtml(htmlContent) {
  validateResumeHtml(htmlContent);

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 1,
    });

    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    await page.emulateMediaType("print");

    await page.evaluate(async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: {
        top: "15mm",
        bottom: "15mm",
        left: "15mm",
        right: "15mm",
      },
    });

    if (!pdfBuffer || pdfBuffer.length === 0) {
      throw new Error("Puppeteer generated an empty PDF.");
    }

    return Buffer.from(pdfBuffer);
  } catch (error) {
    console.error("Failed to generate PDF from HTML:", error);

    throw createServiceError(
      `Unable to generate PDF: ${error.message || "Unknown error"}`,
      500
    );
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}

// -----------------------------------------------------------------------------
// RESUME SCHEMA
// -----------------------------------------------------------------------------

const resumePdfSchema = z.object({
  html: z.string().describe(
    "Complete self-contained HTML5 document for a professional resume."
  ),
});

// -----------------------------------------------------------------------------
// GENERATE RESUME PDF
// -----------------------------------------------------------------------------

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  try {
    ensureApiKeyConfigured();

    if (!resume && !selfDescription) {
      throw createServiceError(
        "Resume information or a self-description is required.",
        400
      );
    }

    if (!jobDescription || !jobDescription.trim()) {
      throw createServiceError(
        "A job description is required to tailor the resume.",
        400
      );
    }

    const prompt = `
You are an expert resume writer, recruiter, ATS optimization specialist,
and professional HTML/CSS resume designer.

Create a polished, professional resume tailored to the target job using
only the candidate information supplied below.

CANDIDATE RESUME:
${resume || "Not provided"}

CANDIDATE SELF-DESCRIPTION:
${selfDescription || "Not provided"}

TARGET JOB DESCRIPTION:
${jobDescription}

FACTUAL ACCURACY:
- Use only facts supported by the candidate information.
- Never invent experience, internships, employers, dates, degrees, grades,
  certifications, skills, responsibilities, or achievements.
- Never fabricate numbers, performance metrics, or project results.
- Preserve the candidate's actual name, contact information, links,
  education details, and dates.
- Do not claim expertise in a skill without supporting information.
- Do not list ongoing courses as completed certifications.
- Describe team projects accurately.
- If information is missing, omit it rather than guessing.

CONTENT:
- Tailor the resume to the target job.
- Prioritize relevant technical skills, experience, and projects.
- Use job-description keywords naturally when supported by the candidate.
- Write clear, concise, natural, professional language.
- Avoid generic AI phrases, repetition, exaggeration, and buzzwords.
- Use action-oriented bullet points without changing the underlying facts.
- Include a short professional summary only if useful.
- Include relevant sections when supported:
  Contact Information, Professional Summary, Technical Skills,
  Experience, Projects, Education, Certifications, and Achievements or Awards.
- Put the most relevant sections first.
- Omit empty sections and irrelevant personal details.
- Keep the resume to one A4 page whenever the available relevant information
  allows it. Use a second page only when needed to include relevant supported
  facts without making the text too small or cramped.

PROFESSIONAL DESIGN:
- Create a modern, minimal, recruiter-quality resume.
- Use a white background, dark charcoal text, and navy blue (#1F3A5F).
- Use Arial, Helvetica, sans-serif.
- Candidate name: 24-28pt bold.
- Section headings: 11-13pt bold.
- Body text: approximately 9.5-10.5pt.
- Contact information: approximately 9-10pt.
- Use readable line spacing and consistent margins.
- Maintain consistent alignment, spacing, dates, and bullet indentation.
- Use subtle horizontal rules where appropriate.
- Use one column and a clear reading order.
- Keep bullet points concise.
- Avoid tables, multiple columns, sidebars, icons, photos, logos,
  skill bars, charts, gradients, shadows, and decorative cards.
- Avoid oversized headings, cramped text, and excessive blank space.
- Ensure URLs and contact details wrap without overflowing.

HTML REQUIREMENTS:
- Return a complete HTML5 document.
- Include <!DOCTYPE html>, <html lang="en">, <head>, UTF-8 metadata,
  viewport metadata, <title>, <style>, and <body>.
- Use semantic HTML elements such as main, section, h1, h2, p, ul, li,
  strong, and a.
- Keep all CSS inside the document.
- Do not use JavaScript, external stylesheets, remote fonts, external
  images, icon libraries, or CSS frameworks.
- Use box-sizing: border-box.
- Use normal document flow.
- Do not use absolute positioning for the main layout.
- Do not set fixed heights or use overflow rules that clip content.
- Ensure all HTML tags are correctly nested and closed.
- Use safe text wrapping for long URLs and contact information.
- Do not use unnecessary page breaks.
- Keep headings with their following content where possible.
- Apply break-inside: avoid selectively to compact entries only.
- Include @page { size: A4; margin: 15mm; }.
- Include suitable @media print rules and print-color-adjust settings.
- Make the HTML suitable for PDF rendering in Puppeteer and Chromium.

ATS REQUIREMENTS:
- Keep the resume single-column and text-based.
- Use standard section headings and HTML bullet lists.
- Do not embed contact details or important text in images.
- Do not hide keywords or repeat them unnaturally.
- Avoid complex layouts that can disrupt text extraction.

OUTPUT CONTRACT:
Return only a valid JSON object with exactly one property named "html".
The value must be the complete HTML document encoded as a JSON string.
Do not return Markdown fences, explanations, or extra properties.
Do not return HTML outside the JSON object.

Before returning, check that the resume is factual, relevant, concise,
well-structured, readable, and uses self-contained HTML and CSS.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: zodToJsonSchema(resumePdfSchema),
      },
    });

    const jsonContent = parseJsonResponse(
      response.text,
      "Resume PDF HTML"
    );

    const validatedResponse = resumePdfSchema.parse(jsonContent);

    const html = validateResumeHtml(validatedResponse.html);

    const pdfBuffer = await generatePdfFromHtml(html);

    return pdfBuffer;
  } catch (error) {
    console.error("Failed to generate resume PDF:", error);

    if (error.statusCode) {
      throw error;
    }

    const providerStatus = Number(
      error.status || error.statusCode || error.response?.status
    );

    if (providerStatus === 429) {
      throw createServiceError(
        "Resume generation is temporarily rate-limited. Please try again shortly.",
        429
      );
    }

    if (providerStatus === 503) {
      throw createServiceError(
        "Resume generation is temporarily unavailable. Please try again shortly.",
        503
      );
    }

    throw createServiceError(
      `Unable to generate resume PDF: ${error.message || "Unknown error"}`,
      502
    );
  }
}

// -----------------------------------------------------------------------------
// EXPORTS
// -----------------------------------------------------------------------------

module.exports = {
  generateInterviewReport,
  generateResumePdf,
};
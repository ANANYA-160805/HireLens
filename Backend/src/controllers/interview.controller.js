const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {


    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { title, selfDescription, jobDescription } = req.body
    const interViewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    title,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interViewReportByAi
})

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })

}

module.exports = {
generateInterViewReportController
}
import { useState } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight, Check, ChevronDown, Code2, FileText, Fingerprint,
  Gauge, MessageCircle, Menu, SearchCheck, CalendarCheck, Star, Upload, X,
} from "lucide-react";
import "./landing.scss";

const reviews = [
  ["Taylor", "Final-year CS student", "The skill gap list helped me focus on testing instead of trying to revise everything at once."],
  ["Morgan", "Frontend developer", "The technical questions felt connected to the React work on my resume, not copied from a generic list."],
  ["Riley", "Career switcher", "The day-by-day plan broke interview prep into steps I could actually fit around my week."],
  ["Casey", "Software engineering graduate", "The STAR hints gave me a useful structure for talking about a project challenge."],
  ["Jordan", "Web developer", "The match score and skill gaps made it clearer which parts of the role to prepare for first."],
  ["Avery", "Early-career developer", "I liked seeing suggested answer points alongside questions tailored to the job description."],
];

const features = [
  { icon: Gauge, title: "Match score", text: "See how well your resume fits the job, and what drives the score." },
  { icon: Code2, title: "Technical questions", text: "Practice questions built from the technologies in your resume and the job post." },
  { icon: MessageCircle, title: "Behavioral questions", text: "Understand what the interviewer wants and answer with a clear STAR structure." },
  { icon: SearchCheck, title: "Skill gaps", text: "Know what to brush up on, ranked by low, medium or high severity." },
  { icon: CalendarCheck, title: "Day-by-day prep plan", text: "Turn the report into focused daily tasks so you know what to do next." },
];

const steps = [
  { icon: Upload, title: "Upload your resume", text: "Add your resume as a PDF or DOCX." },
  { icon: FileText, title: "Add the job description", text: "Paste the role and write a few lines about yourself." },
  { icon: Check, title: "Get your report", text: "Review your score, questions, gaps and prep plan." },
];

const tabs = {
  "Match score": { title: "88% match: a strong fit for this role", text: "Your React and Node.js experience lines up closely with the job description. Close the gaps below to make your prep count." },
  Technical: { title: "How does React's Virtual DOM work?", text: "What they look for: understanding of reconciliation. A good way in: React compares the new virtual tree with the previous one and applies only the minimum changes to the real DOM." },
  Behavioral: { title: "Tell me about a technical challenge you overcame.", text: "What they look for: ownership and clear thinking. Structure your answer as Situation, Task, Action, Result." },
  "Skill gaps": { title: "Three areas to review", list: [["Automated testing", "Medium"], ["Commercial production experience", "Medium"], ["Cloud specialization", "Low"]] },
  "Prep plan": { title: "A focused plan, one day at a time", list: [["Day 1", "Frontend deep dive"], ["Day 2", "Backend security"], ["Day 3", "AI integration"]] },
};

const faqs = [
  ["What files can I upload?", "PDF or DOCX. A clear, text-based resume gives the most accurate results."],
  ["Is my resume private?", "Your resume is used to create your report and is only available from your account."],
  ["How is the match score calculated?", "HireLens compares your resume with the job description: skills, experience and responsibilities. Treat it as guidance, not a hiring prediction."],
  ["Is it free?", "You can create an account and try the resume analysis for free."],
  ["How long does a report take?", "Usually about a minute, depending on document length."],
];

function Reveal({ children, className, delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function Brand({ onClick }) {
  return (
    <Link to="/" className="hl-brand" onClick={onClick}>
      <span className="hl-brand-mark"><Fingerprint size={20} /></span>
      Hire<b>Lens</b>
    </Link>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="hl-header">
      <nav className="hl-wrap hl-nav">
        <Brand onClick={close} />
        <div className={`hl-links ${open ? "is-open" : ""}`}>
          <a href="#how" onClick={close}>How it works</a>
          <a href="#features" onClick={close}>Features</a>
          <a href="#report" onClick={close}>Sample report</a>
          <a href="#faq" onClick={close}>FAQ</a>
          <Link className="hl-btn hl-btn--ghost hl-only-mobile" to="/login">Log in</Link>
          <Link className="hl-btn hl-btn--dark hl-only-mobile" to="/register">Get started</Link>
        </div>
        <div className="hl-actions">
          <Link className="hl-btn hl-btn--ghost" to="/login">Log in</Link>
          <Link className="hl-btn hl-btn--dark" to="/register">Get started <ArrowRight size={15} /></Link>
        </div>
        <button className="hl-burger" type="button" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
    </header>
  );
}

function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hl-hero">
      <div className="hl-wrap hl-hero-grid">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.6, ease: "easeOut" }}
        >
          <p className="hl-pill"><span /> AI interview prep, built around your resume</p>
          <h1>Turn any job description into your interview game plan.</h1>
          <p className="hl-lead">Upload your resume, add the role, and get a match score, tailored questions, skill gaps and a day-by-day plan.</p>
          <div className="hl-cta-row">
            <Link className="hl-btn hl-btn--primary" to="/register">Analyze my resume <ArrowRight size={17} /></Link>
            <a className="hl-btn hl-btn--outline" href="#report">See a sample report</a>
          </div>
          <p className="hl-note"><Check size={15} /> Resume-specific prep. No generic question lists.</p>
        </motion.div>

        <motion.div
          className="hl-card"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 14 }}
          animate={reduceMotion ? undefined : { opacity: 1, scale: 1, y: [0, -6, 0] }}
          transition={reduceMotion ? { duration: 0 } : { opacity: { duration: 0.65, delay: 0.12 }, scale: { duration: 0.65, delay: 0.12 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 } }}
        >
          <div className="hl-card-top"><span>Interview report</span><span className="hl-ready">Ready</span></div>
          <div className="hl-score-row">
            <div className="hl-ring" role="img" aria-label="88 percent match">
              <svg viewBox="0 0 104 104" aria-hidden="true">
                <circle className="hl-ring-track" cx="52" cy="52" r="43" />
                <motion.circle
                  className="hl-ring-progress"
                  cx="52"
                  cy="52"
                  r="43"
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  animate={{ pathLength: 0.88 }}
                  transition={{ duration: reduceMotion ? 0 : 1.25, delay: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
                />
              </svg>
              <strong>88%</strong>
            </div>
            <div><h3>Software Engineer</h3><p>Strong alignment with the role.</p></div>
          </div>
          <div className="hl-chips">
            <span className="chip chip--m">Testing · Medium</span>
            <span className="chip chip--l">Cloud · Low</span>
          </div>
          <ul className="hl-mini">
            <li><b>Day 1</b> Frontend deep dive <Check size={15} /></li>
            <li><b>Day 2</b> Backend security</li>
            <li><b>Day 3</b> AI integration</li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

function ProductHighlights() {
  const highlights = [
    { icon: FileText, text: "Resume-to-role analysis" },
    { icon: MessageCircle, text: "Questions tailored to your experience" },
    { icon: CalendarCheck, text: "A focused plan for what to study next" },
  ];

  return (
    <section className="hl-stack" aria-label="HireLens interview preparation features">
      <div className="hl-wrap hl-stack-row">
        <p>One clear path from resume to interview-ready.</p>
        <div>
          {highlights.map(({ icon: Icon, text }) => (
            <span key={text}><Icon size={16} aria-hidden="true" />{text}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewRow({ items, direction, label }) {
  return (
    <div className={`hl-review-viewport hl-review-viewport--${direction}`} role="region" aria-label={label}>
      <div className="hl-review-track">
        {[0, 1].map((copyIndex) => (
          <div className="hl-review-group" role="list" aria-hidden={copyIndex === 1} key={copyIndex}>
            {items.map(([name, role, text]) => (
              <article className="hl-review-card" role="listitem" key={name}>
                <div className="hl-review-stars" role="img" aria-label="5 out of 5 stars">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
                <p className="hl-review-quote">“{text}”</p>
                <div className="hl-review-author">
                  <span className="hl-review-avatar" aria-hidden="true">{name.charAt(0)}</span>
                  <span className="hl-review-person"><strong>{name}</strong><small>{role}</small></span>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Reviews() {
  return (
    <section className="hl-section hl-reviews-section" aria-labelledby="hl-reviews-heading">
      <div className="hl-wrap hl-reviews-heading">
        <p className="hl-review-eyebrow">EARLY FEEDBACK</p>
        <h2 id="hl-reviews-heading">Early feedback</h2>
        <p>Join thousands of professionals securing interviews at top-tier companies with AI-optimized narratives.</p>
      </div>
      <div className="hl-reviews-rows">
        <ReviewRow items={reviews.slice(0, 3)} direction="left" label="Sample reviews, scrolling left" />
        <ReviewRow items={reviews.slice(3)} direction="right" label="More sample reviews, scrolling right" />
      </div>
    </section>
  );
}

function Heading({ title, text }) {
  return <div className="hl-heading"><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function How() {
  return (
    <section className="hl-section" id="how">
      <div className="hl-wrap">
        <Reveal><Heading title="Three steps to a sharper interview" text="Less guessing what to study. More time practicing what matters." /></Reveal>
        <div className="hl-grid3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <Reveal className="hl-tile" delay={i * 0.08} key={title}>
              <span className="hl-icon"><Icon size={20} /></span>
              <h3>{i + 1}. {title}</h3><p>{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="hl-section hl-alt" id="features">
      <div className="hl-wrap">
        <Reveal><Heading title="Everything in one interview report" text="A complete prep kit shaped around the role you want." /></Reveal>
        <div className="hl-features">
          {features.map(({ icon: Icon, title, text }, index) => (
            <Reveal className="hl-tile" delay={index * 0.07} key={title}>
              <span className="hl-icon"><Icon size={20} /></span>
              <h3>{title}</h3><p>{text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Report() {
  const names = Object.keys(tabs);
  const [tab, setTab] = useState(names[0]);
  const reduceMotion = useReducedMotion();
  const t = tabs[tab];
  return (
    <section className="hl-section" id="report">
      <div className="hl-wrap">
        <Reveal><Heading title="See what's inside your report" text="Click through a sample report for a Software Engineer role." /></Reveal>
        <Reveal className="hl-report-reveal">
        <div className="hl-window">
          <div className="hl-tabs" role="tablist">
            {names.map((n) => (
              <button key={n} role="tab" type="button" aria-selected={tab === n} className={tab === n ? "on" : ""} onClick={() => setTab(n)}>{n}</button>
            ))}
          </div>
          <motion.div
            className="hl-panel"
            key={tab}
            role="tabpanel"
            initial={reduceMotion ? false : { opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.22 }}
          >
            <h3>{t.title}</h3>
            {t.text && <p>{t.text}</p>}
            {t.list && (
              <ul>{t.list.map(([a, b]) => <li key={a}><span>{a}</span><b>{b}</b></li>)}</ul>
            )}
          </motion.div>
        </div>
        </Reveal>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="hl-section hl-alt" id="faq">
      <div className="hl-wrap hl-narrow">
        <Reveal><Heading title="Common questions" /></Reveal>
        {faqs.map(([q, a], i) => (
          <Reveal className="hl-faq-reveal" delay={i * 0.05} key={q}>
          <div className={`hl-faq ${open === i ? "on" : ""}`}>
            <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{q}<ChevronDown size={19} /></button>
            {open === i && <p>{a}</p>}
          </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="hl-final-cta">
      <Reveal className="hl-wrap hl-final-cta-row">
        <div>
          <p className="hl-final-eyebrow">PREPARE FOR THE ROLE YOU WANT</p>
          <h2>Your next interview starts here.</h2>
          <p>Get a report built around your resume, your target role, and the gaps worth closing.</p>
        </div>
        <Link className="hl-btn hl-btn--cta" to="/register">Get started free <ArrowRight size={17} /></Link>
      </Reveal>
    </section>
  );
}

function Footer() {
  return (
    <footer className="hl-footer">
      <div className="hl-wrap hl-foot-row">
        <Brand />
        <span>© {new Date().getFullYear()} HireLens. Prepared for what's next.</span>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <main className="hl">
      <Navbar />
      <Hero />
      <ProductHighlights />
      <How />
      <Features />
      <Report />
      <Reviews />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
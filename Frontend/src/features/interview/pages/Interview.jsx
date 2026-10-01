import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import {
	ArrowLeft,
	ArrowRight,
	BookOpenCheck,
	CalendarDays,
	Check,
	ChevronLeft,
	ChevronRight,
	Code2,
	Fingerprint,
	MessageCircle,
	Target,
} from 'lucide-react'
import '../style/interview.scss'

const reportFromStorage = (id) => {
	if (!id || typeof window === 'undefined') return null
	try {
		const saved = window.sessionStorage.getItem(`hirelens:report:${id}`)
		return saved ? JSON.parse(saved) : null
	} catch {
		return null
	}
}

const sections = [
	{ id: 'technical', label: 'Technical questions', icon: Code2 },
	{ id: 'behavioral', label: 'Behavioral questions', icon: MessageCircle },
	{ id: 'roadmap', label: 'Road Map', icon: CalendarDays },
]

const Interview = () => {
	const { InterviewId } = useParams()
	const location = useLocation()
	const [storedReport] = useState(() => reportFromStorage(InterviewId))
	const report = location.state?.report || storedReport
	const [activeSection, setActiveSection] = useState('technical')
	const [questionIndex, setQuestionIndex] = useState(0)

	if (!report) {
		return (
			<main className="interview-page interview-page--missing">
				<div className="interview-empty-state">
					<span className="interview-empty-icon"><BookOpenCheck size={22} /></span>
					<p className="interview-eyebrow">REPORT NOT AVAILABLE</p>
					<h1>This report is not in this session.</h1>
					<p>Generate a new interview report to view its questions, skill gaps, and preparation plan.</p>
					<Link className="interview-back-link" to="/home"><ArrowLeft size={16} /> Back to preparation</Link>
				</div>
			</main>
		)
	}

	const activeQuestions = activeSection === 'technical'
		? report.technicalQuestions || []
		: report.behavioralQuestions || []
	const currentQuestion = activeQuestions[questionIndex]
	const skillGaps = report.skillGaps || []
	const preparationPlan = report.preparationPlan || []
	const matchScore = Math.max(0, Math.min(100, Number(report.matchScore) || 0))

	const changeSection = (section) => {
		setActiveSection(section)
		setQuestionIndex(0)
	}

	const changeQuestion = (direction) => {
		setQuestionIndex((current) => Math.max(0, Math.min(activeQuestions.length - 1, current + direction)))
	}

	return (
		<main className="interview-page">
			<header className="interview-topbar">
				<Link className="interview-brand" to="/home" aria-label="HireLens home">
					<span className="interview-brand-mark"><Fingerprint size={20} /></span>
					<span>Hire<b>Lens</b></span>
				</Link>
				<div className="interview-topbar-meta">
					<span>INTERVIEW REPORT</span>
					<span className="interview-report-id">{report.title || 'Role report'}</span>
				</div>
				<Link className="interview-back-link interview-back-link--top" to="/home">
					<ArrowLeft size={15} /> New analysis
				</Link>
			</header>

			<div className="interview-layout">
				<aside className="interview-sidebar interview-sidebar--left" aria-label="Report sections">
					<p className="interview-sidebar-label">YOUR REPORT</p>
					<nav className="interview-section-nav">
						{sections.map(({ id, label, icon: Icon }) => {
							const count = id === 'technical'
								? report.technicalQuestions?.length
								: id === 'behavioral'
									? report.behavioralQuestions?.length
									: report.preparationPlan?.length
							return (
								<button
									className={`interview-nav-item${activeSection === id ? ' is-active' : ''}`}
									type="button"
									key={id}
									aria-pressed={activeSection === id}
									onClick={() => changeSection(id)}
								>
									<Icon size={17} aria-hidden="true" />
									<span>{label}</span>
									<span className="interview-nav-count">{count || 0}</span>
								</button>
							)
						})}
					</nav>
					<div className="interview-sidebar-note">
						<span><Target size={16} /></span>
						<p>Built around your resume and this role.</p>
					</div>
				</aside>

				<section className="interview-main" aria-live="polite">
					<div className="interview-main-heading">
						<div>
							<p className="interview-eyebrow">{report.title || 'YOUR PREPARATION'}</p>
							<h1>{activeSection === 'technical'
								? 'Technical questions'
								: activeSection === 'behavioral'
									? 'Behavioral questions'
									: 'Your preparation road map'}</h1>
						</div>
						<div className="interview-match-score" aria-label={`Match score ${matchScore} percent`}>
							<span className="interview-score-ring" style={{ '--score': `${matchScore}%` }}>
								<strong>{matchScore}<small>%</small></strong>
							</span>
							<span>Match score</span>
						</div>
					</div>

					{activeSection === 'roadmap' ? (
						<div className="interview-roadmap">
							{preparationPlan.length ? preparationPlan.map((day) => (
								<article className="interview-day" key={day._id?.$oid || day.day}>
									<div className="interview-day-marker">{day.day}</div>
									<div className="interview-day-content">
										<p className="interview-day-label">DAY {day.day}</p>
										<h2>{day.focus}</h2>
										<ul>
											{(day.tasks || []).map((task, index) => (
												<li key={`${day.day}-${index}`}><Check size={15} aria-hidden="true" /><span>{task}</span></li>
											))}
										</ul>
									</div>
								</article>
							)) : <p className="interview-no-content">No preparation days were included in this report.</p>}
						</div>
					) : currentQuestion ? (
						<article className="interview-question-panel" key={`${activeSection}-${questionIndex}`}>
							<div className="interview-question-meta">
								<span>{activeSection === 'technical' ? 'TECHNICAL' : 'BEHAVIORAL'}</span>
								<span>QUESTION {questionIndex + 1} <i /> {activeQuestions.length}</span>
							</div>
							<h2>{currentQuestion.question}</h2>
							<section className="interview-detail-block interview-intention">
								<h3><Target size={16} /> What they are assessing</h3>
								<p>{currentQuestion.intention}</p>
							</section>
							<section className="interview-detail-block interview-answer">
								<h3><BookOpenCheck size={16} /> How to shape your answer</h3>
								<p>{currentQuestion.answer}</p>
							</section>
							<div className="interview-question-controls">
								<span>{String(questionIndex + 1).padStart(2, '0')} <span>/ {String(activeQuestions.length).padStart(2, '0')}</span></span>
								<div>
									<button type="button" onClick={() => changeQuestion(-1)} disabled={questionIndex === 0} aria-label="Previous question">
										<ChevronLeft size={18} />
									</button>
									<button type="button" onClick={() => changeQuestion(1)} disabled={questionIndex >= activeQuestions.length - 1} aria-label="Next question">
										<ChevronRight size={18} />
									</button>
								</div>
							</div>
						</article>
					) : (
						<p className="interview-no-content">No questions were included in this report.</p>
					)}

					<div className="interview-main-footer">
						<Link to="/home"><ArrowLeft size={15} /> Return to preparation</Link>
						{activeSection !== 'roadmap' && activeQuestions.length > 0 && (
							<button type="button" onClick={() => changeSection(activeSection === 'technical' ? 'behavioral' : 'roadmap')}>
								{activeSection === 'technical' ? 'Behavioral questions' : 'View road map'} <ArrowRight size={15} />
							</button>
						)}
					</div>
				</section>

				<aside className="interview-sidebar interview-sidebar--right" aria-label="Skill gaps">
					<div className="interview-side-heading">
						<div>
							<p className="interview-sidebar-label">ROLE ALIGNMENT</p>
							<h2>Skill gaps</h2>
						</div>
						<span className="interview-gap-total">{skillGaps.length}</span>
					</div>
					{skillGaps.length ? (
						<ul className="interview-skill-list">
							{skillGaps.map((gap, index) => (
								<li className="interview-skill-item" key={`${gap.skill}-${index}`}>
									<span className={`interview-severity interview-severity--${String(gap.severity).toLowerCase()}`} aria-label={`${gap.severity} severity`} />
									<span className="interview-skill-name">{gap.skill}</span>
									<span className="interview-skill-severity">{gap.severity}</span>
								</li>
							))}
						</ul>
					) : (
						<p className="interview-no-gaps">No significant skill gaps were identified.</p>
					)}
					<div className="interview-severity-key">
						<span><i className="interview-severity--high" />High</span>
						<span><i className="interview-severity--medium" />Medium</span>
						<span><i className="interview-severity--low" />Low</span>
					</div>
					<div className="interview-score-note">
						<strong>{matchScore}%</strong>
						<p>profile alignment with the role</p>
					</div>
				</aside>
			</div>
		</main>
	)
}

export default Interview

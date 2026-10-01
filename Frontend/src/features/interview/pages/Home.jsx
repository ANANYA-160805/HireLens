import { useRef, useState } from 'react'
import { Fingerprint, LoaderCircle } from 'lucide-react'
import { useNavigate } from 'react-router'
import { generateInterviewReport } from '../services/interview.api.js'
import '../style/home.scss'

const MAX_JD = 5000
const MAX_FILE_MB = 3

const Home = () => {
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [resume, setResume] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [fileError, setFileError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileRef = useRef(null)

  const canSubmit = jobDescription.trim().length > 0 && Boolean(resume) && !isSubmitting

  const handleFile = (file) => {
    if (!file) return
    const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name)
    if (!isPdf) {
      setFileError('Please upload a PDF file.')
      setResume(null)
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File must be under ${MAX_FILE_MB} MB.`)
      setResume(null)
      if (fileRef.current) fileRef.current.value = ''
      return
    }
    setFileError('')
    setSubmitError('')
    setResume(file)
  }

  const clearFile = () => {
    setResume(null)
    setFileError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!jobDescription.trim() || !resume || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError('')
    setSubmitMessage('')

    try {
      const result = await generateInterviewReport({
        jobDescription: jobDescription.trim(),
        selfDescription: selfDescription.trim(),
        resume,
      })
      const report = result.interviewReport
      const reportId = report?._id?.$oid || report?._id

      if (!reportId) {
        setSubmitError('The report was created, but its ID was missing from the response.')
        return
      }

      try {
        sessionStorage.setItem(`hirelens:report:${reportId}`, JSON.stringify(report))
      } catch {
        // Router state still carries the report if session storage is unavailable.
      }

      navigate(`/interview/${reportId}`, { state: { report } })
    } catch (error) {
      setSubmitError(
        error.response?.data?.message ||
        'Could not generate your report. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="home">
      <div className="home-shell">
        <header className="home-brand-row">
          <div className="home-brand">
            <span className="home-brand-mark">
              <Fingerprint size={20} />
            </span>
            <span>
              Hire<b>Lens</b>
            </span>
          </div>
          <div className="home-step" aria-label="Step 1 of 3">
            INTERVIEW PREP
            <span className="home-bar" aria-hidden="true">
              <i className="is-active" />
              <i />
              <i />
            </span>
            <span>01 / 03</span>
          </div>
        </header>

        <section className="home-intro">
          <p className="home-eyebrow">YOUR NEXT INTERVIEW, IN FOCUS</p>
          <h1>
            Build a plan that fits <em>the role.</em>
          </h1>
          <p className="home-description">
            Bring the job description and your experience. We will turn them into focused
            interview practice.
          </p>
          <ul className="home-points">
            <li>Role-specific questions</li>
            <li>Skill-gap analysis</li>
            <li>Prep roadmap</li>
          </ul>
        </section>

        <form className="home-form" onSubmit={handleSubmit}>
          <div className="left card">
            <label className="field-label" htmlFor="jobDescription">
              Job description <span className="tag tag--required">REQUIRED</span>
            </label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              value={jobDescription}
              maxLength={MAX_JD}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={'Paste the full job description here…\n\nResponsibilities, required skills, nice-to-haves.'}
              required
            />
            <div className="field-meta">
              <p className="field-hint">Include the responsibilities and qualifications for the role.</p>
              <span className="counter">
                {jobDescription.length} / {MAX_JD}
              </span>
            </div>
          </div>

          <div className="right card">
            <div className="input-group">
              <span className="field-label">
                Resume <span className="tag tag--required">REQUIRED</span>
              </span>

              <label
                htmlFor="resume"
                className={`dropzone${dragging ? ' is-dragging' : ''}${resume ? ' has-file' : ''}`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <span className="dropzone-icon" aria-hidden="true">↑</span>
                <span className="dropzone-text">
                  <strong>{resume ? 'Replace resume' : 'Drop your PDF here'}</strong>
                  <small>or click to browse · max {MAX_FILE_MB} MB</small>
                </span>
                <input
                  ref={fileRef}
                  className="sr-only"
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,application/pdf"
                  aria-required="true"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>

              {resume && (
                <div className="file-chip">
                  <span className="file-chip-name">{resume.name}</span>
                  <button type="button" onClick={clearFile} aria-label="Remove resume">
                    ×
                  </button>
                </div>
              )}
              {fileError && (
                <p className="field-error" role="alert">
                  {fileError}
                </p>
              )}
            </div>

            <div className="input-group">
              <label className="field-label" htmlFor="selfDescription">
                Self description <span className="tag">OPTIONAL</span>
              </label>
              <textarea
                id="selfDescription"
                name="selfDescription"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder={'e.g. Final-year student, built two MERN projects, strongest in React…'}
              />
              <p className="field-hint">A few details help tailor your questions.</p>
            </div>

            <button className={`generate-btn${isSubmitting ? ' is-loading' : ''}`} type="submit" disabled={!canSubmit}>
              {isSubmitting ? <><LoaderCircle className="submit-spinner" size={17} aria-hidden="true" /> Generating report...</> : 'Generate Interview Report'}
            </button>
            {submitError && <p className="field-error" role="alert" aria-live="polite">{submitError}</p>}
            {submitMessage && <p className="field-success" role="status" aria-live="polite">{submitMessage}</p>}
            <p className="home-privacy">Your resume is used only to prepare your report.</p>
          </div>
        </form>
      </div>
    </main>
  )
}

export default Home
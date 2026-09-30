import '../style/home.scss'

const Home = () => {
 return (
  <main className='home'>
    <div className="home-shell">
      <header className="home-brand-row">
        <div className="home-brand"><span className="home-brand-mark">H</span><span>HireLens</span></div>
        <span className="home-step">INTERVIEW PREP <span>01 / 03</span></span>
      </header>

      <section className="home-intro">
        <p className="home-eyebrow">YOUR NEXT INTERVIEW, IN FOCUS</p>
        <h1>Build a plan that fits <em>the role.</em></h1>
        <p className="home-description">Bring the job description and your experience. We will turn them into focused interview practice.</p>
      </section>

      <div className="home-form">
        <div className="left">
          <label className="field-label" htmlFor="jobDescription">Job description <span>REQUIRED</span></label>
          <textarea name="jobDescription" id="jobDescription" placeholder="Enter job description
here..."></textarea>
          <p className="field-hint">Include the responsibilities and qualifications for the role.</p>
        </div>
        <div className="right">
          <div className="input-group">
            <label htmlFor="resume">Upload Resume</label>
            <input type="file" name="resume" id="resume" accept=".pdf" />
            <p className="field-hint">PDF format works best.</p>
          </div>
          <div className="input-group">
            <label htmlFor="selfDescription">Self Description</label>
            <textarea name="selfDescription" id="selfDescription" placeholder="Describe yourself
in a few sentences..."></textarea>
            <p className="field-hint">A few details help tailor your questions.</p>
          </div>
          <button className='generate-btn'>Generate Interview Report</button>
          <p className="home-privacy">Your resume is used only to prepare your report.</p>
        </div>
      </div>
    </div>
  </main>
)
}

export default Home

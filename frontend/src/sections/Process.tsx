import './Process.css';

const steps = [
  {
    title: 'Request a Quote',
    body: 'Tell us about your space and cleaning goals.',
  },
  {
    title: 'Get a Tailored Plan',
    body: 'We recommend a service scope and schedule.',
  },
  {
    title: 'We Clean, You Review',
    body: 'Our team completes the service and follows up for feedback.',
  },
];

const Process = () => {
  return (
    <section id="process" className="section process-section">
      <div className="container">
        <div className="process-header">
          <span className="section-title">PROCESS</span>
          <h2>How It Works</h2>
        </div>
        <div className="process-grid">
          {steps.map((step, index) => (
            <article key={step.title} className="process-card">
              <div className="process-step">Step {index + 1}</div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;

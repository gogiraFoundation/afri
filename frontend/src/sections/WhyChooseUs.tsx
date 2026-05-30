import { scrollToContact } from '../config/site';
import lobbyFloorMopping from '../assets/lobby-floor-mopping.png';

const WhyChooseUs = () => {
  const features = [
    {
      title: 'Scheduling that fits you',
      description:
        'One-off deep cleans, regular upkeep, or business hours—we align visits with your calendar and adjust when plans change.',
    },
    {
      title: 'Consistent quality, every time',
      description:
        'Clear checklists, the same attention to detail on every job, and teams who treat your space with care from arrival to handover.',
    },
    {
      title: 'Digital proof of clean',
      description:
        'After every visit we send a WhatsApp message with before/after photos and a completed checklist, so you come home to a guaranteed result.',
    },
  ];

  const handleViewServices = () => {
    window.location.href = '/services';
  };

  const handleGetQuote = () => {
    scrollToContact();
  };

  return (
    <section id="why-choose" className="section why-choose-section">
      <div className="container">
        <div className="why-choose-container">
          <div className="why-choose-content">
            <span className="section-title">WHY CHOOSE US</span>
            <h2>Flexibility and quality you can feel</h2>
            <p className="why-choose-description">
              We combine adaptable booking with dependable standards—so you get a service that
              works around your life, not the other way around.
            </p>
            <ul className="why-choose-features">
              {features.map((feature) => (
                <li key={feature.title} className="feature-item">
                  <span className="feature-check">✓</span>
                  <div className="feature-copy">
                    <h3 className="feature-heading">{feature.title}</h3>
                    <p className="feature-text">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="why-choose-actions">
              <button className="btn btn-primary" onClick={handleGetQuote}>
                Get a Free Quote
              </button>
              <button className="btn btn-outline" onClick={handleViewServices}>
                View Services
              </button>
            </div>
          </div>
          <div className="why-choose-visual">
            <div className="why-choose-image-wrapper">
              <img
                src={lobbyFloorMopping}
                alt="Cleaning professional mopping a bright modern lobby"
                className="why-choose-image"
              />
            </div>
            <div className="stats-grid">
              <h3 className="stats-title">Built for dependable service</h3>
              <div className="stat-card">
                <div className="stat-label">Clear scope before every visit</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Professional teams and careful handling</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Flexible scheduling for homes and businesses</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Follow-up support if anything is missed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;


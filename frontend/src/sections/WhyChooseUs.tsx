import { scrollToContact } from '../config/site';
import lobbyFloorMopping from '../assets/lobby-floor-mopping.png';
import './WhyChooseUs.css';

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

  const trustPoints = [
    'Clear scope before every visit',
    'Professional teams and careful handling',
    'Flexible scheduling for homes and businesses',
    'Follow-up support if anything is missed',
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
            <div className="why-choose-header">
              <span className="section-title">WHY CHOOSE US</span>
              <h2>Flexibility and quality you can feel</h2>
              <p className="why-choose-description">
                We combine adaptable booking with dependable standards—so you get a service that
                works around your life, not the other way around.
              </p>
            </div>
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
              <button type="button" className="btn btn-primary" onClick={handleGetQuote}>
                Get a Free Quote
              </button>
              <button type="button" className="btn btn-outline" onClick={handleViewServices}>
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
                width={600}
                height={450}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="why-choose-trust-panel">
              <h3 className="why-choose-trust-title">Built for dependable service</h3>
              <ul className="why-choose-trust-list">
                {trustPoints.map((point) => (
                  <li key={point} className="why-choose-trust-item">
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;


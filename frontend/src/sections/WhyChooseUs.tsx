import './WhyChooseUs.css';
import lobbyFloorMopping from '../assets/lobby-floor-mopping.png';

const WhyChooseUs = () => {
  const features = [
    'Personalized cleaning plans for your exact needs',
    'Trained professionals who respect your space',
    'Optional eco-friendly cleaning products',
    'Transparent pricing with no hidden surprises',
    'Easy booking and dependable arrival times',
    'Quick issue resolution if anything is missed',
  ];

  const handleViewServices = () => {
    window.location.href = '/services';
  };

  const handleGetQuote = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="why-choose" className="section why-choose-section">
      <div className="container">
        <div className="why-choose-container">
          <div className="why-choose-content">
            <span className="section-title">WHY CHOOSE US</span>
            <h2>Why Clients Choose Afri Cleans</h2>
            <p className="why-choose-description">
              We may be new, but our approach is built on proven cleaning standards: clear
              expectations, trained teams, and consistent execution.
            </p>
            <ul className="why-choose-features">
              {features.map((feature, index) => (
                <li key={index} className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>{feature}</span>
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


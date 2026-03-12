import './WhyChooseUs.css';
import lobbyFloorMopping from '../assets/lobby-floor-mopping.png';

const WhyChooseUs = () => {
  const stats = [
    { number: '300+', label: 'Happy Clients' },
    { number: '8756+', label: 'Homes Cleaned' },
    { number: '300+', label: 'Corporate Spaces' },
    { number: '300+', label: '5-Star Reviews' },
  ];

  const features = [
    'Experienced and trained cleaners',
    'Eco-friendly cleaning products',
    'Reliable and punctual service',
    'Customized cleaning plans',
    'Satisfaction guaranteed',
  ];

  const handleDownloadBrochure = () => {
    window.location.href = '/brochure';
  };

  const handleViewPricing = () => {
    window.location.href = '/pricing';
  };

  return (
    <section id="why-choose" className="section why-choose-section">
      <div className="container">
        <div className="why-choose-container">
          <div className="why-choose-content">
            <span className="section-title">WHY CHOOSE US</span>
            <h2>
              A Cleaning Company You Can Trust with{' '}
              <span className="brand-highlight">Afri Cleans</span>
            </h2>
            <p className="why-choose-description">
              Choosing the right cleaning partner makes all the difference. We combine years of
              experience, trained professionals, eco-friendly products, and attention to detail to
              deliver exceptional results for homes and businesses.
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
              <button className="btn btn-primary" onClick={handleViewPricing}>
                View Pricing →
              </button>
              <button className="btn btn-outline" onClick={handleDownloadBrochure}>
                Download brochure
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
              <h3 className="stats-title">Our Impact in Numbers</h3>
              {stats.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;


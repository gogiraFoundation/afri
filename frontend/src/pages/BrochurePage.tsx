import './BrochurePage.css';

const coreServices = [
  'Residential cleaning',
  'Commercial cleaning',
  'Window cleaning',
  'Post-construction cleaning',
  'Deep cleaning',
  'Outdoor cleaning',
  'Kitchen cleaning',
  'Bathroom cleaning',
  'Eco-friendly cleaning',
  'Regular cleaning',
];

const reasonsToChooseUs = [
  'Clean and healthy environment for homes and offices.',
  'Flexible scheduling that fits your lifestyle and business hours.',
  'Trained, vetted professionals you can trust in your space.',
  'Attention to detail on every visit, big or small.',
  'Eco-conscious options with safe, effective products.',
];

const BrochurePage = () => {
  const handleBackToSite = () => {
    window.location.href = '/';
  };

  return (
    <div className="brochure-page">
      <div className="brochure-shell">
        <header className="brochure-header">
          <div>
            <h1 className="brochure-title">Afri Cleans</h1>
            <p className="brochure-subtitle">Professional Cleaning Service Brochure</p>
          </div>
          <div className="brochure-header-actions">
            <button className="btn btn-outline brochure-back-btn" onClick={handleBackToSite}>
              Back to website
            </button>
            <span className="brochure-print-hint">Tip: Use your browser&apos;s Print to save as PDF.</span>
          </div>
        </header>

        <main className="brochure-grid">
          <section className="brochure-panel brochure-panel-about">
            <h2 className="brochure-section-title">About our service</h2>
            <p>
              Afri Cleans provides professional residential and commercial cleaning tailored to busy households and
              growing businesses. Our trained cleaners follow a detailed checklist on every visit so your spaces stay
              fresh, healthy, and guest-ready all week long.
            </p>
            <p>
              Whether you need a one-time deep clean, recurring maintenance, or post-construction support, our team
              arrives on time with everything required to get the job done properly.
            </p>
          </section>

          <section className="brochure-panel brochure-panel-services">
            <h2 className="brochure-section-title">Our services</h2>
            <ol className="brochure-services-list">
              {coreServices.map((service, index) => (
                <li key={service} className="brochure-services-item">
                  <span className="brochure-services-number">{index + 1}.</span>
                  <span>{service}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="brochure-panel brochure-panel-why">
            <h2 className="brochure-section-title">Why choose us</h2>
            <ul className="brochure-why-list">
              {reasonsToChooseUs.map((reason) => (
                <li key={reason} className="brochure-why-item">
                  <span className="brochure-why-bullet">●</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
            <div className="brochure-contact-block">
              <p className="brochure-contact-heading">Ready to book your clean?</p>
              <p>Phone: (+012)87059897 · Email: info@africleans.com</p>
              <p>Website: africleans.com</p>
            </div>
          </section>
        </main>

        <footer className="brochure-footer">
          <p>Afri Cleans · Professional Cleaning Services</p>
        </footer>
      </div>
    </div>
  );
};

export default BrochurePage;


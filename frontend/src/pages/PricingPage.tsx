import { useEffect } from 'react';
import { CONTACT_HASH_HREF, PHONE_DISPLAY, TEL_HREF } from '../config/site';
import './PricingPage.css';

const PricingPage = () => {
  useEffect(() => {
    document.title = 'Pricing | Afri Cleans';
  }, []);

  const handleBookNow = () => {
    window.location.href = CONTACT_HASH_HREF;
  };

  const handleCall = () => {
    window.location.href = TEL_HREF;
  };

  return (
    <div className="pricing-page">
      <header className="pricing-hero section">
        <div className="container pricing-hero-container">
          <div className="pricing-hero-content">
            <h1>Transparent Pricing for Professional Cleaning Services</h1>
            <p>
              We keep pricing straightforward. Your final quote is based on service scope, property
              size, and schedule, so you know what to expect before service starts.
            </p>
            <div className="pricing-hero-actions">
              <button className="btn btn-primary" onClick={handleBookNow}>
                Get a Free Quote
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="page-content">
        <section className="section pricing-section">
          <div className="container">
            <div className="pricing-section-header">
              <h2>Commercial Cleaning Pricing</h2>
              <p>Maintain a professional and hygienic workspace.</p>
            </div>

            <div className="pricing-commercial">
              <article className="pricing-commercial-card">
                <h3>Office Cleaning</h3>
                <p className="pricing-card-tagline">Perfect for offices, workspaces, and small businesses.</p>
                <ul className="pricing-card-list">
                  <li>Workstation cleaning</li>
                  <li>Floor vacuuming and mopping</li>
                  <li>Trash disposal</li>
                  <li>Bathroom sanitization</li>
                  <li>Breakroom cleaning</li>
                </ul>
                <p className="pricing-card-price">
                  <span className="price-label">Custom pricing</span>
                  <span className="price-amount">Based on size &amp; frequency</span>
                </p>
                <button className="btn btn-primary pricing-card-cta" onClick={handleBookNow}>
                  Request Quote
                </button>
              </article>
            </div>
          </div>
        </section>

        <section className="section pricing-section pricing-section--specialized">
          <div className="container">
            <div className="pricing-section-header">
              <h2>Specialized Cleaning Services</h2>
              <p>Targeted solutions for carpets, windows, and post-construction projects.</p>
            </div>

            <div className="pricing-grid pricing-grid--compact">
              <article className="pricing-card">
                <h3>Carpet Cleaning</h3>
                <p className="pricing-card-tagline">Remove deep stains, odors, and allergens.</p>
                <button className="btn btn-primary pricing-card-cta" onClick={handleBookNow}>
                  Book Carpet Cleaning
                </button>
              </article>

              <article className="pricing-card">
                <h3>Window Cleaning</h3>
                <p className="pricing-card-tagline">Interior and exterior window cleaning.</p>
                <button className="btn btn-primary pricing-card-cta" onClick={handleBookNow}>
                  Book Window Cleaning
                </button>
              </article>

              <article className="pricing-card">
                <h3>Post-Construction Cleaning</h3>
                <p className="pricing-card-tagline">Perfect for newly built or renovated properties.</p>
                <ul className="pricing-card-list">
                  <li>Dust removal</li>
                  <li>Surface cleaning</li>
                  <li>Floor cleaning</li>
                  <li>Window polishing</li>
                </ul>
                <p className="pricing-card-price">
                  <span className="price-label">Custom pricing</span>
                  <span className="price-amount">Based on project scope</span>
                </p>
                <button className="btn btn-primary pricing-card-cta" onClick={handleBookNow}>
                  Request Quote
                </button>
              </article>
            </div>
          </div>
        </section>

        <section className="section pricing-section pricing-discounts">
          <div className="container">
            <div className="pricing-section-header">
              <h2>Cleaning Frequency Discounts</h2>
              <p>Save more with recurring cleaning services.</p>
            </div>
            <div className="pricing-discounts-grid">
              <div className="discount-card">
                <h3>Weekly Cleaning</h3>
                <p className="discount-rate">10% Discount</p>
              </div>
              <div className="discount-card">
                <h3>Bi-Weekly Cleaning</h3>
                <p className="discount-rate">7% Discount</p>
              </div>
              <div className="discount-card">
                <h3>Monthly Cleaning</h3>
                <p className="discount-rate">5% Discount</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section pricing-section pricing-trust">
          <div className="container">
            <div className="pricing-section-header">
              <h2>Why Clients Choose Our Pricing</h2>
            </div>
            <ul className="pricing-trust-list">
              <li>✔ No hidden fees</li>
              <li>✔ Flexible packages</li>
              <li>✔ Custom cleaning plans</li>
              <li>✔ Free estimates</li>
              <li>✔ Clear scope before service</li>
            </ul>
            <div className="pricing-hero-actions pricing-trust-actions">
              <button className="btn btn-primary" onClick={handleBookNow}>
                Get a Free Quote
              </button>
              <button className="btn btn-outline" onClick={handleCall}>
                Call us: {PHONE_DISPLAY}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PricingPage;

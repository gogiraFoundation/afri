import { useEffect } from 'react';
import './PricingPage.css';

const PricingPage = () => {
  useEffect(() => {
    document.title = 'Affordable Cleaning Services Pricing | Residential & Commercial Cleaning | Afri Cleans';
  }, []);

  const handleBookNow = () => {
    window.location.href = '/#booking';
  };

  const handleCall = () => {
    window.location.href = 'tel:+01287059897';
  };

  return (
    <div className="pricing-page">
      <header className="pricing-hero section">
        <div className="container pricing-hero-container">
          <div className="pricing-hero-content">
            <span className="section-title">Pricing</span>
            <h1>Transparent Pricing for Professional Cleaning Services</h1>
            <p>
              At <strong>Afri Cleans</strong>, we believe professional cleaning should be{' '}
              <strong>simple, affordable, and transparent</strong>. Our pricing is designed to give you{' '}
              <strong>high-quality cleaning services at competitive rates</strong>, with flexible options tailored to your
              needs.
            </p>
            <p>
              Whether you need <strong>a one-time deep clean, weekly home cleaning, or commercial cleaning services</strong>,
              we have a package that works for you.
            </p>
            <div className="pricing-hero-actions">
              <button className="btn btn-primary" onClick={handleBookNow}>
                Book Your Cleaning Today →
              </button>
              <button className="btn btn-outline" onClick={handleCall}>
                Call for a Free Estimate: (+012) 87059897
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section pricing-section">
          <div className="container">
            <div className="pricing-section-header">
              <h2>Residential Cleaning Pricing</h2>
              <p>Perfect for homeowners, families, and apartments.</p>
            </div>

            <div className="pricing-grid">
              <article className="pricing-card">
                <h3>Basic Cleaning</h3>
                <p className="pricing-card-tagline">Ideal for regular maintenance cleaning.</p>
                <ul className="pricing-card-list">
                  <li>Dusting surfaces</li>
                  <li>Vacuuming floors and carpets</li>
                  <li>Mopping floors</li>
                  <li>Kitchen cleaning</li>
                  <li>Bathroom cleaning</li>
                </ul>
                <p className="pricing-card-price">
                  <span className="price-label">Starting from</span>
                  <span className="price-amount">$80</span>
                </p>
                <button className="btn btn-primary pricing-card-cta" onClick={handleBookNow}>
                  Book Basic Cleaning
                </button>
              </article>

              <article className="pricing-card pricing-card-featured">
                <div className="pricing-card-badge">Most Popular</div>
                <h3>Standard Cleaning</h3>
                <p className="pricing-card-tagline">Recommended for homes needing a more thorough clean.</p>
                <ul className="pricing-card-list">
                  <li>Everything in Basic Cleaning</li>
                  <li>Appliance exterior cleaning</li>
                  <li>Interior window cleaning</li>
                  <li>Furniture wiping</li>
                  <li>Trash removal</li>
                </ul>
                <p className="pricing-card-price">
                  <span className="price-label">Starting from</span>
                  <span className="price-amount">$120</span>
                </p>
                <button className="btn btn-primary pricing-card-cta" onClick={handleBookNow}>
                  Book Standard Cleaning
                </button>
              </article>

              <article className="pricing-card">
                <h3>Deep Cleaning</h3>
                <p className="pricing-card-tagline">Best for seasonal cleaning or first-time service.</p>
                <ul className="pricing-card-list">
                  <li>Everything in Standard Cleaning</li>
                  <li>Baseboard cleaning</li>
                  <li>Detailed bathroom scrubbing</li>
                  <li>Deep kitchen degreasing</li>
                  <li>Hard-to-reach areas</li>
                  <li>Inside cabinets (optional)</li>
                </ul>
                <p className="pricing-card-price">
                  <span className="price-label">Starting from</span>
                  <span className="price-amount">$180</span>
                </p>
                <button className="btn btn-primary pricing-card-cta" onClick={handleBookNow}>
                  Book Deep Cleaning
                </button>
              </article>
            </div>
          </div>
        </section>

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
                  Request Custom Office Quote
                </button>
              </article>
            </div>
          </div>
        </section>

        <section className="section pricing-section">
          <div className="container">
            <div className="pricing-section-header">
              <h2>Specialized Cleaning Services</h2>
              <p>Targeted solutions for carpets, windows, and post-construction projects.</p>
            </div>

            <div className="pricing-grid">
              <article className="pricing-card">
                <h3>Carpet Cleaning</h3>
                <p className="pricing-card-tagline">Remove deep stains, odors, and allergens.</p>
                <p className="pricing-card-price">
                  <span className="price-label">Starting from</span>
                  <span className="price-amount">$60 per room</span>
                </p>
                <button className="btn btn-primary pricing-card-cta" onClick={handleBookNow}>
                  Book Carpet Cleaning
                </button>
              </article>

              <article className="pricing-card">
                <h3>Window Cleaning</h3>
                <p className="pricing-card-tagline">Interior and exterior window cleaning.</p>
                <p className="pricing-card-price">
                  <span className="price-label">Starting from</span>
                  <span className="price-amount">$10 per window</span>
                </p>
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
                  Request Post-Construction Quote
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
              <h2>Why Our Clients Love Our Pricing</h2>
            </div>
            <ul className="pricing-trust-list">
              <li>✔ No hidden fees</li>
              <li>✔ Flexible packages</li>
              <li>✔ Custom cleaning plans</li>
              <li>✔ Free estimates</li>
              <li>✔ Satisfaction guaranteed</li>
            </ul>
            <div className="pricing-hero-actions pricing-trust-actions">
              <button className="btn btn-primary" onClick={handleBookNow}>
                Get Your Free Estimate →
              </button>
              <button className="btn btn-outline" onClick={handleCall}>
                Call Us: (+012) 87059897
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PricingPage;


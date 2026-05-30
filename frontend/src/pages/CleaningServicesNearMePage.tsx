import { useEffect } from 'react';
import { CONTACT_HASH_HREF } from '../config/site';
import './CleaningServicesNearMePage.css';

const CleaningServicesNearMePage = () => {
  useEffect(() => {
    document.title = 'Local Cleaning Services | Afri Cleans';
  }, []);

  const goToBooking = () => {
    window.location.href = CONTACT_HASH_HREF;
  };

  const callNow = () => {
    window.location.href = 'tel:+447412345678';
  };

  const emailNow = () => {
    window.location.href = 'mailto:info@africleans.com';
  };

  return (
    <div className="local-seo-page">
      <header className="section local-seo-hero">
        <div className="container local-seo-hero-container">
          <div className="local-seo-hero-content">
            <span className="section-title">Local Cleaning</span>
            <h1>Professional Cleaning Services Near You</h1>
            <p>
              Looking for reliable local cleaning? Afri Cleans supports residential and commercial
              spaces with clear communication and dependable scheduling.
            </p>
            <div className="local-seo-hero-actions">
              <button className="btn btn-primary" onClick={goToBooking}>
                Get a Free Quote
              </button>
              <button className="btn btn-outline" onClick={callNow}>
                Call: 07412 345678
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="page-content">
        <section className="section local-seo-section">
          <div className="container local-seo-grid">
            <article className="local-seo-card">
              <h2>Your Local Cleaning Experts</h2>
              <p>We specialize in reliable, repeatable cleaning services for homes and businesses, including:</p>
              <ul>
                <li>Residential cleaning</li>
                <li>Office cleaning</li>
                <li>Deep cleaning</li>
                <li>Carpet cleaning</li>
                <li>Window cleaning</li>
                <li>Post-construction cleaning</li>
              </ul>
              <p>
                Whether you need <strong>weekly home cleaning</strong> or ongoing{' '}
                <strong>commercial janitorial services</strong>, our team delivers dependable results every time.
              </p>
            </article>

            <article className="local-seo-card">
              <h2>Why Choose Our Local Cleaning Services?</h2>
              <ul className="local-seo-checklist">
                <li>✔ Clear service plans and transparent pricing</li>
                <li>✔ Trained professionals</li>
                <li>✔ Flexible scheduling</li>
                <li>✔ Responsive support</li>
                <li>✔ Follow-up after service</li>
              </ul>
              <p>
                We focus on long-term relationships with our clients, not one-time jobs. When you search for{' '}
                <strong>&quot;cleaning services near me&quot;</strong>, we want to be the local team you trust.
              </p>
            </article>
          </div>
        </section>

        <section className="section local-seo-section local-seo-areas">
          <div className="container">
            <h2>Areas We Serve</h2>
            <p>
              We proudly provide local cleaning services across a wide range of neighborhoods and business districts,
              including:
            </p>
            <ul className="local-seo-areas-list">
              <li>City areas</li>
              <li>Surrounding neighborhoods</li>
              <li>Residential communities</li>
              <li>Commercial districts</li>
            </ul>
            <p className="local-seo-note">
              Looking for cleaning services in your specific area? Get in touch and we&apos;ll confirm coverage.
            </p>
          </div>
        </section>

        <section className="section local-seo-section local-seo-cta">
          <div className="container local-seo-cta-inner">
            <div className="local-seo-cta-content">
              <h2>Book a Local Cleaning Service Today</h2>
              <p>
                Ready for a cleaner home or business? Our local cleaning team is ready to help with flexible scheduling
                and transparent pricing.
              </p>
              <div className="local-seo-hero-actions">
                <button className="btn btn-primary" onClick={goToBooking}>
                  Get a Free Quote
                </button>
                <button className="btn btn-outline" onClick={callNow}>
                  Call: 07412 345678
                </button>
                <button className="btn btn-outline" onClick={emailNow}>
                  Email: info@africleans.com
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CleaningServicesNearMePage;


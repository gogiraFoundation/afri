import { useEffect } from 'react';
import { CONTACT_HASH_HREF } from '../config/site';
import './GoogleMapsSEOPage.css';

const GoogleMapsSEOPage = () => {
  useEffect(() => {
    document.title = 'Google Maps SEO for Cleaning Services | Afri Cleans';
  }, []);

  const goToBooking = () => {
    window.location.href = CONTACT_HASH_HREF;
  };

  return (
    <div className="google-maps-page">
      <header className="section google-maps-hero">
        <div className="container google-maps-hero-container">
          <div className="google-maps-hero-content">
            <span className="section-title">Google Maps SEO</span>
            <h1>Google Business Profile Strategy for Cleaning Services</h1>
            <p>
              This guide explains practical steps to keep a cleaning company profile clear,
              discoverable, and trustworthy on Google Maps.
            </p>
            <div className="google-maps-hero-actions">
              <button className="btn btn-primary" onClick={goToBooking}>
                Get a Free Quote
              </button>
              <a
                href="https://business.google.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
              >
                Open Google Business Profile
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="page-content">
        <section className="section google-maps-section">
          <div className="container google-maps-grid">
            <article className="google-maps-card">
              <h2>Step 1: Create Your Google Business Profile</h2>
              <p>
                Visit <strong>business.google.com</strong> and create or claim your Google Business Profile for Afri
                Cleans.
              </p>
              <h3>Business details to add</h3>
              <ul>
                <li>
                  Business name: <strong>Afri Cleans</strong>
                </li>
                <li>
                  Primary category: <strong>Cleaning Service</strong>
                </li>
                <li>Secondary categories:</li>
                <ul>
                  <li>House Cleaning Service</li>
                  <li>Commercial Cleaning Service</li>
                  <li>Carpet Cleaning Service</li>
                </ul>
              </ul>
            </article>

            <article className="google-maps-card">
              <h2>Step 2: Optimize Your Profile</h2>
              <p>
                Add an SEO-optimized business description that clearly explains your services, locations, and
                specialties.
              </p>
              <p className="google-maps-quote">
                Afri Cleans provides professional residential and commercial cleaning services including deep cleaning,
                carpet cleaning, office cleaning, and eco-friendly cleaning solutions. Our experienced cleaning team
                delivers reliable, high-quality cleaning services designed to create healthier and more comfortable
                environments.
              </p>
              <p>
                Include <strong>target keywords</strong> like &quot;residential cleaning&quot;, &quot;office cleaning&quot;,
                &quot;deep cleaning&quot;, and your primary service areas.
              </p>
            </article>
          </div>
        </section>

        <section className="section google-maps-section google-maps-alt">
          <div className="container google-maps-grid">
            <article className="google-maps-card">
              <h2>Step 3: Upload High-Quality Photos</h2>
              <p>
                Google ranks profiles with active, high-quality photos higher because they appear more trustworthy and
                relevant to searchers.
              </p>
              <h3>Upload at least 20 photos, including:</h3>
              <ul>
                <li>Team cleaning in homes and offices</li>
                <li>Before / after cleaning results</li>
                <li>Cleaning equipment and products</li>
                <li>Homes cleaned by Afri Cleans</li>
                <li>Offices and commercial spaces cleaned</li>
              </ul>
            </article>

            <article className="google-maps-card">
              <h2>Step 4: Request Reviews After Service</h2>
              <p>
                Reviews are one of the major ranking signals on Google Maps. Focus on collecting
                genuine feedback after successful visits.
              </p>
              <h3>Simple review request script</h3>
              <p className="google-maps-quote">
                &quot;If you enjoyed our cleaning service, we&apos;d really appreciate a quick Google review. It helps
                other homeowners and businesses find Afri Cleans.&quot;
              </p>
              <p>
                Make it part of your cleaning process to ask for reviews after every successful job, and follow up with a
                friendly reminder by SMS or email.
              </p>
            </article>
          </div>
        </section>

        <section className="section google-maps-section">
          <div className="container google-maps-grid">
            <article className="google-maps-card">
              <h2>Step 5: Post Weekly Updates</h2>
              <p>
                Google prefers active businesses. Posting weekly updates signals that your cleaning company is engaged,
                responsive, and open for new clients.
              </p>
              <h3>Post ideas</h3>
              <ul>
                <li>Cleaning tips and how-to posts</li>
                <li>Limited-time promotions and discounts</li>
                <li>Before/after photos from recent cleans</li>
              </ul>
            </article>

            <article className="google-maps-card google-maps-card-highlight">
              <h2>Turn Google Maps Traffic into Cleaning Clients</h2>
              <p>
                When your profile is fully optimized, every search for &quot;cleaning services near me&quot; becomes an
                opportunity to win a new client. Make sure your listing clearly invites people to request a quote or
                schedule a clean.
              </p>
              <p>
                Afri Cleans uses this exact strategy to stay visible to local homeowners, landlords, and businesses
                looking for a trusted cleaning partner.
              </p>
              <button className="btn btn-primary google-maps-card-cta" onClick={goToBooking}>
                Get a Free Quote
              </button>
            </article>
          </div>
        </section>
      </div>
    </div>
  );
};

export default GoogleMapsSEOPage;


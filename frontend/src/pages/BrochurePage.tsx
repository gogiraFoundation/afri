import { useEffect, useMemo } from 'react';
import {
  EMAIL_DISPLAY,
  MAILTO_HREF,
  PHONE_DISPLAY,
  TEL_HREF,
  WHATSAPP_HREF,
  bookingPageAbsoluteUrl,
} from '../config/site';
import {
  BROCHURE_BRAND,
  BROCHURE_FLIER_DOWNLOAD_NAME,
  BROCHURE_FLIER_HREF,
  brochureAbout,
  brochureProcessSteps,
  brochureServices,
  brochureTrustLine,
  brochureWhyItems,
} from '../config/brochure';
import BrandLogo from '../components/BrandLogo';
import './BrochurePage.css';

function websiteDisplayUrl(): string {
  try {
    const u = new URL(bookingPageAbsoluteUrl());
    return u.hostname;
  } catch {
    return 'africleans.com';
  }
}

function websiteHref(): string {
  try {
    const u = new URL(bookingPageAbsoluteUrl());
    return `${u.protocol}//${u.hostname}/`;
  } catch {
    return 'https://africleans.com/';
  }
}

function ContactRows({ siteHost, siteUrl }: { siteHost: string; siteUrl: string }) {
  return (
    <dl className="brochure-contact-rows">
      <div className="brochure-contact-row">
        <dt>Phone</dt>
        <dd>
          <a href={TEL_HREF}>{PHONE_DISPLAY}</a>
        </dd>
      </div>
      <div className="brochure-contact-row">
        <dt>WhatsApp</dt>
        <dd>
          <a href={WHATSAPP_HREF}>{PHONE_DISPLAY}</a>
        </dd>
      </div>
      <div className="brochure-contact-row">
        <dt>Email</dt>
        <dd>
          <a href={MAILTO_HREF}>{EMAIL_DISPLAY}</a>
        </dd>
      </div>
      <div className="brochure-contact-row">
        <dt>Website</dt>
        <dd>
          <a href={siteUrl}>{siteHost}</a>
        </dd>
      </div>
    </dl>
  );
}

const BrochurePage = () => {
  const siteHost = useMemo(() => websiteDisplayUrl(), []);
  const siteUrl = useMemo(() => websiteHref(), []);

  useEffect(() => {
    document.title = `${BROCHURE_BRAND} — Service brochure`;
  }, []);

  return (
    <div className="brochure-root">
      <div className="brochure-screen-bar">
        <button type="button" className="brochure-screen-back" onClick={() => (window.location.href = '/')}>
          Back to website
        </button>
        <a
          href={BROCHURE_FLIER_HREF}
          download={BROCHURE_FLIER_DOWNLOAD_NAME}
          className="brochure-screen-download"
        >
          Download brochure
        </a>
      </div>

      <article className="brochure-sheet" aria-label={`${BROCHURE_BRAND} service brochure`}>
        <header className="brochure-hero">
          <div className="brochure-hero-inner">
            <BrandLogo variant="print" className="brochure-hero-logo" linkToHome={false} />
            <h1 className="brochure-hero-title visually-hidden">{BROCHURE_BRAND}</h1>
            <p className="brochure-hero-tagline">Professional cleaning services</p>
            <p className="brochure-hero-lede">
              Reliable residential and commercial cleaning you can trust.
            </p>
            <p className="brochure-hero-cta-wrap">
              <a
                className="brochure-btn brochure-btn-primary"
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp for a quote
              </a>
              <a className="brochure-btn brochure-btn-secondary" href={TEL_HREF}>
                Call {PHONE_DISPLAY}
              </a>
            </p>
            <p className="brochure-hero-subtle">Message us on WhatsApp for a no-obligation quote.</p>
            <div className="brochure-contact-minimal">
              <ContactRows siteHost={siteHost} siteUrl={siteUrl} />
            </div>
          </div>
        </header>

        <section className="brochure-section" aria-labelledby="brochure-about-heading">
          <h2 id="brochure-about-heading" className="brochure-section-title">
            {brochureAbout.heading}
          </h2>
          {brochureAbout.paragraphs.map((p) => (
            <p key={p} className="brochure-lede">
              {p}
            </p>
          ))}
          <p className="brochure-trust-line">{brochureTrustLine}</p>
        </section>

        <section
          className="brochure-section brochure-section--surface-tint"
          aria-labelledby="brochure-services-heading"
        >
          <h2 id="brochure-services-heading" className="brochure-section-title">
            Our services
          </h2>

          <ul className="brochure-services-grid">
            {brochureServices.map((s) => (
              <li key={s.title} className="brochure-service-card">
                <span className="brochure-service-card-icon" aria-hidden>
                  {s.icon}
                </span>
                <h3 className="brochure-service-card-title">{s.title}</h3>
                <p className="brochure-service-card-desc">{s.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="brochure-section" aria-labelledby="brochure-why-heading">
          <h2 id="brochure-why-heading" className="brochure-section-title">
            Why clients choose {BROCHURE_BRAND}
          </h2>
          <ul className="brochure-feature-list">
            {brochureWhyItems.map((item) => (
              <li key={item.title} className="brochure-feature-item">
                <h3 className="brochure-feature-title">{item.title}</h3>
                <p className="brochure-feature-body">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="brochure-section" aria-labelledby="brochure-process-heading">
          <h2 id="brochure-process-heading" className="brochure-section-title">
            How it works
          </h2>
          <div className="brochure-process-wrap">
            <ol className="brochure-process">
              {brochureProcessSteps.map((step, i) => (
                <li key={step.title} className="brochure-process-step">
                  <span className="brochure-process-num" aria-hidden>
                    {i + 1}
                  </span>
                  <div className="brochure-process-body">
                    <h3 className="brochure-process-title">{step.title}</h3>
                    <p className="brochure-process-text">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="brochure-cta-panel brochure-cta-panel--dark" aria-labelledby="brochure-cta-heading">
          <h2 id="brochure-cta-heading" className="brochure-cta-title">
            Ready for a quote?
          </h2>
          <p className="brochure-cta-note">No payment required upfront.</p>
          <p className="brochure-cta-actions">
            <a
              className="brochure-btn brochure-btn-cta brochure-btn-lg"
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
            >
              Message us on WhatsApp
            </a>
            <a className="brochure-btn brochure-btn-lg" href={TEL_HREF}>
              Call {PHONE_DISPLAY}
            </a>
          </p>
          <p className="brochure-cta-micro">Fast responses via phone or WhatsApp.</p>
        </section>

        <footer className="brochure-footer brochure-footer--compact">
          <p className="brochure-footer-line">
            <strong>{BROCHURE_BRAND}</strong>
            <span className="brochure-footer-dot" aria-hidden>
              {' '}
              ·{' '}
            </span>
            <a href={TEL_HREF}>{PHONE_DISPLAY}</a>
            <span className="brochure-footer-dot" aria-hidden>
              {' '}
              ·{' '}
            </span>
            <a href={WHATSAPP_HREF}>WhatsApp</a>
            <span className="brochure-footer-dot" aria-hidden>
              {' '}
              ·{' '}
            </span>
            <a href={MAILTO_HREF}>{EMAIL_DISPLAY}</a>
            <span className="brochure-footer-dot" aria-hidden>
              {' '}
              ·{' '}
            </span>
            <a href={siteUrl}>{siteHost}</a>
          </p>
          <p className="brochure-footer-copy">&copy; 2026 {BROCHURE_BRAND}</p>
        </footer>
      </article>
    </div>
  );
};

export default BrochurePage;

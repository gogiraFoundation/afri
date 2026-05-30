import { useEffect } from 'react';
import { CONTACT_HASH_HREF } from '../config/site';
import './ServicesPage.css';

const visitTypeCards = [
  {
    title: 'Weekly or recurring',
    body: 'Keeps kitchens, washrooms, and floors consistently fresh — ideal for homes and busy offices.',
  },
  {
    title: 'Deep cleaning',
    body: 'More time on buildup and detail; same Eco-Clean checklist, with extra attention where grime collects.',
  },
  {
    title: 'Move-out / end of tenancy',
    body: 'Handover-ready finish for landlords and tenants — thorough pass on the same scope, scheduled for your deadline.',
  },
];

const ecoCleanInclusions = [
  'Dusting all surfaces with microfibre cloths (no paper towels)',
  'Vacuuming & steam mopping with HEPA-filtered machines',
  'Kitchen wipe-down, hob degreasing, and worktop sanitising',
  'Bathroom scrub, mirror and chrome polishing',
  'Rubbish removal and recycling neatness',
];

const ServicesPage = () => {
  useEffect(() => {
    document.title = 'Cleaning Services | Afri Cleans';
  }, []);

  const goToBooking = () => {
    window.location.href = CONTACT_HASH_HREF;
  };

  const callNow = () => {
    window.location.href = 'tel:+447412345678';
  };

  return (
    <div className="services-page">
      <header className="section services-page-hero">
        <div className="container services-page-hero-container">
          <div className="services-page-hero-content">
            <span className="section-title">Cleaning Services</span>
            <h1>Residential &amp; office Eco-Clean</h1>
            <p>
              Homes and workplaces only — weekly visits, deep cleans, or move-out readiness. One clear standard every
              time, not a menu of unrelated trades.
            </p>
            <div className="services-page-hero-actions">
              <button className="btn btn-primary" type="button" onClick={goToBooking}>
                Get a Free Quote
              </button>
              <button className="btn btn-outline" type="button" onClick={callNow}>
                Call Us: 07412 345678
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="page-content">
        <section className="section services-page-section">
          <div className="container services-page-grid">
            <article className="services-page-card">
              <h2>Residential cleaning</h2>
              <p>
                Apartments and houses — the same Eco-Clean scope whether you book weekly upkeep, a reset deep clean, or
                an end-of-tenancy handover.
              </p>
              <h3>Visit types</h3>
              <ul>
                <li>Weekly or recurring</li>
                <li>Deep cleaning</li>
                <li>Move-out / end of tenancy</li>
              </ul>
              <h3>Well suited to</h3>
              <ul>
                <li>Busy families and professionals</li>
                <li>Lettings and tenancy changeovers</li>
              </ul>
              <button className="btn btn-primary services-page-card-cta" type="button" onClick={goToBooking}>
                Book residential cleaning
              </button>
            </article>

            <article className="services-page-card">
              <h2>Office cleaning</h2>
              <p>
                Workstations, meeting rooms, kitchens, and washrooms — dependable rounds that keep shared spaces
                pleasant for staff and visitors.
              </p>
              <h3>Visit types</h3>
              <ul>
                <li>Weekly or recurring</li>
                <li>Deep cleaning</li>
                <li>Move-out / end of tenancy</li>
              </ul>
              <h3>Well suited to</h3>
              <ul>
                <li>Small and medium offices</li>
                <li>Hybrid teams needing consistent hygiene</li>
              </ul>
              <button className="btn btn-primary services-page-card-cta" type="button" onClick={goToBooking}>
                Book office cleaning
              </button>
            </article>
          </div>
        </section>

        <section id="visit-types" className="section services-page-section services-page-alt">
          <div className="container">
            <h2 className="services-page-visit-types-heading">How visit types differ</h2>
            <p className="services-page-visit-types-intro">
              Intensity and time on site change — the checklist below is what you can expect on every Afri Cleans visit.
            </p>
            <div className="services-page-visit-types-grid">
              {visitTypeCards.map((card) => (
                <article key={card.title} className="services-page-visit-type-card">
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section services-page-section">
          <div className="container services-page-inclusions">
            <h2>What&apos;s included in every Eco-Clean</h2>
            <p className="services-page-inclusions-lead">
              We don&apos;t sell &quot;eco&quot; as a separate product line — careful methods and equipment are how every
              job is done.
            </p>
            <ul className="services-page-inclusions-list">
              {ecoCleanInclusions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="services-page-inclusions-actions">
              <button className="btn btn-primary" type="button" onClick={goToBooking}>
                Get a Free Quote
              </button>
              <button className="btn btn-outline" type="button" onClick={callNow}>
                Talk to our team
              </button>
            </div>
          </div>
        </section>

        <section className="section services-page-section services-page-eco">
          <div className="container services-page-eco-inner">
            <div className="services-page-eco-content">
              <h2>One standard for every booking</h2>
              <p>
                Whether you choose residential or office, weekly or deep, your space receives the same Eco-Clean
                attention to detail — microfibre dusting, HEPA vacuuming and steam mopping, and careful kitchen and
                bathroom work.
              </p>
              <p>Have specific timing or access needs? Tell us when you book and we&apos;ll plan around them.</p>
              <div className="services-page-hero-actions">
                <button className="btn btn-primary" type="button" onClick={goToBooking}>
                  Start a booking
                </button>
                <button className="btn btn-outline" type="button" onClick={callNow}>
                  Call 07412 345678
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;

import { scrollToContact } from '../config/site';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import residentialImg from '../assets/sofa-upholstery-cleaning.png';
import officeImg from '../assets/hotel-corridor-cleaning.png';
import './Services.css';

const visitTypes = ['Weekly or recurring visits', 'Deep cleaning', 'Move-out / end of tenancy'];

const ecoCleanInclusions = [
  'Dusting all surfaces with microfibre cloths (no paper towels)',
  'Vacuuming & steam mopping with HEPA-filtered machines',
  'Kitchen wipe-down, hob degreasing, and worktop sanitising',
  'Bathroom scrub, mirror and chrome polishing',
  'Rubbish removal and recycling neatness',
];

const Services = () => {
  const scrollToBooking = () => {
    scrollToContact();
  };

  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="services" ref={ref} className={`section services-section ${isVisible ? 'animate-in' : ''}`}>
      <div className="container">
        <div className="services-header">
          <span className="section-title">SERVICES</span>
          <h2>Residential &amp; office cleaning</h2>
          <p className="services-description">
            The same Eco-Clean standard for homes and workplaces — scheduled the way you need it: weekly upkeep,
            a full deep clean, or move-out readiness.
          </p>
        </div>

        <div className="services-grid">
          <article className="service-card">
            <div className="service-image">
              <img src={residentialImg} alt="Living space after cleaning" className="service-image-img" />
            </div>
            <div className="service-content">
              <h3 className="service-title">Residential</h3>
              <p className="service-description">
                Apartments and houses — consistent care for busy households and tenancies.
              </p>
              <p className="service-subheading">Visit types</p>
              <ul className="service-visit-list">
                {visitTypes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href="/services#visit-types" className="service-link">
                How we work →
              </a>
            </div>
          </article>

          <article className="service-card">
            <div className="service-image">
              <img src={officeImg} alt="Office corridor after cleaning" className="service-image-img" />
            </div>
            <div className="service-content">
              <h3 className="service-title">Office</h3>
              <p className="service-description">
                Desks, kitchens, washrooms, and shared areas — reliable rounds that keep teams comfortable.
              </p>
              <p className="service-subheading">Visit types</p>
              <ul className="service-visit-list">
                {visitTypes.map((item) => (
                  <li key={`office-${item}`}>{item}</li>
                ))}
              </ul>
              <a href="/services#visit-types" className="service-link">
                How we work →
              </a>
            </div>
          </article>
        </div>

        <div className="services-list-wrapper services-inclusions-wrapper">
          <h3 className="services-list-title">What&apos;s included in every Eco-Clean</h3>
          <p className="services-inclusions-lead">
            Every visit follows the same careful scope — we don&apos;t treat &quot;eco&quot; as a separate add-on.
          </p>
          <ul className="services-inclusions-list">
            {ecoCleanInclusions.map((item) => (
              <li key={item} className="services-inclusions-item">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="services-footer">
          <button type="button" className="btn btn-primary" onClick={scrollToBooking}>
            Get a Free Quote
          </button>
          <button
            type="button"
            className="btn btn-outline services-footer-secondary"
            onClick={() => {
              window.location.href = '/services';
            }}
          >
            View Services
          </button>
          <button
            type="button"
            className="btn btn-outline services-footer-secondary"
            onClick={() => {
              window.location.href = '/pricing';
            }}
          >
            See pricing
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;

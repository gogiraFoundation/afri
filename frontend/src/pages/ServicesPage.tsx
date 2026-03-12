import { useEffect } from 'react';
import './ServicesPage.css';

const ServicesPage = () => {
  useEffect(() => {
    document.title = 'Professional Cleaning Services | Residential & Commercial Cleaning | Afri Cleans';
  }, []);

  const goToBooking = () => {
    window.location.href = '/#booking';
  };

  const callNow = () => {
    window.location.href = 'tel:+01287059897';
  };

  return (
    <div className="services-page">
      <header className="section services-page-hero">
        <div className="container services-page-hero-container">
          <div className="services-page-hero-content">
            <span className="section-title">Cleaning Services</span>
            <h1>Professional Cleaning Services You Can Trust</h1>
            <p>
              At <strong>Afri Cleans</strong>, we offer a complete range of{' '}
              <strong>professional cleaning services</strong> designed to keep your home or business spotless,
              hygienic, and welcoming. Our trained cleaning specialists use modern equipment and safe cleaning
              products to deliver exceptional results.
            </p>
            <div className="services-page-hero-actions">
              <button className="btn btn-primary" onClick={goToBooking}>
                Book Your Cleaning Today →
              </button>
              <button className="btn btn-outline" onClick={callNow}>
                Call Us: (+012) 87059897
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section services-page-section">
          <div className="container services-page-grid">
            <article className="services-page-card">
              <h2>Residential Cleaning Services</h2>
              <p>
                A clean home promotes comfort, relaxation, and better health. Our residential cleaning services are
                tailored to fit your lifestyle, schedule, and space.
              </p>
              <h3>What&apos;s included</h3>
              <ul>
                <li>Bedroom cleaning</li>
                <li>Kitchen sanitation</li>
                <li>Bathroom disinfection</li>
                <li>Living room dusting</li>
                <li>Floor vacuuming and mopping</li>
              </ul>
              <h3>Perfect for</h3>
              <ul>
                <li>Busy families</li>
                <li>Professionals</li>
                <li>Apartment residents</li>
              </ul>
              <button className="btn btn-primary services-page-card-cta" onClick={goToBooking}>
                Book Residential Cleaning
              </button>
            </article>

            <article className="services-page-card">
              <h2>Commercial Cleaning Services</h2>
              <p>
                A clean workplace improves productivity and creates a positive impression on clients. We keep your
                business environment spotless, safe, and professional.
              </p>
              <h3>Ideal for</h3>
              <ul>
                <li>Offices</li>
                <li>Corporate spaces</li>
                <li>Retail stores</li>
                <li>Restaurants</li>
                <li>Business buildings</li>
              </ul>
              <button className="btn btn-primary services-page-card-cta" onClick={goToBooking}>
                Get a Commercial Quote
              </button>
            </article>
          </div>
        </section>

        <section className="section services-page-section services-page-alt">
          <div className="container services-page-grid">
            <article className="services-page-card">
              <h2>Deep Cleaning Services</h2>
              <p>
                Deep cleaning targets hidden dirt and bacteria that regular cleaning can miss, giving your space a
                complete reset.
              </p>
              <h3>Includes</h3>
              <ul>
                <li>Kitchen degreasing</li>
                <li>Bathroom deep scrubbing</li>
                <li>Baseboard cleaning</li>
                <li>Hard-to-reach areas</li>
              </ul>
              <p className="services-page-note">
                Recommended every <strong>3–6 months</strong> or before/after events and seasonal changes.
              </p>
              <button className="btn btn-primary services-page-card-cta" onClick={goToBooking}>
                Schedule a Deep Clean
              </button>
            </article>

            <article className="services-page-card">
              <h2>Carpet Cleaning Services</h2>
              <p>
                Our professional carpet cleaning removes deep-down dirt and buildup to refresh and protect your carpets.
              </p>
              <h3>We help remove</h3>
              <ul>
                <li>Dirt and allergens</li>
                <li>Stains and odors</li>
                <li>Dust mites</li>
                <li>Bacteria</li>
              </ul>
              <p className="services-page-note">
                Restore the freshness, softness, and beauty of your carpets with professional care.
              </p>
              <button className="btn btn-primary services-page-card-cta" onClick={goToBooking}>
                Book Carpet Cleaning
              </button>
            </article>
          </div>
        </section>

        <section className="section services-page-section">
          <div className="container services-page-grid">
            <article className="services-page-card">
              <h2>Window Cleaning Services</h2>
              <p>
                We deliver streak-free window cleaning that improves natural light and elevates the overall look of
                your property.
              </p>
              <h3>Includes</h3>
              <ul>
                <li>Interior window cleaning</li>
                <li>Exterior window cleaning</li>
                <li>Frame and sill cleaning</li>
              </ul>
              <button className="btn btn-primary services-page-card-cta" onClick={goToBooking}>
                Book Window Cleaning
              </button>
            </article>

            <article className="services-page-card">
              <h2>Post-Construction Cleaning</h2>
              <p>
                After renovation or construction, our cleaning team removes dust and debris so your space is truly
                move-in ready.
              </p>
              <h3>Perfect when</h3>
              <ul>
                <li>You&apos;ve just completed renovations</li>
                <li>You&apos;re preparing a property for handover</li>
                <li>You want a dust-free, guest-ready finish</li>
              </ul>
              <button className="btn btn-primary services-page-card-cta" onClick={goToBooking}>
                Request Post-Construction Cleaning
              </button>
            </article>
          </div>
        </section>

        <section className="section services-page-section services-page-eco">
          <div className="container services-page-eco-inner">
            <div className="services-page-eco-content">
              <h2>Eco-Friendly Cleaning Options</h2>
              <p>
                We also offer <strong>eco-friendly cleaning solutions</strong> using safe, biodegradable products that
                protect your health and the environment.
              </p>
              <p>
                Choose green cleaning for families with children, pets, or allergies, or for workplaces that prioritize
                sustainability.
              </p>
              <div className="services-page-hero-actions">
                <button className="btn btn-primary" onClick={goToBooking}>
                  Book Eco-Friendly Cleaning
                </button>
                <button className="btn btn-outline" onClick={callNow}>
                  Talk to Our Team
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ServicesPage;


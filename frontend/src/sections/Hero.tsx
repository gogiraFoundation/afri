import './Hero.css';
import heroFloorCleaning from '../assets/hero-floor-cleaning.png';

const Hero = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById('services');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-headline">
            Professional Cleaning Services for a{' '}
            <span className="hero-highlight">Healthier, Happier Space</span>.
          </h1>
          <p className="hero-subheadline">
            Experience spotless residential and commercial cleaning services that keep your spaces
            fresh, hygienic, and beautifully maintained. From routine cleans to deep cleaning and
            carpets, Afri Cleans helps create a cleaner space and a healthier lifestyle for you.
          </p>
          <p className="hero-services-inline">
            Residential cleaning • Commercial cleaning • Carpet cleaning • Window cleaning • Deep
            cleaning • Post-construction cleaning
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary hero-cta-primary" onClick={scrollToBooking}>
              Book Your Cleaning Today →
            </button>
            <button className="btn btn-secondary hero-cta-secondary" onClick={scrollToServices}>
              View Cleaning Services
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-placeholder">
            <img
              src={heroFloorCleaning}
              alt="Professional cleaner scrubbing a soapy floor"
              className="hero-image-img"
            />
          </div>
        </div>
      </div>
      <div className="hero-wave"></div>
    </section>
  );
};

export default Hero;


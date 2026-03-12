import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './AboutUs.css';

const AboutUs = () => {
  const { ref, isVisible } = useScrollAnimation();
  const features = [
    {
      icon: '⭐',
      title: 'Experienced & Trained Cleaners',
      description: 'Seasoned cleaning specialists dedicated to delivering consistently high-quality results.',
    },
    {
      icon: '🌿',
      title: 'Eco-Friendly Cleaning Products',
      description: 'Safe, eco-conscious products that protect your family, staff, and the environment.',
    },
    {
      icon: '✨',
      title: 'Reliable & Punctual Service',
      description: 'Flexible scheduling and on-time arrivals so cleaning fits seamlessly into your day.',
    },
    {
      icon: '📋',
      title: 'Customized Cleaning Plans',
      description: 'Tailored cleaning solutions for modern homes, offices, and commercial spaces.',
    },
    {
      icon: '✅',
      title: 'Satisfaction Guaranteed',
      description: 'We stand behind our work and aim to exceed your expectations on every visit.',
    },
  ];

  return (
    <section id="about" ref={ref as React.RefObject<HTMLElement>} className={`section about-section ${isVisible ? 'animate-in' : ''}`}>
      <div className="container">
        <div className="about-header">
          <span className="section-title">ABOUT US</span>
          <h2>Your Trusted Professional Cleaning Company</h2>
          <p className="about-description">
            At Afri Cleans, we believe that a clean space creates a better quality of life. Our
            trained cleaning specialists provide top-quality residential and commercial cleaning
            services designed for modern homes and businesses. Using advanced techniques, professional
            equipment, and eco-friendly products, we thoroughly clean and sanitize every corner to
            improve comfort, hygiene, and well-being.
          </p>
        </div>

        <div className="about-features">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="about-badge">
          <div className="badge-content">
            <span className="badge-number">20+</span>
            <span className="badge-text">Years of cleaning experience</span>
          </div>
          <a href="#" className="badge-link">
            Read more →
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;


import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './AboutUs.css';

const AboutUs = () => {
  const { ref, isVisible } = useScrollAnimation();
  const features = [
    {
      icon: '🧭',
      title: 'Dependable from day one',
      description: 'As a growing company, we focus on punctuality, careful work, and consistent follow-through.',
    },
    {
      icon: '🌿',
      title: 'Eco-conscious options',
      description: 'We can use eco-conscious products when requested for homes, teams, and shared spaces.',
    },
    {
      icon: '🧼',
      title: 'Tailored service scope',
      description: 'Routine cleaning and one-time deep cleans are planned around your priorities and schedule.',
    },
    {
      icon: '📋',
      title: 'Responsive support',
      description: 'Clear communication before, during, and after service so expectations stay aligned.',
    },
  ];

  return (
    <section id="about" ref={ref as React.RefObject<HTMLElement>} className={`section about-section ${isVisible ? 'animate-in' : ''}`}>
      <div className="container">
        <div className="about-header">
          <span className="section-title">ABOUT AFRI CLEANS</span>
          <h2>A New Standard of Clean, Built on Consistency</h2>
          <p className="about-description">
            Afri Cleans is a modern cleaning company focused on dependable, high-quality service for
            residential and commercial spaces. As a growing business, we know trust is earned visit
            by visit. That is why we prioritize punctuality, careful work, and responsive customer
            support. Whether you need routine cleaning or a one-time deep clean, we tailor each
            service to your space, priorities, and schedule.
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

      </div>
    </section>
  );
};

export default AboutUs;


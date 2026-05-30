import { CONTACT_HASH_HREF } from '../config/site';

const Testimonials = () => {
  const trustPoints = [
    'Responsive communication from quote request to follow-up.',
    'Clear scope and expectations before each visit.',
    'Attention to detail for both one-time and recurring clients.',
  ];

  return (
    <section id="testimonials" className="section testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <span className="section-title">SOCIAL PROOF</span>
          <h2>Building Trust with Every Visit</h2>
          <p className="testimonials-description">
            We are currently onboarding new recurring and one-time clients. If you are looking for
            a responsive cleaning partner that values quality and communication, we would love to
            work with you.
          </p>
        </div>

        <div className="testimonials-grid">
          {trustPoints.map((item, index) => (
            <div key={index} className="testimonial-card">
              <p className="testimonial-quote">{item}</p>
            </div>
          ))}
        </div>
        <div className="testimonials-actions">
          <a href={CONTACT_HASH_HREF} className="testimonials-link-cta">
            Get a Free Quote
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;


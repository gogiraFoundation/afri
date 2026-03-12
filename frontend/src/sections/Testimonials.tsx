import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      quote:
        'Afri Cleans transformed our home. The team was professional, punctual, and extremely thorough.',
      author: 'Residential Client',
    },
    {
      quote:
        'Our office has never looked better. Highly recommended for commercial cleaning.',
      author: 'Business Owner',
    },
    {
      quote: 'Reliable, affordable, and very professional.',
      author: 'Happy Customer',
    },
  ];

  return (
    <section id="testimonials" className="section testimonials-section">
      <div className="container">
        <div className="testimonials-header">
          <span className="section-title">CUSTOMER TESTIMONIALS</span>
          <h2>What Our Clients Say</h2>
          <p className="testimonials-description">
            Trusted by homeowners and businesses alike, Afri Cleans delivers consistent, high-quality
            cleaning services with a personal touch.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((item, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-rating">★★★★★</div>
              <p className="testimonial-quote">“{item.quote}”</p>
              <p className="testimonial-author">{item.author}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;


import { useEffect, useState } from 'react';
import './Hero.css';
import heroFloorCleaning from '../assets/hero-floor-cleaning.png';

const Hero = () => {
  const trustHighlights = [
    'Background-checked team',
    'Eco-conscious products available',
    'Flexible scheduling',
    'Quality-check follow-up',
  ];
  const [activeTrustIndex, setActiveTrustIndex] = useState(0);

  useEffect(() => {
    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const intervalId = window.setInterval(() => {
      setActiveTrustIndex((prev) => (prev + 1) % trustHighlights.length);
    }, 2600);

    return () => window.clearInterval(intervalId);
  }, [trustHighlights.length]);

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
          <h1 className="hero-headline">Professional Cleaning, Delivered with Care</h1>
          <p className="hero-subheadline">
            Afri Cleans helps homes and businesses stay fresh, healthy, and ready for what matters
            most. Reliable service, clear communication, and attention to detail from day one.
          </p>
          <div className="hero-cta">
            <button className="btn btn-primary hero-cta-primary" onClick={scrollToBooking}>
              Get a Free Quote
            </button>
            <button className="btn btn-secondary hero-cta-secondary" onClick={scrollToServices}>
              View Services
            </button>
          </div>
          <div className="hero-trust-carousel" aria-label="Trust highlights">
            <div className="hero-trust-track">
              {trustHighlights.map((item, index) => (
                <div
                  key={item}
                  className={`hero-trust-slide ${activeTrustIndex === index ? 'is-active' : ''}`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="hero-trust-dots" aria-hidden>
              {trustHighlights.map((item, index) => (
                <button
                  key={`${item}-dot`}
                  type="button"
                  className={`hero-trust-dot ${activeTrustIndex === index ? 'is-active' : ''}`}
                  onClick={() => setActiveTrustIndex(index)}
                />
              ))}
            </div>
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


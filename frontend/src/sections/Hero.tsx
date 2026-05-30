import { useEffect, useState } from 'react';
import { scrollToContact } from '../config/site';
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
    scrollToContact();
  };

  const goToPricing = () => {
    window.location.href = '/pricing';
  };

  return (
    <section id="hero" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-headline">Afri | Eco-conscious home &amp; office cleaning</h1>
          <p className="hero-subheadline">
            DBS-checked team, plant-based products, and the same Eco-Clean checklist every visit — book in minutes and
            we&apos;ll confirm your slot.
          </p>
          <div className="hero-cta">
            <button type="button" className="btn btn-primary hero-cta-primary" onClick={scrollToBooking}>
              Get a quote
            </button>
            <button type="button" className="btn btn-secondary hero-cta-secondary" onClick={goToPricing}>
              See pricing &amp; packages
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

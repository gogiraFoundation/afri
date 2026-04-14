import { useState, useEffect } from 'react';
import { getServices } from '../api/client';
import type { Service } from '../types/api';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import residentialImg from '../assets/sofa-upholstery-cleaning.png';
import commercialImg from '../assets/hotel-corridor-cleaning.png';
import carpetImg from '../assets/hero-floor-cleaning.png';
import defaultServiceImg from '../assets/lobby-floor-mopping.png';
import './Services.css';

const getServiceImage = (service: Service) => {
  switch (service.slug) {
    case 'residential-cleaning':
      return residentialImg;
    case 'commercial-cleaning':
      return commercialImg;
    case 'carpet-cleaning':
      return carpetImg;
    default:
      return defaultServiceImg;
  }
};

const Services = () => {
  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    if (!el) return;
    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  const { ref, isVisible } = useScrollAnimation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data.filter(s => s.is_active).slice(0, 3));
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to fetch services:', error);
        }
        // Fallback to default services if API fails
        setServices([
          {
            id: 1,
            name: 'Home Cleaning',
            slug: 'residential-cleaning',
            short_description:
              'Routine, deep, and move-in/move-out cleaning for apartments and homes.',
            long_description: '',
            is_active: true,
            display_order: 1,
          },
          {
            id: 2,
            name: 'Office Cleaning',
            slug: 'office-cleaning',
            short_description:
              'Clean, organized workspaces that support staff wellbeing and productivity.',
            long_description: '',
            is_active: true,
            display_order: 2,
          },
          {
            id: 3,
            name: 'Commercial Cleaning',
            slug: 'commercial-cleaning',
            short_description:
              'Flexible cleaning plans for shops, clinics, and shared facilities.',
            long_description: '',
            is_active: true,
            display_order: 3,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const coreServices = [
    'Residential cleaning services',
    'Commercial cleaning services',
    'Carpet cleaning services',
    'Window cleaning services',
    'Deep cleaning services',
    'Post-construction cleaning',
    'Move-in cleaning',
    'Move-out cleaning',
    'Office cleaning',
    'Eco-friendly cleaning options',
  ];

  return (
    <section id="services" ref={ref as React.RefObject<HTMLElement>} className={`section services-section ${isVisible ? 'animate-in' : ''}`}>
      <div className="container">
        <div className="services-header">
          <span className="section-title">SERVICES</span>
          <h2>Cleaning Services Designed Around You</h2>
          <p className="services-description">
            From homes to shared workplaces, we build service plans around your priorities, timing,
            and budget.
          </p>
        </div>

        {loading ? (
          <div className="services-loading">Loading services...</div>
        ) : (
          <div className="services-grid">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-image">
                  <img
                    src={getServiceImage(service)}
                    alt={`${service.name} cleaning service`}
                    className="service-image-img"
                  />
                </div>
                <div className="service-content">
                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-description">{service.short_description}</p>
                  <a href="#" className="service-link">
                    View details →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="services-list-wrapper">
          <h3 className="services-list-title">Additional service options</h3>
          <ol className="services-list">
            {coreServices.map((item, index) => (
              <li key={item} className="services-list-item">
                <span className="services-list-item-number">{index + 1}.</span>
                <span className="services-list-item-label">{item}</span>
              </li>
            ))}
          </ol>
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


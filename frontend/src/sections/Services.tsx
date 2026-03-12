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
  const { ref, isVisible } = useScrollAnimation();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices();
        setServices(data.filter(s => s.is_active).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch services:', error);
        // Fallback to default services if API fails
        setServices([
          {
            id: 1,
            name: 'Residential Cleaning',
            slug: 'residential-cleaning',
            short_description: 'Experience a sparkling home with our thorough residential cleaning services.',
            long_description: '',
            is_active: true,
            display_order: 1,
          },
          {
            id: 2,
            name: 'Commercial Cleaning',
            slug: 'commercial-cleaning',
            short_description: 'Keep your business spotless with our professional commercial cleaning solutions.',
            long_description: '',
            is_active: true,
            display_order: 2,
          },
          {
            id: 3,
            name: 'Carpet Cleaning',
            slug: 'carpet-cleaning',
            short_description: 'Deep clean and restore your carpets to their original beauty.',
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
          <span className="section-title">Our Services</span>
          <h2>Professional Cleaning Solutions for Homes and Businesses</h2>
          <p className="services-description">
            We provide professional residential and commercial cleaning services, including deep
            cleaning, carpet cleaning, window cleaning, office cleaning, and post-construction
            cleaning. Every service is designed to keep your property spotless, hygienic, and
            welcoming.
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
                    LEARN MORE →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="services-list-wrapper">
          <h3 className="services-list-title">Our list of cleaning services</h3>
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
          <button
            className="btn btn-outline"
            onClick={() => {
              window.location.href = '/services';
            }}
          >
            View All Cleaning Services
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;


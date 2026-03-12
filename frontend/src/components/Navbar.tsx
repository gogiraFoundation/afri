import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (path: string) => {
    window.location.href = path;
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { label: 'Home', action: () => scrollToSection('hero') },
    { label: 'About Us', action: () => scrollToSection('about') },
    { label: 'Services', action: () => navigateTo('/services') },
    { label: 'Why Afri Cleans', action: () => scrollToSection('why-choose') },
    { label: 'Testimonials', action: () => scrollToSection('testimonials') },
    { label: 'Pricing', action: () => navigateTo('/pricing') },
    { label: 'FAQ', action: () => scrollToSection('faq') },
    { label: 'Blog', action: () => navigateTo('/blog') },
    { label: 'Contact', action: () => scrollToSection('footer') },
  ];

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container navbar-container">
        <div className="navbar-logo" onClick={() => scrollToSection('hero')}>
          Afri
        </div>
        
        <div className={`navbar-menu ${isMenuOpen ? 'navbar-menu-open' : ''}`}>
          <ul className="navbar-links">
            {navLinks.map((link, index) => (
              <li key={index}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    link.action();
                  }}
                  className="navbar-link"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="navbar-phone">(+012)87059897</div>
          <button
            className="btn btn-primary navbar-cta"
            onClick={() => scrollToSection('booking')}
          >
            Book Now →
          </button>
        </div>

        <button
          className="navbar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;


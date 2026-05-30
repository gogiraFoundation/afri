import {
  CONTACT_SECTION_ID,
  EMAIL_DISPLAY,
  MAILTO_HREF,
  PHONE_DISPLAY,
  TEL_HREF,
  WHATSAPP_HREF,
} from '../config/site';
import BrandLogo from './BrandLogo';
import './Footer.css';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { label: 'Home', action: () => scrollToSection('hero') },
    { label: 'About Us', action: () => scrollToSection('about') },
    { label: 'Services', action: () => scrollToSection('services') },
    { label: 'Contact', action: () => scrollToSection(CONTACT_SECTION_ID) },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      url: '#',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.2-1.6 1.5-1.6h1.4V4.8c-.2 0-1.1-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.5v7h3z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: '#',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M12 7.3A4.7 4.7 0 1 0 12 16.7 4.7 4.7 0 0 0 12 7.3zm0 7.8A3.1 3.1 0 1 1 12 9a3.1 3.1 0 0 1 0 6.1zM17 6.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2z" />
          <path d="M12 3.8c2.7 0 3 .01 4.1.06 1 .05 1.5.21 1.9.36.5.2.9.44 1.3.85.41.4.65.78.85 1.3.15.4.31.9.36 1.9.05 1.1.06 1.4.06 4.1s-.01 3-.06 4.1c-.05 1-.21 1.5-.36 1.9-.2.5-.44.9-.85 1.3-.4.41-.78.65-1.3.85-.4.15-.9.31-1.9.36-1.1.05-1.4.06-4.1.06s-3-.01-4.1-.06c-1-.05-1.5-.21-1.9-.36a3.5 3.5 0 0 1-1.3-.85 3.5 3.5 0 0 1-.85-1.3c-.15-.4-.31-.9-.36-1.9A63.6 63.6 0 0 1 3.8 12c0-2.7.01-3 .06-4.1.05-1 .21-1.5.36-1.9.2-.5.44-.9.85-1.3.4-.41.78-.65 1.3-.85.4-.15.9-.31 1.9-.36 1.1-.05 1.4-.06 4.1-.06zm0-1.8c-2.8 0-3.2.01-4.2.06-1.1.05-1.8.23-2.5.5-.7.27-1.3.64-1.9 1.2a5.2 5.2 0 0 0-1.2 1.9c-.27.7-.45 1.4-.5 2.5C2.01 8.8 2 9.2 2 12s.01 3.2.06 4.2c.05 1.1.23 1.8.5 2.5.27.7.64 1.3 1.2 1.9a5.2 5.2 0 0 0 1.9 1.2c.7.27 1.4.45 2.5.5 1 .05 1.4.06 4.2.06s3.2-.01 4.2-.06c1.1-.05 1.8-.23 2.5-.5.7-.27 1.3-.64 1.9-1.2a5.2 5.2 0 0 0 1.2-1.9c.27-.7.45-1.4.5-2.5.05-1 .06-1.4.06-4.2s-.01-3.2-.06-4.2c-.05-1.1-.23-1.8-.5-2.5a5.2 5.2 0 0 0-1.2-1.9 5.2 5.2 0 0 0-1.9-1.2c-.7-.27-1.4-.45-2.5-.5-1-.05-1.4-.06-4.2-.06z" />
        </svg>
      ),
    },
    {
      name: 'LinkedIn',
      url: '#',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6.2 8.4a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6zM4.6 9.7h3.2V20H4.6zM10 9.7H13v1.4h.05c.42-.8 1.45-1.6 3-1.6 3.2 0 3.8 2.1 3.8 4.9V20h-3.2v-4.9c0-1.2-.02-2.7-1.7-2.7-1.7 0-2 1.3-2 2.6V20H10z" />
        </svg>
      ),
    },
  ];

  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <BrandLogo variant="footer" className="footer-logo" linkToHome={false} />
            <p className="footer-tagline">
              Professional cleaning for homes and businesses, delivered with care.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      link.action();
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="footer-contact">
              <p>
                <strong>Phone:</strong>{' '}
                <a href={TEL_HREF} className="footer-contact-link">
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p>
                <strong>WhatsApp:</strong>{' '}
                <a
                  href={WHATSAPP_HREF}
                  className="footer-contact-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {PHONE_DISPLAY}
                </a>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href={MAILTO_HREF} className="footer-contact-link">
                  {EMAIL_DISPLAY}
                </a>
              </p>
              <p className="footer-brochure">
                <a href="/brochure" className="footer-brochure-link">
                  View services brochure
                </a>
                {' · '}
                <a href="/one-pager" className="footer-brochure-link">
                  Price list (PDF)
                </a>
              </p>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Follow Us</h3>
            <div className="footer-social">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className="social-link"
                  aria-label={social.name}
                >
                  <span className="social-icon">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Afri Cleans. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


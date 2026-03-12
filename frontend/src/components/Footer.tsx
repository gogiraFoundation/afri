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
    { label: 'Contact', action: () => scrollToSection('footer') },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' },
  ];

  return (
    <footer id="footer" className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">Afri</div>
            <p className="footer-tagline">
              Professional cleaning services for an elevated lifestyle.
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
                <strong>Phone:</strong> (+012)87059897
              </p>
              <p>
                <strong>Email:</strong> info@africleans.com
              </p>
              <p>
                <strong>Address:</strong> 123 Cleaning Street, City, State ZIP
              </p>
              <p className="footer-brochure">
                <a href="/brochure" className="footer-brochure-link">
                  Download brochure
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


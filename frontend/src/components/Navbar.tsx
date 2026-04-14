import { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const TEL_HREF = 'tel:+01287059897';

const navLinks: { label: string; href: string }[] = [
  { label: 'Home', href: '/#hero' },
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/services' },
  { label: 'Why Choose Us', href: '/#why-choose' },
  { label: 'How It Works', href: '/#process' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#footer' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (e.key !== 'Tab' || !menuRef.current) return;

      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    if (focusable && focusable.length > 0) {
      window.setTimeout(() => focusable[0].focus(), 0);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`} aria-label="Primary">
      <div className="container navbar-container">
        <a href="/" className="navbar-logo">
          Afri
        </a>

        <div
          ref={menuRef}
          id="navbar-menu"
          className={`navbar-menu ${isMenuOpen ? 'navbar-menu-open' : ''}`}
        >
          <ul className="navbar-links">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="navbar-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={TEL_HREF} className="navbar-phone">
            (+012)87059897
          </a>
          <a href="/#booking" className="btn btn-primary navbar-cta" onClick={() => setIsMenuOpen(false)}>
            Get a Free Quote
          </a>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="navbar-toggle"
          onClick={() => setIsMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          aria-controls="navbar-menu"
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

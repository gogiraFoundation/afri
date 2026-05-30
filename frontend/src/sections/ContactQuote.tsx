import {
  EMAIL_DISPLAY,
  MAILTO_HREF,
  PHONE_DISPLAY,
  TEL_HREF,
  WHATSAPP_HREF,
} from '../config/site';
import './ContactQuote.css';

const ContactQuote = () => {
  return (
    <section id="contact" className="section contact-quote-section">
      <div className="container">
        <div className="contact-quote-inner">
          <div className="contact-quote-header">
            <span className="section-title">CONTACT</span>
            <h2>Get a free quote</h2>
            <p className="contact-quote-lede">
              Call or message us — we respond quickly with a no-obligation quote tailored to your
              home or workspace.
            </p>
          </div>

          <div className="contact-quote-actions">
            <a href={TEL_HREF} className="btn btn-primary contact-quote-btn">
              Call {PHONE_DISPLAY}
            </a>
            <a
              href={WHATSAPP_HREF}
              className="btn btn-outline contact-quote-btn contact-quote-btn-whatsapp"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp for a quote
            </a>
            <a href={MAILTO_HREF} className="btn btn-outline contact-quote-btn">
              Email {EMAIL_DISPLAY}
            </a>
          </div>

          <p className="contact-quote-print-links">
            <a href="/brochure">View services brochure</a>
            <span aria-hidden> · </span>
            <a href="/one-pager">Download price list (PDF)</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactQuote;

import { PHONE_DISPLAY, TEL_HREF, WHATSAPP_HREF, CONTACT_HASH_HREF, scrollToContact } from '../config/site';
import './PromoBanner.css';

const ConversionRow = () => (
  <div className="promo-conversion-row">
    <div className="container promo-conversion-inner">
      <a href={TEL_HREF} className="promo-conversion-link">
        {PHONE_DISPLAY}
      </a>
      <span className="promo-conversion-sep" aria-hidden>
        |
      </span>
      <a
        href={WHATSAPP_HREF}
        className="promo-conversion-link promo-conversion-whatsapp"
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>
      <a href={CONTACT_HASH_HREF} className="btn btn-primary promo-check-availability" onClick={(e) => {
        e.preventDefault();
        scrollToContact();
      }}>
        Get a quote
      </a>
    </div>
  </div>
);

const PromoBanner = () => {
  return (
    <div className="promo-banner">
      <ConversionRow />
    </div>
  );
};

export default PromoBanner;

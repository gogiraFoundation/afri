import { useEffect, useState } from 'react';
import { quoteQrUrl } from '../config/site';
import {
  ONE_PAGER_BRAND,
  onePagerContact,
  onePagerEcoBanner,
  onePagerExtrasLine,
  onePagerGuarantee,
  onePagerHourlyNote,
  onePagerPricingColumns,
  onePagerPricingRows,
  onePagerPricingTitle,
  onePagerServiceCards,
  onePagerSubscriptionBar,
  onePagerTaglines,
  onePagerTestimonials,
  onePagerTrustFooter,
} from '../config/onePager';
import BrandLogo from '../components/BrandLogo';
import './OnePagerPrint.css';

const OnePagerPage = () => {
  const quoteUrl = quoteQrUrl();
  const quoteLabel = 'WhatsApp for a quote';
  const [qrSvg, setQrSvg] = useState('');

  useEffect(() => {
    document.title = `${ONE_PAGER_BRAND} — Price list`;
  }, []);

  useEffect(() => {
    let cancelled = false;
    void import('qrcode').then(({ default: QRCode }) => {
      void QRCode.toString(quoteUrl, {
        type: 'svg',
        margin: 1,
        errorCorrectionLevel: 'M',
        color: { dark: '#1E1E1E', light: '#FFFFFF' },
        width: 180,
      }).then((svg) => {
        if (!cancelled) setQrSvg(svg);
      });
    });
    return () => {
      cancelled = true;
    };
  }, [quoteUrl]);

  return (
    <div className="one-pager-root">
      <div className="one-pager-screen-bar">
        <button type="button" className="one-pager-back" onClick={() => (window.location.href = '/')}>
          Back to website
        </button>
        <span className="one-pager-print-hint">Tip: Print → Save as PDF (one A4 page). Links work in the PDF.</span>
      </div>

      <article className="one-pager-sheet" aria-label="Afri Eco-Clean price list and contact">
        <div className="one-pager-bands">
          {/* Section 1 — top ~25% */}
          <header className="one-pager-band one-pager-band--top">
            <div className="one-pager-top-row">
              <BrandLogo variant="print" className="one-pager-logo" linkToHome={false} />
            </div>
            <div className="one-pager-taglines">
              {onePagerTaglines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="one-pager-service-grid">
              {onePagerServiceCards.map((card) => (
                <div key={card.title} className="one-pager-service-card">
                  <div className="one-pager-service-card-head">
                    <span className="one-pager-service-icon" aria-hidden>
                      {card.icon}
                    </span>
                    <span className="one-pager-service-title">{card.title}</span>
                  </div>
                  <div className="one-pager-service-body">
                    {card.lines.map((line) => (
                      <span key={line} className="one-pager-service-line">
                        {line}
                      </span>
                    ))}
                  </div>
                  <p className="one-pager-service-price">{card.priceLabel}</p>
                </div>
              ))}
            </div>
            <div className="one-pager-eco-banner">{onePagerEcoBanner}</div>
          </header>

          {/* Section 2 — middle ~45% */}
          <section className="one-pager-band one-pager-band--mid" aria-labelledby="op-pricing-title">
            <h2 id="op-pricing-title" className="one-pager-mid-title">
              {onePagerPricingTitle}
            </h2>
            <p className="one-pager-hourly-note">{onePagerHourlyNote}</p>
            <div className="one-pager-table-wrap">
              <table className="one-pager-table">
                <thead>
                  <tr>
                    {onePagerPricingColumns.map((col) => (
                      <th key={col.key} scope="col" className={col.key === 'home' ? 'one-pager-th-home' : ''}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {onePagerPricingRows.map((row, i) => (
                    <tr key={row.home} className={i % 2 === 1 ? 'one-pager-row-zebra' : ''}>
                      <th scope="row">{row.home}</th>
                      <td>{row.regular}</td>
                      <td>{row.deep}</td>
                      <td>{row.move}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="one-pager-extras">{onePagerExtrasLine}</p>
            <div className="one-pager-discount-bar">{onePagerSubscriptionBar}</div>
          </section>

          {/* Section 3 — bottom ~30% */}
          <footer className="one-pager-band one-pager-band--bottom">
            <div className="one-pager-trust-row">
              <figure className="one-pager-quote-card">
                <blockquote>&ldquo;{onePagerTestimonials[0].quote}&rdquo;</blockquote>
                <figcaption>{onePagerTestimonials[0].author}</figcaption>
              </figure>
              <figure className="one-pager-quote-card">
                <div className="one-pager-stars" aria-hidden>
                  ★★★★★
                </div>
                <blockquote>&ldquo;{onePagerTestimonials[1].quote}&rdquo;</blockquote>
                <figcaption>{onePagerTestimonials[1].author}</figcaption>
              </figure>
              <div className="one-pager-guarantee-card">
                <h3 className="one-pager-guarantee-title">{onePagerGuarantee.title}</h3>
                <p className="one-pager-guarantee-line">{onePagerGuarantee.body}</p>
              </div>
            </div>
            <hr className="one-pager-rule" />
            <div className="one-pager-book-row">
              <div className="one-pager-book-copy">
                <h3 className="one-pager-ready-title">Get a quote</h3>
                <p className="one-pager-scan-line">Scan to message us on WhatsApp:</p>
                <p className="one-pager-book-url">
                  <a href={quoteUrl} className="one-pager-link-screen" target="_blank" rel="noopener noreferrer">
                    {quoteLabel}
                  </a>
                </p>
              </div>
              {qrSvg ? (
                <a
                  href={quoteUrl}
                  className="one-pager-qr"
                  aria-label={quoteLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
              ) : (
                <div className="one-pager-qr one-pager-qr--placeholder" aria-hidden />
              )}
            </div>
            <div className="one-pager-contact-line">
              <a href={onePagerContact.telHref} className="one-pager-link-screen">
                📞 {onePagerContact.phoneDisplay}
              </a>
              <a href={onePagerContact.whatsappHref} className="one-pager-link-screen">
                💬 WhatsApp: {onePagerContact.phoneDisplay}
              </a>
              <a href={onePagerContact.mailtoHref} className="one-pager-link-screen">
                ✉️ {onePagerContact.emailDisplay}
              </a>
            </div>
            <p className="one-pager-brand-line">
              <span className="one-pager-brand-strong">{ONE_PAGER_BRAND}</span>
              <span className="one-pager-brand-sep" aria-hidden>
                {' '}
              </span>
              {onePagerTrustFooter}
            </p>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default OnePagerPage;

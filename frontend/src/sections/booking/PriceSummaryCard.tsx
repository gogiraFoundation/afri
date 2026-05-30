import type { Service } from '../../types/api';

interface QuoteBreakdown {
  basePrice: number;
  discountAmount: number;
  subtotal: number;
  vatAmount: number;
  totalWithVat: number;
  applyVat: boolean;
}

interface PriceSummaryCardProps {
  currentService: Service | null;
  quoteBreakdown: QuoteBreakdown | null;
  vatRatePercent: number;
  promoApplied: boolean;
  promoCode: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);

const PriceSummaryCard = ({
  currentService,
  quoteBreakdown,
  vatRatePercent,
  promoApplied,
  promoCode,
}: PriceSummaryCardProps) => {
  if (!quoteBreakdown || !currentService || currentService.price_from == null) {
    return (
      <div className="bw-price-card bw-price-card--muted">
        <p className="bw-price-card__label">Your estimate</p>
        <p className="bw-price-card__support">
          We&apos;ll confirm pricing after reviewing your request — no payment required today.
        </p>
      </div>
    );
  }

  return (
    <div className="bw-price-card">
      <p className="bw-price-card__label">Estimated price</p>
      <p className="bw-price-card__large">{formatCurrency(quoteBreakdown.totalWithVat)} incl. VAT</p>
      {promoApplied && quoteBreakdown.discountAmount > 0 && (
        <p className="bw-price-card__promo">Promo {promoCode} applied</p>
      )}
      <p className="bw-price-card__support">
        Final pricing confirmed after reviewing your request.
      </p>
      {quoteBreakdown.applyVat && quoteBreakdown.vatAmount > 0 && (
        <p className="bw-price-card__meta">Includes VAT at {vatRatePercent}%.</p>
      )}
      <p className="bw-price-card__trust">No payment required today.</p>
    </div>
  );
};

export default PriceSummaryCard;

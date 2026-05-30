import PriceSummaryCard from './PriceSummaryCard';
import type { Service } from '../../types/api';

interface QuoteBreakdown {
  basePrice: number;
  discountAmount: number;
  subtotal: number;
  vatAmount: number;
  totalWithVat: number;
  applyVat: boolean;
}

interface BookingStepConfirmProps {
  address: string;
  notes: string;
  promoCode: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  fieldErrors: Record<string, string>;
  currentService: Service | null;
  quoteBreakdown: QuoteBreakdown | null;
  vatRatePercent: number;
  activePromotionMatches: boolean;
  promoCodeValue: string;
}

const BookingStepConfirm = ({
  address,
  notes,
  promoCode,
  onChange,
  fieldErrors,
  currentService,
  quoteBreakdown,
  vatRatePercent,
  activePromotionMatches,
  promoCodeValue,
}: BookingStepConfirmProps) => (
  <div className="bw-step bw-step-confirm">
    <header className="bw-step-header">
      <h2 className="bw-step-title visually-hidden">Address and confirmation</h2>
      <p className="bw-step-sub bw-step-sub--compact">Almost there — add your address and we&apos;ll check availability.</p>
    </header>

    <div className="bw-stack">
      <div className="bw-plain-field">
        <label htmlFor="address" className="bw-label">
          Service address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          className={`bw-input ${fieldErrors.address ? 'bw-input--invalid' : ''}`}
          value={address}
          onChange={onChange}
          autoComplete="street-address"
          placeholder="Start typing your address"
          aria-invalid={fieldErrors.address ? true : undefined}
          aria-describedby={fieldErrors.address ? 'address-err' : 'address-hint'}
        />
        <p id="address-hint" className="bw-input-hint">
          Building name, street, postcode — whatever helps us find you.
        </p>
        {fieldErrors.address && (
          <p id="address-err" className="bw-field-error" role="alert">
            {fieldErrors.address}
          </p>
        )}
      </div>

      <div className="bw-plain-field">
        <label htmlFor="notes" className="bw-label">
          Anything else we should know?{' '}
          <span className="bw-optional">Optional</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          className="bw-textarea"
          value={notes}
          onChange={onChange}
          rows={4}
          placeholder="Parking info, pets, access instructions, or anything else we should know…"
          autoComplete="off"
        />
      </div>

      <details className="bw-promo-details">
        <summary className="bw-promo-summary">Have a promo code?</summary>
        <div className="bw-promo-body">
          <label htmlFor="promo_code" className="visually-hidden">
            Promo code
          </label>
          <input
            id="promo_code"
            name="promo_code"
            type="text"
            className={`bw-input ${fieldErrors.promo_code ? 'bw-input--invalid' : ''}`}
            value={promoCode}
            onChange={onChange}
            placeholder="Enter code"
            autoComplete="off"
            aria-invalid={fieldErrors.promo_code ? true : undefined}
            aria-describedby={fieldErrors.promo_code ? 'promo-err' : undefined}
          />
          {fieldErrors.promo_code && (
            <p id="promo-err" className="bw-field-error" role="alert">
              {fieldErrors.promo_code}
            </p>
          )}
          {activePromotionMatches && promoCodeValue.trim() && !fieldErrors.promo_code && (
            <p className="bw-promo-applied" role="status">
              Code applied — your estimate reflects the discount.
            </p>
          )}
        </div>
      </details>

      <PriceSummaryCard
        currentService={currentService}
        quoteBreakdown={quoteBreakdown}
        vatRatePercent={vatRatePercent}
        promoApplied={activePromotionMatches}
        promoCode={promoCodeValue}
      />
    </div>
  </div>
);

export default BookingStepConfirm;

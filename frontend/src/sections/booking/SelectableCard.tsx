import type { ReactNode } from 'react';
import type { VisitIntent } from './types';
import type { ServiceCardOption } from './serviceCardOptions';

const icons: Record<ServiceCardOption['icon'], ReactNode> = {
  sparkle: (
    <svg className="bw-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 3v1m0 16v1M5.6 5.6l.7.7m12.1 12.1l.7.7M3 12h1m16 0h1M5.6 18.4l.7-.7M18.3 5.7l.7-.7" strokeLinecap="round" />
      <path d="M12 8c-1.5 2-4 2.5-4 5a4 4 0 108 0c0-2.5-2.5-3-4-5z" strokeLinejoin="round" />
    </svg>
  ),
  key: (
    <svg className="bw-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="8" cy="15" r="4" />
      <path d="M12 15h8M18 15v3M16 11l2-2" strokeLinecap="round" />
    </svg>
  ),
  repeat: (
    <svg className="bw-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M17 3v6h6M7 21v-6H1M21 13a9 9 0 00-9-9 9 9 0 00-6 2.3L3 11M3 11v5h5M3 11a9 9 0 009 9 9 9 0 006-2.3L21 13M21 13v-5h-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  building: (
    <svg className="bw-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 21V8l8-4v17M4 13h8M9 9v.01M9 12v.01M9 15v.01M14 9h3M14 12h3M14 15h3" strokeLinecap="round" />
    </svg>
  ),
  dots: (
    <svg className="bw-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
};

interface SelectableCardProps {
  name: string;
  options: ServiceCardOption[];
  value: VisitIntent | null;
  onChange: (intent: VisitIntent) => void;
  error?: string;
  disabled?: boolean;
}

const SelectableCard = ({ name, options, value, onChange, error, disabled }: SelectableCardProps) => {
  const legendId = `${name}-service-legend`;

  return (
    <fieldset className="bw-fieldset bw-cards-fieldset">
      <legend id={legendId} className="bw-fieldset-legend">
        What do you need cleaned?
      </legend>
      <div
        className="bw-cards"
        role="radiogroup"
        aria-labelledby={legendId}
        aria-invalid={error ? true : undefined}
      >
        {options.map(opt => {
          const checked = value === opt.id;
          return (
            <label
              key={opt.id}
              className={`bw-card ${checked ? 'bw-card--selected' : ''} ${disabled ? 'bw-card--disabled' : ''}`}
            >
              <input
                type="radio"
                className="visually-hidden"
                name={name}
                value={opt.id}
                checked={checked}
                disabled={disabled}
                onChange={() => onChange(opt.id)}
              />
              <span className="bw-card__icon" aria-hidden>
                {icons[opt.icon]}
              </span>
              <span className="bw-card__title">{opt.title}</span>
              <span className="bw-card__desc">{opt.description}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="bw-field-error" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
};

export default SelectableCard;

import type { VisitIntent, PropertyPill, PropertySize, TimeWindowValue } from './types';
import SelectableCard from './SelectableCard';
import { SERVICE_CARD_OPTIONS } from './serviceCardOptions';
import SegmentedControl from './SegmentedControl';
import ChipGroup from './ChipGroup';

const TIME_OPTIONS: { value: TimeWindowValue; label: string; hint: string }[] = [
  { value: 'Morning', label: 'Morning', hint: 'Roughly 8am–12pm' },
  { value: 'Afternoon', label: 'Afternoon', hint: 'Roughly 12pm–4pm' },
  { value: 'Evening', label: 'Evening', hint: 'Roughly 4pm–8pm' },
  { value: 'Flexible', label: 'Flexible', hint: "We'll suggest a slot" },
];

interface BookingStepDetailsProps {
  visitIntent: VisitIntent | null;
  propertyPill: PropertyPill | null;
  propertySize: PropertySize | null;
  otherDescribe: string;
  preferredDate: string;
  preferredTimeWindow: string;
  onVisitIntent: (v: VisitIntent) => void;
  onPropertyPill: (v: PropertyPill) => void;
  onPropertySize: (v: PropertySize) => void;
  onOtherDescribe: (v: string) => void;
  onPreferredDate: (v: string) => void;
  onPreferredTimeWindow: (v: string) => void;
  fieldErrors: Record<string, string>;
  servicesLoading: boolean;
  minDate: string;
}

const BookingStepDetails = ({
  visitIntent,
  propertyPill,
  propertySize,
  otherDescribe,
  preferredDate,
  preferredTimeWindow,
  onVisitIntent,
  onPropertyPill,
  onPropertySize,
  onOtherDescribe,
  onPreferredDate,
  onPreferredTimeWindow,
  fieldErrors,
  servicesLoading,
  minDate,
}: BookingStepDetailsProps) => (
  <div className="bw-step bw-step-details">
    <header className="bw-step-header">
      <h2 className="bw-step-title visually-hidden">Service details</h2>
      <p className="bw-step-sub bw-step-sub--compact">
        Pick what fits — you can change your mind before we confirm.
      </p>
    </header>

    <SelectableCard
      name="visit_intent"
      options={SERVICE_CARD_OPTIONS}
      value={visitIntent}
      onChange={onVisitIntent}
      error={fieldErrors.service}
      disabled={servicesLoading}
    />

        {visitIntent === 'other' && (
      <div className="bw-other-field">
        <label htmlFor="other-describe" className="bw-label">
          In a few words, what do you need?
        </label>
        <input
          id="other-describe"
          name="other_describe"
          className={`bw-input ${fieldErrors.other_describe ? 'bw-input--invalid' : ''}`}
          type="text"
          value={otherDescribe}
          onChange={e => onOtherDescribe(e.target.value)}
          placeholder="e.g. Post-renovation dust-down"
          autoComplete="off"
          maxLength={200}
          aria-invalid={fieldErrors.other_describe ? true : undefined}
          aria-describedby={fieldErrors.other_describe ? 'other-describe-err' : undefined}
        />
        {fieldErrors.other_describe && (
          <p id="other-describe-err" className="bw-field-error" role="alert">
            {fieldErrors.other_describe}
          </p>
        )}
      </div>
    )}

    <SegmentedControl
      name="property_pill"
      value={propertyPill}
      onChange={onPropertyPill}
      error={fieldErrors.property_type}
    />

    <ChipGroup
      name="property_size"
      value={propertySize}
      onChange={onPropertySize}
      error={fieldErrors.property_size}
    />

    <fieldset className="bw-fieldset">
      <legend className="bw-fieldset-legend">Schedule</legend>
      <div className="bw-schedule-row">
        <div className="bw-date-wrap">
          <label htmlFor="preferred_date" className="bw-label">
            Preferred date
          </label>
          <input
            id="preferred_date"
            name="preferred_date"
            type="date"
            className={`bw-input bw-input-date ${fieldErrors.preferred_date ? 'bw-input--invalid' : ''}`}
            value={preferredDate}
            min={minDate}
            onChange={e => onPreferredDate(e.target.value)}
            aria-invalid={fieldErrors.preferred_date ? true : undefined}
            aria-describedby={fieldErrors.preferred_date ? 'preferred_date-err' : 'preferred_date-hint'}
          />
          <p id="preferred_date-hint" className="bw-input-hint">
            Choose a day that works best — we&apos;ll confirm the slot.
          </p>
          {fieldErrors.preferred_date && (
            <p id="preferred_date-err" className="bw-field-error" role="alert">
              {fieldErrors.preferred_date}
            </p>
          )}
        </div>
      </div>

      <p className="bw-label bw-label--spaced">Preferred time window</p>
      <div className="bw-time-chips" role="radiogroup" aria-label="Preferred time window">
        {TIME_OPTIONS.map(opt => (
          <label
            key={opt.value}
            className={`bw-time-chip ${preferredTimeWindow === opt.value ? 'bw-time-chip--selected' : ''}`}
          >
            <input
              type="radio"
              className="visually-hidden"
              name="preferred_time_window"
              value={opt.value}
              checked={preferredTimeWindow === opt.value}
              onChange={() => onPreferredTimeWindow(opt.value)}
            />
            <span className="bw-time-chip__label">{opt.label}</span>
            <span className="bw-time-chip__hint">{opt.hint}</span>
          </label>
        ))}
      </div>
      {fieldErrors.preferred_time_window && (
        <p className="bw-field-error" role="alert">
          {fieldErrors.preferred_time_window}
        </p>
      )}
    </fieldset>
  </div>
);

export default BookingStepDetails;

import type { PropertyPill } from './types';

const OPTIONS: PropertyPill[] = ['Flat', 'House', 'Office', 'Airbnb', 'Commercial'];

interface SegmentedControlProps {
  name: string;
  value: PropertyPill | null;
  onChange: (v: PropertyPill) => void;
  error?: string;
}

const SegmentedControl = ({ name, value, onChange, error }: SegmentedControlProps) => (
  <fieldset className="bw-fieldset">
    <legend className="bw-fieldset-legend">Property type</legend>
    <div className="bw-pills" role="radiogroup" aria-label="Property type">
      {OPTIONS.map(opt => (
        <label key={opt} className={`bw-pill ${value === opt ? 'bw-pill--selected' : ''}`}>
          <input
            type="radio"
            className="visually-hidden"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
          />
          {opt}
        </label>
      ))}
    </div>
    {error && (
      <p className="bw-field-error" role="alert">
        {error}
      </p>
    )}
  </fieldset>
);

export default SegmentedControl;

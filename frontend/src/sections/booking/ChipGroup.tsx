import type { PropertySize } from './types';

const SIZES: PropertySize[] = ['Studio', '1 Bed', '2 Bed', '3 Bed', '4+ Bed'];

interface ChipGroupProps {
  name: string;
  value: PropertySize | null;
  onChange: (v: PropertySize) => void;
  error?: string;
}

const ChipGroup = ({ name, value, onChange, error }: ChipGroupProps) => (
  <fieldset className="bw-fieldset">
    <legend className="bw-fieldset-legend">Property size</legend>
    <div className="bw-chips" role="radiogroup" aria-label="Property size">
      {SIZES.map(opt => (
        <label key={opt} className={`bw-chip ${value === opt ? 'bw-chip--selected' : ''}`}>
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

export default ChipGroup;

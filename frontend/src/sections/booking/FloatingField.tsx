type InputKind = 'text' | 'email' | 'tel';

interface FloatingFieldProps {
  id: string;
  name: string;
  label: string;
  type?: InputKind;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  helperText?: string;
  error?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}

const FloatingField = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  helperText,
  error,
  inputMode,
}: FloatingFieldProps) => {
  const describedBy = [helperText && `${id}-hint`, error && `${id}-err`].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`bw-floating ${error ? 'bw-floating--error' : ''}`}>
      <input
        id={id}
        name={name}
        type={type}
        className="bw-floating__input"
        placeholder=" "
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      <label className="bw-floating__label" htmlFor={id}>
        {label}
      </label>
      {helperText && !error && (
        <p id={`${id}-hint`} className="bw-floating__hint">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} className="bw-floating__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FloatingField;

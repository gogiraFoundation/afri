import FloatingField from './FloatingField';

interface BookingStepContactProps {
  name: string;
  email: string;
  phone: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fieldErrors: Record<string, string>;
}

const BookingStepContact = ({ name, email, phone, onChange, fieldErrors }: BookingStepContactProps) => (
  <div className="bw-step bw-step-contact">
    <header className="bw-step-header">
      <h2 className="bw-step-title">Book a cleaning service</h2>
      <p className="bw-step-sub">
        Tell us what you need — we&apos;ll confirm availability and pricing shortly.
      </p>
    </header>
    <div className="bw-stack">
      <FloatingField
        id="booking-name"
        name="name"
        label="Full name"
        value={name}
        onChange={onChange}
        autoComplete="name"
        helperText="So we know who to greet on the day."
        error={fieldErrors.name}
      />
      <FloatingField
        id="booking-phone"
        name="phone"
        label="Mobile number"
        type="tel"
        value={phone}
        onChange={onChange}
        autoComplete="tel"
        inputMode="tel"
        helperText="We&apos;ll only use this to confirm your visit."
        error={fieldErrors.phone}
      />
      <FloatingField
        id="booking-email"
        name="email"
        label="Email address"
        type="email"
        value={email}
        onChange={onChange}
        autoComplete="email"
        helperText="We&apos;ll send your confirmation here."
        error={fieldErrors.email}
      />
    </div>
  </div>
);

export default BookingStepContact;

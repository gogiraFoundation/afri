import type { WizardStep } from './types';

const STEPS: { step: WizardStep; label: string }[] = [
  { step: 1, label: 'Contact' },
  { step: 2, label: 'Details' },
  { step: 3, label: 'Confirm' },
];

interface BookingWizardProgressProps {
  currentStep: WizardStep;
}

const BookingWizardProgress = ({ currentStep }: BookingWizardProgressProps) => {
  const pct = (currentStep / 3) * 100;

  return (
    <div className="bw-progress" aria-label="Booking progress">
      <div
        className="bw-progress__bar"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={3}
        aria-valuenow={currentStep}
        aria-valuetext={`Step ${currentStep} of 3`}
      >
        <div className="bw-progress__fill" style={{ width: `${pct}%` }} />
      </div>
      <ol className="bw-progress__steps">
        {STEPS.map(({ step, label }) => (
          <li
            key={step}
            className={`bw-progress__step ${currentStep >= step ? 'bw-progress__step--done' : ''} ${
              currentStep === step ? 'bw-progress__step--current' : ''
            }`}
            aria-current={currentStep === step ? 'step' : undefined}
          >
            <span className="bw-progress__step-num">{step}</span>
            <span className="bw-progress__step-label">{label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default BookingWizardProgress;

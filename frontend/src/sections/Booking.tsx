import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  createBooking,
  getServices,
  getActivePromotion,
  getVATConfig,
  ApiValidationError,
} from '../api/client';
import type {
  Service,
  Booking as BookingRecord,
  BookingFormData,
  Promotion,
  VATConfig,
} from '../types/api';
import { getBookingCaptchaToken } from '../utils/recaptcha';
import BookingWizardProgress from './booking/BookingWizardProgress';
import BookingStepContact from './booking/BookingStepContact';
import BookingStepDetails from './booking/BookingStepDetails';
import BookingStepConfirm from './booking/BookingStepConfirm';
import {
  buildStructuredNotesPrefix,
  combineNotesForSubmit,
  serviceIdForVisitIntent,
  visitTypeNoteLine,
} from './booking/serviceMap';
import type { VisitIntent, PropertyPill, PropertySize, WizardStep } from './booking/types';
import { jobTypeFromPropertyPill } from './booking/types';
import './booking/BookingWizard.css';

const DEFAULT_UK_VAT_RATE = 0.2;
const DEFAULT_APPLY_VAT = true;
const DEFAULT_VAT_CONFIG: VATConfig = {
  default_vat_rate: DEFAULT_UK_VAT_RATE,
  vat_rate_percent: 20,
  apply_vat_by_default: DEFAULT_APPLY_VAT,
  currency: 'GBP',
  prices_include_vat: false,
};

const getVatRate = () => {
  const raw = import.meta.env.VITE_DEFAULT_VAT_RATE;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    return DEFAULT_UK_VAT_RATE;
  }
  return parsed;
};

const isVatApplied = () => {
  const raw = String(import.meta.env.VITE_APPLY_VAT_BY_DEFAULT ?? DEFAULT_APPLY_VAT).toLowerCase();
  return raw === 'true';
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);

const emptyForm = (promo?: Promotion | null): BookingFormData => ({
  name: '',
  email: '',
  phone: '',
  service: 0,
  job_type: 'residential',
  billing_type: 'fixed',
  preferred_date: '',
  preferred_time_window: '',
  address: '',
  notes: '',
  estimated_hours: null,
  promo_code: promo?.promo_code || '',
  promo_discount: promo?.discount_percentage ?? null,
  honeypot: '',
});

const Booking = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastBooking, setLastBooking] = useState<BookingRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePromotion, setActivePromotion] = useState<Promotion | null>(null);
  const [vatConfig, setVatConfig] = useState<VATConfig>(DEFAULT_VAT_CONFIG);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<WizardStep>(1);
  const [visitIntent, setVisitIntent] = useState<VisitIntent | null>(null);
  const [propertyPill, setPropertyPill] = useState<PropertyPill | null>(null);
  const [propertySize, setPropertySize] = useState<PropertySize | null>(null);
  const [otherDescribe, setOtherDescribe] = useState('');

  const [formData, setFormData] = useState<BookingFormData>(() => emptyForm(null));

  const minDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const loadBootstrap = useCallback(async () => {
    try {
      setBootstrapError(null);
      setServicesLoading(true);
      const [servicesData, promotion, fetchedVatConfig] = await Promise.all([
        getServices(),
        getActivePromotion(),
        getVATConfig().catch(() => DEFAULT_VAT_CONFIG),
      ]);

      const activeServices = servicesData.filter(s => s.is_active);
      setServices(activeServices);
      setActivePromotion(promotion);
      setVatConfig(fetchedVatConfig);

      setFormData(prev => {
        const next = { ...prev, ...emptyForm(promotion) };
        if (prev.name) next.name = prev.name;
        if (prev.email) next.email = prev.email;
        if (prev.phone) next.phone = prev.phone;
        return next;
      });
    } catch (e) {
      if (import.meta.env.DEV) {
        console.error('Failed to fetch booking bootstrap:', e);
      }
      setBootstrapError('We could not load booking options. Please try again.');
    } finally {
      setServicesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBootstrap();
  }, [loadBootstrap]);

  useEffect(() => {
    if (!visitIntent || services.length === 0) return;
    const id = serviceIdForVisitIntent(services, visitIntent);
    setFormData(prev => (prev.service === id ? prev : { ...prev, service: id }));
  }, [services, visitIntent]);

  useEffect(() => {
    if (!propertyPill) return;
    const jt = jobTypeFromPropertyPill(propertyPill);
    setFormData(prev => (prev.job_type === jt ? prev : { ...prev, job_type: jt }));
  }, [propertyPill]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'promo_code') {
      const trimmed = value.trim();
      let promo_discount: number | null = null;
      if (activePromotion && trimmed && trimmed.toLowerCase() === activePromotion.promo_code.toLowerCase()) {
        promo_discount = activePromotion.discount_percentage;
      }
      setFormData(prev => ({ ...prev, promo_code: value, promo_discount }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]:
          name === 'estimated_hours'
            ? value
              ? parseFloat(value) || null
              : null
            : value,
      }));
    }
    setError(null);
    setFieldErrors(prev => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validateStep1 = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Enter your full name.';
    if (!formData.email.trim()) {
      e.email = 'Enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Enter a valid email address.';
    }
    if (!formData.phone.trim()) e.phone = 'Enter a mobile number we can reach you on.';
    return e;
  };

  const validateStep2 = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!visitIntent) e.service = 'Choose the type of clean you need.';
    if (visitIntent === 'other' && otherDescribe.trim().length < 3) {
      e.other_describe = 'Add a few words so we know how to help.';
    }
    if (!propertyPill) e.property_type = 'Select your property type.';
    if (!propertySize) e.property_size = 'Select a property size.';
    if (!formData.preferred_date) e.preferred_date = 'Choose a preferred date.';
    if (!formData.preferred_time_window) e.preferred_time_window = 'Choose a time window.';
    if (!formData.service || formData.service === 0) e.service = 'Choose the type of clean you need.';
    return e;
  };

  const validateStep3 = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!formData.address.trim()) e.address = 'Enter the address where we should visit.';
    return e;
  };

  const validateAll = (): Record<string, string> => ({
    ...validateStep1(),
    ...validateStep2(),
    ...validateStep3(),
  });

  const applyApiFieldErrors = (fields: Record<string, string>) => {
    setFieldErrors(fields);
    const keys = Object.keys(fields);
    if (keys.some(k => ['name', 'email', 'phone'].includes(k))) setStep(1);
    else if (
      keys.some(k =>
        ['service', 'preferred_date', 'preferred_time_window', 'property_type', 'property_size', 'other_describe'].includes(
          k
        )
      )
    ) {
      setStep(2);
    } else setStep(3);
  };

  const goNext = () => {
    setError(null);
    if (step === 1) {
      const e = validateStep1();
      if (Object.keys(e).length > 0) {
        setFieldErrors(e);
        return;
      }
      setFieldErrors({});
      setStep(2);
      return;
    }
    if (step === 2) {
      const e = validateStep2();
      if (Object.keys(e).length > 0) {
        setFieldErrors(e);
        return;
      }
      setFieldErrors({});
      setStep(3);
    }
  };

  const goBack = () => {
    setError(null);
    if (step > 1) {
      setStep(s => (s > 1 ? ((s - 1) as WizardStep) : s));
      setFieldErrors({});
    }
  };

  const currentService = useMemo(
    () => services.find(s => s.id === formData.service) || null,
    [services, formData.service]
  );

  const quoteBreakdown = useMemo(() => {
    if (!currentService || currentService.price_from == null) return null;

    const base =
      typeof currentService.price_from === 'number'
        ? currentService.price_from
        : parseFloat(String(currentService.price_from)) || 0;

    let subtotal = base;

    if (formData.billing_type === 'hourly' && formData.estimated_hours && formData.estimated_hours > 0) {
      subtotal = base * formData.estimated_hours;
    }

    let discountAmount = 0;
    if (formData.promo_code && formData.promo_discount != null) {
      discountAmount = subtotal * (formData.promo_discount / 100);
      subtotal = subtotal - discountAmount;
    }

    const vatRate = vatConfig.default_vat_rate ?? getVatRate();
    const applyVat = vatConfig.apply_vat_by_default ?? isVatApplied();
    const vatAmount = applyVat ? subtotal * vatRate : 0;
    const totalWithVat = subtotal + vatAmount;

    return {
      basePrice: base,
      discountAmount,
      subtotal,
      vatAmount,
      totalWithVat,
      applyVat,
    };
  }, [currentService, formData.billing_type, formData.estimated_hours, formData.promo_code, formData.promo_discount, vatConfig]);

  const buildPayload = (): BookingFormData => {
    if (!visitIntent || !propertyPill || !propertySize) {
      return formData;
    }
    const jt = jobTypeFromPropertyPill(propertyPill);
    const visitLine = visitTypeNoteLine(visitIntent, otherDescribe);
    const prefix = buildStructuredNotesPrefix({
      propertyPill,
      propertySize,
      jobType: jt,
      visitLine,
    });
    const notes = combineNotesForSubmit(prefix, formData.notes || '');
    return {
      ...formData,
      job_type: jt,
      service: serviceIdForVisitIntent(services, visitIntent),
      notes,
    };
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (step < 3) {
      goNext();
      return;
    }

    const errs = validateAll();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      applyApiFieldErrors(errs);
      setError('Please complete the highlighted fields.');
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const payload: BookingFormData = { ...buildPayload() };
      const token = await getBookingCaptchaToken();
      if (token) {
        payload.captcha_token = token;
      }
      const booking = await createBooking(payload);
      setLastBooking(booking);
      setSubmitted(true);
      setStep(1);
      setVisitIntent(null);
      setPropertyPill(null);
      setPropertySize(null);
      setOtherDescribe('');
      setFormData(emptyForm(activePromotion));
    } catch (err) {
      if (err instanceof ApiValidationError) {
        const fields = { ...err.fields };
        const captchaMsg = fields.captcha_token;
        delete fields.captcha_token;
        if (Object.keys(fields).length > 0) {
          applyApiFieldErrors(fields);
        }
        const first =
          captchaMsg ||
          Object.values(fields)[0] ||
          Object.values(err.fields)[0] ||
          err.message;
        setError(first);
        return;
      }
      setError(err instanceof Error ? err.message : 'We could not submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetWizard = () => {
    setSubmitted(false);
    setLastBooking(null);
    setStep(1);
    setVisitIntent(null);
    setPropertyPill(null);
    setPropertySize(null);
    setOtherDescribe('');
    setFieldErrors({});
    setError(null);
    setFormData(emptyForm(activePromotion));
  };

  const handleVisitIntent = (intent: VisitIntent) => {
    setVisitIntent(intent);
    const id = serviceIdForVisitIntent(services, intent);
    setFormData(prev => ({ ...prev, service: id }));
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next.service;
      delete next.other_describe;
      return next;
    });
  };

  const handlePropertyPill = (pill: PropertyPill) => {
    setPropertyPill(pill);
    setFormData(prev => ({ ...prev, job_type: jobTypeFromPropertyPill(pill) }));
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next.property_type;
      return next;
    });
  };

  const handlePropertySize = (size: PropertySize) => {
    setPropertySize(size);
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next.property_size;
      return next;
    });
  };

  const handleOtherDescribe = (v: string) => {
    setOtherDescribe(v);
    setFieldErrors(prev => {
      const next = { ...prev };
      delete next.other_describe;
      return next;
    });
  };

  const promoMatchesActive =
    !!activePromotion &&
    !!formData.promo_code &&
    formData.promo_code.trim().toLowerCase() === activePromotion.promo_code.toLowerCase();

  if (submitted) {
    return (
      <section id="booking" className="section booking-section--wizard">
        <div className="container">
          <div className="bw-wizard-wrap">
            <div className="bw-wizard-card bw-success" aria-live="polite">
              <div className="bw-success-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2>You&apos;re all set</h2>
              <p>
                Thanks for reaching out — we&apos;ve received your availability request and will be in touch shortly.
              </p>
              {lastBooking && (lastBooking.total_with_vat != null || lastBooking.estimated_price != null) && (
                <div className="bw-quote-breakdown">
                  <h3>Your guide price</h3>
                  {lastBooking.promo_code && lastBooking.promo_discount != null && (
                    <div className="bw-quote-line bw-quote-line--discount">
                      <span>Promo ({lastBooking.promo_code})</span>
                      <span>-{Number(lastBooking.promo_discount)}%</span>
                    </div>
                  )}
                  <div className="bw-quote-line bw-quote-line--total">
                    <span>
                      {lastBooking.vat_amount != null && Number(lastBooking.vat_amount) > 0
                        ? 'Estimated total (incl. VAT)'
                        : 'Estimated total'}
                    </span>
                    <span>
                      {formatCurrency(
                        Number(
                          lastBooking.total_with_vat != null
                            ? lastBooking.total_with_vat
                            : lastBooking.estimated_price ?? 0
                        )
                      )}
                    </span>
                  </div>
                  <p className="bw-quote-note">
                    Final price is confirmed after we&apos;ve reviewed scope — this is a guide only. No payment was
                    taken.
                  </p>
                </div>
              )}
              <button type="button" className="bw-btn bw-btn-primary" onClick={resetWizard}>
                Submit another request
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const showEmptyServices = !servicesLoading && services.length === 0 && !bootstrapError;

  return (
    <section id="booking" className="section booking-section--wizard">
      <div className="container">
        <div className="bw-wizard-wrap">
          <div className="bw-wizard-card">
            {bootstrapError && (
              <div className="bw-bootstrap">
                <p>{bootstrapError}</p>
                <button type="button" className="bw-btn bw-btn-primary" onClick={() => loadBootstrap()}>
                  Try again
                </button>
              </div>
            )}

            {showEmptyServices && (
              <div className="bw-bootstrap">
                <p>Booking options are not available at the moment. Please refresh or try again later.</p>
                <button type="button" className="bw-btn bw-btn-primary" onClick={() => loadBootstrap()}>
                  Refresh
                </button>
              </div>
            )}

            {!bootstrapError && !showEmptyServices && (
              <form
                id="booking-wizard-form"
                className="booking-wizard-form"
                onSubmit={handleFormSubmit}
                noValidate
              >
                <BookingWizardProgress currentStep={step} />

                {error && (
                  <div className="bw-form-error" role="alert" aria-live="assertive">
                    {error}
                  </div>
                )}

                <input
                  type="text"
                  name="company_website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="visually-hidden"
                  value={formData.honeypot}
                  onChange={e => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
                />

                {servicesLoading && step === 2 ? (
                  <div className="bw-step-panel" aria-busy="true" aria-live="polite">
                    <p className="bw-step-sub">Loading cleaning options…</p>
                    <div className="bw-skeleton-cards" style={{ marginTop: '1rem' }}>
                      <div className="bw-skeleton" />
                      <div className="bw-skeleton" />
                      <div className="bw-skeleton" />
                      <div className="bw-skeleton" />
                    </div>
                  </div>
                ) : (
                  <div className="bw-step-panel" key={step}>
                    {step === 1 && (
                      <BookingStepContact
                        name={formData.name}
                        email={formData.email}
                        phone={formData.phone}
                        onChange={handleChange}
                        fieldErrors={fieldErrors}
                      />
                    )}
                    {step === 2 && (
                      <BookingStepDetails
                        visitIntent={visitIntent}
                        propertyPill={propertyPill}
                        propertySize={propertySize}
                        otherDescribe={otherDescribe}
                        preferredDate={formData.preferred_date}
                        preferredTimeWindow={formData.preferred_time_window}
                        onVisitIntent={handleVisitIntent}
                        onPropertyPill={handlePropertyPill}
                        onPropertySize={handlePropertySize}
                        onOtherDescribe={handleOtherDescribe}
                        onPreferredDate={v => {
                          setFormData(prev => ({ ...prev, preferred_date: v }));
                          setFieldErrors(prev => {
                            const n = { ...prev };
                            delete n.preferred_date;
                            return n;
                          });
                        }}
                        onPreferredTimeWindow={v => {
                          setFormData(prev => ({ ...prev, preferred_time_window: v }));
                          setFieldErrors(prev => {
                            const n = { ...prev };
                            delete n.preferred_time_window;
                            return n;
                          });
                        }}
                        fieldErrors={fieldErrors}
                        servicesLoading={servicesLoading}
                        minDate={minDate}
                      />
                    )}
                    {step === 3 && (
                      <BookingStepConfirm
                        address={formData.address}
                        notes={formData.notes || ''}
                        promoCode={formData.promo_code || ''}
                        onChange={handleChange}
                        fieldErrors={fieldErrors}
                        currentService={currentService}
                        quoteBreakdown={quoteBreakdown}
                        vatRatePercent={vatConfig.vat_rate_percent}
                        activePromotionMatches={promoMatchesActive}
                        promoCodeValue={formData.promo_code || ''}
                      />
                    )}
                  </div>
                )}

                <div
                  className={`bw-actions bw-actions-row bw-actions-inline ${
                    step === 1 ? 'bw-actions-row--solo' : ''
                  }`}
                >
                  {step > 1 && (
                    <button type="button" className="bw-btn bw-btn-ghost" onClick={goBack} disabled={loading}>
                      Back
                    </button>
                  )}
                  {step < 3 ? (
                    <button
                      type="button"
                      className="bw-btn bw-btn-primary"
                      onClick={goNext}
                      disabled={loading || servicesLoading}
                    >
                      Continue
                    </button>
                  ) : (
                    <>
                      <button
                        type="submit"
                        className="bw-btn bw-btn-primary bw-btn-cta"
                        disabled={loading}
                        aria-busy={loading}
                      >
                        {loading ? (
                          <>
                            <span className="bw-btn-spinner" aria-hidden />
                            Checking…
                          </>
                        ) : (
                          <>
                            Check availability
                            <span className="bw-btn-cta-arrow" aria-hidden>
                              →
                            </span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
                {step === 3 && (
                  <p className="bw-microcopy">We usually respond within 15 minutes.</p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {!bootstrapError && !showEmptyServices && (
        <div className="bw-mobile-bar" aria-label="Booking actions">
          {step > 1 && (
            <button type="button" className="bw-btn bw-btn-ghost" onClick={goBack} disabled={loading}>
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              className="bw-btn bw-btn-primary"
              onClick={goNext}
              disabled={loading || servicesLoading}
            >
              Continue
            </button>
          ) : (
            <button
              type="submit"
              form="booking-wizard-form"
              className="bw-btn bw-btn-primary bw-btn-cta"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="bw-btn-spinner" aria-hidden />
                  Checking…
                </>
              ) : (
                <>
                  Check availability
                  <span className="bw-btn-cta-arrow" aria-hidden>
                    →
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default Booking;

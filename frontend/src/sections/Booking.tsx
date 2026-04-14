import { useState, useEffect, useMemo } from 'react';
import { createBooking, getServices, getActivePromotion, getVATConfig } from '../api/client';
import type { Service, Booking as BookingRecord, BookingFormData, Promotion, VATConfig } from '../types/api';
import './Booking.css';

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

const Booking = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastBooking, setLastBooking] = useState<BookingRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePromotion, setActivePromotion] = useState<Promotion | null>(null);
  const [vatConfig, setVatConfig] = useState<VATConfig>(DEFAULT_VAT_CONFIG);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<BookingFormData>({
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
    promo_code: '',
    promo_discount: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
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
        
        if (activeServices.length > 0) {
          setFormData(prev => {
            const updates: Partial<BookingFormData> = {};
            // Only set default if no service is selected
            if (!prev.service || prev.service === 0) {
              updates.service = activeServices[0].id;
            }
            // Auto-apply promo code if available
            if (promotion && !prev.promo_code) {
              updates.promo_code = promotion.promo_code;
              updates.promo_discount = promotion.discount_percentage;
            }
            return { ...prev, ...updates };
          });
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to fetch data:', error);
        }
        setError('We could not load services right now. Please refresh and try again.');
      } finally {
        setServicesLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]:
        name === 'service'
          ? (value ? parseInt(value, 10) : 0)
          : name === 'estimated_hours'
          ? (value ? parseFloat(value) || null : null)
          : value,
    }));
    setError(null);
    setFieldErrors(prev => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validateForm = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = 'Enter your full name.';
    if (!formData.email.trim()) {
      e.email = 'Enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = 'Enter a valid email address.';
    }
    if (!formData.phone.trim()) e.phone = 'Enter a phone number we can reach you on.';
    if (!formData.service || formData.service === 0) e.service = 'Choose a service.';
    if (!formData.preferred_date) e.preferred_date = 'Choose a preferred date.';
    if (!formData.preferred_time_window) e.preferred_time_window = 'Choose a time window.';
    if (!formData.address.trim()) e.address = 'Enter the service address.';
    if (formData.billing_type === 'hourly' && (!formData.estimated_hours || formData.estimated_hours <= 0)) {
      e.estimated_hours = 'Enter estimated hours for hourly pricing.';
    }
    return e;
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
        : parseFloat(currentService.price_from) || 0;

    let subtotal = base;

    if (formData.billing_type === 'hourly' && formData.estimated_hours && formData.estimated_hours > 0) {
      subtotal = base * formData.estimated_hours;
    }

    // Apply promo discount
    let discountAmount = 0;
    if (formData.promo_code && formData.promo_discount) {
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
    };
  }, [currentService, formData.billing_type, formData.estimated_hours, formData.promo_code, formData.promo_discount, vatConfig]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const errs = validateForm();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setError('Please complete all required fields so we can prepare your quote.');
      return;
    }
    setFieldErrors({});
    setLoading(true);

    try {
      const booking = await createBooking(formData);
      setLastBooking(booking);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: services[0]?.id || 0,
        job_type: 'residential',
        billing_type: 'fixed',
        preferred_date: '',
        preferred_time_window: '',
        address: '',
        notes: '',
        estimated_hours: null,
        promo_code: activePromotion?.promo_code || '',
        promo_discount: activePromotion?.discount_percentage || null,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'We could not submit your request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const successVatPercent =
      lastBooking?.vat_config?.vat_rate_percent ?? vatConfig.vat_rate_percent;

    return (
      <section id="booking" className="section booking-section">
        <div className="container">
          <div className="booking-success booking-success-panel">
            <h2>Request Received</h2>
            <p>
              Thanks for contacting Afri Cleans. We will review your request and follow up shortly
              with next steps.
            </p>
            {lastBooking && (
              <div className="booking-quote-breakdown">
                <h3>Your Estimate Breakdown</h3>
                <div className="quote-details">
                  {lastBooking.estimated_price != null && (
                    <div className="quote-line">
                      <span>Starting price:</span>
                      <span>{formatCurrency(Number(lastBooking.estimated_price))}</span>
                    </div>
                  )}
                  {lastBooking.promo_code && lastBooking.promo_discount && (
                    <div className="quote-line discount">
                      <span>Promo ({lastBooking.promo_code}): -{lastBooking.promo_discount}%</span>
                      <span>-{formatCurrency((Number(lastBooking.estimated_price || 0) * Number(lastBooking.promo_discount)) / 100)}</span>
                    </div>
                  )}
                  {lastBooking.subtotal != null && (
                    <div className="quote-line">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(Number(lastBooking.subtotal))}</span>
                    </div>
                  )}
                  {lastBooking.vat_amount != null && Number(lastBooking.vat_amount) > 0 && (
                    <div className="quote-line">
                      <span>VAT ({successVatPercent}%):</span>
                      <span>{formatCurrency(Number(lastBooking.vat_amount))}</span>
                    </div>
                  )}
                  {lastBooking.total_with_vat != null && (
                    <div className="quote-line total">
                      <span><strong>Estimated total:</strong></span>
                      <span><strong>{formatCurrency(Number(lastBooking.total_with_vat))}</strong></span>
                    </div>
                  )}
                </div>
                <p className="quote-note">
                  This is an estimate. Final pricing is confirmed after we review your request.
                </p>
              </div>
            )}
            <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
              Get Another Quote
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="section booking-section">
      <div className="container">
        <div className="booking-layout">
          <div className="booking-intro">
            <h2>Ready for a Cleaner, Healthier Space?</h2>
            <p>Let Afri Cleans create a plan that fits your home or business.</p>
          </div>

        <form className="booking-form" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="Enter your full name"
                aria-invalid={fieldErrors.name ? true : undefined}
                aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              />
              {fieldErrors.name && (
                <span id="name-error" className="field-error" role="alert">
                  {fieldErrors.name}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                placeholder="name@example.com"
                aria-invalid={fieldErrors.email ? true : undefined}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && (
                <span id="email-error" className="field-error" role="alert">
                  {fieldErrors.email}
                </span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="job_type">Property Type *</label>
              <select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                required
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="hourly">Hourly service</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="billing_type">Pricing Type *</label>
              <select
                id="billing_type"
                name="billing_type"
                value={formData.billing_type}
                onChange={handleChange}
                required
              >
                <option value="fixed">Fixed quote</option>
                <option value="hourly">Hourly rate</option>
              </select>
            </div>
          </div>

          {formData.billing_type === 'hourly' && (
            <div className="form-group">
              <label htmlFor="estimated_hours">Estimated Hours *</label>
              <input
                type="number"
                id="estimated_hours"
                name="estimated_hours"
                min={0.5}
                step={0.5}
                value={formData.estimated_hours ?? ''}
                onChange={handleChange}
                placeholder="Example: 3.5"
                aria-invalid={fieldErrors.estimated_hours ? true : undefined}
                aria-describedby={fieldErrors.estimated_hours ? 'estimated_hours-error' : undefined}
              />
              {fieldErrors.estimated_hours && (
                <span id="estimated_hours-error" className="field-error" role="alert">
                  {fieldErrors.estimated_hours}
                </span>
              )}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
                placeholder="Best number to reach you"
                aria-invalid={fieldErrors.phone ? true : undefined}
                aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
              />
              {fieldErrors.phone && (
                <span id="phone-error" className="field-error" role="alert">
                  {fieldErrors.phone}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="service">Service Needed *</label>
              <select
                id="service"
                name="service"
                value={formData.service || ''}
                onChange={handleChange}
                required
                disabled={servicesLoading}
                aria-invalid={fieldErrors.service ? true : undefined}
                aria-describedby={
                  [fieldErrors.service && 'service-error', servicesLoading && 'service-loading-hint']
                    .filter(Boolean)
                    .join(' ') || undefined
                }
              >
                <option value="">Choose a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              {servicesLoading && (
                <span id="service-loading-hint" className="form-loading-text">
                  Loading available services...
                </span>
              )}
              {fieldErrors.service && (
                <span id="service-error" className="field-error" role="alert">
                  {fieldErrors.service}
                </span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="preferred_date">Preferred Date *</label>
              <input
                type="date"
                id="preferred_date"
                name="preferred_date"
                value={formData.preferred_date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                aria-invalid={fieldErrors.preferred_date ? true : undefined}
                aria-describedby={fieldErrors.preferred_date ? 'preferred_date-error' : undefined}
              />
              {fieldErrors.preferred_date && (
                <span id="preferred_date-error" className="field-error" role="alert">
                  {fieldErrors.preferred_date}
                </span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="preferred_time_window">Preferred Time Window *</label>
              <select
                id="preferred_time_window"
                name="preferred_time_window"
                value={formData.preferred_time_window}
                onChange={handleChange}
                required
                aria-invalid={fieldErrors.preferred_time_window ? true : undefined}
                aria-describedby={fieldErrors.preferred_time_window ? 'preferred_time_window-error' : undefined}
              >
                <option value="">Choose a time window</option>
                <option value="Morning (8am-12pm)">Morning (8am-12pm)</option>
                <option value="Afternoon (12pm-4pm)">Afternoon (12pm-4pm)</option>
                <option value="Evening (4pm-8pm)">Evening (4pm-8pm)</option>
              </select>
              {fieldErrors.preferred_time_window && (
                <span id="preferred_time_window-error" className="field-error" role="alert">
                  {fieldErrors.preferred_time_window}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
              <label htmlFor="address">Service Address *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              autoComplete="street-address"
              placeholder="Street, area, city"
              aria-invalid={fieldErrors.address ? true : undefined}
              aria-describedby={fieldErrors.address ? 'address-error' : undefined}
            />
            {fieldErrors.address && (
              <span id="address-error" className="field-error" role="alert">
                {fieldErrors.address}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="promo_code">Promo Code (Optional)</label>
            <input
              type="text"
              id="promo_code"
              name="promo_code"
              value={formData.promo_code || ''}
              onChange={handleChange}
              placeholder="Enter code if you have one"
            />
            {activePromotion && formData.promo_code === activePromotion.promo_code && (
              <span className="promo-applied">
                ✓ {activePromotion.discount_percentage}% discount applied
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Access Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Gate code, parking info, or specific cleaning priorities"
            />
          </div>

          {quoteBreakdown != null && currentService && (
            <div className="quote-summary">
              <h3>Your Estimate Breakdown</h3>
              <div className="quote-details">
                <div className="quote-line">
                  <span>Starting price:</span>
                  <span>{formatCurrency(quoteBreakdown.basePrice)}</span>
                </div>
                {formData.billing_type === 'hourly' && formData.estimated_hours && (
                  <div className="quote-line">
                    <span>Hours: {formData.estimated_hours}</span>
                    <span>@ {formatCurrency(typeof currentService.price_from === 'number' ? currentService.price_from : Number(currentService.price_from ?? 0))}/hr</span>
                  </div>
                )}
                {quoteBreakdown.discountAmount > 0 && (
                  <div className="quote-line discount">
                    <span>Promo Discount ({formData.promo_code}):</span>
                    <span>-{formatCurrency(quoteBreakdown.discountAmount)}</span>
                  </div>
                )}
                <div className="quote-line">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(quoteBreakdown.subtotal)}</span>
                </div>
                {quoteBreakdown.vatAmount > 0 && (
                  <div className="quote-line">
                    <span>VAT ({vatConfig.vat_rate_percent}%):</span>
                    <span>{formatCurrency(quoteBreakdown.vatAmount)}</span>
                  </div>
                )}
                <div className="quote-line total">
                  <span><strong>Estimated total:</strong></span>
                  <span><strong>{formatCurrency(quoteBreakdown.totalWithVat)}</strong></span>
                </div>
              </div>
              <p className="quote-note">
                VAT is applied based on current UK business registration settings and final scope.
              </p>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary booking-submit-btn"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span className="booking-btn-spinner" aria-hidden />
                Sending…
              </>
            ) : (
              'Get My Free Quote'
            )}
          </button>
        </form>
        </div>
      </div>
    </section>
  );
};

export default Booking;


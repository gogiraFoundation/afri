import { useState, useEffect, useMemo } from 'react';
import { createBooking, getServices, getActivePromotion } from '../api/client';
import type { Service, BookingFormData, Promotion } from '../types/api';
import './Booking.css';

const Booking = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastBooking, setLastBooking] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activePromotion, setActivePromotion] = useState<Promotion | null>(null);
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
        const [servicesData, promotion] = await Promise.all([
          getServices(),
          getActivePromotion(),
        ]);
        
        const activeServices = servicesData.filter(s => s.is_active);
        setServices(activeServices);
        setActivePromotion(promotion);
        
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
        console.error('Failed to fetch data:', error);
        setError('Failed to load services. Please refresh the page.');
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

    // Calculate VAT (15% default)
    const vatRate = 0.15;
    const vatAmount = subtotal * vatRate;
    const totalWithVat = subtotal + vatAmount;

    return {
      basePrice: base,
      discountAmount,
      subtotal,
      vatAmount,
      totalWithVat,
    };
  }, [currentService, formData.billing_type, formData.estimated_hours, formData.promo_code, formData.promo_discount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.service ||
      formData.service === 0 ||
      !formData.preferred_date ||
      !formData.preferred_time_window ||
      !formData.address
    ) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (formData.billing_type === 'hourly' && (!formData.estimated_hours || formData.estimated_hours <= 0)) {
      setError('Please provide estimated hours for hourly billing.');
      setLoading(false);
      return;
    }

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
      setError(err instanceof Error ? err.message : 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section id="booking" className="section booking-section">
        <div className="container">
          <div className="booking-success">
            <h2>Thank You!</h2>
            <p>Your booking request has been submitted successfully. We'll contact you shortly to confirm your appointment.</p>
            {lastBooking && (
              <div className="booking-quote-breakdown">
                <h3>Estimated Quote Breakdown:</h3>
                <div className="quote-details">
                  {lastBooking.estimated_price != null && (
                    <div className="quote-line">
                      <span>Base Price:</span>
                      <span>${parseFloat(lastBooking.estimated_price).toFixed(2)}</span>
                    </div>
                  )}
                  {lastBooking.promo_code && lastBooking.promo_discount && (
                    <div className="quote-line discount">
                      <span>Promo ({lastBooking.promo_code}): -{lastBooking.promo_discount}%</span>
                      <span>-${((parseFloat(lastBooking.estimated_price || 0) * parseFloat(lastBooking.promo_discount)) / 100).toFixed(2)}</span>
                    </div>
                  )}
                  {lastBooking.subtotal != null && (
                    <div className="quote-line">
                      <span>Subtotal:</span>
                      <span>${parseFloat(lastBooking.subtotal).toFixed(2)}</span>
                    </div>
                  )}
                  {lastBooking.vat_amount != null && parseFloat(lastBooking.vat_amount) > 0 && (
                    <div className="quote-line">
                      <span>VAT (15%):</span>
                      <span>${parseFloat(lastBooking.vat_amount).toFixed(2)}</span>
                    </div>
                  )}
                  {lastBooking.total_with_vat != null && (
                    <div className="quote-line total">
                      <span><strong>Total Estimate:</strong></span>
                      <span><strong>${parseFloat(lastBooking.total_with_vat).toFixed(2)}</strong></span>
                    </div>
                  )}
                </div>
                <p className="quote-note">
                  This is an instant estimate. Final pricing will be confirmed after our team reviews your request.
                </p>
              </div>
            )}
            <button className="btn btn-primary" onClick={() => setSubmitted(false)}>
              Book Another Service
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="section booking-section">
      <div className="container">
        <div className="booking-header">
          <span className="section-title">Book a Service</span>
          <h2>Get Your Free Estimate</h2>
          <p>Fill out the form below and we'll get back to you as soon as possible.</p>
        </div>

        <form className="booking-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

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
                placeholder="John Doe"
              />
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
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="job_type">Cleaning Type *</label>
              <select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                required
              >
                <option value="residential">Residential cleaning</option>
                <option value="commercial">Commercial cleaning</option>
                <option value="office">Office cleaning</option>
                <option value="hourly">Per-hour cleaning</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="billing_type">Billing Preference *</label>
              <select
                id="billing_type"
                name="billing_type"
                value={formData.billing_type}
                onChange={handleChange}
                required
              >
                <option value="fixed">Fixed package</option>
                <option value="hourly">Hourly billing</option>
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
                placeholder="e.g. 3.5"
              />
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
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div className="form-group">
              <label htmlFor="service">Service Type *</label>
              <select
                id="service"
                name="service"
                value={formData.service || ''}
                onChange={handleChange}
                required
                disabled={servicesLoading}
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              {servicesLoading && (
                <span className="form-loading-text">Loading services...</span>
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
              />
            </div>
            <div className="form-group">
              <label htmlFor="preferred_time_window">Preferred Time *</label>
              <select
                id="preferred_time_window"
                name="preferred_time_window"
                value={formData.preferred_time_window}
                onChange={handleChange}
                required
              >
                <option value="">Select time</option>
                <option value="Morning (8am-12pm)">Morning (8am-12pm)</option>
                <option value="Afternoon (12pm-4pm)">Afternoon (12pm-4pm)</option>
                <option value="Evening (4pm-8pm)">Evening (4pm-8pm)</option>
              </select>
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
              placeholder="123 Main St, City, State ZIP"
            />
          </div>

          <div className="form-group">
            <label htmlFor="promo_code">Promotional Code (Optional)</label>
            <input
              type="text"
              id="promo_code"
              name="promo_code"
              value={formData.promo_code || ''}
              onChange={handleChange}
              placeholder="Enter promo code"
            />
            {activePromotion && formData.promo_code === activePromotion.promo_code && (
              <span className="promo-applied">
                ✓ {activePromotion.discount_percentage}% discount applied!
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="notes">Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Any special instructions or requirements..."
            />
          </div>

          {quoteBreakdown != null && currentService && (
            <div className="quote-summary">
              <h3>Estimated Quote Breakdown:</h3>
              <div className="quote-details">
                <div className="quote-line">
                  <span>Base Price:</span>
                  <span>${quoteBreakdown.basePrice.toFixed(2)}</span>
                </div>
                {formData.billing_type === 'hourly' && formData.estimated_hours && (
                  <div className="quote-line">
                    <span>Hours: {formData.estimated_hours}</span>
                    <span>@ ${(typeof currentService.price_from === 'number' ? currentService.price_from : parseFloat(currentService.price_from) || 0).toFixed(2)}/hr</span>
                  </div>
                )}
                {quoteBreakdown.discountAmount > 0 && (
                  <div className="quote-line discount">
                    <span>Promo Discount ({formData.promo_code}):</span>
                    <span>-${quoteBreakdown.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="quote-line">
                  <span>Subtotal:</span>
                  <span>${quoteBreakdown.subtotal.toFixed(2)}</span>
                </div>
                <div className="quote-line">
                  <span>VAT (15%):</span>
                  <span>${quoteBreakdown.vatAmount.toFixed(2)}</span>
                </div>
                <div className="quote-line total">
                  <span><strong>Total Estimate:</strong></span>
                  <span><strong>${quoteBreakdown.totalWithVat.toFixed(2)}</strong></span>
                </div>
              </div>
              <p className="quote-note">
                Taxes are calculated based on the current standard rate and may vary depending on your exact location and service scope.
              </p>
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Booking Request'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Booking;


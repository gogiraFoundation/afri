import { useState, useEffect } from 'react';
import { getActivePromotion } from '../api/client';
import type { Promotion } from '../types/api';
import './PromoBanner.css';

const STATIC_PROMO_DISMISS_KEY = 'promo_dismissed_static_trust';

const PromoBanner = () => {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const promo = await getActivePromotion();
        setPromotion(promo);
        if (promo && promo.is_currently_active) {
          const dismissedKey = `promo_dismissed_${promo.id}`;
          setIsDismissed(localStorage.getItem(dismissedKey) === 'true');
        } else {
          setIsDismissed(localStorage.getItem(STATIC_PROMO_DISMISS_KEY) === 'true');
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('Failed to fetch promotion:', error);
        }
        setIsDismissed(localStorage.getItem(STATIC_PROMO_DISMISS_KEY) === 'true');
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, []);

  const handleDismiss = () => {
    if (promotion && promotion.is_currently_active) {
      const dismissedKey = `promo_dismissed_${promotion.id}`;
      localStorage.setItem(dismissedKey, 'true');
    } else {
      localStorage.setItem(STATIC_PROMO_DISMISS_KEY, 'true');
    }
    setIsDismissed(true);
  };

  const handleClaimOffer = () => {
    const element = document.getElementById('booking');
    if (element) {
      const prefersReduced =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  };

  if (loading || isDismissed) {
    return null;
  }

  if (!promotion || !promotion.is_currently_active) {
    return (
      <div className="promo-banner">
        <div className="container promo-banner-container">
          <div className="promo-content">
            <span className="promo-badge">Trust</span>
            <div className="promo-text">
              <strong className="promo-title">Background-checked team</strong>
              <span className="promo-subtitle">Eco-conscious products and flexible scheduling available.</span>
            </div>
          </div>
          <div className="promo-actions">
            <a href="/#booking" className="promo-text-cta">
              Get a Free Quote
            </a>
            <button
              type="button"
              className="promo-dismiss"
              onClick={handleDismiss}
              aria-label="Dismiss promotion"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="promo-banner">
      <div className="container promo-banner-container">
        <div className="promo-content">
          {promotion.badge_text && (
            <span className="promo-badge">{promotion.badge_text}</span>
          )}
          <div className="promo-text">
            <strong className="promo-title">{promotion.title}</strong>
            {promotion.subtitle && (
              <span className="promo-subtitle">{promotion.subtitle}</span>
            )}
          </div>
        </div>
        <div className="promo-actions">
          <button type="button" className="btn btn-primary promo-cta" onClick={handleClaimOffer}>
            Get a Free Quote
          </button>
          <button
            type="button"
            className="promo-dismiss"
            onClick={handleDismiss}
            aria-label="Dismiss promotion"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;

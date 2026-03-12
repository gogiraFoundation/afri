import { useState, useEffect } from 'react';
import { getActivePromotion } from '../api/client';
import type { Promotion } from '../types/api';
import './PromoBanner.css';

const PromoBanner = () => {
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const promo = await getActivePromotion();
        setPromotion(promo);
        // Check if user has dismissed this promotion
        if (promo) {
          const dismissedKey = `promo_dismissed_${promo.id}`;
          const dismissed = localStorage.getItem(dismissedKey);
          setIsDismissed(dismissed === 'true');
        }
      } catch (error) {
        console.error('Failed to fetch promotion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, []);

  const handleDismiss = () => {
    if (promotion) {
      const dismissedKey = `promo_dismissed_${promotion.id}`;
      localStorage.setItem(dismissedKey, 'true');
      setIsDismissed(true);
    }
  };

  const handleClaimOffer = () => {
    const element = document.getElementById('booking');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || !promotion || isDismissed || !promotion.is_currently_active) {
    return null;
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
          <button className="btn btn-primary promo-cta" onClick={handleClaimOffer}>
            Claim Offer →
          </button>
          <button
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


import { logoSrc, SITE_BRAND, SITE_TAGLINE } from '../config/site';
import './BrandLogo.css';

type BrandLogoVariant = 'header' | 'footer' | 'print';

type BrandLogoProps = {
  variant?: BrandLogoVariant;
  className?: string;
  linkToHome?: boolean;
};

const BrandLogo = ({
  variant = 'header',
  className = '',
  linkToHome = true,
}: BrandLogoProps) => {
  const alt = `${SITE_BRAND} — ${SITE_TAGLINE}`;
  const classes = ['brand-logo', `brand-logo--${variant}`, className].filter(Boolean).join(' ');

  const image = (
    <img
      className="brand-logo-img"
      src={logoSrc}
      alt={alt}
      width={160}
      height={48}
      decoding="async"
    />
  );

  if (linkToHome) {
    return (
      <a href="/" className={classes}>
        {image}
      </a>
    );
  }

  return <span className={classes}>{image}</span>;
};

export default BrandLogo;

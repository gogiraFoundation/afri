import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.tsx';
import MarketingLayout from './components/MarketingLayout';
import BrochurePage from './pages/BrochurePage';
import BlogPostPage from './pages/BlogPostPage';
import PricingPage from './pages/PricingPage';
import ServicesPage from './pages/ServicesPage';
import CleaningServicesNearMePage from './pages/CleaningServicesNearMePage';
import BlogTopicsPage from './pages/BlogTopicsPage';
import GoogleMapsSEOPage from './pages/GoogleMapsSEOPage';

export function RootApp() {
  const path = window.location.pathname;

  if (path === '/pricing') {
    return (
      <MarketingLayout>
        <PricingPage />
      </MarketingLayout>
    );
  }

  if (path === '/services') {
    return (
      <MarketingLayout>
        <ServicesPage />
      </MarketingLayout>
    );
  }

  if (path === '/cleaning-services-near-me') {
    return (
      <MarketingLayout>
        <CleaningServicesNearMePage />
      </MarketingLayout>
    );
  }

  if (path === '/blog') {
    return (
      <MarketingLayout>
        <BlogTopicsPage />
      </MarketingLayout>
    );
  }

  if (path === '/google-maps-seo') {
    return (
      <MarketingLayout>
        <GoogleMapsSEOPage />
      </MarketingLayout>
    );
  }

  if (path === '/brochure') {
    return (
      <MarketingLayout>
        <BrochurePage />
      </MarketingLayout>
    );
  }

  if (path.startsWith('/blog/')) {
    const slug = decodeURIComponent(path.replace('/blog/', '').replace(/\/$/, ''));
    return (
      <MarketingLayout>
        <BlogPostPage slug={slug} />
      </MarketingLayout>
    );
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
);

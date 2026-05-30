import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.tsx';
import MarketingLayout from './components/MarketingLayout';
import BrochurePage from './pages/BrochurePage';
import PricingPage from './pages/PricingPage';
import ServicesPage from './pages/ServicesPage';
import CleaningServicesNearMePage from './pages/CleaningServicesNearMePage';
import GoogleMapsSEOPage from './pages/GoogleMapsSEOPage';
import BookRedirect from './pages/BookRedirect';
import OnePagerPage from './pages/OnePagerPage';

export function RootApp() {
  const path = window.location.pathname;

  if (path === '/book') {
    return <BookRedirect />;
  }

  if (path === '/one-pager') {
    return <OnePagerPage />;
  }

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

  if (path === '/google-maps-seo') {
    return (
      <MarketingLayout>
        <GoogleMapsSEOPage />
      </MarketingLayout>
    );
  }

  if (path === '/brochure') {
    return <BrochurePage />;
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
);

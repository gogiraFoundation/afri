import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.tsx';
import BrochurePage from './pages/BrochurePage';
import BlogPostPage from './pages/BlogPostPage';
import PricingPage from './pages/PricingPage';
import ServicesPage from './pages/ServicesPage';
import CleaningServicesNearMePage from './pages/CleaningServicesNearMePage';
import BlogTopicsPage from './pages/BlogTopicsPage';
import GoogleMapsSEOPage from './pages/GoogleMapsSEOPage';

const RootApp = () => {
  const path = window.location.pathname;

  if (path === '/pricing') {
    return <PricingPage />;
  }

  if (path === '/services') {
    return <ServicesPage />;
  }

  if (path === '/cleaning-services-near-me') {
    return <CleaningServicesNearMePage />;
  }

  if (path === '/blog') {
    return <BlogTopicsPage />;
  }

  if (path === '/google-maps-seo') {
    return <GoogleMapsSEOPage />;
  }

  if (path === '/brochure') {
    return <BrochurePage />;
  }

  if (path.startsWith('/blog/')) {
    const slug = decodeURIComponent(path.replace('/blog/', '').replace(/\/$/, ''));
    return <BlogPostPage slug={slug} />;
  }

  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>,
);

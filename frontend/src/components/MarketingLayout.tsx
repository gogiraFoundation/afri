import { useEffect, type ReactNode } from 'react';
import PromoBanner from './PromoBanner';
import Navbar from './Navbar';
import Footer from './Footer';
import '../App.css';

export function MarketingLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const scrollToHash = () => {
      const { hash } = window.location;
      if (!hash) return;
      const id = hash.substring(1);
      if (!id) return;
      const attemptScroll = (retries: number) => {
        const element = document.getElementById(id);
        if (element) {
          const prefersReduced =
            typeof window.matchMedia === 'function' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          element.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
        } else if (retries > 0) {
          window.setTimeout(() => attemptScroll(retries - 1), 100);
        }
      };
      attemptScroll(5);
    };

    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <div className="App">
      <header className="site-header">
        <PromoBanner />
        <Navbar />
      </header>
      <main>{children}</main>
      <Footer />
    </div>
  );
}

export default MarketingLayout;

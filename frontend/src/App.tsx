import { useEffect } from 'react';
import Navbar from './components/Navbar';
import PromoBanner from './components/PromoBanner';
import Hero from './sections/Hero';
import AboutUs from './sections/AboutUs';
import Services from './sections/Services';
import WhyChooseUs from './sections/WhyChooseUs';
import Testimonials from './sections/Testimonials';
import Booking from './sections/Booking';
import FAQ from './sections/FAQ';
import Blog from './sections/Blog';
import Footer from './components/Footer';
import './App.css';

function App() {
  useEffect(() => {
    const scrollToHash = () => {
      const { hash } = window.location;
      if (!hash) return;
      const id = hash.substring(1);
      if (!id) return;
      const attemptScroll = (retries: number) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        } else if (retries > 0) {
          window.setTimeout(() => attemptScroll(retries - 1), 100);
        }
      };
      attemptScroll(5);
    };

    // Scroll on initial load
    scrollToHash();

    // Handle subsequent hash changes
    window.addEventListener('hashchange', scrollToHash);
    return () => window.removeEventListener('hashchange', scrollToHash);
  }, []);

  return (
    <div className="App">
      <PromoBanner />
      <Navbar />
      <main>
        <Hero />
        <AboutUs />
        <Services />
        <WhyChooseUs />
        <Testimonials />
        <Booking />
        <FAQ />
        <Blog />
      </main>
      <Footer />
    </div>
  );
}

export default App;

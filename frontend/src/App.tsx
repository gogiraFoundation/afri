import MarketingLayout from './components/MarketingLayout';
import Hero from './sections/Hero';
import AboutUs from './sections/AboutUs';
import Services from './sections/Services';
import WhyChooseUs from './sections/WhyChooseUs';
import Process from './sections/Process';
import Testimonials from './sections/Testimonials';
import ContactQuote from './sections/ContactQuote';
import FAQ from './sections/FAQ';

function App() {
  return (
    <MarketingLayout>
      <Hero />
      <AboutUs />
      <Services />
      <WhyChooseUs />
      <Process />
      <Testimonials />
      <ContactQuote />
      <FAQ />
    </MarketingLayout>
  );
}

export default App;

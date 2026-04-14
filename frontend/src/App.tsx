import MarketingLayout from './components/MarketingLayout';
import Hero from './sections/Hero';
import AboutUs from './sections/AboutUs';
import Services from './sections/Services';
import WhyChooseUs from './sections/WhyChooseUs';
import Process from './sections/Process';
import Testimonials from './sections/Testimonials';
import Booking from './sections/Booking';
import FAQ from './sections/FAQ';
import Blog from './sections/Blog';

function App() {
  return (
    <MarketingLayout>
      <Hero />
      <AboutUs />
      <Services />
      <WhyChooseUs />
      <Process />
      <Testimonials />
      <Booking />
      <FAQ />
      <Blog />
    </MarketingLayout>
  );
}

export default App;

import { useEffect } from 'react';
import './BlogTopicsPage.css';

const topics: string[] = [
  'How Often Should You Deep Clean Your Home?',
  '10 Benefits of Professional Cleaning Services',
  'The Ultimate Guide to Residential Cleaning',
  'Office Cleaning Tips for a Productive Workplace',
  'How Professional Cleaning Improves Indoor Air Quality',
  'Why Carpet Cleaning Is Essential for a Healthy Home',
  'Eco-Friendly Cleaning Tips for Modern Homes',
  'The Difference Between Deep Cleaning and Regular Cleaning',
  'How to Remove Stubborn Carpet Stains',
  'Why Businesses Need Professional Cleaning Services',
  'Kitchen Cleaning Tips for a Germ-Free Home',
  'Bathroom Cleaning Tips to Prevent Mold',
  'How to Maintain a Clean Office Environment',
  'Spring Cleaning Checklist for Every Home',
  'Move-In Cleaning Guide',
  'Move-Out Cleaning Checklist',
  'How Cleaning Improves Mental Health',
  'Best Cleaning Tips for Busy Families',
  'Benefits of Hiring Professional Cleaners',
  'How to Keep Your Home Dust-Free',
  'Cleaning Tips for Pet Owners',
  'The Importance of Window Cleaning',
  'Post-Construction Cleaning Guide',
  'Home Sanitization Tips',
  'Carpet Maintenance Guide',
  'Cleaning Mistakes to Avoid',
  'Best Cleaning Products for Your Home',
  'How Often Should Offices Be Cleaned?',
  'Professional Cleaning vs DIY Cleaning',
  'The Future of Eco-Friendly Cleaning',
];

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

const BlogTopicsPage = () => {
  useEffect(() => {
    document.title = 'Cleaning Tips & Blog Topics | Afri Cleans';
  }, []);

  const goToBooking = () => {
    window.location.href = '/#booking';
  };

  const goToBrochure = () => {
    window.location.href = '/brochure';
  };

  return (
    <div className="blog-topics-page">
      <header className="section blog-topics-hero">
        <div className="container blog-topics-hero-container">
          <div className="blog-topics-hero-content">
            <span className="section-title">Cleaning Tips & Guides</span>
            <h1>Cleaning Blog Topics That Attract the Right Clients</h1>
            <p>
              These <strong>30 SEO-optimized blog topics</strong> are designed to rank on Google and bring in
              homeowners and businesses searching for professional cleaning advice and services.
            </p>
            <div className="blog-topics-hero-actions">
              <button className="btn btn-primary" onClick={goToBooking}>
                Book a Cleaning →
              </button>
              <button className="btn btn-outline" onClick={goToBrochure}>
                Download Service Brochure
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="section blog-topics-section">
          <div className="container">
            <h2>30 SEO Blog Articles for Cleaning Services</h2>
            <p className="blog-topics-intro">
              Use these topics to build a content library around residential cleaning, office cleaning, carpet care,
              eco-friendly solutions, and more. Each idea targets <strong>high-intent, high-traffic keywords</strong>.
            </p>

            <ol className="blog-topics-list">
              {topics.map((topic, index) => {
                const slug = slugify(topic);
                return (
                  <li key={topic} className="blog-topic-item">
                    <a
                      href={`/blog/${encodeURIComponent(slug)}`}
                      className="blog-topic-link"
                    >
                      <span className="blog-topic-number">{index + 1}.</span>
                      <span className="blog-topic-title">{topic}</span>
                      <span className="blog-topic-pill">Coming soon</span>
                    </a>
                  </li>
                );
              })}
            </ol>

            <div className="blog-topics-footer-cta">
              <h3>Turn Readers into Cleaning Clients</h3>
              <p>
                Add clear calls-to-action in every article to invite readers to request a quote, schedule a clean, or
                contact Afri Cleans for help with their home or office.
              </p>
              <div className="blog-topics-hero-actions">
                <button className="btn btn-primary" onClick={goToBooking}>
                  Get Your Free Estimate →
                </button>
                <button className="btn btn-outline" onClick={goToBrochure}>
                  View Our Services Brochure
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default BlogTopicsPage;


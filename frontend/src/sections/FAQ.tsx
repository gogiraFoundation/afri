import './FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      question: 'How much do cleaning services cost?',
      answer:
        'Cleaning costs depend on the size of the property and the type of cleaning required. Contact Afri Cleans for a free personalized quote.',
    },
    {
      question: 'How often should I schedule cleaning services?',
      answer:
        'Most clients choose weekly or bi-weekly cleaning services to maintain a consistently clean environment.',
    },
    {
      question: 'Do you bring your own cleaning supplies?',
      answer:
        'Yes, our team arrives fully equipped with professional cleaning tools and eco-friendly cleaning products.',
    },
    {
      question: 'Do you offer deep cleaning services?',
      answer:
        'Yes. Our deep cleaning services target hidden dirt and bacteria in kitchens, bathrooms, carpets, and other hard-to-reach areas.',
    },
  ];

  return (
    <section id="faq" className="section faq-section">
      <div className="container">
        <div className="faq-header">
          <span className="section-title">FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <p className="faq-intro">
            Find quick answers to common questions about our professional cleaning services, pricing,
            and what to expect from Afri Cleans.
          </p>
        </div>

        <div className="faq-list">
          {faqs.map((item, index) => (
            <div key={item.question} className="faq-item">
              <div className="faq-question">
                <span className="faq-number">{index + 1}.</span>
                <h3>{item.question}</h3>
              </div>
              <p className="faq-answer">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;


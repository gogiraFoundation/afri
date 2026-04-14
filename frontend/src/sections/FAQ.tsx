import './FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      question: 'How much do cleaning services cost?',
      answer:
        'Pricing depends on your space size, service type, and frequency. Share your requirements and we will provide a clear quote before work starts.',
    },
    {
      question: 'How often should I schedule cleaning services?',
      answer:
        'Many clients choose weekly or bi-weekly service, while others prefer monthly or one-time deep cleans.',
    },
    {
      question: 'Do you bring your own cleaning supplies?',
      answer:
        'Yes. Our team arrives with cleaning tools and products, and eco-conscious options are available on request.',
    },
    {
      question: 'Do you offer deep cleaning services?',
      answer:
        'Yes. Deep cleaning focuses on detailed areas such as kitchens, bathrooms, and other high-touch spaces.',
    },
  ];

  return (
    <section id="faq" className="section faq-section">
      <div className="container">
        <div className="faq-header">
          <span className="section-title">FAQ</span>
          <h2>Frequently Asked Questions</h2>
          <p className="faq-intro">
            Quick answers on service scope, scheduling, and what to expect from Afri Cleans.
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


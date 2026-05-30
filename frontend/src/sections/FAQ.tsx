import './FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      question: 'Do I need to be home?',
      answer:
        'No. Most clients give us a key or set a lockbox, and we are fully insured for keyholding so you can carry on with your day.',
    },
    {
      question: 'What if something is missed?',
      answer:
        "If you are not delighted, just tell us within 24 hours. We will re-clean the area free of charge. That is our Afri promise.",
    },
    {
      question: 'Are your products really safe for my cats?',
      answer:
        'Absolutely. We use only plant-based, biodegradable, cruelty-free cleaners. Never bleach, never ammonia.',
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


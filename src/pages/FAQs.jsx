import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';
import { faqs } from '../data/faqs';

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <motion.div
      className="glass rounded-2xl overflow-hidden mb-4 border border-blue/20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <motion.button
        onClick={onClick}
        className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-bg-lighter transition-colors"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-start gap-4 flex-1">
          <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-blue/30">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-text pr-4">{faq.question}</h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-6 h-6 text-blue" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pl-[88px]">
              <p className="text-text-dim leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQs() {
  const [openFaqId, setOpenFaqId] = useState(null);

  const handleToggle = (faqId) => {
    setOpenFaqId(openFaqId === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 glass px-6 py-2 rounded-full mb-6 border border-blue/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <MessageSquare className="w-5 h-5 text-blue" />
            <span className="text-text font-medium">Frequently Asked Questions</span>
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-text mb-6">
            Got Questions?
            <br />
            <span className="gradient-text">We've Got Answers</span>
          </h1>

          <p className="text-xl text-text-dim max-w-2xl mx-auto">
            Find answers to common questions about our eBook collection, downloads, and more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              isOpen={openFaqId === faq.id}
              onClick={() => handleToggle(faq.id)}
            />
          ))}
        </motion.div>

        <motion.div
          className="mt-16 glass rounded-3xl p-10 text-center border border-blue/30"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <HelpCircle className="w-16 h-16 mx-auto mb-4 text-blue" />
          <h2 className="text-2xl font-bold text-text mb-4">Still have questions?</h2>
          <p className="text-text-dim mb-6">
            Can't find the answer you're looking for? Feel free to reach out to us!
          </p>
          <motion.button
            className="gradient-primary text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Contact Us
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

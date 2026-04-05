import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqData = [
  {
    question: "What exactly is a Spraying Drone?",
    answer: "A spraying drone is an unmanned aerial vehicle (UAV) specifically designed to apply liquid fertilizers, pesticides, and herbicides to crops. It replaces manual labor and heavy machinery, providing more precise targeting and zero soil compaction."
  },
  {
    question: "Whom should I contact to access these services?",
    answer: "You can book our high-end drone services directly through our 'Booking' page or by reaching out via the 'Contact Us' section. Our team will handle the entire operation from site survey to final spray report."
  },
  {
    question: "How do agricultural drones help me save money?",
    answer: "Drones reduce chemical waste by up to 30% through precision targeting. They also save on labor costs and prevent crop damage that typically occurs with heavy ground-based machinery, leading to higher yields and lower input costs."
  },
  {
    question: "Are agricultural drones hard to use?",
    answer: "For our customers, not at all. We provide full-service operations, meaning our certified pilots and technicians handle everything. You simply schedule the service, and we ensure it's executed with professional precision."
  },
  {
    question: "Which crops can I use agricultural drones on?",
    answer: "Our drones are versatile and can be used on almost all major Indian crops, including Paddy, Wheat, Sugarcane, Cotton, and various horticultural plantations. The height and spread of the crop are automatically accounted for by our smart flight systems."
  },
  {
    question: "How much does a farming drone session cost?",
    answer: "Pricing is calculated based on the acreage and the type of application required. We offer competitive per-acre rates that are significantly more efficient than traditional manual spraying. Contact us for a custom quote based on your specific farm size."
  }
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="bg-[#f6f4ee] py-24 px-6 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-[#18241c] sm:text-5xl">
            Frequently asked questions
          </h2>
          <div className="mt-4 h-1.5 w-24 bg-[#28593b] mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="overflow-hidden rounded-2xl border border-[#d1dbc1] shadow-sm transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className={`flex w-full items-center justify-between p-6 text-left transition-colors duration-500 ${
                  activeIndex === index ? 'bg-[#18241c] text-white' : 'bg-[#f5f7f2] text-[#18241c]'
                }`}
              >
                <span className="text-lg font-bold pr-8">{faq.question}</span>
                <span className={`text-2xl transition-transform duration-500 ${activeIndex === index ? 'rotate-45' : 'rotate-0'}`}>
                  +
                </span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="bg-[#18241c] px-6 pb-8 text-[#a8b8ac] leading-relaxed">
                      <div className="pt-2 border-t border-white/10">
                        {faq.answer}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

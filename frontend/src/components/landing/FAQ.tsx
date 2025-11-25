'use client';
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FAQ() {
     const [openFaq, setOpenFaq] = useState(0);
  
  const faqs = [
    {
      id: 1,
      question: 'How do I create a farm account?',
      answer: 'Simply click "Register Farm" and fill in your farm details. Once registered, you\'ll receive a unique farm code that you can share with your workers. It takes less than 2 minutes to set up your farm profile.',
    },
    {
      id: 2,
      question: 'What features are included?',
      answer: 'FarmHub includes field management, task assignment, worker coordination, weather monitoring, crop history tracking, and real-time analytics. All features are included in your account with no hidden fees.',
    },
    {
      id: 3,
      question: 'Can workers join easily?',
      answer: 'Yes! Workers simply need your farm code to join. They register with the code, and they\'re automatically added to your farm team. No manual approval needed.',
    },
  ];

  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left - Image */}
          <div className="flex-1">
            <img 
              src="/images/image-03.webp.png" 
              alt="Join FarmHub" 
              className="w-120 h-150 rounded-3xl shadow-xl"
            />
          </div>

          {/* Right - FAQ Content */}
          <div className="flex-1">
            <h2 className="text-2xl text-[#eec044] mb-2 font-covered">
              Frequently Asked Questions
            </h2>
            <h3 className="text-4xl lg:text-5xl font-extrabold text-[#1f1e17] mb-8">
              You Have Any Questions
            </h3>

            {/* FAQ List */}
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div 
                  key={faq.id}
                  className="bg-[#f8f7f0] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? 0 : faq.id)}
                    className="w-full flex justify-between items-center p-6 text-left hover:bg-[#f0ede0] transition-colors"
                  >
                    <h4 className="text-xl font-extrabold text-[#1f1e17] pr-4">
                      {faq.question}
                    </h4>
                    <div className="flex-shrink-0 w-12 h-12 bg-[#4baf47] rounded-lg flex items-center justify-center text-white">
                      <ArrowRight 
                        className={`w-6 h-6 transition-transform ${openFaq === faq.id ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </button>
                  
                  {openFaq === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-lg text-[#878680] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
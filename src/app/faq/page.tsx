"use client";
import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const faqs: FAQItem[] = [
    {
      id: 1,
      category: "General",
      question: "How do I register for an account?",
      answer: "To register for an account, click on the 'Register' button in the top navigation, fill out the required information including your personal details, and verify your email address."
    },
    {
      id: 2,
      category: "General",
      question: "Is there a fee to use Car Deposit?",
      answer: "Creating an account and browsing auctions is free. We charge a small commission fee only when you successfully win an auction or sell a vehicle through our platform."
    },
    {
      id: 3,
      category: "Bidding",
      question: "How does the bidding process work?",
      answer: "Once you're registered and logged in, you can place bids on live auctions. Each bid must be higher than the current highest bid. The auction ends at the specified time, and the highest bidder wins."
    },
    {
      id: 4,
      category: "Bidding",
      question: "Can I retract my bid?",
      answer: "Bids are binding and cannot be retracted once placed. Please make sure you're committed to purchasing the vehicle before placing a bid."
    },
    {
      id: 5,
      category: "Bidding",
      question: "What happens if I win an auction?",
      answer: "If you win an auction, you'll receive a notification and instructions for payment. You'll need to complete the payment within the specified timeframe to secure your purchase."
    },
    {
      id: 6,
      category: "Selling",
      question: "How do I list my car for auction?",
      answer: "Go to 'Sell Your Car' page, fill out the vehicle details, upload high-quality photos, and set your starting price. Our team will review and approve your listing."
    },
    {
      id: 7,
      category: "Selling",
      question: "How long does it take to approve my listing?",
      answer: "Most listings are reviewed and approved within 24-48 hours. We may contact you if we need additional information or photos."
    },
    {
      id: 8,
      category: "Payment",
      question: "What payment methods do you accept?",
      answer: "We accept major credit cards, bank transfers, and certified checks. Payment must be completed within 3 business days of winning an auction."
    },
    {
      id: 9,
      category: "Payment",
      question: "Is my payment information secure?",
      answer: "Yes, we use industry-standard encryption and security measures to protect your payment information. We never store your complete payment details on our servers."
    },
    {
      id: 10,
      category: "Shipping",
      question: "How is the vehicle delivered?",
      answer: "Vehicle delivery is arranged between the buyer and seller. We can recommend trusted shipping partners if needed. Delivery costs are typically the buyer's responsibility."
    }
  ];

  const categories = [...new Set(faqs.map(faq => faq.category))];

  return (
    <>
      <HeroSection
        title="FAQ"
        description="Frequently Asked Questions - Find answers to common questions about Car Deposit"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4A5FBF] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 text-lg">
              Can't find what you're looking for? Contact our support team.
            </p>
          </div>

          {categories.map(category => (
            <div key={category} className="mb-8">
              <h3 className="text-xl font-semibold text-[#4A5FBF] mb-4 border-b border-gray-200 pb-2">
                {category}
              </h3>
              <div className="space-y-4">
                {faqs
                  .filter(faq => faq.category === category)
                  .map(faq => (
                    <div key={faq.id} className="bg-white rounded-lg shadow-sm border">
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 pr-4">
                          {faq.question}
                        </span>
                        {openItems.includes(faq.id) ? (
                          <ChevronUp className="w-5 h-5 text-[#4A5FBF] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#4A5FBF] flex-shrink-0" />
                        )}
                      </button>
                      {openItems.includes(faq.id) && (
                        <div className="px-6 pb-6">
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}

          <div className="text-center mt-12 p-8 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-[#4A5FBF] mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#4A5FBF] text-white px-6 py-3 rounded-lg hover:bg-[#3A4FAF] transition-colors">
                Contact Support
              </button>
              <button className="border border-[#4A5FBF] text-[#4A5FBF] px-6 py-3 rounded-lg hover:bg-[#4A5FBF] hover:text-white transition-colors">
                Live Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
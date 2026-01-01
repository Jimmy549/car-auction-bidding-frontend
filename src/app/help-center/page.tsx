"use client";
import { HeroSection } from "@/components/hero-section";
import { Search, Book, MessageCircle, Phone, Mail, Clock } from "lucide-react";

export default function HelpCenterPage() {
  const helpCategories = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of using Car Deposit platform",
      articles: [
        "How to create an account",
        "Setting up your profile",
        "Understanding auction types",
        "Platform navigation guide"
      ]
    },
    {
      icon: MessageCircle,
      title: "Bidding & Buying",
      description: "Everything about placing bids and winning auctions",
      articles: [
        "How to place a bid",
        "Understanding bid increments",
        "Auction end times",
        "Payment process after winning"
      ]
    },
    {
      icon: Phone,
      title: "Selling Your Car",
      description: "Guide to listing and selling your vehicle",
      articles: [
        "Creating a listing",
        "Photo requirements",
        "Setting reserve prices",
        "Managing your auction"
      ]
    },
    {
      icon: Mail,
      title: "Account & Security",
      description: "Manage your account and security settings",
      articles: [
        "Password reset",
        "Two-factor authentication",
        "Account verification",
        "Privacy settings"
      ]
    }
  ];

  const popularArticles = [
    "How do I place my first bid?",
    "What happens if I win an auction?",
    "How to upload photos for my car listing",
    "Understanding auction fees and commissions",
    "How to contact the seller",
    "Vehicle inspection process"
  ];

  return (
    <>
      <HeroSection
        title="Help Center"
        description="Find answers, guides, and support for all your Car Deposit needs"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Help Center" }]}
      />

      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Search Bar */}
          <div className="text-center mb-12">
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#4A5FBF] focus:border-transparent"
              />
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {helpCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-[#4A5FBF] rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {category.description}
                  </p>
                  <ul className="space-y-2">
                    {category.articles.map((article, articleIndex) => (
                      <li key={articleIndex}>
                        <a href="#" className="text-sm text-[#4A5FBF] hover:underline">
                          {article}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Popular Articles */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-semibold text-[#4A5FBF] mb-6">
                Popular Articles
              </h2>
              <div className="space-y-4">
                {popularArticles.map((article, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
                    <a href="#" className="text-gray-900 hover:text-[#4A5FBF] font-medium">
                      {article}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Support */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-xl font-semibold text-[#4A5FBF] mb-4">
                  Need More Help?
                </h3>
                <p className="text-gray-600 mb-6">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-[#4A5FBF]" />
                    <div>
                      <p className="font-medium text-gray-900">Phone Support</p>
                      <p className="text-sm text-gray-600">+054 211 4444</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-[#4A5FBF]" />
                    <div>
                      <p className="font-medium text-gray-900">Email Support</p>
                      <p className="text-sm text-gray-600">info@cardeposit.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-[#4A5FBF]" />
                    <div>
                      <p className="font-medium text-gray-900">Business Hours</p>
                      <p className="text-sm text-gray-600">Mon-Fri: 9AM-6PM</p>
                    </div>
                  </div>
                </div>

                <button className="w-full mt-6 bg-[#4A5FBF] text-white py-3 rounded-lg hover:bg-[#3A4FAF] transition-colors">
                  Contact Support
                </button>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                <h3 className="text-lg font-semibold text-[#4A5FBF] mb-4">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <a href="/faq" className="block text-gray-700 hover:text-[#4A5FBF] transition-colors">
                    Frequently Asked Questions
                  </a>
                  <a href="/contact" className="block text-gray-700 hover:text-[#4A5FBF] transition-colors">
                    Contact Us
                  </a>
                  <a href="/about-us" className="block text-gray-700 hover:text-[#4A5FBF] transition-colors">
                    About Car Deposit
                  </a>
                  <a href="#" className="block text-gray-700 hover:text-[#4A5FBF] transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="block text-gray-700 hover:text-[#4A5FBF] transition-colors">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
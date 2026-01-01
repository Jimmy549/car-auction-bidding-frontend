"use client";
import { HeroSection } from "@/components/hero-section";

export default function AboutUsPage() {
  return (
    <>
      <HeroSection
        title="About us"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About us" }]}
      />

      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#4A5FBF] mb-4">
              Welcome to Car Deposit
            </h2>
            <p className="text-gray-600 text-lg">
              Your trusted partner in car auctions and automotive excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h3 className="text-2xl font-semibold text-[#4A5FBF] mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin turpis pretium donec orci semper. Sit suscipit lacus cras commodo in lectus sed egestas. Mattis egestas sit viverra pretium tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra in sed mauris.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-[#4A5FBF] mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur. Mauris eu convallis proin turpis pretium donec orci semper. Sit suscipit lacus cras commodo in lectus sed egestas. Mattis egestas sit viverra pretium tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam pulvinar. Odio egestas egestas tristique et lectus viverra in sed mauris.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h3 className="text-2xl font-semibold text-[#4A5FBF] mb-6 text-center">
              Why Choose Car Deposit?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#4A5FBF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Trusted Platform</h4>
                <p className="text-gray-600 text-sm">
                  Secure and reliable auction platform with verified sellers and buyers
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#4A5FBF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">Best Prices</h4>
                <p className="text-gray-600 text-sm">
                  Competitive bidding ensures you get the best value for your money
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#4A5FBF] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h4 className="font-semibold text-gray-800 mb-2">24/7 Support</h4>
                <p className="text-gray-600 text-sm">
                  Round-the-clock customer support to assist you throughout your journey
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-2xl font-semibold text-[#4A5FBF] mb-4">
              Ready to Start?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied customers who trust Car Deposit for their automotive needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-[#4A5FBF] text-white px-8 py-3 rounded-lg hover:bg-[#3A4FAF] transition-colors">
                Start Bidding
              </button>
              <button className="border border-[#4A5FBF] text-[#4A5FBF] px-8 py-3 rounded-lg hover:bg-[#4A5FBF] hover:text-white transition-colors">
                Sell Your Car
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
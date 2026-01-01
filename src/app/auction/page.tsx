"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HeroSection } from "@/components/hero-section"
import { AuctionFilters } from "@/components/auction-filters"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star} from "lucide-react"
import Link from "next/link"
import { RootState, AppDispatch } from "@/store";
import { fetchAuctions, setFilters } from "@/store/slices/auctionsSlice";

export default function AuctionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { auctions, loading, error, filters } = useSelector((state: RootState) => state.auctions);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    dispatch(fetchAuctions(filters));
  }, [dispatch, filters]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    // You can implement sorting logic here
  };

  const handleFiltersChange = (newFilters: any) => {
    dispatch(setFilters(newFilters));
  };

  if (loading) {
    return (
      <>
        <HeroSection
          title="Auction"
          description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction" }]}
        />
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A5FBF] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading auctions...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeroSection
          title="Auction"
          description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction" }]}
        />
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Error loading auctions: {error}
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroSection
        title="Auction"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction" }]}
      />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="bg-[#4A5FBF] text-white px-4 py-2 rounded">
                  Showing 1-{Math.min(auctions.length, 10)} of {auctions.length} Results
                </div>
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by Relevance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Sort by Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="ending-soon">Ending Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {auctions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">No auctions found</p>
                  <p className="text-gray-500 mt-2">Try adjusting your filters or check back later</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {auctions.map((auction) => {
                    const timeRemaining = new Date(auction.endTime).toLocaleString();
                    const isLive = auction.status === 'live';
                    const isEnded = auction.status === 'ended';
                    
                    return (
                      <Card key={auction._id} className="p-6">
                        <div className="flex gap-6">
                          <div className="relative">
                            {isLive && (
                              <Badge className="absolute top-2 left-2 z-10 bg-red-500 animate-pulse">
                                LIVE
                              </Badge>
                            )}
                            {isEnded && (
                              <Badge className="absolute top-2 left-2 z-10 bg-gray-500">
                                ENDED
                              </Badge>
                            )}
                            <img
                              src={auction.car.photos[0] || "/placeholder.svg"}
                              alt={auction.title}
                              className="w-48 h-32 object-cover rounded"
                            />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-semibold">{auction.title}</h3>
                              <Star className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer" />
                            </div>

                            <div className="flex items-center gap-1 mb-3">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>

                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                              {auction.description || `${auction.car.year} ${auction.car.make} ${auction.car.model} - Premium vehicle in excellent condition.`}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex gap-8">
                                <div>
                                  <div className="text-sm text-gray-600">Current Bid</div>
                                  <div className="font-semibold">${auction.currentPrice.toLocaleString()}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">Total Bids</div>
                                  <div className="text-sm">{auction.totalBids || 0}</div>
                                </div>
                                <div>
                                  <div className="text-sm text-gray-600">End Time</div>
                                  <div className="text-sm">{timeRemaining}</div>
                                </div>
                              </div>

                              <Link href={`/auction/${auction._id}`}>
                                <Button 
                                  className="bg-[#4A5FBF] hover:bg-[#3A4FAF]"
                                  disabled={isEnded}
                                >
                                  {isEnded ? "Auction Ended" : "Submit A Bid"}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Pagination - TODO: Implement actual pagination */}
              {auctions.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button variant="outline" size="sm">‹</Button>
                  <Button className="bg-[#4A5FBF] hover:bg-[#3A4FAF]" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">›</Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-80">
              <AuctionFilters onFiltersChange={handleFiltersChange} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

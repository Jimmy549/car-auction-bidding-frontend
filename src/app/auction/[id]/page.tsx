"use client"

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HeroSection } from "@/components/hero-section"
import { BiddingInterface } from "@/components/bidding-interface"
import { BidderList } from "@/components/bidder-list"
import { PaymentSteps } from "@/components/payment-steps"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Star } from "lucide-react"
import { useParams } from "next/navigation"
import { RootState, AppDispatch } from "@/store";
import { fetchAuctionById, clearCurrentAuction } from "@/store/slices/auctionsSlice";
import { fetchAuctionBids, fetchHighestBid } from "@/store/slices/bidsSlice";
import { useSocket } from "@/components/socket-provider";

export default function AuctionDetailPage() {
  const params = useParams()
  const id = params.id as string
  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket();
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { currentAuction, loading, error } = useSelector((state: RootState) => state.auctions);
  const { auctionBids, highestBid } = useSelector((state: RootState) => state.bids);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchAuctionById(id));
      
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (isAuthenticated && token) {
        dispatch(fetchAuctionBids(id)).catch((error) => {
          console.log('Could not fetch auction bids:', error);
        });
        dispatch(fetchHighestBid(id)).catch((error) => {
          console.log('Could not fetch highest bid:', error);
        });
      }
      
      if (socket.connected) {
        socket.joinAuction(id);
      }
    }

    return () => {
      if (id && socket.connected) {
        socket.leaveAuction(id);
      }
      dispatch(clearCurrentAuction());
    };
  }, [id, dispatch, socket, isAuthenticated]);

  if (loading) {
    return (
      <>
        <HeroSection
          title="Loading..."
          description="Please wait while we load the auction details."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction Detail" }]}
        />
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A5FBF] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading auction details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !currentAuction) {
    return (
      <>
        <HeroSection
          title="Auction Not Found"
          description="The auction you're looking for doesn't exist or has been removed."
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction Detail" }]}
        />
        <div className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error || "Auction not found"}
            </div>
          </div>
        </div>
      </>
    );
  }

  const auction = currentAuction;
  const isOwner = user && auction.seller._id === user.id;
  const isLive = auction.status === 'live';
  const isEnded = auction.status === 'ended';
  const hasWinner = isEnded && auction.highestBid;
  
  const bidders = auctionBids && auctionBids.length > 0 
    ? auctionBids.slice(0, 10)
        .filter(bid => bid.bidder) // Filter out bids with undefined bidder
        .map(bid => ({
          name: bid.bidder?.fullName || bid.bidder?.username || 'Anonymous',
          amount: `$${bid.amount.toLocaleString()}`,
          avatar: undefined
        }))
    : [];

  const winner = hasWinner && auction.highestBid?.bidder ? {
    name: auction.highestBid.bidder?.fullName || auction.highestBid.bidder?.username || 'Anonymous',
    amount: `$${auction.highestBid.amount.toLocaleString()}`,
  } : undefined;

  return (
    <>
      <HeroSection
        title={auction.title}
        description={auction.description}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Auction Detail" }]}
      />

      <div className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-[#4A5FBF]">{auction.title}</h1>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-red-500">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
            {isLive && (
              <Badge className="bg-red-500 text-white px-3 py-1">
                LIVE
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Column - Main Image */}
            <div className="lg:col-span-2">
              <div className="relative">
                <img
                  src={auction.car.photos[selectedImage] || "/placeholder.svg"}
                  alt={auction.title}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
                {isLive && (
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    LIVE
                  </Badge>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-6 gap-2 mt-4">
                {auction.car.photos.slice(0, 6).map((photo, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-[#4A5FBF]' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={photo}
                      alt={`${auction.title} ${index + 1}`}
                      className="w-full h-16 object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Car Specifications */}
              <Card className="p-6 mt-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-xs">📅</span>
                    </div>
                    <span className="text-xs text-gray-600">Year</span>
                    <span className="font-semibold">{auction.car.year}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-xs">🚗</span>
                    </div>
                    <span className="text-xs text-gray-600">Make</span>
                    <span className="font-semibold">{auction.car.make}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-xs">🏎️</span>
                    </div>
                    <span className="text-xs text-gray-600">Model</span>
                    <span className="font-semibold">{auction.car.model}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <span className="text-xs">💰</span>
                    </div>
                    <span className="text-xs text-gray-600">Starting Price</span>
                    <span className="font-semibold">${auction.startingPrice.toLocaleString()}</span>
                  </div>
                </div>
              </Card>

              {/* Current Bid & Bidding */}
              <Card className="p-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Bid</p>
                    <p className="text-2xl font-bold text-[#4A5FBF]">${auction.currentPrice.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total Bids</p>
                    <p className="text-xl font-semibold">{auction.totalBids || 0}</p>
                  </div>
                </div>
                
                <BiddingInterface
                  currentBid={`$${auction.currentPrice.toLocaleString()}`}
                  timeRemaining={new Date(auction.endTime).toLocaleString()}
                  totalBids={auction.totalBids || 0}
                  isLive={isLive}
                  isEnded={isEnded}
                  isOwner={isOwner}
                  auctionId={auction._id}
                />
              </Card>

              {/* Description */}
              <Card className="p-6 mt-6">
                <h3 className="text-lg font-semibold mb-4">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {auction.description || `${auction.car.year} ${auction.car.make} ${auction.car.model} - Premium vehicle in excellent condition. This car has been well-maintained and is ready for its next owner. Don't miss this opportunity to own this exceptional vehicle.`}
                </p>
              </Card>

              {/* Winner Section */}
              {hasWinner && (
                <Card className="p-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4 bg-[#4A5FBF] text-white p-3 -m-6 mb-4 rounded-t-lg">
                    Winner
                  </h3>
                  <div className="flex items-center gap-4">
                    <img
                      src="/professional-headshot.png"
                      alt={winner!.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Full Name:</span>
                          <span className="ml-2 font-medium">Manish Sharma</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Email:</span>
                          <span className="ml-2 font-medium">Manish Sharma</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Mobile Number:</span>
                          <span className="ml-2 font-medium">1234567890</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Nationality:</span>
                          <span className="ml-2 font-medium">India</span>
                        </div>
                        <div>
                          <span className="text-gray-600">ID Type:</span>
                          <span className="ml-2 font-medium">India</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column - Bidder List */}
            <div className="lg:col-span-2">
              <BidderList bidders={bidders} winner={winner} />
            </div>
          </div>

          {/* Payment Steps Section */}
          {isEnded && (
            <div className="mt-8">
              <PaymentSteps />
            </div>
          )}

          {isOwner && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
              <p className="font-medium">This is your auction</p>
              <p className="text-sm">You cannot bid on your own auction.</p>
            </div>
          )}

          {!isAuthenticated && (
            <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
              <p className="font-medium">Please log in to place bids</p>
              <p className="text-sm">You need to be logged in to participate in auctions.</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

"use client";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SearchFilters } from "@/components/search-filters";
import { LiveAuctionCard } from "@/components/live-auction-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { RootState, AppDispatch } from "@/store";
import { fetchLiveAuctions, updateAuctionBid } from "@/store/slices/auctionsSlice";
import { useSocket } from "@/components/socket-provider";

export default function HomePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { liveAuctions, loading } = useSelector((state: RootState) => state.auctions);
  const [mounted, setMounted] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    setMounted(true);
    dispatch(fetchLiveAuctions());
  }, [dispatch]);

  // Set up real-time updates for live auctions
  useEffect(() => {
    if (socket.connected) {
      // Listen for new bids on all live auctions
      socket.onNewBid((data) => {
        dispatch(updateAuctionBid({
          auctionId: data.auctionId,
          bidData: {
            currentPrice: data.bid.amount,
            totalBids: (liveAuctions.find(a => a._id === data.auctionId)?.totalBids || 0) + 1
          }
        }));
      });

      // Join all live auction rooms for updates
      liveAuctions.forEach(auction => {
        socket.joinAuction(auction._id);
      });
    }

    return () => {
      if (socket.connected) {
        liveAuctions.forEach(auction => {
          socket.leaveAuction(auction._id);
        });
      }
    };
  }, [socket, liveAuctions, dispatch]);

  // Transform auction data to match CarCard props
  const transformedAuctions = liveAuctions.map(auction => ({
    id: auction._id,
    name: `${auction.car.year} ${auction.car.make} ${auction.car.model}`,
    image: auction.car.photos[0] || "/placeholder.jpg",
    price: `$${auction.currentPrice.toLocaleString()}`,
    currentBid: `$${auction.currentPrice.toLocaleString()}`,
    timeRemaining: new Date(auction.endTime).toLocaleString(),
    status: auction.status === 'live' ? 'trending' as const : null,
    rating: 5,
    endTime: auction.endTime,
    endType: "End Time",
  }));

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-32 px-2"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/hero.jpg')",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="bg-blue-100 text-[#4A5FBF] px-4 py-2 rounded-sm inline-block mb-6 text-sm font-medium">
              WELCOME TO AUCTION
            </div>
            <h1 className="text-5xl md:text-6xl font-medium text-white mb-6 leading-tight">
              Find Your Dream Car
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Tellus
              elementum cursus tincidunt sagittis elementum suspendisse velit
              arcu.
            </p>
          </div>

          <div className="mt-12">
            <SearchFilters />
          </div>
        </div>

        {/* Sign in / Register buttons - only render after mount to prevent hydration mismatch */}
        {mounted && !isAuthenticated && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Link href="/login">
              <Button
                variant="outline"
                className="cursor-pointer text-white border-white hover:bg-white hover:text-gray-900 bg-transparent"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="cursor-pointer bg-[#4A5FBF] hover:bg-[#3A4FAF]">
                Register now
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Live Auction Section */}
      <div className="bg-white py-16">
        <div className="bg-[#4A5FBF] py-16 px-2">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Live Auction
              </h2>
              <div className="w-16 h-1 bg-yellow-400 mx-auto"></div>
            </div>

            <div className="mb-8">
              <div className="border-b border-blue-400">
                <div className="inline-block border-b-2 border-yellow-400 pb-2">
                  <span className="text-white font-medium">Live Auction</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="text-center text-white py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="mt-4">Loading live auctions...</p>
              </div>
            ) : transformedAuctions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {liveAuctions.map((auction) => (
                  <LiveAuctionCard key={auction._id} auction={auction} />
                ))}
              </div>
            ) : (
              <div className="text-center text-white py-8">
                <p className="text-xl">No live auctions at the moment</p>
                <p className="text-gray-300 mt-2">Check back soon for exciting auctions!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

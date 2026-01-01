"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { placeBid } from "@/store/slices/bidsSlice";

interface BiddingInterfaceProps {
  currentBid: string;
  timeRemaining: string;
  totalBids: number;
  isLive?: boolean;
  isEnded?: boolean;
  isOwner?: boolean;
  auctionId?: string;
}

export function BiddingInterface({
  currentBid,
  timeRemaining,
  totalBids,
  isLive,
  isEnded,
  isOwner,
  auctionId,
}: BiddingInterfaceProps) {
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { placingBid, error: bidError } = useSelector((state: RootState) => state.bids);

  // Parse currentBid to number (remove non-numeric chars)
  const getCurrentBidValue = () => {
    const num = Number(String(currentBid).replace(/[^\d.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers (and optional decimal)
    if (!/^\d*\.?\d*$/.test(value)) return;
    setBidAmount(value);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async () => {
    if (!auctionId || !isAuthenticated) {
      setError("Please log in to place a bid");
      return;
    }

    if (isOwner) {
      setError("You cannot bid on your own auction");
      return;
    }

    if (isEnded) {
      setError("This auction has ended");
      return;
    }

    if (!bidAmount) {
      setError("Please enter a bid amount");
      return;
    }

    const bidNum = Number(bidAmount);
    const minBid = getCurrentBidValue();
    
    if (isNaN(bidNum) || bidNum <= 0) {
      setError("Please enter a valid bid amount.");
      return;
    }
    
    if (bidNum <= minBid) {
      setError(`Bid must be higher than current bid of ${currentBid}`);
      return;
    }

    try {
      await dispatch(placeBid({ auctionId, amount: bidNum })).unwrap();
      setBidAmount("");
      setError("");
      setSuccess(`Bid of $${bidNum.toLocaleString()} placed successfully!`);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err || "Failed to place bid");
      setSuccess("");
    }
  };

  const canBid = isAuthenticated && !isOwner && !isEnded && isLive;

  return (
    <Card className="p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#4A5FBF]">{currentBid}</div>
          <div className="text-sm text-gray-600">Current Bid</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{timeRemaining}</div>
          <div className="text-sm text-gray-600">Time Left</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{totalBids}</div>
          <div className="text-sm text-gray-600">Total Bids</div>
        </div>
        {/* Watchers feature can be added later when backend supports it */}
      </div>

      {isEnded ? (
        <div className="text-center">
          <Badge className="bg-red-500 text-lg px-4 py-2">
            Bidding has ended
          </Badge>
        </div>
      ) : (
        <div className="space-y-4">
          {isLive && (
            <div className="text-center mb-4">
              <Badge className="bg-green-500 animate-pulse">
                🔴 LIVE AUCTION
              </Badge>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder={`Enter bid amount (min: ${currentBid})`}
              value={bidAmount}
              onChange={handleInputChange}
              className="flex-1"
              inputMode="decimal"
              disabled={!canBid || placingBid}
            />
            <Button
              className="bg-[#4A5FBF] hover:bg-[#3A4FAF] px-8"
              onClick={handleSubmit}
              disabled={!canBid || !bidAmount || placingBid}
            >
              {placingBid ? "Placing Bid..." : "Place Bid"}
            </Button>
          </div>
          
          {(error || bidError) && (
            <div className="text-red-500 text-sm mt-2">{error || bidError}</div>
          )}
          
          {success && (
            <div className="text-green-500 text-sm mt-2 font-medium">{success}</div>
          )}
          
          {!isAuthenticated && (
            <div className="text-blue-600 text-sm mt-2">
              Please log in to place bids
            </div>
          )}
          
          {isOwner && (
            <div className="text-yellow-600 text-sm mt-2">
              You cannot bid on your own auction
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

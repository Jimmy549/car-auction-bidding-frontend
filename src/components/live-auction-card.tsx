"use client";

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Star } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CountdownTimer } from '@/components/countdown-timer';
import { useSocket } from '@/components/socket-provider';
import { RootState, AppDispatch } from '@/store';
import { placeBid } from '@/store/slices/bidsSlice';
import { updateAuctionBid } from '@/store/slices/auctionsSlice';

interface LiveAuctionCardProps {
  auction: any;
}

export function LiveAuctionCard({ auction }: LiveAuctionCardProps) {
  const [bidAmount, setBidAmount] = useState('');
  const [currentPrice, setCurrentPrice] = useState(auction.currentPrice || auction.startingPrice);
  const [totalBids, setTotalBids] = useState(auction.totalBids || 0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const socket = useSocket();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { loading: bidLoading } = useSelector((state: RootState) => state.bids);

  // Fix ownership check - handle both populated seller and seller ID
  const sellerId = typeof auction.seller === 'object' 
    ? auction.seller?._id 
    : auction.seller;
  const userId = user?.id; // User object has 'id' field, not '_id'
  const isOwner = isAuthenticated && userId && (userId === sellerId);
  
  // Debug logging
  console.log('🔍 Auction Card Debug:', {
    auctionId: auction._id,
    userId,
    sellerId,
    isOwner,
    isAuthenticated,
    user
  });

  const minBidAmount = currentPrice + 100;

  useEffect(() => {
    if (socket?.connected) {
      socket.joinAuction(auction._id);

      socket.onNewBid((data: any) => {
        if (data.auctionId === auction._id) {
          setCurrentPrice(data.bid.amount);
          setTotalBids((prev: number) => prev + 1);
          
          dispatch(updateAuctionBid({
            auctionId: auction._id,
            bidData: { currentPrice: data.bid.amount, totalBids: totalBids + 1 }
          }));
        }
      });
    }

    return () => {
      if (socket?.connected) {
        socket.leaveAuction(auction._id);
      }
    };
  }, [socket, auction._id, dispatch, totalBids]);

  const handleQuickBid = async () => {
    setError('');
    setSuccess('');

    if (!isAuthenticated) {
      setError('Please login to place a bid');
      return;
    }

    if (isOwner) {
      setError('You cannot bid on your own auction');
      return;
    }

    const amount = Number(bidAmount);
    if (!amount || amount <= currentPrice) {
      setError(`Bid must be higher than $${currentPrice.toLocaleString()}`);
      return;
    }

    try {
      await dispatch(placeBid({
        auctionId: auction._id,
        amount: amount,
      })).unwrap();
      
      setSuccess('✓ Bid placed!');
      setBidAmount('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err || 'Failed to place bid');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image Section */}
      <div className="relative">
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10 font-semibold">
          🔴 LIVE
        </span>
        <Heart className="absolute top-2 right-2 w-6 h-6 text-white cursor-pointer hover:text-red-500 transition-colors z-10" />
        <Link href={`/auction/${auction._id}`}>
          <img 
            src={auction.car?.photos?.[0] || '/placeholder.jpg'} 
            alt={`${auction.car?.make} ${auction.car?.model}`}
            className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
          />
        </Link>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Link href={`/auction/${auction._id}`}>
          <h3 className="font-semibold text-lg hover:text-[#4A5FBF] cursor-pointer transition-colors">
            {auction.car?.year} {auction.car?.make} {auction.car?.model}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
          ))}
        </div>

        {/* Price Info */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-500 text-sm">Current Bid</span>
            <p className="text-[#4A5FBF] font-bold text-xl">
              ${currentPrice.toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <span className="text-gray-500 text-sm">Total Bids</span>
            <p className="font-semibold text-lg">{totalBids}</p>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="text-center py-2 border-y bg-gray-50">
          <div className="flex items-center justify-center gap-2">
            <span className="text-gray-600 text-sm">⏰</span>
            <CountdownTimer endTime={auction.endTime} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Time Remaining</p>
        </div>

        {/* Quick Bid Section - Only for authenticated non-owners */}
        {isAuthenticated && !isOwner && auction.status === 'live' ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={`Min: $${minBidAmount.toLocaleString()}`}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="flex-1"
                min={minBidAmount}
              />
              <Button
                onClick={handleQuickBid}
                disabled={bidLoading || !bidAmount}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                {bidLoading ? '...' : 'Bid'}
              </Button>
            </div>
            {error && (
              <p className="text-red-500 text-xs bg-red-50 p-2 rounded">{error}</p>
            )}
            {success && (
              <p className="text-green-600 text-xs bg-green-50 p-2 rounded">{success}</p>
            )}
          </div>
        ) : null}

        {/* View Details Button */}
        <Link href={`/auction/${auction._id}`}>
          <Button className="w-full bg-[#4A5FBF] hover:bg-[#3A4FAF]">
            View Full Details
          </Button>
        </Link>

        {/* Status Messages */}
        {!isAuthenticated && (
          <p className="text-center text-sm text-gray-500">
            <Link href="/login" className="text-[#4A5FBF] hover:underline font-medium">
              Login
            </Link> to place quick bids
          </p>
        )}
        {isOwner && (
          <p className="text-center text-sm bg-orange-50 text-orange-600 py-1 rounded font-medium">
            Your Auction
          </p>
        )}
      </div>
    </div>
  );
}
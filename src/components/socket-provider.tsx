"use client";

import { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socketService } from '@/lib/socket';
import { RootState } from '@/store';
import { updateAuctionBid, updateAuctionStatus } from '@/store/slices/auctionsSlice';
import { addNewBid, updateBidStatus } from '@/store/slices/bidsSlice';
import { addNotification } from '@/store/slices/notificationsSlice';

const SocketContext = createContext(socketService);

export function SocketProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const listenersSetup = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !listenersSetup.current) {
      // Connect socket when authenticated
      socketService.connect();
      listenersSetup.current = true;

      // Set up real-time event listeners
      const handleNewBid = (data: any) => {
        dispatch(updateAuctionBid({
          auctionId: data.auctionId,
          bidData: data.bid
        }));
        dispatch(addNewBid(data.bid));
      };

      const handleAuctionStarted = (data: any) => {
        dispatch(updateAuctionStatus({
          auctionId: data.auctionId,
          status: 'live'
        }));
        dispatch(addNotification({
          _id: Date.now().toString(),
          type: 'AUCTION_STARTED',
          title: 'Auction Started',
          message: data.message,
          data: data.auction,
          isRead: false,
          createdAt: new Date().toISOString(),
          auction: {
            _id: data.auctionId,
            title: data.auction.title
          }
        }));
      };

      const handleAuctionEnded = (data: any) => {
        dispatch(updateAuctionStatus({
          auctionId: data.auctionId,
          status: 'ended',
          winner: data.winner
        }));
        if (data.winner) {
          dispatch(updateBidStatus({
            auctionId: data.auctionId,
            winnerId: data.winner._id
          }));
        }
        dispatch(addNotification({
          _id: Date.now().toString(),
          type: 'AUCTION_ENDED',
          title: 'Auction Ended',
          message: data.message,
          data: data.winner,
          isRead: false,
          createdAt: new Date().toISOString(),
          auction: {
            _id: data.auctionId,
            title: data.auction?.title || 'Auction'
          }
        }));
      };

      const handleAuctionWon = (data: any) => {
        dispatch(addNotification({
          _id: Date.now().toString(),
          type: 'AUCTION_WON',
          title: 'Congratulations!',
          message: data.message,
          data: data.auction,
          isRead: false,
          createdAt: new Date().toISOString(),
          auction: {
            _id: data.auctionId,
            title: data.auction.title
          }
        }));
      };

      const handleOutbid = (data: any) => {
        dispatch(addNotification({
          _id: Date.now().toString(),
          type: 'OUTBID',
          title: 'Outbid Alert',
          message: data.message,
          data: { newBidAmount: data.newBidAmount },
          isRead: false,
          createdAt: new Date().toISOString(),
          auction: {
            _id: data.auctionId,
            title: 'Auction'
          }
        }));
      };

      const handlePaymentUpdate = (data: any) => {
        dispatch(addNotification({
          _id: Date.now().toString(),
          type: 'SHIPPING_UPDATE',
          title: 'Payment Update',
          message: data.message,
          data: data.payment,
          isRead: false,
          createdAt: new Date().toISOString()
        }));
      };

      // Register all listeners
      socketService.onNewBid(handleNewBid);
      socketService.onAuctionStarted(handleAuctionStarted);
      socketService.onAuctionEnded(handleAuctionEnded);
      socketService.onAuctionWon(handleAuctionWon);
      socketService.onOutbid(handleOutbid);
      socketService.onPaymentUpdate(handlePaymentUpdate);

      return () => {
        // Cleanup all event listeners
        socketService.off('newBid', handleNewBid);
        socketService.off('auctionStarted', handleAuctionStarted);
        socketService.off('auctionEnded', handleAuctionEnded);
        socketService.off('auctionWon', handleAuctionWon);
        socketService.off('outbid', handleOutbid);
        socketService.off('paymentUpdate', handlePaymentUpdate);
        socketService.disconnect();
        listenersSetup.current = false;
      };
    }
  }, [isAuthenticated, dispatch]);

  return (
    <SocketContext.Provider value={socketService}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  return useContext(SocketContext);
};
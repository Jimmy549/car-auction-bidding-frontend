import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import auctionsSlice from './slices/auctionsSlice';
import bidsSlice from './slices/bidsSlice';
import wishlistSlice from './slices/wishlistSlice';
import notificationsSlice from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    auctions: auctionsSlice,
    bids: bidsSlice,
    wishlist: wishlistSlice,
    notifications: notificationsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        // Increase warning threshold to reduce console warnings
        warnAfter: 128,
      },
      // Disable immutability check in development for better performance
      immutableCheck: process.env.NODE_ENV === 'production',
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
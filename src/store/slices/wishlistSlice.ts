import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '@/lib/api';

interface WishlistItem {
  _id: string;
  auction: {
    _id: string;
    title: string;
    car: {
      make: string;
      model: string;
      year: number;
      photos: string[];
    };
    currentPrice: number;
    status: string;
    endTime: string;
  };
  createdAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  actionLoading: { [auctionId: string]: boolean };
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
  actionLoading: {},
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchMy',
  async () => {
    return await apiService.wishlist.getMy();
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (auctionId: string, { rejectWithValue }) => {
    try {
      const result = await apiService.wishlist.add(auctionId);
      return { auctionId, ...result };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (auctionId: string, { rejectWithValue }) => {
    try {
      await apiService.wishlist.remove(auctionId);
      return auctionId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove from wishlist');
    }
  }
);

export const checkWishlistStatus = createAsyncThunk(
  'wishlist/check',
  async (auctionId: string) => {
    const result = await apiService.wishlist.check(auctionId);
    return { auctionId, isInWishlist: result.isInWishlist };
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clear',
  async () => {
    await apiService.wishlist.clear();
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setActionLoading: (state, action: PayloadAction<{ auctionId: string; loading: boolean }>) => {
      const { auctionId, loading } = action.payload;
      if (loading) {
        state.actionLoading[auctionId] = true;
      } else {
        delete state.actionLoading[auctionId];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state, action) => {
        const auctionId = action.meta.arg;
        state.actionLoading[auctionId] = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        const auctionId = action.payload.auctionId;
        delete state.actionLoading[auctionId];
        // The item will be added when we refetch or via real-time update
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        const auctionId = action.meta.arg;
        delete state.actionLoading[auctionId];
        state.error = action.payload as string || 'Failed to add to wishlist';
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state, action) => {
        const auctionId = action.meta.arg;
        state.actionLoading[auctionId] = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        const auctionId = action.payload;
        delete state.actionLoading[auctionId];
        state.items = state.items.filter(item => item.auction._id !== auctionId);
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        const auctionId = action.meta.arg;
        delete state.actionLoading[auctionId];
        state.error = action.payload as string || 'Failed to remove from wishlist';
      })
      // Clear wishlist
      .addCase(clearWishlist.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { clearError, setActionLoading } = wishlistSlice.actions;
export default wishlistSlice.reducer;
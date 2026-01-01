import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '@/lib/api';

interface Bid {
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
    status: string;
    endTime: string;
  };
  bidder: {
    _id: string;
    username: string;
    fullName: string;
  };
  amount: number;
  isWinning: boolean;
  createdAt: string;
}

interface BidsState {
  myBids: Bid[];
  auctionBids: Bid[];
  highestBid: Bid | null;
  loading: boolean;
  error: string | null;
  placingBid: boolean;
}

const initialState: BidsState = {
  myBids: [],
  auctionBids: [],
  highestBid: null,
  loading: false,
  error: null,
  placingBid: false,
};

// Async thunks
export const fetchMyBids = createAsyncThunk(
  'bids/fetchMy',
  async () => {
    return await apiService.bids.getMy();
  }
);

export const fetchAuctionBids = createAsyncThunk(
  'bids/fetchByAuction',
  async (auctionId: string) => {
    return await apiService.bids.getByAuction(auctionId);
  }
);

export const fetchHighestBid = createAsyncThunk(
  'bids/fetchHighest',
  async (auctionId: string) => {
    return await apiService.bids.getHighest(auctionId);
  }
);

export const placeBid = createAsyncThunk(
  'bids/place',
  async (bidData: { auctionId: string; amount: number }, { rejectWithValue }) => {
    try {
      return await apiService.bids.create(bidData);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to place bid');
    }
  }
);

const bidsSlice = createSlice({
  name: 'bids',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // Real-time updates
    addNewBid: (state, action: PayloadAction<Bid>) => {
      const newBid = action.payload;
      
      // Add to auction bids if we're viewing that auction
      if (state.auctionBids.length > 0 && 
          state.auctionBids[0]?.auction._id === newBid.auction._id) {
        state.auctionBids.unshift(newBid);
      }
      
      // Update highest bid if this is higher
      if (!state.highestBid || newBid.amount > state.highestBid.amount) {
        state.highestBid = newBid;
      }
      
      // Update my bids if this is my bid
      const isMyBid = state.myBids.some(bid => bid.bidder._id === newBid.bidder._id);
      if (isMyBid) {
        // Mark previous bids as not winning
        state.myBids.forEach(bid => {
          if (bid.auction._id === newBid.auction._id) {
            bid.isWinning = false;
          }
        });
        
        // Add new bid as winning
        newBid.isWinning = true;
        state.myBids.unshift(newBid);
      }
    },
    updateBidStatus: (state, action: PayloadAction<{ auctionId: string; winnerId: string }>) => {
      const { auctionId, winnerId } = action.payload;
      
      // Update my bids winning status
      state.myBids.forEach(bid => {
        if (bid.auction._id === auctionId) {
          bid.isWinning = bid.bidder._id === winnerId;
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch my bids
      .addCase(fetchMyBids.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyBids.fulfilled, (state, action) => {
        state.loading = false;
        state.myBids = action.payload;
      })
      .addCase(fetchMyBids.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bids';
      })
      // Fetch auction bids
      .addCase(fetchAuctionBids.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuctionBids.fulfilled, (state, action) => {
        state.loading = false;
        state.auctionBids = action.payload;
      })
      .addCase(fetchAuctionBids.rejected, (state, action) => {
        state.loading = false;
        state.auctionBids = []; // Set empty array on error
      })
      // Fetch highest bid
      .addCase(fetchHighestBid.pending, (state) => {
        // Don't set loading for highest bid to avoid UI flicker
      })
      .addCase(fetchHighestBid.fulfilled, (state, action) => {
        state.highestBid = action.payload;
      })
      .addCase(fetchHighestBid.rejected, (state, action) => {
        state.highestBid = null; // Set null on error
      })
      // Place bid
      .addCase(placeBid.pending, (state) => {
        state.placingBid = true;
        state.error = null;
      })
      .addCase(placeBid.fulfilled, (state, action) => {
        state.placingBid = false;
        // The bid will be added via real-time update
      })
      .addCase(placeBid.rejected, (state, action) => {
        state.placingBid = false;
        state.error = action.payload as string || 'Failed to place bid';
      });
  },
});

export const { clearError, addNewBid, updateBidStatus } = bidsSlice.actions;
export default bidsSlice.reducer;
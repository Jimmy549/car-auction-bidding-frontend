import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '@/lib/api';

interface Auction {
  _id: string;
  title: string;
  description: string;
  car: {
    _id: string;
    make: string;
    model: string;
    year: number;
    photos: string[];
  };
  seller: {
    _id: string;
    username: string;
    fullName: string;
  };
  startingPrice: number;
  currentPrice: number;
  highestBid?: {
    _id: string;
    amount: number;
    bidder: {
      _id: string;
      username: string;
      fullName: string;
    };
  };
  status: 'upcoming' | 'live' | 'ended';
  startTime: string;
  endTime: string;
  totalBids: number;
  watchers: number;
  createdAt: string;
  updatedAt: string;
}

interface AuctionsState {
  auctions: Auction[];
  liveAuctions: Auction[];
  upcomingAuctions: Auction[];
  myAuctions: Auction[];
  currentAuction: Auction | null;
  loading: boolean;
  error: string | null;
  filters: {
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  };
}

const initialState: AuctionsState = {
  auctions: [],
  liveAuctions: [],
  upcomingAuctions: [],
  myAuctions: [],
  currentAuction: null,
  loading: false,
  error: null,
  filters: {},
};

// Async thunks
export const fetchAuctions = createAsyncThunk(
  'auctions/fetchAll',
  async (filters?: { status?: string; minPrice?: number; maxPrice?: number; search?: string }) => {
    const response = await apiService.auctions.getAll(filters);
    // Backend now returns { data: [], pagination: {} } format
    return response.data || response;
  }
);

export const fetchLiveAuctions = createAsyncThunk(
  'auctions/fetchLive',
  async () => {
    return await apiService.auctions.getLive();
  }
);

export const fetchUpcomingAuctions = createAsyncThunk(
  'auctions/fetchUpcoming',
  async () => {
    return await apiService.auctions.getUpcoming();
  }
);

export const fetchMyAuctions = createAsyncThunk(
  'auctions/fetchMy',
  async () => {
    return await apiService.auctions.getMy();
  }
);

export const fetchAuctionById = createAsyncThunk(
  'auctions/fetchById',
  async (id: string) => {
    return await apiService.auctions.getById(id);
  }
);

export const createAuction = createAsyncThunk(
  'auctions/create',
  async (auctionData: any) => {
    return await apiService.auctions.create(auctionData);
  }
);

const auctionsSlice = createSlice({
  name: 'auctions',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<typeof initialState.filters>) => {
      state.filters = action.payload;
    },
    clearCurrentAuction: (state) => {
      state.currentAuction = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Real-time updates
    updateAuctionBid: (state, action: PayloadAction<{ auctionId: string; bidData: any }>) => {
      const { auctionId, bidData } = action.payload;
      
      // Update in all relevant arrays
      const updateAuction = (auction: Auction) => {
        if (auction._id === auctionId) {
          if (bidData.currentPrice) {
            auction.currentPrice = bidData.currentPrice;
          }
          if (bidData.totalBids !== undefined) {
            auction.totalBids = bidData.totalBids;
          }
          if (bidData.amount) {
            auction.currentPrice = bidData.amount;
            auction.totalBids = (auction.totalBids || 0) + 1;
          }
        }
      };

      state.auctions.forEach(updateAuction);
      state.liveAuctions.forEach(updateAuction);
      state.myAuctions.forEach(updateAuction);
      
      if (state.currentAuction?._id === auctionId) {
        updateAuction(state.currentAuction);
      }
    },
    updateAuctionStatus: (state, action: PayloadAction<{ auctionId: string; status: Auction['status']; winner?: any }>) => {
      const { auctionId, status, winner } = action.payload;
      
      const updateAuction = (auction: Auction) => {
        if (auction._id === auctionId) {
          auction.status = status;
          if (winner) {
            auction.highestBid = winner;
          }
        }
      };

      state.auctions.forEach(updateAuction);
      state.liveAuctions.forEach(updateAuction);
      state.myAuctions.forEach(updateAuction);
      
      if (state.currentAuction?._id === auctionId) {
        updateAuction(state.currentAuction);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all auctions
      .addCase(fetchAuctions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctions.fulfilled, (state, action) => {
        state.loading = false;
        state.auctions = action.payload;
      })
      .addCase(fetchAuctions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch auctions';
      })
      // Fetch live auctions
      .addCase(fetchLiveAuctions.fulfilled, (state, action) => {
        state.liveAuctions = action.payload;
      })
      // Fetch upcoming auctions
      .addCase(fetchUpcomingAuctions.fulfilled, (state, action) => {
        state.upcomingAuctions = action.payload;
      })
      // Fetch my auctions
      .addCase(fetchMyAuctions.fulfilled, (state, action) => {
        state.myAuctions = action.payload;
      })
      // Fetch auction by ID
      .addCase(fetchAuctionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuctionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAuction = action.payload;
      })
      .addCase(fetchAuctionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch auction';
      })
      // Create auction
      .addCase(createAuction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAuction.fulfilled, (state, action) => {
        state.loading = false;
        state.myAuctions.unshift(action.payload);
      })
      .addCase(createAuction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create auction';
      });
  },
});

export const { 
  setFilters, 
  clearCurrentAuction, 
  clearError, 
  updateAuctionBid, 
  updateAuctionStatus 
} = auctionsSlice.actions;

export default auctionsSlice.reducer;
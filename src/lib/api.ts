const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';

class ApiService {
  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth APIs
  auth = {
    login: (credentials: { identifier: string; password: string }) =>
      this.request<{ access_token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData: {
      username: string;
      email: string;
      password: string;
      fullName: string;
      mobileNumber: string;
    }) =>
      this.request<{ access_token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
  };

  // Auctions APIs
  auctions = {
    getAll: (filters?: {
      status?: string;
      minPrice?: number;
      maxPrice?: number;
      search?: string;
    }) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, String(value));
        });
      }
      return this.request<any[]>(`/auctions?${params}`);
    },

    getLive: () => this.request<any[]>('/auctions/live'),
    
    getUpcoming: () => this.request<any[]>('/auctions/upcoming'),
    
    getMy: () => this.request<any[]>('/auctions/my-auctions'),
    
    getById: (id: string) => this.request<any>(`/auctions/${id}`),
    
    create: (auctionData: any) =>
      this.request<any>('/auctions', {
        method: 'POST',
        body: JSON.stringify(auctionData),
      }),
  };

  // Bids APIs
  bids = {
    create: (bidData: { auctionId: string; amount: number }) =>
      this.request<any>('/bids', {
        method: 'POST',
        body: JSON.stringify(bidData),
      }),

    getByAuction: (auctionId: string) =>
      this.request<any[]>(`/bids/auction/${auctionId}`),

    getMy: () => this.request<any[]>('/bids/my-bids'),

    getHighest: (auctionId: string) =>
      this.request<any>(`/bids/highest/${auctionId}`),
  };

  // Categories APIs
  categories = {
    getAll: () => this.request<any[]>('/categories'),
    
    create: (categoryData: { name: string; description: string }) =>
      this.request<any>('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData),
      }),
  };
  cars = {
    getAll: (filters?: {
      status?: string;
      bodyType?: string;
      minPrice?: number;
      maxPrice?: number;
      search?: string;
    }) => {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) params.append(key, String(value));
        });
      }
      return this.request<any[]>(`/cars?${params}`);
    },

    getApproved: () => this.request<any[]>('/cars/approved'),
    
    getMy: () => this.request<any[]>('/cars/my-cars'),
    
    getById: (id: string) => this.request<any>(`/cars/${id}`),
    
    create: (carData: any) =>
      this.request<any>('/cars', {
        method: 'POST',
        body: JSON.stringify(carData),
      }),

    update: (id: string, carData: any) =>
      this.request<any>(`/cars/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(carData),
      }),

    delete: (id: string) =>
      this.request<void>(`/cars/${id}`, { method: 'DELETE' }),
  };

  // Wishlist APIs
  wishlist = {
    add: (auctionId: string) =>
      this.request<any>('/wishlist', {
        method: 'POST',
        body: JSON.stringify({ auctionId }),
      }),

    remove: (auctionId: string) =>
      this.request<void>(`/wishlist/${auctionId}`, { method: 'DELETE' }),

    getMy: () => this.request<any[]>('/wishlist/my-wishlist'),

    check: (auctionId: string) =>
      this.request<{ isInWishlist: boolean }>(`/wishlist/check/${auctionId}`),

    clear: () =>
      this.request<void>('/wishlist/clear', { method: 'DELETE' }),
  };

  // Payments APIs
  payments = {
    create: (paymentData: any) =>
      this.request<any>('/payments', {
        method: 'POST',
        body: JSON.stringify(paymentData),
      }),

    getMy: () => this.request<any[]>('/payments/my-payments'),

    getById: (id: string) => this.request<any>(`/payments/${id}`),
  };

  // Users APIs
  users = {
    getProfile: () => this.request<any>('/users/profile'),
    
    updateProfile: (userData: any) =>
      this.request<any>('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify(userData),
      }),
  };

  // Notifications APIs
  notifications = {
    getMy: () => this.request<any[]>('/notifications/my-notifications'),
    
    markAsRead: (id: string) =>
      this.request<void>(`/notifications/${id}/read`, { method: 'PATCH' }),

    markAllAsRead: () =>
      this.request<void>('/notifications/mark-all-read', { method: 'PATCH' }),
  };
}

export const apiService = new ApiService();
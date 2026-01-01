import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect() {
    if (this.socket?.connected) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true,
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      this.isConnected = false;
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // Auction room management
  joinAuction(auctionId: string) {
    if (this.socket) {
      this.socket.emit('joinAuction', { auctionId });
    }
  }

  leaveAuction(auctionId: string) {
    if (this.socket) {
      this.socket.emit('leaveAuction', { auctionId });
    }
  }

  // Event listeners
  onNewBid(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('newBid', callback);
    }
  }

  onAuctionStarted(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('auctionStarted', callback);
    }
  }

  onAuctionEnded(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('auctionEnded', callback);
    }
  }

  onAuctionWon(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('auctionWon', callback);
    }
  }

  onOutbid(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('outbid', callback);
    }
  }

  onPaymentUpdate(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('paymentUpdate', callback);
    }
  }

  onAuctionStatus(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('auctionStatus', callback);
    }
  }

  // Remove listeners
  off(event: string, callback?: (data: any) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  // Check connection status
  get connected() {
    return this.isConnected && this.socket?.connected;
  }
}

export const socketService = new SocketService();
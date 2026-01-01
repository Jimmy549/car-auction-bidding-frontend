# Car Auction Bidding Frontend

A modern Next.js frontend for car auction bidding platform with real-time bidding functionality.

## Features

- 🚗 Browse car auctions
- 🔐 User authentication
- 💰 Real-time bidding
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS
- 🔔 Real-time notifications
- 📸 Image galleries
- 💳 Payment integration

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **State Management**: Redux Toolkit
- **Real-time**: Socket.IO Client
- **Forms**: Formik + Yup
- **Icons**: Lucide React

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_SOCKET_URL=your_backend_socket_url
```

## Pages

- `/` - Home page with featured auctions
- `/car-auction` - Browse all auctions
- `/auction/[id]` - Auction details and bidding
- `/login` - User login
- `/register` - User registration
- `/profile` - User profile
- `/sell-your-car` - Create auction

## Deployment

Ready for Vercel deployment with optimized Next.js configuration.

## License

MIT
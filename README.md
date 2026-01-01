# Car Auction Frontend

A modern Next.js frontend for a car auction platform with real-time bidding capabilities.

## Features

- User authentication and registration
- Browse and search auctions
- Real-time bidding interface
- User profiles and dashboards
- Responsive design with Tailwind CSS
- Real-time notifications
- Payment integration

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: Redux Toolkit
- **Real-time**: Socket.IO Client
- **Forms**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

## Environment Variables

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_SOCKET_URL=your_socket_server_url
```

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run dev

# build
npm run build

# start production
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # Reusable components
│   ├── ui/             # shadcn/ui components
│   └── ...             # Custom components
├── lib/                # Utility functions
├── store/              # Redux store and slices
├── types/              # TypeScript type definitions
└── hooks/              # Custom React hooks
```

## Deployment

This app is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel for automatic deployments.

## License

MIT
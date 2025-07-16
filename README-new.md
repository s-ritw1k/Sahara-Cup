# 🏓 Sahara Cup 2025 - Tournament Management System

A professional, real-time table tennis tournament management system built with React, TypeScript, and Node.js. Features a beautiful dark-mode UI for tracking live matches, leaderboards, and tournament results.

## ✨ Features

### Public Interface
- **Tournament Overview**: Real-time tournament status and statistics
- **Live Matches**: Live score tracking with real-time updates
- **Leaderboard**: Dynamic player rankings and standings
- **Group Management**: Group-wise standings and match results
- **Match Schedules**: Upcoming and completed match information

### Admin Panel
- **Secure Authentication**: JWT-based admin login system
- **Live Score Updates**: Real-time match score management
- **Match Control**: Start/pause/complete matches
- **Tournament Administration**: Full tournament management capabilities

### Technical Features
- **Real-time Updates**: WebSocket integration for instant data synchronization
- **Professional UI**: Dark theme with corporate-grade design
- **Responsive Design**: Mobile-friendly interface
- **Type Safety**: Full TypeScript implementation
- **Modern Stack**: React 19, Vite, Express, Socket.IO

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone and Install**
   ```bash
   # Install frontend dependencies
   npm install
   
   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

2. **Start Development Servers**
   ```bash
   # Start both frontend and backend concurrently
   npm run dev:full
   
   # Or start them separately:
   # Frontend (http://localhost:5173)
   npm run dev
   
   # Backend (http://localhost:3001)
   npm run dev:server
   ```

3. **Access the Application**
   - **Tournament Site**: http://localhost:5173
   - **Admin Panel**: http://localhost:5173/admin/login
   - **API Endpoint**: http://localhost:3001/api

## 🔐 Admin Access

**Demo Credentials:**
- Username: `admin`
- Password: `admin123`

## 🏗️ Project Structure

```
sahara-cup/
├── src/                          # Frontend React application
│   ├── components/               # Reusable UI components
│   ├── pages/                    # Page components
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API and Socket services
│   ├── types/                    # TypeScript type definitions
│   └── index.css                 # Tailwind CSS styles
├── server/                       # Backend Node.js application
│   ├── src/
│   │   ├── data/                 # Sample tournament data
│   │   ├── server.ts             # Express server setup
│   │   └── types.ts              # Backend type definitions
│   └── package.json
└── package.json                  # Frontend dependencies
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Socket.IO Client** - Real-time communication
- **Heroicons** - Beautiful icons
- **Axios** - HTTP client
- **date-fns** - Date formatting

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests

## 📱 Usage

### For Tournament Viewers
1. Visit the main site to view live tournament progress
2. Check real-time match scores and upcoming games
3. View current leaderboard and player standings
4. Browse group results and statistics

### For Tournament Administrators
1. Login to the admin panel with provided credentials
2. Start upcoming matches when players are ready
3. Update live scores in real-time during matches
4. Complete matches and view updated standings
5. Monitor overall tournament progress

## 🔄 Real-time Features

The application uses WebSocket connections to provide:
- **Live Score Updates**: Scores update instantly across all connected clients
- **Match Status Changes**: Real-time match start/completion notifications
- **Leaderboard Updates**: Dynamic ranking changes as matches complete
- **Tournament Statistics**: Live tournament progress tracking

## 🎨 Design Philosophy

- **Professional Appearance**: Corporate-grade UI suitable for office tournaments
- **Dark Theme**: Easy on the eyes with excellent contrast
- **Intuitive Navigation**: Clear, logical user interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility**: WCAG compliant with proper focus management

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001
```

**Backend (server/.env)**
```env
PORT=3001
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## 📦 Build & Deployment

### Development
```bash
npm run dev:full          # Start both frontend and backend
```

### Production Build
```bash
npm run build             # Build frontend
npm run build:server      # Build backend
npm run start:server      # Start production server
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🏆 Tournament Features

- **Group Stage**: Round-robin group play
- **Live Scoring**: Real-time score tracking
- **Player Statistics**: Wins, losses, set ratios
- **Match History**: Complete tournament record
- **Admin Controls**: Full tournament management

---

**Built with ❤️ for competitive table tennis tournaments**

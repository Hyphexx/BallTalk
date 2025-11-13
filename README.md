# 🏈 BallTalk - NFL Fan Hub


**Live Demo: [https://ball-talk.vercel.app](https://ball-talk.vercel.app)**

A dynamic React and Node.js application that brings NFL fans together through curated news, community discussions, and exciting game highlights. BallTalk is your ultimate destination for everything NFL.

## ✨ Live Features

### 📰 **News & Updates**
- **Team-Focused Coverage**: Get the latest news specific to your favorite NFL teams
- **Curated Content**: Hand-picked articles from trusted NFL sources
- **Real-time Updates**: Stay current with breaking news and developments

### 💬 **Team Talk Community**
- **Reddit Integration**: Access real discussions from NFL subreddits
- **Team-Specific Threads**: Dedicated spaces for each NFL team's community
- **Live Fan Opinions**: See what fans are actually talking about right now

### 🎥 **Highlights & Videos**
- **YouTube Integration**: Watch the latest game highlights and analysis
- **Game Recap Central**: Relive the best moments from recent matches
- **Curated Video Content**: Official NFL videos and creator content

## 🚀 Tech Stack

### Frontend (Client)
- **React** - Modern, component-based UI framework
- **React Router** - Seamless single-page application navigation
- **Axios** - Efficient API communication
- **Modern CSS** - Responsive design with flexbox/grid

### Backend (API)
- **Node.js** - Scalable server-side runtime
- **Express.js** - Robust web application framework
- **CORS Enabled** - Secure cross-origin requests

### Integrations
- **YouTube Data API** - Latest highlights and video content
- **News API** - Real-time NFL news aggregation
- **Reddit API** - Authentic fan discussions and opinions

## 🎯 Quick Start

### Visit Live Site:
🌐 **[https://ball-talk.vercel.app](https://ball-talk.vercel.app)**

### Local Development:
```bash
# Clone repository
git clone https://github.com/yourusername/balltalk.git
cd balltalk

# Install backend dependencies
cd api
npm install

# Install frontend dependencies
cd ../client
npm install

# Start development servers
# Backend (from /api directory)
npm run dev

# Frontend (from /client directory)  
npm start
```

## 📱 How to Use BallTalk

1. **Explore News**: Check the News page for latest team updates and breaking news
2. **Join Discussions**: Visit Team Talk to see real Reddit discussions from NFL communities
3. **Watch Highlights**: Browse the Highlights page for the latest game videos and analysis
4. **Team Focus**: Get content specific to your favorite NFL teams

## 🏗 Project Structure

```
BallTalk/
├── api/                    # Node.js Backend Server
│   ├── controllers/       # Business logic handlers
│   ├── middleware/        # Custom middleware
│   ├── routes/           # API route definitions
│   ├── node_modules/     # Backend dependencies
│   ├── .env              # Environment variables
│   └── index.js          # Server entry point
├── client/               # React Frontend
│   ├── build/           # Production build files
│   ├── public/          # Static assets
│   ├── src/             # React source code
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Main application pages
│   │   └── .env         # Frontend environment variables
│   └── package.json     # Frontend dependencies
└── README.md            # Project documentation
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/news/:team` | Get team-specific news |
| `GET` | `/api/reddit/team` | Retrieve community discussions from Reddit |
| `GET` | `/api/highlights` | Get curated YouTube video content |

## 🌟 Key Features

- **🎯 Real Fan Discussions**: Direct Reddit integration for authentic conversations
- **📱 Responsive Design**: Optimized for desktop and mobile devices
- **⚡ Fast Performance**: Efficient API calls and smooth user experience
- **🎨 Clean Interface**: Intuitive navigation and modern UI design
- **🔒 Secure API**: Proper CORS configuration and environment variable management

## 📄 Environment Setup

### Backend (.env)
```env
YOUTUBE_API_KEY=your_youtube_api_key
NEWS_API_KEY=your_news_api_key
PORT=5000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

This project is deployed on **Vercel** with:
- Automatic deployments from main branch
- Environment variables configured in Vercel dashboard
- Optimized build process for React and Node.js

---

**⭐ Star us on GitHub if you love BallTalk!**

---

*Built with passion for NFL fans everywhere 🏈*

# SkillVerse - Play Learn Platform

A comprehensive learning and career development platform combining skill-building, competitive programming, and career guidance.

## 🚀 Deployment

**Frontend on Vercel + Backend on Render (Recommended)**
→ See the full guide: [RENDER_DEPLOYMENT.md](./RENDER_DEPLOYMENT.md)


```
skillverse-play-learn/
├── frontend/              # React + Vite frontend application
│   ├── src/              # React components, pages, utilities
│   ├── public/           # Static assets
│   ├── index.html        # HTML entry point
│   ├── package.json      # Frontend dependencies
│   ├── vite.config.ts    # Vite configuration
│   ├── tailwind.config.ts # TailwindCSS configuration
│   ├── tsconfig.json     # TypeScript configuration
│   └── ...
│
├── backend/              # Node.js + Express backend server
│   ├── server.js         # Main server file
│   ├── config/           # Configuration files
│   ├── controllers/      # Business logic
│   ├── models/           # Database schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Custom middleware
│   ├── package.json      # Backend dependencies
│   ├── .env              # Environment variables
│   ├── start-server.bat  # Server startup script
│   ├── supabase/         # Supabase configuration
│   └── ...
│
├── docs/                 # Documentation
│   ├── CAREER_HUB_*.md
│   ├── CERTIFICATE_*.md
│   ├── COMPETITIVE_PROBLEMS_*.md
│   ├── PROFILE_EDIT_*.md
│   └── ...
│
└── README.md            # This file
```

## Getting Started

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend
npm install
npm run dev
# or
node server.js
```

The backend API will be available at `http://localhost:5000`

## Features

- **Skill-based Learning**: Comprehensive course content and skill tracking
- **Competitive Programming**: Algorithm challenges and problem solving
- **Career Hub**: Internship opportunities and job listings
- **Certificates**: Achievement certificates for completed courses
- **Social Features**: Club system and user interactions
- **Event Management**: Event registration and management
- **Profile Management**: User profile editing and customization

## Technology Stack

### Frontend
- React 18+
- TypeScript
- Vite
- TailwindCSS
- Shadcn/UI Components

### Backend
- Node.js + Express
- MongoDB
- JWT Authentication
- MongoDB Atlas

## Environment Configuration

Each service has its own `.env` file:
- `frontend/.env` - Frontend API configuration
- `backend/.env` - Backend database and API keys

See the `.env.example` files in each directory for required variables.

## Documentation

Comprehensive documentation is available in the `docs/` folder covering:
- Feature implementation guides
- API specifications
- Setup instructions
- Architecture decisions

## Development

### Running both services simultaneously

1. Open two terminals
2. Terminal 1: `cd frontend && npm run dev`
3. Terminal 2: `cd backend && npm run dev`

### Building for Production

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
# No build step needed, node runs directly
```

## Contributing

Please follow the project structure and maintain the separation between frontend and backend code.

## License

Proprietary - SkillVerse Platform

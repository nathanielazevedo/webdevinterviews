# WebDev Interviews Backend

Real-time coding battle platform with WebSocket support and REST API server built with TypeScript, Express, and Prisma.

## Features

- **Real-time Battles**: WebSocket-powered multiplayer coding battles
- **Question Management**: LeetCode-style coding questions with difficulty levels
- **Location Services**: IP-based geolocation for battle matching
- **Authentication**: Supabase Auth integration with JWT
- **Database**: PostgreSQL with Prisma ORM
- **Type Safety**: Full TypeScript support with shared types

## Structure

```
src/
├── index.ts              # Server entry point
├── app.ts               # Express app configuration  
├── server.ts            # HTTP server setup
├── startup.ts           # Application initialization
├── shutdown.ts          # Graceful shutdown handling
├── config/
│   └── database.ts      # Database configuration
├── data/
│   └── questions.data.ts # Sample question data
├── managers/
│   └── BattleTimingManager.ts # Battle scheduling logic
├── middleware/
│   └── auth.ts          # Authentication middleware
├── routes/
│   ├── battle.ts        # Battle endpoints
│   ├── questions.ts     # Question endpoints
│   └── location.ts      # Location/geocoding endpoints
├── services/
│   ├── battle.service.ts           # Main battle service
│   ├── battle-core.service.ts      # Core battle logic
│   ├── battle-participation.service.ts # User participation
│   ├── battle-query.service.ts     # Battle queries
│   ├── battle-scheduling.service.ts # Battle scheduling
│   ├── battle-stats.service.ts     # Battle statistics
│   ├── questions.service.ts        # Question management
│   ├── location.service.ts         # Geolocation services
│   └── supabase-client.service.ts  # Supabase integration
├── types/
│   └── battle.service.types.ts     # Service type definitions
├── utils/
│   ├── constants.ts     # Application constants
│   ├── logger.ts        # Winston logging
│   ├── response.ts      # Standardized API responses
│   └── validation.ts    # Request validation
└── websocket/
    ├── WebSocketManager.ts        # WebSocket connection management
    ├── WebSocketAuthService.ts    # WS authentication
    ├── WebSocketBroadcastService.ts # Message broadcasting
    ├── WebSocketMessageHandler.ts # Message routing
    └── WebSocketUserService.ts    # User session management

prisma/
├── schema.prisma        # Database schema
├── seed.ts             # Database seeding
└── migrations/         # Database migrations

scripts/
└── reset-and-seed-questions.ts # Database reset utility
```

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Supabase project for authentication

### Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env`):
```env
DATABASE_URL="postgresql://username:password@localhost:5432/webdevinterviews"
SUPABASE_URL="your-supabase-url"
SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-key"
PORT=3001
```

3. Set up database:
```bash
npm run db:migrate    # Run migrations
npm run db:generate   # Generate Prisma client
npm run db:seed       # Seed with sample data
```

4. Start development server:
```bash
npm run dev
```

## Scripts

### Development
- `npm run dev` - Start with hot reload using tsx
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes (dev only)
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset-seed` - Reset and seed questions

### Code Quality
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run lint:check` - Check for warnings
- `npm test` - Run tests (placeholder)

## API Endpoints

### REST API
- `GET /` - Health check
- `GET /battle/history` - Get battle history
- `GET /questions` - Get all questions
- `GET /location/points` - Get location points
- `POST /location/geocode` - Geocode IP address

### WebSocket Events
- `battle:join` - Join a battle
- `battle:leave` - Leave a battle
- `battle:update` - Battle state updates
- `battle:start` - Battle started
- `battle:end` - Battle ended

## Architecture

### Battle System
The battle system is built around several core services:
- **BattleCore**: Manages battle lifecycle and state
- **BattleParticipation**: Handles user joining/leaving
- **BattleScheduling**: Manages battle timing and scheduling
- **BattleQuery**: Provides battle data queries
- **BattleStats**: Tracks battle statistics

### WebSocket Architecture
- **WebSocketManager**: Central connection management
- **WebSocketAuthService**: Handles authentication
- **WebSocketBroadcastService**: Message distribution
- **WebSocketMessageHandler**: Message routing and processing
- **WebSocketUserService**: User session tracking

### Database Schema
- **Battle**: Battle instances with timing and configuration
- **BattleParticipation**: User participation in battles
- **BattleQuestionPool**: Questions assigned to battles
- **Question**: Coding questions with solutions and test cases
- **LocationPoint**: Geographic data for users

## Deployment

The application is configured for Railway deployment with:
- Automatic builds via `build.sh`
- Environment variable configuration
- PostgreSQL database integration
- Prisma migrations on deploy
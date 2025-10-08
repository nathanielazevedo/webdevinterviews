# API Configuration Documentation

## Overview
All backend URLs and API endpoints are now centralized in `/src/config/api.ts` for easier management and environment-specific configuration.

## Configuration Files

### `/src/config/api.ts`
Contains all API endpoints and helper functions:
- WebSocket server URL for real-time battle communication
- REST API base URL for HTTP requests  
- Data API URL for static data endpoints
- Development fallback URLs

### Helper Functions
- `getWebSocketUrl()` - Returns the appropriate WebSocket URL
- `getApiBaseUrl()` - Returns the appropriate REST API base URL
- `getDataApiUrl()` - Returns the appropriate data API URL

## Environment Variables

Create a `.env` file in the root directory with:

```env
# WebSocket Server URL
VITE_WS_URL=wss://portfoliobackend-production-5f6f.up.railway.app

# REST API Base URL  
VITE_API_BASE_URL=https://portfoliobackend-production-5f6f.up.railway.app

# Data API URL
VITE_DATA_API_URL=https://data.webdevinterviews.com
```

## Usage Examples

```typescript
import { getWebSocketUrl, getApiBaseUrl, getDataApiUrl } from './config/api';

// WebSocket connection
const wsUrl = getWebSocketUrl();
const ws = new WebSocket(wsUrl);

// REST API calls
const apiUrl = getApiBaseUrl();
const response = await fetch(`${apiUrl}/api/endpoint`);

// Data API calls  
const dataUrl = getDataApiUrl();
const data = await fetch(`${dataUrl}/dogBreeds.json`);
```

## Development vs Production

The configuration automatically detects the environment using `import.meta.env`:
- **Production**: Uses environment variables or fallback to production URLs
- **Development**: Uses localhost URLs when environment variables are not set
- **Vite Environment**: Uses `import.meta.env` instead of `process.env` (browser-compatible)

## TypeScript Support

Environment variables are properly typed in `src/vite-env.d.ts` for better development experience.

## New Battle API Endpoints

The server now provides comprehensive REST API endpoints for battle management:

### Available Endpoints
- `GET /room/:roomId/players` - Get all players in a room
- `GET /room/:roomId/battle` - Get battle status for a room  
- `GET /user/:userId/battles?limit=50` - Get user's battle history
- `GET /user/:userId/stats` - Get user's battle statistics
- `GET /rooms/status?roomIds=room1,room2` - Get status of multiple rooms

### Helper Functions
```typescript
import { battleAPI, apiHelpers } from './config/api';

// URL builders
const playersUrl = battleAPI.getRoomPlayers('room123');
const battleUrl = battleAPI.getRoomBattle('room123');

// API helpers with error handling
const players = await apiHelpers.fetchRoomPlayers('room123');
const battle = await apiHelpers.fetchRoomBattle('room123');
const userStats = await apiHelpers.fetchUserStats('user456');
```

### Custom Hooks
```typescript
import { useRoomBattle, useUserStats, useRoomsStatus } from './hooks/useBattleAPI';

// React hooks for easy data fetching
const { battle, loading, error } = useRoomBattle('room123');
const { stats } = useUserStats('user456');
const { roomsStatus } = useRoomsStatus(['room1', 'room2']);
```

### WebSocket Room Watching
```typescript
const { watchedRooms, watchRooms, unwatchRooms } = useWebSocket(url, roomId, userId);

// Watch multiple rooms for status changes
watchRooms(['room1', 'room2', 'room3']);

// Stop watching
unwatchRooms();
```

## Migration Completed

✅ **TestRunner.tsx** - Updated to use `getWebSocketUrl()`
✅ **BattleMain.tsx** - Updated to use `getWebSocketUrl()`  
✅ **API Config** - Centralized all backend URLs
✅ **Environment Example** - Created `.env.example` for documentation
✅ **Battle API** - Added REST endpoint helpers and TypeScript types
✅ **Custom Hooks** - Created React hooks for battle API integration
✅ **WebSocket Enhancement** - Added room watching functionality

All hardcoded backend URLs have been replaced with the centralized configuration system and comprehensive API integration is now available.
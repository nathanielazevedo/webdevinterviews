# WEB DEV INTERVIEWS

Welcome to Web Dev Interviews, a full-stack application designed for web development interviews and coding practice.

## Overview

Web Dev Interviews is a modern full-stack application built with cutting-edge web technologies. It features real-time interactions, user authentication, and a comprehensive database system to demonstrate advanced web development skills.

## System Design

For a detailed list of the system design, please check [System Design Documentation](<https://www.figma.com/file/JvVsUnBbTV8VDEaYCnqJGZ/AWS-Diagrams-(Copy)?type=design&node-id=44834-3520&mode=design&t=rxMQkdeXjDUOwu51-0>).

## Technology Stack

### Frontend
- **React with TypeScript:** Type-safe, component-based frontend architecture
- **Vite:** Fast build tool and development server for optimal developer experience
- **Vercel:** Modern deployment platform for seamless frontend hosting

### Backend
- **Node.js:** JavaScript runtime for server-side development
- **WebSockets:** Real-time bidirectional communication for live features
- **Express.js:** Web framework for API endpoints and server logic

### Database & Authentication
- **Supabase PostgreSQL:** Robust, scalable PostgreSQL database with real-time capabilities
- **Supabase Auth:** Secure authentication and user management system

### Development & Testing
- **Jest and Testing Library:** Comprehensive testing frameworks ensuring code quality
- **GitHub Actions for CI/CD:** Automated workflows for continuous integration and deployment
- **TypeScript:** Static type checking across the entire application

# Features

Web Dev Interviews showcases modern full-stack development practices:

## Real-time Communication
- **WebSocket Integration:** Live updates and real-time interactions between users
- **Event-driven Architecture:** Responsive user experience with instant feedback

## Authentication & Security
- **Supabase Auth:** Secure user registration, login, and session management
- **Protected Routes:** Role-based access control throughout the application

## Database Management
- **PostgreSQL with Supabase:** Robust relational database with real-time subscriptions
- **Data Migrations:** Structured database schema evolution and version control

## Development Excellence
- **TypeScript:** Full type safety across frontend and backend
- **Monorepo Architecture:** Organized codebase with shared packages and utilities
- **Comprehensive Testing:** Unit and integration tests ensuring code reliability

## WebSocket Client Generation

**Yes!** You can generate TypeScript WebSocket clients from your AsyncAPI specification. Here's what I implemented:

### ✅ Generated WebSocket Client

1. **AsyncAPI Specification** (`packages/backend/asyncapi.yaml`)
   - Complete WebSocket API spec with all message types
   - Request/response schemas with proper validation

2. **Shared WebSocket Client** (`packages/shared/src/websocket/client.ts`)
   - TypeScript WebSocket client with convenience methods
   - Type-safe message handling and reconnection logic

### 🚀 Usage Example

```typescript
import { createWebSocketClient } from '@webdevinterviews/shared';

// Create and connect
const client = createWebSocketClient({ url: 'ws://localhost:3001' });

client.on('message', (message) => {
  switch (message.type) {
    case 'battle-status':
      console.log('Battle status:', message.status);
      break;
    case 'players-list':
      console.log('Players:', message.players.length);
      break;
  }
});

await client.connect();

// Use convenience methods
client.join('user123');
client.sendTestResults(8, 10);
```

### 📋 Available Commands

```bash
# Serve WebSocket documentation
cd packages/backend
npm run docs:websocket:serve
```

### 🎯 Benefits

- **Type Safety**: Full TypeScript support for all WebSocket messages
- **Convenience Methods**: Pre-built methods for each operation
- **Reconnection**: Built-in reconnection and error handling
- **Documentation**: Complete AsyncAPI specification

The WebSocket client provides a robust, type-safe interface for real-time battle functionality!

Thank you for checking out my code.

**Happy Coding!**

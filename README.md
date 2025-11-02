# Nathaniel Azevedo - Portfolio Website

Welcome to my portfolio website! This is a modern full-stack application showcasing my software engineering skills through a real-time coding battle platform.

## Overview

This portfolio demonstrates advanced web development capabilities through an interactive coding platform. It features real-time multiplayer battles, user authentication, geolocation services, and comprehensive database management - all built with modern technologies and best practices.

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

# Portfolio Features

This application showcases modern full-stack development practices and technical skills:

## Real-time Multiplayer Platform
- **WebSocket Integration:** Live coding battles with real-time participant updates
- **Battle Management:** Complete battle lifecycle from scheduling to completion
- **Geolocation Services:** IP-based location matching for battle participants
- **Event-driven Architecture:** Responsive user experience with instant feedback

## Authentication & Security
- **Supabase Auth:** JWT-based authentication with secure session management
- **Protected Routes:** Role-based access control throughout the application
- **Middleware Integration:** Custom authentication middleware for API endpoints

## Database Architecture
- **PostgreSQL with Prisma:** Type-safe database operations with comprehensive schema
- **Real-time Subscriptions:** Live data updates via Supabase real-time features
- **Migration System:** Structured database evolution with Prisma migrations
- **Data Seeding:** Automated database setup with coding questions and sample data

## Full-Stack Development Excellence
- **TypeScript:** End-to-end type safety across frontend, backend, and shared packages
- **Monorepo Architecture:** Organized codebase with shared types and utilities
- **Modern Build System:** Vite for frontend, TypeScript compilation for backend
- **Deployment Ready:** Railway and Vercel deployment configurations

## Development Commands

```bash
# Root level - build entire project
./build.sh

# Frontend development
cd packages/frontend
npm run dev

# Backend development  
cd packages/backend
npm run dev
npm run db:migrate    # Run database migrations
npm run db:studio     # Open Prisma Studio

# Shared package
cd shared
npm run build         # Compile TypeScript types
```

### 🎯 Technical Highlights

- **Type Safety**: Comprehensive TypeScript implementation with shared types
- **Real-time Features**: WebSocket-powered live battles and updates  
- **Modern Architecture**: Monorepo structure with clean separation of concerns
- **Database Design**: Normalized PostgreSQL schema with Prisma ORM
- **Authentication**: Secure JWT-based auth with Supabase integration
- **Deployment**: Production-ready with Railway (backend) and Vercel (frontend)

## About This Portfolio

This project demonstrates my ability to build complex, real-time applications using modern web technologies. It showcases skills in:

- **Full-Stack Development**: Complete application from database to UI
- **Real-time Systems**: WebSocket integration and event-driven architecture  
- **Database Design**: Normalized schemas and efficient querying
- **Authentication**: Secure user management and session handling
- **DevOps**: Automated builds, deployments, and CI/CD workflows
- **Code Quality**: TypeScript, ESLint, and architectural best practices

Thank you for exploring my work!

**— Nathaniel Azevedo**

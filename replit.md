# replit.md

## Overview

This is a React-based medical education application built with a modern full-stack architecture. The application appears to be designed for interactive medical case studies, specifically focused on gastric cancer diagnosis and treatment decision-making. It features a conversational interface that guides users through patient cases with images, multiple-choice questions, and file submissions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui component system
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **File Structure**: Organized into pages, components, hooks, and lib directories

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **File Handling**: Multer for file uploads (specifically .docx files)
- **Session Management**: Connect-pg-simple for PostgreSQL session storage

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database serverless
- **Image Storage**: Supabase Storage with public bucket access
- **Session Storage**: PostgreSQL-backed sessions
- **File Uploads**: Local filesystem storage via Multer

## Key Components

### Frontend Components
- **ConversationStep**: Main interactive component handling different step types (messages, images, multiple choice)
- **ProgressIndicator**: Visual progress tracking through the case study
- **Supabase Image Integration**: Custom hook for fetching images from Supabase storage
- **UI Component Library**: Comprehensive set of accessible components from Radix UI

### Backend Components
- **Route Registration**: Centralized route management in `routes.ts`
- **Storage Abstraction**: Memory-based storage implementation with user management
- **File Upload Handling**: Assignment submission endpoint with file validation
- **Vite Integration**: Development server setup with HMR support

### Database Schema
- **Users Table**: Basic user management with ID, username, and password fields
- **UUID Generation**: PostgreSQL's `gen_random_uuid()` for primary keys

## Data Flow

1. **User Interaction**: Users interact with conversation steps through button clicks
2. **State Management**: React Query manages server state and API calls
3. **Image Loading**: Images are fetched from Supabase storage on demand
4. **Progress Tracking**: Application tracks user progress through predefined steps
5. **File Submission**: Users can submit .docx files through the assignment endpoint
6. **Database Operations**: User data and sessions are managed through Drizzle ORM

## External Dependencies

### Third-Party Services
- **Supabase**: Used for image storage and retrieval
- **Neon Database**: Serverless PostgreSQL hosting
- **Environment Variables**: 
  - `DATABASE_URL` for database connection
  - `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for Supabase integration

### Key Libraries
- **UI/UX**: Radix UI, Tailwind CSS, Lucide React icons
- **Data Fetching**: TanStack React Query, Supabase JS client
- **Form Handling**: React Hook Form with Zod validation
- **File Processing**: Multer for uploads
- **Development**: Replit-specific plugins for error handling and cartography

## Deployment Strategy

### Development Environment
- **Hot Module Replacement**: Vite provides fast development experience
- **TypeScript Compilation**: Real-time type checking during development
- **Replit Integration**: Special plugins for Replit environment support

### Production Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles server code to `dist/index.js`
3. **Database Migration**: Drizzle Kit handles schema migrations
4. **Asset Management**: Static assets served from build directory

### Environment Configuration
- **Development**: Uses tsx for TypeScript execution and file watching
- **Production**: Compiled JavaScript execution with Node.js
- **Database**: Automatic connection via environment variable
- **Cross-platform**: ESM modules throughout the application

The application is designed for educational use in medical training, providing an interactive way to learn about gastric cancer diagnosis and treatment through case-based learning with visual aids and decision-making exercises.

## Recent Changes (January 2025)

### Assignment Submission System
- **Email-free submission system**: Implemented file upload with server-side logging instead of email integration
- **Student information collection**: Added student name input field for assignment tracking
- **Instructor dashboard**: Created `/submissions` page for viewing all submitted assignments
- **File management**: Submissions stored in `uploads/` directory with detailed logging
- **Notification system**: 
  - Real-time console logging with Korean language notifications
  - CSV-format log file (`submissions.log`) for persistent tracking
  - Web dashboard for instructor to view submissions
  - Direct file download capability for instructors

### User Interface Improvements
- **Korean language interface**: All text and notifications in Korean
- **Enhanced assignment component**: Separate submission form with validation
- **Success feedback**: Visual confirmation with green checkmark after submission
- **Responsive design**: Mobile-friendly layout following Material Design principles
- **Auto-scroll functionality**: Smooth scrolling to new content as conversation progresses
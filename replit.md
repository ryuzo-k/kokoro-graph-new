# Network Graph Visualization System

## Overview
This is a full-stack web application that visualizes personal and professional networks as interactive graphs. Users can manage connections between people, track relationships, and analyze network patterns through a modern React frontend with a Node.js/Express backend. The system uses PostgreSQL for data persistence via Drizzle ORM and provides both graph visualization and relationship management capabilities.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Graph Visualization**: Sigma.js with Graphology for interactive network graphs (with fallback rendering)

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Middleware**: JSON parsing, URL encoding, request logging, and error handling
- **Development**: Hot reloading with Vite integration in development mode

### Data Storage
- **Database**: Neon PostgreSQL 16.9 (production-ready with auto-scaling)
- **ORM**: Drizzle ORM with schema-first approach and optimized queries
- **Migrations**: Drizzle Kit for database migrations and schema management
- **Connection**: Neon Database serverless driver with connection pooling
- **Production Features**: Health checks, performance monitoring, automatic indexing
- **Security**: Secure connections, environment variable configuration

## Key Components

### Database Schema
- **People Table**: Stores person records with name, location, initials, average rating, and connection count
- **Connections Table**: Manages relationships between people with trust ratings, meeting counts, and location data
- **Validation**: Zod schemas for runtime type checking and API validation

### Graph Visualization
- **Interactive Canvas**: Sigma.js-powered graph rendering with zoom, pan, and node interactions
- **Fallback Rendering**: DOM-based graph display when Sigma.js is unavailable
- **Node Styling**: Dynamic sizing and coloring based on connection count and trust ratings
- **Edge Styling**: Visual representation of relationship strength and trust levels

### User Interface Components
- **Top Navigation**: Location filtering, search functionality, and branding
- **Graph Controls**: Zoom, pan, reset view, and layout toggle controls
- **Quick Entry Form**: Fast connection creation with validation
- **Profile Panel**: Detailed person information with connection history
- **Stats Overlay**: Real-time network statistics and analytics
- **Mobile Support**: Responsive design with mobile-optimized navigation

### API Endpoints
- **GET /api/people**: Retrieve all people or filter by location
- **GET /api/people/:id**: Get specific person details
- **POST /api/people**: Create new person records
- **GET /api/connections**: Retrieve all connections
- **POST /api/connections**: Create new connections
- **GET /api/stats**: Network analytics and statistics
- **POST /api/quick-entry**: Streamlined connection creation

## Data Flow

1. **User Interaction**: Users interact with the graph canvas or forms
2. **API Requests**: Frontend makes HTTP requests to Express backend
3. **Data Validation**: Zod schemas validate incoming data
4. **Database Operations**: Drizzle ORM handles PostgreSQL queries
5. **Response Processing**: TanStack Query caches and manages server state
6. **UI Updates**: React components re-render with new data
7. **Graph Rendering**: Sigma.js updates the visual representation

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm and drizzle-zod for database operations
- **UI**: @radix-ui components for accessible UI primitives
- **Forms**: react-hook-form with @hookform/resolvers for form management
- **Validation**: zod for schema validation
- **Styling**: tailwindcss with class-variance-authority for component variants

### Development Tools
- **Replit Integration**: @replit/vite-plugin-runtime-error-modal and @replit/vite-plugin-cartographer
- **Build**: esbuild for server bundling, tsx for TypeScript execution
- **Linting**: TypeScript compiler for type checking

## Deployment Strategy

### Development Mode
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with file watching for auto-restart
- **Database**: Connects to configured PostgreSQL instance
- **Integration**: Vite middleware integration for seamless development

### Production Build
- **Frontend**: Vite builds static assets to dist/public
- **Backend**: esbuild bundles server code to dist/index.js
- **Serving**: Express serves static files and API routes
- **Database**: Uses production PostgreSQL connection string

### Environment Configuration
- **DATABASE_URL**: Required PostgreSQL connection string
- **NODE_ENV**: Controls development vs production behavior
- **REPL_ID**: Enables Replit-specific development features

The system is designed for scalability and maintainability, with clear separation between frontend visualization, backend API logic, and data persistence layers. The graph-based approach allows for complex relationship analysis while maintaining intuitive user interactions.
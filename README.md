# Lendsqr Frontend Assessment Test

This application was developed as part of [Lendsqr's](https://lendsqr.com) frontend engineering assessment to demonstrate proficiency in building modern web applications. It is a modern, responsive 3-page dashboard application that features a login page, user listing, filtering, pagination, and detailed user profiles.

## Live Demo & Resources

- **Live Demo**: [https://david-aronmwan-lendsqr-fe-test.vercel.app](https://david-aronmwan-lendsqr-fe-test.vercel.app)
- **Figma Design**: [https://www.figma.com/file/ZKILoCoIoy1IESdBpq3GNC/Frontend](https://www.figma.com/file/ZKILoCoIoy1IESdBpq3GNC/Frontend)
- **Google Doc Explainer**: *Coming soon*
- **Loom Video Walkthrough**: *Coming soon*

## Tech Stack

### Core Framework & Libraries
- **React** - Modern UI library with concurrent features
- **TypeScript** - Static type checking for better code quality
- **Vite** - Fast build tool with HMR and optimized development experience
- **TanStack Router** - File-based routing with code splitting and type safety
- **TanStack Query** - Powerful server state management with caching
- **React Hook Form** - Performant forms with minimal re-renders
- **Zod** - Schema validation with TypeScript inference

### UI & Styling
- **Sass** - CSS preprocessing with advanced features and mixins
- **class-variance-authority** - Type-safe component variants
- **lucide-react** - Beautiful, customizable SVG icons
- **@base-ui/react** - Low-level UI primitives for building components

### Development & Testing
- **Vitest** - Fast unit testing framework
- **@testing-library/react** - Component testing utilities
- **ESLint & Prettier** - Code quality and formatting

## Features

### User Management Dashboard
- **User Listing**: Comprehensive table with all user data
- **Filtering**: Filter by organization, username, email, phone, date, and status
- **Pagination**: Configurable page sizes (10, 20, 50, 100 records)
- **User Status Management**: Activate, inactivate, or blacklist users
- **Search Functionality**: Quick search across user data

### User Detail Pages
- **Profile**: Personal information, contact details, and more
- **Status Badges**: Visual indicators for user status
- **Action Buttons**: Quick access to user management functions

### Authentication System
- **Session Management**: Persistent authentication state with LocalStorage
- **Protected Routes**: Automatic redirects for unauthenticated users
- **Demo Credentials**: `test@lendsqr.com` / `Test1234!`

## Setup & Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **pnpm** (recommended package manager)

### Quick Start
```bash
# Clone the repository
git clone https://github.com/d-a-ve/lendsqr-fe-test.git

# Navigate to project directory
cd lendsqr-fe-test

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Development Commands
```bash
# Run development server (port 3000)
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Type check
pnpm tc

# Run all quality checks
pnpm check

# Preview production build
pnpm preview
```

## Architecture Overview

### File-Based Routing With Tanstack Router
```
src/routes/
├── __root.tsx           # Root layout with navigation
├── index.tsx            # Home redirect to users or login page
├── auth/login.tsx       # Login page
└── _dashboard/          # Protected routes
    ├── route.tsx        # Dashboard Layout and Auth Guard
    ├── users.index.tsx  # Users listing
    └── users.$userId.tsx # User details
```

### Component Organization
```
src/
├── components/         # Reusable UI components
├── routes/             # Route-specific components
├── hooks/              # Custom React hooks
├── lib/                # Core utilities and configuration
├── styles/             # Global styles and SCSS abstracts
└── mocks/              # Mock data and fixtures
```

### State Management
- **Server State**: TanStack Query for API data management
- **Authentication**: LocalStorage with session persistence
- **Form State**: React Hook Form
- **UI State**: React hooks for local component state

### Styling Methodology
- **SCSS Modules**: Component-scoped styling
- **Design Tokens**: Consistent spacing, colors, and typography
- **Responsive Mixins**: Breakpoint management
- **CSS Variables**: Theme customization support

## Contributing

This project was developed as an assessment test. For questions or feedback, please contact the developer via [email](mailto:davearonmwan@gmail.com).


**Built with ❤️ for Lendsqr**
# MeetAI

A modern, full-stack web application built with Next.js 16, featuring authentication, a dashboard, and agent management capabilities.

## ✨ Features

- 🔐 **Authentication System** - Secure authentication powered by Better Auth
- 📊 **Dashboard** - Responsive dashboard with sidebar navigation
- 🤖 **Agent Management** - Create and manage AI agents
- 🎨 **Modern UI** - Beautiful UI components built with Radix UI and Tailwind CSS
- 🔄 **Type-Safe API** - End-to-end type safety with tRPC
- 💾 **Database** - PostgreSQL database with Drizzle ORM
- 📱 **Responsive Design** - Mobile-first responsive design
- 🎯 **Form Handling** - Robust form handling with React Hook Form and Zod validation

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **React:** 19.2.3
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI primitives
- **Forms:** React Hook Form + Zod validation
- **State Management:** TanStack React Query
- **Icons:** Lucide React

### Backend
- **API Layer:** tRPC 11
- **Authentication:** Better Auth
- **Database ORM:** Drizzle ORM
- **Database:** PostgreSQL (Neon)

### Development Tools
- **Language:** TypeScript 5
- **Linting:** ESLint
- **React Compiler:** Enabled for optimizations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 20 or higher
- npm or yarn or pnpm
- PostgreSQL database (recommended: Neon serverless)

## 🚀 Getting Started

### 1. Install the project

```bash
cd meetai
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Better Auth
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database

Push the database schema:

```bash
npm run db:push
```

To open Drizzle Studio for database management:

```bash
npm run db:studio
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
meetai/
├── src/
│   ├── app/                      # Next.js app directory
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   └── trpc/             # tRPC endpoints
│   │   ├── auth/                 # Auth pages (sign-in, sign-up)
│   │   └── dashboard/            # Dashboard pages
│   │       └── agents/           # Agent management
│   ├── components/               # React components
│   │   └── ui/                   # Reusable UI components
│   ├── db/                       # Database configuration
│   │   ├── index.ts              # Database client
│   │   └── schema.ts             # Database schema
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility libraries
│   │   ├── auth.ts               # Auth configuration
│   │   ├── auth-client.ts        # Auth client utilities
│   │   └── utils.ts              # General utilities
│   ├── modules/                  # Feature modules
│   │   ├── agents/               # Agent module
│   │   ├── auth/                 # Auth module
│   │   └── dashboard/            # Dashboard module
│   └── trpc/                     # tRPC configuration
│       ├── client.ts             # tRPC client
│       ├── server.ts             # tRPC server
│       └── routers/              # API routers
├── public/                       # Static assets
├── docs/                         # Documentation
├── drizzle.config.ts            # Drizzle ORM configuration
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🎯 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio

## 🔧 Configuration

### Database Schema

The database schema includes:
- **Users** - User accounts with email authentication
- **Sessions** - User session management
- **Accounts** - OAuth provider accounts
- **Verification** - Email verification tokens
- **Agents** - AI agent configuration and management

### Authentication

The app uses Better Auth for authentication with support for:
- Email/password authentication
- Session management
- Protected routes

### tRPC API

API routes are organized in the `src/trpc/routers/` directory. The main router is exported from `_app.ts`.

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `NEXT_PUBLIC_APP_URL`

## 📚 Key Features Explained

### Dashboard

The dashboard provides:
- Navigation sidebar with command palette
- User profile management
- Quick access to all features

### Agent Management

Manage AI agents with:
- Create new agents
- View agent list
- Configure agent settings

### UI Components

Built with shadcn/ui, including:
- Forms, inputs, and selects
- Dialogs and modals
- Tables and data display
- Navigation menus
- And many more...

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Built With

- [Next.js](https://nextjs.org/) - React framework
- [tRPC](https://trpc.io/) - End-to-end typesafe APIs
- [Better Auth](https://better-auth.com/) - Authentication
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [Radix UI](https://www.radix-ui.com/) - UI primitives
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
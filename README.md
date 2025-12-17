# myprojectname Next.js

A modern authentication and user management system built with Next.js 16, featuring role-based access control, dark mode, and a beautiful dashboard interface.

## Quickstart

1. **Run setup script** - Configure your project name (replaces `myprojectname` with your project name):
   ```bash
   bun run setup
   ```
   Or pass the project name directly:
   ```bash
   bun run setup "my-project-name"
   ```

2. **Run PostgreSQL** - Start your PostgreSQL server to get the connection URL
3. **Set up environment variables** - Create a `.env` file and add your PostgreSQL connection URL:
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/myprojectname?schema=public"
   ```
4. **Install dependencies and set up the project:**

```bash
bun install
bunx prisma migrate dev
bun run db:seed
bun run dev
```

The application will be available at [http://localhost:50400](http://localhost:50400)

## Features

- 🔐 **Authentication System** - Secure login/logout with session management
- 👥 **User Management** - Admin dashboard for managing users (CRUD operations)
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🌙 **Dark Mode** - Full dark mode support with theme toggle
- 📱 **Responsive Design** - Mobile-friendly sidebar and dashboard
- 🔒 **Role-Based Access Control** - Admin and User roles
- 🧪 **E2E Testing** - Playwright tests for authentication flows
- ⚡ **TanStack Query** - Efficient data fetching and caching
- 🗄️ **Prisma ORM** - Type-safe database access

## Prerequisites

Before you begin, ensure you have the following installed:

- [Bun](https://bun.sh/) (v1.3.4 or later) - Package manager and runtime
- [PostgreSQL](https://www.postgresql.org/) (v12 or later) - Database
- [Node.js](https://nodejs.org/) (v18 or later) - Required for some tooling

## Installation

1. **Clone the repository**

```bash
git clone https://github.com/fadhilx/boilerplate-bun-nextjs-tanstackquery-prisma-shadcn-with-auth
cd myprojectname-next
```

2. **Set up environment variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/myprojectname?schema=public"
```

Replace `your_password` with your PostgreSQL password and adjust the connection string as needed.

3. **Create the database**

```bash
# Using psql
createdb myprojectname

# Or using PostgreSQL CLI
psql -U postgres -c "CREATE DATABASE myprojectname;"
```

## Setup

Run the following commands to set up the project:

```bash
bun install
bunx prisma migrate dev
bunx prisma generate
```

**Note**: The `prisma migrate dev` command will:
- Generate the Prisma Client
- Create and apply migrations
- Set up the database schema

### Seed the Database

The Prisma seed script creates an admin user with the following credentials:
- **Email**: `admin@example.com`
- **Password**: `admin123`

```bash
bun run db:seed
```

## Running the Project

### Start Development Server

```bash
bun run dev
```

The application will be available at [http://localhost:50400](http://localhost:50400)

### Start Production Server

1. **Build the application**

```bash
bun run build
```

2. **Start the production server**

```bash
bun run start
```

## Testing

### Start Development Server with Test Environment

```bash
bun run dev:test
```

### Start Production Server with Test Environment

1. **Build with test environment**

```bash
bun run build:test
```

2. **Start the test production server**

```bash
bun run start:test
```

### Running Tests

```bash
bun run test
```

**Note**: Running tests will start the test server on its port set in `test.config.ts`.

### Port Configuration

By default:
- **Local environment**: Uses port `50400`
- **Test environment**: Uses port `50410`

These ports can be configured in `test.config.ts` for the test environment.

## Available Scripts

### Development

- `bun run dev` - Start development server (port 50400)
- `bun run dev:test` - Start development server with test database (port 50410)

### Database

- `bun run db:setup` - Generate Prisma Client and apply migrations
- `bun run db:clean` - Drop all tables and reset database
- `bun run db:seed` - Seed database with initial data
- `bun run db:reset` - Clean, setup, and seed database
- `bun run db:generate` - Generate Prisma Client
- `bun run db:push` - Push schema changes to database
- `bun run db:migrate` - Create and apply new migration
- `bun run db:migrate:deploy` - Apply pending migrations
- `bun run db:studio` - Open Prisma Studio (database GUI)
- `bun run db:studio:test` - Open Prisma Studio for test database

### Testing

- `bun run test` - Run all E2E tests
- `bun run test:ui` - Run tests with Playwright UI
- `bun run test:headed` - Run tests in headed mode
- `bun run test:debug` - Debug tests
- `bun run test:failed` - Run only failed tests
- `bun run test:report` - Show test report

### Production

- `bun run build` - Build for production
- `bun run build:test` - Build with test database
- `bun run start` - Start production server
- `bun run start:local` - Start production server on port 50400
- `bun run start:test` - Start production server with test database

### Other

- `bun run setup` - Run project setup script to configure project name
- `bun run lint` - Run ESLint

## Project Structure

```
myprojectname-next/
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema
│   ├── seed.ts          # Database seed script
│   └── migrations/      # Database migrations
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── api/         # API routes
│   │   ├── dashboard/   # Dashboard pages
│   │   ├── login/       # Login page
│   │   └── page.tsx     # Home page
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── app-sidebar.tsx
│   ├── lib/             # Utility functions
│   │   ├── auth.ts      # Authentication utilities
│   │   ├── prisma.ts    # Prisma client
│   │   └── queries/     # TanStack Query hooks
│   └── proxy.ts         # Next.js proxy (route protection)
├── scripts/
│   └── db/              # Database management scripts
└── tests/
    └── e2e/             # E2E tests
```

## Default Admin Account

After seeding the database, you can log in with:

- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: `ADMIN`

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query)
- **Testing**: [Playwright](https://playwright.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Package Manager**: [Bun](https://bun.sh/)

## Environment Variables

| Variable        | Description                                                   | Required |
| --------------- | ------------------------------------------------------------- | -------- |
| `DATABASE_URL`  | PostgreSQL connection string                                  | Yes      |
| `APP_ENV`       | Application environment (`development`, `test`, `production`) | No       |
| `NEXT_DIST_DIR` | Next.js build directory                                       | No       |

## Database Management

All database operations use Prisma. The schema is defined in `prisma/schema.prisma`.

### Reset Database

To completely reset the database (drop all tables, recreate, and seed):

```bash
bun run db:reset
```

This Prisma command will:
1. Drop all tables
2. Recreate the database schema
3. Run the seed script

### Create Migration

After modifying `prisma/schema.prisma`, create a new migration:

```bash
bun run db:migrate
```

This will:
1. Create a new migration file in `prisma/migrations/`
2. Apply the migration to your database
3. Regenerate the Prisma Client

### View Database

Open Prisma Studio (Prisma's database GUI) to view and edit data:

```bash
bun run db:studio
```

This opens a web interface at `http://localhost:5555` where you can browse and edit your database.

### Push Schema Changes (Development)

For rapid development, you can push schema changes without creating migrations:

```bash
bun run db:push
```

**Warning**: This bypasses migrations and should only be used in development.

## Deployment

### Vercel

The project includes a `vercel-build` script for Vercel deployment:

```bash
vercel-build
```

This script:
1. Generates Prisma Client
2. Applies migrations
3. Builds the Next.js application

### Environment Variables for Production

Set the following in your deployment platform:

- `DATABASE_URL` - Production database connection string

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `.env` is correct
- Check database exists: `psql -U postgres -l`

### Prisma Client Not Found

Run:

```bash
bun run db:generate
```

### Port Already in Use

Change the port in `package.json` scripts or kill the process using the port.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `bun run test`
5. Submit a pull request

## License

[Add your license here]

## Support

For issues and questions, please open an issue on GitHub.

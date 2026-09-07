# Backend Starter Boilerplate / Template

A production-ready, scalable, and modular backend starter template built with **Node.js**, **Express 5**, **TypeScript**, **Prisma ORM**, **PostgreSQL**, and **Vitest**.

Designed following Clean Architecture principles with a layered separation of concerns (Routes → Controllers → Services → Repositories → Database).

---

## 🌟 Features

- **TypeScript First**: Full type-safety across all layers, from database to API responses.
- **Express 5**: Modern HTTP routing with built-in async error handling.
- **Prisma ORM**: Type-safe database queries with PostgreSQL adapter, migrations, and seeding support.
- **Authentication & Authorization**:
  - JWT Access Token authentication.
  - Role-based authorization (`ADMIN`, `USER`).
  - Secure password hashing with bcrypt.
  - Email verification workflow.
  - Password reset with time-limited tokens and cooldown protection.
- **Standardized API Envelope**: Uniform JSON response structure for success and error handling (`ApiResponseDTO`).
- **Validation**: Schema-driven request body, query, and param validations using **Zod**.
- **Pagination**: Built-in generic pagination helper for repository queries and responses.
- **Logging**: Robust application logging with **Winston**.
- **File Uploads**: Configured **Multer** disk storage for file handling.
- **Unit Testing**: Preconfigured **Vitest** test suite with mocked repositories and services.
- **Code Quality**: Fast linting and formatting via **Biome** with **Husky** and **Commitlint** hooks.

---

## 📁 Directory Structure

```text
├── prisma/
│   ├── schema.prisma              # Database schema & models
│   └── seed/
│       ├── index.ts               # Database seed runner
│       └── user.seed.ts           # Initial user seeding
├── public/                        # Static and uploaded files
├── src/
│   ├── app.ts                     # Express app setup & middleware configuration
│   ├── index.ts                   # Server entry point & port listener
│   ├── config/
│   │   └── config.ts              # Centralized environment configurations
│   ├── constants/
│   │   ├── jwt.ts                 # JWT payload type definitions
│   │   └── *.html                 # Email HTML templates
│   ├── controllers/               # Request/Response handlers
│   │   ├── auth.controller.ts
│   │   ├── health.controller.ts
│   │   └── users.controller.ts
│   ├── dto/                       # Data Transfer Objects
│   │   └── response/
│   │       ├── api-response.dto.ts
│   │       ├── pagination.response.dto.ts
│   │       ├── auth/
│   │       └── users/
│   ├── middlewares/               # Express middlewares
│   │   ├── authenticate.middleware.ts  # JWT bearer token verification
│   │   ├── authorize.middleware.ts     # Role-based access control
│   │   ├── error.middleware.ts         # Centralized error handler
│   │   ├── file-uploads.middleware.ts  # Multer storage configuration
│   │   └── not-found.middleware.ts     # 404 handler
│   ├── repositories/              # Database data access layer (Prisma)
│   │   └── users.repositories.ts
│   ├── routes/                    # API Route definitions
│   │   ├── index.ts               # Main router aggregator (/api/v1)
│   │   ├── auth.route.ts
│   │   └── users.route.ts
│   ├── services/                  # Business logic layer
│   │   ├── auth.service.ts
│   │   └── users.service.ts
│   ├── tests/                     # Unit & integration tests
│   │   ├── authentication/
│   │   └── users/
│   ├── types/                     # Shared TypeScript types & Express declarations
│   ├── utils/                     # Shared utility helpers
│   │   ├── error-handler.ts       # Custom ApiError class
│   │   ├── logger.ts              # Winston logger instance
│   │   ├── pagination.ts          # Pagination response helper
│   │   ├── prisma.ts              # PrismaClient singleton
│   │   ├── send-email.ts          # Nodemailer helper
│   │   └── success-response.ts    # Standard success response formatter
│   └── validations/               # Zod validation schemas
│       ├── auth.schema.ts
│       ├── common.schema.ts
│       ├── pagination.schema.ts
│       └── users.schema.ts
├── .env.example                   # Environment variables template
├── biome.json                     # Biome linter & formatter configuration
├── package.json
├── tsconfig.json                  # TypeScript compiler configuration with @/* alias
└── vitest.config.ts               # Vitest configuration
```

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies

```bash
pnpm install
```

### 2. Environment Configuration

Copy the example environment file and update values according to your environment:

```bash
cp .env.example .env
```

Key environment variables:
| Variable | Description | Default |
|---|---|---|
| `PORT` | Server listening port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://...` |
| `JWT_SECRET` | Secret key for JWT signing | - |
| `TOKEN_SECRET` | Secret for HMAC hash tokens | - |
| `EMAIL_HOST` | SMTP server host | `smtp.mailtrap.io` |

### 3. Database Migration & Seed

Run Prisma commands to setup the database:

```bash
# Generate Prisma Client
pnpm run db:gen

# Push schema directly to database (development)
pnpm run db:push

# OR run migrations (production / staged)
pnpm run db:migrate

# Seed initial admin and test users
pnpm run db:seed
```

### 4. Running the Application

```bash
# Start development server with hot-reload
pnpm run dev

# Typecheck
pnpm run typecheck

# Build for production
pnpm run build

# Start production server
pnpm run start
```

---

## 📡 API Endpoints Overview

Base URL: `/api/v1`

### Health Check
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | Check service uptime and status |

### Authentication (`/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login and receive JWT access token |
| `POST` | `/auth/verify-email` | Public | Verify user email with token |
| `POST` | `/auth/send-verify-token` | Public | Resend email verification link |
| `POST` | `/auth/forgot-password` | Public | Request password reset token |
| `POST` | `/auth/reset-password` | Public | Reset password using reset token |

### Users (`/users`) - Requires `Authorization: Bearer <token>`
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users/me` | USER, ADMIN | Get current authenticated user profile |
| `PUT` | `/users/me` | USER, ADMIN | Update current authenticated user profile |
| `GET` | `/users` | ADMIN | List users with pagination and sorting |
| `GET` | `/users/:id` | ADMIN | Get specific user by ID |
| `PUT` | `/users/:id` | ADMIN | Update specific user by ID |
| `DELETE` | `/users/:id` | ADMIN | Delete user by ID |

---

## 🧪 Testing

Unit tests are written with [Vitest](https://vitest.dev/).

```bash
# Run tests in watch mode
pnpm run test

# Run tests once
pnpm run test:run

# Run tests with coverage report
pnpm run test:coverage
```

---

## 🛠️ How to Add a New Feature / Entity

Adding a new feature (e.g. `products`) is straightforward:

1. **Prisma Model**: Add the model in `prisma/schema.prisma` and run `pnpm run db:gen`.
2. **Repository**: Create `src/repositories/products.repository.ts` with Prisma query methods.
3. **Validations & DTOs**: Create schema validation in `src/validations/products.schema.ts`.
4. **Service**: Create business logic in `src/services/products.service.ts`.
5. **Controller**: Handle HTTP request/response in `src/controllers/products.controller.ts`.
6. **Routes**: Define endpoints in `src/routes/products.route.ts` and register it inside `src/routes/index.ts`.
7. **Tests**: Add unit tests in `src/tests/products/`.

---

## 📜 Commit Conventions

This repository enforces [Conventional Commits](https://www.conventionalcommits.org/):

Format: `<type>(optional scope): <description>`

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `test`: Adding or correcting tests
- `chore`: Build process or auxiliary tool changes

# Earnest Analytics Backend

## Stack
- Node.js + TypeScript
- Express
- Prisma ORM + PostgreSQL
- bcrypt for password hashing
- JWT for access / refresh tokens

## Project structure
- `src/app.ts` - express application setup
- `src/server.ts` - server bootstrap
- `src/config/database.ts` - Prisma client instance
- `src/controllers/authController.ts` - auth endpoints: register, login, refresh, logout
- `src/controllers/taskController.ts` - protected CRUD for tasks
- `src/services/authService.ts` - core user auth logic
- `src/services/taskService.ts` - task DB operations
- `src/middleware/auth.ts` - JWT middleware `authenticateToken`
- `src/utils/jwt.ts` - token creation and verification helpers
- `src/utils/validators.ts` - input validation for registration/login

## Prisma schema (PostgreSQL)
- `User` model: id, email (unique), password (hash), createdAt
- `Task` model: title, description, status, userId relation

## End-to-end flow (user story)
1. User registers via POST `/api/auth/register` with email + password.
2. Backend validates input (`validateRegisterInput`) and ensures uniqueness.
3. Backend hashes password with `bcrypt` and saves user via Prisma.
4. Backend returns JWT access + refresh tokens.
5. Frontend stores tokens in `localStorage` and sets auth state.
6. User accesses protected UI (`/dashboard`) using `ProtectedRoute` & `auth` middleware.
7. Frontend calls API endpoints for tasks:
   - GET `/api/tasks` (list)
   - POST `/api/tasks` (create)
   - PUT `/api/tasks/:id` (update)
   - DELETE `/api/tasks/:id` (delete)
8. Backend auth middleware verifies bearer token and attaches `req.user`.

## Run backend

```bash
cd backend
npm install
cp .env.example .env
# configure DATABASE_URL, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
npm run dev
```

API base URL: `http://localhost:4000/api`

## Notes for interview
- Clear separation of concerns (controller-service-DB)
- Security: hashed passwords, token auth, middleware
- UX: frontend validation, inline field errors + top-right toast.
- Extensible: add role field to User (admin/users), refresh token store, token rotation.

# Grillr — Backend API

> NestJS REST API powering Grillr, an AI mock-interview platform. Handles authentication, session management, and Claude AI integration for question generation and answer evaluation.

**Live demo:** [grillr-seven.vercel.app](https://grillr-seven.vercel.app) · [Frontend repo](https://github.com/koatth60/grillr) · [Portfolio](https://koatth60.github.io)

---

## Features

- **JWT authentication** — Register/login with bcrypt password hashing and signed JWTs
- **AI question generation** — Calls Anthropic Claude with the job description, returns 5 tailored questions
- **AI answer evaluation** — Submits candidate answers to Claude, returns structured feedback and score
- **PostgreSQL persistence** — TypeORM entities with automatic schema sync in development
- **Role-ready architecture** — Auth guard applied globally per route, easy to extend

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | TypeORM |
| Auth | JWT (passport-jwt) + bcryptjs |
| AI | Anthropic Claude (`claude-sonnet-4-6`) |
| Config | @nestjs/config (.env) |

## API Endpoints

### Auth

```
POST /auth/register    { name, email, password }  → { access_token, user }
POST /auth/login       { email, password }         → { access_token, user }
```

### Interview (requires Bearer token)

```
POST /interview/sessions              { jobTitle, jobDescription }  → session + questions
GET  /interview/sessions                                            → user's session history
POST /interview/questions/:id/answer  { answer }                   → question with feedback + score
```

## Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts      # /auth/register and /auth/login
│   ├── auth.service.ts         # bcrypt hashing, JWT signing
│   ├── auth.module.ts
│   ├── jwt.strategy.ts         # validates Bearer token, injects req.user
│   └── jwt-auth.guard.ts       # @UseGuards decorator
├── interview/
│   ├── interview.controller.ts # session and answer endpoints
│   ├── interview.service.ts    # Claude API calls + DB writes
│   ├── interview.module.ts
│   ├── interview-session.entity.ts
│   └── question.entity.ts
├── users/
│   └── user.entity.ts
└── app.module.ts               # TypeORM config, global modules
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL running locally or on a cloud provider

### Installation

```bash
git clone https://github.com/koatth60/grillr-back.git
cd grillr-back
npm install
```

### Environment variables

Create `.env` at the project root:

```env
# PostgreSQL
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=interview_prep

# JWT
JWT_SECRET=your-super-secret-key-change-this

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# App
PORT=4000
```

### Run in development

```bash
npm run start:dev
```

TypeORM `synchronize: true` will auto-create all tables on first run.

### Run in production

```bash
npm run build
npm run start:prod
```

> Set `synchronize: false` in `app.module.ts` and use migrations for production.

---

## Architecture Notes

**Claude integration** lives entirely in `interview.service.ts`. Two prompts:

1. `createSession` — sends job title + description, receives a JSON array of 5 questions
2. `submitAnswer` — sends question + user answer, receives `{ feedback, score }` JSON

**Auth flow:**
1. Client POSTs credentials to `/auth/login`
2. Server validates, returns a signed JWT
3. Client includes `Authorization: Bearer <token>` on all protected requests
4. `JwtStrategy` decodes and attaches `{ id, email }` to `req.user`

---

## Author

**Carlos Mendoza** — Full-stack developer specialising in React, Next.js, NestJS and PostgreSQL.

[GitHub](https://github.com/koatth60) · [Portfolio](https://koatth60.github.io)

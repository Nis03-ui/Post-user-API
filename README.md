# User Post API

A RESTful backend API built with **Node.js, Express.js, PostgreSQL, and Prisma ORM**.

This project was built to practice professional backend architecture, CRUD operations, relational database design, authentication, validation, centralized error handling, and API security.

---

## 🚀 Features

### User Management

* User registration
* User login
* Password hashing with bcrypt
* Get user data
* User CRUD operations
* Email uniqueness

### Post Management

* Create posts
* Get posts
* Get post by ID
* Update posts
* Delete posts
* User-owned post modification
* User/Post relationship

### Authentication

* JWT access tokens
* Short-lived access tokens
* Long-lived refresh tokens
* Refresh tokens stored as hashes in PostgreSQL
* Refresh token stored in `httpOnly` cookie
* Access token refresh endpoint
* Logout with refresh-token revocation
* Protected routes

### Validation & Error Handling

* Zod request validation
* Centralized error handling
* Custom `ApiError`
* Async error handling
* Not-found middleware
* Prisma error handling
* Consistent API responses

### Security

* Password hashing
* Helmet
* CORS
* Rate limiting
* `httpOnly` cookies
* Secure cookies in production
* Separate access and refresh token secrets

---

## 🛠️ Tech Stack

| Technology         | Purpose               |
| ------------------ | --------------------- |
| Node.js            | Runtime               |
| Express.js         | Web framework         |
| PostgreSQL         | Database              |
| Prisma ORM         | Database access       |
| JWT                | Authentication        |
| bcrypt             | Password hashing      |
| Zod                | Validation            |
| Helmet             | Security headers      |
| CORS               | Cross-origin security |
| express-rate-limit | Rate limiting         |
| cookie-parser      | Cookie handling       |

---

## 📁 Project Structure

```text
User Post API/
│
├── config/
│   └── db.js
│
├── controller/
│   ├── auth.controller.js
│   ├── post.controller.js
│   ├── user.controller.js
│   └── relationship.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   ├── notFound.middleware.js
│   ├── validate.middleware.js
│   ├── logger.js
│   └── ...
│
├── route/
│   ├── auth.routes.js
│   ├── post.route.js
│   ├── user.routes.js
│   └── user.post.routes.js
│
├── service/
│   ├── auth.service.js
│   ├── post.service.js
│   ├── user.service.js
│   └── relationship.service.js
│
├── utils/
│   ├── ApiError.js
│   ├── asyncHandler.js
│   └── handlePrismaError.js
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── .env
├── .gitignore
├── app.js
├── server.js
├── package.json
└── README.md
```

---

# 🗄️ Database Design

The application uses PostgreSQL with Prisma ORM.

### User

```text
User
├── id
├── name
├── email
├── password
└── createdAt
```

### Post

```text
Post
├── id
├── title
├── content
├── authorId
└── createdAt
```

### RefreshToken

```text
RefreshToken
├── id
├── tokenHash
├── userId
├── expiresAt
└── createdAt
```

### Relationships

```text
User 1 ──────────── N Post

User 1 ──────────── N RefreshToken
```

A user can create many posts.

A post belongs to one user.

A user can have multiple refresh-token records.

---

# 🔐 Authentication Flow

## Registration

```text
Client
  ↓
POST /api/auth/register
  ↓
Validate input
  ↓
Check existing user
  ↓
Hash password
  ↓
Create user
  ↓
Return safe user data
```

The password is never returned to the client.

---

## Login

```text
Client
  ↓
POST /api/auth/login
  ↓
Validate credentials
  ↓
Compare password
  ↓
Generate Access Token
  ↓
Generate Refresh Token
  ↓
Hash Refresh Token
  ↓
Store hash in PostgreSQL
  ↓
Raw Refresh Token → httpOnly Cookie
  ↓
Access Token → Client
```

### Token lifetimes

```text
Access Token  → 15 minutes
Refresh Token → 7 days
```

---

## Refresh Token

When the access token expires:

```text
POST /api/auth/refresh
        ↓
Read refresh token cookie
        ↓
Hash refresh token
        ↓
Find token in database
        ↓
Check database expiration
        ↓
Verify refresh JWT
        ↓
Verify user ID
        ↓
Generate new access token
```

The refresh token itself is never stored in plaintext in the database.

---

## Logout

```text
POST /api/auth/logout
        ↓
Read refresh token cookie
        ↓
Hash token
        ↓
Find stored token
        ↓
Delete database record
        ↓
Clear cookie
        ↓
Logout successful
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint             | Description                 |
| ------ | -------------------- | --------------------------- |
| POST   | `/api/auth/register` | Register a user             |
| POST   | `/api/auth/login`    | Login                       |
| POST   | `/api/auth/refresh`  | Generate a new access token |
| POST   | `/api/auth/logout`   | Logout                      |

---

## Users

| Method | Endpoint        | Description |
| ------ | --------------- | ----------- |
| GET    | `/api/user`     | Get users   |
| GET    | `/api/user/:id` | Get user    |
| POST   | `/api/user`     | Create user |
| PATCH  | `/api/user/:id` | Update user |
| DELETE | `/api/user/:id` | Delete user |

---

## Posts

| Method | Endpoint        | Description   |
| ------ | --------------- | ------------- |
| GET    | `/api/post`     | Get all posts |
| GET    | `/api/post/:id` | Get post      |
| POST   | `/api/post`     | Create post   |
| PATCH  | `/api/post/:id` | Update post   |
| DELETE | `/api/post/:id` | Delete post   |

Protected post operations use the authenticated user's ID rather than trusting `authorId` from the client.

---

## Relationships

| Method | Endpoint                     | Description          |
| ------ | ---------------------------- | -------------------- |
| GET    | `/api/relationship/user/:id` | Get user with posts  |
| GET    | `/api/relationship/post/:id` | Get post with author |

---

# ⚙️ Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
```

### 2. Enter the project

```bash
cd "User Post API"
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/user_post_api"

ACCESS_TOKEN_SECRET="your-access-token-secret"

REFRESH_TOKEN_SECRET="your-refresh-token-secret"

NODE_ENV="development"
```

Never commit `.env` to Git.

---

# 🗃️ Database Setup

Run Prisma migration:

```bash
npx prisma migrate dev
```

Generate Prisma Client if required:

```bash
npx prisma generate
```

---

# ▶️ Run the Application

Development:

```bash
npm run dev
```

Or:

```bash
node server.js
```

The API will run on your configured port.

---

# 🧪 Testing

You can test the API using:

* Postman
* Thunder Client
* Insomnia
* REST Client

Recommended testing order:

```text
1. Register
2. Login
3. Copy access token
4. Create post
5. Get posts
6. Update own post
7. Try updating another user's post
8. Delete own post
9. Refresh access token
10. Logout
11. Try refreshing after logout
```

---

# 🏗️ Architecture

The project follows a layered architecture:

```text
Request
   ↓
Route
   ↓
Middleware
   ↓
Controller
   ↓
Service
   ↓
Prisma
   ↓
PostgreSQL
```

### Route

Responsible for defining endpoints and middleware.

### Middleware

Responsible for cross-cutting concerns such as:

* Authentication
* Validation
* Logging
* Security
* Error handling

### Controller

Responsible for:

* Reading request data
* Calling services
* Returning HTTP responses

### Service

Responsible for:

* Business logic
* Database operations
* Authentication utilities

### Prisma

Responsible for communication with PostgreSQL.

This separation keeps controllers thin and business logic reusable.

---

# 🛡️ Error Handling

The project uses centralized error handling.

```text
Error
 ↓
asyncHandler
 ↓
Central Error Middleware
 ↓
ApiError / Prisma Error
 ↓
Consistent JSON Response
```

Example:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

Prisma-specific errors are converted into appropriate HTTP responses.

Examples:

```text
P2002 → 409 Conflict
P2025 → 404 Not Found
P2003 → 400 Bad Request
```

---

# 🔒 Security Practices

This project implements several important security practices:

* Passwords are hashed using bcrypt
* Passwords are never returned in API responses
* Access and refresh tokens use different secrets
* Refresh tokens are stored hashed in the database
* Refresh tokens are stored in `httpOnly` cookies
* Secure cookies are enabled in production
* Helmet provides security headers
* CORS is configured
* Rate limiting is used
* Protected routes verify JWT access tokens
* Clients cannot choose the `authorId` when creating protected posts

---

# 📚 What I Learned

This project was primarily built as a backend learning project.

Key concepts practiced:

* Express.js architecture
* REST API design
* MVC/layered architecture
* PostgreSQL
* Prisma ORM
* Prisma relationships
* CRUD operations
* Middleware
* Custom errors
* Centralized error handling
* Async error handling
* Zod validation
* Password hashing
* JWT authentication
* Access/refresh token architecture
* HTTP-only cookies
* Token hashing
* Authentication middleware
* Authorization through resource ownership
* API security
* Environment variables
* Database migrations

---

# 🚧 Future Improvements

The following features are intentionally **not included** in the current version but could be added later:

* Refresh-token rotation
* Refresh-token reuse detection
* Role-Based Access Control (RBAC)
* Admin roles
* Email verification
* Password reset
* OAuth authentication
* Advanced pagination
* Filtering and sorting
* API documentation with Swagger/OpenAPI
* Automated tests
* Docker
* CI/CD
* Production deployment

---

# 🎯 Project Goal

The goal of this project was not to build a huge application.

The goal was to understand how a **real Express backend is structured** and to move beyond putting all application logic inside route handlers.

The project focuses on:

```text
Clean Architecture
       +
Reusable Services
       +
Validation
       +
Error Handling
       +
Database Relationships
       +
Authentication
       +
Security
```

---

# 👨‍💻 Author

Built as a backend development learning project.

**Tech focus:** Node.js • Express.js • PostgreSQL • Prisma • JWT

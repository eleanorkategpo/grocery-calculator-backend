# KuripotKart Backend

This is the backend API for the KuripotKart application built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- User management (CRUD operations)
- Protected routes with middleware
- Error handling
- MongoDB integration

## Installation

1. Clone the repository
2. Navigate to the backend directory: `cd backend`
3. Install dependencies: `npm install`
4. Create a `.env` file in the root directory and add your environment variables (see `.env.example` for reference)
5. Start the server: `npm run dev`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/grocery-calculator
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Users

- `PATCH /api/users/updateMe` - Update user profile (protected)
- `PATCH /api/users/updateMyPassword` - Update user password (protected)
- `DELETE /api/users/deleteMe` - Delete user account (protected)

### Admin Only

- `GET /api/users` - Get all users (admin only)
- `POST /api/users` - Create a new user (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)

## Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon

## License

MIT 
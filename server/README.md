# Video Progress Tracker - Backend

The backend API for the Video Progress Tracking System built with Node.js, Express, and PostgreSQL.

## Features

- RESTful API
- User authentication with JWT
- Video management
- Progress tracking with interval merging algorithm
- PostgreSQL database with Sequelize ORM

## Technology Stack

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Set up environment variables by creating a `.env` file in the root directory:

```
PORT=5000
NODE_ENV=development
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=24h
```

3. Run database migrations:

```bash
npx sequelize-cli db:migrate
```

4. Seed the database with sample data:

```bash
npx sequelize-cli db:seed:all
```

5. Start the server:

```bash
npm run dev
# or
yarn dev
```

The API will be available at [http://localhost:5000](http://localhost:5000).

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Videos

- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get single video
- `POST /api/videos` - Create new video (protected)
- `PUT /api/videos/:id` - Update video (protected)
- `DELETE /api/videos/:id` - Delete video (protected)

### Progress

- `GET /api/progress` - Get user's progress for all videos (protected)
- `GET /api/progress/:videoId` - Get user's progress for a specific video (protected)
- `POST /api/progress/:videoId` - Update progress for a video (protected)
- `DELETE /api/progress/:videoId` - Reset progress for a video (protected)

## Project Structure

```
server/
├── config/             # Configuration files
├── controllers/        # Request handlers
├── db/                 # Database setup and migrations
│   ├── migrations/     # Database migrations
│   └── seeders/        # Database seeders
├── middleware/         # Express middleware
├── models/             # Data models
├── routes/             # API routes
├── services/           # Business logic
├── utils/              # Utility functions
└── server.js           # Main server file
```

## Progress Tracking Algorithm

The core of this system is the algorithm that tracks unique video intervals:

1. Record start and end times of every segment the user watches
2. Merge overlapping intervals to calculate unique seconds watched
3. Convert to percentage based on total video length
4. Store this information in the database
5. Resume from the appropriate position when the user returns

This ensures that only unique parts of the video that have been watched are counted towards progress.

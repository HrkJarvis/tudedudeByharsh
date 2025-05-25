# Video Progress Tracking System

A comprehensive system that accurately tracks how much of a lecture video a user has really watched by tracking unique viewing intervals.


## Key Features

- **Track Real Progress**: Only count unique parts of the video that have been watched
- **Prevent Skipping**: Don't count skipped sections as watched
- **Save and Resume**: Persist user progress and resume from where they left off
- **Visual Progress Indicator**: Show accurate progress percentage based on unique parts watched
- **Real-time Updates**: Progress bar updates in real-time as the video plays
- **Interval Visualization**: See exactly which parts of the video have been watched
- **Continue Watching**: Dashboard shows videos that are in progress for easy resumption

## Technical Architecture

### Frontend (React)
- Modern React application with hooks and context for state management
- ReactPlayer for video playback with custom progress tracking
- Custom hooks for video progress management
- Real-time progress visualization with interval tracking
- Responsive design with modern UI/UX

### Backend (Node.js + Express)
- RESTful API with JWT authentication
- User management with secure password handling
- Sophisticated progress tracking logic with interval merging
- Efficient data persistence with optimized database queries

### Database
- PostgreSQL for storing user data and progress information
- Sequelize ORM for database interactions
- Efficient schema design for storing video progress intervals

## Algorithm for Progress Tracking

The core of this system is the algorithm that tracks unique video intervals:

1. **Interval Recording**: When a user plays a video, we start recording an interval with a start time. When they pause or seek, we end that interval with an end time.

2. **Interval Merging**: We merge overlapping intervals to avoid double-counting. For example, if a user watches seconds 10-30, then watches 20-40, we merge these into a single interval of 10-40.

   ```javascript
   function mergeIntervals(intervals) {
     if (intervals.length <= 1) return intervals;
     
     // Sort intervals by start time
     const sortedIntervals = [...intervals].sort((a, b) => a.start - b.start);
     const result = [sortedIntervals[0]];
     
     for (let i = 1; i < sortedIntervals.length; i++) {
       const current = sortedIntervals[i];
       const lastMerged = result[result.length - 1];
       
       // If current interval overlaps with the last merged interval, merge them
       if (current.start <= lastMerged.end + 1) {
         lastMerged.end = Math.max(lastMerged.end, current.end);
       } else {
         // Otherwise, add the current interval to the result
         result.push(current);
       }
     }
     
     return result;
   }
   ```

3. **Progress Calculation**: We calculate the total unique seconds watched by summing the durations of all merged intervals, then divide by the total video duration to get a percentage.

   ```javascript
   function calculateUniqueWatchedTime(intervals) {
     return intervals.reduce((total, interval) => {
       return total + (interval.end - interval.start + 1);
     }, 0);
   }
   
   function calculateProgressPercentage(intervals, duration) {
     const totalWatchedSeconds = calculateUniqueWatchedTime(intervals);
     return (totalWatchedSeconds / duration) * 100;
   }
   ```

4. **Real-time Tracking**: As the video plays, we continuously update the current interval's end time and recalculate progress in real-time.

5. **Persistence**: We save the merged intervals and progress percentage to the database, allowing for accurate progress tracking across sessions.

## Design Decisions

### Interval-Based Progress Tracking
We chose an interval-based approach over simply tracking the furthest point reached because:
- It accurately represents which parts of the video were actually watched
- It prevents users from skipping through content and still getting credit
- It allows for detailed analytics on which parts of videos are most watched/rewatched

### Real-Time Progress Updates
We implemented real-time progress updates to:
- Provide immediate visual feedback to users
- Create a more engaging and responsive user experience
- Allow users to see their progress increase as they watch

### Merged Intervals for Unique Progress
We merge overlapping intervals to:
- Prevent double-counting of watched content
- Accurately represent the unique portions of the video that have been viewed
- Optimize storage by reducing the number of intervals stored

### Client-Side Progress Calculation with Server Persistence
We calculate progress on the client-side but persist it on the server to:
- Provide immediate feedback without waiting for server responses
- Reduce server load by batching updates
- Ensure progress is saved even if the user closes the browser

## Challenges and Solutions

### Challenge 1: Accurate Interval Tracking
**Problem**: Determining when to start and end intervals, especially with user interactions like seeking.

**Solution**: We implemented a sophisticated tracking system that:
- Starts a new interval when the video plays
- Ends the interval when the video pauses
- Handles seeking by ending the current interval and starting a new one
- Uses debouncing to prevent too many small intervals

### Challenge 2: Performance with Real-Time Updates
**Problem**: Updating the UI in real-time could cause performance issues, especially with frequent updates.

**Solution**: We optimized performance by:
- Using React's state management efficiently
- Implementing debouncing for server updates
- Using CSS transitions for smooth progress bar updates
- Limiting console logging to reduce overhead

### Challenge 3: Consistent Progress Across Devices
**Problem**: Ensuring that a user's progress is consistent when they switch devices.

**Solution**: We implemented:
- JWT-based authentication to identify users
- Server-side storage of progress data
- Efficient API endpoints for retrieving and updating progress
- Automatic resumption from the last position

## Setup Instructions

### Prerequisites
- Node.js (v14+)
- PostgreSQL
- npm or yarn

### Database Setup
1. Install PostgreSQL and create a new database:
   ```
   createdb videoprogressdb
   ```

2. Configure the database connection in `server/config/config.js`

### Backend Setup
1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run database migrations:
   ```
   npx sequelize-cli db:migrate
   ```

4. Start the server:
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/user` - Get current user information

### Video Endpoints
- `GET /api/videos` - Get all videos
- `GET /api/videos/:id` - Get a specific video

### Progress Endpoints
- `GET /api/progress/:videoId` - Get progress for a specific video
- `POST /api/progress/:videoId` - Update progress for a specific video
- `DELETE /api/progress/:videoId` - Reset progress for a specific video

## Project Structure

```
tutedude/
├── client/                 # React frontend
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   │   ├── layout/     # Layout components (Header, Footer)
│   │   │   ├── routing/    # Routing components
│   │   │   └── video/      # Video-related components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── styles/         # Global styles
│   │   ├── utils/          # Utility functions
│   │   └── App.js          # Main App component
│   └── package.json        # Frontend dependencies
├── server/                 # Node.js backend
│   ├── config/             # Configuration files
│   ├── controllers/        # Request handlers
│   ├── db/                 # Database setup and migrations
│   ├── middleware/         # Express middleware
│   ├── models/             # Data models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
└── README.md               # Project documentation
```

## Technologies Used

### Frontend
- React
- React Router
- React Player
- Axios
- Context API
- Custom Hooks
- CSS-in-JS

### Backend
- Node.js
- Express
- Sequelize ORM
- PostgreSQL
- JSON Web Tokens (JWT)
- bcrypt

## Future Enhancements

1. **Analytics Dashboard**: Provide detailed analytics on viewing patterns
2. **Heatmaps**: Show which parts of videos are most watched
3. **Bookmarks**: Allow users to bookmark specific points in videos
4. **Notes**: Enable note-taking at specific timestamps
5. **Offline Support**: Add offline viewing with progress syncing
6. **Mobile App**: Develop native mobile applications
7. **Content Recommendations**: Suggest videos based on viewing history

## Contributors

- Harsh Kushwaha - Full Stack  Developer

## License

This project is licensed under the MIT License - see the LICENSE file for details.

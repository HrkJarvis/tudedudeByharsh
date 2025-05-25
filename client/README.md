# Video Progress Tracker - Frontend

The frontend for the Video Progress Tracking System built with React.

## Features

- User authentication (register, login, logout)
- Video player with progress tracking
- Dashboard to view video progress
- Responsive design

## Technology Stack

- React.js
- React Router for navigation
- Axios for API requests
- React Player for video playback
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Create a `.env` file in the root directory with the following content:

```
REACT_APP_API_URL=http://localhost:5000/api
```

3. Start the development server:

```bash
npm start
# or
yarn start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
client/
├── public/             # Static files
├── src/                # Source code
│   ├── components/     # React components
│   │   ├── layout/     # Layout components
│   │   ├── routing/    # Routing components
│   │   └── video/      # Video-related components
│   ├── contexts/       # React contexts
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── utils/          # Utility functions
│   ├── App.js          # Main App component
│   └── index.js        # Entry point
└── package.json        # Dependencies
```

## Key Components

### Video Progress Tracking

The core functionality of this application is tracking unique video progress. This is implemented using:

1. **useVideoProgress Hook**: A custom hook that tracks video playback and manages watched intervals.
2. **ProgressBar Component**: Visualizes the watched portions of the video.
3. **VideoPlayer Component**: Integrates React Player with progress tracking.

### Progress Algorithm

The progress tracking algorithm:

1. Records start and end times of every segment the user watches
2. Merges overlapping intervals to calculate unique seconds watched
3. Converts to percentage based on total video length
4. Stores this information in the database
5. Resumes from the appropriate position when the user returns

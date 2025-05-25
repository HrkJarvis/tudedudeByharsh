import React, { useEffect, useState, useRef, useCallback } from 'react';
import ReactPlayer from 'react-player';
import useVideoProgress from '../../hooks/useVideoProgress';
import ProgressBar from './ProgressBar';

const VideoPlayer = ({ video }) => {
  const [player, setPlayer] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef(null);
  
  const {
    watchedIntervals,
    progressPercentage,
    lastPosition,
    getPlayerRef,
    handlePlay,
    handlePause,
    handleSeek,
    handleEnded
  } = useVideoProgress(video.id, video.duration);

  // Create a stable reference to the player
  const setPlayerReference = useCallback((playerInstance) => {
    console.log('Setting player reference in VideoPlayer');
    setPlayer(playerInstance);
    if (playerInstance) {
      getPlayerRef(playerInstance);
    }
  }, [getPlayerRef]);

  // Set player reference when it's ready
  useEffect(() => {
    if (player && !isReady) {
      setIsReady(true);
    }
  }, [player, isReady]);

  // Seek to last position when component mounts and player is ready
  useEffect(() => {
    if (player && isReady && lastPosition > 0) {
      // Use a small timeout to ensure the player is fully initialized
      const timer = setTimeout(() => {
        try {
          console.log('Seeking to last position:', lastPosition);
          player.seekTo(lastPosition);
          setCurrentTime(lastPosition);
        } catch (error) {
          console.error('Error seeking to last position:', error);
        }
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [player, lastPosition, isReady]);

  // Format time from seconds to MM:SS
  const formatTime = (seconds) => {
    if (typeof seconds !== 'number') return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format intervals to a readable string
  const formatIntervals = (intervals) => {
    if (!intervals || intervals.length === 0) return 'None';
    
    return intervals.map((interval, index) => (
      <div key={index} className="interval-item">
        <span className="interval-number">{index + 1}.</span>
        <span className="interval-time">
          {formatTime(interval.start)} - {formatTime(interval.end)}
        </span>
        <span className="interval-duration">
          ({formatTime(interval.end - interval.start)})
        </span>
      </div>
    ));
  };

  const onReady = (reactPlayer) => {
    console.log('Player is ready', reactPlayer);
    playerRef.current = reactPlayer;
    
    // Get the internal player instance
    const internalPlayer = reactPlayer.getInternalPlayer();
    console.log('Internal player:', internalPlayer);
    
    // Set the player reference
    setPlayerReference(internalPlayer);
  };

  const onPlay = () => {
    console.log('Video playing');
    setPlaying(true);
    handlePlay();
  };

  const onPause = () => {
    console.log('Video paused');
    setPlaying(false);
    handlePause();
  };

  const onProgress = (state) => {
    // This is called periodically with the played percentage
    console.log('Video progress:', state);
    
    // Update current time for real-time progress tracking
    if (state && typeof state.playedSeconds === 'number') {
      setCurrentTime(state.playedSeconds);
    }
  };

  const onSeek = (seconds) => {
    console.log('Seeking to', seconds);
    setCurrentTime(seconds);
    handleSeek(seconds);
  };

  const onEnded = () => {
    console.log('Video ended');
    setPlaying(false);
    handleEnded();
  };

  const onError = (error) => {
    console.error('Video player error:', error);
  };

  if (!video || !video.url) {
    return <div>Loading video...</div>;
  }

  return (
    <div className="video-container">
      <div className="video-wrapper">
        <ReactPlayer
          ref={playerRef}
          url={video.url}
          width="100%"
          height="100%"
          controls
          playing={playing}
          onReady={onReady}
          onPlay={onPlay}
          onPause={onPause}
          onProgress={onProgress}
          onSeek={onSeek}
          onEnded={onEnded}
          onError={onError}
          progressInterval={100} // Update more frequently (100ms)
          className="react-player"
          config={{
            youtube: {
              playerVars: { 
                autoplay: 0,
                origin: window.location.origin
              }
            }
          }}
        />
      </div>
      
      <ProgressBar 
        percentage={progressPercentage} 
        intervals={watchedIntervals}
        duration={video.duration}
        currentTime={currentTime}
      />
      
      <div className="video-info">
        <h2>{video.title}</h2>
        <p>{video.description}</p>
       
        <div className="debug-info">
          <h3>Watched Segments</h3>
          <div className="intervals-list">
            {formatIntervals(watchedIntervals)}
          </div>
          <p>Last Position: {formatTime(lastPosition)}</p>
          <p>Current Position: {formatTime(currentTime)}</p>
        </div>
      </div>
      
      <style jsx="true">{`
        .video-wrapper {
          position: relative;
          padding-top: 56.25%; /* 16:9 Aspect Ratio */
          background-color: #000;
          margin-bottom: 1rem;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .react-player {
          position: absolute;
          top: 0;
          left: 0;
        }
        
        .video-info {
          margin-top: 1.5rem;
        }
        
        .debug-info {
          margin-top: 2rem;
          padding: 1rem;
          background-color: #f5f5f5;
          border-radius: 8px;
        }
        
        .intervals-list {
          margin: 1rem 0;
          max-height: 200px;
          overflow-y: auto;
          padding: 0.5rem;
          background-color: #fff;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
        }
        
        .interval-item {
          padding: 0.5rem;
          border-bottom: 1px solid #eee;
          display: flex;
          align-items: center;
        }
        
        .interval-item:last-child {
          border-bottom: none;
        }
        
        .interval-number {
          font-weight: bold;
          margin-right: 0.5rem;
          min-width: 20px;
        }
        
        .interval-time {
          flex: 1;
        }
        
        .interval-duration {
          color: #666;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;

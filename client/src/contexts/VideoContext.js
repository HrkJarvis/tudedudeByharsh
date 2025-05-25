import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Set up axios auth header when token changes
  useEffect(() => {
    if (token) {
      console.log('Setting auth token in axios headers');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      console.log('Removing auth token from axios headers');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Get all videos
  const getVideos = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching all videos');
      const res = await axios.get('https://tutedude-production.up.railway.app/api/videos');
      console.log('Videos response:', res.data);
      setVideos(res.data.data);
      setError(null);
      return res.data.data;
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.response?.data?.message || 'Error fetching videos');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single video
  const getVideo = useCallback(async (id) => {
    setLoading(true);
    try {
      console.log('Fetching video with ID:', id);
      const res = await axios.get(`https://tutedude-production.up.railway.app/api/videos/${id}`);
      console.log('Video response:', res.data);
      setCurrentVideo(res.data.data);
      
      // If authenticated and progress data is returned, set it
      if (isAuthenticated && res.data.progress) {
        console.log('Setting progress from video response:', res.data.progress);
        setProgress(res.data.progress);
      } else if (isAuthenticated) {
        // If authenticated but no progress data, try to fetch it
        getVideoProgress(id);
      }
      
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Error fetching video:', err);
      setError(err.response?.data?.message || 'Error fetching video');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Get user's progress for a video
  const getVideoProgress = useCallback(async (videoId) => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping progress fetch');
      return null;
    }
    
    try {
      console.log('Fetching progress for video:', videoId);
      const res = await axios.get(`https://tutedude-production.up.railway.app/api/progress/${videoId}`);
      console.log('Progress response:', res.data);
      
      if (res.data.success && res.data.data) {
        console.log('Setting progress from progress response:', res.data.data);
        setProgress(res.data.data);
        setError(null);
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching progress:', err);
      // Don't set error state for progress fetch failures
      return null;
    }
  }, [isAuthenticated]);

  // Update progress for a video
  const updateProgress = useCallback(async (videoId, data) => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping progress update');
      return null;
    }
    
    try {
      console.log('Updating progress for video:', videoId, data);
      const res = await axios.post(`https://tutedude-production.up.railway.app/api/progress/${videoId}`, data);
      console.log('Update progress response:', res.data);
      
      if (res.data.success && res.data.data) {
        console.log('Setting progress from update response:', res.data.data);
        setProgress(res.data.data);
        setError(null);
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.error('Error updating progress:', err);
      // Don't set error state for progress update failures
      return null;
    }
  }, [isAuthenticated]);

  // Reset progress for a video
  const resetProgress = useCallback(async (videoId) => {
    if (!isAuthenticated) {
      console.log('User not authenticated, skipping progress reset');
      return null;
    }
    
    try {
      console.log('Resetting progress for video:', videoId);
      const res = await axios.delete(`https://tutedude-production.up.railway.app/api/progress/${videoId}`);
      console.log('Reset progress response:', res.data);
      
      if (res.data.success && res.data.data) {
        console.log('Setting progress from reset response:', res.data.data);
        setProgress(res.data.data);
        setError(null);
        return res.data.data;
      }
      return null;
    } catch (err) {
      console.error('Error resetting progress:', err);
      // Don't set error state for progress reset failures
      return null;
    }
  }, [isAuthenticated]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <VideoContext.Provider
      value={{
        videos,
        currentVideo,
        progress,
        loading,
        error,
        getVideos,
        getVideo,
        getVideoProgress,
        updateProgress,
        resetProgress,
        clearError
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

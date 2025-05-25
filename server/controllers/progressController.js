const { VideoProgress, Video, WatchedInterval } = require('../models');
const { mergeIntervals, calculateUniqueWatchedTime } = require('../utils/progressUtils');

// Get user's progress for all videos
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await VideoProgress.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Video,
          as: 'video',
          attributes: ['id', 'title', 'thumbnail', 'duration']
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    console.error('Error in getUserProgress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's progress for a specific video
exports.getVideoProgress = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Check if video exists
    const video = await Video.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Get or create progress record
    let progress = await VideoProgress.findOne({
      where: {
        userId: req.user.id,
        videoId
      }
    });

    if (!progress) {
      progress = await VideoProgress.create({
        userId: req.user.id,
        videoId,
        watchedIntervals: [],
        totalWatchedSeconds: 0,
        progressPercentage: 0,
        lastPosition: 0,
        completed: false
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error in getVideoProgress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update progress for a video
exports.updateProgress = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { currentTime, intervals } = req.body;

    // Check if video exists
    const video = await Video.findByPk(videoId);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Get or create progress record
    let progress = await VideoProgress.findOne({
      where: {
        userId: req.user.id,
        videoId
      }
    });

    if (!progress) {
      progress = await VideoProgress.create({
        userId: req.user.id,
        videoId,
        watchedIntervals: [],
        totalWatchedSeconds: 0,
        progressPercentage: 0,
        lastPosition: 0,
        completed: false
      });
    }

    // Update watched intervals
    let watchedIntervals = progress.watchedIntervals;
    
    // Add new intervals if provided
    if (intervals && intervals.length > 0) {
      watchedIntervals = [...watchedIntervals, ...intervals];
      
      // Merge overlapping intervals
      watchedIntervals = mergeIntervals(watchedIntervals);
      
      // Calculate total unique watched time
      const totalWatchedSeconds = calculateUniqueWatchedTime(watchedIntervals);
      
      // Calculate progress percentage
      const progressPercentage = (totalWatchedSeconds / video.duration) * 100;
      
      // Check if video is completed (e.g., 95% or more watched)
      const completed = progressPercentage >= 95;
      
      // Update progress record
      await progress.update({
        watchedIntervals,
        totalWatchedSeconds,
        progressPercentage,
        lastPosition: currentTime || progress.lastPosition,
        completed,
        lastWatched: new Date()
      });
    } else if (currentTime) {
      // Just update the last position
      await progress.update({
        lastPosition: currentTime,
        lastWatched: new Date()
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error in updateProgress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset progress for a video
exports.resetProgress = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Check if progress record exists
    const progress = await VideoProgress.findOne({
      where: {
        userId: req.user.id,
        videoId
      }
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }

    // Reset progress
    await progress.update({
      watchedIntervals: [],
      totalWatchedSeconds: 0,
      progressPercentage: 0,
      lastPosition: 0,
      completed: false,
      lastWatched: new Date()
    });

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error in resetProgress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

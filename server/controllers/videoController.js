const { Video, VideoProgress } = require('../models');

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.findAll({
      where: { isPublished: true },
      attributes: ['id', 'title', 'description', 'url', 'duration', 'thumbnail', 'createdAt']
    });

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    console.error('Error in getAllVideos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single video
exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // If user is authenticated, get their progress for this video
    let progress = null;
    if (req.user) {
      progress = await VideoProgress.findOne({
        where: {
          userId: req.user.id,
          videoId: video.id
        }
      });
    }

    res.status(200).json({
      success: true,
      data: video,
      progress: progress
    });
  } catch (error) {
    console.error('Error in getVideo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new video (admin only)
exports.createVideo = async (req, res) => {
  try {
    const { title, description, url, duration, thumbnail } = req.body;

    const video = await Video.create({
      title,
      description,
      url,
      duration,
      thumbnail
    });

    res.status(201).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Error in createVideo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update video (admin only)
exports.updateVideo = async (req, res) => {
  try {
    const { title, description, url, duration, thumbnail, isPublished } = req.body;

    let video = await Video.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video = await video.update({
      title: title || video.title,
      description: description || video.description,
      url: url || video.url,
      duration: duration || video.duration,
      thumbnail: thumbnail || video.thumbnail,
      isPublished: isPublished !== undefined ? isPublished : video.isPublished
    });

    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Error in updateVideo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete video (admin only)
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByPk(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await video.destroy();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteVideo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

'use strict';

module.exports = (sequelize, DataTypes) => {
  const VideoProgress = sequelize.define('VideoProgress', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    videoId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Videos',
        key: 'id'
      }
    },
    watchedIntervals: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [] // Array of objects with start and end times in seconds
    },
    totalWatchedSeconds: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    progressPercentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0
    },
    lastPosition: {
      type: DataTypes.INTEGER, // Last position in seconds
      allowNull: false,
      defaultValue: 0
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastWatched: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  VideoProgress.associate = function(models) {
    // associations can be defined here
    VideoProgress.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    VideoProgress.belongsTo(models.Video, {
      foreignKey: 'videoId',
      as: 'video'
    });
  };

  return VideoProgress;
};

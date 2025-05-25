'use strict';

module.exports = (sequelize, DataTypes) => {
  const WatchedInterval = sequelize.define('WatchedInterval', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    progressId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'VideoProgresses',
        key: 'id'
      }
    },
    startTime: {
      type: DataTypes.INTEGER, // Start time in seconds
      allowNull: false
    },
    endTime: {
      type: DataTypes.INTEGER, // End time in seconds
      allowNull: false
    }
  });

  WatchedInterval.associate = function(models) {
    // associations can be defined here
    WatchedInterval.belongsTo(models.VideoProgress, {
      foreignKey: 'progressId',
      as: 'progress'
    });
  };

  return WatchedInterval;
};

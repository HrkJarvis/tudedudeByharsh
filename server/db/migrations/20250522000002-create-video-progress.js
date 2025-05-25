'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('VideoProgresses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      videoId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Videos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      watchedIntervals: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: []
      },
      totalWatchedSeconds: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      progressPercentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      lastPosition: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      lastWatched: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('VideoProgresses');
  }
};

'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Videos', [
      {
        id: uuidv4(),
        title: 'Introduction to JavaScript',
        description: 'Learn the basics of JavaScript programming language.',
        url: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
        duration: 3600, // 1 hour in seconds
        thumbnail: 'https://img.youtube.com/vi/W6NZfCO5SIk/maxresdefault.jpg',
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: 'React Crash Course',
        description: 'A crash course on React.js for beginners.',
        url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
        duration: 5400, // 1.5 hours in seconds
        thumbnail: 'https://img.youtube.com/vi/w7ejDZ8SWv8/maxresdefault.jpg',
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: 'Node.js Tutorial for Beginners',
        description: 'Learn Node.js from scratch.',
        url: 'https://www.youtube.com/watch?v=TlB_eWDSMt4',
        duration: 7200, // 2 hours in seconds
        thumbnail: 'https://img.youtube.com/vi/TlB_eWDSMt4/maxresdefault.jpg',
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: 'PostgreSQL Tutorial',
        description: 'A comprehensive guide to PostgreSQL database.',
        url: 'https://www.youtube.com/watch?v=qw--VYLpxG4',
        duration: 4500, // 1.25 hours in seconds
        thumbnail: 'https://img.youtube.com/vi/qw--VYLpxG4/maxresdefault.jpg',
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        title: 'CSS Flexbox Tutorial',
        description: 'Learn CSS Flexbox layout from scratch.',
        url: 'https://www.youtube.com/watch?v=JJSoEo8JSnc',
        duration: 2700, // 45 minutes in seconds
        thumbnail: 'https://img.youtube.com/vi/JJSoEo8JSnc/maxresdefault.jpg',
        isPublished: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Videos', null, {});
  }
};

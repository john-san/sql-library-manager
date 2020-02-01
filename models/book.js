'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Sequelize.Model {}
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for title'
        }, 
        notEmpty: {
          msg: 'Title is required'
        }
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for author'
        }, 
        notEmpty: {
          msg: 'Author is required'
        }
      }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, { sequelize });

  return Book;
};
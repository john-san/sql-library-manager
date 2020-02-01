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
    genre: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for genre'
        }, 
        notEmpty: {
          msg: 'Genre is required'
        }
      }
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a value for year'
        }, 
        notEmpty: {
          msg: 'Year is required'
        },
        isInt: {
          msg: 'Please enter the year in numeric characters'
        },
        min: {
          args: 1,
          msg: 'Please enter a year above 0'
        },
        max: {
         args: new Date().getFullYear(),
         msg: `Please enter a year that does not pass ${new Date().getFullYear()}`
        }
      }
    },
  }, { sequelize });

  return Book;
};
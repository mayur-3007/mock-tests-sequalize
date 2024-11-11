const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.ENUM('MCQ', 'fill-in-the-blank', 'match'),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  options: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  answer: {
    type: DataTypes.JSON,
    allowNull: false,
  },
})

module.exports = Question

const { DataTypes } = require('sequelize')
const sequelize = require('../config/database')

const TestQuestion = sequelize.define('TestQuestion', {
  test_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Tests', // This references the 'Test' model
      key: 'id',
    },
    allowNull: false,
  },
  question_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Questions', // This references the 'Question' model
      key: 'id',
    },
    allowNull: false,
  },
})

module.exports = TestQuestion

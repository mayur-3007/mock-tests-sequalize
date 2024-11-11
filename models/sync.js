const sequelize = require('../config/database')
const { User, Test, Question, Result, TestQuestion } = require('./index')

// Sync all models with the database
sequelize
  .sync({ force: true }) // Use { force: true } to drop and re-create tables during development.
  .then(() => {
    console.log('All models were synchronized successfully.')
  })
  .catch((error) => {
    console.error('Error syncing models:', error)
  })

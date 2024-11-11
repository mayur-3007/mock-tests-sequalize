const User = require('./user')
const Test = require('./test')
const Question = require('./question')
const Result = require('./result')
const TestQuestion = require('./testQuestion')

// User-Result relationship
User.hasMany(Result, { foreignKey: 'user_id' })
Result.belongsTo(User, { foreignKey: 'user_id' })

// Test-Result relationship
Test.hasMany(Result, { foreignKey: 'test_id' })
Result.belongsTo(Test, { foreignKey: 'test_id' })

// Test-Question Many-to-Many relationship via TestQuestion
Test.belongsToMany(Question, { through: TestQuestion, foreignKey: 'test_id' })
Question.belongsToMany(Test, {
  through: TestQuestion,
  foreignKey: 'question_id',
})

module.exports = { User, Test, Question, Result, TestQuestion }

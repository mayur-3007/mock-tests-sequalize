const express = require('express')
const bodyParser = require('body-parser')
const { authenticateToken } = require('./middleware/auth')
const questionRoutes = require('./routes/questionRoutes')
const testRoutes = require('./routes/testRoutes')
const resultRoutes = require('./routes/resultRoutes')
const userRoutes = require('./routes/userRoutes')

const app = express()
app.use(bodyParser.json())
app.use('/questions', authenticateToken, questionRoutes)
app.use('/tests', authenticateToken, testRoutes)
app.use('/results', authenticateToken, resultRoutes)
app.use('/users', userRoutes)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})

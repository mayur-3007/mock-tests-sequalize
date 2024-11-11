const express = require('express')
const router = express.Router()
const questionController = require('../controllers/questionController')

// CRUD operations for questions
router.post('/create', questionController.createQuestion)
router.post('/create-multiple', questionController.createMultipleQuestions)
router.get('/:id', questionController.getQuestionById)
router.get('/', questionController.getAllQuestions)

module.exports = router

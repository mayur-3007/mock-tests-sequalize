const express = require('express')
const router = express.Router()
const resultController = require('../controllers/resultController')

router.post('/submit', resultController.submitResult)
router.get('/user/:userId/test/:testId', resultController.getUserResults)

module.exports = router

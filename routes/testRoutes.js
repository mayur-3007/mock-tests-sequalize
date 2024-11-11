const express = require('express')
const router = express.Router()
const testController = require('../controllers/testController')

router.post('/create', testController.createTest)
router.get('/:id', testController.getTestById)
router.get('/', testController.getAllTests)

module.exports = router

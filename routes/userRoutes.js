const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.post('/login', userController.login)
router.post('/create', userController.createUser)
router.get('/:id', userController.getUserById)
router.get('/', userController.getAllUsers)

module.exports = router

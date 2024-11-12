const { User } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const SECRET_KEY = require('../config/config').development.secret

exports.login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(404).json({ error: 'User not found' })

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid)
      return res.status(401).json({ error: 'Invalid password' })

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' })
    res.json({ token, message: 'Login successful' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Login failed' })
  }
}

exports.createUser = async (req, res) => {
  const { name, email, password } = req.body
  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ err: 'Email already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashedPassword })
    res.status(201).json({
      response: 'Please login with credentials',
      id: user.id,
      name,
      email,
    })

    // Create new user
    // const user = await User.create({ name, email })
    // res.status(201).json({ id: user.id, name: user.name, email: user.email })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create user' })
  }
}

// Get a user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to retrieve user' })
  }
}

// Get all users
exports.getAllUsers = async (req, res) => {
  const { page, limit } = req.query
  try {
    const offset = (page - 1) * limit
    const users = await User.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
    })
    res.status(200).json({
      totalUsers: users.count,
      totalPages: Math.ceil(users.count / limit),
      currentPage: parseInt(page),
      users: users.rows,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to retrieve users' })
  }
}

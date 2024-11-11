const { User } = require('../models')

// Create a new user
exports.createUser = async (req, res) => {
  const { name, email } = req.body
  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ err: 'Email already exists' })
    }

    // Create new user
    const user = await User.create({ name, email })
    res.status(201).json({ id: user.id, name: user.name, email: user.email })
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

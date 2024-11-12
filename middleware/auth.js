const jwt = require('jsonwebtoken')
const SECRET_KEY = require('../config/config').development.secret

exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token)
    return res.status(401).json({ error: 'Access denied, token missing' })

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' })
    req.user = decoded // Store decoded user information
    next()
  })
}

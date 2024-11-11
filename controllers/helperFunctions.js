const redisClient = require('../config/redis')
const deleteByPattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(pattern)
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redisClient.del(key)))
    }
  } catch (error) {
    console.error('Redis error while deleting by pattern:', error)
  }
}

module.exports = {
  deleteByPattern,
}

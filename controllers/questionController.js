const { Question } = require('../models')
const redisClient = require('../config/redis')
const deleteByPattern = require('./helperFunctions').deleteByPattern

// Create a single question
exports.createQuestion = async (req, res) => {
  const { type, content, options, answer } = req.body
  try {
    const question = await Question.create({
      type,
      content,
      options: JSON.stringify(options),
      answer: JSON.stringify(answer),
    })
    await deleteByPattern('questions_page_*')
    res.status(201).json({ id: question.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create question' })
  }
}

// Create multiple questions
exports.createMultipleQuestions = async (req, res) => {
  const questions = req.body
  try {
    const createdQuestions = await Promise.all(
      questions.map(async (question) => {
        const { type, content, options, answer } = question
        const createdQuestion = await Question.create({
          type,
          content,
          options: JSON.stringify(options),
          answer: JSON.stringify(answer),
        })
        return { id: createdQuestion.id, ...question }
      })
    )
    await deleteByPattern('questions_page_*')
    res.status(201).json(createdQuestions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create multiple questions' })
  }
}

// Get a question by ID
exports.getQuestionById = async (req, res) => {
  const { id } = req.params
  try {
    const question = await Question.findByPk(id)
    if (!question) {
      return res.status(404).json({ error: 'Question not found' })
    }
    res.json(question)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to retrieve question' })
  }
}

exports.getAllQuestions = async (req, res) => {
  const { page, limit } = req.query
  const cacheKey = `questions_page_${page}_limit_${limit}`

  try {
    const cachedData = await redisClient.get(cacheKey)

    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData))
    }

    const offset = (page - 1) * limit
    const questions = await Question.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
    })

    const responseData = {
      totalQuestions: questions.count,
      totalPages: Math.ceil(questions.count / limit),
      currentPage: parseInt(page),
      questions: questions.rows,
    }

    // Cache the data
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData)) // Cache for 1 hour

    res.status(200).json(responseData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to retrieve questions' })
  }
}

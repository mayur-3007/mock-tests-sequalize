const { Test, Question, TestQuestion } = require('../models')
const redisClient = require('../config/redis')
const deleteByPattern = require('./helperFunctions').deleteByPattern

exports.createTest = async (req, res) => {
  const { name, questionIds } = req.body

  try {
    const test = await Test.create({ name })

    const associations = questionIds.map((questionId) => ({
      test_id: test.id,
      question_id: questionId,
    }))

    await TestQuestion.bulkCreate(associations)

    await deleteByPattern('tests_page_*') //delete redis cache if exists

    res.status(201).json({
      testId: test.id,
      name: test.name,
      questionIds: questionIds,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to create test' })
  }
}

exports.getTestById = async (req, res) => {
  const { id } = req.params

  try {
    const test = await Test.findOne({
      where: { id },
      include: [
        {
          model: Question,
          through: { attributes: [] },
        },
      ],
    })

    if (!test) {
      return res.status(404).json({ error: 'Test not found' })
    }

    res.status(200).json(test)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to retrieve test' })
  }
}

exports.getAllTests = async (req, res) => {
  const { page, limit } = req.query
  const cacheKey = `tests_page_${page}_limit_${limit}`
  try {
    const cachedData = await redisClient.get(cacheKey)
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData))
    }

    const offset = (page - 1) * limit
    const testCount = await Test.findAll()
    const tests = await Test.findAndCountAll({
      offset: parseInt(offset),
      limit: parseInt(limit),
      include: [
        {
          model: Question,
          through: { attributes: [] },
        },
      ],
    })

    const responseData = {
      totalTests: testCount.length,
      totalPages: Math.ceil(testCount.length / limit),
      currentPage: parseInt(page),
      tests: tests.rows,
    }

    // Cache the data
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(responseData)) // Cache for 1 hour

    res.status(200).json(responseData)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to retrieve tests' })
  }
}

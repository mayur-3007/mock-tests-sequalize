const { Result, Test, Question, TestQuestion } = require('../models')

exports.submitResult = async (req, res) => {
  const { userId, testId, answers } = req.body

  try {
    const existingResult = await Result.findOne({
      where: { user_id: userId, test_id: testId },
    })

    if (existingResult) {
      return res.status(400).json({ error: 'Test has already been submitted' })
    }

    const test = await Test.findOne({
      where: { id: testId },
      include: {
        model: Question,
        through: { attributes: [] },
      },
    })

    if (!test) {
      return res.status(404).json({ error: 'Test not found' })
    }

    const questions = test.Questions

    let score = 0
    const details = questions.map((question) => {
      const userAnswer = answers[question.id]
      let isCorrect = false

      if (question.type === 'match') {
        isCorrect =
          JSON.stringify(JSON.parse(question.answer)) ===
          JSON.stringify(JSON.parse(userAnswer))
      } else {
        isCorrect =
          userAnswer.toLowerCase() === JSON.parse(question.answer).toLowerCase()
      }

      if (isCorrect) {
        score += 1
      }

      return {
        questionId: question.id,
        isCorrect,
      }
    })

    // Store the result in the database
    const result = await Result.create({
      user_id: userId,
      test_id: testId,
      answers: JSON.stringify(answers),
      score,
      details: JSON.stringify(details),
    })

    res.status(201).json({
      id: result.id,
      score,
      details,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to submit result' })
  }
}

// Get user results for a specific test
exports.getUserResults = async (req, res) => {
  const { userId, testId } = req.params

  try {
    const result = await Result.findOne({
      where: { user_id: userId, test_id: testId },
      include: {
        model: Test,
        include: {
          model: Question,
          through: { attributes: [] },
        },
      },
    })

    if (!result) {
      return res.status(404).json({ error: 'No results found' })
    }

    // Format the result details with questions and answers
    const formattedQuestions = JSON.parse(result.details).map((detail) => {
      const question = result.Test.Questions.find(
        (q) => q.id === detail.questionId
      )

      const userAnswer = JSON.parse(result.answers)[question.id]

      return {
        questionContent: question.content,
        options: JSON.parse(question.options),
        userAnswer,
        correctAnswer: JSON.parse(question.answer),
        isCorrect: detail.isCorrect,
      }
    })

    res.status(200).json({
      totalScore: result.score,
      totalQuestions: formattedQuestions.length,
      questions: formattedQuestions,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to retrieve user results' })
  }
}

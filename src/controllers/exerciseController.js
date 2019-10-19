// const createError = require('http-errors');
const expressify = require('expressify')();
const exerciseService = require('../services/exerciseService');
// const logger = require('../utils/logger.js');

/**
 * Create exercise.
 *
 */
const create = async (req, res) => {
  const { userProfile } = req.context;
  const {
    exercise,
    name,
    description,
    type,
    difficulty
  } = req.body;

  const createdExercise = await exerciseService.create({
    context: req.context,
    exercise,
    name,
    description,
    type,
    difficulty
  });
  return res.status(201).json(createdExercise);
};

module.exports = expressify({
  create
});

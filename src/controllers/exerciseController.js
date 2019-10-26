const _ = require('lodash');
const createError = require('http-errors');
const expressify = require('expressify')();
const exerciseService = require('../services/exerciseService');
// const logger = require('../utils/logger.js');

const allowedExerciseTypes = ['derivative', 'integral'];

const extractMetadata = (body) => (
  _.pick(body, ['exercise', 'name', 'description', 'type', 'difficulty'])
);

const validateMetadata = (metadata) => {
  if (metadata.type && !allowedExerciseTypes.includes(metadata.type)) {
    throw createError.BadRequest('Invalid exercise type');
  }
};

/**
 * Create exercise.
 *
 */
const create = async (req, res) => {
  // const { user } = req.context;
  const {
    courseId,
    guideId
  } = req.params;

  const exerciseMetadata = extractMetadata(req.body);
  validateMetadata(exerciseMetadata);

  if (!exerciseMetadata.exercise
    || !exerciseMetadata.name
    || !exerciseMetadata.type
    || !exerciseMetadata.difficulty
  ) {
    return Promise.reject(createError.BadRequest('exercise, name, type or difficulty have not been provided'));
  }

  const createdExercise = await exerciseService.create({
    context: req.context,
    guideId,
    courseId,
    exerciseMetadata
  });
  return res.status(201).json(createdExercise);
};

/**
 * List exercises.
 *
 */
const list = async (req, res) => {
  // const { user } = req.context;
  const {
    courseId,
    guideId
  } = req.params;

  const exercises = await exerciseService.list({
    context: req.context,
    guideId,
    courseId
  });
  return res.status(200).json(exercises);
};

/**
 * Update exercise.
 *
 */
const update = async (req, res) => {
  const {
    courseId,
    guideId,
    exerciseId
  } = req.params;

  const exerciseMetadata = extractMetadata(req.body);
  validateMetadata(exerciseMetadata);

  if (Object.keys(exerciseMetadata).length === 0) {
    return Promise.reject(createError.BadRequest('No params have been provided'));
  }

  const updatedExercise = await exerciseService.create({
    context: req.context,
    guideId,
    courseId,
    exerciseId,
    exerciseMetadata
  });
  return res.status(201).json(updatedExercise);
};

module.exports = expressify({
  create,
  list,
  update
});

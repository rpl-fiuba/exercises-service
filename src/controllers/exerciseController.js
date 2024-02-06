const _ = require('lodash');
const createError = require('http-errors');
const expressify = require('expressify')();
const exerciseService = require('../services/exerciseService');

const allowedExerciseTypes = ['derivative', 'integral', 'factorisable', 'domain_and_image'];

const extractMetadata = (body) => (
  _.pick(body, ['problemInput', 'name', 'description', 'type', 'difficulty', 'initialHint'])
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
  const {
    courseId,
    guideId
  } = req.params;

  const exerciseMetadata = extractMetadata(req.body);
  validateMetadata(exerciseMetadata);

  if (!exerciseMetadata.problemInput
    || !exerciseMetadata.name
    || !exerciseMetadata.type
    || !exerciseMetadata.difficulty
  ) {
    return Promise.reject(createError.BadRequest('problemInput, name, type or difficulty have not been provided'));
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
 * Copy course exercises
 *
 */
const copyCourseExercises = async (req, res) => {
  const sourceCourseId = req.params.courseId;
  const { targetCourseId } = req.body;

  await exerciseService.copyCourseExercises({
    context: req.context,
    targetCourseId,
    sourceCourseId
  });

  return res.status(204).json({});
};

/**
 * Get exercise status.
 *
 */
const getExerciseStatus = async (req, res) => {
  const { courseId, guideId, exerciseId } = req.params;

  const exerciseStatus = await exerciseService.getExerciseStatus({
    context: req.context,
    guideId,
    courseId,
    exerciseId
  });

  return res.status(200).json(exerciseStatus);
};

/**
 * List exercises.
 *
 */
const list = async (req, res) => {
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

  const updatedExercise = await exerciseService.update({
    context: req.context,
    guideId,
    courseId,
    exerciseId,
    exerciseMetadata
  });

  return res.status(201).json(updatedExercise);
};

/**
 * Remove exercise.
 *
 */
const remove = async (req, res) => {
  const {
    courseId,
    guideId,
    exerciseId
  } = req.params;

  await exerciseService.remove({
    context: req.context,
    guideId,
    courseId,
    exerciseId
  });

  return res.status(204).json({});
};

module.exports = expressify({
  create,
  copyCourseExercises,
  getExerciseStatus,
  list,
  remove,
  update
});

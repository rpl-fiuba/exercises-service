const createError = require('http-errors');
const expressify = require('expressify')();
const exerciseService = require('../services/exerciseService');
const resolutionService = require('../services/resolutionService');
const { extractMetadata, validateMetadata } = require('./exerciseController');
const { validateBody } = require('./resolutionController');
const mathResolverClient = require('../clients/mathResolverClient');

const createPlaygroundExercise = async (req, res) => {
  const exerciseMetadata = extractMetadata(req.body);
  validateMetadata(exerciseMetadata);
  if (!exerciseMetadata.problemInput || !exerciseMetadata.type) {
    return Promise.reject(createError.BadRequest('problemInput or type have not been provided'));
  }
  const createdExercise = await exerciseService.createPlaygroundExercise({
    context: req.context,
    userId: req.context.user.userId,
    exerciseMetadata
  });
  return res.status(201).json(createdExercise);
};

const generateProblemInput = async (req, res) => {
  const exerciseMetadata = extractMetadata(req.body);
  validateMetadata(exerciseMetadata);
  const problem = await mathResolverClient.generateProblem({
    context: req.context,
    type: exerciseMetadata.type
  });
  return res.status(201).json(problem);
};

const getPlaygroundExercise = async (req, res) => {
  const { exerciseId } = req.params;
  const { userId } = req.context.user;

  const exercise = await exerciseService.getPlaygroundExerciseForStudent({
    exerciseId,
    userId
  });


  return res.status(201).json(exercise);
};

const getPlaygroundExercises = async (req, res) => {
  const { userId } = req.context.user;
  const exercise = await exerciseService.getPlaygroundExercises({ userId });
  return res.status(201).json(exercise);
};


const resolvePlaygroundExercise = async (req, res) => {
  const { exerciseId } = req.params;

  validateBody(req.body);
  const { currentExpression } = req.body;

  const exerciseStatus = await resolutionService.resolvePlayground({
    context: req.context,
    exerciseId,
    currentExpression
  });

  return res.status(200).json(exerciseStatus);
};

const removePlaygroundExercise = async (req, res) => {
  const { exerciseId } = req.params;
  const { userId } = req.context.user;
  await exerciseService.removePlaygroundExercise({ exerciseId, userId });
  return res.status(204).json({});
};


const removePlaygroundStep = async (req, res) => {
  const { exerciseId } = req.params;
  await resolutionService.removePlaygroundStep({ context: req.context, exerciseId });
  return res.status(204).json({});
};

module.exports = expressify({
  createPlaygroundExercise,
  getPlaygroundExercise,
  resolvePlaygroundExercise,
  removePlaygroundStep,
  getPlaygroundExercises,
  removePlaygroundExercise,
  generateProblemInput
});

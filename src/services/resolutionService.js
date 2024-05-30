const createError = require('http-errors');
const mathResolverClient = require('../clients/mathResolverClient');
const usersService = require('../services/usersService');
const exercisesDb = require('../databases/exercisesDb');
const statisticsService = require('../services/statisticsService');

function validateExerciseHasNotBeenDelivered(currentExercise) {
  if (currentExercise.state === 'delivered') {
    throw createError.Conflict('Exercise has been already delivered');
  }
}

function buildUpdatedExerciseMetadata(resolveResult, stepList, currentExpression) {
  if (resolveResult.exerciseStatus === 'invalid') {
    return { state: 'incompleted' };

  } if (resolveResult.exerciseStatus === 'valid') {
    const newStepList = JSON.stringify([...stepList, currentExpression]);
    return { stepList: newStepList, state: 'incompleted' };

  } if (resolveResult.exerciseStatus === 'resolved') {
    const newStepList = JSON.stringify([...stepList, currentExpression]);
    return { stepList: newStepList, state: 'resolved' };
  }
  return {};
}

/**
 * Resolve exercise.
 *
 */
const resolve = async ({
  context,
  guideId,
  courseId,
  exerciseId,
  currentExpression
}) => {
  const { user: { userId } } = context;
  const currentExercise = await usersService.getExercise({
    context, guideId, courseId, exerciseId, userId
  });
  const baseExercise = await exercisesDb.getExercise({
    context, guideId, courseId, exerciseId
  });

  validateExerciseHasNotBeenDelivered(currentExercise);

  const { problemInput, type, stepList } = currentExercise;
  const { mathTree } = baseExercise;
  const parsedMathTree = JSON.parse(mathTree);

  const resolveResult = await mathResolverClient.resolve({
    context, type, problemInput, stepList, mathTree: parsedMathTree, currentExpression
  });

  // (only if it does not exist) to indicate an exercise has started to be resolved
  await statisticsService.addErrorCountEntry({ context, guideId, courseId, exerciseId, userId });
  if (resolveResult.exerciseStatus === 'invalid') {
    await statisticsService.addInvalidStep({ context, guideId, courseId, exerciseId, userId });
  }
  const exerciseMetadata = buildUpdatedExerciseMetadata(resolveResult, stepList, currentExpression);

  await usersService.updateExercise({
    context, userId, guideId, courseId, exerciseId, exerciseMetadata
  });

  return resolveResult;
};


const resolvePlayground = async ({
  context,
  exerciseId,
  currentExpression
}) => {
  const { user: { userId } } = context;
  const currentExercise = await exercisesDb.getPlaygroundExercise({ exerciseId, userId });

  validateExerciseHasNotBeenDelivered(currentExercise);

  const { problemInput, type, stepList, mathTree } = currentExercise;
  const parsedMathTree = JSON.parse(mathTree);

  const resolveResult = await mathResolverClient.resolve({
    context, type, problemInput, stepList, mathTree: parsedMathTree, currentExpression
  });
  const exerciseMetadata = buildUpdatedExerciseMetadata(resolveResult, stepList, currentExpression);

  await exercisesDb.updatePlaygroundExercise({ userId, exerciseId, exerciseMetadata });

  return resolveResult;
};

/**
 * Removing one step from exercise
 *
 */
const removePlaygroundStep = async ({
  context,
  exerciseId
}) => {
  const { user: { userId } } = context;
  const currentExercise = await exercisesDb.getPlaygroundExercise({ exerciseId, userId });
  validateExerciseHasNotBeenDelivered(currentExercise);

  const { stepList } = currentExercise;

  if (stepList.length > 0) {
    const newStepList = JSON.stringify(stepList.slice(0, -1));
    const exerciseMetadata = { stepList: newStepList, state: 'incompleted' };
    await exercisesDb.updatePlaygroundExercise({ userId, exerciseId, exerciseMetadata });
  }
};

/**
 * Removing one step from exercise
 *
 */
const removeStep = async ({
  context,
  guideId,
  courseId,
  exerciseId
}) => {
  const { user: { userId } } = context;
  const currentExercise = await usersService.getExercise({
    context, guideId, courseId, exerciseId, userId
  });
  validateExerciseHasNotBeenDelivered(currentExercise);

  const { stepList } = currentExercise;

  if (stepList.length > 0) {
    const newStepList = JSON.stringify(stepList.slice(0, -1));
    const exerciseMetadata = { stepList: newStepList, state: 'incompleted' };

    await usersService.updateExercise({
      context, userId, guideId, courseId, exerciseId, exerciseMetadata
    });
  }
};

/**
 * Ask help for an exercise.
 *
 */
const askHelp = async ({
  context,
  guideId,
  courseId,
  exerciseId
}) => {
  const { user: { userId } } = context;
  const currentExercise = await usersService.getExercise({
    context, guideId, courseId, exerciseId, userId
  });
  const { type } = currentExercise;
  const { stepList, problemInput } = currentExercise;

  return mathResolverClient.askHelp({ context, type, problemInput, stepList });
};

/**
 * Delivering exercise
 *
 */
const deliver = async ({
  context,
  guideId,
  courseId,
  exerciseId
}) => {
  const { user: { userId } } = context;
  const currentExercise = await usersService.getExercise({
    context, guideId, courseId, exerciseId, userId
  });

  if (currentExercise.state === 'delivered') {
    return;
  }

  if (currentExercise.state !== 'resolved') {
    throw createError.Conflict('Exercise has not been resolved yet');
  }

  const exerciseMetadata = { state: 'delivered' };
  await usersService.updateExercise({
    context, userId, guideId, courseId, exerciseId, exerciseMetadata
  });

  await statisticsService.updateTotalStepsCount({
    context, guideId, courseId, exerciseId, userId, stepsCount: currentExercise.stepList.length
  });
};

/**
 * Evaluate exercise
 *
 */
const evaluate = async ({ context, problemInput, type }) => (
  mathResolverClient.evaluate({ context, problemInput, type })
);

module.exports = {
  askHelp,
  deliver,
  evaluate,
  removeStep,
  resolve,
  resolvePlayground,
  removePlaygroundStep
};

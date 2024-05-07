const expressify = require('expressify')();
const statisticsService = require('../services/statisticsService');

/**
 * Get exercise error count statistics.
 *
 */
const getErrorCountStatistics = async (req, res) => {
  const { courseId } = req.params;

  const errorCountStatistics = await statisticsService.getErrorCountStatistics({
    context: req.context, courseId
  });

  return res.status(200).json(errorCountStatistics);
};

const getResolvedExercisesStatistics = async (req, res) => {
  const { courseId, guideId } = req.params;

  const deliveryStatistics = await statisticsService.getResolvedStatistics({
    context: req.context, courseId, guideId
  });

  return res.status(200).json(deliveryStatistics);
};

const getInitiatedExercisesStatistics = async (req, res) => {
  const { courseId, guideId } = req.params;

  const deliveryStatistics = await statisticsService.getInitiatedStatistics({
    context: req.context, courseId, guideId
  });

  return res.status(200).json(deliveryStatistics);
};


const getFailedExercisesStatistics = async (req, res) => {
  const { courseId, guideId } = req.params;

  const deliveryStatistics = await statisticsService.getFailedStartStatistics({
    context: req.context, courseId, guideId
  });

  return res.status(200).json(deliveryStatistics);
};


/**
 * Get exercise step count statistics.
 *
 */
const getStepCountStatistics = async (req, res) => {
  const { courseId } = req.params;

  const stepsCountStatistics = await statisticsService.getStepCountStatistics({
    context: req.context, courseId
  });

  return res.status(200).json(stepsCountStatistics);
};

/**
 * Get users qualification statistics.
 *
 */
const getQualificationsStatistics = async (req, res) => {
  const { courseId } = req.params;

  const qualificationsStatistics = await statisticsService.getQualificationsStatistics({
    context: req.context, courseId
  });

  return res.status(200).json(qualificationsStatistics);
};

module.exports = expressify({
  getQualificationsStatistics,
  getErrorCountStatistics,
  getStepCountStatistics,
  getResolvedExercisesStatistics,
  getInitiatedExercisesStatistics,
  getFailedExercisesStatistics
});

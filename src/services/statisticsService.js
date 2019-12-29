const statisticsDb = require('../databases/statisticsDb');

/**
 * Add invalid step statistic.
 *
 */
const addInvalidStep = async ({ userId, exerciseId }) => {
  const errorCount = await statisticsDb.getExerciseErrorCount({ userId, exerciseId });

  if (!errorCount.sum) {
    await statisticsDb.createErrorCountEntry({ userId, exerciseId });
  }
  const currentCount = parseInt(errorCount.sum || 0, 10);
  await statisticsDb.increaseErrorCount({ userId, exerciseId, count: currentCount + 1 });
};

module.exports = {
  addInvalidStep
};
const statisticsDb = require('../databases/statisticsDb');
const usersDb = require('../databases/userExercisesDb');

/**
 * Add invalid step statistic.
 *
 */
const addInvalidStep = async ({ userId, guideId, courseId, exerciseId }) => {
  const errorCount = await statisticsDb.getExerciseErrorCount({
    userId, guideId, courseId, exerciseId
  });

  if (errorCount.count === null) {
    await statisticsDb.createExerciseCountEntry({ userId, guideId, courseId, exerciseId });
  }

  await statisticsDb.increaseErrorCount({
    userId, guideId, courseId, exerciseId, count: errorCount.count + 1
  });
};

/**
 * Add error count entry (only if does not exist)
 *
 */
const addErrorCountEntry = async ({ userId, guideId, courseId, exerciseId }) => {
  const errorCount = await statisticsDb.getExerciseErrorCount({
    userId, guideId, courseId, exerciseId
  });

  if (errorCount.count === null) {
    await statisticsDb.createExerciseCountEntry({ userId, guideId, courseId, exerciseId });
  }
};

/**
 * Update step count
 *
 */
const updateTotalStepsCount = async ({ userId, guideId, courseId, exerciseId, stepsCount }) => {
  const statisticCount = await statisticsDb.getExerciseStepCountEntry({
    userId, guideId, courseId, exerciseId
  });

  if (!statisticCount) {
    await statisticsDb.createTotalStepsCountEntry({
      userId, guideId, courseId, exerciseId, stepsCount
    });
  }
};

/**
 * Get course error count statistics.
 *
 */
const getErrorCountStatistics = async ({ context, courseId }) => {
  const exercisesErrorCount = await statisticsDb.getExercisesErrorCount({ context, courseId });

  return formatStatistics(exercisesErrorCount);
};


const getResolvedStatistics = async ({ context, courseId, guideId }) => {
  const resolveCount = await statisticsDb.getResolvedStatistics({ context, courseId, guideId });
  return getStatisticsGroupedByExercise({ guideId, userExercisesEntries: resolveCount });
};

const getFailedStartStatistics = async ({ context, courseId, guideId }) => {
  const failedCount = await statisticsDb.getFailedStartStatistics({ context, courseId, guideId });
  return getStatisticsGroupedByExercise({ guideId, userExercisesEntries: failedCount });
};


const getInitiatedStatistics = async ({ context, courseId, guideId }) => {
  const deliveryCount = await statisticsDb.getInProgressStatistics({ context, courseId, guideId });
  return getStatisticsGroupedByExercise({ guideId, userExercisesEntries: deliveryCount });
};



/**
 * Get course step count statistics.
 *
 */
const getStepCountStatistics = async ({ context, courseId }) => {
  const exercisesStepCount = await statisticsDb.getExercisesTotalStepCount({ context, courseId });

  return formatStatistics(exercisesStepCount);
};

const getStatisticsGroupedByExercise = ({ guideId, userExercisesEntries }) => {

  const byExercise = groupByProperty(userExercisesEntries, 'exerciseId');
  const exerciseStatistics = Object.keys(byExercise.objs).map((exerciseId) => {
    const userExercises = byExercise.objs[exerciseId];
    const { name } = userExercises[0];
    const userCount = userExercises.length;
    const users = userExercises.reduce((usersList, { userId }) => [...usersList, userId], []);
    return { exerciseId, name, userCount, users };
  });

  return { guideId, exercises: exerciseStatistics };
};


const formatStatistics = (allStatisticsCount) => {
  const byGuide = groupByProperty(allStatisticsCount, 'guideId');

  return byGuide.list.map((guideId) => {
    const byExercise = groupByProperty(byGuide.objs[guideId], 'exerciseId');

    const exercises = byExercise.list.map((exerciseId) => {
      const exercisesGroupedByUsers = byExercise.objs[exerciseId];
      const users = exercisesGroupedByUsers.map(({ userId, count }) => ({ userId, count }));
      const totalCount = exercisesGroupedByUsers.reduce((acum, { count }) => acum + count, 0);

      return { exerciseId, name: exercisesGroupedByUsers[0].name, users, count: totalCount };
    });

    return { guideId, exercises };
  });
};

const groupByProperty = (statisticsObjs, groupTag) => {
  const groupList = [];
  const groupObjects = {};

  statisticsObjs.forEach((statistic) => {
    const group = statistic[groupTag];

    if (!groupList.includes(group)) {
      groupList.push(group);
    }
    if (!groupObjects[group]) {
      groupObjects[group] = [];
    }
    groupObjects[group].push(statistic);
  });

  return {
    list: groupList,
    objs: groupObjects
  };
};

/**
 * Get users qualification statistics.
 *
 */
const getQualificationsStatistics = async ({ context, courseId }) => {
  const { course: { users = [] } } = context;
  const usersQualifications = await usersDb.getUsersQualifications({ context, courseId });

  const completeQualifications = usersQualifications.map((userQual) => {
    const matchedUser = users.find((user) => userQual.userId === user.userId);

    return { ...userQual, ...matchedUser };
  });

  return completeQualifications;
};


module.exports = {
  addErrorCountEntry,
  addInvalidStep,
  getQualificationsStatistics,
  getErrorCountStatistics,
  getStepCountStatistics,
  updateTotalStepsCount,
  getResolvedStatistics,
  getInitiatedStatistics,
  getFailedStartStatistics
};

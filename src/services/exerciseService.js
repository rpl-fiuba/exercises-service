const exercisesDB = require('../databases/exercisesDb');

/**
 * Create exercise.
 *
 */
const create = async ({
  context,
  exercise,
  name,
  description,
  type,
  difficulty
}) => (
  exercisesDB.createExercise({
    context,
    exercise,
    name,
    description,
    type,
    difficulty
  })
);

module.exports = {
  create
};

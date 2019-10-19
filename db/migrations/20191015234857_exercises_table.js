exports.up = (knex) => {
  const query = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    create TYPE step_type as enum('derivative', 'integral');
    create TYPE difficulty as enum('easy', 'normal', 'hard');
    create TYPE exercise_state as enum('completed', 'incompleted', 'failed');

    CREATE TABLE step_exercises(
      exercise_id CHARACTER VARYING(64) PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
      guide_id    CHARACTER VARYING(128) NOT NULL,
      course_id   CHARACTER VARYING(128) NOT NULL,

      exercise    TEXT NOT NULL,
      name        CHARACTER VARYING(64) NOT NULL,
      description CHARACTER VARYING(64),
      type        step_type NOT NULL,
      difficulty  difficulty NOT NULL
    );

    CREATE TABLE student_exercise(
      exercise_id  CHARACTER VARYING(64) PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
      user_id      CHARACTER VARYING(64) PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,

      state        exercise_state NOT NULL DEFAULT 'incompleted',
      calification INT
    );
  `;

  return knex.raw(query);
};

exports.down = (knex) => {
  const query = `
    DROP TABLE step_exercises;
    DROP TABLE student_exercise;
    DROP TYPE step_type;
    DROP TYPE difficulty;
    DROP TYPE exercise_state;
  `;

  return knex.raw(query);
};

exports.up = (knex) => {
  const query = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    create TYPE type as enum('derivative', 'integral');
    create TYPE difficulty as enum('easy', 'normal', 'hard');
    create TYPE exercise_state as enum('completed', 'incompleted', 'failed');

    CREATE TABLE exercises(
      exercise_id CHARACTER VARYING(64) PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
      guide_id    CHARACTER VARYING(128) NOT NULL,
      course_id   CHARACTER VARYING(128) NOT NULL,
      created_at  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

      exercise    TEXT NOT NULL,
      name        CHARACTER VARYING(64) NOT NULL,
      description CHARACTER VARYING(64),
      type        type NOT NULL,
      difficulty  difficulty NOT NULL
    );

    CREATE TABLE student_exercises(
      user_id      CHARACTER VARYING(64) NOT NULL,
      exercise_id  CHARACTER VARYING(64) NOT NULL,
      created_at   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

      state        exercise_state NOT NULL DEFAULT 'incompleted',
      calification INT DEFAULT NULL,
      PRIMARY KEY (user_id, exercise_id)
    );
  `;

  return knex.raw(query);
};

exports.down = (knex) => {
  const query = `
    DROP TABLE exercises;
    DROP TABLE student_exercises;
    DROP TYPE type;
    DROP TYPE difficulty;
    DROP TYPE exercise_state;
  `;

  return knex.raw(query);
};

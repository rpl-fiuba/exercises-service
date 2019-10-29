const { assert } = require('chai');
const requests = require('./utils/requests');
const mocks = require('./utils/mocks');
const { cleanDb } = require('./utils/db');

describe('Integration exercises tests', () => {
  let token;
  let error;
  let courseId;
  let guideId;
  let exercise;
  let response;

  before(() => {
    courseId = 'course-id';
    guideId = 'guideId';
    token = 'token';
    return cleanDb();
  });

  afterEach(() => cleanDb());

  describe('Create exercise', () => {
    describe('When the user is the professor of the course', () => {
      let expectedExercise;

      beforeEach(async () => {
        exercise = {
          exercise: 'dx',
          name: 'derivada',
          description: 'calcula la derivada',
          type: 'derivative',
          difficulty: 'easy'
        };
        expectedExercise = {
          ...exercise,
          guideId,
          courseId
        };
      });

      beforeEach(async () => {
        mocks.mockAuth({});

        response = await requests.createExercise({
          exercise, courseId, guideId, token
        });
      });

      it('status is OK', () => assert.equal(response.status, 201));

      it('body has the created exercise', () => {
        assert.property(response.body, 'exerciseId');
        delete response.body.exerciseId;
        assert.deepEqual(response.body, expectedExercise);
      });
    });

    describe('When sending a wrong exercise type', () => {
      beforeEach(async () => {
        mocks.mockAuth({});
        exercise = {
          exercise: 'dx',
          name: 'derivada',
          description: 'calcula la derivada',
          type: 'falopa',
          difficulty: 'easy'
        };

        error = await requests.createExercise({
          exercise, courseId, guideId, token
        });
      });

      it('status is bad request', () => assert.equal(error.status, 400));
      it('message describes the error', () => assert.equal(error.body.message, 'Invalid exercise type'));
    });

    describe('When not sending all the properties', () => {
      beforeEach(async () => {
        mocks.mockAuth({});
        exercise = {
          exercise: 'dx',
          description: 'calcula la derivada',
          type: 'derivative',
          difficulty: 'easy'
        };

        error = await requests.createExercise({
          exercise, courseId, guideId, token
        });
      });

      it('status is bad request', () => assert.equal(error.status, 400));
      it('message describes the error', () => assert.equal(error.body.message, 'exercise, name, type or difficulty have not been provided'));
    });
  });

  describe('Update exercise', () => {
    let updatedExercise;
    let expectedUpdatedExercise;

    describe('When the user is the professor of the course', () => {
      describe('When the exercise to update exists', () => {
        beforeEach(async () => {
          exercise = {
            exercise: 'int',
            name: 'integrala',
            description: 'calcula la integrate',
            type: 'integral',
            difficulty: 'easy'
          };
          updatedExercise = {
            ...exercise,
            name: 'new name'
          };
          expectedUpdatedExercise = [
            { ...updatedExercise, courseId, guideId }
          ];
        });

        beforeEach(async () => {
          mocks.mockAuth({ times: 3 });

          const createdExercise = await requests.createExercise({
            exercise, courseId, guideId, token
          });
          await requests.updateExercise({
            exercise: updatedExercise,
            courseId,
            guideId,
            exerciseId: createdExercise.body.exerciseId,
            token
          });
          response = await requests.listExercises({ courseId, guideId, token });
        });

        it('status is OK', () => assert.equal(response.status, 200));

        it('body has the created exercise', () => {
          // eslint-disable-next-line no-param-reassign
          response.body.forEach((ex) => delete ex.exerciseId);
          assert.deepEqual(response.body, expectedUpdatedExercise);
        });
      });

      describe('When the exercise does not exist', () => {
        beforeEach(async () => {
          updatedExercise = {
            exercise: 'int',
            name: 'integrala',
            description: 'calcula la integrate',
            type: 'integral',
            difficulty: 'easy'
          };
        });

        beforeEach(async () => {
          mocks.mockAuth({});

          error = await requests.updateExercise({
            exercise: updatedExercise,
            courseId,
            guideId,
            exerciseId: 'd59b1a1a-d40a-4211-a1d4-5faa82b85d75',
            token
          });
        });

        it('status is OK', () => assert.equal(error.status, 404));
        it('message describes the error', () => assert.equal(error.body.message, 'Exercise not found'));
      });
    });
  });

  describe('List exercises', () => {
    let derivativeEx;
    let integrateEx;
    let expectedExercises;

    describe('When the user is the professor of the course', () => {
      beforeEach(async () => {
        derivativeEx = {
          exercise: 'dx',
          name: 'derivada',
          description: 'calcula la derivada',
          type: 'derivative',
          difficulty: 'easy'
        };
        integrateEx = {
          exercise: 'int',
          name: 'integrala',
          description: 'calcula la integrate',
          type: 'integral',
          difficulty: 'easy'
        };
        expectedExercises = [
          { ...derivativeEx, courseId, guideId },
          { ...integrateEx, courseId, guideId }
        ];
      });

      beforeEach(async () => {
        mocks.mockAuth({ times: 3 });

        await requests.createExercise({
          exercise: derivativeEx, courseId, guideId, token
        });
        await requests.createExercise({
          exercise: integrateEx, courseId, guideId, token
        });
        response = await requests.listExercises({ courseId, guideId, token });
      });

      it('status is OK', () => assert.equal(response.status, 200));

      it('body has the created exercise', () => {
        // eslint-disable-next-line no-param-reassign
        response.body.forEach((ex) => delete ex.exerciseId);
        assert.deepEqual(response.body, expectedExercises);
      });
    });
  });
});

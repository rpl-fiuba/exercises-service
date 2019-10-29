const { assert } = require('chai');
const requests = require('./utils/requests');
const mocks = require('./utils/mocks');
const { cleanDb } = require('./utils/db');

describe('Integration user exercises tests', () => {
  let token;
  let error;
  let userId;
  let courseId;
  let guideId;
  let studentProfile;

  let response;

  before(() => {
    courseId = 'course-id';
    guideId = 'guideId';
    userId = 'student';
    token = 'token';

    studentProfile = {
      userId: 'student',
      name: 'pedro',
      email: 'pedro@gmail',
      rol: 'student'
    };
    return cleanDb();
  });

  afterEach(() => cleanDb());

  describe('Add user exercises', () => {
    let derivativeExerciseId;
    let integrateExerciseId;
    let derivativeExercise;
    let integrateExercise;

    beforeEach(async () => {
      derivativeExercise = {
        exercise: 'dx',
        name: 'derivada',
        description: 'calcula la derivada',
        type: 'derivative',
        difficulty: 'easy'
      };
      integrateExercise = {
        exercise: 'dx',
        name: 'integrate',
        description: 'calcula la integral',
        type: 'integral',
        difficulty: 'easy'
      };
    });

    describe('when the user is added correcly', () => {
      beforeEach(async () => {
        mocks.mockAuth({ times: 3 });

        const derivEx = await requests.createExercise({
          exercise: derivativeExercise, courseId, guideId, token
        });
        derivativeExerciseId = derivEx.body.exerciseId;
        const integEx = await requests.createExercise({
          exercise: integrateExercise, courseId, guideId, token
        });
        integrateExerciseId = integEx.body.exerciseId;
        response = await requests.addUser({ courseId, user: { userId }, token });
      });

      it('status is OK', () => assert.equal(response.status, 201));

      describe('when asking for the user exercises', () => {
        let expectedUserExercises;

        beforeEach(async () => {
          expectedUserExercises = [{
            ...derivativeExercise,
            userId,
            guideId,
            courseId,
            exerciseId: derivativeExerciseId,
            state: 'incompleted',
            calification: null
          }, {
            ...integrateExercise,
            userId,
            guideId,
            courseId,
            exerciseId: integrateExerciseId,
            state: 'incompleted',
            calification: null
          }];
        });

        beforeEach(async () => {
          mocks.mockAuth({ profile: studentProfile });

          response = await requests.listUserExercises({ courseId, guideId, token });
        });

        it('status is OK', () => assert.equal(response.status, 200));

        it('should retrieve the created exercises', () => {
          assert.deepEqual(response.body, expectedUserExercises);
        });
      });
    });

    describe('when the user is not provided', () => {
      beforeEach(async () => {
        mocks.mockAuth({});

        error = await requests.addUser({ courseId, user: {}, token });
      });

      it('status is OK', () => assert.equal(error.status, 400));
    });
  });
});

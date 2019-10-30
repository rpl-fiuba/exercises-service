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

  let derivativeExerciseId;
  let integrateExerciseId;
  let derivativeExercise;
  let integrateExercise;

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
  });

  before(() => cleanDb());
  after(() => cleanDb());

  describe('Adding exercises to course', () => {
    let derivResponse;
    let integResponse;

    before(async () => {
      mocks.mockAuth({ times: 2 });

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
      derivResponse = await requests.createExercise({
        exercise: derivativeExercise, courseId, guideId, token
      });
      integResponse = await requests.createExercise({
        exercise: integrateExercise, courseId, guideId, token
      });
      derivativeExerciseId = derivResponse.body.exerciseId;
      integrateExerciseId = integResponse.body.exerciseId;
    });

    it('exercise added correctly', () => assert.equal(derivResponse.status, 201));
    it('exercise added correctly', () => assert.equal(integResponse.status, 201));
  });

  describe('when adding a non provided user', () => {
    before(async () => {
      mocks.mockAuth({});

      error = await requests.addUser({ courseId, user: {}, token });
    });

    it('status is OK', () => assert.equal(error.status, 400));
  });

  describe('Adding user exercises', () => {
    before(async () => {
      mocks.mockAuth({});

      response = await requests.addUser({ courseId, user: { userId }, token });
    });

    it('status is OK', () => assert.equal(response.status, 201));
  });

  describe('Asking user exercises', () => {
    let expectedUserExercises;

    before(async () => {
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

    before(async () => {
      mocks.mockAuth({ profile: studentProfile });

      response = await requests.listUserExercises({ courseId, guideId, token });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('should retrieve the created exercises', () => {
      assert.deepEqual(response.body, expectedUserExercises);
    });
  });

  describe('Asking the user exercise', () => {
    let expectedUserExercise;

    before(async () => {
      expectedUserExercise = {
        ...derivativeExercise,
        userId,
        guideId,
        courseId,
        exerciseId: derivativeExerciseId,
        state: 'incompleted',
        calification: null
      };
    });

    before(async () => {
      mocks.mockAuth({ profile: studentProfile });

      response = await requests.getUserExercise({
        exerciseId: derivativeExerciseId,
        courseId,
        guideId,
        token
      });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('should retrieve the asked exercise', () => {
      assert.deepEqual(response.body, expectedUserExercise);
    });
  });

  describe('Asking a non existing user exercise', () => {
    before(async () => {
      mocks.mockAuth({ profile: studentProfile });

      response = await requests.getUserExercise({
        exerciseId: 'falopa',
        courseId,
        guideId,
        token
      });
    });

    it('status is OK', () => assert.equal(response.status, 404));

    it('should retrieve the properly message', () => {
      assert.deepEqual(response.body.message, 'Exercise not found');
    });
  });

  describe('Updating the user exercise (by the professor)', () => {
    before(async () => {
      mocks.mockAuth({ profile: {} }); // TODO: SHOULD BE THE PROFESSOR PROFILE

      response = await requests.updateUserExercise({
        exerciseMetadata: { calification: 10 },
        exerciseId: derivativeExerciseId,
        courseId,
        guideId,
        userId,
        token
      });
    });

    it('status is OK', () => assert.equal(response.status, 200));
  });

  describe('Asking the user exercise (again)', () => {
    let expectedUserExercise;

    before(async () => {
      expectedUserExercise = {
        ...derivativeExercise,
        userId,
        guideId,
        courseId,
        exerciseId: derivativeExerciseId,
        state: 'incompleted',
        calification: 10
      };
    });

    before(async () => {
      mocks.mockAuth({ profile: studentProfile });

      response = await requests.getUserExercise({
        exerciseId: derivativeExerciseId,
        courseId,
        guideId,
        token
      });
    });

    it('status is OK', () => assert.equal(response.status, 200));

    it('should retrieve the updated exercise', () => {
      assert.deepEqual(response.body, expectedUserExercise);
    });
  });
});

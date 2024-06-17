/* eslint-disable max-len */
const express = require('express');

const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const configs = require('./config')();

// Middlewares
const errorMiddleware = require('./middlewares/errorMiddleware');
const initialMiddleware = require('./middlewares/initialMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const requestLoggerMiddleware = require('./middlewares/requestLoggerMiddleware');
const courseValidatorMiddleware = require('./middlewares/courseValidatorMiddleware');

// Controllers
const statusController = require('./controllers/statusController');
const usersController = require('./controllers/usersController');
const playgroundController = require('./controllers/playgroundController');
const exerciseController = require('./controllers/exerciseController');
const resolutionController = require('./controllers/resolutionController');
const statisticsController = require('./controllers/statisticsController');

const app = express();
const { port } = configs.app;


app.use(cors());

//  Body parser middleware
app.use(bodyParser.json());
app.use(requestLoggerMiddleware);

// Routes
router.get('/ping', (req, res) => statusController.ping(req, res));
router.get('/', (req, res) => statusController.ping(req, res));

router.use(initialMiddleware);
router.use(authMiddleware);

// Users
// TODO: validar que el usuario a agregar pertenece al curso
router.post('/courses/:courseId/users', courseValidatorMiddleware, usersController.addUser);

// Exercises
// TODO: validar que es el profesor del curso el que ejecuta estas acciones
router.post('/courses/:courseId/copy', courseValidatorMiddleware, exerciseController.copyCourseExercises);
router.post('/courses/:courseId/guides/:guideId/exercises', courseValidatorMiddleware, exerciseController.create);
router.get('/courses/:courseId/guides/:guideId/exercises', courseValidatorMiddleware, exerciseController.list);
router.put('/courses/:courseId/guides/:guideId/exercises/:exerciseId', courseValidatorMiddleware, exerciseController.update);
router.delete('/courses/:courseId/guides/:guideId/exercises/:exerciseId', courseValidatorMiddleware, exerciseController.remove);
router.get('/courses/:courseId/guides/:guideId/exercises/:exerciseId/status', courseValidatorMiddleware, exerciseController.getExerciseStatus);

// User Exercises
router.get('/courses/:courseId/guides/:guideId/user/exercises', courseValidatorMiddleware, usersController.listExercises);
router.get('/courses/:courseId/guides/:guideId/user/:userId/exercises', courseValidatorMiddleware, usersController.listExercises);
router.get('/courses/:courseId/guides/:guideId/user/exercises/:exerciseId', courseValidatorMiddleware, usersController.getExercise);
router.get('/courses/:courseId/guides/:guideId/user/:userId/exercises/:exerciseId', courseValidatorMiddleware, usersController.getExercise);
router.put('/courses/:courseId/guides/:guideId/user/exercises/:exerciseId', courseValidatorMiddleware, usersController.updateExercise);
router.put('/courses/:courseId/guides/:guideId/user/:userId/exercises/:exerciseId', courseValidatorMiddleware, usersController.updateExercise);
router.get('/courses/:courseId/guides/:guideId/user/exercises/:exerciseId/resolutions', courseValidatorMiddleware, usersController.listResolutions);

// Playground
router.get('/playground/exercises', playgroundController.getPlaygroundExercises);
router.post('/playground/exercises', playgroundController.createPlaygroundExercise);
router.get('/playground/exercises/:exerciseId', playgroundController.getPlaygroundExercise);
router.delete('/playground/exercises/:exerciseId', playgroundController.removePlaygroundExercise);
router.post('/playground/exercises/:exerciseId/resolve', playgroundController.resolvePlaygroundExercise);
router.delete('/playground/exercises/:exerciseId/step', playgroundController.removePlaygroundStep);

// Resolution
router.delete('/courses/:courseId/guides/:guideId/exercises/:exerciseId/step', courseValidatorMiddleware, resolutionController.removeStep);
router.post('/courses/:courseId/guides/:guideId/exercises/:exerciseId/resolve', courseValidatorMiddleware, resolutionController.resolve);
router.put('/courses/:courseId/guides/:guideId/exercises/:exerciseId/deliver', courseValidatorMiddleware, resolutionController.deliver);
router.post('/courses/:courseId/guides/:guideId/exercises/evaluate', courseValidatorMiddleware, resolutionController.evaluate);

// Statistics
router.get('/courses/:courseId/errors/statistics', courseValidatorMiddleware, statisticsController.getErrorCountStatistics);
router.get('/courses/:courseId/steps/statistics', courseValidatorMiddleware, statisticsController.getStepCountStatistics);
router.get('/courses/:courseId/qualifications/statistics', courseValidatorMiddleware, statisticsController.getQualificationsStatistics);
router.get('/courses/:courseId/guides/:guideId/statistics/initiated', courseValidatorMiddleware, statisticsController.getInitiatedExercisesStatistics);
router.get('/courses/:courseId/guides/:guideId/statistics/failed', courseValidatorMiddleware, statisticsController.getFailedExercisesStatistics);
router.get('/courses/:courseId/guides/:guideId/statistics/resolved', courseValidatorMiddleware, statisticsController.getResolvedExercisesStatistics);

app.use(router);

app.use(errorMiddleware);

//  Setting the invalid enpoint message for any other route
app.get('*', (req, res) => {
  res.status(400)
    .json({ message: 'Invalid endpoint' });
});

//  Start server on port
const server = app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

module.exports = {
  server
};

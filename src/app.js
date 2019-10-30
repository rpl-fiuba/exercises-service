const express = require('express');

const router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');

const configs = require('./config')();
const errorMiddleware = require('./middlewares/errorMiddleware');
const initialMiddleware = require('./middlewares/initialMiddleware');
const authMiddleware = require('./middlewares/authMiddleware');
const requestLoggerMiddleware = require('./middlewares/requestLoggerMiddleware');

// const professorMiddleware

const statusController = require('./controllers/statusController');
const usersController = require('./controllers/usersController');
const exerciseController = require('./controllers/exerciseController');

const app = express();
const { port } = configs.app;


app.use(cors());

//  Body parser middleware
app.use(bodyParser.json());

app.use(requestLoggerMiddleware);

// Routes
router.get('/ping', (req, res) => statusController.ping(req, res));

router.use(initialMiddleware);
router.use(authMiddleware);

// Users
/* eslint-disable max-len */
router.post('/courses/:courseId/users', usersController.addUser); // TODO: VALIDAR QUE EL USUARIO PERTENECE AL CURSO Y CREAR EJERCICIOS PARA EL

// Exercises
router.post('/courses/:courseId/guides/:guideId/exercises', exerciseController.create); // TODO: SOLO PROFE DEL CURSO. VALIDAR QUE EL CURSO Y LA GUIA EXISTEN

router.get('/courses/:courseId/guides/:guideId/exercises', exerciseController.list); // TODO: PARA UN USUARIO? Y SI ES EL PROFE CAMBIAMOS?
router.patch('/courses/:courseId/guides/:guideId/exercises/:exerciseId', exerciseController.update); // TODO: SOLO PROFE
// AUN NO router.delete('/courses/:courseId/guides/:guideId/exercises/:exerciseId', exerciseController.remove); // TODO: SE BORRA PARA UNO, SE BORRA PARA TODOS. SOLO PROFE

// User Exercises
router.get('/courses/:courseId/guides/:guideId/user/exercises', usersController.listExercises); // TODO: VALIDAR QUE EXISTA EN EL CURSO ? QUIZAS NI HAGA FALTA
router.get('/courses/:courseId/guides/:guideId/user/exercises/:exerciseId', usersController.getExercise);
router.patch('/courses/:courseId/guides/:guideId/user/exercises/:exerciseId', usersController.updateExercise);


// Resolution
// router.post('/courses/:courseId/guides/:guideId/exercises/:exerciseId/validate', resolutionController.validate);
// router.post('/courses/:courseId/guides/:guideId/exercises/:exerciseId/resolve', resolutionController.resolve);
// router.post('/courses/:courseId/guides/:guideId/exercises/:exerciseId/help', resolutionController.help);


app.use(router);

app.use(errorMiddleware);

//  Setting the invalid enpoint message for any other route
app.get('*', (req, res) => {
  res.status(400).json({ message: 'Invalid endpoint' });
});

//  Start server on port
const server = app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});

module.exports = {
  server
};

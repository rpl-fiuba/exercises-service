module.exports = {
  app: {
    protocol: 'http',
    hostname: 'localhost',
    port: process.env.PORT || '9000'
  },
  services: {
    mathResolverService: {
      url: {
        protocol: 'http',
        hostname: process.env.MATH_SOLVER_URL || 'learning.net.ar/math-solver',
        port: 80
      },
      paths: {
        evaluate: '/validations/evaluate',
        resolve: '/resolve',
        mathTree: '/results/solution-tree',
        help: '/help',
      }
    },
    usersService: {
      url: {
        protocol: 'http',
        hostname: process.env.USERS_SERVICE_URL || 'learning.net.ar/users-service',
        port: 80,
      },
      paths: {
        auth: 'login'
      }
    },
    coursesService: {
      url: {
        protocol: 'http',
        hostname: process.env.COURSES_SERVICE_URL || 'learning.net.ar/courses-service',
        port: 80,
      },
      paths: {
        course: ({ courseId }) => `/courses/${courseId}`,
        guide: ({ courseId, guideId }) => `/courses/${courseId}/guides/${guideId}`
      },
    }
  },
  db: {
    client: 'pg',
    version: '10.10',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DATABASE
    }
  }
};

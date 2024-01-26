module.exports = {
  app: {
    protocol: 'http',
    hostname: 'localhost',
    port: process.env.PORT || '9000'
  },
  services: {
    mathResolverService: {
      url: {
        protocol: 'https',
        hostname: process.env.MATH_SOLVER_URL || 'learning.net.ar/math-solver',
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
        protocol: 'https',
        hostname: process.env.USERS_SERVICE_URL || 'learning.net.ar/users-service',
      },
      paths: {
        auth: 'login'
      }
    },
    coursesService: {
      url: {
        protocol: 'https',
        hostname: process.env.COURSES_SERVICE_URL || 'learning.net.ar/courses-service',
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

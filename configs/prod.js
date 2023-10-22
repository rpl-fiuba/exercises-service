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
        hostname: process.env.MATH_SOLVER_URL || 'math-solver-fiuba-lorenzolgz.cloud.okteto.net',
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
        hostname: process.env.USERS_SERVICE_URL || 'users-service-fiuba-lorenzolgz.cloud.okteto.net/',
      },
      paths: {
        auth: 'login'
      }
    },
    coursesService: {
      url: {
        protocol: 'https',
        hostname: process.env.COURSES_SERVICE_URL || 'courses-service-fiuba-lorenzolgz.cloud.okteto.net',
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

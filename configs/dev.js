const resolveDbHost = () => {
  const { DOCKER } = process.env;
  return DOCKER ? 'exercises-db' : 'localhost';
};

module.exports = {
  app: {
    protocol: 'http',
    hostname: 'localhost',
    port: '9000'
  },
  services: {
    mathSolver: {
      url: {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000'
      },
      paths: {}
    },
    usersService: {
      url: {
        protocol: 'http',
        hostname: 'localhost',
        port: '7000'
      },
      paths: {
        auth: 'login'
      }
    },
    coursesService: {
      url: {
        protocol: 'http',
        hostname: 'localhost',
        port: '5001'
      },
      paths: {
        course: ({ courseId }) => `/courses/${courseId}`,
        guide: ({ courseId, guideId }) => `/courses/${courseId}/guides/${guideId}`
      }
    }
  },
  db: {
    client: 'pg',
    version: '10.10',
    connection: {
      host: resolveDbHost(),
      user: 'postgres',
      password: 'postgres',
      database: 'exercises_service'
    }
  }
};

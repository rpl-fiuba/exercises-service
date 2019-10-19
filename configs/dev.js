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
        auth: 'auth'
      }
    }
  },
  db: {
    client: 'pg',
    version: '10.10',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'postgres',
      database: 'exercises_service'
    }
  }
};

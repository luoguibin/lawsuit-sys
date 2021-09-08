const config = {
  db: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root123',
    database: 'lawsuit_db',
    connectionLimit: 10,
    timezone: 'Asia%2FShanghai',
    dateStrings: true,
    supportBigNumbers: true,
    bigNumberStrings: true,
  },
  server: {
    port: 8282
  },
  auth: {
    SECRET_KEY: 'test',
    expDuration: 7 * 24 * 60 * 60
  },
  workerId: 1,
}

module.exports = config

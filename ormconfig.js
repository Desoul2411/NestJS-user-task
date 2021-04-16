module.exports = {
    type: 'mysql',
    host: 'localhost',
    port: 3307,
    username: 'root',
    password: '1',
    database: 'user_schema',
    dropSchema: true,
    logging: false,
    synchroize: true,
    migrationsRun: true,
    entities: ['src/user/user.entity.ts'],

  };
module.exports = {
  type: "mysql",
  host: "mysql",
  // port: 3307,
  username: "root",
  password: null,
  database: "mysql",
  dropSchema: true,
  logging: false,
  synchroize: true,
  migrationsRun: true,
  entities: ["src/user/user.entity.ts"],
};

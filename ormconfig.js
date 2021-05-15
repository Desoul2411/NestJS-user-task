module.exports = {
  type: "mysql",
  host: "mysql",
  // port: 3307,
  username: "Desoul2411",
  password: 32167,
  database: "mysql",
  dropSchema: true,
  logging: false,
  synchroize: true,
  migrationsRun: true,
  entities: ["src/user/user.entity.ts"],
};

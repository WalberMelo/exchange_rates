const { Sequelize } = require("sequelize");

// setup a new database model
const sequelize = new Sequelize("database", "", "", {
  dialect: "sqlite",
  storage: "./tmp/rates.sqlite",
  logging: false,
});

module.exports = sequelize;

const Sequelize = require("sequelize");

const sequelize = new Sequelize("dannysound", "root", "", {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
});

module.exports = sequelize;
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../../database");

class Rates extends Model {}

Rates.init(
  {
    last_update: {
      type: DataTypes.STRING,
    },
    country: {
      type: DataTypes.STRING,
    },
    rate: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "rates",
    timestamps: false,
  }
);

module.exports = Rates;

const axios = require("axios");
const Rates = require("../model/Rates");

const {
  removeTimezone,
  createRatesObj,
  insertRatesToDataBase,
} = require("../utils/lib/functions.js");

async function getApiRates(req, res) {
  try {
    const response = await axios.get("https://open.er-api.com/v6/latest");
    if (!response.data) throw new Error("Problem getting price rates data");

    let rates = await response.data.rates;
    let lastUpdate = removeTimezone(response.data.time_last_update_utc);
    let ratesArray = createRatesObj(rates, lastUpdate);

    for (const rate of ratesArray) {
      await insertRatesToDataBase(rate);
    }
    res.render("index");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something went wrong! ${error.message}`);
  }
}

async function getAllRates(req, res) {
  try {
    const allRates = await Rates.findAll();
    res.render("rates", { rates: allRates });
  } catch (err) {
    console.log(err);
  }
}

async function getCountryRates(req, res) {
  const { country } = req.body;
  const requestedCountry = country.toUpperCase().trim();

  try {
    const countryRate = await Rates.findOne({
      where: { country: requestedCountry },
    });

    if (countryRate === null) return;
    res.render("ratesCountry", { rates: countryRate });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getApiRates,
  getAllRates,
  getCountryRates,
};

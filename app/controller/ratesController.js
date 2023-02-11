const axios = require("axios");
const Rates = require("../model/Rates.js");
const removeTimezone = require("../utils/lib/functions.js");

async function insertRatesToDataBase(rateObj) {
  try {
    await Rates.create(rateObj);
    console.log("Rates inserted in database");
  } catch (err) {
    console.log(err);
  }
}

async function getApiRates(req, res) {
  try {
    /* 1) Get currency rates from API */
    const response = await axios.get("https://open.er-api.com/v6/latest");
    if (!response.data) throw new Error("Problem getting price rates data");

    const rates = await response.data.rates;

    // manipulating API data
    const lastUpdateDateTime = removeTimezone(
      response.data.time_last_update_utc
    );

    for (const [key, value] of Object.entries(rates)) {
      let rateObj = {
        last_update: lastUpdateDateTime,
        country: key,
        rate: value,
      };

      /* 2) Stores the result in data base */
      insertRatesToDataBase(rateObj);
    }
    //get api rates render to index page
    res.render("index");
  } catch (error) {
    console.log(error);
    res.status(500).send(`Something went wrong! ${error.message}`);
  }
}

async function getAllRates(req, res) {
  try {
    const allRates = await Rates.findAll();
    // res.send(allRates);
    res.render("rates", { rates: allRates });
  } catch (err) {
    console.log(err);
  }
}

async function getCountryRates(req, res) {
  console.log(req.body);
  const { country } = req.body;
  const requestedCountry = country.toUpperCase().trim();

  try {
    const countryRate = await Rates.findOne({
      where: { country: requestedCountry },
    });

    // res.send(countryRate);
    if (countryRate === null) return;
    res.render("ratesCountry", { rates: countryRate });
  } catch (err) {
    console.log(err);
  }
}

module.exports = { getApiRates, getAllRates, getCountryRates };

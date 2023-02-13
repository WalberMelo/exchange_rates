const Rates = require("../../model/Rates");

function removeTimezone(dateString) {
  return dateString.replace("+0000", "").trim();
}

function createRatesObj(rates, update) {
  let formattedDataArray = [];

  for (const [key, value] of Object.entries(rates)) {
    formattedData = {
      last_update: update,
      country: key,
      rate: value,
    };
    formattedDataArray.push(formattedData);
  }
  return formattedDataArray;
}

async function insertRatesToDataBase(rateObj) {
  try {
    await Rates.create(rateObj);
  } catch (err) {
    console.log(err);
  }
}

module.exports = { removeTimezone, createRatesObj, insertRatesToDataBase };

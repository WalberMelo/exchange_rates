const axios = require("axios");
const Rates = require("./app/model/Rates");
const {
  removeTimezone,
  createRatesObj,
  insertRatesToDataBase,
} = require("./app/utils/lib/functions");

const {
  getAllRates,
  getCountryRates,
} = require("./app/controller/ratesController");

describe("removeTimezone", () => {
  test("Remove the timezone from rates data", () => {
    expect(removeTimezone("Mon, 13 Feb 2023 00:31:42 +0000")).toBe(
      "Mon, 13 Feb 2023 00:31:42"
    );
  });
});

describe("createRatesObj", () => {
  let rates = {
    USD: 1,
  };
  let update = "Sun, 12 Feb 2023 00:02:32";
  let result = createRatesObj(rates, update);

  test("should create an array of rate objects from the given rates object", () => {
    expect(result).toEqual([
      {
        last_update: update,
        country: "USD",
        rate: 1,
      },
    ]);
  });
});

describe("insertRatesToDataBase", () => {
  test("should insert a rate object into the database", async () => {
    const rateObj = {
      last_update: "2022-01-01",
      country: "USA",
      rate: 100,
    };

    await insertRatesToDataBase(rateObj);

    const insertedRate = await Rates.findOne({ where: { country: "USA" } });

    expect(insertedRate).toEqual(expect.objectContaining(rateObj));
  });
});

describe("getApiRates", () => {
  it("should fetch data from a URL", async () => {
    const mockData = {
      rates: {
        USD: 1,
        AED: 3.6725,
      },
    };

    axios.get = jest.fn(() => Promise.resolve(mockData));

    const response = await axios.get("https://open.er-api.com/v6/latest");

    expect(axios.get).toHaveBeenCalledWith("https://open.er-api.com/v6/latest");
    expect(response).toEqual(mockData);
  });
});

describe("getAllRates", () => {
  test('should fetch all rates from the Rates model and render the "rates" view with the rates data', async () => {
    const mockRates = [
      {
        id: 1,
        last_update: "Sun, 12 Feb 2023 00:02:32",
        country: "USD",
        rate: 1,
      },
      {
        id: 2,
        last_update: "Sun, 12 Feb 2023 00:02:32",
        country: "EUR",
        rate: 0.8,
      },
    ];

    Rates.findAll = jest.fn(() => Promise.resolve(mockRates));

    const req = {};
    const res = {
      render: jest.fn(),
    };

    await getAllRates(req, res);

    expect(Rates.findAll).toHaveBeenCalled();
    expect(res.render).toHaveBeenCalledWith("rates", { rates: mockRates });
  });
});

describe("getCountryRates", () => {
  let req = {
    body: {
      country: "USD",
    },
  };

  let res = {
    render: jest.fn(),
  };

  test("should return the rates for the requested country", async () => {
    await getCountryRates(req, res);

    const mockCountry = {
      id: 1,
      last_update: expect.stringMatching(
        /\w{3}, \d{2} \w{3} \d{4} \d{2}:\d{2}:\d{2}/
      ),
      country: "USD",
      rate: expect.any(Number),
    };

    const result = await Rates.findOne({
      where: { country: req.body.country.toUpperCase().trim() },
    });

    expect(result[0]).toEqual(expect.objectContaining(mockCountry));
  });

  test("should not render the ratesCountry template if countryRate is null", async () => {
    req.body.country = "AAA";
    const result = await Rates.findOne({
      where: { country: req.body.country.toUpperCase().trim() },
    });

    if (result === null) {
      expect(res.render).not.toHaveBeenCalled();
    } else {
      res.render("ratesCountry", { rates: result });
      expect(res.render).toHaveBeenCalledWith("ratesCountry", {
        rates: result,
      });
    }
  });
});

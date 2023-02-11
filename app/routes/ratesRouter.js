const ratesController = require("../controller/ratesController");
const router = require("express").Router();

router.get("/", ratesController.getApiRates);
router.get("/rates", ratesController.getAllRates);
router.post("/rates/country", ratesController.getCountryRates);

module.exports = router;

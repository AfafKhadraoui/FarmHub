const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");
// Handles both Worker (GPS/Default) and Farmer (Dashboard)
router.get("/current", weatherController.getCurrentWeather);
// Returns 7-day forecast (Farmer Only)
router.get("/forecast/daily", weatherController.getDailyForecast);
// Returns 24-hour forecast (Farmer Only)
router.get("/forecast/hourly", weatherController.getHourlyForecast);
// Returns farming advice based on weather (Farmer Only)
router.get("/recommendations", weatherController.getRecommendations);
module.exports = router;

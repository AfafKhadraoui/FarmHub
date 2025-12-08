const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const weatherService = require("../services/weatherServices");

const getFarmLocation = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { userFarm: true },
  });
  if (!user?.userFarm?.location) throw new Error("Farm location not found");
  return user.userFarm.location;
};

const getFarmWeatherData = async (userId) => {
  const locationName = await getFarmLocation(userId);
  const coords = await weatherService.getCoordinates(locationName);
  const data = await weatherService.getWeatherData(
    coords.latitude,
    coords.longitude
  );
  return { data, locationName, coords };
};
//this return
exports.getCurrentWeather = async (req, res) => {
  try {
    const { role } = req.user;

    // worker
    if (role === "worker") {
      const { latitude, longitude } = req.query; //you can send the cordinates or just use the location in the db
      if (latitude && longitude) {
        const data = await weatherService.getWeatherData(latitude, longitude);
        return res.json(
          weatherService.formatForWorker(data, "Current Location")
        );
      }
      const { data, locationName } = await getFarmWeatherData(req.user.id);
      return res.json(weatherService.formatForWorker(data, locationName));
    }

    const { data } = await getFarmWeatherData(req.user.id);
    return res.json(weatherService.formatForFarmerCurrent(data));
  } catch (error) {
    console.error("Weather Controller Error:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
};

//  GET DAILY FORECAST (Farmer Only)
exports.getDailyForecast = async (req, res) => {
  try {
    // Use the helper to get the data
    const { data } = await getFarmWeatherData(req.user.id);
    //formating the data
    res.json(weatherService.formatForFarmerDaily(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch daily forecast" });
  }
};

//  GET HOURLY FORECAST (Farmer Only)
exports.getHourlyForecast = async (req, res) => {
  try {
    const { data } = await getFarmWeatherData(req.user.id);
    res.json(weatherService.formatForFarmerHourly(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch hourly forecast" });
  }
};

// GET RECOMMENDATIONS (Farmer Only)
exports.getRecommendations = async (req, res) => {
  try {
    const { data } = await getFarmWeatherData(req.user.id);

    // Pass the full data object to generate recommendations
    res.json(weatherService.generateRecommendations(data));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
};

const dashboardController = require("../controllers/dashboardController");
const { authenticateToken } = require('../middleware/authMiddleware');
const express = require('express');

const router = express.Router();

// middleware
router.use(authenticateToken);

// Dashboard overview routes
router.get('/overview', dashboardController.getOverView);
router.get('/', dashboardController.getOverviewWorker);

// Farm activity and recent updates
router.get('/farm-activity', dashboardController.getFarmActivity);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/recent-tasks', dashboardController.getRecentTasks);

// Today's overview (weather and fields)
router.get('/today-overview', dashboardController.getTodayOverview);

module.exports = router;
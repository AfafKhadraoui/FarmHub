const dashboardService = require("../services/dashbordService");

// Helper functions
const parseIntOrDefault = (value, defaultValue) => {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
};

const sendSuccess = (res, status, data, message = null) => {
    return res.status(status).json({
        success: true,
        ...(message && { message }),
        ...(data !== undefined && { data }),
    });
};

const sendError = (res, error) => {
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({
        success: false,
        message: error.message || 'Something went wrong',
    });
};

// controllers
const dashboardController = {
    // Overview for admin dashboard
    async getOverView(req, res) {
        try {
            const stats = await dashboardService.getOverview(req.user.id);
            return sendSuccess(res, 200, stats, 'Dashboard overview retrieved successfully');
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Overview for worker dashboard
    async getOverviewWorker(req, res) {
        try {
            const stats = await dashboardService.getWorkerDashboard(req.user.id);
            return sendSuccess(res, 200, stats, 'Worker dashboard retrieved successfully');
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Get farm activity (active tasks and field status)
    async getFarmActivity(req, res) {
        try {
            const taskLimit = parseIntOrDefault(req.query.taskLimit, 5);
            const fieldLimit = parseIntOrDefault(req.query.fieldLimit, 4);
            
            const activity = await dashboardService.getFarmActivity(req.user.id, {
                taskLimit,
                fieldLimit
            });
            return sendSuccess(res, 200, activity, 'Farm activity retrieved successfully');
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Get recent activity feed
    async getRecentActivity(req, res) {
        try {
            const limit = parseIntOrDefault(req.query.limit, 10);
            
            const activities = await dashboardService.getRecentActivity(req.user.id, { limit });
            return sendSuccess(res, 200, activities, 'Recent activities retrieved successfully');
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Get recent tasks
    async getRecentTasks(req, res) {
        try {
            const limit = parseIntOrDefault(req.query.limit, 5);
            
            const tasks = await dashboardService.getRecentTasks(req.user.id, { limit });
            return sendSuccess(res, 200, tasks, 'Recent tasks retrieved successfully');
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Get today's overview (weather and field statistics)
    async getTodayOverview(req, res) {
        try {
            const overview = await dashboardService.getTodayOverview(req.user.id);
            return sendSuccess(res, 200, overview, 'Today\'s overview retrieved successfully');
        } catch (error) {
            return sendError(res, error);
        }
    },
};

module.exports = dashboardController;



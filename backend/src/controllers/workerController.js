const workerService = require('../services/WorkerService');

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

// Controller
const workerController = {

    // Get all workers (pagination, search)
    async getWorkers(req, res) {
        try {
            const options = {
                page: parseIntOrDefault(req.query.page, 1),
                pageSize: parseIntOrDefault(req.query.limit || req.query.pageSize, 10),
                search: req.query.search,
            };

            const workers = await workerService.getWorkers(req.user.id, options);
            return sendSuccess(res, 200, workers);
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Get single worker by ID
    async getWorkerById(req, res) {
        try {
            const workerId = parseIntOrDefault(req.params.id, null);
            if (!workerId) {
                throw new Error('Invalid worker id');
            }

            const worker = await workerService.getWorkerById(req.user.id, workerId);
            return sendSuccess(res, 200, worker);
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Update worker info
    async updateWorker(req, res) {
        try {
            const workerId = parseIntOrDefault(req.params.id, null);
            if (!workerId) {
                throw new Error('Invalid worker id');
            }

            const { name, email, phone } = req.body;

            const updatedWorker = await workerService.updateWorker(
                req.user.id,
                workerId,
                { name, email, phone }
            );

            return sendSuccess(res, 200, updatedWorker, 'Worker updated successfully');
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Delete worker
    async deleteWorker(req, res) {
        try {
            const workerId = parseIntOrDefault(req.params.id, null);
            if (!workerId) {
                throw new Error('Invalid worker id');
            }

            const result = await workerService.deleteWorker(req.user.id, workerId);
            return sendSuccess(res, 200, result, 'Worker deleted successfully');
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Get worker statistics
    async getWorkerStatistics(req, res) {
        try {
            const stats = await workerService.getWorkerStatistics(req.user.id);
            return sendSuccess(res, 200, stats);
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Assign task to worker
    async assignTaskToWorker(req, res) {
        try {
            const workerId = parseIntOrDefault(req.params.id, null);
            if (!workerId) {
                throw new Error('Invalid worker id');
            }

            const { taskId } = req.body;

            if (!taskId || typeof taskId !== 'number') {
                throw new Error('taskId is required and must be a number');
            }

            const result = await workerService.assignTaskToWorker(
                req.user.id,
                workerId,
                taskId
            );

            return sendSuccess(res, 200, result, result.message);
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Unassign task from worker
    async unassignTaskFromWorker(req, res) {
        try {
            const workerId = parseIntOrDefault(req.params.id, null);
            if (!workerId) {
                throw new Error('Invalid worker id');
            }

            const { taskId } = req.body;

            if (!taskId) {
                throw new Error('taskId is required');
            }

            const result = await workerService.unassignTaskFromWorker(
                req.user.id,
                workerId,
                taskId
            );

            return sendSuccess(res, 200, result, result.message);
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Get available workers for a specific task
    async getAvailableWorkersForTask(req, res) {
        try {
            const taskId = parseIntOrDefault(req.params.taskId, null);
            if (!taskId) {
                throw new Error('Invalid task id');
            }

            const availableWorkers = await workerService.getAvailableWorkersForTask(
                req.user.id,
                taskId
            );

            return sendSuccess(res, 200, availableWorkers);
        } catch (error) {
            return sendError(res, error);
        }
    }
};

module.exports = { workerController };
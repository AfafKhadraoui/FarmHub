const taskService = require('../services/taskService');

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
const taskController = {
    // Create task
    async createTask(req, res) {
        try {
            const task = await taskService.createTask(req.user.id, req.body);
            return sendSuccess(res, 201, task);
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Update task
    async updateTask(req, res) {
        try {
            const taskId = parseIntOrDefault(req.params.id, null);
            if (!taskId) throw new Error('Invalid task id');

            const task = await taskService.updateTask(
                req.user.id,
                taskId,
                req.body
            );
            return sendSuccess(res, 200, task);
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Get tasks (pagination, filter, sort)
    async getTasks(req, res) {
        try {
            const options = {
                page: parseIntOrDefault(req.query.page, 1),
                pageSize: parseIntOrDefault(req.query.limit || req.query.pageSize, 10),
                status: req.query.status,
                priority: req.query.priority,
                fieldId: parseIntOrDefault(req.query.fieldId, null),
                search: req.query.search,
                sortBy: req.query.orderBy || req.query.sortBy || 'dueDate',
                sortOrder: req.query.order || req.query.sortOrder || 'asc',
            };

            const tasks = await taskService.getTasks(req.user.id, options);
            return sendSuccess(res, 200, tasks);
        } catch (error) {
            return sendError(res, error);
        }
    },


    // Delete task
    async deleteTask(req, res) {
        try {
            const taskId = parseIntOrDefault(req.params.id, null);
            if (!taskId) throw new Error('Invalid task id');

            await taskService.deleteTask(req.user.id, taskId);
            return sendSuccess(res, 200, null, 'Task deleted successfully');
        } catch (error) {
            return sendError(res, error);
        }
    },

    // Task statistics
    async getTaskStatistics(req, res) {
        try {
            const stats = await taskService.getTaskStatistics(req.user.id);
            return sendSuccess(res, 200, stats);
        } catch (error) {
            return sendError(res, error);
        }
    },


    async getTaskById(req, res) {
        try {
            const taskId = Number(req.params.id);
            if (!taskId) throw new Error('Invalid task id');

            const task = await taskService.getTaskById(req.user.id, taskId);
            res.status(200).json({ success: true, data: task });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    },

    // add task assignment
    async addTaskAssignment(req, res) {
        try {
            const taskId = Number(req.params.id);
            if (!taskId) throw new Error('Invalid task id');
            const { workerIds } = req.body;  // Changed from workersIds
            if (!workerIds) throw new Error('Workers ids are required');
            if (!Array.isArray(workerIds)) throw new Error('Workers ids must be an array');
            if (workerIds.length === 0) throw new Error('Workers ids must not be empty');
            const assignments = await taskService.addTaskAssignment(req.user.id, taskId, { workersIds: workerIds });
            return sendSuccess(res, 200, assignments);
        } catch (error) {
            return sendError(res, error);
        }
    },

    // update Task status
    async updateTaskStatus(req, res) {
    try {
        const taskId = parseIntOrDefault(req.params.taskId || req.params.id, null);
        if (!taskId) throw new Error('Invalid task id');

        const { status, notes, startedAt } = req.body;
        
        if (!status) {
            throw new Error('Status is required');
        }

        const validStatuses = ['pending', 'in_progress', 'completed'];
        if (!validStatuses.includes(status.toLowerCase())) {
            throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
        }

        const task = await taskService.updateTaskStatus(
            req.user.id,
            taskId,
            { status: status.toLowerCase(), notes, startedAt }
        );
        
        return res.status(200).json({
            success: true,
            data: {
                id: task.id,
                status: task.status,
                updatedAt: task.updatedAt,
                message: 'Task status updated successfully'
            }
        });
    } catch (error) {
        return sendError(res, error);
    }
},

};

module.exports = { taskController };

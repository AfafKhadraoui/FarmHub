const express = require('express');
const { taskController } = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/authMiddleware');



const router = express.Router();

// middleware
router.use(authenticateToken);

//tasks routes

// Create task
router.post('/', taskController.createTask);

// Get all tasks (pagination, filter, sort)
router.get('/', taskController.getTasks);

// Task statistics (must be before :id)
router.get('/statistics', taskController.getTaskStatistics);

// Get single task
router.get('/:id', taskController.getTaskById);

// Update task
router.put('/:id', taskController.updateTask);

// Delete task
router.delete('/:id', taskController.deleteTask);

// add task assignment
router.post('/:id/assign-workers', taskController.addTaskAssignment);

// update task staet
router.patch('/:id/status', taskController.updateTaskStatus);
module.exports = router;

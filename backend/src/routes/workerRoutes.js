const express = require('express');
const { workerController } = require('../controllers/workerController');
const { authenticateToken } = require('../middleware/authMiddleware');

console.log("here worker routes");

const router = express.Router();

// middleware
router.use(authenticateToken);

//workers routes

// Get all tasks (pagination, filter, sort)
router.get('/', workerController.getWorkers);

// Task statistics (must be before :id)
router.get('/statistics', workerController.getWorkerStatistics);

// Get single task
router.get('/:id', workerController.getWorkerById);

// Update task
router.put('/:id', workerController.updateWorker);

// Delete task
router.delete('/:id', workerController.deleteWorker);

// add task assignment
router.post('/:id/assign-task', workerController.assignTaskToWorker);

// unassign task
router.post('/:id/c', workerController.unassignTaskFromWorker);

//get available workers
router.get('/:id/available-workers', workerController.getAvailableWorkersForTask);

module.exports = router;

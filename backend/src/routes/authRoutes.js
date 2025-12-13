const { authController } = require('../controllers/authController.js');
const { authenticateToken } = require('../middleware/authMiddleware.js'); 
const express =  require('express');

const authRoutes = express.Router();

// Public routes
authRoutes.post('/register', authController.Registration);
authRoutes.post('/register-platform-admin', authController.AdminRegistration);
authRoutes.post('/login', authController.UserLogin);

// Protected routes - Add aut!henticateToken middleware
authRoutes.get('/profile', authenticateToken, authController.GetUserProfile);
authRoutes.post('/regenerate-code', authenticateToken, authController.RegenerateJoinCode);
authRoutes.post('/refresh-token', authenticateToken, authController.RefreshToken);

module.exports = authRoutes;
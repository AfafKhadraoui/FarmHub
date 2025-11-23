const { authService } = require("../services/authService.js");
const { validate } = require("../utils/validationHelper.js");

console.log('Validate object:', validate);

const extractRole = (req) => {
  return req.body.role?.toLowerCase();
};

const authController = {
  // register admin and worker
  async Registration(req, res) {
    try {
      const role = extractRole(req);

      if (role === 'admin') {
        const { name, email, password, phone, farmName, location } = req.body;

        const errors = validate.fields(req.body, {
          name: validate.name,
          email: validate.email,
          password: validate.password,
          phone: validate.phone,
          farmName: (val) => validate.required(val, 'Farm name'),
          location: (val) => validate.required(val, 'Location')
        });

        if (errors) {
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: errors
          });
        }

        const result = await authService.registerFarmer({ name, email, password, phone, farmName, location });

        return res.status(201).json({
          success: true,
          message: "Farmer registered successfully",
          data: {
            userId: result.user.id,
            farmId: result.farm.id,
            joinCode: result.farm.joinCode,
            token: result.token,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn
          }
        });

      } else if (role === 'worker') {
        const { name, email, password, phone, joinCode } = req.body;

        const errors = validate.fields(req.body, {
          name: validate.name,
          email: validate.email,
          password: validate.password,
          phone: validate.phone,
          joinCode: validate.joinCode
        });

        if (errors) {
          return res.status(400).json({
            success: false,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: errors
          });
        }

        const result = await authService.registerWorker({ name, email, password, phone, joinCode });

        return res.status(201).json({
          success: true,
          message: "Worker registered successfully",
          data: {
            userId: result.user.id,
            farmId: result.farm.id,
            farmName: result.farm.name,
            token: result.token,
            refreshToken: result.refreshToken,
            expiresIn: result.expiresIn
          }
        });

      } else {
        return res.status(400).json({
          success: false,
          error: 'Invalid role. Must be "admin" or "worker"',
          code: 'INVALID_ROLE'
        });
      }
    } catch (error) {
      const statusCode = error.message.includes('already registered') ? 409 :
        error.message.includes('not found') ? 400 : 400;
      const errorCode = error.message.includes('already registered') ? 'EMAIL_EXISTS' :
        error.message.includes('not found') ? 'INVALID_FARM_CODE' : 'BAD_REQUEST';

      return res.status(statusCode).json({
        success: false,
        error: error.message,
        code: errorCode
      });
    }
  },

  // register platform admin
  async AdminRegistration(req, res) {
    try {
      const { name, email, password, phone } = req.body;

      const errors = validate.fields(req.body, {
        name: validate.name,
        email: validate.email,
        password: validate.password,
        phone: validate.phone
      });

      if (errors) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors
        });
      }

      const result = await authService.registerAdmin({ name, email, password, phone });

      return res.status(201).json({
        success: true,
        message: "Platform admin registered successfully",
        data: {
          userId: result.user.id,
          role: result.user.role,
          token: result.token,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn
        }
      });
    } catch (error) {
      const statusCode = error.message.includes('already registered') ? 409 : 400;
      const errorCode = error.message.includes('already registered') ? 'EMAIL_EXISTS' : 'BAD_REQUEST';

      return res.status(statusCode).json({
        success: false,
        error: error.message,
        code: errorCode
      });
    }
  },

  // login
  async UserLogin(req, res) {
    try {
      const { email, password } = req.body;

      const errors = validate.fields(req.body, {
        email: validate.email,
        password: (val) => validate.required(val, 'Password')
      });

      if (errors) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors
        });
      }

      const result = await authService.login({ email, password });

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          userId: result.user.id,
          role: result.user.role,
          farmId: result.user.farmId,
          farmName: result.user.farm?.name,
          token: result.token,
          refreshToken: result.refreshToken,
          expiresIn: result.expiresIn
        }
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: error.message,
        code: 'INVALID_CREDENTIALS'
      });
    }
  },

  // fetch user data
  async GetUserProfile(req, res) {
    try {
      const userId = req.user.id;
      const result = await authService.getUserProfile(userId);

      return res.status(200).json({
        success: true,
        data: {
          id: result.id,
          name: result.name,
          email: result.email,
          phone: result.phone,
          role: result.role,
          farmId: result.farmId,
          createdAt: result.createdAt,
          farm: result.farm ? {
            id: result.farm.id,
            name: result.farm.name,
            location: result.farm.location,
            joinCode: result.farm.joinCode,
            createdAt: result.farm.createdAt
          } : null
        }
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
        code: 'BAD_REQUEST'
      });
    }
  },

  //logout
  async UserLogout(req, res) {
    try {
      return res.status(200).json({
        success: true,
        message: "Logout successful"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
        code: 'BAD_REQUEST'
      });
    }
  },

  //update user profile
  async UpdateUserProfile(req, res) {
    try {
      const userId = req.user.id;
      const { name, phone } = req.body;

      if (!name && !phone) {
        return res.status(400).json({
          success: false,
          error: 'At least one field (name or phone) is required',
          code: 'VALIDATION_ERROR'
        });
      }

      const errors = {};
      if (name) {
        const nameError = validate.name(name);
        if (nameError) errors.name = nameError;
      }
      if (phone) {
        const phoneError = validate.phone(phone);
        if (phoneError) errors.phone = phoneError;
      }

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: errors
        });
      }

      const result = await authService.updateUserProfile(userId, { name, phone });

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: result
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
        code: 'BAD_REQUEST'
      });
    }
  },
  //regerate join code(only admin)
  async RegenerateJoinCode(req, res) {
    try {
      const farmId = req.user.farmId;

      if (!farmId) {
        return res.status(400).json({
          success: false,
          error: 'User is not associated with a farm',
          code: 'NO_FARM_ASSOCIATED'
        });
      }

      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Only admins can regenerate farm codes',
          code: 'FORBIDDEN'
        });
      }

      const newJoinCode = await authService.regenerateFarmJoinCode(farmId);

      return res.status(200).json({
        success: true,
        message: "Farm code regenerated successfully",
        data: {
          joinCode: newJoinCode
        }
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
        code: 'BAD_REQUEST'
      });
    }
  },

// refresh token 
async RefreshToken(req, res) {
  try {
    const user = req.user; // user extracted from access token
    const result = authService.refreshToken(user);

    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
      code: 'BAD_REQUEST'
    });
  }
}


};

module.exports = { authController };
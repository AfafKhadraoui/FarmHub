const validate = {
  // Email validation
  email(email) {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
  },

  // Password validation (minimum security)
  password(password) {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least 1 number';
    return null;
  },

  // Name validation
  name(name) {
    if (!name) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.length > 100) return 'Name must be less than 100 characters';
    return null;
  },

  // Phone validation 
  phone(phone) {
    if (!phone) return null; 
    const phoneRegex = /^[0-9+\s\-()]{8,20}$/;
    if (!phoneRegex.test(phone)) return 'Invalid phone format';
    return null;
  },

  // Farm code validation
  joinCode(code) {
    if (!code) return 'Join code is required';
    const codeRegex = /^FARM-[A-Z0-9]{6}$/;
    if (!codeRegex.test(code)) return 'Invalid join code format (expected: FARM-XXXXXX)';
    return null;
  },

  fields(data, fieldValidators) {
    const errors = {};
    
    for (const [fieldName, validator] of Object.entries(fieldValidators)) {
      const error = validator(data[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    }
    
    return Object.keys(errors).length > 0 ? errors : null;
  },

  // Generic required field
  required(value, fieldName) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return `${fieldName} is required`;
    }
    return null;
  },

  
};

module.exports = { validate };
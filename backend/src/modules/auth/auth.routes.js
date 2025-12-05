const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const { validateRequest } = require('../../middlewares/validateRequest');
const {
  registerSchema,
  loginSchema,
  refreshSchema,
} = require('./auth.validation');
const { authenticate } = require('../../middlewares/auth');
const { register, login, refreshToken, logout } = require('./auth.controller');

const router = Router();

// More lenient rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, validateRequest(registerSchema), register);
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/refresh', authLimiter, validateRequest(refreshSchema), refreshToken);
router.post('/logout', authenticate, logout);

module.exports = router;



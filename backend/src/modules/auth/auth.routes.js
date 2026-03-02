import { Router } from 'express';
import { authController } from './auth.controller.js';
import {
  emptyBodySchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from './auth.validation.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { attachAuthUser, requireAuth } from '../../middleware/authSession.js';

const router = Router();

router.get('/demo-account', asyncHandler(authController.demoAccount));
router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.post('/guest-login', validate(emptyBodySchema), asyncHandler(authController.loginGuest));
router.post('/logout', attachAuthUser, validate(emptyBodySchema), asyncHandler(authController.logout));
router.get('/me', attachAuthUser, asyncHandler(authController.me));
router.put(
  '/profile',
  attachAuthUser,
  requireAuth,
  validate(updateProfileSchema),
  asyncHandler(authController.updateProfile),
);

export default router;

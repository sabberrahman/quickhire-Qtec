import { Router } from 'express';
import { applicationsController } from './applications.controller.js';
import {
  createApplicationSchema,
  getApplicationByTrackingSchema,
} from './applications.validation.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { attachAuthUser, requireAuth } from '../../middleware/authSession.js';

const router = Router();

router.post(
  '/',
  attachAuthUser,
  validate(createApplicationSchema),
  asyncHandler(applicationsController.create),
);
router.get(
  '/track/:tracking_token',
  attachAuthUser,
  validate(getApplicationByTrackingSchema),
  asyncHandler(applicationsController.getByTrackingToken),
);
router.get(
  '/me',
  attachAuthUser,
  requireAuth,
  asyncHandler(applicationsController.listMyApplications),
);

export default router;

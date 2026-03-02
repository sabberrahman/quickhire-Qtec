import { Router } from 'express';
import { jobsController } from './jobs.controller.js';
import {
  createJobSchema,
  deleteJobSchema,
  getJobByIdSchema,
  getJobsMetaSchema,
  listJobsSchema,
} from './jobs.validation.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { requireAdmin } from '../../middleware/adminAuth.js';

const router = Router();

router.get('/', validate(listJobsSchema), asyncHandler(jobsController.list));
router.get('/meta', validate(getJobsMetaSchema), asyncHandler(jobsController.meta));
router.get('/:id', validate(getJobByIdSchema), asyncHandler(jobsController.getById));
router.post('/', requireAdmin, validate(createJobSchema), asyncHandler(jobsController.create));
router.delete('/:id', requireAdmin, validate(deleteJobSchema), asyncHandler(jobsController.remove));

export default router;

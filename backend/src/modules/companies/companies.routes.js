import { Router } from 'express';
import { companiesController } from './companies.controller.js';
import { getCompanyBySlugSchema, listCompaniesSchema } from './companies.validation.js';
import { validate } from '../../middleware/validate.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();

router.get('/', validate(listCompaniesSchema), asyncHandler(companiesController.list));
router.get('/:slug', validate(getCompanyBySlugSchema), asyncHandler(companiesController.getBySlug));

export default router;

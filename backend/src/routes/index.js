import { Router } from 'express';
import jobsRoutes from '../modules/jobs/jobs.routes.js';
import applicationsRoutes from '../modules/applications/applications.routes.js';
import authRoutes from '../modules/auth/auth.routes.js';
import companiesRoutes from '../modules/companies/companies.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/companies', companiesRoutes);
router.use('/jobs', jobsRoutes);
router.use('/applications', applicationsRoutes);

export default router;

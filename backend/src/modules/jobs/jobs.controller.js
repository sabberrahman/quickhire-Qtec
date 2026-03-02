import { jobsService } from './jobs.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const jobsController = {
  async list(req, res) {
    const data = await jobsService.listJobs(req.validated.query);
    return sendSuccess(res, {
      message: 'Jobs fetched successfully',
      data,
    });
  },

  async getById(req, res) {
    const data = await jobsService.getJobById(req.validated.params.id);
    return sendSuccess(res, {
      message: 'Job details fetched successfully',
      data,
    });
  },

  async meta(_req, res) {
    const data = await jobsService.getJobsMeta();
    return sendSuccess(res, {
      message: 'Jobs metadata fetched successfully',
      data,
    });
  },

  async create(req, res) {
    const data = await jobsService.createJob(req.validated.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Job created successfully',
      data,
    });
  },

  async remove(req, res) {
    await jobsService.deleteJob(req.validated.params.id);
    return sendSuccess(res, {
      message: 'Job deleted successfully',
      data: null,
    });
  },
};

import { jobsRepository } from './jobs.repository.js';
import { AppError } from '../../utils/appError.js';

export const jobsService = {
  async listJobs(filters) {
    const { rows, total } = await jobsRepository.list(filters);

    const page = filters.page || null;
    const limit = filters.limit || null;

    return {
      items: rows,
      pagination: page && limit
        ? {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        }
        : null,
    };
  },

  async getJobById(id) {
    const job = await jobsRepository.findById(id);
    if (!job) {
      throw new AppError('Job not found', 404, [{ field: 'id', message: 'No job exists with this id' }]);
    }
    return job;
  },

  async getJobsMeta() {
    return jobsRepository.getMeta();
  },

  async createJob(payload) {
    return jobsRepository.create(payload);
  },

  async deleteJob(id) {
    const deleted = await jobsRepository.removeById(id);
    if (!deleted) {
      throw new AppError('Job not found', 404, [{ field: 'id', message: 'No job exists with this id' }]);
    }
  },
};

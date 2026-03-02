import { applicationsRepository } from './applications.repository.js';
import { jobsRepository } from '../jobs/jobs.repository.js';
import { AppError } from '../../utils/appError.js';

export const applicationsService = {
  async createApplication(payload, user = null) {
    const job = await jobsRepository.findById(payload.job_id);
    if (!job) {
      throw new AppError('Job not found', 404, [{ field: 'job_id', message: 'Cannot apply to a non-existing job' }]);
    }

    const name = payload.name || user?.name;
    const email = payload.email || user?.email;
    const resumeLink = payload.resume_link || user?.resume_link;

    if (!name || !email || !resumeLink) {
      throw new AppError('Missing applicant details', 400, [
        { field: 'application', message: 'Name, email and resume link are required' },
      ]);
    }

    return applicationsRepository.create({
      job_id: payload.job_id,
      user_id: user?.id || null,
      name,
      email,
      resume_link: resumeLink,
      cover_note: payload.cover_note,
    });
  },

  async getByTrackingToken(trackingToken) {
    const application = await applicationsRepository.findByTrackingToken(trackingToken);
    if (!application) {
      throw new AppError('Application not found', 404, [
        { field: 'tracking_token', message: 'No application exists for this tracking token' },
      ]);
    }

    return application;
  },

  async getMyApplications(userId) {
    return applicationsRepository.listByUserId(userId);
  },
};

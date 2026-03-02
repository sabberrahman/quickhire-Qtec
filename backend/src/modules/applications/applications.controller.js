import { applicationsService } from './applications.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const applicationsController = {
  async create(req, res) {
    const data = await applicationsService.createApplication(req.validated.body, req.user || null);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Application submitted successfully',
      data,
    });
  },

  async getByTrackingToken(req, res) {
    const data = await applicationsService.getByTrackingToken(req.validated.params.tracking_token);
    return sendSuccess(res, {
      message: 'Application status fetched successfully',
      data,
    });
  },

  async listMyApplications(req, res) {
    const data = await applicationsService.getMyApplications(req.user.id);
    return sendSuccess(res, {
      message: 'User applications fetched successfully',
      data,
    });
  },
};

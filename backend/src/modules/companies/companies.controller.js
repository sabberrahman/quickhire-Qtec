import { companiesService } from './companies.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';

export const companiesController = {
  async list(_req, res) {
    const data = await companiesService.listCompanies();
    return sendSuccess(res, {
      message: 'Companies fetched successfully',
      data,
    });
  },

  async getBySlug(req, res) {
    const data = await companiesService.getCompanyBySlug(req.validated.params.slug);
    return sendSuccess(res, {
      message: 'Company fetched successfully',
      data,
    });
  },
};

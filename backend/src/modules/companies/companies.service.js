import { companiesRepository } from './companies.repository.js';
import { AppError } from '../../utils/appError.js';

export const companiesService = {
  async listCompanies() {
    return companiesRepository.list();
  },

  async getCompanyBySlug(slug) {
    const company = await companiesRepository.findBySlug(slug);
    if (!company) {
      throw new AppError('Company not found', 404, [
        { field: 'slug', message: 'No company found for this slug' },
      ]);
    }
    return company;
  },
};

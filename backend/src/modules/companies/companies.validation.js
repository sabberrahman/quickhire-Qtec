import { z } from 'zod';

export const listCompaniesSchema = z.object({
  query: z.any().optional(),
  body: z.any().optional(),
  params: z.any().optional(),
});

export const getCompanyBySlugSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1),
  }),
  query: z.any().optional(),
  body: z.any().optional(),
});

import { z } from 'zod';

export const listJobsSchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    location: z.string().trim().optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
  body: z.any().optional(),
  params: z.any().optional(),
});

export const getJobsMetaSchema = z.object({
  query: z.any().optional(),
  body: z.any().optional(),
  params: z.any().optional(),
});

export const getJobByIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.any().optional(),
  query: z.any().optional(),
});

export const createJobSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1),
    company: z.string().trim().min(1),
    location: z.string().trim().min(1),
    category: z.string().trim().min(1),
    description: z.string().trim().min(1),
    employment_type: z.string().trim().min(1).default('Full Time').optional(),
    company_logo: z.string().trim().max(8).optional(),
    tags: z.array(z.string().trim().min(1)).optional(),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const deleteJobSchema = getJobByIdSchema;

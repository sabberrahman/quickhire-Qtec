import { z } from 'zod';

export const createApplicationSchema = z.object({
  body: z.object({
    job_id: z.string().uuid(),
    name: z.string().trim().min(1).optional(),
    email: z.string().trim().email().optional(),
    resume_link: z.string().trim().url().optional(),
    cover_note: z.string().trim().min(1),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const getApplicationByTrackingSchema = z.object({
  params: z.object({
    tracking_token: z.string().trim().min(8),
  }),
  query: z.any().optional(),
  body: z.any().optional(),
});

import { z } from 'zod';

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long');

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    password: passwordSchema,
    resume_link: z.string().trim().url().optional(),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    resume_link: z.string().trim().url().optional().or(z.literal('')),
  }),
  params: z.any().optional(),
  query: z.any().optional(),
});

export const emptyBodySchema = z.object({
  body: z.object({}).passthrough().optional(),
  params: z.any().optional(),
  query: z.any().optional(),
});

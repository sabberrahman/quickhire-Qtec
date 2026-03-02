import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'QuickHire API',
      version: '1.0.0',
      description: 'Production-ready backend API for jobs and applications.',
    },
    servers: [
      {
        url: '/api',
      },
    ],
    components: {
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { nullable: true },
            errors: {
              type: 'array',
              nullable: true,
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            company: { type: 'string' },
            location: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            employment_type: { type: 'string', example: 'Full Time' },
            company_logo: { type: 'string', nullable: true },
            tags: { type: 'array', items: { type: 'string' } },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateJobRequest: {
          type: 'object',
          required: ['title', 'company', 'location', 'category', 'description'],
          properties: {
            title: { type: 'string', example: 'Frontend Engineer' },
            company: { type: 'string', example: 'Acme Inc.' },
            location: { type: 'string', example: 'Remote' },
            category: { type: 'string', example: 'Engineering' },
            description: { type: 'string', example: 'Build modern web applications.' },
            employment_type: { type: 'string', example: 'Full Time' },
            company_logo: { type: 'string', example: 'A' },
            tags: { type: 'array', items: { type: 'string' }, example: ['React', 'TypeScript'] },
          },
        },
        Application: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            job_id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            resume_link: { type: 'string', format: 'uri' },
            cover_note: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        CreateApplicationRequest: {
          type: 'object',
          required: ['job_id', 'name', 'email', 'resume_link', 'cover_note'],
          properties: {
            job_id: { type: 'string', format: 'uuid' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', format: 'email', example: 'john@example.com' },
            resume_link: { type: 'string', format: 'uri', example: 'https://drive.google.com/file/abc' },
            cover_note: { type: 'string', example: 'I am excited to apply for this role.' },
          },
        },
      },
      securitySchemes: {
        AdminKey: {
          type: 'apiKey',
          in: 'header',
          name: 'x-admin-key',
        },
      },
    },
    paths: {
      '/jobs': {
        get: {
          summary: 'List jobs',
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'location', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          ],
          responses: {
            200: {
              description: 'Jobs fetched',
            },
          },
        },
        post: {
          summary: 'Create a job (admin)',
          security: [{ AdminKey: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateJobRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Job created' },
          },
        },
      },
      '/jobs/{id}': {
        get: {
          summary: 'Get job details',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Job details returned' },
            404: { description: 'Job not found' },
          },
        },
        delete: {
          summary: 'Delete a job (admin)',
          security: [{ AdminKey: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Job deleted' },
            404: { description: 'Job not found' },
          },
        },
      },
      '/applications': {
        post: {
          summary: 'Submit application',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateApplicationRequest' },
              },
            },
          },
          responses: {
            201: { description: 'Application submitted' },
            404: { description: 'Job not found' },
            400: { description: 'Validation error' },
          },
        },
      },
      '/health': {
        get: {
          summary: 'Health status',
          responses: { 200: { description: 'Health info returned' } },
        },
      },
      '/ready': {
        get: {
          summary: 'Readiness check',
          responses: {
            200: { description: 'Service is ready' },
            503: { description: 'Service is not ready' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);

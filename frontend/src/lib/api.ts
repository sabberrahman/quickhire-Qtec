import type {
  ApplicationStatus,
  ApplicationPayload,
  AuthUser,
  Company,
  CompanyDetails,
  CreateJobPayload,
  Job,
  JobsListResponse,
  JobsMetaResponse,
} from '@/types/job';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://quickhire-qtec.onrender.com/api' || 'http://localhost:4000/api';
const ADMIN_API_KEY = import.meta.env.VITE_ADMIN_API_KEY || '';
const SESSION_STORAGE_KEY = 'quickhire_session_token';

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Array<{ field: string; message: string }> | null;
}

interface JobApiModel {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  employment_type: string;
  company_logo: string | null;
  tags: string[];
  created_at: string;
}

interface JobsMetaApiModel {
  total_jobs: number;
  categories: Array<{
    name: string;
    count: number;
  }>;
}

interface AuthUserApiModel {
  id: string;
  name: string;
  email: string;
  resume_link: string | null;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthLoginApiModel {
  user: AuthUserApiModel;
  session_token?: string;
}

interface ApplicationStatusApiModel {
  id: string;
  job_id: string;
  job_title: string;
  job_company: string;
  user_id: string | null;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
  status: 'Submitted' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Hired';
  tracking_token: string;
  status_updated_at: string;
  created_at: string;
}

interface CompanyApiModel {
  id: string;
  name: string;
  slug: string;
  location: string;
  industry: string;
  website: string | null;
  description: string;
  total_employees: number;
  rating: number;
  logo: string | null;
  recent_hiring_count: number;
}

interface CompanyDetailsApiModel extends CompanyApiModel {
  recent_hiring: Array<{
    id: string;
    title: string;
    employment_type: string;
    location: string;
    created_at: string;
  }>;
}

const toFrontendJob = (job: JobApiModel): Job => ({
  id: job.id,
  title: job.title,
  company: job.company,
  companyLogo: job.company_logo || job.company.slice(0, 2),
  location: job.location,
  category: job.category,
  type: job.employment_type,
  description: job.description,
  tags: job.tags || [],
  createdAt: job.created_at,
});

const toAuthUser = (user: AuthUserApiModel): AuthUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  resume_link: user.resume_link,
  is_guest: user.is_guest,
  created_at: user.created_at,
  updated_at: user.updated_at,
});

const toApplicationStatus = (application: ApplicationStatusApiModel): ApplicationStatus => ({
  id: application.id,
  job_id: application.job_id,
  job_title: application.job_title,
  job_company: application.job_company,
  user_id: application.user_id,
  name: application.name,
  email: application.email,
  resume_link: application.resume_link,
  cover_note: application.cover_note,
  status: application.status,
  tracking_token: application.tracking_token,
  status_updated_at: application.status_updated_at,
  created_at: application.created_at,
});

const toCompany = (company: CompanyApiModel): Company => ({
  ...company,
});

const toCompanyDetails = (company: CompanyDetailsApiModel): CompanyDetails => ({
  ...company,
});

export const sessionTokenStore = {
  get: () => localStorage.getItem(SESSION_STORAGE_KEY),
  set: (token: string | null | undefined) => {
    if (!token) {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    localStorage.setItem(SESSION_STORAGE_KEY, token);
  },
  clear: () => {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  },
};

const buildUrl = (path: string, query?: Record<string, string | number | undefined>) => {
  const url = new URL(`${API_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

const request = async <T>(path: string, init?: RequestInit, query?: Record<string, string | number | undefined>): Promise<T> => {
  const sessionToken = sessionTokenStore.get();
  const response = await fetch(buildUrl(path, query), {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(ADMIN_API_KEY ? { 'x-admin-key': ADMIN_API_KEY } : {}),
      ...(sessionToken ? { 'x-session-token': sessionToken } : {}),
      ...(init?.headers || {}),
    },
  });

  const payload = (await response.json()) as ApiEnvelope<T>;

  if (!response.ok || !payload.success) {
    const message = payload.errors?.[0]?.message || payload.message || 'Request failed';
    throw new Error(message);
  }

  return payload.data;
};

export const api = {
  getJobs: async (params?: {
    search?: string;
    category?: string;
    location?: string;
    page?: number;
    limit?: number;
  }): Promise<JobsListResponse> => {
    const data = await request<{ items: JobApiModel[]; pagination: JobsListResponse['pagination'] }>(
      '/jobs',
      undefined,
      {
        search: params?.search,
        category: params?.category,
        location: params?.location,
        page: params?.page,
        limit: params?.limit,
      },
    );

    return {
      items: data.items.map(toFrontendJob),
      pagination: data.pagination,
    };
  },

  getJobById: async (id: string): Promise<Job> => {
    const data = await request<JobApiModel>(`/jobs/${id}`);
    return toFrontendJob(data);
  },

  getJobsMeta: async (): Promise<JobsMetaResponse> => {
    const data = await request<JobsMetaApiModel>('/jobs/meta');
    return {
      totalJobs: data.total_jobs,
      categories: data.categories,
    };
  },

  getCompanies: async (): Promise<Company[]> => {
    const data = await request<CompanyApiModel[]>('/companies');
    return data.map(toCompany);
  },

  getCompanyBySlug: async (slug: string): Promise<CompanyDetails> => {
    const data = await request<CompanyDetailsApiModel>(`/companies/${slug}`);
    return toCompanyDetails(data);
  },

  createJob: async (payload: CreateJobPayload): Promise<Job> => {
    const data = await request<JobApiModel>('/jobs', {
      method: 'POST',
      body: JSON.stringify({
        title: payload.title,
        company: payload.company,
        location: payload.location,
        category: payload.category,
        description: payload.description,
        employment_type: payload.type || 'Full Time',
        company_logo: payload.companyLogo,
        tags: payload.tags || [],
      }),
    });

    return toFrontendJob(data);
  },

  deleteJob: async (id: string): Promise<void> => {
    await request<null>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  },

  createApplication: async (payload: ApplicationPayload): Promise<ApplicationStatus> => {
    const data = await request<ApplicationStatusApiModel>('/applications', {
      method: 'POST',
      body: JSON.stringify({
        job_id: payload.jobId,
        name: payload.name,
        email: payload.email,
        resume_link: payload.resumeLink,
        cover_note: payload.coverNote,
      }),
    });

    return toApplicationStatus(data);
  },

  getApplicationByTrackingToken: async (trackingToken: string): Promise<ApplicationStatus> => {
    const data = await request<ApplicationStatusApiModel>(`/applications/track/${trackingToken}`);
    return toApplicationStatus(data);
  },

  getMyApplications: async (): Promise<ApplicationStatus[]> => {
    const data = await request<ApplicationStatusApiModel[]>('/applications/me');
    return data.map(toApplicationStatus);
  },

  register: async (payload: {
    name: string;
    email: string;
    password: string;
    resume_link?: string;
  }): Promise<AuthUser> => {
    const data = await request<AuthLoginApiModel>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    sessionTokenStore.set(data.session_token);
    return toAuthUser(data.user);
  },

  login: async (payload: { email: string; password: string }): Promise<AuthUser> => {
    const data = await request<AuthLoginApiModel>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    sessionTokenStore.set(data.session_token);
    return toAuthUser(data.user);
  },

  loginGuest: async (): Promise<AuthUser> => {
    const data = await request<AuthLoginApiModel>('/auth/guest-login', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    sessionTokenStore.set(data.session_token);
    return toAuthUser(data.user);
  },

  logout: async (): Promise<void> => {
    await request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    sessionTokenStore.clear();
  },

  getMe: async (): Promise<AuthUser | null> => {
    const data = await request<AuthUserApiModel | null>('/auth/me');
    return data ? toAuthUser(data) : null;
  },

  updateProfile: async (payload: { name: string; resume_link?: string }): Promise<AuthUser> => {
    const data = await request<AuthUserApiModel>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return toAuthUser(data);
  },

  getDemoAccount: async (): Promise<{
    email: string;
    password: string;
    guest_email: string;
    guest_password: string;
  }> => {
    return request('/auth/demo-account');
  },
};

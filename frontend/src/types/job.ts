export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  category: string;
  type: string;
  description: string;
  tags: string[];
  createdAt: string;
}

export interface ApplicationPayload {
  jobId: string;
  name?: string;
  email?: string;
  resumeLink?: string;
  coverNote: string;
}

export interface CreateJobPayload {
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  type?: string;
  companyLogo?: string;
  tags?: string[];
}

export interface JobsListResponse {
  items: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  } | null;
}

export interface JobsMetaResponse {
  totalJobs: number;
  categories: Array<{
    name: string;
    count: number;
  }>;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  resume_link: string | null;
  is_guest: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApplicationStatus {
  id: string;
  job_id: string;
  job_title: string;
  job_company: string;
  user_id: string | null;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
  status: "Submitted" | "Reviewing" | "Shortlisted" | "Rejected" | "Hired";
  tracking_token: string;
  status_updated_at: string;
  created_at: string;
}

export interface Company {
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

export interface CompanyDetails extends Company {
  recent_hiring: Array<{
    id: string;
    title: string;
    employment_type: string;
    location: string;
    created_at: string;
  }>;
}

import { jobs as initialJobs, type Job, type Application } from "./mockData";

// Simple in-memory store for mock CRUD operations
let jobsList: Job[] = [...initialJobs];
let applicationsList: Application[] = [];

export const jobStore = {
  getAll: () => [...jobsList],

  getById: (id: string) => jobsList.find((j) => j.id === id) || null,

  create: (job: Omit<Job, "id" | "createdAt">) => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
    };
    jobsList = [newJob, ...jobsList];
    return newJob;
  },

  delete: (id: string) => {
    jobsList = jobsList.filter((j) => j.id !== id);
  },

  search: (query: string, category?: string, location?: string) => {
    return jobsList.filter((job) => {
      const matchesQuery =
        !query ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        !category || category === "All" || job.category === category;
      const matchesLocation =
        !location || job.location.toLowerCase().includes(location.toLowerCase());
      return matchesQuery && matchesCategory && matchesLocation;
    });
  },
};

export const applicationStore = {
  create: (app: Omit<Application, "id" | "createdAt">) => {
    const newApp: Application = {
      ...app,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    applicationsList = [newApp, ...applicationsList];
    return newApp;
  },

  getAll: () => [...applicationsList],

  getByJobId: (jobId: string) =>
    applicationsList.filter((a) => a.jobId === jobId),
};

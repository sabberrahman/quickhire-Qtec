import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import JobCard from "@/components/JobCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const LatestJobs = () => {
  const { data } = useQuery({
    queryKey: ["jobs", "latest"],
    queryFn: () => api.getJobs({ limit: 16 }),
  });

  const latest = (data?.items || []).slice(8, 16);

  return (
    <section className="bg-secondary/30 py-16 md:py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 500 600" fill="none">
          <path d="M200 0L500 200L300 600" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.3" />
          <path d="M250 50L550 250L350 650" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.2" />
          <path d="M150 -50L450 150L250 550" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.15" />
        </svg>
      </div>
      <div className="container relative z-10">
        <div className="flex items-end justify-between mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Latest <span className="text-primary">jobs open</span>
          </motion.h2>
          <Link to="/jobs" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Show all jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latest.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <JobCard job={job} variant="list" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestJobs;

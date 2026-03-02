import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import JobCard from "@/components/JobCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

const FeaturedJobs = () => {
  const { data } = useQuery({
    queryKey: ["jobs", "featured"],
    queryFn: () => api.getJobs({ limit: 8 }),
  });

  const featured = data?.items || [];

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container">
        <div className="flex items-end justify-between mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured <span className="text-primary">jobs</span>
          </motion.h2>
          <Link to="/jobs" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Show all jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <JobCard job={job} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;

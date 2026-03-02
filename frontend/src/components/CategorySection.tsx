import { Link } from "react-router-dom";
import { ArrowRight, Palette, BarChart3, Megaphone, DollarSign, Monitor, Code, Briefcase, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { defaultCategories } from "@/data/categories";

const iconMap: Record<string, React.ElementType> = {
  Palette, BarChart3, Megaphone, DollarSign, Monitor, Code, Briefcase, Users,
};

const CategorySection = () => {
  const { data } = useQuery({
    queryKey: ["jobs", "meta"],
    queryFn: () => api.getJobsMeta(),
  });

  const categories = useMemo(() => {
    const countMap = new Map((data?.categories || []).map((item) => [item.name, item.count]));
    return defaultCategories.map((item) => ({
      ...item,
      count: countMap.get(item.name) || 0,
    }));
  }, [data]);

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
            Explore by <span className="text-primary">category</span>
          </motion.h2>
          <Link to="/jobs" className="hidden md:flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Show all jobs <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => {
            const Icon = iconMap[cat.icon];
            const isHighlighted = i === 2; // Marketing
            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
              >
                <Link
                  to={`/jobs?category=${cat.name}`}
                  className={`group flex flex-col gap-4 p-7 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                    isHighlighted
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-background border-border hover:border-primary/40"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                    isHighlighted ? "bg-primary-foreground/20" : "bg-primary/10"
                  }`}>
                    {Icon && <Icon className={`w-7 h-7 ${isHighlighted ? "text-primary-foreground" : "text-primary"}`} />}
                  </div>
                  <h3 className={`font-semibold text-lg ${isHighlighted ? "text-primary-foreground" : ""}`}>{cat.name}</h3>
                  <div className={`flex items-center gap-2 text-sm ${isHighlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {cat.count} jobs available <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;

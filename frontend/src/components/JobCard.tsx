import { Link } from "react-router-dom";
import { type Job } from "@/types/job";

const tagColors: Record<string, string> = {
  Marketing: "text-[hsl(var(--tag-marketing))] bg-[hsl(var(--tag-bg-marketing))]",
  Design: "text-[hsl(var(--tag-design))] bg-[hsl(var(--tag-bg-design))]",
  Business: "text-[hsl(var(--tag-business))] bg-[hsl(var(--tag-bg-business))]",
  Technology: "text-[hsl(var(--tag-technology))] bg-[hsl(var(--tag-bg-technology))]",
};

// Company brand colors for logo backgrounds
const companyColors: Record<string, { bg: string; text: string }> = {
  R: { bg: "bg-foreground", text: "text-primary-foreground" },
  D: { bg: "bg-primary", text: "text-primary-foreground" },
  P: { bg: "bg-foreground", text: "text-primary-foreground" },
  B: { bg: "bg-accent", text: "text-accent-foreground" },
  C: { bg: "bg-primary", text: "text-primary-foreground" },
  Ca: { bg: "bg-[hsl(175_60%_60%)]", text: "text-primary-foreground" },
  G: { bg: "bg-accent", text: "text-accent-foreground" },
  T: { bg: "bg-primary", text: "text-primary-foreground" },
  N: { bg: "bg-accent/20", text: "text-accent" },
  Ne: { bg: "bg-primary/20", text: "text-primary" },
  M: { bg: "bg-primary/20", text: "text-primary" },
  Tf: { bg: "bg-primary/20", text: "text-primary" },
  U: { bg: "bg-primary/20", text: "text-primary" },
  Pk: { bg: "bg-destructive/20", text: "text-destructive" },
  W: { bg: "bg-primary", text: "text-primary-foreground" },
};

interface JobCardProps {
  job: Job;
  variant?: "featured" | "list";
}

const JobCard = ({ job, variant = "featured" }: JobCardProps) => {
  const colors = companyColors[job.companyLogo] || { bg: "bg-secondary", text: "text-foreground" };

  if (variant === "list") {
    return (
      <Link
        to={`/jobs/${job.id}`}
        className="flex items-start gap-5 p-5 rounded-lg border border-border hover:border-primary/30 hover:shadow-sm transition-all bg-background group"
      >
        <div className={`w-14 h-14 rounded-lg ${colors.bg} flex items-center justify-center text-sm font-bold ${colors.text} shrink-0`}>
          {job.companyLogo}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base">{job.title}</h4>
          <p className="text-sm text-muted-foreground mt-0.5">{job.company} · {job.location}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">{job.type}</span>
            {job.tags.map((tag) => (
              <span key={tag} className={`text-xs font-medium px-3 py-1 rounded-full border ${tagColors[tag] || "text-muted-foreground bg-muted"}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/jobs/${job.id}`} className="block p-6 rounded-lg border border-border hover:border-primary/30 hover:shadow-md transition-all bg-background group">
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center text-sm font-bold ${colors.text}`}>
          {job.companyLogo}
        </div>
        <span className="text-xs font-semibold border border-primary text-primary px-4 py-1.5 rounded-full">{job.type}</span>
      </div>
      <h4 className="font-semibold text-lg mb-1">{job.title}</h4>
      <p className="text-sm text-muted-foreground mb-4">{job.company} · {job.location}</p>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-5">{job.description}</p>
      <div className="flex flex-wrap gap-2">
        {job.tags.map((tag) => (
          <span key={tag} className={`text-xs font-medium px-3 py-1 rounded-full ${tagColors[tag] || "text-muted-foreground bg-muted"}`}>
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
};

export default JobCard;

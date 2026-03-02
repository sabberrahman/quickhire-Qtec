import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";

const CompanyDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ["company", slug],
    queryFn: () => api.getCompanyBySlug(slug || ""),
    enabled: Boolean(slug),
    retry: false,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-4xl py-12">
          <Link to="/companies" className="text-sm text-muted-foreground hover:underline">Back to companies</Link>

          {isLoading && <p className="mt-4">Loading company...</p>}

          {!isLoading && !data && <p className="mt-4">Company not found.</p>}

          {data && (
            <>
              <div className="mt-6 border border-border rounded-xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-lg">
                    {data.logo || data.name.slice(0, 2)}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{data.name}</h1>
                    <p className="text-muted-foreground">{data.location} · {data.industry}</p>
                  </div>
                </div>

                <p className="mt-5 text-muted-foreground">{data.description}</p>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground">Recent hiring</p>
                    <p className="text-xl font-bold">{data.recent_hiring_count}</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground">Employees</p>
                    <p className="text-xl font-bold">{data.total_employees}</p>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <p className="text-xl font-bold">{data.rating.toFixed(1)}</p>
                  </div>
                </div>

                {data.website && (
                  <a href={data.website} target="_blank" rel="noreferrer" className="inline-block mt-5 text-primary hover:underline">
                    Visit website
                  </a>
                )}
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Recent Hiring</h2>
                <div className="space-y-3">
                  {data.recent_hiring.map((job) => (
                    <Link key={job.id} to={`/jobs/${job.id}`} className="block border border-border rounded-lg p-4 hover:border-primary/40">
                      <p className="font-semibold">{job.title}</p>
                      <p className="text-sm text-muted-foreground">{job.location} · {job.employment_type}</p>
                    </Link>
                  ))}
                  {data.recent_hiring.length === 0 && (
                    <p className="text-muted-foreground">No recent jobs listed.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CompanyDetailPage;

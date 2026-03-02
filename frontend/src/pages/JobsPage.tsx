import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { api } from "@/lib/api";
import { defaultCategories } from "@/data/categories";

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryInput, setQueryInput] = useState(searchParams.get("q") || "");
  const [locationInput, setLocationInput] = useState(searchParams.get("location") || "");

  const query = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const selectedCategory = searchParams.get("category") || "All";

  const { data } = useQuery({
    queryKey: ["jobs", query, location, selectedCategory],
    queryFn: () =>
      api.getJobs({
        search: query || undefined,
        location: location || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
      }),
  });

  const { data: meta } = useQuery({
    queryKey: ["jobs", "meta"],
    queryFn: () => api.getJobsMeta(),
  });

  const filteredJobs = useMemo(() => data?.items || [], [data]);
  const categories = useMemo(
    () => meta?.categories.map((category) => ({ name: category.name })) || defaultCategories,
    [meta],
  );

  const applyParams = (next: { q?: string; location?: string; category?: string }) => {
    const params = new URLSearchParams();

    const nextQ = next.q ?? queryInput;
    const nextLocation = next.location ?? locationInput;
    const nextCategory = next.category ?? selectedCategory;

    if (nextQ) params.set("q", nextQ);
    if (nextLocation) params.set("location", nextLocation);
    if (nextCategory && nextCategory !== "All") params.set("category", nextCategory);

    setSearchParams(params);
  };

  const handleSearch = () => {
    applyParams({ q: queryInput, location: locationInput });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-secondary/50 py-10">
          <div className="container">
            <h1 className="text-3xl font-bold mb-6">
              Find your <span className="text-primary">dream job</span>
            </h1>
            <div className="flex flex-col sm:flex-row bg-background border border-border rounded-lg p-2 gap-2 shadow-sm">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground"
                />
              </div>
              <div className="hidden sm:block w-px bg-border" />
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm flex-1 placeholder:text-muted-foreground"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
          </div>
        </section>

        <section className="border-b border-border">
          <div className="container py-4 overflow-x-auto">
            <div className="flex gap-2">
              <button
                onClick={() => applyParams({ category: "All" })}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === "All" ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => applyParams({ category: cat.name })}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.name ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="container">
            <p className="text-sm text-muted-foreground mb-6">
              Showing <span className="font-semibold text-foreground">{filteredJobs.length}</span> jobs
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
            {filteredJobs.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No jobs found matching your criteria.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default JobsPage;

import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

const CompaniesPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["companies"],
    queryFn: () => api.getCompanies(),
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="py-12">
          <div className="container">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Companies</h1>
            <p className="text-muted-foreground mb-8">
              Explore company profiles, hiring activity, employee size, and ratings.
            </p>

            {isLoading && <p>Loading companies...</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(data || []).map((company) => (
                <div key={company.id} className="border border-border rounded-xl p-5 bg-background">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary font-bold flex items-center justify-center">
                      {company.logo || company.name.slice(0, 2)}
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                      {company.industry}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{company.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{company.location}</p>
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{company.description}</p>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                    <div className="rounded-lg bg-secondary p-2">
                      <p className="text-lg font-bold">{company.recent_hiring_count}</p>
                      <p className="text-[11px] text-muted-foreground">Recent hiring</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-2">
                      <p className="text-lg font-bold">{company.total_employees}</p>
                      <p className="text-[11px] text-muted-foreground">Employees</p>
                    </div>
                    <div className="rounded-lg bg-secondary p-2">
                      <p className="text-lg font-bold">{company.rating.toFixed(1)}</p>
                      <p className="text-[11px] text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  <Link to={`/companies/${company.slug}`} className="block mt-4">
                    <Button variant="outline" className="w-full">View company</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CompaniesPage;

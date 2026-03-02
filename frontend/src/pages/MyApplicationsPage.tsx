import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

const MyApplicationsPage = () => {
  const navigate = useNavigate();
  const { data: me, isLoading: authLoading } = useAuth();
  const { data: applications, isLoading } = useQuery({
    queryKey: ["applications", "me"],
    queryFn: () => api.getMyApplications(),
    enabled: Boolean(me),
  });

  useEffect(() => {
    if (!authLoading && !me) {
      navigate("/login", { replace: true, state: { from: "/my-applications" } });
    }
  }, [authLoading, me, navigate]);

  if (!me) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-4xl py-12">
          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground mb-8">Track the status of your submitted applications.</p>

          {isLoading && <p>Loading...</p>}

          <div className="space-y-4">
            {(applications || []).map((application) => (
              <div key={application.id} className="border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold">{application.job_title}</p>
                  <p className="text-sm text-muted-foreground">
                    {application.job_company} · Status: <span className="font-medium">{application.status}</span>
                  </p>
                </div>
                <Link to={`/applications/track/${application.tracking_token}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            ))}
          </div>

          {applications && applications.length === 0 && (
            <div className="border rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">You have not submitted any applications yet.</p>
              <Link to="/jobs">
                <Button>Browse Jobs</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyApplicationsPage;

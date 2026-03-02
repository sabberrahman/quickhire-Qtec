import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";

const ApplicationStatusPage = () => {
  const { trackingToken } = useParams<{ trackingToken: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["application", "track", trackingToken],
    queryFn: () => api.getApplicationByTrackingToken(trackingToken || ""),
    enabled: Boolean(trackingToken),
    retry: false,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-3xl py-12">
          <h1 className="text-3xl font-bold mb-2">Application Status</h1>
          <p className="text-muted-foreground mb-8">Use this URL anytime to check your application.</p>

          {isLoading && <p>Loading application status...</p>}
          {error && (
            <div className="border rounded-lg p-6">
              <p className="font-semibold">Could not load application</p>
              <p className="text-sm text-muted-foreground mt-1">{(error as Error).message}</p>
            </div>
          )}

          {data && (
            <div className="border rounded-lg p-6 space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">Applied job</p>
                <p className="text-xl font-semibold">{data.job_title}</p>
                <p className="text-sm text-muted-foreground">{data.job_company}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current status</p>
                <p className="text-lg font-semibold">{data.status}</p>
                <p className="text-xs text-muted-foreground">
                  Updated: {new Date(data.status_updated_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">What you wrote</p>
                <p className="whitespace-pre-wrap text-sm">{data.cover_note}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Applicant</p>
                <p className="text-sm">{data.name} · {data.email}</p>
                <a href={data.resume_link} target="_blank" rel="noreferrer" className="text-sm text-primary hover:underline">
                  Open resume link
                </a>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tracking token: {data.tracking_token}</p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Link to="/jobs">
              <Button>Browse more jobs</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ApplicationStatusPage;

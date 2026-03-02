import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: me } = useAuth();
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", resumeLink: "", coverNote: "" });

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: () => api.getJobById(id || ""),
    enabled: Boolean(id),
    retry: false,
  });

  const applyMutation = useMutation({
    mutationFn: () =>
      api.createApplication({
        jobId: job!.id,
        name: form.name || undefined,
        email: form.email || undefined,
        resumeLink: form.resumeLink || undefined,
        coverNote: form.coverNote,
      }),
    onSuccess: (application) => {
      toast.success("Application submitted successfully!");
      navigate(`/applications/track/${application.tracking_token}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">Loading job details...</main>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Job not found</h1>
            <Link to="/jobs" className="text-primary hover:underline text-sm">Back to jobs</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.coverNote) {
      toast.error("Please fill in all required fields");
      return;
    }

    applyMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 md:py-12 max-w-3xl">
          <Link to="/jobs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to jobs
          </Link>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center text-lg font-bold text-foreground shrink-0">
              {job.companyLogo}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
              <p className="text-muted-foreground">{job.company}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-8">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {job.type}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(job.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="prose prose-sm max-w-none mb-8">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{job.description}</p>
            <h3 className="text-lg font-semibold mt-6 mb-2">Category</h3>
            <p className="text-muted-foreground">{job.category}</p>
          </div>

          {!showApply ? (
            <Button size="lg" onClick={() => setShowApply(true)}>Apply Now</Button>
          ) : (
            <div className="border border-border rounded-lg p-6 bg-secondary/30">
              <h3 className="text-lg font-semibold mb-4">Apply for this position</h3>
              {me && (
                <div className="mb-4 rounded-md bg-background border border-border p-3 text-sm">
                  <p className="font-medium">Logged in as {me.name}</p>
                  <p className="text-muted-foreground">You can submit quickly using your profile details.</p>
                  <button
                    type="button"
                    className="text-primary hover:underline mt-1"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        name: me.name,
                        email: me.email,
                        resumeLink: me.resume_link || prev.resumeLink,
                      }))
                    }
                  >
                    Use profile details
                  </button>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name {me ? "(optional if using profile)" : "*"}</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" />
                </div>
                <div>
                  <Label htmlFor="email">Email {me ? "(optional if using profile)" : "*"}</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" />
                </div>
                <div>
                  <Label htmlFor="resume">Resume Link (URL) {me ? "(optional if profile has one)" : "*"}</Label>
                  <Input id="resume" value={form.resumeLink} onChange={(e) => setForm({ ...form, resumeLink: e.target.value })} placeholder="https://drive.google.com/..." />
                </div>
                <div>
                  <Label htmlFor="cover">Cover Note *</Label>
                  <Textarea id="cover" value={form.coverNote} onChange={(e) => setForm({ ...form, coverNote: e.target.value })} placeholder="Why are you a great fit?" rows={4} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={applyMutation.isPending}>Submit Application</Button>
                  <Button type="button" variant="outline" onClick={() => setShowApply(false)}>Cancel</Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobDetailPage;

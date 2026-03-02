import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth, useAuthActions } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { data: me, isLoading } = useAuth();
  const { logout } = useAuthActions();
  const [form, setForm] = useState({
    name: "",
    resume_link: "",
  });

  useEffect(() => {
    if (!isLoading && !me) {
      navigate("/login", { replace: true, state: { from: "/profile" } });
    }
  }, [isLoading, me, navigate]);

  useEffect(() => {
    if (me) {
      setForm({
        name: me.name,
        resume_link: "",
      });
    }
  }, [me]);

  const updateProfile = useMutation({
    mutationFn: api.updateProfile,
    onSuccess: () => toast.success("Profile updated"),
    onError: (error: Error) => toast.error(error.message),
  });

  if (!me) {
    return null;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateProfile.mutate(form);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-2xl py-12 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">Manage your resume and account details.</p>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                logout.mutate(undefined, {
                  onSuccess: () => {
                    toast.success("Logged out");
                    navigate("/", { replace: true });
                  },
                })
              }
            >
              Logout
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="border rounded-lg p-6 space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="resume_link">Resume Link</Label>
              <Input
                id="resume_link"
                type="url"
                value={form.resume_link}
                onChange={(event) => setForm((prev) => ({ ...prev, resume_link: event.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Demo resume:{" "}
                <a href="/Shohanur_Rahman_sabbir_resume.pdf" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  Open demo PDF
                </a>
              </p>
            </div>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </form>

          <div className="flex gap-2">
            <Link to="/my-applications">
              <Button variant="outline">View My Applications</Button>
            </Link>
            <Link to="/jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth, useAuthActions } from "@/hooks/useAuth";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { data: me } = useAuth();
  const { register } = useAuthActions();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    resume_link: "http://localhost:8080/Shohanur_Rahman_sabbir_resume.pdf",
  });

  useEffect(() => {
    if (me) {
      navigate("/profile", { replace: true });
    }
  }, [me, navigate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    register.mutate(form, {
      onSuccess: () => {
        toast.success("Account created");
        navigate("/profile", { replace: true });
      },
      onError: (error: Error) => toast.error(error.message),
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-lg py-12">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-6">Save profile and track your job applications.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                required
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="resume_link">Resume Link (optional)</Label>
              <Input
                id="resume_link"
                type="url"
                value={form.resume_link}
                onChange={(event) => setForm((prev) => ({ ...prev, resume_link: event.target.value }))}
              />
            </div>
            <Button type="submit" className="w-full" disabled={register.isPending}>
              {register.isPending ? "Creating..." : "Register"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            Already have account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;

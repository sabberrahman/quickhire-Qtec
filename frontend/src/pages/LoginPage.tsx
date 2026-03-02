import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth, useAuthActions } from "@/hooks/useAuth";
import { api } from "@/lib/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: me } = useAuth();
  const { login, guestLogin } = useAuthActions();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const redirectTo = (location.state as { from?: string } | null)?.from || "/profile";

  const { data: demoAccount } = useQuery({
    queryKey: ["auth", "demo-account"],
    queryFn: () => api.getDemoAccount(),
  });

  useEffect(() => {
    if (me) {
      navigate(redirectTo, { replace: true });
    }
  }, [me, navigate, redirectTo]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login.mutate(form, {
      onSuccess: () => {
        toast.success("Logged in successfully");
        navigate(redirectTo, { replace: true });
      },
      onError: (error: Error) => toast.error(error.message),
    });
  };

  const quickDemoLogin = () => {
    if (!demoAccount) {
      return;
    }
    setForm({
      email: demoAccount.email,
      password: demoAccount.password,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-lg py-12">
          <h1 className="text-3xl font-bold mb-2">Login</h1>
          <p className="text-muted-foreground mb-6">Access profile, saved resume, and application status.</p>

          <div className="border rounded-lg p-4 bg-secondary/20 mb-6 space-y-2">
            <p className="font-semibold text-sm">Demo access</p>
            <p className="text-xs text-muted-foreground">Email: {demoAccount?.email || "loading..."}</p>
            <p className="text-xs text-muted-foreground">Password: {demoAccount?.password || "loading..."}</p>
            <div className="flex gap-2 pt-1">
              <Button type="button" size="sm" variant="outline" onClick={quickDemoLogin}>
                Fill demo login
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  guestLogin.mutate(undefined, {
                    onSuccess: () => {
                      toast.success("Guest mode enabled");
                      navigate(redirectTo, { replace: true });
                    },
                    onError: (error: Error) => toast.error(error.message),
                  })
                }
              >
                Continue as guest
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              />
            </div>
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? "Logging in..." : "Login"}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground mt-4">
            No account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;

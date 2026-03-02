import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth, useAuthActions } from "@/hooks/useAuth";
import { toast } from "sonner";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: me } = useAuth();
  const { logout } = useAuthActions();

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold">Q</span>
            </div>
            QuickHire
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link to="/jobs" className="hover:text-foreground transition-colors">Find Jobs</Link>
            <Link to="/companies" className="hover:text-foreground transition-colors">Browse Companies</Link>
            {me && <Link to="/my-applications" className="hover:text-foreground transition-colors">My Applications</Link>}
          </nav>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link to="/admin">
            <Button variant="ghost" size="sm" className="text-sm font-medium">Admin</Button>
          </Link>
          {me ? (
            <>
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="text-sm font-medium">{me.name}</Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  logout.mutate(undefined, {
                    onSuccess: () => toast.success("Logged out"),
                  })
                }
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-primary font-semibold text-sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="px-6 font-semibold">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 space-y-3">
          <Link to="/jobs" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Find Jobs</Link>
          <Link to="/companies" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Browse Companies</Link>
          {me && <Link to="/my-applications" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>My Applications</Link>}
          <Link to="/admin" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Admin</Link>
          {me && <Link to="/profile" className="block text-sm font-medium text-muted-foreground" onClick={() => setMobileOpen(false)}>Profile</Link>}
          <div className="flex gap-2 pt-2">
            {me ? (
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() =>
                  logout.mutate(undefined, {
                    onSuccess: () => toast.success("Logged out"),
                  })
                }
              >
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">Login</Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

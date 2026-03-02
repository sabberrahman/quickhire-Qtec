import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { defaultCategories } from "@/data/categories";

const AdminPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company: "",
    companyLogo: "",
    location: "",
    category: "",
    type: "Full Time",
    description: "",
    tags: "",
  });

  const { data } = useQuery({
    queryKey: ["jobs", "admin"],
    queryFn: () => api.getJobs({ limit: 100 }),
  });

  const { data: meta } = useQuery({
    queryKey: ["jobs", "meta"],
    queryFn: () => api.getJobsMeta(),
  });

  const jobsList = data?.items || [];
  const categories = meta?.categories.map((category) => ({ name: category.name })) || defaultCategories;

  const createMutation = useMutation({
    mutationFn: () =>
      api.createJob({
        title: form.title,
        company: form.company,
        companyLogo: form.companyLogo || form.company.charAt(0),
        location: form.location,
        category: form.category,
        type: form.type,
        description: form.description,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      setForm({ title: "", company: "", companyLogo: "", location: "", category: "", type: "Full Time", description: "", tags: "" });
      setShowForm(false);
      toast.success("Job created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      toast.success("Job deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.location || !form.category || !form.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    createMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container py-8 md:py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold">Admin - Manage Jobs</h1>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4 mr-1" /> Add Job
            </Button>
          </div>

          {showForm && (
            <div className="border border-border rounded-lg p-6 mb-8 bg-secondary/30">
              <h3 className="font-semibold text-lg mb-4">Create New Job</h3>
              <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Frontend Developer" />
                </div>
                <div>
                  <Label>Company *</Label>
                  <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="e.g. Google" />
                </div>
                <div>
                  <Label>Location *</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. San Francisco, US" />
                </div>
                <div>
                  <Label>Category *</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full Time">Full Time</SelectItem>
                      <SelectItem value="Part Time">Part Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Marketing, Design" />
                </div>
                <div className="md:col-span-2">
                  <Label>Description *</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Job description..." />
                </div>
                <div className="md:col-span-2 flex gap-2">
                  <Button type="submit" disabled={createMutation.isPending}>Create Job</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </div>
          )}

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Company</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Location</th>
                  <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                  <th className="px-4 py-3 font-medium w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobsList.map((job) => (
                  <tr key={job.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{job.title}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{job.company}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{job.location}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{job.category}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => deleteMutation.mutate(job.id)} className="text-destructive hover:text-destructive/80 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;

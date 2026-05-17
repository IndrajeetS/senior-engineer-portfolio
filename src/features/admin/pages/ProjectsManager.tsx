import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useListProjects
} from "@/features/portfolio/api/portfolio.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Github, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { adminApi } from "../api/admin.api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProjectsManager() {
  const queryClient = useQueryClient();
  const { data: projects, isLoading } = useListProjects();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTechnologies("");
    setGithubUrl("");
    setProjectUrl("");
    setThumbnail(null);
    setThumbnailPreview(null);
    setCategory("");
    setFeatured(false);
    setEditingProject(null);
  };

  const { mutate: createProject, isPending: isCreating } = useMutation({
    mutationFn: adminApi.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project created successfully");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => toast.error(err.message || "Failed to create project"),
  });

  const { mutate: updateProject, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => adminApi.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project updated successfully");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => toast.error(err.message || "Failed to update project"),
  });

  const { mutate: deleteProject } = useMutation({
    mutationFn: adminApi.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Project deleted successfully");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete project"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("technologies", technologies);
    formData.append("category", category);
    formData.append("featured", String(featured));
    if (githubUrl) formData.append("githubUrl", githubUrl);
    if (projectUrl) formData.append("projectUrl", projectUrl);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    if (editingProject) {
      updateProject({ id: editingProject.id || editingProject._id, data: formData });
    } else {
      createProject(formData);
    }
  };

  const handleEdit = (project: any) => {
    setEditingProject(project);
    setTitle(project.title);
    setDescription(project.description);
    setTechnologies(Array.isArray(project.techStack) ? project.techStack.join(", ") : project.technologies || "");
    setGithubUrl(project.githubUrl || "");
    setProjectUrl(project.projectUrl || "");
    setThumbnailPreview(project.thumbnail || null);
    setCategory(project.category || "");
    setFeatured(!!project.featured);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage your portfolio projects.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Technologies (comma separated)</label>
                <Input value={technologies} onChange={(e) => setTechnologies(e.target.value)} placeholder="React, Node.js, TypeScript" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">GitHub URL</label>
                  <Input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Project URL</label>
                  <Input value={projectUrl} onChange={(e) => setProjectUrl(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Web, Mobile, AI..." />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Featured Project
                  </label>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Thumbnail</label>
                {thumbnailPreview && (
                  <div className="relative w-32 aspect-video rounded-md overflow-hidden border">
                    <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setThumbnail(file);
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setThumbnailPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept="image/*"
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isCreating || isUpdating}>
                  {(isCreating || isUpdating) ? <Loader2 className="animate-spin" /> : (editingProject ? "Update" : "Create")}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Links</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Loading projects...</TableCell>
                </TableRow>
              ) : projects?.map((project: any) => (
                <TableRow key={project.id || project._id}>
                  <TableCell>
                    <img src={project.thumbnail} className="w-16 h-10 object-cover rounded border" alt="" />
                  </TableCell>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project?.technologies?.toString().split(",").map((tech: string) => (
                        <Badge key={tech} variant="secondary" className="text-[10px]">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer"><Github size={16} /></a>}
                      {project.projectUrl && <a href={project.projectUrl} target="_blank" rel="noreferrer"><ExternalLink size={16} /></a>}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(project)}>
                        <Pencil size={16} />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the project "{project.title}" and all its data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteProject(project.id || project._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

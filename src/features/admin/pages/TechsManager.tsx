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
import {
  useListTechs
} from "@/features/portfolio/api/portfolio.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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

export default function TechsManager() {
  const queryClient = useQueryClient();
  const { data: techs, isLoading } = useListTechs();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<any>(null);

  // Form State
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setUrl("");
    setThumbnail(null);
    setThumbnailPreview(null);
    setEditingTech(null);
  };

  const { mutate: addTech, isPending: isCreating } = useMutation({
    mutationFn: adminApi.addTech,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techs"] });
      toast.success("Technology added successfully");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => toast.error(err.message || "Failed to add tech"),
  });

  const { mutate: updateTech, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => adminApi.updateTech(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techs"] });
      toast.success("Technology updated successfully");
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (err: any) => toast.error(err.message || "Failed to update tech"),
  });

  const { mutate: deleteTech } = useMutation({
    mutationFn: adminApi.deleteTech,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["techs"] });
      toast.success("Technology deleted successfully");
    },
    onError: (err: any) => toast.error(err.message || "Failed to delete tech"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("url", url);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    if (editingTech) {
      updateTech({ id: editingTech.id || editingTech._id, data: formData });
    } else {
      addTech(formData);
    }
  };

  const handleEdit = (tech: any) => {
    setEditingTech(tech);
    setName(tech.name);
    setUrl(tech.url || "");
    setThumbnailPreview(tech.thumbnail || null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Technologies</h2>
          <p className="text-muted-foreground">Manage your technical skills and tools.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} /> Add Tech
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTech ? "Edit Technology" : "Add New Technology"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">URL (optional)</label>
                <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://reactjs.org" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Icon / Logo</label>
                {thumbnailPreview && (
                  <div className="relative w-16 h-16 rounded-md overflow-hidden border bg-muted/20 p-2">
                    <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-contain" />
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
                  {(isCreating || isUpdating) ? <Loader2 className="animate-spin" /> : (editingTech ? "Update" : "Add")}
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
                <TableHead>Logo</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">Loading technologies...</TableCell>
                </TableRow>
              ) : techs?.map((tech: any) => (
                <TableRow key={tech.id || tech._id}>
                  <TableCell>
                    <img src={tech.thumbnail} className="w-10 h-10 object-contain rounded p-1 bg-muted/20" alt="" />
                  </TableCell>
                  <TableCell className="font-medium">{tech.name}</TableCell>
                  <TableCell>
                    {tech.url ? <a href={tech.url} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm">{tech.url}</a> : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(tech)}>
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
                              This action cannot be undone. This will permanently remove "{tech.name}" from your technical skills.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteTech(tech.id || tech._id)}
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

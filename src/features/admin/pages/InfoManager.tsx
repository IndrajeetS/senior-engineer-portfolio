import { useState, useEffect } from "react";
import { 
  useGetInfo, 
  useGetAbout 
} from "@/features/portfolio/api/portfolio.api";
import { adminApi } from "../api/admin.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

export default function InfoManager() {
  const queryClient = useQueryClient();
  const { data: info } = useGetInfo();
  const { data: about } = useGetAbout();

  // Tab 1: General Info
  const [greeting, setGreeting] = useState("");
  const [greetingSign, setGreetingSign] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);

  useEffect(() => {
    if (info) {
      setGreeting(info.greeting || "");
      setGreetingSign(info.greetingSign || "");
      setName(info.name || "");
      setDesignation(info.designation || "");
    }
  }, [info]);

  const { mutate: updateInfo, isPending: infoUpdating } = useMutation({
    mutationFn: adminApi.updateInfo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["info"] });
      toast.success("Info updated successfully");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update info"),
  });

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("greeting", greeting);
    formData.append("greetingSign", greetingSign);
    formData.append("name", name);
    formData.append("designation", designation);
    if (image) formData.append("image", image);
    if (resume) formData.append("resume", resume);
    updateInfo(formData);
  };

  // Tab 2: About
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutDescription, setAboutDescription] = useState("");
  const [tagline, setTagline] = useState("");
  
  useEffect(() => {
    if (about) {
      setAboutTitle(about.title || "");
      setAboutDescription(about.description || "");
      setTagline(about.tagline || "");
    }
  }, [about]);

  const { mutate: updateAbout, isPending: aboutUpdating } = useMutation({
    mutationFn: adminApi.updateAbout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      toast.success("About section updated successfully");
    },
    onError: (err: any) => toast.error(err.message || "Failed to update about"),
  });

  const handleAboutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAbout({
      title: aboutTitle,
      description: aboutDescription,
      tagline: tagline
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Site Configuration</h2>
        <p className="text-muted-foreground">Manage global site content and information.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="general">General Info</TabsTrigger>
          <TabsTrigger value="about">About Section</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Hero section and profile details.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInfoSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Greeting</label>
                    <Input value={greeting} onChange={(e) => setGreeting(e.target.value)} placeholder="Hello" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Greeting Emoji/Sign</label>
                    <Input value={greetingSign} onChange={(e) => setGreetingSign(e.target.value)} placeholder="👋" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Engineer Name" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Headline / Designation</label>
                  <Input value={designation} onChange={(e) => setDesignation(e.target.value)} placeholder="Full Stack Developer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Profile Image</label>
                    <Input type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} accept="image/*" />
                    {info?.image && <p className="text-[10px] text-muted-foreground">Current: {info.image}</p>}
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Resume (PDF)</label>
                    <Input type="file" onChange={(e) => setResume(e.target.files?.[0] || null)} accept=".pdf" />
                    {info?.resume && <p className="text-[10px] text-muted-foreground">Current: {info.resume}</p>}
                  </div>
                </div>
                <Button type="submit" disabled={infoUpdating} className="gap-2">
                  {infoUpdating ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
              <CardDescription>Main bio and professional summary.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAboutSubmit} className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Section Title</label>
                  <Input value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} placeholder="About Me" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Tagline (Bio Highlight)</label>
                  <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Senior Software Engineer..." />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Full Bio</label>
                  <Textarea 
                    value={aboutDescription} 
                    onChange={(e) => setAboutDescription(e.target.value)} 
                    rows={10} 
                    placeholder="I am a passionate developer..."
                  />
                </div>
                <Button type="submit" disabled={aboutUpdating} className="gap-2">
                  {aboutUpdating ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

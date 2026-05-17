import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGetBlog } from "@/features/portfolio/api/portfolio.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ArrowLeft,
  Bold,
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Redo,
  RotateCcw,
  Save,
  Strikethrough,
  Table as TableIcon,
  Undo,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocation, useRoute } from "wouter";
import { adminApi } from "../api/admin.api";

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30 sticky top-0 z-10">
      {/* History */}
      <div className="flex items-center gap-1 pr-1 border-r mr-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo size={14} />
        </Button>
      </div>

      {/* Formatting */}
      <div className="flex items-center gap-1 pr-1 border-r mr-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold") ? "bg-accent text-accent-foreground" : ""
          }
        >
          <Bold size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic") ? "bg-accent text-accent-foreground" : ""
          }
        >
          <Italic size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={
            editor.isActive("underline")
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <div className="underline text-xs font-bold">U</div>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike") ? "bg-accent text-accent-foreground" : ""
          }
        >
          <Strikethrough size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={
            editor.isActive("highlight")
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <Highlighter size={14} />
        </Button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 pr-1 border-r mr-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" })
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <AlignLeft size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" })
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <AlignCenter size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" })
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <AlignRight size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" })
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <AlignJustify size={14} />
        </Button>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 pr-1 border-r mr-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <Heading1 size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <Heading2 size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <Heading3 size={14} />
        </Button>
      </div>

      {/* Lists & Blocks */}
      <div className="flex items-center gap-1 pr-1 border-r mr-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <List size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <ListOrdered size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={
            editor.isActive("taskList")
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <CheckSquare size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote")
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <Quote size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={
            editor.isActive("codeBlock")
              ? "bg-accent text-accent-foreground"
              : ""
          }
        >
          <Code size={14} />
        </Button>
      </div>

      {/* Tables */}
      <div className="flex items-center gap-1 pr-1 border-r mr-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <TableIcon size={14} />
        </Button>
        {editor.isActive("table") && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-1 text-[10px]"
            >
              Add Col
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-1 text-[10px]"
            >
              Add Row
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="px-1 text-[10px] text-destructive"
            >
              Del Table
            </Button>
          </>
        )}
      </div>

      {/* Media & Others */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={setLink}
          className={
            editor.isActive("link") ? "bg-accent text-accent-foreground" : ""
          }
        >
          <LinkIcon size={14} />
        </Button>
        <Button variant="ghost" size="icon" onClick={addImage}>
          <ImageIcon size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus size={14} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <RotateCcw size={14} />
        </Button>
      </div>
    </div>
  );
};

export default function BlogEditor() {
  const [match, params] = useRoute<{ id: string }>("/blogs/edit/:id");
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const blogId = match && params ? params.id : null;

  const { data: blogResponse, isLoading: isBlogLoading } = useGetBlog(
    blogId || "",
  );
  const blogData = blogResponse?.data;

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl border shadow-lg max-w-full my-8",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert m-5 focus:outline-none min-h-[500px] max-w-none",
      },
    },
  });

  useEffect(() => {
    if (blogData) {
      setTitle(blogData.title || "");
      setExcerpt(blogData.excerpt || "");
      setTags(Array.isArray(blogData.tags) ? blogData.tags : []);
      if (blogData.thumbnail) setThumbnailPreview(blogData.thumbnail);

      if (editor && blogData.content && editor.isEmpty) {
        editor.commands.setContent(blogData.content);
      }
    }
  }, [blogData, editor]);

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { mutate: saveBlog, isPending: isSaving } = useMutation({
    mutationFn: (data: FormData) =>
      blogId ? adminApi.updateBlog(blogId, data) : adminApi.createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success(blogId ? "Blog updated" : "Blog published");
      setLocation("/blogs");
    },
    onError: (err: any) => toast.error(err.message || "Failed to save blog"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", editor.getHTML());
    formData.append("excerpt", excerpt);
    formData.append("tags", tags.join(","));
    if (thumbnail) formData.append("thumbnail", thumbnail);

    saveBlog(formData);
  };

  if (blogId && isBlogLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation("/blogs")}
          >
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {blogId ? "Edit Post" : "New Blog Post"}
            </h2>
            <p className="text-xs text-muted-foreground">
              Article ID: {blogId || "Draft"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setLocation("/blogs")}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="gap-2 px-6"
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            {blogId ? "Update Changes" : "Publish Post"}
          </Button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 xl:grid-cols-4 gap-8"
      >
        <div className="xl:col-span-3 space-y-6">
          {/* Title and Excerpt */}
          <Card className="shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Post Title"
                  required
                  className="text-3xl font-extrabold h-16 border-none shadow-none focus-visible:ring-0 px-0 placeholder:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Brief summary or excerpt (shown on home page cards)"
                  rows={2}
                  className="resize-none border-none shadow-none focus-visible:ring-0 px-0 text-muted-foreground placeholder:opacity-50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Main Editor */}
          <Card className="shadow-sm border-t-4 border-t-primary">
            <div className="bg-muted/10">
              <MenuBar editor={editor} />
            </div>
            <CardContent className="p-0">
              <div className="min-h-[600px] overflow-y-auto bg-card">
                <EditorContent editor={editor} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Cover Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {thumbnailPreview ? (
                <div className="relative group rounded-lg overflow-hidden border bg-muted/20">
                  <img
                    src={thumbnailPreview}
                    alt="Preview"
                    className="w-full aspect-video object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setThumbnail(null);
                        setThumbnailPreview(null);
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 text-muted-foreground bg-muted/5">
                  <ImageIcon size={32} strokeWidth={1} />
                  <p className="text-[10px] text-center">
                    Recommended: 1200x630px
                  </p>
                </div>
              )}
              <Input
                type="file"
                onChange={handleThumbnailChange}
                accept="image/*"
                className="text-xs h-9 cursor-pointer"
              />
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Tags & Taxonomy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 pl-2 pr-1 py-1 rounded-md text-[11px] font-mono border-none bg-primary/10 text-primary"
                  >
                    {tag}
                    <X
                      size={10}
                      className="cursor-pointer hover:bg-primary hover:text-white rounded-full p-0.5"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <p className="text-[10px] text-muted-foreground italic">
                    No tags added yet.
                  </p>
                )}
              </div>
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add a tag..."
                className="h-9 text-xs"
              />
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                <p className="text-[10px] leading-relaxed text-muted-foreground">
                  <strong>Pro Tip:</strong> Press Enter to add a tag. Good tags
                  include technologies, frameworks, or general topics like
                  "career" or "tutorials".
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                SEO Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-xs">
                <span>Reading Time</span>
                <span className="font-mono text-primary">
                  ~{" "}
                  {Math.ceil(
                    (editor?.getText().split(/\s+/).length || 0) / 200,
                  )}{" "}
                  min
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Word Count</span>
                <span className="font-mono text-primary">
                  {editor?.getText().split(/\s+/).length || 0} words
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Images</span>
                <span className="font-mono text-primary">
                  {editor?.getHTML().match(/<img/g)?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

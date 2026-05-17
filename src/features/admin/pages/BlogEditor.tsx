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
  Terminal,
  Undo,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { useLocation, useRoute } from "wouter";
import { adminApi } from "../api/admin.api";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface MenuButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}

const MenuButton = ({ onClick, disabled, active, label, children }: MenuButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClick}
          disabled={disabled}
          className={`h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-200 ${
            active ? "bg-primary/10 text-primary font-bold border border-primary/20" : "text-muted-foreground"
          }`}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top" className="bg-popover text-popover-foreground border shadow-md font-mono text-[10px]">
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openImageModal = () => {
    setImageUrl("");
    setImageModalOpen(true);
  };

  const openLinkModal = () => {
    const currentUrl = editor.getAttributes("link").href || "";
    setLinkUrl(currentUrl);
    setLinkModalOpen(true);
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/30 sticky top-0 z-10">
        {/* History */}
        <div className="flex items-center gap-1 pr-1 border-r mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            label="Undo (Ctrl+Z)"
          >
            <Undo size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            label="Redo (Ctrl+Y)"
          >
            <Redo size={14} />
          </MenuButton>
        </div>

        {/* Formatting */}
        <div className="flex items-center gap-1 pr-1 border-r mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            label="Bold (Ctrl+B)"
          >
            <Bold size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            label="Italic (Ctrl+I)"
          >
            <Italic size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            label="Underline (Ctrl+U)"
          >
            <div className="underline text-xs font-bold leading-none">U</div>
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            label="Strikethrough"
          >
            <Strikethrough size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            active={editor.isActive("highlight")}
            label="Highlight Text"
          >
            <Highlighter size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            label="Inline Code (Ctrl+E)"
          >
            <Code size={14} />
          </MenuButton>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-1 border-r mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            label="Align Left"
          >
            <AlignLeft size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            label="Align Center"
          >
            <AlignCenter size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            label="Align Right"
          >
            <AlignRight size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            active={editor.isActive({ textAlign: "justify" })}
            label="Align Justify"
          >
            <AlignJustify size={14} />
          </MenuButton>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-1 border-r mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            active={editor.isActive("heading", { level: 1 })}
            label="Heading 1"
          >
            <Heading1 size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            label="Heading 2"
          >
            <Heading2 size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            label="Heading 3"
          >
            <Heading3 size={14} />
          </MenuButton>
        </div>

        {/* Lists & Blocks */}
        <div className="flex items-center gap-1 pr-1 border-r mr-1">
          <MenuButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            label="Bullet List"
          >
            <List size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            label="Numbered List"
          >
            <ListOrdered size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            active={editor.isActive("taskList")}
            label="Task List"
          >
            <CheckSquare size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            label="Quote"
          >
            <Quote size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            active={editor.isActive("codeBlock")}
            label="Code Block"
          >
            <Terminal size={14} />
          </MenuButton>
        </div>

        {/* Tables */}
        <div className="flex items-center gap-1 pr-1 border-r mr-1">
          <MenuButton
            onClick={() =>
              editor
                .chain()
                .focus()
                .setParagraph() // 🛡️ Safeguard: Resets heading formatting so table insertion doesn't fail
                .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                .run()
            }
            label="Insert Table"
          >
            <TableIcon size={14} />
          </MenuButton>
          {editor.isActive("table") && (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().addColumnAfter().run()}
                className="px-1.5 h-8 text-[10px] hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Add Col
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().addRowAfter().run()}
                className="px-1.5 h-8 text-[10px] hover:bg-primary/10 hover:text-primary transition-colors"
              >
                Add Row
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().deleteTable().run()}
                className="px-1.5 h-8 text-[10px] text-destructive hover:bg-destructive/10 transition-colors"
              >
                Del Table
              </Button>
            </>
          )}
        </div>

        {/* Media & Others */}
        <div className="flex items-center gap-1">
          <MenuButton
            onClick={openLinkModal}
            active={editor.isActive("link")}
            label="Insert Link"
          >
            <LinkIcon size={14} />
          </MenuButton>
          <MenuButton
            onClick={openImageModal}
            label="Insert Image"
          >
            <ImageIcon size={14} />
          </MenuButton>
          <MenuButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            label="Horizontal Line"
          >
            <Minus size={14} />
          </MenuButton>
          <MenuButton
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
            label="Clear Formatting"
          >
            <RotateCcw size={14} />
          </MenuButton>
        </div>
      </div>

      {/* 🔗 Insert Link Modal */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 space-y-4 relative">
            <button
              type="button"
              onClick={() => setLinkModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
            <div className="space-y-2">
              <h3 className="text-lg font-bold tracking-tight">Insert Hyperlink</h3>
              <p className="text-xs text-muted-foreground">
                Enter the web address you want to link to. Leave empty to clear link.
              </p>
            </div>
            <Input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setLinkModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (linkUrl) {
                    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
                  } else {
                    editor.chain().focus().extendMarkRange("link").unsetLink().run();
                  }
                  setLinkModalOpen(false);
                }}
              >
                Insert Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 🖼️ Insert Image Modal */}
      {imageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 space-y-6 relative">
            <button
              type="button"
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
            <div className="space-y-2">
              <h3 className="text-lg font-bold tracking-tight">Insert Image</h3>
              <p className="text-xs text-muted-foreground">
                Upload a file directly from your device or reference an external web image URL.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-muted-foreground">
                  OPTION A: UPLOAD FROM DEVICE
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-muted/20 hover:bg-primary/5 transition-all group"
                >
                  <ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                  <span className="text-sm font-semibold">Choose image file</span>
                  <span className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP, GIF (Embedded directly)</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (readerEvent) => {
                          const base64Url = readerEvent.target?.result as string;
                          editor.chain().focus().setImage({ src: base64Url }).run();
                          setImageModalOpen(false);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-border/60"></div>
                <span className="flex-shrink mx-4 text-[10px] font-mono text-muted-foreground">OR</span>
                <div className="flex-grow border-t border-border/60"></div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-muted-foreground">
                  OPTION B: WEB IMAGE URL
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.png"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border/60">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setImageModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={!imageUrl}
                onClick={() => {
                  if (imageUrl) {
                    editor.chain().focus().setImage({ src: imageUrl }).run();
                    setImageModalOpen(false);
                  }
                }}
              >
                Add URL Image
              </Button>
            </div>
          </div>
        </div>
      )}
    </TooltipProvider>
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
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert m-5 focus:outline-none min-h-[500px] max-w-none prose-code:before:content-none prose-code:after:content-none prose-code:bg-primary/10 prose-code:text-primary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/60 prose-pre:p-4 prose-hr:border-border/80 prose-hr:my-8",
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

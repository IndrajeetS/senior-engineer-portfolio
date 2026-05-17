import Layout from "@/components/layout/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBlog } from "@/features/portfolio/api/portfolio.api";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import DeltaRenderer from "../components/DeltaRenderer";
import NotFound from "@/features/portfolio/pages/not-found";

export default function BlogDetail() {
  const [match, params] = useRoute<{ id: string }>("/blog/:id");
  const [, setLocation] = useLocation();

  const blogId = match && params ? params.id : "";
  const { data: response, isLoading, isError } = useGetBlog(blogId);
  const blog = response?.data;

  const formattedDate = blog
    ? new Date(blog.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "";

  // 🛡️ Bypasses the details wrapper and renders the full creative 404 terminal page
  if (!isLoading && (isError || !blog)) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 z-10 relative">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-6 w-28 mb-8" />
            <Skeleton className="h-12 w-full mb-4" />
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="h-[360px] w-full rounded-2xl" />
          </div>
        ) : (
          <>
            <button
              onClick={() => setLocation("/")}
              className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-primary transition-colors mb-12 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>BACK TO INSIGHTS</span>
            </button>

            <article>
              <header className="mb-10">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                  {blog.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm font-mono text-muted-foreground border-b border-border/40 pb-6">
                  {/* Neumorphic / Soft UI Styled Thumbnail Wrap */}
                  {blog.thumbnail && (
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted/40 border border-border/50 shadow-inner flex shrink-0 items-center justify-center">
                      {/* <div className="w-full h-full rounded-xl overflow-hidden border border-border/20 shadow-md"> */}
                      <img
                        src={blog.thumbnail}
                        alt=""
                        className="w-full h-full object-cover object-center p-1"
                      />
                      {/* </div> */}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>4 min read</span>
                  </div>
                </div>
              </header>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                <DeltaRenderer contentStr={blog.content} />
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <footer className="mt-16 pt-6 border-t border-border/40">
                  <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="font-mono text-xs font-semibold text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </footer>
              )}
            </article>
          </>
        )}
      </div>
    </Layout>
  );
}

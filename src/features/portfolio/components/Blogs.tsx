import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";
import { useLocation } from "wouter"; // Fixed: Swapped react-router-dom hook out for wouter
import { useListBlogs } from "../api/portfolio.api";

function stripDeltaJson(deltaStr: string): string {
  try {
    const ops = JSON.parse(deltaStr);
    if (!Array.isArray(ops)) return "";

    return ops
      .map((op) => {
        if (op.attributes?.["code-block"] || op.attributes?.header) return " ";
        return op.insert || "";
      })
      .join("")
      .replace(/\\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  } catch (e) {
    return deltaStr || "";
  }
}

export default function Blogs() {
  const { data: blogsResponse, isLoading } = useListBlogs();
  const [, setLocation] = useLocation(); // Native wouter imperative router navigate callback hook

  if (isLoading) {
    return (
      <section id="blogs" className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <Skeleton className="h-10 w-48 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-[360px] w-full rounded-2xl" />
            <Skeleton className="h-[360px] w-full rounded-2xl" />
            <Skeleton className="h-[360px] w-full rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  const blogs =
    blogsResponse && "data" in blogsResponse
      ? (blogsResponse as any).data
      : blogsResponse || [];

  if (blogs.length === 0) {
    return null;
  }

  return (
    <section
      id="blogs"
      className="py-24 bg-background relative overflow-hidden"
    >
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-tight">
            <span className="text-primary mr-2">05.</span> Articles & Insights
          </h2>
          <div className="w-20 h-1.5 bg-primary rounded-full"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog: any, index: number) => {
            const cleanExcerpt = stripDeltaJson(blog.content);
            const formattedDate = new Date(blog.createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              },
            );

            return (
              <motion.article
                key={blog.id || blog._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setLocation(`/blog/${blog.id || blog._id}`)}
                className="bg-card border border-border/40 rounded-2xl overflow-hidden flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] transition-all duration-300 cursor-pointer group relative"
              >
                {/* Header Row */}
                <div className="flex items-center justify-between p-6 md:p-8 pb-4">
                  {/* Neumorphic "Soft UI" Rounded Avatar Border Container */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted/40 border border-border/50 shadow-inner flex shrink-0 items-center justify-center">
                    {blog.thumbnail ? (
                      <img
                        src={blog.thumbnail}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <BookOpen className="w-6 h-6 text-muted-foreground/40" />
                    )}
                  </div>

                  {/* Date Badge */}
                  <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/40 border border-border/30 px-3 py-1 rounded-full">
                    <Calendar className="w-3.5 h-3.5 text-primary/70" />
                    <span>{formattedDate}</span>
                  </div>
                </div>

                {/* Main Content Info Area */}
                <div className="px-6 md:px-8 pb-6 md:pb-8 flex flex-col grow">
                  <h3 className="text-xl font-bold mb-3 tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  <p className="text-muted-foreground text-sm grow leading-relaxed line-clamp-4 mb-6">
                    {cleanExcerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/20">
                    <div className="flex flex-wrap gap-1.5 max-w-[85%]">
                      {blog.tags &&
                        blog.tags.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="font-mono text-[10px] tracking-wider font-semibold text-primary/80 bg-primary/5 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    <span className="text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1 duration-300">
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

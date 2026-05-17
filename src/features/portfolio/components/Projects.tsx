import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, Folder, Github } from "lucide-react";
import { useMemo, useState } from "react";

import { useListProjects } from "../api/portfolio.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper function to dynamically infer a project category based on its technologies string
function inferCategory(techList: string[] | undefined): string {
  if (!techList || techList.length === 0) return "Web";

  // Combine all tech words into a lowercase search string
  const combinedTechs = techList.join(", ").toLowerCase();

  if (combinedTechs.includes("flutter web")) return "Full Stack";
  if (
    combinedTechs.includes("flutter") ||
    combinedTechs.includes("dart") ||
    combinedTechs.includes("sqflite")
  )
    return "Mobile";
  if (
    combinedTechs.includes("node") ||
    combinedTechs.includes("ruby") ||
    combinedTechs.includes("postgres") ||
    combinedTechs.includes("rest api")
  )
    return "Backend";
  if (
    combinedTechs.includes("wordpress") ||
    combinedTechs.includes("html5") ||
    combinedTechs.includes("tailwind")
  )
    return "Web";

  return "Other";
}

export default function Projects() {
  const { data: allProjects, isLoading } = useListProjects();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Dynamically map and categorize the real API data payload
  const { featuredProjects, otherProjects, categories } = useMemo(() => {
    if (!allProjects || !Array.isArray(allProjects)) {
      return { featuredProjects: [], otherProjects: [], categories: ["all"] };
    }

    // Map your API names safely onto your UI keys without mutating raw backend inputs
    const normalizedProjects = allProjects.map((p) => {
      const dynamicCategory = inferCategory(p.techStack);

      // Separate tags out of single-string elements safely: ["Flutter, Dart"] -> ["Flutter", "Dart"]
      const structuralTechnologies =
        p.techStack && p.techStack[0]
          ? p.techStack[0].split(",").map((tech: string) => tech.trim())
          : [];

      return {
        id: p.id || Math.random().toString(),
        title: p.title,
        description: p.description,
        imageUrl: p.thumbnail, // Maps API "thumbnail" onto UI "imageUrl"
        liveUrl: p.projectUrl, // Maps API "projectUrl" onto UI "liveUrl"
        githubUrl: p.githubUrl,
        technologies: structuralTechnologies,
        category: dynamicCategory,
        featured:
          p.title?.toLowerCase().includes("management") ||
          p.title?.toLowerCase().includes("portfolio"), // Dynamic fallback flag assignment matching logic
      };
    });

    const featured = normalizedProjects.filter((p) => p.featured);
    const nonFeatured = normalizedProjects.filter((p) => !p.featured);

    // Auto-generate categories based on the live dynamic data pipeline results
    const uniqueCategories = [
      "all",
      ...Array.from(new Set(normalizedProjects.map((p) => p.category))),
    ];

    return {
      featuredProjects: featured,
      otherProjects: nonFeatured,
      categories: uniqueCategories,
    };
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return otherProjects;
    return otherProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory, otherProjects]);

  if (isLoading) {
    return (
      <section id="projects" className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <Skeleton className="h-10 w-48 mb-12" />
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Skeleton className="h-[400px] w-full rounded-xl" />
            <Skeleton className="h-[400px] w-full rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-tight">
            <span className="text-primary mr-2">03.</span> Featured Work
          </h2>
          <div className="w-20 h-1.5 bg-primary rounded-full"></div>
        </motion.div>

        {/* Featured Projects */}
        <div className="space-y-32 mb-32">
          {featuredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col ${
                i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"
              } gap-12 items-center relative group`}
            >
              <div className="w-full md:w-3/5 relative">
                <div className="overflow-hidden rounded-2xl border border-border/50 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-[300px] md:h-[450px] object-cover transition-all duration-700 filter group-hover:brightness-110"
                    />
                  ) : (
                    <div className="w-full h-[300px] md:h-[450px] bg-muted/30 flex items-center justify-center">
                      <Folder className="w-20 h-20 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
              </div>

              <div
                className={`w-full md:w-2/5 flex flex-col ${
                  i % 2 === 1 ? "md:items-start" : "md:items-end"
                } ${i % 2 === 1 ? "md:text-left" : "md:text-right"}`}
              >
                <span className="text-primary font-mono text-sm font-semibold tracking-widest uppercase mb-2">
                  Featured Project
                </span>
                <h3 className="text-3xl font-bold mb-6 text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {project.title}
                </h3>

                <div className="bg-card/80 backdrop-blur-sm border border-border/50 p-8 rounded-2xl shadow-xl mb-6 w-full z-10 transition-all group-hover:shadow-primary/5">
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {project.description}
                  </p>
                </div>

                <div
                  className={`flex flex-wrap gap-2 mb-8 ${i % 2 === 1 ? "justify-start" : "md:justify-end"}`}
                >
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-xs text-primary/80 bg-primary/5 px-2.5 py-1 rounded-md"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-6">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-muted-foreground hover:text-primary transition-all hover:scale-110"
                    >
                      <ExternalLink className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Noteworthy Projects Grid */}
        <div className="mt-40 text-center">
          <h3 className="text-3xl font-bold mb-12 tracking-tight">
            Other Noteworthy Projects
          </h3>

          <Tabs
            defaultValue="all"
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="w-full flex flex-col items-center mb-12"
          >
            <TabsList className="bg-muted/40 p-1 rounded-full border border-border/50">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="rounded-full px-6 capitalize font-mono text-xs"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card border border-border/40 rounded-2xl p-7 flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all group"
                >
                  <div className="flex justify-between items-center mb-8">
                    <Folder className="w-10 h-10 text-primary/70 group-hover:text-primary transition-colors" />
                    <div className="flex gap-4">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-muted-foreground text-sm grow mb-8 leading-relaxed line-clamp-4">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="font-mono text-[10px] text-muted-foreground/80 bg-muted/60 px-2 py-0.5 rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

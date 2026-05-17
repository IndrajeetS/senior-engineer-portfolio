import { useListTechs } from "@/features/portfolio/api/portfolio.api";
import { motion } from "framer-motion";
import { Code } from "lucide-react";

export default function Skills() {
  const { data: techs, isLoading, error } = useListTechs();

  if (isLoading) {
    return (
      <section id="skills" className="py-16 bg-muted/20">
        <div className="w-full px-4 md:px-8">
          <div className="h-40 bg-muted rounded-3xl animate-pulse w-full" />
        </div>
      </section>
    );
  }

  if (error || !techs || techs.length === 0) {
    return null;
  }

  return (
    <section
      id="skills"
      className="relative w-full py-16 overflow-hidden bg-muted/20"
    >
      {/* Side Depth Mask Layers */}
      {/* <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 md:w-32 bg-linear-to-r from-background via-background/80 to-transparent" />

      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 md:w-32 bg-linear-to-l from-background via-background/80 to-transparent" /> */}

      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-10 flex flex-col items-center justify-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 shadow-sm">
            <Code className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              Technologies & Tools
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Skills & Stack
          </h2>

          <p className="mt-3 max-w-2xl text-sm md:text-base text-muted-foreground">
            Technologies, frameworks, and tools I use to build scalable,
            performant, and modern applications.
          </p>
        </div>

        {/* Responsive Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          className="
            grid
            grid-cols-4
            sm:grid-cols-4
            md:grid-cols-4
            lg:grid-cols-8
            xl:grid-cols-10
            2xl:grid-cols-15
            gap-4
            md:gap-4
            w-full
          "
        >
          {techs.map((tech, index) => (
            <motion.a
              key={tech.id || index}
              href={tech.url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="group relative overflow-hidden rounded-2xl border border-border/60 
              bg-card/80 backdrop-blur-sm p-4 md:p-5 shadow-sm transition-all duration-300 
              hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5
              "
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="absolute -top-10 right-0 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
              </div>

              <div className="relative z-10 flex flex-col items-center justify-center text-center">
                {/* Icon */}
                <div
                  className="
                    mb-4
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-muted/50
                    transition-all
                    duration-300
                    group-hover:scale-105
                    group-hover:bg-primary/10
                  "
                >
                  {tech.thumbnail ? (
                    <img
                      src={tech.thumbnail}
                      alt={tech.name}
                      loading="lazy"
                      className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <Code className="h-6 w-6 text-muted-foreground group-hover:text-primary" />
                  )}
                </div>

                {/* Name */}
                <h3
                  className="
                    text-sm
                    md:text-base
                    font-semibold
                    text-foreground
                    transition-colors
                    duration-300
                    group-hover:text-primary
                    wrap-break-word
                  "
                >
                  {tech.name}
                </h3>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
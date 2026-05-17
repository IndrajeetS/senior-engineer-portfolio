import SocialLinks from "@/components/layout/SocialLinks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetInfo } from "@/features/portfolio/api/portfolio.api";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Download, FileText, MapPin, X } from "lucide-react";

export default function Hero() {
  // Fetch dynamic info datasets live from the backend API
  const { data: info, isLoading, isError } = useGetInfo();

  // Hardcoded social links fallback since they aren't provided by the /info schema
  const hardcodedSocialLinks = [
    {
      platform: "LinkedIn",
      url: import.meta.env.VITE_SOCIAL_LINKEDIN || "https://www.linkedin.com/",
    },
    {
      platform: "GitHub",
      url: import.meta.env.VITE_SOCIAL_GITHUB || "https://github.com/"
    },
    {
      platform: "Email",
      url: import.meta.env.VITE_SOCIAL_EMAIL || `mailto:${import.meta.env.VITE_ENGINEER_EMAIL || "engineer@example.com"}`
    },
  ];

  // Loading skeleton layout match
  if (isLoading) {
    return (
      <section
        id="hero"
        className="min-h-screen flex items-center bg-background"
      >
        <div className="container mx-auto px-4 md:px-8 w-full animate-pulse space-y-6">
          <div className="h-4 w-32 bg-muted rounded" />
          <div className="h-16 w-3/4 max-w-xl bg-muted rounded" />
          <div className="h-8 w-1/2 max-w-md bg-muted rounded" />
          <div className="h-20 w-2/3 max-w-lg bg-muted rounded" />
        </div>
      </section>
    );
  }

  // Graceful Error fallback configuration
  if (isError || !info) {
    return (
      <section
        id="hero"
        className="min-h-screen flex items-center justify-center text-destructive font-mono text-sm"
      >
        Failed to pull layout configurations. Please reload page.
      </section>
    );
  }

  // Composite complete name cleanly using returned dynamic fields
  const fullName = `${info.greeting} ${info.greetingSign}`.trim();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center relative overflow-hidden pt-0 xl:min-h-[800px]"
    >
      <div className="container mx-auto px-4 md:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Metadata content area */}
          <motion.div
            className="flex flex-col gap-6 order-2 lg:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 text-primary font-mono text-sm"
            >
              <span className="w-8 h-px bg-primary inline-block" />
              <span>HELLO WORLD, I'M</span>
            </motion.div>

            {/* Live Name Mapping */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground"
            >
              {fullName || import.meta.env.VITE_ENGINEER_NAME || "John Doe"}
            </motion.h1>

            {/* Live Role Headline Mapping */}
            <motion.div variants={itemVariants}>
              <h2 className="text-2xl md:text-3xl text-muted-foreground font-medium">
                {info.name || "Senior Software Engineer"}
              </h2>
            </motion.div>

            {/* Live Professional Designation Mapping */}
            <motion.p
              variants={itemVariants}
              className="text-lg text-foreground/80 max-w-lg leading-relaxed"
            >
              {info.designation}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 text-muted-foreground text-sm font-mono"
            >
              <MapPin className="w-4 h-4" />
              <span>Bengaluru, India</span>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 mt-4"
            >
              <Button size="lg" className="font-semibold" asChild>
                <a href="#projects">
                  View Work <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>

              {/* Dynamic live Cloudinary resume asset download connection with Preview Popup */}
              {info.resume && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" variant="outline" className="gap-2">
                      <Download className="w-4 h-4" /> Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl w-[90vw] h-[90vh] flex flex-col p-0 overflow-hidden border-border bg-background [&>button]:hidden">
                    <DialogHeader className="p-4 border-b flex flex-row items-center justify-between">
                      <DialogTitle className="font-mono text-primary flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        RESUME_PREVIEW.pdf
                      </DialogTitle>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" asChild className="h-9 w-9 p-0" title="Download PDF">
                          <a href={info.resume} download target="_blank" rel="noreferrer">
                            <Download className="w-4 h-4" />
                          </a>
                        </Button>
                        <DialogClose asChild>
                          <Button size="sm" variant="ghost" className="h-9 w-9 p-0" title="Close">
                            <X className="w-4 h-4" />
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogHeader>
                    <div className="flex-1 bg-muted/30 relative">
                      <iframe
                        src={`${info.resume}#toolbar=0`}
                        className="w-full h-full border-none"
                        title="Resume Preview"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 mt-8 mb-8"
            >
              <SocialLinks links={hardcodedSocialLinks} variant="icon" />
            </motion.div>
          </motion.div>

          {/* Cloudinary Hosted Profile Image Card */}
          <motion.div
            className="flex justify-center lg:justify-end order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative w-52 h-52 md:w-96 md:h-96">
              <div className="absolute inset-0 border-2 border-primary rounded-2xl rotate-6 transition-transform hover:rotate-12 duration-500" />
              <div className="absolute inset-0 bg-card rounded-2xl overflow-hidden -rotate-6 transition-transform hover:rotate-0 duration-500 border border-border">
                {info.image && (
                  <img
                    src={info.image}
                    alt={fullName}
                    className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

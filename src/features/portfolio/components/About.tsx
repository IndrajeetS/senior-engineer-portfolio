import { useGetAbout } from "@/features/portfolio/api/portfolio.api";
import { motion } from "framer-motion";

export default function About() {
  // Fetch real data using your react-query client hook
  const { data: profile, isLoading, error } = useGetAbout();

  // Loading State
  if (isLoading) {
    return (
      <section id="about" className="py-24 relative">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-48 bg-muted rounded"></div>
            <div className="h-4 w-full max-w-2xl bg-muted rounded mt-8"></div>
            <div className="h-4 w-5/6 max-w-xl bg-muted rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error State
  if (error || !profile) {
    return (
      <section id="about" className="py-24 relative">
        <div className="container mx-auto px-4 md:px-8 text-center text-destructive">
          <p>Failed to load profile information. Please try again later.</p>
        </div>
      </section>
    );
  }

  // Helper function to map your API's numerical icons (like "61286") to recognizable characters/emojis
  const getIcon = (iconCode) => {
    switch (iconCode) {
      case "61286":
        return "🌐"; // Website Development
      case "62086":
        return "📱"; // App Development
      case "61278":
        return "☁️"; // Website Hosting
      default:
        return "⚡";
    }
  };


  // Hardcoded fallback tagline matching your professional background
  const fallbackTagline =
    "Senior Flutter Engineer | Mobile Architecture & Performance";

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            <span className="text-primary mr-2">01.</span> About me
          </h2>
          <div className="w-20 h-1 bg-primary rounded"></div>
        </motion.div>
        {/* Content Layout Grid */}
        <div className="grid md:grid-cols-12 gap-12 items-start">
          {/* Stepper Timeline Column (using dynamic API timeline data) */}
          {profile.timeline && profile.timeline.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-5"
            >
              <div className="relative border-l-2 border-muted pl-6 space-y-8 ml-3">
                {profile.timeline.map((item, index) => (
                  <motion.div
                    key={item._id || index}
                    className="relative group"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {/* Stepper Dot with Dynamic Icon */}
                    <div className="absolute -left-[37px] top-0 bg-background border-2 border-primary rounded-full w-7 h-7 flex items-center justify-center text-xs shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                      {getIcon(item.icon)}
                    </div>

                    {/* Stepper Item Card */}
                    <div className="bg-muted/40 hover:bg-muted/70 border border-border/50 p-4 rounded-lg transition-colors duration-200">
                      <p className="text-sm text-muted-foreground font-mono mb-1">
                        Step 0{index + 1}
                      </p>
                      <h4 className="text-base font-semibold text-foreground">
                        {item.description}
                      </h4>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Main Bio Text Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-7 prose prose-lg dark:prose-invert max-w-none"
          >
            <div className="text-xl md:text-2xl text-foreground font-medium mb-6 leading-relaxed border-l-4 border-primary pl-6 py-2 italic bg-muted/30">
              "{profile.tagline || fallbackTagline}"
            </div>

            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed mb-8">
              {profile.description}
            </p>

            {/* <div className="mt-8 flex gap-4 flex-wrap">
              <SocialLinks links={hardcodedSocialLinks} variant="button" />
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

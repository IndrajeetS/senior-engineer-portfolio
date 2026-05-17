import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Briefcase, Calendar, ChevronRight } from "lucide-react";

// Updated matching your resume profile records
const experiences = [
  {
    id: "champsoft",
    role: "Software Engineer",
    company: "ChampSoft",
    logoUrl: "",
    startDate: "May 2023",
    endDate: "Present", // Currently serving 45-day notice period as of April 2026
    current: true,
    description:
      "Own complex features end-to-end, resolve performance bottlenecks, and drive pragmatic architectural decisions for high-performance applications.",
    highlights: [
      "Architected a scalable map-based system using Mapbox, implementing custom clustering logic to handle high-density data with smooth rendering performance.",
      "Developed and deployed an event-driven social media platform from scratch using Flutter, Firebase, and Cloud Functions through to TestFlight distribution.",
      "Owned application state architecture using Riverpod and BLoC, reducing unnecessary widget rebuilds and improving UI consistency.",
      "Optimized CI/CD pipelines and release workflows, reducing deployment turnaround time by approximately 40%.",
      "Guided and mentored junior developers, establishing code review standards and improving team onboarding efficiency.",
    ],
    technologies: [
      "Flutter",
      "Dart",
      "Firebase",
      "Riverpod",
      "BLoC",
      "Mapbox",
      "Cloud Functions",
      "CI/CD",
      "TestFlight",
    ],
  },
  {
    id: "era-interfaces",
    role: "Senior Frontend Developer",
    company: "ERA Interfaces",
    logoUrl: "",
    startDate: "Nov 2019",
    endDate: "Apr 2023",
    current: false,
    description:
      "Designed and delivered user-centric, cross-platform enterprise software solutions maintaining exceptional frontend architecture standards.",
    highlights: [
      "Designed and delivered a cross-platform Learning Management System (LMS) using Flutter for Android and iOS.",
      "Developed reusable widget libraries and modular components, increasing cross-team development velocity.",
      "Collaborated with backend teams to define API contracts and ensure reliable data synchronization.",
    ],
    technologies: [
      "Flutter",
      "Dart",
      "REST API",
      "UI Component Libraries",
      "Android",
      "iOS",
    ],
  },
  {
    id: "marmeto",
    role: "Shopify Frontend Developer",
    company: "Marmeto",
    logoUrl: "",
    startDate: "Dec 2018",
    endDate: "Oct 2019",
    current: false,
    description:
      "Developed and optimized e-commerce storefronts focusing heavily on client-facing load speeds and responsive web structures.",
    highlights: [
      "Improved frontend performance, reducing page load times by approximately 25%.",
      "Developed customized e-commerce storefront web layouts matching precise design layouts.",
    ],
    technologies: [
      "Liquid",
      "JavaScript",
      "SCSS",
      "Shopify",
      "Web Optimization",
    ],
  },
];

export default function Experience() {
  if (!experiences) {
    return (
      <section id="experience" className="py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="h-10 w-48 bg-muted rounded mb-12 animate-pulse"></div>
          <div className="space-y-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-24 relative">
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            <span className="text-primary mr-2">02.</span> Experience
          </h2>
          <div className="w-20 h-1 bg-primary rounded"></div>
        </motion.div>

        {/* Timeline main container border */}
        <div className="relative border-l-2 border-border pl-6 md:pl-10 space-y-12">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Timeline dot (Fixed alignment): 
                Uses negative left positioning offsets to shift perfectly onto the left parent border axis.
              */}
              <div className="absolute left-[-33px] md:left-[-51px] top-1.5 w-4 h-4 rounded-full bg-background border-4 border-primary group-hover:bg-primary transition-colors duration-300 z-10"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground flex items-center gap-3">
                    {exp.role}
                    {exp.logoUrl && (
                      <img
                        src={exp.logoUrl}
                        alt={exp.company}
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                  </h3>
                  <div className="text-lg text-primary font-medium flex items-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4" /> {exp.company}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-mono bg-card px-3 py-1.5 rounded-md border border-border w-fit h-fit">
                  <Calendar className="w-4 h-4" />
                  {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                </div>
              </div>

              <p className="text-foreground/80 mb-4 leading-relaxed">
                {exp.description}
              </p>

              {exp.highlights && exp.highlights.length > 0 && (
                <ul className="space-y-2 mb-6">
                  {exp.highlights.map((highlight, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-muted-foreground"
                    >
                      <ChevronRight className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="font-mono text-xs"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

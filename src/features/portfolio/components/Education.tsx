import { motion } from "framer-motion";
import { Award, Calendar, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Hardcoded data from resume records
const educationList = [
  {
    id: "1",
    degree: "Bachelor of Technology",
    field: "Computer Science",
    institution: "Vel Tech University",
    location: "Chennai",
    startYear: "2015", // Adjust years based on your actual timeline
    endYear: "2019",
    current: false,
    gpa: "N/A", // Add your GPA here if needed
    achievements: [
      "Specialized in Software Engineering and Mobile Development",
      "Participated in various technical symposiums and hackathons",
    ],
  },
];

export default function Education() {
  // Loading state removed since data is now local

  return (
    <section id="education" className="py-24 relative">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            <span className="text-primary mr-2">05.</span> Education
          </h2>
          <div className="w-20 h-1 bg-primary rounded"></div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {educationList.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 shadow-sm hover:border-primary/50 transition-colors overflow-hidden group">
                <div className="h-2 w-full bg-gradient-to-r from-primary/40 to-primary"></div>
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3 bg-muted rounded-xl text-primary group-hover:bg-primary/10 transition-colors">
                      <GraduationCap className="w-8 h-8" />
                    </div>
                    <div className="flex items-center gap-2 text-sm font-mono bg-muted/50 px-3 py-1 rounded-full text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" />
                      {edu.startYear} - {edu.current ? "Present" : edu.endYear}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{edu.degree}</h3>
                  <div className="text-lg text-primary font-medium mb-4">
                    {edu.institution}
                  </div>

                  <p className="text-muted-foreground mb-6">
                    Field of study:{" "}
                    <span className="font-semibold text-foreground">
                      {edu.field}
                    </span>
                    {edu.gpa !== "N/A" && edu.gpa && (
                      <span>
                        {" "}
                        • GPA: <span className="font-mono">{edu.gpa}</span>
                      </span>
                    )}
                  </p>

                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Award className="w-4 h-4" /> Achievements
                      </h4>
                      <ul className="space-y-2">
                        {edu.achievements.map((achievement, i) => (
                          <li
                            key={i}
                            className="text-sm text-foreground/80 flex items-start gap-2"
                          >
                            <span className="text-primary mt-1">•</span>{" "}
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

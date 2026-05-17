import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

// Hardcoded testimonial data matching the schema you provided
const testimonials = [
  {
    id: 1,
    name: "Kiran",
    role: "CTO",
    company: "ThinkStartups",
    content:
      "He is a highly skilled Flutter developer with a keen eye for detail. He has been instrumental in building our core mobile application and ensuring a seamless user experience.",
    avatarUrl: null,
    rating: 5,
    linkedinUrl: import.meta.env.VITE_SOCIAL_LINKEDIN || "https://www.linkedin.com/",
  },
  {
    id: 2,
    name: "Tarun",
    role: "Engineering Manager",
    company: "Jio Platforms Limited",
    content:
      `${import.meta.env.VITE_ENGINEER_NAME?.split(" ")[0] || "The engineer"} is a reliable and proactive engineer who takes ownership of his work. His contributions to the project were significant, and he always goes the extra mile to deliver quality results.`,
    avatarUrl: null,
    rating: 5,
    linkedinUrl: import.meta.env.VITE_SOCIAL_LINKEDIN || "https://www.linkedin.com/",
  },
  {
    id: 3,
    name: "Aman Jha",
    role: "Senior Software Engineer",
    company: "Jio Platforms Limited",
    content:
      "It was great working with him. He is a team player and has good problem-solving skills.",
    avatarUrl: null,
    rating: 5,
    linkedinUrl: import.meta.env.VITE_SOCIAL_LINKEDIN || "https://www.linkedin.com/",
  },
];

export default function Testimonials() {
  if (!testimonials) {
    return (
      <section id="testimonials" className="py-24 bg-primary/5">
        <div className="container mx-auto px-4 md:px-8">
          <div className="h-10 w-48 bg-muted rounded mb-12 animate-pulse"></div>
          <div className="flex gap-6 animate-pulse overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[350px] h-64 bg-muted rounded-xl"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="testimonials"
      className="py-24 bg-primary/5 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center flex flex-col items-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono">
            <span className="text-primary mr-2">06.</span> Recommendations
          </h2>
          <div className="w-20 h-1 bg-primary rounded"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full bg-card/80 backdrop-blur-sm border-border hover:border-primary/30 transition-colors shadow-lg relative">
                <Quote className="absolute top-6 right-6 w-12 h-12 text-primary/10" />
                <CardContent className="p-8 flex flex-col h-full">
                  {testimonial.rating && (
                    <div className="flex gap-1 mb-6 text-yellow-500">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ),
                      )}
                    </div>
                  )}

                  <p className="text-muted-foreground italic mb-8 grow relative z-10 leading-relaxed text-lg">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-4 mt-auto pt-6 border-t border-border/50">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      {testimonial.avatarUrl ? (
                        <AvatarImage
                          src={testimonial.avatarUrl}
                          alt={testimonial.name}
                        />
                      ) : null}
                      <AvatarFallback className="font-mono bg-primary/10 text-primary">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="font-bold text-foreground">
                        {testimonial.linkedinUrl ? (
                          <a
                            href={testimonial.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            {testimonial.name}
                          </a>
                        ) : (
                          testimonial.name
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {testimonial.role} @{" "}
                        <span className="text-primary/80">
                          {testimonial.company}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

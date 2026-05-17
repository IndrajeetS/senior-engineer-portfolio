import { useGetAbout } from "@/features/portfolio/api/portfolio.api";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && end > 0) {
      let start = 0;
      const duration = 2000;
      const stepTime = Math.max(Math.abs(Math.floor(duration / end)), 10);

      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) {
          clearInterval(timer);
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [end, isInView]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsBar() {
  const { data: profile } = useGetAbout();

  const statItems = profile?.stats || [
    { description: "Years Experience", count: "7", sign: "+" },
    { description: "Projects Completed", count: "12", sign: "+" },
    { description: "Companies", count: "3", sign: "" },
    { description: "Technologies", count: "15", sign: "+" },
    { description: "OS Contributions", count: "20", sign: "+" },
  ];

  return (
    <section id="stats" className="py-16 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {statItems.map((stat, i) => (
            <motion.div
              key={stat.description}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center group"
            >
              <div className="text-4xl md:text-5xl font-mono font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                <CountUp end={parseInt(stat.count) || 0} suffix={stat.sign} />
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium uppercase tracking-wider">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-[padding,box-shadow,border-color] duration-300 border-b border-transparent ${isScrolled
        ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-3"
        : "bg-transparent py-5"
        }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        <a
          href="/"
          className="flex items-center gap-3 text-xl font-bold font-mono tracking-tighter text-primary cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground transform group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-primary/20">
            {import.meta.env.VITE_ENGINEER_NAME?.split(" ").map((n: string) => n[0]).join("") || "IS"}
          </div>
          <span className="hidden sm:inline-block font-sans tracking-normal">
            {import.meta.env.VITE_ENGINEER_NAME || "Engineer"}
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="md:flex items-center space-x-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="relative rounded-full w-10 h-10 cursor-pointer overflow-hidden hover:bg-primary/10 transition-colors duration-200"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={resolvedTheme}
                initial={{ y: 20, rotate: 45, opacity: 0 }}
                animate={{ y: 0, rotate: 0, opacity: 1 }}
                exit={{ y: -20, rotate: -45, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                className="flex items-center justify-center w-full h-full"
              >
                {resolvedTheme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-500 fill-amber-500/20" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-500 fill-indigo-500/10" />
                )}
              </motion.div>
            </AnimatePresence>
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}

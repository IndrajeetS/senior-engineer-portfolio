import { ADMIN_LOGIN_PATH } from "@/constants/paths";
import React, { useEffect } from "react";
import { useLocation } from "wouter";
import BackToTop from "./BackToTop";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  mainClassName?: string;
}

export default function Layout({
  children,
  mainClassName = "py-32",
}: LayoutProps) {
  const [, setLocation] = useLocation();

  // ✅ Reset scroll position instantly to the top-left when any view mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  // 🔐 Secret Door: Global Keyboard Shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        setLocation(ADMIN_LOGIN_PATH);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 flex flex-col justify-between">
      <Navigation />
      <main
        className={`grow bg-background relative overflow-hidden ${mainClassName}`}
      >
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        {children}
      </main>
      <footer className="py-8 text-center text-muted-foreground font-mono text-sm border-t border-border bg-card/20">
        <p className="mt-2 text-primary/60">
          <span
            className="cursor-default select-none transition-colors hover:text-primary"
            onClick={(e) => {
              // 🔐 Secret Door: Triple click the copyright symbol to access login
              if (e.detail === 3) {
                setLocation(ADMIN_LOGIN_PATH);
              }
            }}
            title="Secret Access"
          >
            ©
          </span>{" "}
          {new Date().getFullYear()} {import.meta.env.VITE_ENGINEER_NAME || "Engineer"}
        </p>
      </footer>
      <BackToTop />
    </div>
  );
}

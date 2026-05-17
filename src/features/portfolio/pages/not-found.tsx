import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CornerDownRight, Home, Mail, Sparkles, Terminal } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();
  const [currentPath, setCurrentPath] = useState("");
  const [typedCommand, setTypedCommand] = useState("");
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [activeTab, setActiveTab] = useState<"error" | "diagnostics">("error");

  useEffect(() => {
    setCurrentPath(window.location.pathname);

    // Simulate terminal typing effect for the initial command
    const targetCommand = `npm run dev --resolve-path="${window.location.pathname}"`;
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < targetCommand.length) {
        setTypedCommand(prev => prev + targetCommand[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#09090b] text-zinc-100 p-4 md:p-8 font-sans antialiased overflow-hidden">
      {/* Dynamic particles in background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-[#18181b]/95 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden relative"
      >
        {/* macOS Style Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#121214] border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            <Terminal className="w-3 h-3" />
            <span>zsh — guest@indrajeet-space: ~404</span>
          </div>
          <div className="w-12" /> {/* spacer */}
        </div>

        {/* Tab Selector */}
        <div className="flex bg-[#0f0f11] border-b border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab("error")}
            className={`px-4 py-2 border-r border-zinc-800 transition-colors ${activeTab === "error" ? "bg-[#18181b] text-primary border-t-2 border-t-primary" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            shell_output.log
          </button>
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`px-4 py-2 border-r border-zinc-800 transition-colors ${activeTab === "diagnostics" ? "bg-[#18181b] text-primary border-t-2 border-t-primary" : "text-zinc-500 hover:text-zinc-300"}`}
          >
            diagnostics.json
          </button>
        </div>

        {/* Terminal screen content */}
        <div className="p-6 font-mono text-sm leading-relaxed min-h-[320px]">
          {activeTab === "error" ? (
            <div className="space-y-4">
              <div>
                <span className="text-emerald-500">guest@indrajeet-space</span>
                <span className="text-zinc-500"> : ~ $ </span>
                <span className="text-zinc-200">{typedCommand}</span>
                <span className="animate-pulse font-bold text-primary">|</span>
              </div>

              {typedCommand.length >= 20 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <p className="text-zinc-500 font-semibold mt-2">&gt; indrajeet-portfolio@4.0.4 dev</p>
                  <p className="text-zinc-500">&gt; vite-router --resolve-route="{currentPath}"</p>

                  <div className="p-3 bg-red-950/20 border border-red-900/50 rounded-lg text-red-400 mt-2 space-y-1">
                    <p className="font-bold">[Router Error] HTTP_STATUS_404: ROUTE_NOT_FOUND</p>
                    <p className="text-xs text-red-500/80">The requested controller path was not found in registered routes.</p>
                  </div>

                  <div className="text-zinc-400 mt-4 space-y-1">
                    <p className="text-zinc-500 font-bold">Stack Trace:</p>
                    <p className="text-xs flex items-center gap-1"><CornerDownRight className="w-3 h-3 text-zinc-600" /> at Router.resolve (<span className="text-zinc-500">src/App.tsx:34:10</span>)</p>
                    <p className="text-xs flex items-center gap-1"><CornerDownRight className="w-3 h-3 text-zinc-600" /> at RequestHandler.handle (<span className="text-zinc-500">src/main.tsx:12:5</span>)</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-2">
                    <p className="text-yellow-500/90 font-bold">💡 Dynamic Suggestions:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <button
                        onClick={() => setLocation("/")}
                        className="flex items-center gap-2 p-2 rounded bg-zinc-900 border border-zinc-800 hover:border-primary/50 text-left hover:text-primary transition-all group"
                      >
                        <span className="text-primary font-bold">01.</span>
                        <span>git checkout stable (Home)</span>
                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>

                      <button
                        onClick={() => setLocation("/#contact")}
                        className="flex items-center gap-2 p-2 rounded bg-zinc-900 border border-zinc-800 hover:border-primary/50 text-left hover:text-primary transition-all group"
                      >
                        <span className="text-primary font-bold">02.</span>
                        <span>npm run ping (Contact)</span>
                        <ArrowRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 font-mono text-zinc-300 text-xs"
            >
              <pre className="text-primary/95 leading-relaxed bg-[#0f0f11] p-4 rounded-lg overflow-x-auto border border-zinc-800/60">
                {JSON.stringify(
                  {
                    status: 404,
                    error: "Not Found",
                    requestedPath: currentPath,
                    timestamp: new Date().toISOString(),
                    environment: "production",
                    server: "Netlify-Edge-Worker",
                    diagnostics: {
                      connection: "ONLINE",
                      dnsLookup: "SUCCESS",
                      isVaildDomain: true,
                      hasSecretKey: false,
                    },
                    message: "It seems you've wandered into uncompiled airspace.",
                  },
                  null,
                  2
                )}
              </pre>

              <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                <div className="flex items-center gap-2 text-xs">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span>Looking for secrets? Try checking the footer copyright.</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowEasterEgg(!showEasterEgg)}
                  className="font-mono text-[10px] h-7 px-2 hover:bg-zinc-800"
                >
                  {showEasterEgg ? "hide_hint" : "reveal_hint"}
                </Button>
              </div>

              {showEasterEgg && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-primary text-xs"
                >
                  <strong>💡 Decryption Key:</strong> Pressing <code>Ctrl + Shift + L</code> (or triple-clicking <code>©</code> in the footer) will open the secure admin door. Shh! Keep it confidential.
                </motion.div>
              )}
            </motion.div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 bg-[#121214] border-t border-zinc-800 flex flex-wrap gap-3 items-center justify-between">
          <span className="text-xs text-zinc-500 font-mono">
            Process exited with code 404
          </span>
          <div className="flex gap-2">
            <Link href="/">
              <Button size="sm" variant="outline" className="border-zinc-800 bg-[#09090b] text-zinc-300 hover:text-white hover:bg-zinc-900 gap-2">
                <Home className="w-4 h-4" /> Go Home
              </Button>
            </Link>
            <Link href="/#contact">
              <Button size="sm" className="gap-2">
                <Mail className="w-4 h-4" /> Reach Out
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

import { useEffect, useRef, useState, type JSX } from "react";
import { Check, Copy } from "lucide-react";
import { createRoot } from "react-dom/client";

interface DeltaRendererProps {
  contentStr: string;
}

export default function DeltaRenderer({ contentStr }: DeltaRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scan for all pre blocks inside our rendered content container
    const preElements = containerRef.current.querySelectorAll("pre");
    preElements.forEach((pre) => {
      if (pre.dataset.processed === "true") return;
      pre.dataset.processed = "true";

      // 🎨 Premium Styling overrides for the code block container
      pre.style.position = "relative";
      pre.classList.add(
        "group",
        "overflow-hidden",
        "rounded-2xl",
        "border",
        "border-border/60",
        "bg-muted/30",
        "dark:bg-muted/20",
        "p-5",
        "pt-10", // Extra top padding to make room for badge & button headers
        "my-6",
        "shadow-sm",
        "font-mono",
        "text-sm",
        "leading-relaxed",
        "overflow-x-auto",
      );

      const codeElement = pre.querySelector("code");
      const codeText = codeElement ? codeElement.innerText : pre.innerText;

      // 🏷️ Detect programming language class if present (e.g. language-dart)
      let language = "";
      if (codeElement) {
        const langClass = Array.from(codeElement.classList).find((c) =>
          c.startsWith("language-"),
        );
        if (langClass) {
          language = langClass.replace("language-", "").toUpperCase();
        }
      }

      // Render language tag on top-left
      if (language) {
        const langBadge = document.createElement("div");
        langBadge.className =
          "absolute top-3 left-4 text-[10px] font-mono font-bold tracking-widest text-muted-foreground/60 select-none pointer-events-none";
        langBadge.innerText = language;
        pre.appendChild(langBadge);
      }

      // Create a mount point container for the Copy Button
      const btnContainer = document.createElement("div");
      btnContainer.className =
        "absolute top-2.5 right-3 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 z-10";
      pre.appendChild(btnContainer);

      // Render the sleek CopyButton component using React 18 createRoot
      const root = createRoot(btnContainer);

      const CopyButton = () => {
        const [copied, setCopied] = useState(false);
        const handleCopy = async () => {
          try {
            await navigator.clipboard.writeText(codeText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error("Failed to copy code to clipboard", err);
          }
        };

        return (
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-background/90 hover:bg-primary text-foreground hover:text-primary-foreground border border-border shadow-sm text-xs font-mono font-bold transition-all duration-200"
          >
            {copied ? (
              <>
                <Check size={11} className="text-emerald-500" />
                <span className="text-[10px]">COPIED</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span className="text-[10px]">COPY</span>
              </>
            )}
          </button>
        );
      };

      root.render(<CopyButton />);
    });
  }, [contentStr]);

  if (!contentStr) return null;

  const trimmed = contentStr.trim();

  // Try parsing as JSON Delta if it looks like JSON
  if (
    (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
    (trimmed.startsWith("{") && trimmed.endsWith("}"))
  ) {
    try {
      const ops = JSON.parse(contentStr);
      if (Array.isArray(ops)) {
        let currentCodeBlock: string[] = [];
        const elements: React.ReactNode[] = [];

        ops.forEach((op, index) => {
          const text = op.insert;
          if (typeof text !== "string") return;

          const attrs = op.attributes || {};

          // Multi-line code block analyzer
          if (attrs["code-block"]) {
            currentCodeBlock.push(text);
            if (
              index === ops.length - 1 ||
              !ops[index + 1]?.attributes?.["code-block"]
            ) {
              elements.push(
                <pre
                  key={`code-${index}`}
                  className="bg-muted p-5 rounded-xl border border-border/60 font-mono text-sm my-6 overflow-x-auto leading-relaxed shadow-inner"
                >
                  <code className="text-foreground/90">
                    {currentCodeBlock.join("")}
                  </code>
                </pre>,
              );
              currentCodeBlock = [];
            }
            return;
          }

          // Flush dangling elements cleanly
          if (currentCodeBlock.length > 0) {
            elements.push(
              <pre
                key={`code-${index}`}
                className="bg-muted p-5 rounded-xl border border-border/60 font-mono text-sm my-6 overflow-x-auto shadow-inner"
              >
                <code>{currentCodeBlock.join("")}</code>
              </pre>,
            );
            currentCodeBlock = [];
          }

          // Dynamic header mapping handler matrix
          if (attrs.header) {
            const hLevel = attrs.header; // 1 to 6
            const headerSizes: Record<number, string> = {
              1: "text-3xl md:text-4xl font-extrabold mt-8 mb-4",
              2: "text-2xl md:text-3xl font-bold mt-7 mb-3",
              3: "text-xl md:text-2xl font-bold mt-6 mb-2",
              4: "text-lg md:text-xl font-semibold mt-5 mb-2",
              5: "text-base md:text-lg font-semibold mt-4 mb-1",
              6: "text-sm md:text-base font-semibold mt-4 mb-1",
            };

            const hClass = `${headerSizes[hLevel] || "text-xl"} tracking-tight text-foreground`;
            const Tag = `h${hLevel}` as keyof JSX.IntrinsicElements;

            elements.push(
              <Tag key={index} className={hClass}>
                {text.replace(/\n/g, "")}
              </Tag>,
            );
            return;
          }

          // Standard inline paragraph text rendering loop
          if (text.trim() || text === "\n") {
            if (attrs.code) {
              elements.push(
                <code
                  key={index}
                  className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 font-mono text-xs text-primary mx-1"
                >
                  {text}
                </code>,
              );
            } else {
              elements.push(
                <span
                  key={index}
                  className={`${attrs.bold ? "font-bold text-foreground" : ""} ${attrs.italic ? "italic" : ""} text-muted-foreground leading-relaxed whitespace-pre-wrap`}
                >
                  {text}
                </span>,
              );
            }
          }
        });

        return (
          <div ref={containerRef} className="space-y-2 mt-4">
            {elements}
          </div>
        );
      }
    } catch (err) {
      // If parsing fails, fall back to rendering as HTML below
    }
  }

  // Fallback to rendering as HTML inside tailwind typography
  return (
    <div
      ref={containerRef}
      className="prose dark:prose-invert max-w-none prose-pre:bg-muted prose-pre:p-5 prose-pre:rounded-xl prose-pre:border prose-pre:border-border/60 prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1 prose-code:rounded prose-hr:border-border/80 prose-hr:my-8"
      dangerouslySetInnerHTML={{ __html: contentStr }}
    />
  );
}

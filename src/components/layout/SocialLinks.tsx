import { Github, Linkedin, Mail, Twitter } from "lucide-react";

export interface SocialLink {
  platform: string;
  url: string;
}

interface SocialLinksProps {
  links: SocialLink[];
  variant?: "button" | "icon";
}

export default function SocialLinks({
  links,
  variant = "button",
}: SocialLinksProps) {
  if (!links || links.length === 0) return null;

  return (
    <>
      {links.map((link, index) => {
        const platformKey = link.platform.toLowerCase();

        // Pick proper size based on your layout design preferences
        const iconSizeClass = variant === "icon" ? "w-5 h-5" : "w-4 h-4";

        const iconMap: Record<string, React.ReactNode> = {
          github: <Github className={iconSizeClass} />,
          linkedin: <Linkedin className={iconSizeClass} />,
          twitter: <Twitter className={iconSizeClass} />,
          email: <Mail className={iconSizeClass} />,
        };

        const currentIcon = iconMap[platformKey] || null;

        if (variant === "icon") {
          return (
            <a
              key={`${link.platform}-${index}`}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              aria-label={link.platform}
            >
              {currentIcon}
            </a>
          );
        }

        // Default 'button' variant layout used in the About panel
        return (
          <a
            key={`${link.platform}-${index}`}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted hover:bg-primary hover:text-primary-foreground transition-colors border border-border"
          >
            {currentIcon}
            <span className="font-medium text-sm">{link.platform}</span>
          </a>
        );
      })}
    </>
  );
}

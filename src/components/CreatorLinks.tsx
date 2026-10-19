import { EXTERNAL_LINKS } from "../lib/externalLinks";
import { ExternalLink } from "./ExternalLink";

export function CreatorLinks({ className = "" }: { className?: string }) {
  return (
    <div className={`creator-links ${className}`}>
      <ExternalLink
        href={EXTERNAL_LINKS.portfolio}
        label="Visit Archel Taneka’s portfolio"
        className="portfolio-link"
      >
        Portfolio
      </ExternalLink>
      <ExternalLink
        href={EXTERNAL_LINKS.github}
        label="View Peak Unemployment on GitHub"
      >
        GitHub
      </ExternalLink>
    </div>
  );
}

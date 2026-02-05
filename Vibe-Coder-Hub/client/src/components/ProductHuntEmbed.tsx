import type { Project } from "@shared/schema";

interface ProductHuntEmbedProps {
  project: Project;
}

export function ProductHuntEmbed({ project }: ProductHuntEmbedProps) {
  return (
    <div 
      className="rounded-lg border border-card-border bg-card p-5"
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-muted border border-card-border">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.name}
              className="w-full h-full object-cover"
              data-testid={`img-embed-${project.id}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
              <span className="text-2xl font-bold text-primary">
                {project.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 
            className="m-0 text-lg font-semibold text-foreground leading-tight truncate"
            data-testid={`text-embed-name-${project.id}`}
          >
            {project.name}
          </h3>
          <p 
            className="mt-1 text-sm text-muted-foreground leading-snug line-clamp-2"
            data-testid={`text-embed-tagline-${project.id}`}
          >
            {project.tagline}
          </p>
        </div>
      </div>
      
      {project.productHuntUrl && (
        <a
          href={project.productHuntUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-[#FF6154] text-white no-underline rounded-lg text-sm font-semibold hover:bg-[#FF6154]/90 transition-colors"
          data-testid={`link-ph-embed-${project.id}`}
        >
          Check it out on Product Hunt
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </a>
      )}
    </div>
  );
}

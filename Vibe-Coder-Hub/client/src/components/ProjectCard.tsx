import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductHuntEmbed } from "./ProductHuntEmbed";
import { RevenueChart } from "./RevenueChart";
import type { Project, RevenueData } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  revenueData?: RevenueData[];
  index: number;
}

export function ProjectCard({ project, revenueData = [], index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="overflow-hidden bg-card border-card-border hover-elevate">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Product Hunt Style Embed Section */}
          <div className="p-6 border-b md:border-b-0 md:border-r border-card-border">
            <ProductHuntEmbed project={project} />
            
            {/* Additional Links */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {project.websiteUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  asChild
                >
                  <a 
                    href={project.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    data-testid={`link-website-${project.id}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Visit Website
                  </a>
                </Button>
              )}
              
              {project.category && (
                <span className="px-3 py-1 text-xs font-mono bg-primary/10 text-primary rounded-md border border-primary/20">
                  {project.category}
                </span>
              )}
            </div>
          </div>

          {/* Revenue Chart Section */}
          <div className="p-6 bg-card/50">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Stripe Revenue
              </span>
            </div>
            
            {revenueData && revenueData.length > 0 ? (
              <RevenueChart data={revenueData} />
            ) : (
              <div className="h-24 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center">
                    <span className="text-xs font-mono text-muted-foreground">$</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">No revenue data</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

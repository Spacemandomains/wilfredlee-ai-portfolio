import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { ProjectCard } from "@/components/ProjectCard";
import { StatsSection } from "@/components/StatsSection";
import { ConferenceSection } from "@/components/ConferenceSection";
import { Footer } from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project, RevenueData } from "@shared/schema";

interface ProjectWithRevenue extends Project {
  revenueData: RevenueData[];
}

interface StatsData {
  totalRevenue: number;
  projectCount: number;
  launchCount: number;
  customerCount: number;
}

function ProjectSkeleton() {
  return (
    <div className="rounded-lg border border-card-border bg-card overflow-hidden">
      <div className="grid md:grid-cols-2 gap-0">
        <div className="p-6 border-b md:border-b-0 md:border-r border-card-border">
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-16 rounded-lg" />
            <div className="flex-1">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-1" />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <div className="p-6">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: projectsData, isLoading: projectsLoading } = useQuery<{ projects: ProjectWithRevenue[] }>({
    queryKey: ["/api/projects"],
  });

  const { data: statsData, isLoading: statsLoading } = useQuery<StatsData>({
    queryKey: ["/api/stats"],
  });

  const projects = projectsData?.projects || [];
  const stats = statsData || {
    totalRevenue: 0,
    projectCount: 0,
    launchCount: 0,
    customerCount: 0,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection
        totalRevenue={stats.totalRevenue}
        projectCount={stats.projectCount}
        launchCount={stats.launchCount}
        customerCount={stats.customerCount}
      />

      {/* Projects Section */}
      <section className="py-16 px-4" id="projects">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent/10 border border-accent/30 mb-4">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-mono text-accent">MY BUILDS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-foreground">Indie </span>
              <span className="text-primary neon-text">SaaS</span>
              <span className="text-foreground"> Portfolio</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Products I've built with vibe coding - each one with live Stripe revenue graphs.
              From idea to launch, powered by AI.
            </p>
          </motion.div>

          {/* Projects Grid */}
          <div className="space-y-6">
            {projectsLoading ? (
              <>
                <ProjectSkeleton />
                <ProjectSkeleton />
                <ProjectSkeleton />
              </>
            ) : projects.length > 0 ? (
              projects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  revenueData={project.revenueData}
                  index={index}
                />
              ))
            ) : (
              <motion.div
                className="text-center py-16 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                <p className="text-muted-foreground">
                  Check back soon for new vibe-coded builds!
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Conference Section */}
      <ConferenceSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

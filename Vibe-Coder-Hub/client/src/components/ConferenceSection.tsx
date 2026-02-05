import { motion } from "framer-motion";
import { ExternalLink, MapPin, Calendar, Mic2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ConferenceSection() {
  return (
    <section className="py-16 px-4" id="conference">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/30 mb-4">
            <Mic2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono text-primary" data-testid="text-conference-label">LIVE EVENT</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-foreground">Vibe Coding </span>
            <span className="text-primary neon-text">Conference</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Where builders, hackers, and AI-powered creators come together.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-primary/20 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="font-mono text-xs px-3 py-1 rounded-md bg-primary/20 text-primary border border-primary/30" data-testid="badge-conference-type">
                      IN-PERSON
                    </span>
                    <span className="font-mono text-xs px-3 py-1 rounded-md bg-accent/20 text-accent border border-accent/30" data-testid="badge-conference-vibe">
                      VIBE CODED
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-3 text-foreground" data-testid="text-conference-title">
                    Vibe Coding Miami
                  </h3>

                  <p className="text-muted-foreground mb-6 max-w-xl leading-relaxed" data-testid="text-conference-description">
                    The conference for vibe coders, indie hackers, and AI builders. Connect with like-minded creators, share your builds, and level up your vibe coding game in Miami.
                  </p>

                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span data-testid="text-conference-location">Miami, FL</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-accent" />
                      <span data-testid="text-conference-date">2025</span>
                    </div>
                  </div>

                  <Button asChild data-testid="link-conference-website">
                    <a href="https://vibecodingmiami.xyz/" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                </div>

                <div className="hidden md:flex flex-col items-center justify-center w-48 h-48 rounded-md border border-primary/20 bg-primary/5">
                  <Mic2 className="w-16 h-16 text-primary mb-3 opacity-60" />
                  <span className="font-mono text-xs text-primary/60">MIAMI 2025</span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

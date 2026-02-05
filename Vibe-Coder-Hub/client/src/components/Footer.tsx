import { motion } from "framer-motion";
import { SiGithub, SiX, SiProducthunt } from "react-icons/si";
import { Code2, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 px-4 border-t border-border overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 pixel-grid opacity-20" />
      
      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-primary">VIBE</span>
              <span className="text-secondary">CODER</span>
            </span>
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-muted-foreground mb-8 max-w-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Building indie products with good vibes and AI-powered development.
          </motion.p>

          {/* Social Links */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <a
              href="https://x.com/FounderWilfred"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-card border border-card-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              data-testid="link-twitter"
              aria-label="Twitter"
            >
              <SiX className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/Spacemandomains"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-card border border-card-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              data-testid="link-github"
              aria-label="GitHub"
            >
              <SiGithub className="w-4 h-4" />
            </a>
            <a
              href="https://www.producthunt.com/@wilfredleeux"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-lg bg-card border border-card-border flex items-center justify-center text-muted-foreground hover:text-[#FF6154] hover:border-[#FF6154]/50 transition-colors"
              data-testid="link-producthunt"
              aria-label="Product Hunt"
            >
              <SiProducthunt className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="flex items-center gap-2 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <span>Made with</span>
            <Heart className="w-4 h-4 text-accent fill-accent" />
            <span>and vibes</span>
            <span className="mx-2">|</span>
            <span>{currentYear}</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}

import { motion } from "framer-motion";
import { Gamepad2, Zap, Rocket, Code2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 pixel-grid opacity-50" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      {/* Floating arcade elements */}
      <motion.div
        className="absolute top-20 left-10 text-primary opacity-20"
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Gamepad2 className="w-16 h-16" />
      </motion.div>
      
      <motion.div
        className="absolute top-32 right-20 text-secondary opacity-20"
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Code2 className="w-12 h-12" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-40 left-1/4 text-accent opacity-20"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Zap className="w-10 h-10" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-32 right-1/4 text-primary opacity-20"
        animate={{ y: [0, 10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Rocket className="w-14 h-14" />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Pixel art badge */}
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary/10 border border-primary/30 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-mono text-primary">PLAYER 1 READY</span>
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="neon-text text-primary">VIBE</span>
          <span className="text-foreground"> </span>
          <span className="neon-text-cyan text-secondary">CODER</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-foreground font-medium mb-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          Wilfred Lee Jr.
        </motion.p>

        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-8 font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Building <span className="text-accent neon-text-pink">indie SaaS</span> products with AI
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-card-border">
            <Gamepad2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono">Indie Hacker</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-card-border">
            <Zap className="w-4 h-4 text-secondary" />
            <span className="text-sm font-mono">Vibe Coding</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-card-border">
            <Rocket className="w-4 h-4 text-accent" />
            <span className="text-sm font-mono">Ship Fast</span>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-primary animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

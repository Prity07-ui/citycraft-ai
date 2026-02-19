import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Building2, Brain, BarChart3, Shield, Droplets, Zap, ArrowRight } from 'lucide-react';
import heroImage from '@/assets/hero-city.jpg';

const features = [
  { icon: Brain, title: 'AI-Powered Planning', desc: 'Intelligent simulation engine generates optimized city layouts based on your parameters.' },
  { icon: Building2, title: '3D Visualization', desc: 'Interactive Three.js city model with zoom, rotate, and pan controls.' },
  { icon: BarChart3, title: 'Sustainability Scoring', desc: 'AI-generated 0–100 sustainability score with detailed factor breakdown.' },
  { icon: Shield, title: 'Disaster Assessment', desc: 'Risk evaluation with structural mitigation and emergency response plans.' },
  { icon: Droplets, title: 'Water Management', desc: 'Smart irrigation, rainwater harvesting, and recycling optimization.' },
  { icon: Zap, title: 'Smart Infrastructure', desc: 'EV charging, smart grid energy systems, and intelligent traffic strategies.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Futuristic smart city" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="absolute inset-0 gradient-mesh" />

        <div className="relative z-10 container mx-auto px-4 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-heading text-primary mb-6 glow-border">
              <Zap className="w-3 h-3" /> AI-Powered Urban Intelligence
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              Design the
              <span className="text-gradient block">Cities of Tomorrow</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 font-heading">
              Plan, simulate, and visualize smart cities with AI-driven infrastructure analysis,
              sustainability scoring, and interactive 3D modeling.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-base tracking-wide glow-primary flex items-center gap-2 mx-auto sm:mx-0"
                >
                  Start Planning <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3.5 rounded-xl glass text-foreground font-heading font-semibold text-base tracking-wide glow-border"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-5 h-8 rounded-full border-2 border-primary/40 flex items-start justify-center pt-1.5">
            <div className="w-1 h-1.5 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 relative">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div {...fadeUp} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Intelligent <span className="text-primary">Features</span>
            </h2>
            <p className="text-muted-foreground font-heading max-w-xl mx-auto">
              Everything you need to design resilient, sustainable, future-ready cities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-xl glass glow-border group cursor-default"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow duration-300">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold mb-2 text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeUp}
            className="max-w-3xl mx-auto text-center p-12 rounded-2xl glass glow-primary"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Build the <span className="text-primary">Future</span>?
            </h2>
            <p className="text-muted-foreground font-heading mb-8 max-w-lg mx-auto">
              Start creating your AI-powered smart city plan in minutes.
            </p>
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-lg tracking-wide glow-primary"
              >
                Launch Planner
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground font-heading">
            © 2026 UrbanAI · AI Smart Urban Planner · All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

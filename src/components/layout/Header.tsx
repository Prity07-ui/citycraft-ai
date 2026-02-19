import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDashboard = location.pathname !== '/';

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-strong"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center glow-border group-hover:glow-primary transition-shadow duration-300">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <span className="font-display text-sm font-bold tracking-wider text-foreground">
            URBAN<span className="text-primary">AI</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-heading font-medium tracking-wide transition-colors hover:text-primary ${
              location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <Link
            to="/dashboard"
            className={`text-sm font-heading font-medium tracking-wide transition-colors hover:text-primary ${
              location.pathname.startsWith('/dashboard') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Dashboard
          </Link>
          {!isDashboard && (
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-sm tracking-wide glow-primary"
              >
                Get Started
              </motion.button>
            </Link>
          )}
        </nav>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden glass-strong border-t border-border/30 px-4 py-4 flex flex-col gap-3"
        >
          <Link to="/" onClick={() => setMobileOpen(false)} className="text-sm font-heading text-muted-foreground hover:text-primary">Home</Link>
          <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-sm font-heading text-muted-foreground hover:text-primary">Dashboard</Link>
          <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-sm text-center">Get Started</Link>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;

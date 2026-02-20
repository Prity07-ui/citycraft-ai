import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Menu, X, LogOut, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const isDashboard = location.pathname !== '/';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-heading text-muted-foreground flex items-center gap-1">
                <UserCircle className="w-4 h-4" />
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-heading font-medium text-muted-foreground hover:text-destructive transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/auth">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-5 py-2 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-sm tracking-wide glow-primary"
              >
                Sign In
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
          {user ? (
            <>
              <span className="text-xs font-heading text-muted-foreground">{user.email}</span>
              <button onClick={() => { handleSignOut(); setMobileOpen(false); }} className="text-sm font-heading text-destructive text-left">Sign Out</button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-heading font-semibold text-sm text-center">Sign In</Link>
          )}
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;

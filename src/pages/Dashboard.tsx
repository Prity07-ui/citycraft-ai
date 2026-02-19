import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Eye, Building2, TrendingUp, Target } from 'lucide-react';
import { useCityStore } from '@/stores/cityStore';
import SustainabilityScore from '@/components/city/SustainabilityScore';

const formatINR = (v: number) => '₹' + v.toLocaleString('en-IN');

const Dashboard = () => {
  const { plans, setCurrentPlan, deletePlan } = useCityStore();

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="absolute inset-0 gradient-mesh opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground font-heading mt-1">Manage your smart city plans</p>
          </div>
          <Link to="/plan">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm tracking-wide glow-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New City Plan
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: Building2, label: 'Total Plans', value: plans.length },
            { icon: TrendingUp, label: 'Avg Sustainability', value: plans.length ? Math.round(plans.reduce((s, p) => s + (p.sustainabilityScore || 0), 0) / plans.length) : 0 },
            { icon: Target, label: 'Total Budget', value: plans.length ? formatINR(plans.reduce((s, p) => s + p.budget, 0)) : '₹0' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-xl glass glow-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-heading">{stat.label}</p>
                  <p className="text-xl font-display font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Plans */}
        {plans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 glass rounded-2xl glow-border"
          >
            <Building2 className="w-16 h-16 text-primary/30 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-bold text-foreground mb-2">No City Plans Yet</h3>
            <p className="text-muted-foreground font-heading mb-6">Create your first AI-powered smart city plan</p>
            <Link to="/plan">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm glow-primary"
              >
                Create Plan
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl glass glow-border group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-heading font-bold text-foreground">{plan.cityName}</h3>
                    <p className="text-xs text-muted-foreground font-heading">{plan.primaryGoal} · {plan.climateType}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/report" onClick={() => setCurrentPlan(plan)}>
                      <button className="p-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => deletePlan(plan.id)}
                      className="p-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-sm font-heading">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Budget</span>
                    <span className="text-foreground font-semibold">{formatINR(plan.budget)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Population</span>
                    <span className="text-foreground font-semibold">{plan.population.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span className={`font-semibold ${plan.disasterRiskLevel === 'High' ? 'text-destructive' : plan.disasterRiskLevel === 'Medium' ? 'text-warning' : 'text-success'}`}>
                      {plan.disasterRiskLevel}
                    </span>
                  </div>
                </div>

                {plan.sustainabilityScore && (
                  <div className="mt-4 pt-4 border-t border-border/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-heading">Sustainability</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className="h-full rounded-full bg-primary"
                            initial={{ width: 0 }}
                            animate={{ width: `${plan.sustainabilityScore}%` }}
                            transition={{ duration: 1, delay: 0.3 }}
                          />
                        </div>
                        <span className="text-xs font-display font-bold text-primary">{plan.sustainabilityScore}</span>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

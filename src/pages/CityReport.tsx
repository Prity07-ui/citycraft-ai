import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCityStore } from '@/stores/cityStore';
import CityVisualization from '@/components/city/CityVisualization';
import SustainabilityScore from '@/components/city/SustainabilityScore';
import BudgetChart from '@/components/city/BudgetChart';
import DisasterRiskChart from '@/components/city/DisasterRiskChart';
import { ArrowLeft, Building2, Droplets, Zap, TrainFront, ShieldAlert, Lightbulb, TreePine, Download } from 'lucide-react';
import { Suspense } from 'react';

const formatINR = (v: number) => '₹' + v.toLocaleString('en-IN');

const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-6 rounded-xl glass glow-border"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="text-lg font-heading font-bold text-foreground">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const CityReport = () => {
  const navigate = useNavigate();
  const { currentPlan } = useCityStore();

  if (!currentPlan) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass p-12 rounded-2xl glow-border">
          <Building2 className="w-16 h-16 text-primary/30 mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">No Plan Selected</h2>
          <p className="text-muted-foreground font-heading mb-6">Create a city plan first</p>
          <button onClick={() => navigate('/plan')} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold text-sm glow-primary">
            Create Plan
          </button>
        </div>
      </div>
    );
  }

  const plan = currentPlan;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="absolute inset-0 gradient-mesh opacity-20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-lg glass hover:glow-border transition-shadow">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">{plan.cityName}</h1>
            <p className="text-muted-foreground font-heading text-sm">{plan.primaryGoal} · {plan.climateType} · Pop. {plan.population.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* 3D Visualization */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" /> 3D City Model
          </h2>
          <Suspense fallback={<div className="w-full h-[500px] rounded-xl glass glow-border flex items-center justify-center text-muted-foreground font-heading">Loading 3D Model...</div>}>
            <CityVisualization plan={plan} />
          </Suspense>
        </motion.div>

        {/* Score + Budget row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Section title="Sustainability Score" icon={TreePine}>
            <SustainabilityScore score={plan.sustainabilityScore || 0} />
          </Section>

          <Section title="Budget Allocation" icon={Zap}>
            <BudgetChart plan={plan} />
          </Section>

          <Section title="Disaster Risk" icon={ShieldAlert}>
            <DisasterRiskChart plan={plan} />
          </Section>
        </div>

        {/* AI reports */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Section title="Infrastructure Plan" icon={Building2}>
            <ul className="space-y-2 text-sm font-heading text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> Smart grid energy system with solar & wind integration</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> EV charging network across all zones (1 per 500 residents)</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> AI-controlled smart lighting with motion sensors</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> Underground utility corridors for maintenance access</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> Public facilities: hospitals, schools, community centers</li>
            </ul>
          </Section>

          <Section title="Traffic Strategy" icon={TrainFront}>
            <ul className="space-y-2 text-sm font-heading text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> Metro rail + BRT system covering 85% of city</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> AI traffic signals with real-time congestion monitoring</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> Dedicated bicycle lanes and pedestrian zones</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> EV adoption incentive program (30% target by year 5)</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> Smart parking systems reducing search time by 60%</li>
            </ul>
          </Section>

          <Section title="Water Management" icon={Droplets}>
            <ul className="space-y-2 text-sm font-heading text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> Rainwater harvesting across all public buildings</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> Smart irrigation with soil moisture sensors</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> Greywater recycling plants (capacity: {Math.round(plan.population * 0.4).toLocaleString()} liters/day)</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> Underground water storage reservoirs</li>
              <li className="flex items-start gap-2"><span className="text-primary mt-0.5">▸</span> Real-time water quality monitoring system</li>
            </ul>
          </Section>

          <Section title="AI Recommendations" icon={Lightbulb}>
            <ul className="space-y-2 text-sm font-heading text-muted-foreground">
              <li className="flex items-start gap-2"><span className="text-success mt-0.5">✦</span> Increase green cover to 35% for improved air quality</li>
              <li className="flex items-start gap-2"><span className="text-success mt-0.5">✦</span> Allocate {formatINR(Math.round(plan.budget * 0.05))} for early warning systems</li>
              <li className="flex items-start gap-2"><span className="text-success mt-0.5">✦</span> Implement circular waste management for zero-landfill target</li>
              <li className="flex items-start gap-2"><span className="text-success mt-0.5">✦</span> Partner with tech firms for smart city IoT infrastructure</li>
              <li className="flex items-start gap-2"><span className="text-success mt-0.5">✦</span> Projected sustainability improvement: +12 points over 5 years</li>
            </ul>
          </Section>
        </div>

        {/* Budget summary */}
        <Section title="Budget Summary" icon={Zap}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {plan.budgetAllocation && Object.entries(plan.budgetAllocation).map(([key, value]) => (
              <div key={key} className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground font-heading capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className="text-sm font-heading font-bold text-foreground mt-1">{formatINR(value)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border/30 flex justify-between items-center">
            <span className="text-sm font-heading text-muted-foreground">Total Budget</span>
            <span className="text-lg font-display font-bold text-primary">{formatINR(plan.budget)}</span>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default CityReport;

import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCityStore } from '@/stores/cityStore';
import { MapPin, Wallet, Users, Leaf, Shield, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useState } from 'react';

const steps = [
  { icon: MapPin, label: 'Location' },
  { icon: Wallet, label: 'Budget' },
  { icon: Users, label: 'Population' },
  { icon: Leaf, label: 'Environment' },
  { icon: Shield, label: 'Risks' },
  { icon: Sparkles, label: 'Goals' },
];

const climateTypes = ['Tropical', 'Arid', 'Temperate', 'Continental', 'Polar'];
const waterLevels = ['Scarce', 'Moderate', 'Abundant'];
const riskLevels = ['Low', 'Medium', 'High'];
const disasterOptions = ['Flood', 'Earthquake', 'Cyclone', 'Drought', 'Landslide', 'Tsunami'];
const goalOptions = ['Sustainable', 'Commercial', 'Residential'];

const PlanCity = () => {
  const navigate = useNavigate();
  const { formStep, formData, setFormStep, setFormData, submitPlan } = useCityStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (formStep === 0) {
      if (!formData.cityName?.trim()) e.cityName = 'Required';
    }
    if (formStep === 1) {
      if (!formData.budget || formData.budget <= 0) e.budget = 'Enter a valid budget';
    }
    if (formStep === 2) {
      if (!formData.population || formData.population <= 0) e.population = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (formStep < steps.length - 1) setFormStep(formStep + 1);
  };
  const prev = () => { if (formStep > 0) setFormStep(formStep - 1); };

  const handleSubmit = () => {
    submitPlan();
    navigate('/report');
  };

  const toggleDisaster = (d: string) => {
    const current = formData.disasterTypes || [];
    setFormData({
      disasterTypes: current.includes(d) ? current.filter(x => x !== d) : [...current, d],
    });
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-muted border border-border/50 text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/50";
  const labelClass = "block text-sm font-heading font-semibold text-foreground mb-2";

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="absolute inset-0 gradient-mesh opacity-30 pointer-events-none" />
      <div className="container mx-auto px-4 max-w-2xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Create City Plan</h1>
          <p className="text-muted-foreground font-heading mb-8">Configure your smart city parameters</p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <button
                onClick={() => i < formStep && setFormStep(i)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all whitespace-nowrap ${
                  i === formStep
                    ? 'bg-primary/20 text-primary glow-border'
                    : i < formStep
                    ? 'text-primary/60 hover:text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < steps.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground/30 mx-1 shrink-0" />}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8 rounded-2xl glass glow-border">
          <AnimatePresence mode="wait">
            <motion.div
              key={formStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {formStep === 0 && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>City Name</label>
                    <input className={inputClass} placeholder="e.g. NeoDelhi" value={formData.cityName || ''} onChange={e => setFormData({ cityName: e.target.value })} />
                    {errors.cityName && <p className="text-destructive text-xs mt-1 font-heading">{errors.cityName}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Latitude</label>
                      <input className={inputClass} type="number" step="any" placeholder="28.6139" value={formData.latitude || ''} onChange={e => setFormData({ latitude: parseFloat(e.target.value) })} />
                    </div>
                    <div>
                      <label className={labelClass}>Longitude</label>
                      <input className={inputClass} type="number" step="any" placeholder="77.2090" value={formData.longitude || ''} onChange={e => setFormData({ longitude: parseFloat(e.target.value) })} />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground font-heading">Planning radius: 10km (fixed)</p>
                </div>
              )}

              {formStep === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Budget (INR)</label>
                    <input className={inputClass} type="number" placeholder="10000000" value={formData.budget || ''} onChange={e => setFormData({ budget: parseFloat(e.target.value) })} />
                    {errors.budget && <p className="text-destructive text-xs mt-1 font-heading">{errors.budget}</p>}
                    {formData.budget && formData.budget > 0 && (
                      <p className="text-primary text-sm mt-2 font-heading">
                        ₹{formData.budget.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Target Population</label>
                    <input className={inputClass} type="number" placeholder="500000" value={formData.population || ''} onChange={e => setFormData({ population: parseFloat(e.target.value) })} />
                    {errors.population && <p className="text-destructive text-xs mt-1 font-heading">{errors.population}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Growth Rate (%)</label>
                    <input className={inputClass} type="number" step="0.1" placeholder="2.5" value={formData.growthRate || ''} onChange={e => setFormData({ growthRate: parseFloat(e.target.value) })} />
                  </div>
                </div>
              )}

              {formStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Climate Type</label>
                    <div className="flex flex-wrap gap-2">
                      {climateTypes.map(c => (
                        <button key={c} onClick={() => setFormData({ climateType: c })}
                          className={`px-4 py-2 rounded-lg text-sm font-heading font-semibold transition-all ${
                            formData.climateType === c ? 'bg-primary/20 text-primary border border-primary/50 glow-border' : 'bg-muted text-muted-foreground border border-border/30 hover:border-primary/30'
                          }`}
                        >{c}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Water Availability</label>
                    <div className="flex gap-2">
                      {waterLevels.map(w => (
                        <button key={w} onClick={() => setFormData({ waterAvailability: w })}
                          className={`px-4 py-2 rounded-lg text-sm font-heading font-semibold flex-1 transition-all ${
                            formData.waterAvailability === w ? 'bg-primary/20 text-primary border border-primary/50 glow-border' : 'bg-muted text-muted-foreground border border-border/30 hover:border-primary/30'
                          }`}
                        >{w}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {formStep === 4 && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Disaster Risk Level</label>
                    <div className="flex gap-2">
                      {riskLevels.map(r => (
                        <button key={r} onClick={() => setFormData({ disasterRiskLevel: r })}
                          className={`px-4 py-2 rounded-lg text-sm font-heading font-semibold flex-1 transition-all ${
                            formData.disasterRiskLevel === r
                              ? r === 'High' ? 'bg-destructive/20 text-destructive border border-destructive/50' : r === 'Medium' ? 'bg-warning/20 text-warning border border-warning/50' : 'bg-success/20 text-success border border-success/50'
                              : 'bg-muted text-muted-foreground border border-border/30 hover:border-primary/30'
                          }`}
                        >{r}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Disaster Types</label>
                    <div className="flex flex-wrap gap-2">
                      {disasterOptions.map(d => (
                        <button key={d} onClick={() => toggleDisaster(d)}
                          className={`px-4 py-2 rounded-lg text-sm font-heading font-semibold transition-all ${
                            (formData.disasterTypes || []).includes(d) ? 'bg-destructive/20 text-destructive border border-destructive/50' : 'bg-muted text-muted-foreground border border-border/30 hover:border-primary/30'
                          }`}
                        >{d}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {formStep === 5 && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Primary Goal</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {goalOptions.map(g => (
                        <button key={g} onClick={() => setFormData({ primaryGoal: g })}
                          className={`p-4 rounded-xl text-sm font-heading font-bold text-center transition-all ${
                            formData.primaryGoal === g ? 'bg-primary/20 text-primary border border-primary/50 glow-border' : 'bg-muted text-muted-foreground border border-border/30 hover:border-primary/30'
                          }`}
                        >
                          {g === 'Sustainable' && <Leaf className="w-6 h-6 mx-auto mb-2" />}
                          {g === 'Commercial' && <Wallet className="w-6 h-6 mx-auto mb-2" />}
                          {g === 'Residential' && <Users className="w-6 h-6 mx-auto mb-2" />}
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border/30">
            <button
              onClick={prev}
              disabled={formStep === 0}
              className="px-5 py-2.5 rounded-lg glass text-sm font-heading font-semibold text-muted-foreground disabled:opacity-30 hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {formStep < steps.length - 1 ? (
              <button
                onClick={next}
                className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-heading font-bold glow-primary flex items-center gap-1"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-heading font-bold glow-primary flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Generate AI Plan
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCity;

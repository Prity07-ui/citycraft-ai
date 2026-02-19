import { create } from 'zustand';

export interface CityPlan {
  id: string;
  cityName: string;
  latitude: number;
  longitude: number;
  budget: number;
  population: number;
  growthRate: number;
  climateType: string;
  waterAvailability: string;
  disasterRiskLevel: string;
  disasterTypes: string[];
  primaryGoal: string;
  createdAt: string;
  sustainabilityScore?: number;
  budgetAllocation?: {
    infrastructure: number;
    waterSystems: number;
    disasterMitigation: number;
    sustainability: number;
    emergencyReserve: number;
  };
}

interface CityStore {
  plans: CityPlan[];
  currentPlan: CityPlan | null;
  formStep: number;
  formData: Partial<CityPlan>;
  setFormStep: (step: number) => void;
  setFormData: (data: Partial<CityPlan>) => void;
  submitPlan: () => void;
  setCurrentPlan: (plan: CityPlan | null) => void;
  deletePlan: (id: string) => void;
}

const generateBudgetAllocation = (budget: number, disasterRiskLevel: string, primaryGoal: string) => {
  let infra = 0.35, water = 0.15, disaster = 0.15, sustain = 0.25, reserve = 0.10;
  if (disasterRiskLevel === 'High') { disaster = 0.25; infra = 0.25; }
  if (primaryGoal === 'Sustainable') { sustain = 0.35; infra = 0.25; }
  if (primaryGoal === 'Commercial') { infra = 0.40; sustain = 0.20; }
  return {
    infrastructure: Math.round(budget * infra),
    waterSystems: Math.round(budget * water),
    disasterMitigation: Math.round(budget * disaster),
    sustainability: Math.round(budget * sustain),
    emergencyReserve: Math.round(budget * reserve),
  };
};

const generateSustainabilityScore = (data: Partial<CityPlan>) => {
  let score = 50;
  if (data.primaryGoal === 'Sustainable') score += 20;
  if (data.waterAvailability === 'Abundant') score += 10;
  if (data.disasterRiskLevel === 'Low') score += 10;
  if (data.growthRate && data.growthRate < 3) score += 5;
  if (data.climateType === 'Temperate') score += 5;
  return Math.min(score, 98);
};

export const useCityStore = create<CityStore>((set, get) => ({
  plans: [],
  currentPlan: null,
  formStep: 0,
  formData: {},
  setFormStep: (step) => set({ formStep: step }),
  setFormData: (data) => set((s) => ({ formData: { ...s.formData, ...data } })),
  submitPlan: () => {
    const { formData, plans } = get();
    const plan: CityPlan = {
      id: crypto.randomUUID(),
      cityName: formData.cityName || 'Unnamed City',
      latitude: formData.latitude || 0,
      longitude: formData.longitude || 0,
      budget: formData.budget || 0,
      population: formData.population || 0,
      growthRate: formData.growthRate || 0,
      climateType: formData.climateType || 'Temperate',
      waterAvailability: formData.waterAvailability || 'Moderate',
      disasterRiskLevel: formData.disasterRiskLevel || 'Medium',
      disasterTypes: formData.disasterTypes || [],
      primaryGoal: formData.primaryGoal || 'Sustainable',
      createdAt: new Date().toISOString(),
      sustainabilityScore: generateSustainabilityScore(formData),
      budgetAllocation: generateBudgetAllocation(
        formData.budget || 0,
        formData.disasterRiskLevel || 'Medium',
        formData.primaryGoal || 'Sustainable'
      ),
    };
    set({ plans: [...plans, plan], currentPlan: plan, formData: {}, formStep: 0 });
  },
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  deletePlan: (id) => set((s) => ({ plans: s.plans.filter((p) => p.id !== id) })),
}));

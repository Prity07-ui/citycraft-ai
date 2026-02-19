import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { CityPlan } from '@/stores/cityStore';

const DisasterRiskChart = ({ plan }: { plan: CityPlan }) => {
  const riskMultiplier = plan.disasterRiskLevel === 'High' ? 1.5 : plan.disasterRiskLevel === 'Medium' ? 1 : 0.5;

  const data = [
    { factor: 'Flood', risk: plan.disasterTypes.includes('Flood') ? 80 * riskMultiplier : 20 },
    { factor: 'Earthquake', risk: plan.disasterTypes.includes('Earthquake') ? 75 * riskMultiplier : 15 },
    { factor: 'Cyclone', risk: plan.disasterTypes.includes('Cyclone') ? 85 * riskMultiplier : 10 },
    { factor: 'Drought', risk: plan.disasterTypes.includes('Drought') ? 60 * riskMultiplier : 25 },
    { factor: 'Landslide', risk: plan.disasterTypes.includes('Landslide') ? 70 * riskMultiplier : 12 },
    { factor: 'Tsunami', risk: plan.disasterTypes.includes('Tsunami') ? 90 * riskMultiplier : 8 },
  ].map(d => ({ ...d, risk: Math.min(d.risk, 100) }));

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(200, 30%, 18%)" />
          <PolarAngleAxis dataKey="factor" tick={{ fill: 'hsl(210, 15%, 55%)', fontSize: 12, fontFamily: 'Rajdhani' }} />
          <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
          <Radar name="Risk" dataKey="risk" stroke="hsl(0, 72%, 51%)" fill="hsl(0, 72%, 51%)" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DisasterRiskChart;

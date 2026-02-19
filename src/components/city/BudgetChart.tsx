import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { CityPlan } from '@/stores/cityStore';

const COLORS = [
  'hsl(180, 100%, 40%)',
  'hsl(280, 80%, 60%)',
  'hsl(150, 80%, 45%)',
  'hsl(40, 95%, 55%)',
  'hsl(200, 90%, 50%)',
];

const formatINR = (value: number) => {
  return '₹' + value.toLocaleString('en-IN');
};

const BudgetChart = ({ plan }: { plan: CityPlan }) => {
  if (!plan.budgetAllocation) return null;

  const data = [
    { name: 'Infrastructure', value: plan.budgetAllocation.infrastructure },
    { name: 'Water Systems', value: plan.budgetAllocation.waterSystems },
    { name: 'Disaster Mitigation', value: plan.budgetAllocation.disasterMitigation },
    { name: 'Sustainability', value: plan.budgetAllocation.sustainability },
    { name: 'Emergency Reserve', value: plan.budgetAllocation.emergencyReserve },
  ];

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatINR(value)}
            contentStyle={{
              backgroundColor: 'hsl(220, 25%, 10%)',
              border: '1px solid hsl(200, 30%, 18%)',
              borderRadius: '8px',
              color: 'hsl(190, 100%, 95%)',
              fontFamily: 'Rajdhani',
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: 'Rajdhani', fontSize: '13px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetChart;

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Environment } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { CityPlan } from '@/stores/cityStore';

interface BuildingProps {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

const Building = ({ position, size, color }: BuildingProps) => (
  <mesh position={position} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} metalness={0.1} roughness={0.6} />
  </mesh>
);

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
    <planeGeometry args={[40, 40]} />
    <meshStandardMaterial color="#e8edf2" metalness={0.05} roughness={0.8} />
  </mesh>
);

const Road = ({ start, end }: { start: [number, number, number]; end: [number, number, number] }) => {
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  const length = Math.sqrt((end[0] - start[0]) ** 2 + (end[2] - start[2]) ** 2);
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);

  return (
    <mesh position={[midX, 0.01, midZ]} rotation={[-Math.PI / 2, 0, angle]}>
      <planeGeometry args={[length, 0.3]} />
      <meshStandardMaterial color="#b0bec5" />
    </mesh>
  );
};

const GreenSpace = ({ position, radius }: { position: [number, number, number]; radius: number }) => (
  <mesh position={position}>
    <cylinderGeometry args={[radius, radius, 0.1, 32]} />
    <meshStandardMaterial color="#66bb6a" />
  </mesh>
);

const CityScene = ({ plan }: { plan: CityPlan }) => {
  const buildings = useMemo(() => {
    const result: BuildingProps[] = [];
    const seed = plan.cityName.length + plan.population;
    const rng = (i: number) => ((seed * 9301 + i * 49297) % 233280) / 233280;

    const numBuildings = Math.min(30 + Math.floor(plan.population / 50000), 80);
    const colors = {
      Residential: '#64b5f6',
      Commercial: '#ffb74d',
      Sustainable: '#81c784',
    };
    const baseColor = colors[plan.primaryGoal as keyof typeof colors] || '#64b5f6';

    for (let i = 0; i < numBuildings; i++) {
      const x = (rng(i * 3) - 0.5) * 30;
      const z = (rng(i * 3 + 1) - 0.5) * 30;
      const height = 0.5 + rng(i * 3 + 2) * 4 * (plan.budget / 10000000);
      const w = 0.3 + rng(i * 7) * 0.8;
      const mixFactor = rng(i * 11);
      const c = mixFactor > 0.7 ? '#4dd0e1' : mixFactor > 0.4 ? baseColor : '#90a4ae';

      result.push({ position: [x, height / 2, z], size: [w, height, w], color: c });
    }
    return result;
  }, [plan]);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 15, 10]} intensity={1.0} castShadow />
      <pointLight position={[0, 10, 0]} intensity={0.4} color="#90caf9" />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#ce93d8" />

      <Ground />
      {buildings.map((b, i) => <Building key={i} {...b} />)}

      <Road start={[-18, 0, 0]} end={[18, 0, 0]} />
      <Road start={[0, 0, -18]} end={[0, 0, 18]} />
      <Road start={[-18, 0, -8]} end={[18, 0, -8]} />
      <Road start={[-18, 0, 8]} end={[18, 0, 8]} />
      <Road start={[-8, 0, -18]} end={[-8, 0, 18]} />
      <Road start={[8, 0, -18]} end={[8, 0, 18]} />

      <GreenSpace position={[-12, 0.06, -12]} radius={2} />
      <GreenSpace position={[12, 0.06, 12]} radius={1.5} />
      <GreenSpace position={[-4, 0.06, 12]} radius={1.8} />

      <fog attach="fog" args={['#e8edf2', 20, 50]} />
      <OrbitControls enablePan enableZoom enableRotate maxPolarAngle={Math.PI / 2.2} minDistance={5} maxDistance={35} />
    </>
  );
};

const CityVisualization = ({ plan }: { plan: CityPlan }) => {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden glass glow-border">
      <Canvas shadows camera={{ position: [15, 12, 15], fov: 50 }}>
        <CityScene plan={plan} />
      </Canvas>
    </div>
  );
};

export default CityVisualization;

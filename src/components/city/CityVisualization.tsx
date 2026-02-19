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
    <meshStandardMaterial color={color} metalness={0.6} roughness={0.3} emissive={color} emissiveIntensity={0.05} />
  </mesh>
);

const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
    <planeGeometry args={[40, 40]} />
    <meshStandardMaterial color="#0a1628" metalness={0.8} roughness={0.4} />
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
      <meshStandardMaterial color="#1a3a5c" emissive="#00cccc" emissiveIntensity={0.1} />
    </mesh>
  );
};

const GreenSpace = ({ position, radius }: { position: [number, number, number]; radius: number }) => (
  <mesh position={position}>
    <cylinderGeometry args={[radius, radius, 0.1, 32]} />
    <meshStandardMaterial color="#0a4a2a" emissive="#00ff88" emissiveIntensity={0.05} />
  </mesh>
);

const CityScene = ({ plan }: { plan: CityPlan }) => {
  const buildings = useMemo(() => {
    const result: BuildingProps[] = [];
    const seed = plan.cityName.length + plan.population;
    const rng = (i: number) => ((seed * 9301 + i * 49297) % 233280) / 233280;

    const numBuildings = Math.min(30 + Math.floor(plan.population / 50000), 80);
    const colors = {
      Residential: '#0088aa',
      Commercial: '#cc6600',
      Sustainable: '#00aa44',
    };
    const baseColor = colors[plan.primaryGoal as keyof typeof colors] || '#0088aa';

    for (let i = 0; i < numBuildings; i++) {
      const x = (rng(i * 3) - 0.5) * 30;
      const z = (rng(i * 3 + 1) - 0.5) * 30;
      const height = 0.5 + rng(i * 3 + 2) * 4 * (plan.budget / 10000000);
      const w = 0.3 + rng(i * 7) * 0.8;
      const mixFactor = rng(i * 11);
      const c = mixFactor > 0.7 ? '#00cccc' : mixFactor > 0.4 ? baseColor : '#1a3a6a';

      result.push({ position: [x, height / 2, z], size: [w, height, w], color: c });
    }
    return result;
  }, [plan]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 10]} intensity={0.8} castShadow />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#00cccc" />
      <pointLight position={[-10, 5, -10]} intensity={0.3} color="#cc44ff" />

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

      <fog attach="fog" args={['#050d1a', 15, 45]} />
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

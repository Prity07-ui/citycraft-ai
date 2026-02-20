import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, MeshReflectorMaterial } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/* ── Animated Building ── */
const Building = ({
  position,
  size,
  color,
  delay,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  delay: number;
}) => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = size[1] / 2 + Math.sin(t * 0.4 + delay) * 0.08;
    }
  });
  return (
    <mesh ref={ref} position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshPhysicalMaterial
        color={color}
        metalness={0.35}
        roughness={0.25}
        clearcoat={0.6}
        clearcoatRoughness={0.15}
        envMapIntensity={1.2}
      />
    </mesh>
  );
};

/* ── Window panels on buildings ── */
const WindowGrid = ({
  position,
  width,
  height,
  depth,
}: {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
}) => {
  const windows = useMemo(() => {
    const arr: { pos: [number, number, number] }[] = [];
    const cols = Math.floor(width / 0.35);
    const rows = Math.floor(height / 0.4);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = position[0] - width / 2 + 0.2 + c * 0.35;
        const y = position[1] - height / 2 + 0.3 + r * 0.4;
        arr.push({ pos: [x, y, position[2] + depth / 2 + 0.01] });
      }
    }
    return arr;
  }, [position, width, height, depth]);

  return (
    <>
      {windows.map((w, i) => (
        <mesh key={i} position={w.pos}>
          <planeGeometry args={[0.18, 0.22]} />
          <meshStandardMaterial
            color="#e3f2fd"
            emissive="#bbdefb"
            emissiveIntensity={0.6}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </>
  );
};

/* ── Stylised Tree ── */
const Tree = ({ position }: { position: [number, number, number] }) => {
  const ref = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5 + position[0]) * 0.05;
    }
  });
  return (
    <group ref={ref} position={position}>
      {/* trunk */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.09, 0.7, 8]} />
        <meshStandardMaterial color="#6d4c41" roughness={0.9} />
      </mesh>
      {/* foliage layers */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <coneGeometry args={[0.4, 0.6, 8]} />
        <meshStandardMaterial color="#43a047" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.25, 0]} castShadow>
        <coneGeometry args={[0.3, 0.5, 8]} />
        <meshStandardMaterial color="#66bb6a" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.55, 0]} castShadow>
        <coneGeometry args={[0.2, 0.4, 8]} />
        <meshStandardMaterial color="#81c784" roughness={0.7} />
      </mesh>
    </group>
  );
};

/* ── Animated Water Plane ── */
const Water = () => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = -0.02 + Math.sin(clock.getElapsedTime() * 0.6) * 0.03;
    }
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[6, -0.02, 0]} receiveShadow>
      <circleGeometry args={[4, 48]} />
      <meshPhysicalMaterial
        color="#4fc3f7"
        transparent
        opacity={0.55}
        roughness={0.05}
        metalness={0.1}
        clearcoat={1}
        clearcoatRoughness={0}
      />
    </mesh>
  );
};

/* ── Ground with reflection ── */
const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
    <planeGeometry args={[60, 60]} />
    <MeshReflectorMaterial
      mirror={0.15}
      blur={[300, 100]}
      resolution={512}
      mixBlur={1}
      mixStrength={0.4}
      color="#dfe6ed"
      metalness={0.05}
      roughness={0.85}
    />
  </mesh>
);

/* ── Road ── */
const Road = ({
  start,
  end,
}: {
  start: [number, number, number];
  end: [number, number, number];
}) => {
  const midX = (start[0] + end[0]) / 2;
  const midZ = (start[2] + end[2]) / 2;
  const length = Math.sqrt((end[0] - start[0]) ** 2 + (end[2] - start[2]) ** 2);
  const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
  return (
    <mesh position={[midX, 0.01, midZ]} rotation={[-Math.PI / 2, 0, angle]}>
      <planeGeometry args={[length, 0.4]} />
      <meshStandardMaterial color="#b0bec5" roughness={0.9} />
    </mesh>
  );
};

/* ── Floating Particles ── */
const Particles = () => {
  const ref = useRef<THREE.Points>(null!);
  const count = 120;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = Math.random() * 12 + 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 0.015;
      const pos = ref.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        const y = positions[i * 3 + 1];
        (pos.array as Float32Array)[i * 3 + 1] =
          y + Math.sin(clock.getElapsedTime() * 0.3 + i) * 0.15;
      }
      pos.needsUpdate = true;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#90caf9" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
};

/* ── Main Scene ── */
const Scene = () => {
  const buildings: {
    pos: [number, number, number];
    size: [number, number, number];
    color: string;
    delay: number;
  }[] = useMemo(
    () => [
      { pos: [-4, 1.5, -3], size: [1.2, 3, 1.2], color: '#5c6bc0', delay: 0 },
      { pos: [-2, 2.2, -4], size: [1, 4.4, 1], color: '#42a5f5', delay: 1 },
      { pos: [0, 1.8, -3], size: [1.4, 3.6, 1.2], color: '#26c6da', delay: 2 },
      { pos: [2, 2.8, -4.5], size: [1.1, 5.6, 1.1], color: '#5c6bc0', delay: 3 },
      { pos: [4, 1.2, -3], size: [1.3, 2.4, 1.3], color: '#78909c', delay: 4 },
      { pos: [-3, 1, -6], size: [0.9, 2, 0.9], color: '#7e57c2', delay: 5 },
      { pos: [-1, 1.6, -6.5], size: [1.1, 3.2, 1], color: '#42a5f5', delay: 0.5 },
      { pos: [1, 2, -7], size: [1.3, 4, 1.2], color: '#26c6da', delay: 1.5 },
      { pos: [3, 1.4, -6], size: [1, 2.8, 1], color: '#78909c', delay: 2.5 },
      { pos: [-5, 0.8, -1], size: [0.8, 1.6, 0.8], color: '#7e57c2', delay: 3.5 },
      { pos: [-6, 1.3, -4], size: [1, 2.6, 1], color: '#42a5f5', delay: 4.5 },
      { pos: [5.5, 1.5, -5], size: [0.9, 3, 0.9], color: '#5c6bc0', delay: 0.8 },
    ],
    []
  );

  const trees: [number, number, number][] = useMemo(
    () => [
      [-6, 0, 1],
      [-4.5, 0, 2],
      [-3, 0, 1.5],
      [3, 0, 2],
      [5, 0, 1],
      [-2, 0, 3],
      [1, 0, 3.5],
      [7, 0, -1],
      [-7, 0, -2],
      [4, 0, 4],
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 15, 8]} intensity={1.2} castShadow shadow-mapSize={1024} />
      <pointLight position={[-5, 8, 5]} intensity={0.4} color="#90caf9" />
      <pointLight position={[5, 6, -5]} intensity={0.3} color="#ce93d8" />
      <hemisphereLight args={['#b3e5fc', '#e8eaf6', 0.4]} />

      <Ground />
      <Water />

      {buildings.map((b, i) => (
        <Float key={`b-${i}`} speed={0.8} rotationIntensity={0} floatIntensity={0.15}>
          <Building position={b.pos} size={b.size} color={b.color} delay={b.delay} />
        </Float>
      ))}

      {/* Window details on tallest buildings */}
      <WindowGrid position={[2, 2.8, -4.5]} width={1.1} height={5.6} depth={1.1} />
      <WindowGrid position={[-2, 2.2, -4]} width={1} height={4.4} depth={1} />
      <WindowGrid position={[1, 2, -7]} width={1.3} height={4} depth={1.2} />

      {trees.map((t, i) => (
        <Tree key={`t-${i}`} position={t} />
      ))}

      <Road start={[-10, 0, 0]} end={[10, 0, 0]} />
      <Road start={[0, 0, -10]} end={[0, 0, 5]} />
      <Road start={[-10, 0, -5]} end={[10, 0, -5]} />

      <Particles />

      <fog attach="fog" args={['#e8edf2', 18, 45]} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableRotate
        autoRotate
        autoRotateSpeed={0.4}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
};

const HeroScene = () => (
  <div className="absolute inset-0 z-0">
    <Canvas
      shadows
      camera={{ position: [12, 8, 14], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Scene />
    </Canvas>
  </div>
);

export default HeroScene;

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function SageStarField() {
  const ref = useRef();
  const count = 800; // Reduced for subtle sage green theme effect

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 100;
      positions[i + 1] = (Math.random() - 0.5) * 100;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }
    return positions;
  }, []);

  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    // Sage green themed color palette
    const colorPalette = [
      new THREE.Color('#FFFFFF'), // White
      new THREE.Color('#E8F0ED'), // Light sage
      new THREE.Color('#D5E3DC'), // Pale sage
      new THREE.Color('#C2D6CB'), // Soft sage
    ];

    for (let i = 0; i < count * 3; i += 3) {
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i] = color.r;
      colors[i + 1] = color.g;
      colors[i + 2] = color.b;
    }
    return colors;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      // Very slow rotation for calming effect
      ref.current.rotation.x = state.clock.elapsedTime * 0.003;
      ref.current.rotation.y = state.clock.elapsedTime * 0.002;

      // Gentle pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export default function Starfield() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.2} color="#FFFFFF" />
        <pointLight position={[-10, -10, -10]} intensity={0.15} color="#E8F0ED" />
        <SageStarField />
        <fog attach="fog" args={['#8E9E93', 30, 100]} />
      </Canvas>

      {/* Sage green gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8E9E93]/30 to-[#8E9E93]"></div>
    </div>
  );
}

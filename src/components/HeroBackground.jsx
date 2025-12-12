import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Optimized particle system for best performance
function SimpleParticles() {
  const pointsRef = useRef();
  const count = 150; // Reduced from 300 for even better performance

  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      positions[i + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, []);

  const colors = useMemo(() => {
    const colors = new Float32Array(count * 3);
    const colorPalette = [
      new THREE.Color('#8B5CF6'),
      new THREE.Color('#10B981'),
      new THREE.Color('#F59E0B'),
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
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroBackground() {
  return (
    <div className="fixed inset-0 -z-20">
      <Canvas
        camera={{ position: [0, 0, 25], fov: 75 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#8B5CF6" />
        <SimpleParticles />
        <fog attach="fog" args={['#0F172A', 30, 80]} />
      </Canvas>

      {/* Simple gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/20 to-bg"></div>
    </div>
  );
}

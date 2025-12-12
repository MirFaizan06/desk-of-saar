import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function StarField() {
  const ref = useRef();
  const count = 1500; // Reduced from 5000 to 1500 for better performance
  
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
    const colorPalette = [
      new THREE.Color('#8B5CF6'), // Purple
      new THREE.Color('#A78BFA'), // Light Purple
      new THREE.Color('#10B981'), // Emerald
      new THREE.Color('#34D399'), // Light Emerald
      new THREE.Color('#F59E0B'), // Amber
      new THREE.Color('#FBBF24'), // Light Amber
      new THREE.Color('#EC4899'), // Pink
      new THREE.Color('#F472B6'), // Light Pink
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
      // Slower rotation for better performance
      ref.current.rotation.x = state.clock.elapsedTime * 0.005;
      ref.current.rotation.y = state.clock.elapsedTime * 0.0025;

      // Simplified pulsing animation
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
      ref.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.1}
        sizeAttenuation={true}
        depthWrite={false}
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
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} color="#8B5CF6" />
        <pointLight position={[-10, -10, -10]} intensity={0.3} color="#10B981" />
        <StarField />
        <fog attach="fog" args={['#0F172A', 30, 100]} />
      </Canvas>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg/50 to-bg"></div>
    </div>
  );
}
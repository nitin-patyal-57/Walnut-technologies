import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// ─── POS Terminal 3D Model ──────────────────────────────────────────
function POSTerminal({ hovered }) {
  const groupRef = useRef();
  const screenRef = useRef();
  const baseRef = useRef();

  useFrame((state) => {
    if (!hovered && groupRef.current) {
      groupRef.current.rotation.y += 0.003;
    }
    if (screenRef.current) {
      screenRef.current.material.emissiveIntensity = hovered ? 0.3 : 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={0.9}>
      {/* Base / Body */}
      <mesh ref={baseRef} position={[0, -0.25, 0]} castShadow>
        <boxGeometry args={[2.2, 0.3, 1.6]} />
        <meshStandardMaterial 
          color={hovered ? '#1a5276' : '#1a3a5c'} 
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Neck / Stand */}
      <mesh position={[0, 0.2, -0.3]} castShadow>
        <cylinderGeometry args={[0.15, 0.25, 0.6]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Screen Body */}
      <mesh position={[0, 0.65, -0.3]} castShadow>
        <boxGeometry args={[2.0, 0.08, 1.3]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Screen Display */}
      <mesh ref={screenRef} position={[0, 0.66, 0.15]}>
        <planeGeometry args={[1.7, 1.0]} />
        <meshStandardMaterial
          color="#0a84ff"
          emissive="#0a84ff"
          emissiveIntensity={0.12}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Screen Content (grid lines) */}
      <mesh position={[0, 0.67, 0.15]}>
        <planeGeometry args={[1.5, 0.8]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.08}
          wireframe={false}
        />
      </mesh>

      {/* Card Slot */}
      <mesh position={[0, -0.1, 0.85]} castShadow>
        <boxGeometry args={[0.6, 0.04, 0.15]} />
        <meshStandardMaterial color="#34495e" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Keypad Area */}
      <mesh position={[0, -0.25, 0.5]} castShadow>
        <boxGeometry args={[1.4, 0.02, 0.4]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.4} roughness={0.5} />
      </mesh>

      {/* Keypad Buttons */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <mesh
            key={`btn-${row}-${col}`}
            position={[-0.35 + col * 0.35, -0.23, 0.3 - row * 0.12]}
            castShadow
          >
            <boxGeometry args={[0.08, 0.015, 0.08]} />
            <meshStandardMaterial
              color="#ecf0f1"
              metalness={0.2}
              roughness={0.8}
            />
          </mesh>
        ))
      )}

      {/* NFC Indicator */}
      <mesh position={[0.7, 0.2, 0.85]}>
        <ringGeometry args={[0.1, 0.14, 16]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.6} />
      </mesh>

      {/* LED Indicator */}
      <pointLight position={[0.8, 0.05, 0.85]} color="#00ff88" intensity={0.3} />
      <mesh position={[0.8, 0.05, 0.85]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>
    </group>
  );
}

// ─── Neuro Rehab Device 3D Model ────────────────────────────────────
function NeuroRehabDevice({ hovered }) {
  const groupRef = useRef();
  const displayRef = useRef();

  useFrame((state) => {
    if (!hovered && groupRef.current) {
      groupRef.current.rotation.y -= 0.002;
    }
    if (displayRef.current) {
      const breath = Math.sin(state.clock.elapsedTime * 0.5) * 0.5 + 0.5;
      displayRef.current.material.emissiveIntensity = 0.05 + breath * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={0.8}>
      {/* Main Body */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[2.0, 0.25, 1.8]} />
        <meshStandardMaterial
          color={hovered ? '#e8e8e8' : '#d0d0d0'}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Top Dome */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <sphereGeometry args={[0.9, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={hovered ? '#f0f0f0' : '#e0e0e0'}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Main Display Screen */}
      <mesh ref={displayRef} position={[0, 0.32, 0.95]}>
        <planeGeometry args={[1.2, 0.9]} />
        <meshStandardMaterial
          color="#0066cc"
          emissive="#0088ff"
          emissiveIntensity={0.12}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Brain Wave Visualization */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`wave-${i}`} position={[-0.5 + i * 0.14, 0.33, 0.95]}>
          <planeGeometry args={[0.1, 0.02 + Math.sin(i * 1.2) * 0.04]} />
          <meshBasicMaterial
            color="#00ffcc"
            transparent
            opacity={0.4 + Math.sin(i * 0.5) * 0.2}
          />
        </mesh>
      ))}

      {/* Side Handles */}
      <mesh position={[-1.15, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[1.15, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
        <meshStandardMaterial color="#888" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Electrode Ports */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <mesh key={`port-${i}`} position={[x, 0.03, -0.9]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.06, 12]} />
          <meshStandardMaterial
            color="#555"
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Status Ring */}
      <mesh position={[0, 0.03, 0]}>
        <ringGeometry args={[0.8, 0.85, 32]} />
        <meshBasicMaterial
          color="#0088ff"
          transparent
          opacity={hovered ? 0.4 : 0.15}
        />
      </mesh>

      {/* Ambient glow */}
      <pointLight position={[0, 0.3, 0.5]} color="#0088ff" intensity={0.2} />
    </group>
  );
}

// ─── Scene Setup ────────────────────────────────────────────────────
function Scene({ activeModel, hovered, setHovered }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 4, -3]} intensity={0.3} />
      <pointLight position={[0, 3, 0]} intensity={0.2} color="#0088ff" />

      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>

      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.4}
        scale={4}
        blur={2}
        far={1}
      />

      <group
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <AnimatePresence mode="wait">
          {activeModel === 'pos' ? (
            <motion.group
              key="pos"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <POSTerminal hovered={hovered} />
            </motion.group>
          ) : (
            <motion.group
              key="neuro"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
            >
              <NeuroRehabDevice hovered={hovered} />
            </motion.group>
          )}
        </AnimatePresence>
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2}
        maxDistance={6}
        autoRotate={!hovered}
        autoRotateSpeed={1.5}
        rotateSpeed={0.8}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

// ─── Main Export ────────────────────────────────────────────────────
export default function ProductViewer3D({ className = '' }) {
  const [activeModel, setActiveModel] = useState('pos');
  const [hovered, setHovered] = useState(false);

  return (
    <div className={`w-full ${className}`}>
      {/* Model Toggle */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={() => setActiveModel('pos')}
          className={`px-4 py-2 text-xs font-medium rounded-xl transition-all ${
            activeModel === 'pos'
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
              : 'bg-dark-800 text-dark-400 border border-dark-600 hover:text-white'
          }`}
        >
          POS Terminal
        </button>
        <button
          onClick={() => setActiveModel('neuro')}
          className={`px-4 py-2 text-xs font-medium rounded-xl transition-all ${
            activeModel === 'neuro'
              ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
              : 'bg-dark-800 text-dark-400 border border-dark-600 hover:text-white'
          }`}
        >
          Neuro Rehab
        </button>
      </div>

      {/* 3D Canvas */}
      <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-dark-700/50 bg-gradient-to-b from-dark-900/80 to-dark-950">
        <Canvas
          shadows
          camera={{ position: [0, 0, 4], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <Scene
            activeModel={activeModel}
            hovered={hovered}
            setHovered={setHovered}
          />
        </Canvas>

        {/* Hover Hint */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-dark-500 pointer-events-none">
          {hovered ? '🖱️ Drag to rotate  ·  Scroll to zoom' : '✨ Hover to interact'}
        </div>
      </div>
    </div>
  );
}

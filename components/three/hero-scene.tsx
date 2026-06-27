'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

/* Floating glass cube */
function GlassCube({
  position,
  scale = 1,
  color = '#4F8BFF',
  speed = 1,
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
  });
  return (
    <Float speed={speed * 1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshPhysicalMaterial
          color={color}
          metalness={0.2}
          roughness={0.05}
          transmission={0.9}
          thickness={1.5}
          ior={1.4}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transparent
          opacity={0.6}
        />
        <meshStandardMaterial wireframe attach="material" color={color} transparent opacity={0.15} />
      </mesh>
    </Float>
  );
}

/* Glowing geometric shape (icosahedron with distort) */
function GlowShape({
  position,
  color = '#8A5CFF',
  scale = 1,
}: {
  position: [number, number, number];
  color?: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });
  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={1.5}>
      <mesh ref={ref} position={position} scale={scale}>
        <icosahedronGeometry args={[0.8, 1]} />
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.8}
          distort={0.35}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

/* Torus ring */
function GlowRing({
  position,
  color = '#7FE7FF',
  scale = 1,
}: {
  position: [number, number, number];
  color?: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.4;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} position={position} scale={scale}>
        <torusGeometry args={[0.7, 0.04, 16, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>
    </Float>
  );
}

/* Particle field */
function Particles({ count = 400 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 18;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.03;
    points.current.rotation.x = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#7FE7FF"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* Network nodes — connected glowing dots */
function NetworkNodes() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(
    () =>
      Array.from({ length: 14 }, () => ({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 4 - 1,
        ] as [number, number, number],
      })),
    []
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  const lines = useMemo(() => {
    const result: { a: THREE.Vector3; b: THREE.Vector3 }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = new THREE.Vector3(...nodes[i].position);
        const b = new THREE.Vector3(...nodes[j].position);
        if (a.distanceTo(b) < 3.5) {
          result.push({ a, b });
        }
      }
    }
    return result;
  }, [nodes]);

  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.position}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial
            color="#4F8BFF"
            emissive="#4F8BFF"
            emissiveIntensity={1.2}
          />
        </mesh>
      ))}
      {lines.map((l, i) => {
        const positions = new Float32Array([
          l.a.x, l.a.y, l.a.z,
          l.b.x, l.b.y, l.b.z,
        ]);
        return (
          <lineSegments key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={positions}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#4F8BFF"
              transparent
              opacity={0.15}
            />
          </lineSegments>
        );
      })}
    </group>
  );
}

/* Light beam — a tall thin glowing plane */
function LightBeam({
  position,
  color = '#4F8BFF',
  height = 8,
}: {
  position: [number, number, number];
  color?: string;
  height?: number;
}) {
  return (
    <mesh position={position}>
      <planeGeometry args={[0.08, height]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.25}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* Mouse parallax camera rig */
function CameraRig() {
  const { camera, pointer } = useThree();
  useFrame(() => {
    camera.position.x += (pointer.x * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (pointer.y * 1 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <CameraRig />
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#4F8BFF" />
      <pointLight position={[-5, -3, 2]} intensity={1} color="#8A5CFF" />
      <pointLight position={[0, 3, -4]} intensity={0.8} color="#7FE7FF" />
      <spotLight
        position={[0, 8, 4]}
        angle={0.4}
        penumbra={1}
        intensity={1.5}
        color="#ffffff"
      />

      <Environment preset="city" />

      {/* Glass cubes */}
      <GlassCube position={[-2.6, 1.2, -1]} scale={0.9} color="#4F8BFF" speed={1} />
      <GlassCube position={[2.8, -0.8, -0.5]} scale={0.7} color="#8A5CFF" speed={0.8} />
      <GlassCube position={[1.8, 1.6, -2]} scale={0.5} color="#7FE7FF" speed={1.2} />
      <GlassCube position={[-2.2, -1.4, -1.5]} scale={0.6} color="#4F8BFF" speed={1.1} />

      {/* Glow shapes */}
      <GlowShape position={[0, 0.2, -1]} scale={1.1} color="#8A5CFF" />
      <GlowShape position={[-3.4, -0.4, -2]} scale={0.5} color="#4F8BFF" />
      <GlowShape position={[3.2, 1.2, -2.5]} scale={0.6} color="#7FE7FF" />

      {/* Rings */}
      <GlowRing position={[0, 0, -2]} scale={1.4} color="#7FE7FF" />
      <GlowRing position={[-1.5, 1.8, -3]} scale={0.6} color="#4F8BFF" />
      <GlowRing position={[2, -1.6, -2.5]} scale={0.7} color="#8A5CFF" />

      {/* Network + particles + beams */}
      <NetworkNodes />
      <Particles count={350} />
      <LightBeam position={[-3, 0, -3]} color="#4F8BFF" height={9} />
      <LightBeam position={[3, 0, -3]} color="#8A5CFF" height={9} />
      <LightBeam position={[0, 0, -4]} color="#7FE7FF" height={10} />
    </Canvas>
  );
}

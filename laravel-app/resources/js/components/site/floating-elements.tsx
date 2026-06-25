import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Mesh } from 'three';

function FloatingShape({ position, color, speed }: { position: [number, number, number]; color: string; speed: number }) {
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x += speed * 0.01;
            meshRef.current.rotation.y += speed * 0.01;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
                transparent
                opacity={0.6}
            />
        </mesh>
    );
}

function FloatingOrb({ position, color }: { position: [number, number, number]; color: string }) {
    const meshRef = useRef<Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.5;
            meshRef.current.position.x = position[0] + Math.cos(state.clock.elapsedTime * 0.5) * 0.3;
        }
    });

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.8}
                transparent
                opacity={0.7}
            />
        </mesh>
    );
}

export function FloatingElements() {
    return (
        <div className="absolute inset-0 pointer-events-none opacity-30">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={0.5} />

                <FloatingShape position={[-3, 2, -4]} color="#a855f7" speed={1} />
                <FloatingShape position={[3, -2, -4]} color="#ec4899" speed={1.5} />
                <FloatingShape position={[-2, -1, -5]} color="#8b5cf6" speed={0.8} />
                <FloatingShape position={[2, 1, -5]} color="#f59e0b" speed={1.2} />

                <FloatingOrb position={[-4, 0, -3]} color="#a855f7" />
                <FloatingOrb position={[4, 1, -3]} color="#ec4899" />
                <FloatingOrb position={[0, -2, -4]} color="#8b5cf6" />
            </Canvas>
        </div>
    );
}

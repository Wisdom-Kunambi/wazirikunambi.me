import * as React from 'react';
import { Canvas, type ThreeElements, useFrame } from '@react-three/fiber';
import { Environment, Html, useGLTF } from '@react-three/drei';
import { Color, MeshStandardMaterial } from 'three';
import type { Group, Mesh } from 'three';
import { SITE_BASE } from '@/lib/utils';

const GLB_URL = `${SITE_BASE}paintball_gun.glb`;

type GroupProps = ThreeElements['group'];

type GunModelProps = GroupProps & {
    url: string;
    isDark: boolean;
};

type GunViewerProps = {
    aimX: number;
    aimY: number;
};

function useIsDark(): boolean {
    const [isDark, setIsDark] = React.useState(
        () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
    );
    React.useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    return isDark;
}

function GunModel({ url, isDark, ...props }: GunModelProps) {
    const gltf = useGLTF(url);
    const scene = React.useMemo(() => {
        const clone = gltf.scene.clone(true);
        const baseMat = isDark
            ? new MeshStandardMaterial({
                  color: new Color('#dce2f0'),
                  metalness: 0.92,
                  roughness: 0.1,
                  envMapIntensity: 2.4,
              })
            : new MeshStandardMaterial({
                  color: new Color('#1b1c28'),
                  metalness: 0.88,
                  roughness: 0.28,
                  envMapIntensity: 1.6,
              });
        const accentMat = isDark
            ? new MeshStandardMaterial({
                  color: new Color('#f0f4ff'),
                  metalness: 0.98,
                  roughness: 0.04,
                  emissive: new Color('#5577ff'),
                  emissiveIntensity: 0.18,
                  envMapIntensity: 2.8,
              })
            : new MeshStandardMaterial({
                  color: new Color('#0e0f1c'),
                  metalness: 0.95,
                  roughness: 0.12,
                  emissive: new Color('#003399'),
                  emissiveIntensity: 0.12,
                  envMapIntensity: 2.0,
              });
        let idx = 0;
        clone.traverse((child) => {
            const mesh = child as Mesh;
            if (!mesh.isMesh) return;
            mesh.material = idx % 4 === 0 ? accentMat : baseMat;
            mesh.castShadow = true;
            idx++;
        });
        return clone;
    }, [gltf.scene, isDark]);
    return <primitive object={scene} {...props} />;
}

function ModelLoadingFallback(): React.JSX.Element {
    return (
        <Html center>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground/70" />
        </Html>
    );
}

function GunRig({ aimX, aimY, isDark }: GunViewerProps & { isDark: boolean }): React.JSX.Element {
    const yawRef = React.useRef<Group | null>(null);
    const pitchRef = React.useRef<Group | null>(null);
    const baseY = Math.PI * 1.20;
    const baseX = -0.08;

    useFrame(() => {
        const yawGroup = yawRef.current;
        const pitchGroup = pitchRef.current;
        if (!yawGroup || !pitchGroup) return;

        const yawLeftStrength = 1.20;
        const yawRightStrength = 1.20;
        const yawOffset = aimX < 0
            ? (-aimX) * yawLeftStrength
            : -(aimX * yawRightStrength);

        const targetY = baseY + yawOffset;
        const pitchUpStrength = 0.5;
        const pitchDownStrength = 0.58;
        const pitchOffset = aimY < 0
            ? (-aimY) * pitchUpStrength
            : -(aimY * pitchDownStrength);
        const targetX = baseX - pitchOffset;

        yawGroup.rotation.y += (targetY - yawGroup.rotation.y) * 0.12;
        pitchGroup.rotation.x += (targetX - pitchGroup.rotation.x) * 0.12;
    });

    return (
        <group ref={yawRef}>
            <group ref={pitchRef}>
                <GunModel url={GLB_URL} scale={1.45} position={[0, -0.03, 0]} isDark={isDark} />
            </group>
        </group>
    );
}

export default function GunViewer({ aimX, aimY }: GunViewerProps): React.JSX.Element {
    const isDark = useIsDark();
    return (
        <div className="h-80 w-[min(96vw,38rem)] sm:h-[26rem] sm:w-[44rem] md:h-[30rem] md:w-[56rem] lg:h-[34rem] lg:w-[64rem] overflow-visible flex items-end justify-center">
            <div className="h-72 w-[min(92vw,34rem)] sm:h-96 sm:w-[40rem] md:h-[28rem] md:w-[52rem] lg:h-[32rem] lg:w-[60rem]" style={{ pointerEvents: 'none' }}>
                <Canvas
                    dpr={[1, 1.5]}
                    camera={{ position: [1.6, 0.75, 1.9], fov: 42 }}
                    gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
                    style={{ pointerEvents: 'none' }}
                >
                    <React.Suspense fallback={<ModelLoadingFallback />}>
                        <ambientLight intensity={0.18} color="#8899cc" />
                        <directionalLight position={[3, 5, 2]} intensity={2.2} color="#f0f4ff" />
                        <pointLight position={[-2.5, 1.5, 2.5]} intensity={1.8} color="#1a44ff" />
                        <pointLight position={[3, -1, 1]} intensity={0.9} color="#ffffff" />
                        <GunRig aimX={aimX} aimY={aimY} isDark={isDark} />
                        <Environment preset="night" />
                    </React.Suspense>
                </Canvas>
            </div>
        </div>
    );
}

useGLTF.preload(GLB_URL);

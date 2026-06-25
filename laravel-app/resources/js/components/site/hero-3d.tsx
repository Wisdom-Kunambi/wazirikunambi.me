import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Hero3D() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = canvas?.parentElement;
        if (!canvas || !container) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        } catch {
            return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 6);

        const geometry = new THREE.IcosahedronGeometry(1.8, 1);
        const edges = new THREE.EdgesGeometry(geometry);

        const getForegroundColor = () =>
            new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--foreground').trim() || '#0a0a0a');

        const material = new THREE.LineBasicMaterial({ color: getForegroundColor(), transparent: true, opacity: 0.6 });
        const mesh = new THREE.LineSegments(edges, material);
        scene.add(mesh);

        // Ambient + point light, needed for the lit floating orbs below
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        const pointLight = new THREE.PointLight(0xffffff, 1.4, 20);
        pointLight.position.set(3, 3, 4);
        scene.add(ambientLight, pointLight);

        // Floating wireframe boxes
        const boxGeometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const boxEdges = new THREE.EdgesGeometry(boxGeometry);
        const boxMaterial = new THREE.LineBasicMaterial({ color: getForegroundColor(), transparent: true, opacity: 0.35 });

        const boxConfigs = [
            { position: [-2.4, 1.3, -0.6], rotSpeed: 0.4, bobSpeed: 0.6, bobAmount: 0.25 },
            { position: [-1.1, -1.7, 0.9], rotSpeed: 0.6, bobSpeed: 0.45, bobAmount: 0.3 },
            { position: [2.0, -1.9, -1.1], rotSpeed: 0.3, bobSpeed: 0.7, bobAmount: 0.2 },
            { position: [-2.9, -0.5, 1.3], rotSpeed: 0.5, bobSpeed: 0.5, bobAmount: 0.28 },
            { position: [0.7, 2.1, -1.6], rotSpeed: 0.35, bobSpeed: 0.55, bobAmount: 0.22 },
        ] as const;

        const boxes = boxConfigs.map(({ position, rotSpeed, bobSpeed, bobAmount }) => {
            const box = new THREE.LineSegments(boxEdges, boxMaterial);
            box.position.set(position[0], position[1], position[2]);
            scene.add(box);
            return { mesh: box, baseY: position[1], rotSpeed, bobSpeed, bobAmount };
        });

        // Floating lit orbs
        const sphereGeometry = new THREE.SphereGeometry(0.18, 16, 16);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: getForegroundColor(),
            emissive: getForegroundColor(),
            emissiveIntensity: 0.08,
            roughness: 0.35,
            metalness: 0.15,
            transparent: true,
            opacity: 0.45,
        });

        const sphereConfigs = [
            { position: [-1.6, 0.9, 1.1], bobSpeed: 0.8, bobAmount: 0.35, wobbleSpeed: 0.5 },
            { position: [2.3, 1.7, 0.4], bobSpeed: 0.65, bobAmount: 0.45, wobbleSpeed: 0.4 },
            { position: [-0.4, -1.3, -0.9], bobSpeed: 0.9, bobAmount: 0.3, wobbleSpeed: 0.6 },
            { position: [1.1, -0.7, 1.6], bobSpeed: 0.7, bobAmount: 0.4, wobbleSpeed: 0.45 },
        ] as const;

        const orbs = sphereConfigs.map(({ position, bobSpeed, bobAmount, wobbleSpeed }) => {
            const orb = new THREE.Mesh(sphereGeometry, sphereMaterial);
            orb.position.set(position[0], position[1], position[2]);
            scene.add(orb);
            return { mesh: orb, baseX: position[0], baseY: position[1], bobSpeed, bobAmount, wobbleSpeed };
        });

        const resize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            mesh.position.x = camera.aspect > 1 ? 2.4 : 1.2;
        };
        resize();
        window.addEventListener('resize', resize);

        const pointer = { x: 0, y: 0 };
        const current = { x: 0, y: 0 };
        const onPointerMove = (e: PointerEvent) => {
            pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
            pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });

        const themeObserver = new MutationObserver(() => {
            const color = getForegroundColor();
            material.color.copy(color);
            boxMaterial.color.copy(color);
            sphereMaterial.color.copy(color);
            sphereMaterial.emissive.copy(color);
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        const clock = new THREE.Clock();
        let frameId = 0;
        const render = () => {
            const dt = clock.getDelta();
            const elapsed = clock.getElapsedTime();
            current.x += (pointer.x - current.x) * 0.04;
            current.y += (pointer.y - current.y) * 0.04;
            mesh.rotation.y += dt * 0.18 + current.x * 0.01;
            mesh.rotation.x += dt * 0.08 + current.y * 0.01;

            boxes.forEach(({ mesh: box, baseY, rotSpeed, bobSpeed, bobAmount }) => {
                box.rotation.x += dt * rotSpeed;
                box.rotation.y += dt * rotSpeed * 0.8;
                box.position.y = baseY + Math.sin(elapsed * bobSpeed) * bobAmount;
            });

            orbs.forEach(({ mesh: orb, baseX, baseY, bobSpeed, bobAmount, wobbleSpeed }) => {
                orb.position.y = baseY + Math.sin(elapsed * bobSpeed + baseX) * bobAmount;
                orb.position.x = baseX + Math.cos(elapsed * wobbleSpeed) * 0.3;
            });

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(render);
        };
        render();

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('pointermove', onPointerMove);
            themeObserver.disconnect();
            renderer.dispose();
            geometry.dispose();
            edges.dispose();
            material.dispose();
            boxGeometry.dispose();
            boxEdges.dispose();
            boxMaterial.dispose();
            sphereGeometry.dispose();
            sphereMaterial.dispose();
        };
    }, []);

    return <canvas ref={canvasRef} className="hero-3d" />;
}

import { useEffect, useRef } from 'react';
import { TechIcon } from './tech-icon';

interface Badge {
    icon: string;
    label: string;
    top: string;
    left: string;
    driftX: number;
    driftY: number;
    driftDuration: number;
    driftDelay: number;
}

const badges: Badge[] = [
    { icon: 'FaReact', label: 'React', top: '14%', left: '6%', driftX: 14, driftY: -16, driftDuration: 9, driftDelay: 0 },
    { icon: 'FaJsSquare', label: 'JavaScript', top: '70%', left: '4%', driftX: -12, driftY: 14, driftDuration: 11, driftDelay: 1.2 },
    { icon: 'FaLaravel', label: 'Laravel', top: '18%', left: '90%', driftX: -16, driftY: 12, driftDuration: 10, driftDelay: 0.6 },
    { icon: 'FaPhp', label: 'PHP', top: '78%', left: '92%', driftX: 12, driftY: -10, driftDuration: 8, driftDelay: 2 },
    { icon: 'FaNodeJs', label: 'Node.js', top: '44%', left: '96%', driftX: -10, driftY: -14, driftDuration: 12, driftDelay: 0.4 },
    { icon: 'FaGitAlt', label: 'Git', top: '90%', left: '46%', driftX: 14, driftY: 10, driftDuration: 9, driftDelay: 1.6 },
];

export function FloatingTechBadges() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const items = Array.from(container.querySelectorAll<HTMLElement>('.floating-badge'));
        const repelRadius = 110;

        const onPointerMove = (e: PointerEvent) => {
            items.forEach((item) => {
                const rect = item.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = cx - e.clientX;
                const dy = cy - e.clientY;
                const distance = Math.hypot(dx, dy);

                if (distance < repelRadius) {
                    const force = (repelRadius - distance) / repelRadius;
                    const angle = Math.atan2(dy, dx);
                    const pushX = Math.cos(angle) * force * 24;
                    const pushY = Math.sin(angle) * force * 24;
                    item.style.transform = `translate(${pushX.toFixed(2)}px, ${pushY.toFixed(2)}px)`;
                } else {
                    item.style.transform = '';
                }
            });
        };

        window.addEventListener('pointermove', onPointerMove, { passive: true });
        return () => window.removeEventListener('pointermove', onPointerMove);
    }, []);

    return (
        <div ref={containerRef} className="floating-tech-badges hidden lg:block" aria-hidden="true">
            {badges.map((badge) => (
                <div
                    key={badge.label}
                    className="floating-badge-drift"
                    style={
                        {
                            top: badge.top,
                            left: badge.left,
                            '--drift-x': `${badge.driftX}px`,
                            '--drift-y': `${badge.driftY}px`,
                            '--drift-duration': `${badge.driftDuration}s`,
                            '--drift-delay': `${badge.driftDelay}s`,
                        } as React.CSSProperties
                    }
                >
                    <div className="floating-badge">
                        <TechIcon name={badge.icon} />
                    </div>
                </div>
            ))}
        </div>
    );
}

import { useRef } from 'react';
import type { PointerEvent, ReactNode } from 'react';

interface TiltCardProps {
    children: ReactNode;
    className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        el.style.transform = `perspective(1000px) translateY(-6px) scale(1.015) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
    };

    const handlePointerLeave = () => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = '';
    };

    return (
        <div ref={ref} className={`tilt-card ${className ?? ''}`} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
            {children}
        </div>
    );
}

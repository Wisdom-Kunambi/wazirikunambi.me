import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { type ReactNode, useEffect, useRef } from 'react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

interface ScrollSectionProps {
    children: ReactNode;
    className?: string;
    once?: boolean;
}

export function ScrollSection({ children, className, once = true }: ScrollSectionProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const tween = gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            {
                opacity: 1,
                y: 0,
                duration: 0.75,
                ease: 'power2.out',
                scrollTrigger: { trigger: el, start: 'top 86%', once },
            },
        );

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [once]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

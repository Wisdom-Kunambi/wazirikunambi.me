import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useTransform,
} from 'motion/react';
import React, { useLayoutEffect, useRef, useState } from 'react';

const TECH_STRING =
    'React • Next.js • TypeScript • JavaScript • Node.js • Express.js • Python • PostgreSQL • MongoDB • Tailwind CSS • GSAP • Three.js • Git • Docker • AWS • GraphQL • Redis • HTML5 • CSS3 • Laravel • PHP • MySQL • ';

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
    const [width, setWidth] = useState(0);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        const apply = (): void => setWidth(el.offsetWidth);
        apply();
        if (typeof ResizeObserver !== 'undefined') {
            const ro = new ResizeObserver(() => apply());
            ro.observe(el);
            return () => ro.disconnect();
        }
        window.addEventListener('resize', apply, { passive: true });
        return () => window.removeEventListener('resize', apply);
    }, [ref]);
    return width;
}

function VelocityText({
    children,
    baseVelocity = 80,
    isMobile = false,
    paused = false,
}: {
    children: React.ReactNode;
    baseVelocity?: number;
    isMobile?: boolean;
    paused?: boolean;
}) {
    const baseX = useMotionValue(0);
    const copyRef = useRef<HTMLSpanElement>(null);
    const copyWidth = useElementWidth(copyRef);

    function wrap(min: number, max: number, v: number): number {
        if (max === min) return 0;
        const range = max - min;
        const mod = (((v - min) % range) + range) % range;
        return mod + min;
    }

    const x = useTransform(baseX, (v) => {
        if (copyWidth === 0) return '0px';
        return `${wrap(-copyWidth, 0, v)}px`;
    });

    useAnimationFrame((_t, delta) => {
        if (paused || copyWidth === 0) return;
        baseX.set(baseX.get() + baseVelocity * (delta / 1000));
    });

    const numCopies = isMobile ? 4 : 6;

    return (
        <div className="parallax overflow-hidden w-full">
            <motion.div
                className="scroller"
                style={{
                    x,
                    display: 'flex',
                    gap: 'clamp(1rem, 3vw, 3rem)',
                    paddingLeft: 'clamp(0.75rem, 2vw, 1.5rem)',
                    paddingRight: 'clamp(0.75rem, 2vw, 1.5rem)',
                    willChange: 'transform',
                    width: 'max-content',
                }}
            >
                {Array.from({ length: numCopies }).map((_, i) => (
                    <span
                        key={i}
                        ref={i === 0 ? copyRef : null}
                        className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-foreground/20 hover:text-foreground/40 transition-colors duration-300 uppercase tracking-tighter italic whitespace-nowrap shrink-0"
                    >
                        {children}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

export function SkillsMarquee() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isMobile, setIsMobile] = React.useState(false);
    const [marqueeActive, setMarqueeActive] = React.useState(true);

    React.useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const sync = (): void => setIsMobile(mq.matches);
        sync();
        mq.addEventListener('change', sync);
        return () => mq.removeEventListener('change', sync);
    }, []);

    React.useEffect(() => {
        const el = sectionRef.current;
        if (!el || typeof IntersectionObserver === 'undefined') {
            setMarqueeActive(true);
            return;
        }
        const io = new IntersectionObserver(
            ([entry]) => setMarqueeActive(entry?.isIntersecting ?? false),
            { root: null, rootMargin: '100px 0px', threshold: 0 },
        );
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="skills-section relative bg-background overflow-hidden py-8 sm:py-12 md:py-16 lg:py-24">
            <div className="absolute inset-y-0 left-0 w-12 sm:w-16 md:w-24 lg:w-32 bg-linear-to-r from-background via-background/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-12 sm:w-16 md:w-24 lg:w-32 bg-linear-to-l from-background via-background/80 to-transparent z-20 pointer-events-none" />

            <div className="relative z-10 overflow-hidden space-y-4 sm:space-y-6 md:space-y-8">
                <VelocityText baseVelocity={isMobile ? 60 : 80} isMobile={isMobile} paused={!marqueeActive}>
                    {TECH_STRING}
                </VelocityText>
                <VelocityText baseVelocity={isMobile ? -60 : -80} isMobile={isMobile} paused={!marqueeActive}>
                    {TECH_STRING}
                </VelocityText>
            </div>
        </section>
    );
}

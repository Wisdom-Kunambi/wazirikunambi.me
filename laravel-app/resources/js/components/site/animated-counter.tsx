import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
    value: number;
    prefix?: string;
    suffix?: string;
    duration?: number;
    className?: string;
}

export function AnimatedCounter({ value, prefix = '', suffix = '', duration = 1.6, className }: AnimatedCounterProps) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            el.textContent = `${prefix}${value}${suffix}`;
            return;
        }

        const counter = { current: 0 };
        const tween = gsap.to(counter, {
            current: value,
            duration,
            ease: 'power2.out',
            paused: true,
            onUpdate: () => {
                el.textContent = `${prefix}${Math.round(counter.current)}${suffix}`;
            },
        });

        const trigger = ScrollTrigger.create({
            trigger: el,
            start: 'top 85%',
            once: true,
            onEnter: () => tween.play(),
        });

        return () => {
            tween.kill();
            trigger.kill();
        };
    }, [value, prefix, suffix, duration]);

    return (
        <span ref={ref} className={`counter-value ${className ?? ''}`}>
            {prefix}0{suffix}
        </span>
    );
}

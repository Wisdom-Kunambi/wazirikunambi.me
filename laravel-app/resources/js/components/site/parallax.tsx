import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef, type HTMLAttributes } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxProps extends HTMLAttributes<HTMLDivElement> {
    speed?: number;
}

export function Parallax({ children, speed = 60, className, ...rest }: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const tween = gsap.fromTo(
            el,
            { y: -speed },
            {
                y: speed,
                ease: 'none',
                scrollTrigger: {
                    trigger: el.parentElement ?? el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true,
                },
            },
        );

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [speed]);

    return (
        <div ref={ref} className={`parallax-layer ${className ?? ''}`} {...rest}>
            {children}
        </div>
    );
}

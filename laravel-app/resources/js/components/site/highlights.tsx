import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { AnimatedCounter } from './animated-counter';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
    value: number;
    suffix?: string;
    label: string;
}

const stats: Stat[] = [
    { value: 4, suffix: '+', label: 'Years of experience' },
    { value: 50, suffix: '+', label: 'Projects delivered' },
    { value: 30, suffix: '+', label: 'Technologies used' },
    { value: 10, suffix: '+', label: 'Certifications earned' },
];

export function Highlights() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const items = gsap.utils.toArray<HTMLElement>('.stagger-item', section);
        gsap.set(items, { opacity: 0, y: 24 });

        const tl = gsap.timeline({ paused: true }).to(items, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
        });

        const trigger = ScrollTrigger.create({
            trigger: section,
            start: 'top 78%',
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => tl.play(),
        });

        return () => {
            tl.kill();
            trigger.kill();
        };
    }, []);

    return (
        <section ref={sectionRef} className="border-t border-border px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-14 xl:px-20">
            <div className="stagger-item mb-10 flex items-center gap-3 sm:mb-14">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 sm:text-xs">By the numbers</span>
                <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="stagger-item">
                        <div className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-black leading-none tracking-tight text-foreground">
                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                        </div>
                        <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55 sm:text-xs">{stat.label}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { awards } from '@/data/resume';
import { Reveal } from './reveal';
import { SplitHeading } from './split-heading';

gsap.registerPlugin(ScrollTrigger);

function splitAward(award: string): { provider: string; title: string } {
    const [provider, ...rest] = award.split(' — ');
    return rest.length > 0 ? { provider, title: rest.join(' — ') } : { provider: 'Certification', title: award };
}

export function Achievements() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const cards = gsap.utils.toArray<HTMLElement>('.home-achievement-card', sectionRef.current ?? undefined);
        gsap.set(cards, { opacity: 0, y: 30 });

        const tween = gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: 'top 80%',
            },
        });

        return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, []);

    return (
        <section ref={sectionRef} className="border-t border-border px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-14 xl:px-20">
            <Reveal className="mb-10 sm:mb-14">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 sm:text-xs">Achievements</span>
                <SplitHeading
                    as="h2"
                    lines={['Recognition', '& Milestones']}
                    className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.95] tracking-tight"
                />
            </Reveal>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
                {awards.map((award) => {
                    const { provider, title } = splitAward(award);
                    return (
                        <article
                            key={award}
                            className="home-achievement-card group relative rounded-sm border border-border bg-muted/30 p-5 transition-colors duration-300 hover:border-foreground/25 hover:bg-muted md:p-6"
                        >
                            <div className="mb-5 flex items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-foreground/50">
                                <span>{provider}</span>
                                <div className="h-px flex-1 bg-border" />
                            </div>
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-sm border border-border bg-muted transition-colors group-hover:border-foreground/25">
                                <Award className="h-6 w-6 text-foreground" />
                            </div>
                            <h3 className="text-base font-black uppercase leading-tight tracking-tight text-foreground transition-colors group-hover:text-foreground/90 md:text-lg">
                                {title}
                            </h3>
                        </article>
                    );
                })}
            </div>
        </section>
    );
}

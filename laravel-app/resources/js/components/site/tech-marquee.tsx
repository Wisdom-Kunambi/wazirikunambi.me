import { Fragment, useEffect, useRef } from 'react';

const techStack = [
    'React',
    'Next.js',
    'TypeScript',
    'JavaScript',
    'Laravel',
    'PHP',
    'Node.js',
    'Tailwind CSS',
    'GSAP',
    'Three.js',
    'MySQL',
    'Git',
];

function TechMarqueeContent({ reverse, ariaHidden }: { reverse?: boolean; ariaHidden?: boolean }) {
    return (
        <span className="flex items-center gap-8 whitespace-nowrap pr-8 sm:gap-12 sm:pr-12" aria-hidden={ariaHidden}>
            {techStack.map((tech, i) => (
                <Fragment key={i}>
                    <span
                        className={`text-2xl font-black uppercase italic tracking-tighter transition-colors duration-300 sm:text-3xl md:text-5xl lg:text-6xl ${
                            reverse ? 'text-foreground/15 hover:text-foreground/35' : 'text-foreground/20 hover:text-foreground/40'
                        }`}
                    >
                        {tech}
                    </span>
                    <span className="text-foreground/15" aria-hidden="true">
                        &bull;
                    </span>
                </Fragment>
            ))}
        </span>
    );
}

export function TechMarquee() {
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                section.classList.toggle('is-offscreen', !entry?.isIntersecting);
            },
            { threshold: 0 },
        );
        observer.observe(section);

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="tech-marquee-section relative overflow-hidden bg-background py-8 sm:py-12 md:py-16">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent sm:w-32" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent sm:w-32" />

            <div className="space-y-4 sm:space-y-6 md:space-y-8">
                <div className="tech-marquee-track flex items-center">
                    <TechMarqueeContent />
                    <TechMarqueeContent ariaHidden />
                </div>
                <div className="tech-marquee-track tech-marquee-track-reverse flex items-center">
                    <TechMarqueeContent reverse />
                    <TechMarqueeContent reverse ariaHidden />
                </div>
            </div>
        </section>
    );
}

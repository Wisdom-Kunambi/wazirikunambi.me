import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Fragment, useEffect, useRef, type ElementType } from 'react';

gsap.registerPlugin(ScrollTrigger);

interface SplitHeadingProps {
    as?: ElementType;
    lines: string[];
    className?: string;
}

export function SplitHeading({ as: Tag = 'h2', lines, className }: SplitHeadingProps) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.classList.add('gsap-split');
        const words = el.querySelectorAll<HTMLElement>('.split-word-inner');

        const rotateTween = gsap.fromTo(
            el,
            { transformOrigin: '0% 50%', rotate: 4 },
            {
                rotate: 0,
                ease: 'none',
                scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 55%', scrub: true },
            },
        );

        const wordsTween = gsap.fromTo(
            words,
            { opacity: 0.15, filter: 'blur(6px)' },
            {
                opacity: 1,
                filter: 'blur(0px)',
                ease: 'none',
                stagger: 0.04,
                scrollTrigger: { trigger: el, start: 'top bottom-=10%', end: 'top 55%', scrub: true },
            },
        );

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        el.classList.add('in-view');
                        observer.unobserve(el);
                    }
                });
            },
            { threshold: 0.15 },
        );
        observer.observe(el);

        return () => {
            rotateTween.scrollTrigger?.kill();
            rotateTween.kill();
            wordsTween.scrollTrigger?.kill();
            wordsTween.kill();
            observer.disconnect();
        };
    }, [lines]);

    let counter = 0;

    return (
        <Tag ref={ref} className={className}>
            {lines.map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                    {lineIndex > 0 && <br />}
                    {line
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean)
                        .map((word, wordIndex) => {
                            const i = counter++;
                            return (
                                <Fragment key={wordIndex}>
                                    {wordIndex > 0 && ' '}
                                    <span className="split-word">
                                        <span className="split-word-inner" style={{ '--i': i } as React.CSSProperties}>
                                            {word}
                                        </span>
                                    </span>
                                </Fragment>
                            );
                        })}
                </Fragment>
            ))}
        </Tag>
    );
}

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

interface RevealProps {
    as?: ElementType;
    children: ReactNode;
    className?: string;
    delay?: number;
    id?: string;
}

export function Reveal({ as: Tag = 'div', children, className, delay, id }: RevealProps) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

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

        return () => observer.disconnect();
    }, []);

    return (
        <Tag ref={ref} id={id} className={`reveal ${className ?? ''}`} style={delay ? { transitionDelay: `${delay}s` } : undefined}>
            {children}
        </Tag>
    );
}

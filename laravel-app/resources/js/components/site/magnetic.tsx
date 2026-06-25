import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import type { ComponentPropsWithoutRef } from 'react';

function useMagneticRef<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
        const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

        const onPointerMove = (e: PointerEvent) => {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - (rect.left + rect.width / 2);
            const relY = e.clientY - (rect.top + rect.height / 2);
            xTo(relX * 0.3);
            yTo(relY * 0.3);
        };

        const onPointerLeave = () => {
            xTo(0);
            yTo(0);
        };

        el.addEventListener('pointermove', onPointerMove);
        el.addEventListener('pointerleave', onPointerLeave);

        return () => {
            el.removeEventListener('pointermove', onPointerMove);
            el.removeEventListener('pointerleave', onPointerLeave);
        };
    }, []);

    return ref;
}

export function MagneticLink({ className, children, ...rest }: ComponentPropsWithoutRef<'a'>) {
    const ref = useMagneticRef<HTMLAnchorElement>();
    return (
        <a ref={ref} className={`magnetic-btn ${className ?? ''}`} {...rest}>
            {children}
        </a>
    );
}

export function MagneticButton({ className, children, ...rest }: ComponentPropsWithoutRef<'button'>) {
    const ref = useMagneticRef<HTMLButtonElement>();
    return (
        <button ref={ref} className={`magnetic-btn ${className ?? ''}`} {...rest}>
            {children}
        </button>
    );
}

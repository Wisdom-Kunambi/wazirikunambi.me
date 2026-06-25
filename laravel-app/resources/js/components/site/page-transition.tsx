import { router } from '@inertiajs/react';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export function PageTransition() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const removeStart = router.on('start', (event) => {
            if (event.detail.visit.method !== 'get') return;
            gsap.killTweensOf(el);
            gsap.set(el, { transformOrigin: 'bottom', scaleY: 0 });
            gsap.to(el, { scaleY: 1, duration: 0.45, ease: 'power3.inOut' });
        });

        const removeFinish = router.on('finish', (event) => {
            if (event.detail.visit.method !== 'get') return;
            gsap.killTweensOf(el);
            gsap.set(el, { transformOrigin: 'top' });
            gsap.to(el, { scaleY: 0, duration: 0.5, ease: 'power3.inOut', delay: 0.05 });
        });

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    return <div ref={ref} id="page-transition" aria-hidden="true" />;
}

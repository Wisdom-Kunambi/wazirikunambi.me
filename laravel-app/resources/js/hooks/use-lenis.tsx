import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export function LenisProvider({ children }: { children: ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        const instance = new Lenis({ duration: 1.1, smoothWheel: true });
        const update = (time: number) => instance.raf(time * 1000);

        instance.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(update);
        gsap.ticker.lagSmoothing(0);

        setLenis(instance);

        return () => {
            gsap.ticker.remove(update);
            instance.destroy();
            setLenis(null);
        };
    }, []);

    return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function useLenis() {
    return useContext(LenisContext);
}

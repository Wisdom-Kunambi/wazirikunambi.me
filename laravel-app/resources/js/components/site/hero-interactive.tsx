import { Link } from '@inertiajs/react';
import { ArrowDownRight } from 'lucide-react';
import { m, type Variants } from 'motion/react';
import * as React from 'react';

export const HERO_MOTION_ORIGIN: React.CSSProperties = { transformOrigin: 'center' };

export type HeroEnterDrift = 'left' | 'right' | 'center';

function useReducedMotion() {
    const [reduce, setReduce] = React.useState(false);
    React.useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReduce(mq.matches);
        const cb = () => setReduce(mq.matches);
        mq.addEventListener('change', cb);
        return () => mq.removeEventListener('change', cb);
    }, []);
    return reduce;
}

function driftItemVariants(reduceMotion: boolean, drift: HeroEnterDrift): Variants {
    if (reduceMotion) {
        return { hidden: { opacity: 1, x: 0, y: 0 }, visible: { opacity: 1, x: 0, y: 0 } };
    }
    const xHidden = drift === 'left' ? 28 : drift === 'right' ? -28 : 0;
    return {
        hidden: { opacity: 0, x: xHidden, y: drift === 'center' ? 10 : 0 },
        visible: {
            opacity: 1, x: 0, y: 0,
            transition: { type: 'tween', duration: 0.28, ease: [0.22, 1, 0.36, 1] },
        },
    };
}

export function HeroMotionRoot({ children, className }: { children: React.ReactNode; className?: string }) {
    const reduceMotion = useReducedMotion();
    const containerVariants = React.useMemo<Variants>(() => ({
        hidden: {},
        visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.018, delayChildren: 0 } },
    }), [reduceMotion]);

    return (
        <m.div className={`transform-gpu ${className ?? ''}`} variants={containerVariants} initial="hidden" animate="visible">
            {children}
        </m.div>
    );
}

export function HeroEnterBlock({ children, className, drift = 'center' }: { children: React.ReactNode; className?: string; drift?: HeroEnterDrift }) {
    const reduceMotion = useReducedMotion();
    const variants = React.useMemo(() => driftItemVariants(reduceMotion, drift), [reduceMotion, drift]);
    return (
        <m.div className={`transform-gpu ${className ?? ''}`} variants={variants} style={HERO_MOTION_ORIGIN}>
            {children}
        </m.div>
    );
}

export function HeroEnterSplitRow({ className, left, right }: { className?: string; left: React.ReactNode; right: React.ReactNode }) {
    const reduceMotion = useReducedMotion();
    const rowVariants = React.useMemo<Variants>(() => ({
        hidden: {},
        visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.018 } },
    }), [reduceMotion]);
    const leftVariants = React.useMemo(() => driftItemVariants(reduceMotion, 'left'), [reduceMotion]);
    const rightVariants = React.useMemo(() => driftItemVariants(reduceMotion, 'right'), [reduceMotion]);

    return (
        <m.div className={`grid transform-gpu grid-cols-[1fr_auto] items-start gap-4 ${className ?? ''}`} variants={rowVariants}>
            <m.div variants={leftVariants} style={HERO_MOTION_ORIGIN} className="min-w-0 transform-gpu">{left}</m.div>
            <m.div variants={rightVariants} style={HERO_MOTION_ORIGIN} className="shrink-0 transform-gpu">{right}</m.div>
        </m.div>
    );
}

export function HeroBackdrop() {
    const reduceMotion = useReducedMotion();
    return (
        <div
            className={`hero-backdrop-root pointer-events-none absolute inset-0 z-0 overflow-hidden${!reduceMotion ? ' hero-backdrop-reveal' : ''}`}
            aria-hidden
            style={HERO_MOTION_ORIGIN}
        >
            <div className="hero-backdrop-grid absolute inset-0 opacity-[0.04] dark:opacity-[0.12]" />
            {!reduceMotion ? (
                <>
                    <div className="hero-backdrop-orb-a absolute -left-[18%] top-[12%] h-[min(42vw,420px)] w-[min(42vw,420px)] rounded-full bg-foreground/[0.045] blur-2xl" aria-hidden />
                    <div className="hero-backdrop-orb-b absolute -right-[12%] bottom-[18%] h-[min(36vw,360px)] w-[min(36vw,360px)] rounded-full bg-foreground/[0.055] blur-2xl" aria-hidden />
                </>
            ) : null}
        </div>
    );
}

export function HeroInteractivePortrait({ children, frameClassName }: { children: React.ReactNode; frameClassName?: string }) {
    return (
        <div className="group relative">
            <div className={`relative overflow-hidden border border-border bg-muted/60 shadow-none transition-shadow duration-300 ease-out hover:shadow-xl ${frameClassName ?? ''}`}>
                <div aria-hidden className="pointer-events-none absolute inset-0 z-[1] bg-linear-to-t from-foreground/18 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-0 h-full w-full">
                    <div className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]">
                        {children}
                    </div>
                </div>
                <span className="pointer-events-none absolute left-2 top-2 z-[2] h-3 w-3 border-l border-t border-foreground/30 opacity-50 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                <span className="pointer-events-none absolute right-2 top-2 z-[2] h-3 w-3 border-r border-t border-foreground/30 opacity-50 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                <span className="pointer-events-none absolute bottom-2 left-2 z-[2] h-3 w-3 border-l border-b border-foreground/30 opacity-50 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
                <span className="pointer-events-none absolute bottom-2 right-2 z-[2] h-3 w-3 border-r border-b border-foreground/30 opacity-50 transition-opacity duration-300 group-hover:opacity-100" aria-hidden />
            </div>
        </div>
    );
}

const STACK_CHIPS = [
    { label: 'React', href: '/resume' },
    { label: 'JavaScript', href: '/resume' },
    { label: 'Next.js', href: '/resume' },
    { label: 'Laravel', href: '/resume' },
] as const;

export function HeroTechChips() {
    return (
        <div className="flex flex-wrap gap-2" data-shoot-ui="1">
            {STACK_CHIPS.map((item) => (
                <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.22em] text-foreground/65 transition-[border-color,background-color,transform,box-shadow] duration-200 hover:border-foreground/35 hover:bg-muted hover:text-foreground/85 active:scale-[0.97]"
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
}

export function HeroAvailability() {
    return (
        <div data-shoot-ui="1" className="inline-flex max-w-44 items-center gap-2 rounded-full border border-border bg-muted/60 px-2.5 py-1 sm:max-w-none">
            <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/35" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600/90" />
            </span>
            <span className="text-[9px] font-mono uppercase leading-tight tracking-[0.18em] text-foreground/58">Open for work</span>
        </div>
    );
}

export function HeroExploreLink({ className }: { className?: string }) {
    return (
        <div className={className} data-shoot-ui="1">
            <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-3 py-2 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground/70 transition-[border-color,background-color,color,transform] duration-200 hover:border-foreground/40 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                <span>Selected work</span>
                <span className="inline-flex" aria-hidden>
                    <ArrowDownRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
                </span>
            </a>
        </div>
    );
}

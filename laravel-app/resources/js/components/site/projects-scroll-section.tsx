import { Link } from '@inertiajs/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { memo, useCallback, useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { featuredProjects, type Project } from '@/data/projects';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const DESKTOP_MQ = '(min-width: 1024px)';

function categoryLabel(p: Project): string {
    return p.tags.slice(0, 2).map((t) => `[${t.toUpperCase()}]`).join(' — ');
}

function tagsLine(p: Project): string {
    return p.tags.slice(0, 3).map((t) => `[${t.toUpperCase()}]`).join(' — ');
}

type GalleryProps = {
    viewportRef: RefObject<HTMLDivElement | null>;
    trackRef: RefObject<HTMLDivElement | null>;
    projects: readonly Project[];
    activeIndex: number;
};

const DesktopGallery = memo(function DesktopGallery({ viewportRef, trackRef, projects, activeIndex }: GalleryProps) {
    const project = projects[activeIndex] ?? projects[0]!;
    const sourceTitle = project?.title ?? '';
    const [typedTitle, setTypedTitle] = useState(sourceTitle);

    useEffect(() => {
        const reduceMotion =
            typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) { setTypedTitle(sourceTitle); return; }
        if (!sourceTitle) { setTypedTitle(''); return; }
        setTypedTitle('');
        let i = 0;
        const id = window.setInterval(() => {
            i += 1;
            setTypedTitle(sourceTitle.slice(0, i));
            if (i >= sourceTitle.length) window.clearInterval(id);
        }, 28);
        return () => window.clearInterval(id);
    }, [sourceTitle]);

    return (
        <div
            className="relative flex w-full flex-col border border-border bg-background"
            style={{ height: 'clamp(480px, 88vh, 960px)', minHeight: '480px' }}
        >
            {/* Corner accents */}
            <span className="pointer-events-none absolute left-0 top-0 z-30 h-4 w-4 border-l-2 border-t-2 border-foreground/30" aria-hidden />
            <span className="pointer-events-none absolute right-0 top-0 z-30 h-4 w-4 border-r-2 border-t-2 border-foreground/30" aria-hidden />
            <span className="pointer-events-none absolute bottom-0 left-0 z-30 h-4 w-4 border-b-2 border-l-2 border-foreground/30" aria-hidden />
            <span className="pointer-events-none absolute bottom-0 right-0 z-30 h-4 w-4 border-b-2 border-r-2 border-foreground/30" aria-hidden />

            {/* Viewport — clips the card track */}
            <div
                ref={viewportRef}
                className="relative w-full"
                style={{ flex: '1 1 0', minHeight: 0, overflow: 'clip' }}
            >
                {/* Card track — GSAP animates this */}
                <div
                    ref={trackRef}
                    className="absolute inset-0 flex flex-col will-change-transform"
                    style={{ gap: '1px' }}
                >
                    {projects.map((p, idx) => (
                        <div
                            key={p.slug}
                            className="w-full shrink-0 bg-muted"
                            style={{ height: '100%' }}
                            data-shoot-target="1"
                            data-shoot-impact-only="1"
                        >
                            <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group/card block h-full w-full"
                                tabIndex={-1}
                            >
                                <img
                                    src={p.image}
                                    alt={p.title}
                                    loading={idx === 0 ? 'eager' : 'lazy'}
                                    decoding="async"
                                    className="h-full w-full object-contain transition-transform duration-700 group-hover/card:scale-[1.02]"
                                />
                            </a>
                        </div>
                    ))}
                </div>

                {/* Info overlay — bottom-anchored, centered text */}
                <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-end">
                    <div className="bg-gradient-to-t from-black/95 via-black/75 via-[45%] to-transparent px-5 pb-10 pt-20 text-center sm:px-8 sm:pb-12 sm:pt-24 lg:px-10 lg:pb-14 xl:px-14 xl:pb-16">
                        {/* Counter */}
                        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/55 sm:text-xs lg:text-xs xl:text-sm">
                            {String(activeIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                        </p>

                        {/* Title */}
                        <h3
                            className="mt-2 font-black uppercase leading-[0.95] tracking-tight text-white sm:mt-3"
                            aria-live="polite"
                            style={{ fontSize: 'clamp(1.5rem, 4vw, 4.5rem)', minHeight: '1.1em' }}
                        >
                            {typedTitle}
                        </h3>

                        {/* Category tag line */}
                        <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.22em] text-white/65 sm:mt-3 sm:text-[11px] lg:text-xs xl:text-sm">
                            {categoryLabel(project)}
                        </p>

                        {/* Tech chips */}
                        <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:mt-4 sm:gap-2 lg:gap-2.5">
                            {project.tags.slice(0, 4).map((tech) => (
                                <span
                                    key={tech}
                                    className="rounded-full border border-white/30 bg-white/12 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white sm:text-[10px] lg:px-3 lg:py-1 lg:text-[11px] xl:text-xs"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Progress bars */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-5 pb-3 sm:px-8 sm:pb-4 lg:px-10 lg:pb-5 xl:px-14">
                    <div className="flex gap-2 sm:gap-2.5">
                        {projects.map((p, i) => (
                            <div
                                key={p.slug}
                                className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-white/20"
                                title={p.title}
                            >
                                <div
                                    className="h-full origin-left rounded-full bg-white transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
                                    style={{
                                        transform: `scaleX(${i <= activeIndex ? 1 : 0.15})`,
                                        opacity: i === activeIndex ? 1 : i < activeIndex ? 0.5 : 0.2,
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <p className="sr-only">Project {activeIndex + 1} of {projects.length}. {project.title}.</p>
                    <p className="mt-1.5 text-center font-mono text-[8px] uppercase tracking-[0.3em] text-white/40 sm:text-[9px] lg:text-[10px]">
                        Scroll to explore
                    </p>
                </div>
            </div>
        </div>
    );
});

export function ProjectsScrollSection() {
    const projects = useMemo(() => [...featuredProjects].sort(() => Math.random() - 0.5), []);
    const count = projects.length;

    const sectionRef = useRef<HTMLElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const pinnedSTRef = useRef<ScrollTrigger | null>(null);
    const lastIdxRef = useRef(0);
    const rafRef = useRef(0);
    const queuedIdxRef = useRef(0);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollToProject = useCallback(
        (index: number) => {
            if (typeof window === 'undefined') return;
            if (!window.matchMedia(DESKTOP_MQ).matches) return;
            const st = pinnedSTRef.current;
            if (st) {
                const progress = index / Math.max(count - 1, 1);
                window.scrollTo({ top: st.start + (st.end - st.start) * progress, behavior: 'smooth' });
            }
            lastIdxRef.current = index;
            setActiveIndex(index);
        },
        [count],
    );

    useEffect(() => {
        const section = sectionRef.current;
        if (!section) return;

        const ctx = gsap.context(() => {
            const mm = gsap.matchMedia();

            mm.add(DESKTOP_MQ, () => {
                const viewport = viewportRef.current;
                const track = trackRef.current;
                if (!viewport || !track) return () => {};

                const pinScrollPx = () => Math.round(window.innerHeight * (1.6 + count * 0.55));

                const tl = gsap.fromTo(
                    track,
                    { y: 0 },
                    {
                        y: () => -Math.max(0, track.scrollHeight - viewport.clientHeight),
                        ease: 'none',
                        scrollTrigger: {
                            trigger: section,
                            start: 'top top',
                            end: () => `+=${pinScrollPx()}`,
                            pin: true,
                            pinSpacing: true,
                            pinType: 'transform',
                            scrub: 0.5,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                            fastScrollEnd: true,
                            onUpdate: (self) => {
                                const idx =
                                    count <= 1
                                        ? 0
                                        : Math.min(Math.round(self.progress * (count - 1)), count - 1);
                                queuedIdxRef.current = idx;
                                if (rafRef.current !== 0) return;
                                rafRef.current = window.requestAnimationFrame(() => {
                                    rafRef.current = 0;
                                    const i = queuedIdxRef.current;
                                    if (i !== lastIdxRef.current) {
                                        lastIdxRef.current = i;
                                        setActiveIndex(i);
                                    }
                                });
                            },
                        },
                    },
                );

                pinnedSTRef.current = tl.scrollTrigger ?? null;

                return () => {
                    pinnedSTRef.current = null;
                    tl.scrollTrigger?.kill();
                };
            });
        }, sectionRef);

        return () => {
            if (rafRef.current !== 0) { window.cancelAnimationFrame(rafRef.current); rafRef.current = 0; }
            pinnedSTRef.current = null;
            ctx.revert();
        };
    }, [count]);

    return (
        <section
            ref={sectionRef}
            id="projects"
            className="projects-section border-t border-border bg-background text-foreground"
            style={{ scrollMarginTop: 'var(--app-header-h, 80px)' }}
            aria-label="Projects"
        >
            <div className="mx-auto w-full max-w-[1920px] px-4 py-12 sm:px-6 md:px-10 lg:px-14 xl:px-18">

                {/* ── Mobile (< lg): stacked articles ── */}
                <div className="lg:hidden">
                    <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/45">
                        02 / Selected Work
                    </span>
                    <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-tighter text-foreground sm:text-4xl md:text-5xl">
                        Featured Work
                    </h2>
                    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-foreground/55 sm:text-base md:text-lg">
                        I build websites where every scroll, every transition, and every interaction feels intentional.
                    </p>

                    <div className="mt-12 flex flex-col gap-14 sm:mt-14 sm:gap-16">
                        {projects.map((project, index) => (
                            <article key={project.slug} className="w-full">
                                <a
                                    href={project.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block outline-none ring-foreground/30 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                                >
                                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm border border-border bg-muted">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            loading={index === 0 ? 'eager' : 'lazy'}
                                            decoding="async"
                                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                                        />
                                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
                                    </div>
                                    <h3 className="mt-4 text-lg font-black uppercase leading-tight tracking-tight text-foreground sm:mt-5 sm:text-2xl md:text-3xl">
                                        {project.title}
                                    </h3>
                                    <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-foreground/55 sm:text-xs md:text-sm">
                                        {tagsLine(project)}
                                    </p>
                                </a>
                            </article>
                        ))}
                    </div>

                    <div className="mt-12 border-t border-border pt-10">
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-3 bg-foreground px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-foreground/85"
                        >
                            View all
                        </Link>
                    </div>
                </div>

                {/* ── Desktop (lg+): sidebar + pinned gallery ── */}
                <div className="hidden lg:flex lg:flex-row lg:items-start lg:gap-10 xl:gap-14">

                    {/* Left sidebar */}
                    <div className="flex w-[280px] shrink-0 flex-col xl:w-[320px]">
                        <span className="mb-3 block font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/45">
                            Selected Projects
                        </span>
                        <h2 className="text-3xl font-black uppercase leading-[0.95] tracking-tighter text-foreground lg:text-4xl xl:text-5xl 2xl:text-6xl">
                            Featured<br />Work
                        </h2>
                        <p className="mt-5 text-sm leading-relaxed text-foreground/55 xl:text-base">
                            I build websites where every scroll, every transition, and every interaction feels intentional.
                        </p>

                        {/* Thumbnail nav */}
                        <div className="mt-8 flex flex-col gap-3">
                            {projects.map((project, index) => {
                                const isActive = activeIndex === index;
                                return (
                                    <button
                                        key={project.slug}
                                        type="button"
                                        onClick={() => scrollToProject(index)}
                                        className="group flex items-center gap-3 rounded-sm text-left outline-none ring-foreground/30 focus-visible:ring-2"
                                        aria-label={`View ${project.title}`}
                                    >
                                        <div
                                            className="relative h-14 w-24 shrink-0 origin-left overflow-hidden rounded-sm border border-border bg-muted transition-[transform,opacity] duration-300"
                                            style={{ transform: isActive ? 'scale(1)' : 'scale(0.78)', opacity: isActive ? 1 : 0.6 }}
                                        >
                                            <img
                                                src={project.image}
                                                alt=""
                                                loading="eager"
                                                decoding="async"
                                                className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                                            />
                                            {isActive && (
                                                <span className="pointer-events-none absolute inset-0 rounded-sm border-2 border-foreground/50" aria-hidden />
                                            )}
                                        </div>
                                        <span className="relative h-2 w-2 shrink-0" aria-hidden>
                                            <span
                                                className={`absolute inset-0 rounded-[2px] transition-colors duration-200 ${isActive ? 'bg-foreground' : 'bg-muted-foreground/40 group-hover:bg-muted-foreground/70'}`}
                                            />
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-10">
                            <Link
                                href="/projects"
                                className="inline-flex items-center gap-3 bg-foreground px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-background transition-colors hover:bg-foreground/85"
                            >
                                View all
                            </Link>
                        </div>
                    </div>

                    {/* Right gallery */}
                    <div className="min-w-0 flex-1">
                        <DesktopGallery
                            viewportRef={viewportRef}
                            trackRef={trackRef}
                            projects={projects}
                            activeIndex={activeIndex}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

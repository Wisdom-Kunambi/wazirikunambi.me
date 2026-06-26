import { Link, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { Moon, Star, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { navLinks, socialLinks, type NavLink as NavLinkType } from '@/data/site';
import { SITE_BASE } from '@/lib/utils';

const siteHref = (path: string) => SITE_BASE.slice(0, -1) + path;

const NAV_SOLID_BG_SCROLL_PX = 24;

interface SiteNavProps {
    onMenuOpen: () => void;
    menuOpen: boolean;
}

export function SiteNav({ onMenuOpen, menuOpen }: SiteNavProps) {
    const { url } = usePage();
    const currentPath = url.split('#')[0].split('?')[0] || '/';
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [currentTime, setCurrentTime] = useState('');
    const [stars, setStars] = useState<number | null>(null);
    const [themeReady, setThemeReady] = useState(false);
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
    const navRef = useRef<HTMLElement>(null);

    useEffect(() => { setThemeReady(true); }, []);

    useEffect(() => {
        const detect = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setResolvedTheme(isDark ? 'dark' : 'light');
        };
        detect();
        const observer = new MutationObserver(detect);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', !isDark);
        localStorage.setItem('appearance', isDark ? 'light' : 'dark');
    };

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
            const h = now.getHours() % 12 || 12;
            const m = now.getMinutes().toString().padStart(2, '0');
            const ampm = now.getHours() >= 12 ? 'P.M' : 'A.M';
            setCurrentTime(`${days[now.getDay()]} ${h}:${m} ${ampm}`);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        fetch('https://api.github.com/repos/Wisdom-Kunambi/wazirikunambi.me')
            .then((r) => r.json())
            .then((d: { stargazers_count?: number }) => {
                if (typeof d.stargazers_count === 'number') setStars(d.stargazers_count);
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (menuOpen) { document.body.style.overflow = 'hidden'; }
        else { document.body.style.overflow = ''; }
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    useEffect(() => {
        let lastY = window.scrollY;
        setIsScrolled(lastY > NAV_SOLID_BG_SCROLL_PX);

        const onScroll = () => {
            const y = window.scrollY;
            setIsScrolled(y > NAV_SOLID_BG_SCROLL_PX);
            if (menuOpen) return;
            if (y > lastY && y > 80) setIsHidden(true);
            else if (y < lastY) setIsHidden(false);
            lastY = y;
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [menuOpen]);

    useEffect(() => {
        setIsScrolled(window.scrollY > NAV_SOLID_BG_SCROLL_PX);
    }, [currentPath]);

    useEffect(() => {
        const el = navRef.current;
        if (!el) return;
        const apply = () => document.documentElement.style.setProperty('--app-header-h', `${el.offsetHeight}px`);
        apply();
        const ro = new ResizeObserver(apply);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;
        gsap.fromTo('#site-nav', { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
    }, []);

    useEffect(() => {
        if (currentPath !== '/') { setActiveSection(null); return; }
        const ids = ['projects', 'contact'];
        const observers = ids.map((id) => {
            const el = document.getElementById(id);
            if (!el) return null;
            const obs = new IntersectionObserver(([e]) => { if (e?.isIntersecting) setActiveSection(id); }, { threshold: 0.4 });
            obs.observe(el);
            return obs;
        }).filter(Boolean) as IntersectionObserver[];
        return () => observers.forEach((o) => o.disconnect());
    }, [currentPath]);

    const isLinkActive = (link: NavLinkType) => {
        if (currentPath !== '/') return currentPath === link.href;
        const hash = link.href.split('#')[1];
        if (hash) return activeSection === hash;
        return false;
    };

    const isProjectDetail = currentPath.startsWith('/projects/') && currentPath !== '/projects';
    const topTextClass = isProjectDetail ? 'text-white/85' : 'text-foreground/70';
    const topBtnClass = isProjectDetail
        ? 'border-white/25 bg-white/10 text-white/90 hover:border-white/40 hover:bg-white/15'
        : 'border-border bg-background text-foreground/80 hover:border-foreground/20 hover:bg-muted';
    const barClass = isProjectDetail ? 'bg-white' : 'bg-foreground';
    const navSurfaceClass = isScrolled
        ? isProjectDetail
            ? 'border-0 bg-black/45 backdrop-blur-xl backdrop-saturate-150'
            : 'border-0 bg-background/65 backdrop-blur-xl backdrop-saturate-150'
        : 'border-0 bg-transparent backdrop-blur-none';

    return (
        <>
            <nav
                ref={navRef}
                id="site-nav"
                data-shoot-ui="1"
                className={`fixed top-0 z-50 flex w-full min-w-0 items-center justify-between gap-2 py-2 pl-4 pr-3 will-change-transform transition-[transform,opacity,background-color,border-color] duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-3 sm:py-3 sm:px-8 md:px-12 lg:px-20 ${navSurfaceClass} ${isHidden && !menuOpen ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}
            >
                {/* Logo */}
                <Link href="/" aria-label="Home" className={`truncate font-semibold leading-[0.88] tracking-[-0.03em] text-[clamp(0.65rem,3.2vw,0.95rem)] sm:text-[clamp(0.72rem,1.35vw,0.95rem)] ${topTextClass}`}>
                    Waziri Kunambi
                </Link>

                {/* Desktop CTA — LET'S WORK */}
                <div className="hidden md:flex">
                    <a
                        href={siteHref('/#contact')}
                        className={`text-xs font-mono uppercase tracking-[0.24em] transition-colors hover:text-foreground ${topTextClass}`}
                    >
                        Let&apos;s Work
                    </a>
                </div>

                {/* Right side */}
                <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
                    {/* Clock — desktop only */}
                    <span className={`hidden lg:block font-mono text-[10px] tabular-nums tracking-[0.15em] ${topTextClass}`}>
                        {currentTime}
                    </span>

                    {/* GitHub stars */}
                    <a
                        href={socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 rounded-lg border px-2 py-1 transition-colors sm:gap-2 sm:px-2.5 ${topBtnClass}`}
                        aria-label="GitHub"
                    >
                        <FaGithub className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                        <span className="text-[10px] font-semibold tabular-nums tracking-wide sm:text-xs">
                            {stars !== null ? stars.toLocaleString() : '—'}
                        </span>
                        <Star className={`h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5 ${isProjectDetail ? 'fill-white/90 text-white/90' : 'fill-foreground/80 text-foreground/80'}`} />
                    </a>

                    {/* Theme toggle */}
                    <button
                        type="button"
                        onClick={toggleTheme}
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-colors ${topBtnClass}`}
                        aria-label={themeReady ? (resolvedTheme === 'dark' ? 'Switch to light' : 'Switch to dark') : 'Toggle theme'}
                    >
                        {themeReady ? (
                            resolvedTheme === 'dark' ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />
                        ) : (
                            <Moon className="h-4 w-4 opacity-0" aria-hidden />
                        )}
                    </button>

                    {/* Hamburger */}
                    <button
                        type="button"
                        onClick={() => onMenuOpen()}
                        className="relative z-[60] flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
                        aria-label="Toggle menu"
                    >
                        {[false, false, false].map((_, i) => (
                            <span key={i} className={`block h-[2px] w-5 ${barClass} transition-all duration-300 origin-center ${
                                menuOpen && i === 0 ? 'rotate-45 translate-y-[7px]'
                                : menuOpen && i === 1 ? 'opacity-0 scale-x-0'
                                : menuOpen && i === 2 ? '-rotate-45 -translate-y-[7px]'
                                : ''
                            }`} />
                        ))}
                    </button>
                </div>
            </nav>

            {/* Full-screen menu overlay */}
            <div
                data-shoot-ui="1"
                className={`fixed inset-0 z-[55] transition-all duration-500 ${menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
            >
                <div className="absolute inset-0 bg-background/95 backdrop-blur-md" />
                <div className="relative flex h-full flex-col items-center justify-center gap-2 px-8">
                    <button
                        type="button"
                        onClick={() => onMenuOpen()}
                        className="absolute right-8 top-6 flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="Close menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {navLinks.map((link, i) => (
                        link.href.includes('#') ? (
                            <a key={link.href} href={siteHref(link.href)} onClick={() => onMenuOpen()}
                                className={`group relative block py-4 transition-all duration-500 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                                style={{ transitionDelay: menuOpen ? `${150 + i * 75}ms` : '0ms' }}>
                                <span className="font-display text-4xl font-black uppercase tracking-wider text-foreground/40 transition-colors duration-300 group-hover:text-foreground sm:text-5xl md:text-6xl">
                                    {link.label}
                                </span>
                            </a>
                        ) : (
                            <Link key={link.href} href={siteHref(link.href)} onClick={() => onMenuOpen()}
                                className={`group relative block py-4 transition-all duration-500 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                                style={{ transitionDelay: menuOpen ? `${150 + i * 75}ms` : '0ms' }}>
                                <span className={`font-display text-4xl font-black uppercase tracking-wider transition-colors duration-300 sm:text-5xl md:text-6xl ${isLinkActive(link) ? 'text-foreground' : 'text-foreground/40 group-hover:text-foreground'}`}>
                                    {link.label}
                                </span>
                                {isLinkActive(link) && <span className="absolute bottom-0 left-0 h-[2px] w-full bg-foreground" />}
                            </Link>
                        )
                    ))}

                    <div className={`my-4 h-px w-16 bg-border transition-all duration-500 ${menuOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
                        style={{ transitionDelay: menuOpen ? '375ms' : '0ms' }} />

                    <a href={siteHref('/#contact')} onClick={() => onMenuOpen()}
                        className={`text-lg font-semibold uppercase tracking-widest text-muted-foreground transition-all duration-500 hover:text-foreground sm:text-xl ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                        style={{ transitionDelay: menuOpen ? '450ms' : '0ms' }}>
                        LET&apos;S WORK
                    </a>

                    <div className={`absolute bottom-12 left-1/2 -translate-x-1/2 font-mono text-xs tracking-widest text-muted-foreground transition-all duration-500 ${menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                        style={{ transitionDelay: menuOpen ? '525ms' : '0ms' }}>
                        {currentTime}
                    </div>
                </div>
            </div>
        </>
    );
}

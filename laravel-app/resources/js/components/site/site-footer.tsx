import { Link } from '@inertiajs/react';
import { ArrowUp, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { navLinks, socialLinks } from '@/data/site';

export function SiteFooter() {
    const iconLinkClass =
        'group flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/40 text-foreground/55 transition-all hover:border-foreground/40 hover:bg-muted hover:text-foreground';

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative z-10 overflow-hidden border-t border-border px-4 pt-16 pb-10 sm:px-6 md:px-10 lg:px-14 xl:px-20">
            <div className="pointer-events-none absolute top-0 left-1/2 h-px w-full max-w-3xl -translate-x-1/2 bg-gradient-to-r from-transparent via-foreground/20 to-transparent" />
            <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-foreground/5 blur-[90px]" />

            <div className="relative flex flex-col gap-12">
                {/* Navigation + Back to top */}
                <div className="flex flex-col items-start gap-10 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="mb-4 block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 sm:text-xs">
                            Navigation
                        </span>
                        <nav className="flex flex-col gap-2">
                            {navLinks.map((link) =>
                                link.href.includes('#') ? (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        className="w-fit text-base font-bold uppercase tracking-wide text-foreground/60 transition-colors hover:text-foreground sm:text-lg"
                                    >
                                        {link.label}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.label}
                                        href={link.href}
                                        className="w-fit text-base font-bold uppercase tracking-wide text-foreground/60 transition-colors hover:text-foreground sm:text-lg"
                                    >
                                        {link.label}
                                    </Link>
                                ),
                            )}
                        </nav>
                    </div>

                    <button
                        type="button"
                        onClick={scrollToTop}
                        className="group flex flex-col items-center gap-2 text-foreground/45 transition-colors hover:text-foreground cursor-pointer"
                    >
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-foreground/40 group-hover:bg-muted">
                            <ArrowUp className="h-5 w-5" />
                        </span>
                        <span className="text-[10px] uppercase tracking-widest">Back to top</span>
                    </button>
                </div>

                {/* Watermark */}
                <div className="border-y border-border py-8 sm:py-12">
                    <h2
                        className="select-none text-center font-display text-[clamp(2.5rem,10vw,9rem)] leading-none font-black uppercase text-foreground/[0.12] dark:text-foreground/[0.18]"
                        aria-hidden="true"
                    >
                        Waziri Kunambi
                    </h2>
                </div>

                {/* Copyright + socials */}
                <div className="flex flex-col-reverse items-center justify-between gap-6 sm:flex-row">
                    <div className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-6 sm:text-left">
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">
                            &copy; {new Date().getFullYear()} Waziri Kunambi
                        </span>
                        <span className="hidden text-foreground/15 sm:block">|</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45">Dar es Salaam, Tanzania</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <a href={`mailto:${socialLinks.email}`} aria-label="Email" className={iconLinkClass}>
                            <Mail className="h-4 w-4" />
                        </a>
                        <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={iconLinkClass}>
                            <FaGithub className="text-base" />
                        </a>
                        <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={iconLinkClass}>
                            <FaLinkedin className="text-base" />
                        </a>
                        <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className={iconLinkClass}>
                            <FaTwitter className="text-base" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

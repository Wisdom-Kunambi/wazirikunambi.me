import { Link } from '@inertiajs/react';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navLinks, socialLinks } from '@/data/site';

interface MobileMenuProps {
    open: boolean;
    onClose: () => void;
}

export function MobileMenu({ open, onClose }: MobileMenuProps) {
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        if (open) {
            document.body.classList.add('overflow-hidden');
            const raf1 = requestAnimationFrame(() => {
                const raf2 = requestAnimationFrame(() => setAnimateIn(true));
                return () => cancelAnimationFrame(raf2);
            });
            return () => cancelAnimationFrame(raf1);
        }

        document.body.classList.remove('overflow-hidden');
        setAnimateIn(false);
    }, [open]);

    return (
        <div
            id="mobile-menu"
            className={`fixed inset-0 z-50 flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur-md md:hidden ${
                open ? 'is-open' : 'hidden'
            } ${animateIn ? 'menu-anim-in' : ''}`}
        >
            <button
                type="button"
                aria-label="Close menu"
                onClick={onClose}
                className="absolute top-5 right-5 inline-flex h-10 w-10 items-center justify-center text-foreground/70 transition-colors hover:text-foreground"
            >
                <X className="h-6 w-6" />
            </button>

            {navLinks.map((link, index) =>
                link.href.includes('#') ? (
                    <a
                        key={link.label}
                        href={link.href}
                        onClick={onClose}
                        className={`menu-link text-4xl font-black uppercase tracking-wider sm:text-5xl ${
                            index === 0 ? 'text-foreground' : 'text-foreground/40 transition-colors hover:text-foreground'
                        }`}
                    >
                        {link.label}
                    </a>
                ) : (
                    <Link
                        key={link.label}
                        href={link.href}
                        onClick={onClose}
                        className={`menu-link text-4xl font-black uppercase tracking-wider sm:text-5xl ${
                            index === 0 ? 'text-foreground' : 'text-foreground/40 transition-colors hover:text-foreground'
                        }`}
                    >
                        {link.label}
                    </Link>
                ),
            )}

            <div className="menu-link my-4 h-px w-16 bg-border" />

            <a
                href={`mailto:${socialLinks.email}`}
                onClick={onClose}
                className="menu-link font-mono text-lg uppercase tracking-[0.3em] text-foreground/55 transition-colors hover:text-foreground"
            >
                Let&apos;s work
            </a>
        </div>
    );
}

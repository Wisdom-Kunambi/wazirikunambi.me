import { Mail } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { socialLinks } from '@/data/site';

export function SocialRail() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const update = () => {
            el.classList.toggle('is-visible', window.scrollY > 300);
        };

        window.addEventListener('scroll', update, { passive: true });
        update();

        return () => window.removeEventListener('scroll', update);
    }, []);

    const linkClass =
        'flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground/55 transition-all hover:border-foreground/40 hover:bg-muted hover:text-foreground';

    return (
        <div ref={ref} id="social-rail" className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={linkClass}>
                <FaGithub className="text-xl" />
            </a>
            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={linkClass}>
                <FaLinkedin className="text-xl" />
            </a>
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter" className={linkClass}>
                <FaTwitter className="text-xl" />
            </a>
            <a href={`mailto:${socialLinks.email}`} aria-label="Email" className={linkClass}>
                <Mail className="h-5 w-5" />
            </a>
        </div>
    );
}

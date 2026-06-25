import { Head, usePage } from '@inertiajs/react';
import { useEffect, useState, type ReactNode } from 'react';
import { PageTransition } from '@/components/site/page-transition';
import { ScrollProgress } from '@/components/site/scroll-progress';
import { ShootToggle } from '@/components/site/shoot-toggle';
import { SiteNav } from '@/components/site/site-nav';
import { SocialRail } from '@/components/site/social-rail';
import { LenisProvider, useLenis } from '@/hooks/use-lenis';

interface SiteLayoutProps {
    title: string;
    description?: string;
    children: ReactNode;
}

function AnchorScroll() {
    const lenis = useLenis();
    const { url } = usePage();

    useEffect(() => {
        if (!lenis) return;

        const onClick = (e: MouseEvent) => {
            const anchor = (e.target as HTMLElement).closest('a');
            if (!anchor) return;

            const href = anchor.getAttribute('href');
            if (!href) return;

            const hashIndex = href.indexOf('#');
            if (hashIndex === -1) return;

            const hash = href.slice(hashIndex);
            if (hash === '#') return;

            const path = href.slice(0, hashIndex);
            if (path !== '' && path !== window.location.pathname) return;

            const target = document.querySelector(hash);
            if (!target) return;

            e.preventDefault();
            lenis.scrollTo(target as HTMLElement, { offset: -70 });
        };

        document.addEventListener('click', onClick);
        return () => document.removeEventListener('click', onClick);
    }, [lenis]);

    useEffect(() => {
        if (!lenis) return;

        const hash = window.location.hash;
        if (!hash || hash === '#') return;

        const timeout = setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) lenis.scrollTo(target as HTMLElement, { offset: -70, immediate: true });
        }, 100);

        return () => clearTimeout(timeout);
    }, [lenis, url]);

    return null;
}

export default function SiteLayout({ title, description, children }: SiteLayoutProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <LenisProvider>
            <Head title={title}>{description && <meta name="description" content={description} />}</Head>

            <AnchorScroll />

            <PageTransition />

            <div className="grain" />

            <ScrollProgress />

            <SiteNav onMenuOpen={() => setMenuOpen((o) => !o)} menuOpen={menuOpen} />

            <SocialRail />

            <ShootToggle />

            <main className="relative z-10 w-full overflow-x-hidden">{children}</main>
        </LenisProvider>
    );
}

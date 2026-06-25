import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Building2, Quote, ShoppingBag, UserRound } from 'lucide-react';
import { type ComponentType, useEffect, useRef } from 'react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

const testimonials: {
    name: string;
    role: string;
    company: string;
    Icon: ComponentType<{ className?: string }>;
    content: string;
    rating: number;
}[] = [
    {
        name: 'Ally Kashmiry',
        role: 'Founder',
        company: 'Ally Kashmiry Portfolio',
        Icon: UserRound,
        content:
            'Waziri built my personal portfolio from scratch. His attention to detail, clean code, and ability to translate designs into fast, responsive interfaces exceeded my expectations.',
        rating: 5,
    },
    {
        name: 'Smart Africa Group',
        role: 'Project Lead',
        company: 'SAG',
        Icon: Building2,
        content:
            'We needed a modern corporate web presence and Waziri delivered exactly that. The site is clean, professional, and perfectly represents our brand across all devices.',
        rating: 5,
    },
    {
        name: 'SmartDarasa Team',
        role: 'EdTech Lead',
        company: 'SmartDarasa',
        Icon: BookOpen,
        content:
            'Waziri helped integrate AI and 3D visualizations into our EdTech platform. His technical skills and ability to work with complex APIs are outstanding.',
        rating: 5,
    },
    {
        name: 'Hill Group',
        role: 'Operations',
        company: 'Hill Group Outlet',
        Icon: ShoppingBag,
        content:
            'Our retail outlet needed a responsive, easy-to-navigate storefront. Waziri built it quickly and cleanly the whole team was impressed with the final product.',
        rating: 5,
    },
];

export function Testimonials() {
    const sliderRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);
    const looped = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        const totalWidth = slider.scrollWidth;
        const widthPerSet = totalWidth / 4;

        const tween = gsap.to(slider, {
            x: -widthPerSet,
            duration: 22,
            ease: 'none',
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize((x: number) => x % widthPerSet),
            },
        });

        gsap.from('.testimonial-header', {
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
        });

        return () => {
            tween.kill();
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full overflow-hidden bg-background py-24 sm:py-32">
            <div className="mx-auto mb-14 max-w-[1920px] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20 sm:mb-20">
                <span className="testimonial-header mb-4 block font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/45 sm:text-xs">Testimonials</span>
                <h2 className="testimonial-header font-display text-[clamp(2.5rem,6vw,6rem)] font-black uppercase leading-[0.9] text-foreground">
                    What People <br /> Say
                </h2>
            </div>

            <div className="relative overflow-hidden">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-background to-transparent md:w-40" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-background to-transparent md:w-40" />

                <div ref={sliderRef} className="flex w-max items-stretch gap-6 pl-4 sm:pl-6 md:pl-10 lg:pl-14">
                    {looped.map((t, i) => (
                        <div key={i} className="w-[320px] shrink-0 group md:w-[480px]">
                            <div className="flex h-full flex-col justify-between border-t border-border pt-8 transition-colors duration-500 hover:border-foreground/40">
                                <div>
                                    <Quote className="mb-6 h-8 w-8 text-foreground/40 opacity-50" />
                                    <p className="mb-8 text-base leading-relaxed text-foreground/80 font-light sm:text-lg">
                                        &ldquo;{t.content}&rdquo;
                                    </p>
                                </div>
                                <div className="mt-auto flex items-center gap-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-muted">
                                        <t.Icon className="h-4 w-4 text-foreground/60" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground">{t.name}</p>
                                        <p className="mt-1 text-[10px] uppercase tracking-widest text-foreground/45">{t.company}</p>
                                    </div>
                                    <div className="ml-auto flex gap-0.5 opacity-50">
                                        {Array.from({ length: t.rating }).map((_, s) => (
                                            <span key={s} className="text-[10px] text-foreground">★</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

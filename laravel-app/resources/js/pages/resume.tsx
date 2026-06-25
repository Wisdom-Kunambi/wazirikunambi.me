import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Briefcase, Download, GraduationCap, Globe, Languages as LanguagesIcon, Mail, MapPin, Phone } from 'lucide-react';
import { useEffect } from 'react';
import { MagneticLink } from '@/components/site/magnetic';
import { Reveal } from '@/components/site/reveal';
import { SiteFooter } from '@/components/site/site-footer';
import { SplitHeading } from '@/components/site/split-heading';
import { TechIcon } from '@/components/site/tech-icon';
import { awards, education, experience, languages, resumeContact, resumeIntro, skillGroups } from '@/data/resume';
import SiteLayout from '@/layouts/site-layout';

gsap.registerPlugin(ScrollTrigger);

export default function Resume() {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const cards = gsap.utils.toArray<HTMLElement>('.achievement-card');
        const tweens = cards.map((card) =>
            gsap.fromTo(
                card,
                { x: 60, opacity: 0, scale: 0.92 },
                {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 88%',
                        end: 'top 60%',
                        scrub: 0.6,
                    },
                },
            ),
        );

        return () => {
            tweens.forEach((tween) => {
                tween.scrollTrigger?.kill();
                tween.kill();
            });
        };
    }, []);

    return (
        <SiteLayout title="Resume" description="Resume of Waziri Kunambi — Software Engineer specializing in full-stack web development, React, Next.js, Laravel, and AI integrations.">
            <div className="relative z-10 w-full overflow-x-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-32 md:px-10 lg:px-14 xl:px-20">
                <Reveal className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 sm:text-xs">Resume</span>
                        <SplitHeading
                            as="h1"
                            lines={['Resume']}
                            className="mt-4 font-display text-[clamp(2.4rem,9vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tight"
                        />
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/60 sm:text-base">{resumeIntro}</p>
                    </div>
                    {/* <MagneticLink
                        href={resumeContact.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-shine inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground/70 hover:border-foreground/40 hover:bg-muted hover:text-foreground"
                    >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Resume</span>
                    </MagneticLink> */}
                </Reveal>

                <Reveal delay={0.05} className="mb-14 flex flex-wrap gap-x-6 gap-y-3 border-y border-border py-4 sm:mb-20">
                    <a
                        href={`mailto:${resumeContact.email}`}
                        className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:text-foreground sm:text-xs"
                    >
                        <Mail className="h-3.5 w-3.5" />
                        <span>{resumeContact.email}</span>
                    </a>
                    <a
                        href={`tel:${resumeContact.phone.replace(/\s+/g, '')}`}
                        className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:text-foreground sm:text-xs"
                    >
                        <Phone className="h-3.5 w-3.5" />
                        <span>{resumeContact.phone}</span>
                    </a>
                    <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 sm:text-xs">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{resumeContact.location}</span>
                    </span>
                    <a
                        href={resumeContact.website.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:text-foreground sm:text-xs"
                    >
                        <Globe className="h-3.5 w-3.5" />
                        <span>{resumeContact.website.label}</span>
                    </a>
                </Reveal>

                {/* Experience */}
                <section className="mb-16 sm:mb-24">
                    <Reveal className="mb-8 flex items-center gap-3 sm:mb-12">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 sm:text-xs">01</span>
                        <SplitHeading
                            as="h2"
                            lines={['Experience']}
                            className="font-display text-[clamp(1.75rem,5vw,3.5rem)] font-black uppercase leading-[0.95] tracking-tight"
                        />
                        <div className="h-px flex-1 bg-border" />
                    </Reveal>

                    <div className="space-y-6 sm:space-y-8">
                        {experience.map((entry, index) => (
                            <Reveal
                                key={entry.title + entry.company}
                                delay={index * 0.05}
                                as="article"
                                className="rounded-sm border border-border bg-muted/30 p-6 transition-colors duration-300 hover:border-foreground/25 hover:bg-muted md:p-8"
                            >
                                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                                    <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground/80 sm:text-sm">
                                        <Briefcase className="h-4 w-4 text-foreground/45" />
                                        {entry.company}
                                    </span>
                                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45 sm:text-xs">
                                        {entry.period}
                                    </span>
                                </div>
                                <h3 className="font-display text-xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-2xl md:text-3xl">
                                    {entry.title}
                                </h3>
                                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-foreground/60 sm:text-base">{entry.description}</p>
                            </Reveal>
                        ))}
                    </div>
                </section>

                {/* Education */}
                {/* <section className="mb-16 sm:mb-24">
                    <Reveal className="mb-8 flex items-center gap-3 sm:mb-12">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 sm:text-xs">02</span>
                        <SplitHeading
                            as="h2"
                            lines={['Education']}
                            className="font-display text-[clamp(1.75rem,5vw,3.5rem)] font-black uppercase leading-[0.95] tracking-tight"
                        />
                        <div className="h-px flex-1 bg-border" />
                    </Reveal>

                    <div className="space-y-4 sm:space-y-6">
                        {education.map((entry, index) => (
                            <Reveal
                                key={entry.school}
                                delay={index * 0.05}
                                as="article"
                                className="rounded-sm border border-border bg-muted/30 p-6 transition-colors duration-300 hover:border-foreground/25 hover:bg-muted md:p-8"
                            >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <h3 className="flex items-center gap-2 font-display text-lg font-black uppercase leading-tight tracking-tight text-foreground sm:text-xl md:text-2xl">
                                        <GraduationCap className="h-5 w-5 text-foreground/45" />
                                        {entry.school}
                                    </h3>
                                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45 sm:text-xs">
                                        {entry.period}
                                    </span>
                                </div>
                                <div className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground/55">{entry.program}</div>
                            </Reveal>
                        ))}
                    </div>
                </section> */}

                {/* Skills */}
                <section className="mb-16 sm:mb-24">
                    <Reveal className="mb-8 flex items-center gap-3 sm:mb-12">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 sm:text-xs">03</span>
                        <SplitHeading
                            as="h2"
                            lines={['Skills']}
                            className="font-display text-[clamp(1.75rem,5vw,3.5rem)] font-black uppercase leading-[0.95] tracking-tight"
                        />
                        <div className="h-px flex-1 bg-border" />
                    </Reveal>

                    <Reveal className="grid grid-cols-1 gap-10 sm:grid-cols-2" as="div">
                        {skillGroups.map((group) => (
                            <div key={group.title}>
                                <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55">{group.title}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {group.skills.map((skill) => (
                                        <span
                                            key={skill.name}
                                            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-foreground/65 transition-colors hover:border-foreground/40 hover:bg-muted hover:text-foreground"
                                        >
                                            <TechIcon name={skill.icon} />
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </Reveal>
                </section>

                {/* Awards */}
                <section className="mb-16 sm:mb-24">
                    <Reveal className="mb-8 flex items-center gap-3 sm:mb-12">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 sm:text-xs">04</span>
                        <SplitHeading
                            as="h2"
                            lines={['Awards & Certifications']}
                            className="font-display text-[clamp(1.75rem,5vw,3.5rem)] font-black uppercase leading-[0.95] tracking-tight"
                        />
                        <div className="h-px flex-1 bg-border" />
                    </Reveal>

                    <Reveal as="ul" className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                        {awards.map((award) => (
                            <li
                                key={award}
                                className="achievement-card flex items-start gap-3 rounded-sm border border-border bg-muted/30 p-4 transition-colors duration-300 hover:border-foreground/25 hover:bg-muted"
                            >
                                <Award className="mt-0.5 h-5 w-5 shrink-0 text-foreground/55" />
                                <span className="text-sm leading-relaxed text-foreground/70 sm:text-base">{award}</span>
                            </li>
                        ))}
                    </Reveal>
                </section>

                {/* Languages */}
                <section>
                    <Reveal className="mb-8 flex items-center gap-3 sm:mb-12">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 sm:text-xs">05</span>
                        <SplitHeading
                            as="h2"
                            lines={['Languages']}
                            className="font-display text-[clamp(1.75rem,5vw,3.5rem)] font-black uppercase leading-[0.95] tracking-tight"
                        />
                        <div className="h-px flex-1 bg-border" />
                    </Reveal>

                    <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                        {languages.map((language) => (
                            <div
                                key={language}
                                className="flex items-center gap-3 rounded-sm border border-border bg-muted/30 p-4 transition-colors duration-300 hover:border-foreground/25 hover:bg-muted"
                            >
                                <LanguagesIcon className="h-5 w-5 shrink-0 text-foreground/55" />
                                <span className="text-sm leading-relaxed text-foreground/70 sm:text-base">{language}</span>
                            </div>
                        ))}
                    </Reveal>
                </section>
            </div>

            <SiteFooter />
        </SiteLayout>
    );
}

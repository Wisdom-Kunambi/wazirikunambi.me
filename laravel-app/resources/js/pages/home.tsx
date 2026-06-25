import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { LazyMotion, domAnimation } from 'motion/react';
import { useState } from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { Achievements } from '@/components/site/achievements';
import { Highlights } from '@/components/site/highlights';
import { MagneticButton } from '@/components/site/magnetic';
import { Marquee } from '@/components/site/marquee';
import { Reveal } from '@/components/site/reveal';
import { SiteFooter } from '@/components/site/site-footer';
import { SkillsMarquee } from '@/components/site/skills-marquee';
import { SplitHeading } from '@/components/site/split-heading';
import { TechIcon } from '@/components/site/tech-icon';
import { Testimonials } from '@/components/site/testimonials';
import {
    HeroAvailability,
    HeroBackdrop,
    HeroEnterBlock,
    HeroEnterSplitRow,
    HeroExploreLink,
    HeroInteractivePortrait,
    HeroMotionRoot,
    HeroTechChips,
} from '@/components/site/hero-interactive';
import { ProjectsScrollSection } from '@/components/site/projects-scroll-section';
import { aboutParagraphs, socialLinks, techGroups } from '@/data/site';
import SiteLayout from '@/layouts/site-layout';
import type { SharedData } from '@/types';

export default function Home() {
    const { flash } = usePage<SharedData>().props;
    const form = useForm({ name: '', email: '', message: '', company: '' });
    const [emailCopied, setEmailCopied] = useState(false);

    const copyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(socialLinks.email);
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/contact', {
            preserveScroll: true,
            onSuccess: () => form.reset('name', 'email', 'message'),
        });
    };

    return (
        <SiteLayout title="Home" description="Waziri Kunambi — Software Engineer specializing in full-stack web development, React, Next.js, Laravel, and AI integrations. Based in Dar es Salaam, Tanzania.">

            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <LazyMotion features={domAnimation} strict>
            <section
                data-shoot-target="1"
                data-shoot-granularity="char"
                className="relative isolate w-full overflow-hidden bg-background contain-layout pb-8 min-h-[calc(100svh-var(--app-header-h,88px))] sm:min-h-[calc(72dvh-var(--app-header-h,88px))] sm:pb-10 md:min-h-0 md:pb-14 lg:pb-6 xl:flex xl:min-h-[calc(100svh-var(--app-header-h,88px))] xl:flex-col xl:justify-center xl:pb-8"
                style={{ marginTop: 'var(--app-header-h, 88px)' }}
            >
                <HeroBackdrop />
                <div className="relative z-10 mx-auto h-full min-h-0 w-full max-w-[1920px] px-4 sm:px-6 md:px-10 lg:px-14 xl:px-20">

                    {/* ── Mobile layout (< md) ── */}
                    <HeroMotionRoot className="md:hidden flex h-full flex-col justify-center gap-4 py-4 sm:py-6">
                        <HeroEnterSplitRow
                            left={
                                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/70">
                                    <div>01/</div>
                                    <div className="mt-2 text-foreground/55 tracking-[0.26em]">
                                        From Dar es Salaam
                                        <br />with Code
                                    </div>
                                </div>
                            }
                            right={<HeroAvailability />}
                        />

                        <HeroEnterBlock drift="center">
                            <h1
                                data-shoot-target="1"
                                data-shoot-granularity="char"
                                className="font-black uppercase leading-[0.9] tracking-[-0.05em] text-[clamp(2.6rem,11vw,4.6rem)]"
                            >
                                Software
                                <br />
                                Engineer
                            </h1>
                        </HeroEnterBlock>

                        <HeroEnterBlock drift="left">
                            <HeroTechChips />
                        </HeroEnterBlock>

                        <HeroEnterBlock drift="center">
                            <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-foreground/70 mb-2">
                                Dar &amp; Code
                            </div>
                            <HeroInteractivePortrait frameClassName="w-full aspect-video">
                                <img
                                    src="/assets/img/waziriImage.png"
                                    alt="Portrait of Waziri Kunambi"
                                    className="h-full w-full object-cover grayscale transition-[filter,transform] duration-500 group-hover:grayscale-0"
                                />
                            </HeroInteractivePortrait>
                        </HeroEnterBlock>

                        <HeroEnterBlock drift="right">
                            <div className="text-right">
                                <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-foreground/72">
                                    Full-stack products, sharp interfaces
                                    <br />&amp; AI features — built to perform.
                                </p>
                                <div className="mt-2 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground/55">
                                    Available for projects &amp; full-time
                                    <br />Based in Dar es Salaam, TZ
                                </div>
                            </div>
                        </HeroEnterBlock>

                        <HeroEnterBlock drift="right">
                            <div
                                data-shoot-target="1"
                                data-shoot-granularity="char"
                                className="text-right font-black uppercase leading-[0.88] tracking-[-0.06em] text-[clamp(3.1rem,13vw,5.2rem)]"
                            >
                                Waziri
                                <br />
                                Kunambi
                            </div>
                        </HeroEnterBlock>

                        <HeroEnterBlock>
                            <div className="text-right text-[10px] font-mono uppercase tracking-[0.26em] text-foreground/55">
                                2026 Portfolio
                            </div>
                        </HeroEnterBlock>

                        <HeroEnterBlock>
                            <div className="grid grid-cols-12 items-start gap-4">
                                <div className="col-span-2 text-foreground/70 text-lg leading-none select-none" aria-hidden>
                                    -&gt;
                                </div>
                                <div className="col-span-10">
                                    <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-foreground/70">
                                        I&apos;m based in
                                        <br />Dar es Salaam, TZ
                                        <br />Front-End · Full-Stack · AI
                                    </div>
                                </div>
                            </div>
                        </HeroEnterBlock>

                        <HeroEnterBlock className="flex justify-end" drift="right">
                            <HeroExploreLink />
                        </HeroEnterBlock>

                        <HeroEnterBlock drift="right">
                            <div className="text-right text-[10px] font-mono uppercase tracking-[0.28em] text-foreground/55">
                                Design &amp; code by Waziri
                            </div>
                        </HeroEnterBlock>
                    </HeroMotionRoot>

                    {/* ── Desktop layout (≥ md) ── */}
                    <HeroMotionRoot className="hidden flex-col gap-6 py-6 md:flex md:justify-start md:gap-8 md:py-8 lg:gap-10 lg:py-10">
                        {/* Top row */}
                        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-10">
                            <HeroEnterBlock className="col-span-12 md:col-span-5 md:order-2">
                                <div className="flex flex-col items-end gap-3 md:items-end">
                                    <HeroAvailability />
                                    <div className="font-mono uppercase tracking-[0.28em] text-[10px] text-foreground/70 md:text-right">
                                        <div>01/</div>
                                        <div className="mt-2 text-foreground/55 tracking-[0.26em]">
                                            From Dar es Salaam
                                            <br />with Code
                                        </div>
                                    </div>
                                </div>
                            </HeroEnterBlock>

                            <HeroEnterBlock className="col-span-12 md:col-span-7 md:order-1 md:text-left" drift="left">
                                <h1
                                    data-shoot-target="1"
                                    data-shoot-granularity="char"
                                    className="font-black uppercase leading-[0.88] tracking-[-0.04em] text-[clamp(2.8rem,6.6vw,6.6rem)]"
                                >
                                    Software
                                    <br />
                                    Engineer
                                </h1>
                                <div className="mt-4">
                                    <HeroTechChips />
                                </div>
                            </HeroEnterBlock>
                        </div>

                        {/* Bottom row */}
                        <div className="grid grid-cols-12 items-start gap-x-6 gap-y-8">
                            <HeroEnterBlock className="col-span-12 md:col-span-5 md:order-2" drift="right">
                                <div className="mb-8 max-w-[26rem] md:ml-auto md:text-right">
                                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-foreground/72">
                                        Full-stack products, sharp interfaces
                                        <br />&amp; AI features built to perform.
                                    </p>
                                    <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground/55">
                                        Available for projects &amp; full-time
                                        <br />Based in Dar es Salaam, TZ
                                    </div>
                                </div>

                                <div
                                    data-shoot-target="1"
                                    data-shoot-granularity="char"
                                    className="font-black uppercase leading-[0.88] tracking-[-0.05em] text-[clamp(3.4rem,6.7vw,6.4rem)] md:text-right"
                                >
                                    Waziri
                                    <br />
                                    Kunambi
                                </div>

                                <div className="mt-8 text-[10px] font-mono uppercase tracking-[0.26em] text-foreground/55 md:text-right">
                                    2026 Portfolio
                                </div>

                                <div className="mt-6 flex justify-end md:justify-end">
                                    <HeroExploreLink />
                                </div>
                            </HeroEnterBlock>

                            <HeroEnterBlock className="col-span-12 md:col-span-7 md:order-1" drift="left">
                                <div className="md:flex md:justify-start">
                                    <div className="w-full max-w-[720px]">
                                        <HeroInteractivePortrait frameClassName="w-full aspect-[16/6]">
                                            <img
                                                src="/assets/img/waziriImage.png"
                                                alt="Portrait of Waziri Kunambi"
                                                className="h-full w-full object-cover grayscale transition-[filter,transform] duration-500 group-hover:grayscale-0"
                                            />
                                        </HeroInteractivePortrait>

                                        <div className="mt-6 grid grid-cols-12 items-start gap-4">
                                            <div className="col-span-2 text-foreground/70 text-lg leading-none select-none" aria-hidden>
                                                -&gt;
                                            </div>
                                            <div className="col-span-10">
                                                <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-foreground/70">
                                                    I&apos;m based in
                                                    <br />Dar es Salaam, Tanzania
                                                    <br />Front-End · Full-Stack · AI
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-10 text-left text-[10px] font-mono uppercase tracking-[0.28em] text-foreground/55">
                                            Design &amp; code by Waziri
                                        </div>
                                    </div>
                                </div>
                            </HeroEnterBlock>
                        </div>
                    </HeroMotionRoot>

                </div>
            </section>
            </LazyMotion>

            {/* ── Services marquee ─────────────────────────────────────────── */}
            <Marquee />

            {/* ── About ────────────────────────────────────────────────────── */}
            <section className="px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-14 xl:px-20">
                <div className="flex flex-col gap-10 lg:flex-row lg:justify-between lg:gap-20">
                    <Reveal className="w-full space-y-5 lg:w-5/12">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 sm:text-xs">About</span>
                            <div className="h-px flex-1 bg-border" />
                        </div>
                        <SplitHeading
                            as="h2"
                            lines={['About']}
                            className="font-display text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-[0.95] tracking-tight"
                        />
                        <p className="max-w-lg text-sm leading-relaxed text-foreground/70 sm:text-base md:text-lg">{aboutParagraphs[0]}</p>
                        <p className="max-w-lg text-sm leading-relaxed text-foreground/55 sm:text-base">{aboutParagraphs[1]}</p>
                        <p className="max-w-lg text-sm leading-relaxed text-foreground/55 sm:text-base">{aboutParagraphs[2]}</p>
                    </Reveal>

                    <Reveal delay={0.1} className="w-full space-y-8 lg:w-7/12">
                        {techGroups.map((group) => (
                            <div key={group.title} className="grid grid-cols-1 items-start gap-4 min-[480px]:grid-cols-12 sm:items-center sm:gap-6">
                                <div className="min-[480px]:col-span-4">
                                    <div className="text-xl font-black uppercase leading-[1.05] tracking-tight text-foreground/45 sm:text-2xl md:text-3xl lg:text-4xl">
                                        {group.title}
                                    </div>
                                </div>
                                <div className="min-[480px]:col-span-8">
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                                        {group.items.map((item) => (
                                            <span key={item.name} className="flex items-center gap-2">
                                                <TechIcon name={item.icon} className="text-xl sm:text-2xl" />
                                                <span className="font-mono text-[10px] uppercase tracking-wide text-foreground/60 sm:text-xs">
                                                    {item.name}
                                                </span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Reveal>
                </div>
            </section>

            {/* ── By the numbers ───────────────────────────────────────────── */}
            <Highlights />

            {/* ── Featured Projects ────────────────────────────────────────── */}
            <ProjectsScrollSection />

            {/* ── Skills velocity marquee ──────────────────────────────────── */}
            <SkillsMarquee />

            {/* ── Achievements ─────────────────────────────────────────────── */}
            <Achievements />

            {/* ── Testimonials ─────────────────────────────────────────────── */}
            <Testimonials />

            {/* ── Contact ──────────────────────────────────────────────────── */}
            <section id="contact" className="relative overflow-hidden border-t border-border px-4 py-16 sm:px-6 sm:py-20 md:px-10 md:py-24 lg:px-14 xl:px-20">
                <div className="pointer-events-none absolute top-0 right-0 h-72 w-72 rounded-full bg-foreground/5 blur-[110px] sm:h-96 sm:w-96" />
                <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-foreground/5 blur-[100px] sm:h-80 sm:w-80" />

                <div className="relative grid gap-12 lg:grid-cols-2 lg:gap-20">
                    <Reveal>
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 sm:text-xs">05 / Contact</span>
                        <SplitHeading
                            as="h2"
                            lines={["Let's work", 'together']}
                            className="mt-4 font-display text-[clamp(2.2rem,8vw,5rem)] font-black uppercase leading-[0.95] tracking-tight"
                        />
                        <p className="mt-6 max-w-md text-sm leading-relaxed text-foreground/65 sm:text-base">
                            Have a product to build, a feature to ship, or an idea to discuss? Whether it&apos;s a full-stack web app, an AI integration,
                            or a sharp front-end I&apos;m open to it. Send a message and I&apos;ll get back to you shortly.
                        </p>

                        <div className="mt-8 flex gap-3">
                            <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                                className="group flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted/30 transition-all duration-300 hover:border-transparent hover:bg-foreground">
                                <FaGithub className="text-base text-foreground/60 transition-colors group-hover:text-background" />
                            </a>
                            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                                className="group flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted/30 transition-all duration-300 hover:border-transparent hover:bg-foreground">
                                <FaLinkedin className="text-base text-foreground/60 transition-colors group-hover:text-background" />
                            </a>
                            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="X / Twitter"
                                className="group flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted/30 transition-all duration-300 hover:border-transparent hover:bg-foreground">
                                <FaTwitter className="text-base text-foreground/60 transition-colors group-hover:text-background" />
                            </a>
                        </div>

                        <a href={`mailto:${socialLinks.email}`}
                            className="group mt-10 block border-t border-border pt-8 transition-colors duration-500 hover:border-foreground/40">
                            <div className="flex items-start justify-between">
                                <Mail className="h-7 w-7 text-foreground/50 transition-colors duration-500 group-hover:text-foreground" />
                                <ArrowUpRight className="h-7 w-7 text-foreground/35 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-45 group-hover:text-foreground" />
                            </div>
                            <span className="mt-6 block font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/45">Drop me a line</span>
                            <h3 className="mt-3 font-display text-2xl font-black uppercase leading-[0.95] tracking-tight sm:text-3xl">
                                {socialLinks.email.split('@')[0]}
                                <span className="block text-foreground/50">@{socialLinks.email.split('@')[1]}</span>
                            </h3>
                            <button type="button" onClick={copyEmail}
                                className="group/btn mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/55 transition-colors hover:text-foreground">
                                {emailCopied ? (
                                    <><Check className="h-4 w-4 text-emerald-500" /><span className="text-emerald-500">Email copied</span></>
                                ) : (
                                    <><Copy className="h-4 w-4" /><span className="underline-offset-4 group-hover/btn:underline">Copy address</span></>
                                )}
                            </button>
                        </a>
                    </Reveal>

                    <Reveal>
                        <form onSubmit={submit}>
                            <div className="space-y-5">
                                <div>
                                    <label htmlFor="contact-name" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">Name</label>
                                    <input id="contact-name" name="name" type="text" required autoComplete="name"
                                        value={form.data.name} onChange={(e) => form.setData('name', e.target.value)}
                                        placeholder="Your name"
                                        className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground placeholder:text-foreground/35 focus:border-foreground/50 focus:outline-none" />
                                    {form.errors.name && <p className="mt-1 text-xs text-red-500">{form.errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="contact-email" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">Email</label>
                                    <input id="contact-email" name="email" type="email" required autoComplete="email"
                                        value={form.data.email} onChange={(e) => form.setData('email', e.target.value)}
                                        placeholder="you@example.com"
                                        className="mt-2 w-full border-b border-border bg-transparent py-2.5 text-sm text-foreground placeholder:text-foreground/35 focus:border-foreground/50 focus:outline-none" />
                                    {form.errors.email && <p className="mt-1 text-xs text-red-500">{form.errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="contact-message" className="block font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">Message</label>
                                    <textarea id="contact-message" name="message" rows={4} required
                                        value={form.data.message} onChange={(e) => form.setData('message', e.target.value)}
                                        placeholder="Tell me about your project..."
                                        className="mt-2 w-full resize-none border-b border-border bg-transparent py-2.5 text-sm text-foreground placeholder:text-foreground/35 focus:border-foreground/50 focus:outline-none" />
                                    {form.errors.message && <p className="mt-1 text-xs text-red-500">{form.errors.message}</p>}
                                </div>
                                <div className="hidden" aria-hidden="true">
                                    <label htmlFor="contact-company">Company</label>
                                    <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off"
                                        value={form.data.company} onChange={(e) => form.setData('company', e.target.value)} />
                                </div>
                            </div>

                            <div className="mt-7 flex flex-wrap items-center gap-4">
                                <MagneticButton type="submit" disabled={form.processing}
                                    className="btn-shine group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground/70 hover:border-foreground/40 hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50">
                                    <span>{form.processing ? 'Sending...' : 'Send message'}</span>
                                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </MagneticButton>
                                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/70" role="status" aria-live="polite">
                                    {flash?.status === 'sent' && "Message sent — thanks! I'll reply soon."}
                                </p>
                            </div>
                        </form>
                    </Reveal>
                </div>
            </section>

            <SiteFooter />
        </SiteLayout>
    );
}

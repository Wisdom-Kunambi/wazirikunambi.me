import { ArrowUpRight, Lock } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { Reveal } from '@/components/site/reveal';
import { SiteFooter } from '@/components/site/site-footer';
import { SplitHeading } from '@/components/site/split-heading';
import { TiltCard } from '@/components/site/tilt-card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { type Project, projects } from '@/data/projects';
import SiteLayout from '@/layouts/site-layout';

const COMING_SOON_MESSAGE = "Not public yet — launching with an upcoming campaign.";

function projectTagsLine(project: Project): string {
    return project.tags
        .slice(0, 3)
        .map((tag) => `[${tag.toUpperCase()}]`)
        .join(' — ');
}

export default function Projects() {
    return (
        <SiteLayout title="Projects" description="Selected projects by Waziri Kunambi — Full-Stack Software Developer.">
            <div className="relative z-10 w-full overflow-x-hidden px-4 pt-28 pb-20 sm:px-6 sm:pt-32 md:px-10 lg:px-14 xl:px-20">
                <Reveal className="mb-12 sm:mb-16">
                    <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/55 sm:text-xs">Portfolio</span>
                    <SplitHeading
                        as="h1"
                        lines={['All Projects']}
                        className="mt-4 font-display text-[clamp(2.4rem,9vw,5.5rem)] font-black uppercase leading-[0.92] tracking-tight"
                    />
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/60 sm:text-base">
                        A selection of platforms and applications I&apos;ve helped design, build, and ship — spanning front-end interfaces,
                        full-stack web apps, and personal builds.
                    </p>
                </Reveal>

                <div className="grid grid-cols-1 gap-12 sm:gap-14 md:grid-cols-2 md:gap-x-8 md:gap-y-14 lg:gap-x-10 lg:gap-y-16 xl:grid-cols-3">
                    {projects.map((project, index) => (
                        <Reveal key={project.slug} as="article" id={project.slug} delay={index % 3 === 1 ? 0.1 : index % 3 === 2 ? 0.2 : undefined} className="scroll-mt-28">
                            <TiltCard className="card-hover corner-accents group relative aspect-16/10 overflow-hidden rounded-sm border border-border bg-muted/40">
                                <img
                                    src={project.image}
                                    alt={`${project.title} project cover`}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                />
                                <span className="corner-tl absolute" />
                                <span className="corner-tr absolute" />
                                <span className="corner-bl absolute" />
                                <span className="corner-br absolute" />
                            </TiltCard>

                            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 sm:mt-5">
                                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40 sm:text-[11px]">
                                    {project.year}
                                </span>
                                {project.featured && (
                                    <span className="rounded-sm border border-border bg-muted/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-foreground/50 sm:text-[10px]">
                                        Featured
                                    </span>
                                )}
                                {project.comingSoon && (
                                    <span className="inline-flex items-center gap-1.5 rounded-sm border border-border bg-muted/80 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-foreground/50 sm:text-[10px]">
                                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500/40" />
                                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-amber-600/90" />
                                        </span>
                                        Coming soon
                                    </span>
                                )}
                            </div>

                            <h2 className="mt-2 font-display text-xl font-black uppercase leading-tight tracking-tight text-foreground sm:text-2xl">
                                {project.title}
                            </h2>
                            <p className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-foreground/45 sm:text-[11px]">
                                {projectTagsLine(project)}
                            </p>
                            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-foreground/60 sm:text-base">{project.description}</p>

                            <div className="mt-4 flex flex-wrap gap-3">
                                {project.comingSoon ? (
                                    <TooltipProvider delayDuration={150}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    aria-disabled="true"
                                                    onClick={(e) => e.preventDefault()}
                                                    className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-border px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground/40"
                                                >
                                                    <span>Visit site</span>
                                                    <Lock className="h-3.5 w-3.5" />
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                side="top"
                                                className="max-w-[230px] rounded-sm border-border bg-popover text-center font-mono text-[10px] uppercase tracking-[0.1em] text-popover-foreground"
                                            >
                                                {COMING_SOON_MESSAGE}
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <a
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-shine inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground/70 hover:border-foreground/40 hover:bg-muted hover:text-foreground"
                                    >
                                        <span>Visit site</span>
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                    </a>
                                )}
                                {project.secondaryUrl && (
                                    <a
                                        href={project.secondaryUrl.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-shine inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 text-[10px] font-mono uppercase tracking-[0.24em] text-foreground/70 hover:border-foreground/40 hover:bg-muted hover:text-foreground"
                                    >
                                        <span>{project.secondaryUrl.label}</span>
                                        <FaGithub className="text-sm" />
                                    </a>
                                )}
                            </div>
                        </Reveal>
                    ))}
                </div>

                <Reveal className="mt-16 border-t border-border pt-8 sm:mt-20">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/45 sm:text-xs">
                        Always open to new ideas and collaborations — let&apos;s build something together.
                    </p>
                </Reveal>
            </div>

            <SiteFooter />
        </SiteLayout>
    );
}

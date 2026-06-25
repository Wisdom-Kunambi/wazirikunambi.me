import {
    FaBootstrap,
    FaCode,
    FaCss3Alt,
    FaDocker,
    FaFigma,
    FaGitAlt,
    FaGithub,
    FaHtml5,
    FaJsSquare,
    FaLinkedin,
    FaLinux,
    FaNodeJs,
    FaNpm,
    FaPython,
    FaReact,
    FaTwitter,
} from 'react-icons/fa';
import {
    SiBitbucket,
    SiFirebase,
    SiLaravel,
    SiMysql,
    SiNextdotjs,
    SiPhp,
    SiPostman,
    SiTailwindcss,
} from 'react-icons/si';
import type { IconType } from 'react-icons';

const icons: Record<string, IconType> = {
    FaBootstrap,
    FaCode,
    FaCss3Alt,
    FaDocker,
    FaFigma,
    FaGitAlt,
    FaGithub,
    FaHtml5,
    FaJsSquare,
    FaLinkedin,
    FaLinux,
    FaNodeJs,
    FaNpm,
    FaPython,
    FaReact,
    FaTwitter,
    SiBitbucket,
    SiFirebase,
    SiLaravel,
    SiNextdotjs,
    SiPhp,
    SiPostman,
    SiTailwindcss,
    SiMysql,
};

export function TechIcon({ name, className }: { name: string; className?: string }) {
    const Icon = icons[name] ?? FaCode;
    return <Icon className={className} />;
}

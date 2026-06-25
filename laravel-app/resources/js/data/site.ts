export interface NavLink {
    label: string;
    href: string;
}

export const navLinks: NavLink[] = [
    { label: 'Projects', href: '/projects' },
    { label: 'Resume', href: '/resume' },
    { label: 'Contact', href: '/#contact' },
];

export const socialLinks = {
    github: 'https://github.com/Wisdom-Kunambi',
    linkedin: 'https://linkedin.com/in/waziri-kunambi',
    twitter: 'https://twitter.com/KunambiWaziri',
    email: 'kunambiwaziri1@gmail.com',
};

export const aboutParagraphs: string[] = [
    "I'm a Software Engineer with 4+ years of experience building full-stack web applications, pixel-perfect frontends, and AI-powered products specializing in JavaScript, React, Next.js, PHP, and Laravel.",
    'From intelligent API integrations to performant user interfaces, I turn complex requirements into clean, fast products collaborating with designers, developers, and stakeholders from kickoff to launch.',
    'Outside of code, I follow football, read, play video games, watch films, and shoot photography all of which keep me curious and balanced.',
];

export interface TechGroup {
    title: string;
    items: { name: string; icon: string }[];
}

export const techGroups: TechGroup[] = [
    {
        title: 'Frontend',
        items: [
            { name: 'JavaScript', icon: 'FaJsSquare' },
            { name: 'React', icon: 'FaReact' },
            { name: 'Next.js', icon: 'SiNextdotjs' },
            { name: 'HTML5', icon: 'FaHtml5' },
            { name: 'CSS3', icon: 'FaCss3Alt' },
            { name: 'Tailwind CSS', icon: 'SiTailwindcss' },
            { name: 'Bootstrap', icon: 'FaBootstrap' },
        ],
    },
    {
        title: 'Backend',
        items: [
            { name: 'Laravel', icon: 'SiLaravel' },
            { name: 'PHP', icon: 'SiPhp' },
            { name: 'Node.js', icon: 'FaNodeJs' },
            { name: 'Python', icon: 'FaPython' },
        ],
    },
    {
        title: 'Database',
        items: [
            { name: 'MySQL', icon: 'SiMysql' },
            { name: 'Firebase', icon: 'SiFirebase' },
        ],
    },
    {
        title: 'Tools',
        items: [
            { name: 'Git', icon: 'FaGitAlt' },
            { name: 'Docker', icon: 'FaDocker' },
            { name: 'Linux', icon: 'FaLinux' },
            { name: 'Figma', icon: 'FaFigma' },
            { name: 'NPM', icon: 'FaNpm' },
            { name: 'VS Code', icon: 'FaCode' },
            { name: 'Postman', icon: 'SiPostman' },
            { name: 'GitHub', icon: 'FaGithub' },
            { name: 'Bitbucket', icon: 'SiBitbucket' },
        ],
    },
];

import { SITE_BASE } from '@/lib/utils';

const img = (n: string) => `${SITE_BASE}assets/img/projects/${n}`;

export interface Project {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    image: string;
    url: string;
    year: string;
    featured?: boolean;
    secondaryUrl?: { label: string; href: string };
}

export const projects: Project[] = [
    {
        slug: 'smartdarasa',
        title: 'SmartDarasa Portal',
        description:
            "An EdTech platform using 2D/3D, AI, AR & VR visualizations to bring science concepts to life — helping bridge the gap between classroom theory and hands-on STEM learning.",
        tags: ['React', 'JavaScript', 'AI Integration', 'AR/VR'],
        image: img('smartdarasa.svg'),
        url: 'https://learn.smartdarasa.com/',
        year: '2024',
        featured: true,
    },
    {
        slug: 'smart-africa-group',
        title: 'Smart Africa Group (SAG)',
        description:
            "Corporate web application for Smart Africa Group, presenting the company's portfolio of brands, services, and group-wide initiatives in a clean, modern interface.",
        tags: ['React', 'Next.js', 'Tailwind CSS'],
        image: img('smart-africa-group.svg'),
        url: 'https://www.smartafrica.group/',
        year: '2025',
        featured: true,
    },
    {
        slug: 'hill-group',
        title: 'Hill Group Platform',
        description:
            'Retail outlet platform for Hill Group, delivering a responsive storefront experience for browsing products and services.',
        tags: ['React', 'JavaScript', 'Tailwind CSS'],
        image: img('hill-group.svg'),
        url: 'https://outlet.hillgroup.co.tz/',
        year: '2025',
    },
    {
        slug: 'ninecolors',
        title: 'NineColors Platform',
        description:
            'Creative studio website for NineColors, presenting branding, design, and digital services with a bold visual identity.',
        tags: ['React', 'JavaScript', 'UI/UX'],
        image: img('ninecolors.svg'),
        url: 'https://ninecolors.co.tz/',
        year: '2025',
    },
    {
        slug: 'smart-raffle',
        title: 'Smart Raffle Tool',
        description:
            'A digital raffle and giveaway management tool that lets organizations run, track, and draw winners for promotional campaigns online.',
        tags: ['React', 'JavaScript', 'API Integration'],
        image: img('smart-raffle.svg'),
        url: 'https://smartraffletool.smartnology.co.tz/',
        year: '2025',
    },
    {
        slug: 'smart-studio',
        title: 'Smart Studio',
        description:
            'Creative production studio website highlighting media, design, and content services with an interactive, media-rich layout.',
        tags: ['React', 'JavaScript', 'Tailwind CSS'],
        image: img('smart-studio.svg'),
        url: 'https://smartstudio.co.tz/',
        year: '2025',
    },
    {
        slug: 'smart-lab',
        title: 'Smart Lab',
        description:
            "Web platform for SmartLab, presenting the company's research, innovation, and technology lab services to clients and partners.",
        tags: ['React', 'JavaScript', 'REST APIs'],
        image: img('smart-lab.svg'),
        url: 'https://www.smartlab.co.tz/',
        year: '2024',
    },
    {
        slug: 'smartnology',
        title: 'Smart Nology',
        description:
            "Corporate website for SmartNology, showcasing the company's software products, services, and technology solutions.",
        tags: ['React', 'Next.js', 'Tailwind CSS'],
        image: img('smartnology.svg'),
        url: 'https://smartnology.co.tz/',
        year: '2024',
    },
    {
        slug: 'ally-kashmiry',
        title: 'Ally Kashmiry Portfolio',
        description:
            'A personal portfolio website built for Ally Kashmiry to showcase professional work, services, and contact information.',
        tags: ['React', 'JavaScript', 'UI/UX'],
        image: img('ally-kashmiry.svg'),
        url: 'https://allykashmiry.com/',
        year: '2026',
    },
    {
        slug: 'pr-week',
        title: 'East Africa PR Week',
        description:
            'Event website for East Africa PR Week, providing schedules, speaker profiles, and registration for the regional PR industry conference.',
        tags: ['React', 'JavaScript', 'Tailwind CSS'],
        image: img('pr-week.svg'),
        url: 'https://prweek.prst.or.tz/',
        year: '2025',
    },
    {
        slug: 'tdms',
        title: 'Tanzania Digital Market Summit',
        description:
            'Event platform for the Tanzania Digital Market Summit, featuring agenda details, speaker profiles, and attendee registration.',
        tags: ['React', 'JavaScript', 'REST APIs'],
        image: img('tdms.svg'),
        url: 'https://www.tdms.co.tz/',
        year: '2025',
    },
    {
        slug: 'zaba',
        title: 'Zaba Company',
        description:
            "Corporate website for Zaba Company, presenting the brand's services and offerings with a clean, professional layout.",
        tags: ['React', 'JavaScript', 'Tailwind CSS'],
        image: img('zaba.svg'),
        url: 'https://www.zaba.co.tz/',
        year: '2024',
    },
    {
        slug: 'jrcl-global',
        title: 'JRCL Global',
        description:
            "Corporate website for JRCL Global, presenting the company's brand, services, and offerings with a clean, professional layout.",
        tags: ['React', 'JavaScript', 'Tailwind CSS'],
        image: img('jrcl-global.svg'),
        url: 'https://jrclglobal.com/',
        year: '2025',
    },
    {
        slug: 'jrcl-global-portal',
        title: 'JRCL Global Portal',
        description:
            'Client portal for JRCL Global, letting clients securely log in to manage their account and services.',
        tags: ['React', 'JavaScript', 'REST APIs'],
        image: img('jrcl-global-portal.svg'),
        url: 'https://app.jrclglobal.com/auth/login',
        year: '2025',
    },
    {
        slug: 'sokolink',
        title: 'Sokolink',
        description:
            'E-commerce marketplace platform enabling buyers and sellers to connect, list products, and manage online transactions.',
        tags: ['React', 'JavaScript', 'E-Commerce'],
        image: img('sokolink.svg'),
        url: 'https://sokolink.shop/login',
        year: '2025',
    },
    {
        slug: 'property',
        title: 'Property',
        description:
            'A responsive real estate web application for finding residential and rental properties, built with React.js.',
        tags: ['React', 'JavaScript', 'REST APIs'],
        image: img('property.svg'),
        url: 'https://property-6wn.pages.dev/',
        year: '2023',
        featured: true,
    },
    {
        slug: 'portfolio',
        title: 'wazirikunambi.me',
        description:
            'A modern, monochrome personal portfolio with light/dark theming, scroll-based reveal animations, and a fully responsive layout — built with Tailwind CSS and vanilla JavaScript.',
        tags: ['HTML5', 'Tailwind CSS', 'JavaScript'],
        image: img('portfolio.svg'),
        url: 'https://wisdom-kunambi.github.io/wazirikunambi.me/',
        year: '2026',
        secondaryUrl: { label: 'View source', href: 'https://github.com/Wisdom-Kunambi/wazirikunambi.me' },
    },
];

export const featuredProjectSlugs = ['smartdarasa', 'smart-africa-group', 'ally-kashmiry'];

export const featuredProjects = projects.filter((project) => featuredProjectSlugs.includes(project.slug));

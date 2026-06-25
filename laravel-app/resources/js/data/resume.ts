export interface ExperienceEntry {
    title: string;
    company: string;
    period: string;
    description: string;
}

export const experience: ExperienceEntry[] = [
    {
        title: 'Founder & CTO',
        company: 'KiooTech',
        period: 'Mar 2026 — Present',
        description:
            'Founded KiooTech, a technology company built on the principle that every business challenge carries a digital solution. As CTO, I oversee all technical direction: software engineering, systems architecture, product development, and quality assurance. Leading the team in delivering website development, systems development, and AI-powered products for clients across the region under the tagline "Reflecting Challenges. Engineering Solutions."',
    },
    {
        title: 'Website Developer',
        company: 'SmartNology LTD',
        period: 'May 2024 — Present',
        description:
            'My roles and tasks are diverse, spanning both technical and creative domains. I implement UI/UX designs into functional, responsive websites compatible across devices and browsers, and develop interactive features using frameworks like React, Angular, or Vue.js. On the back end, I manage server-side logic, databases, and APIs that connect the front end and back end, integrating third-party APIs as needed. As a full-stack developer, I ensure seamless integration between front-end interfaces and back-end services while optimizing for performance. Content management involves integrating and customizing CMS platforms like WordPress, Joomla, or Drupal, along with custom plugins and themes, plus regular updates, bug fixes, and security patches. I implement SEO best practices and analytics tools like Google Analytics, prioritize security against threats and compliance with regulations like GDPR, and collaborate with designers, content creators, and developers through Agile/Scrum processes using tools like Jira or Trello. I also communicate directly with clients to gather requirements, provide technical guidance, and offer training and support.',
    },
    {
        title: 'Freelance — Frontend Developer',
        company: 'SmartLab LTD',
        period: 'Feb 2024 — May 2024',
        description:
            'Had the exciting opportunity to design and implement a new platform for SmartDarasa as a front-end developer proud to have contributed to this innovative project shaping the future of education.',
    },
    {
        title: 'Senior Web Developer',
        company: 'SmartDarasa LTD',
        period: 'Dec 2022 — Dec 2023',
        description:
            'Led the design and architecture of complex web applications, ensuring scalability, performance, and maintainability. Evaluated and recommended appropriate technologies and frameworks, mentored junior developers, conducted code reviews, and promoted best coding practices. Collaborated with project managers, designers, and cross-functional teams including UX/UI designers, backend developers, and QA engineers to deliver integrated, cohesive solutions, and resolved complex technical issues with innovative approaches.',
    },
    {
        title: 'Information Technology Technician',
        company: 'Simba Software',
        period: 'Aug 2021 — Sep 2022',
        description:
            'Installed, configured, and maintained computer hardware components, including desktops, laptops, servers, and peripherals. Conducted routine maintenance to ensure reliability and optimal performance, installed and updated software applications, and troubleshot software-related issues in collaboration with users and vendors. Also resolved network connectivity issues.',
    },
    {
        title: 'Information Communication Technology Technician',
        company: 'National Social Security Fund (NSSF)',
        period: 'Jul 2017 — Dec 2019',
        description:
            'Provided technical support to end-users by troubleshooting and resolving hardware and software issues, including computer malfunctions, network issues, and software errors. Configured and maintained computer networks, including LANs and WANs, managed network security measures to protect against unauthorized access and data breaches, and monitored network performance and connectivity.',
    },
];

export interface EducationEntry {
    school: string;
    program: string;
    period: string;
}

export const education: EducationEntry[] = [
    {
        school: 'University of Dodoma',
        program: 'Bachelor of Software Engineering',
        period: 'Aug 2019 — May 2022',
    },
    {
        school: 'Tanzania Public Service College',
        program: 'Diploma of ICT',
        period: 'Aug 2016 — May 2019'
    },
];

export interface SkillEntry {
    name: string;
    icon: string;
}

export interface SkillGroup {
    title: string;
    skills: SkillEntry[];
}

export const skillGroups: SkillGroup[] = [
    {
        title: 'Frontend',
        skills: [
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
        skills: [
            { name: 'Laravel', icon: 'SiLaravel' },
            { name: 'PHP', icon: 'SiPhp' },
            { name: 'Node.js', icon: 'FaNodeJs' },
            { name: 'Python', icon: 'FaPython' },
        ],
    },
    {
        title: 'Database',
        skills: [
            { name: 'MySQL', icon: 'SiMysql' },
            { name: 'Firebase', icon: 'SiFirebase' },
        ],
    },
    {
        title: 'Tools',
        skills: [
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

export const awards: string[] = [
    'Udemy — The Complete Full-Stack Web Development Bootcamp',
    'Coursera — Meta Programming with JavaScript',
    'Coursera — Meta Introduction to Mobile Development',
    'Cisco — University of Dodoma Cisco Networking Academy Cybersecurity',
    'University of Dar es Salaam — Graduates Entrepreneurship Program (GEP)',
    'Smart Lab - Modern Software Architecture & Software Development Lifecycle (SDLC)',
    // 'Basic Technician Certificate in Information and Communication Technology',
    // 'Diploma in Computing & Information Communication Technology',
];

export const languages: string[] = ['English', 'Swahili'];

export const resumeIntro =
    'Software Engineer with 4+ years of experience building full-stack web applications, pixel-perfect interfaces, and AI-powered products specializing in JavaScript, React, Next.js, PHP, and Laravel, with strong expertise in AI & API integration, UI/UX implementation, and performance optimization.';

export const resumeContact = {
    email: 'kunambiwaziri1@gmail.com',
    phone: '+255 714 085 736',
    location: 'Tabata 12103 — Ilala, Dar es Salaam, Tanzania',
    website: { label: 'wisdom-kunambi.github.io/wazirikunambi.me', href: 'https://wisdom-kunambi.github.io/wazirikunambi.me/' },
    downloadUrl: 'https://docs.google.com/document/d/1xVPAN_dGPUuQ_36aWN6mY0OAvEC0HQ0KlTp4DUk-fI0/edit',
};

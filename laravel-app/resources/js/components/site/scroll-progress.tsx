import { motion, useScroll } from 'motion/react';

export function ScrollProgress() {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            id="scroll-progress"
            className="fixed inset-x-0 top-0 z-[999] h-px origin-left bg-linear-to-r from-[#A97CF8] via-[#F38CB8] to-[#FDCC92]"
            style={{
                scaleX: scrollYProgress,
                transformOrigin: '0 50%',
                willChange: 'transform',
            }}
        />
    );
}

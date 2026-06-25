import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';

export function ThemeToggle() {
    const { updateAppearance } = useAppearance();
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));

        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        return () => observer.disconnect();
    }, []);

    return (
        <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground/80 transition-colors hover:border-foreground/30 hover:bg-muted"
        >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
    );
}

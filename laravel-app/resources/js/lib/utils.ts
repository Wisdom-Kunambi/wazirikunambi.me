import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// BASE_URL is '/wazirikunambi.me/build/' on GH Pages, '/' on dev
export const SITE_BASE = import.meta.env.BASE_URL.replace(/build\/?$/, '');

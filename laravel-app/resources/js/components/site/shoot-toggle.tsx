import * as React from 'react';
import gsap from 'gsap';
import {
    ensurePaintballAudioRunning,
    playPaintballShotSound,
} from '@/utils/play-paintball-shot-sound';
import {
    notifyShootModeSubscribers,
    SHOOT_MODE_STORAGE_KEY,
} from '@/utils/shoot-mode-store';

const SPLAT_FADE_MS = 520;
const SPLAT_TOTAL_LIFETIME_MS = 3200;
const SPLAT_VISIBLE_MS = SPLAT_TOTAL_LIFETIME_MS - SPLAT_FADE_MS;
const SHOOT_SCROLL_INTERACTIVE_SEL = '[data-shoot-scroll-interactive]';

type PaintSplat = {
    id: number;
    x: number;
    y: number;
    size: number;
    rotation: number;
    hue: number;
    saturation: number;
    lightness: number;
    exiting?: boolean;
};

let paintSplatIdSeq = 0;
function nextPaintSplatId(): number {
    paintSplatIdSeq += 1;
    return paintSplatIdSeq;
}

function getTextNodeAtPoint(x: number, y: number): Text | null {
    if (typeof document === 'undefined') return null;
    try {
        const doc = document as Document & {
            caretRangeFromPoint?: (nx: number, ny: number) => Range | null;
            caretPositionFromPoint?: (nx: number, ny: number) => CaretPosition | null;
        };
        if (typeof doc.caretRangeFromPoint === 'function') {
            const range = doc.caretRangeFromPoint(x, y);
            if (range?.startContainer?.nodeType === Node.TEXT_NODE) return range.startContainer as Text;
            return null;
        }
        if (typeof doc.caretPositionFromPoint === 'function') {
            const pos = doc.caretPositionFromPoint(x, y);
            if (pos?.offsetNode?.nodeType === Node.TEXT_NODE) return pos.offsetNode as Text;
            return null;
        }
    } catch { return null; }
    return null;
}

function textNodeHasVisibleChar(text: Text): boolean {
    return (text.textContent ?? '').trim().length > 0;
}

function pickInnerShootTarget(raw: Element | null): HTMLElement | null {
    let el: Element | null = raw;
    while (el && el instanceof HTMLElement) {
        if (el.matches('[data-shoot-ui]')) return null;
        if (el.hasAttribute('data-shoot-target')) return el;
        el = el.parentElement;
    }
    return null;
}

function pickSemanticTextTarget(raw: Element | null): HTMLElement | null {
    let el: Element | null = raw;
    while (el && el instanceof HTMLElement) {
        if (el.matches('[data-shoot-ui]')) return null;
        if (el.matches('h1,h2,h3,h4,h5,h6,p,span,a,button,li,br,article,img')) return el;
        el = el.parentElement;
    }
    return null;
}

function pickInnerShootTargetFromTextNode(text: Text): HTMLElement | null {
    let el: HTMLElement | null = text.parentElement;
    while (el) {
        if (el.matches('[data-shoot-ui]')) return null;
        if (el.hasAttribute('data-shoot-target')) return el;
        el = el.parentElement;
    }
    return null;
}

function findTextOffsetAtPointWithRanges(root: HTMLElement, x: number, y: number): { node: Text; offset: number } | null {
    const range = document.createRange();
    let best: { node: Text; offset: number; area: number } | null = null;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let n: Node | null = walker.nextNode();
    while (n !== null) {
        const textNode = n as Text;
        const text = textNode.textContent ?? '';
        for (let i = 0; i < text.length; i++) {
            try {
                range.setStart(textNode, i);
                range.setEnd(textNode, i + 1);
                const r = range.getBoundingClientRect();
                if (r.width <= 0 || r.height <= 0) continue;
                if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
                    const area = r.width * r.height;
                    if (best === null || area < best.area) best = { node: textNode, offset: i, area };
                }
            } catch { /* skip */ }
        }
        n = walker.nextNode();
    }
    return best !== null ? { node: best.node, offset: best.offset } : null;
}

function wrapCharInTextNode(textNode: Text, offset: number): HTMLElement | null {
    const parentEl = textNode.parentElement;
    if (parentEl?.getAttribute('data-shoot-char-wrap') === '1') return parentEl;
    const full = textNode.textContent ?? '';
    if (full.length === 0) return null;
    let o = offset;
    if (o >= full.length) o = full.length - 1;
    if (o < 0) o = 0;
    const ch = full[o];
    if (ch === undefined) return null;
    const before = full.slice(0, o);
    const after = full.slice(o + 1);
    const span = document.createElement('span');
    span.setAttribute('data-shoot-char-wrap', '1');
    span.style.display = 'inline-block';
    span.textContent = ch;
    const fragment = document.createDocumentFragment();
    if (before.length > 0) fragment.appendChild(document.createTextNode(before));
    fragment.appendChild(span);
    if (after.length > 0) fragment.appendChild(document.createTextNode(after));
    const parent = textNode.parentNode;
    if (!parent) return null;
    parent.replaceChild(fragment, textNode);
    return span;
}

function wrapShootCharAtPoint(x: number, y: number, root: HTMLElement): HTMLElement | null {
    const doc = document as Document & { caretRangeFromPoint?: (nx: number, ny: number) => Range | null };
    let textNode: Text | null = null;
    let offset = 0;
    if (typeof doc.caretRangeFromPoint === 'function') {
        const caretRange = doc.caretRangeFromPoint(x, y);
        if (caretRange?.startContainer.nodeType === Node.TEXT_NODE) {
            const tn = caretRange.startContainer as Text;
            if (root.contains(tn)) { textNode = tn; offset = caretRange.startOffset; }
        }
    }
    if (textNode === null) {
        const found = findTextOffsetAtPointWithRanges(root, x, y);
        if (found === null) return null;
        textNode = found.node;
        offset = found.offset;
    }
    return wrapCharInTextNode(textNode, offset);
}

function resolveShootAnimationTarget(target: HTMLElement, x: number, y: number): HTMLElement {
    if (target.getAttribute('data-shoot-granularity') !== 'char') return target;
    return wrapShootCharAtPoint(x, y, target) ?? target;
}

function pickHitWord(x: number, y: number, raw: Element | null): HTMLElement | null {
    if (!raw) return null;
    if (raw.closest('[data-shoot-ui]')) return null;
    const target = pickInnerShootTarget(raw) ?? pickSemanticTextTarget(raw);
    if (!target || target.closest('[data-shoot-ui]')) return null;
    if (target.tagName === 'IMG') {
        const rect = target.getBoundingClientRect();
        return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) ? target : null;
    }
    if (raw instanceof HTMLElement && raw.tagName === 'IMG') {
        const rect = raw.getBoundingClientRect();
        return (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) ? raw : null;
    }
    const textAtPoint = getTextNodeAtPoint(x, y);
    if (!textAtPoint || !textNodeHasVisibleChar(textAtPoint)) {
        const imgs = target.querySelectorAll('img');
        for (const im of imgs) {
            const r = im.getBoundingClientRect();
            if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return im;
        }
        return target;
    }
    return pickInnerShootTargetFromTextNode(textAtPoint) ?? target;
}

function readInitialState(): boolean {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(SHOOT_MODE_STORAGE_KEY) === 'on';
}

function writeStateToStorage(isOn: boolean): void {
    try {
        window.localStorage.setItem(SHOOT_MODE_STORAGE_KEY, isOn ? 'on' : 'off');
        notifyShootModeSubscribers();
    } catch { /* ignore */ }
}

function GunLoadingFallback(): React.JSX.Element {
    return (
        <div className="h-64 w-[min(92vw,30rem)] sm:h-80 sm:w-xl md:h-96 md:w-176 overflow-visible flex items-end justify-center">
            <div className="h-60 w-[min(88vw,24rem)] sm:h-72 sm:w-md md:h-88 md:w-xl flex items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground/70" />
            </div>
        </div>
    );
}

const GunViewer = React.lazy(() => import('./gun-viewer'));

export function ShootToggle(): React.JSX.Element {
    const [isOn, setIsOn] = React.useState<boolean>(false);
    const [showGunCursor, setShowGunCursor] = React.useState<boolean>(false);
    const [dateTimeText, setDateTimeText] = React.useState<string>('');
    const [aimX, setAimX] = React.useState<number>(0);
    const [aimY, setAimY] = React.useState<number>(0);
    const [cursorX, setCursorX] = React.useState<number>(0);
    const [cursorY, setCursorY] = React.useState<number>(0);
    const [splats, setSplats] = React.useState<PaintSplat[]>([]);
    const [hoverShootControls, setHoverShootControls] = React.useState<boolean>(false);
    const pointerRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const updateAimFromPoint = React.useCallback((x: number, y: number) => {
        setCursorX(x);
        setCursorY(y);
        pointerRef.current = { x, y };
        setAimX(Math.max(-1, Math.min(1, (x / window.innerWidth) * 2 - 1)));
        setAimY(Math.max(-1, Math.min(1, (y / window.innerHeight) * 2 - 1)));
    }, []);

    React.useEffect(() => { setIsOn(readInitialState()); }, []);

    React.useEffect(() => { if (!isOn) setHoverShootControls(false); }, [isOn]);

    React.useEffect(() => { void import('./gun-viewer'); }, []);

    React.useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const apply = (matches: boolean) => setShowGunCursor(matches);
        apply(mq.matches);
        const onChange = (e: MediaQueryListEvent) => apply(e.matches);
        mq.addEventListener('change', onChange);
        return () => mq.removeEventListener('change', onChange);
    }, []);

    React.useEffect(() => {
        const format = () => {
            const now = new Date();
            const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
            const day = days[now.getDay()] ?? 'DAY';
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'P.M' : 'A.M';
            const displayHours = hours % 12 || 12;
            setDateTimeText(`${day} ${displayHours}:${minutes} ${ampm}`);
        };
        format();
        const id = window.setInterval(format, 1000);
        return () => window.clearInterval(id);
    }, []);

    const toggle = React.useCallback(() => {
        setIsOn((prev) => {
            const next = !prev;
            writeStateToStorage(next);
            if (next) void ensurePaintballAudioRunning();
            return next;
        });
    }, []);

    React.useEffect(() => {
        if (isOn) return;
        setSplats((prev) => {
            if (prev.length === 0) return prev;
            return prev.map((s) => ({ ...s, exiting: true }));
        });
        const id = window.setTimeout(() => setSplats([]), SPLAT_FADE_MS);
        return () => window.clearTimeout(id);
    }, [isOn]);

    React.useEffect(() => {
        if (!isOn) return;
        setSplats((prev) => prev.filter((s) => !s.exiting));
    }, [isOn]);

    React.useEffect(() => {
        if (!isOn) return;
        setCursorX(window.innerWidth / 2);
        setCursorY(window.innerHeight / 2);
        const onPointerMove = (e: PointerEvent) => {
            if (e.pointerType === 'touch') return;
            updateAimFromPoint(e.clientX, e.clientY);
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        return () => window.removeEventListener('pointermove', onPointerMove);
    }, [isOn, updateAimFromPoint]);

    React.useEffect(() => {
        if (!isOn) return;
        let firingInterval: number | null = null;
        let isHoldingPrimary = false;
        let touchStart: { x: number; y: number } | null = null;
        let touchMoved = false;
        const touchMoveThreshold = 12;

        const onSelectStart = (e: Event) => {
            const target = e.target as Element | null;
            if (target?.closest('[data-shoot-ui]')) return;
            if (target?.closest(SHOOT_SCROLL_INTERACTIVE_SEL)) return;
            e.preventDefault();
        };

        const fireShot = (x: number, y: number) => {
            const raw = document.elementFromPoint(x, y);
            if (raw?.closest('[data-shoot-ui]')) return;
            if (raw?.closest(SHOOT_SCROLL_INTERACTIVE_SEL)) return;

            playPaintballShotSound();

            const id = nextPaintSplatId();
            const size = 32 + Math.random() * 24;
            const rotation = (Math.random() * 80) - 40;
            const palettes = [
                { min: 340, max: 360 },
                { min: 8, max: 28 },
                { min: 185, max: 210 },
                { min: 265, max: 288 },
                { min: 95, max: 122 },
            ] as const;
            const picked = palettes[Math.floor(Math.random() * palettes.length)];
            const hue = picked.min + Math.random() * (picked.max - picked.min);
            const saturation = 74 + Math.random() * 18;
            const lightness = 42 + Math.random() * 16;

            setSplats((prev) => [
                ...prev.slice(-45),
                { id, x, y, size, rotation, hue, saturation, lightness },
            ]);
            window.setTimeout(() => {
                setSplats((prev) => prev.map((s) => s.id === id ? { ...s, exiting: true } : s));
                window.setTimeout(() => setSplats((prev) => prev.filter((s) => s.id !== id)), SPLAT_FADE_MS);
            }, SPLAT_VISIBLE_MS);

            // Expanding impact ring
            const ring = document.createElement('div');
            ring.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;border-radius:50%;border:2px solid hsl(${hue} ${saturation}% ${lightness}% / 0.85);transform:translate(-50%,-50%);pointer-events:none;z-index:9995;`;
            document.body.appendChild(ring);
            gsap.to(ring, { width: size * 5, height: size * 5, opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: () => ring.remove() });

            const pageContent = document.querySelector('main') as HTMLElement | null;
            if (pageContent) {
                gsap.fromTo(pageContent,
                    { x: 0, y: 0, rotate: 0 },
                    { x: 9, y: -6, rotate: -0.15, duration: 0.045, repeat: 5, yoyo: true, ease: 'power1.inOut', clearProps: 'transform' }
                );
            }

            const target = pickHitWord(x, y, raw);
            if (!target) {
                // Ghost fragment — ensures every click has element motion even with no semantic target
                const ghost = document.createElement('span');
                const gh = Math.round(size * 0.55);
                ghost.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${gh}px;height:${gh}px;background:hsl(${hue} ${saturation}% ${lightness}% / 0.75);border-radius:3px;pointer-events:none;z-index:9994;transform:translate(-50%,-50%);`;
                document.body.appendChild(ghost);
                const ghostTl = gsap.timeline({ onComplete: () => ghost.remove() });
                ghostTl
                    .to(ghost, { y: gsap.utils.random(-28, -14) as number, scale: 1.5, duration: 0.07, ease: 'power2.out' })
                    .to(ghost, { y: gsap.utils.random(60, 130) as number, x: gsap.utils.random(-40, 40) as number, scale: 0.2, opacity: 0, rotation: gsap.utils.random(-120, 120) as number, duration: 0.55, ease: 'power2.in' });
                return;
            }

            const animTarget = resolveShootAnimationTarget(target, x, y);
            const ds = (animTarget as HTMLElement & { dataset: DOMStringMap }).dataset;

            // Impact-only mode: recoil + elastic snap back (used for large cards / containers)
            if (ds.shootImpactOnly === '1') {
                gsap.timeline()
                    .to(animTarget, { x: gsap.utils.random(-8, 8) as number, y: gsap.utils.random(-5, 3) as number, rotation: gsap.utils.random(-1.5, 1.5) as number, scale: 0.98, duration: 0.06, ease: 'power3.out' })
                    .to(animTarget, { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.42, ease: 'elastic.out(1,0.5)' });
                return;
            }

            if (ds.shotDown === '1') {
                gsap.to(animTarget, { y: '+=12', rotation: '+=6', duration: 0.16, ease: 'power1.out' });
                return;
            }

            ds.shotDown = '1';
            (animTarget as HTMLElement).style.willChange = 'transform, opacity';
            const impactTilt = gsap.utils.random(-7, 7, 1) as number;
            const fallTilt = gsap.utils.random(-24, 24, 1) as number;
            const tl = gsap.timeline();
            tl.to(animTarget, { x: gsap.utils.random(-6, 6, 1) as number, y: gsap.utils.random(-10, -4, 1) as number, rotation: impactTilt, scale: 1.08, duration: 0.09, ease: 'power2.out' })
              .to(animTarget, { x: gsap.utils.random(-2, 2, 1) as number, y: gsap.utils.random(-2, 2, 1) as number, rotation: impactTilt * 0.45, scale: 0.96, duration: 0.08, ease: 'power1.inOut' })
              .to(animTarget, { y: window.innerHeight * 0.55, rotation: fallTilt, opacity: 0.15, scale: 1, duration: 1.05, ease: 'power2.in' });
        };

        const stopHoldFire = () => {
            isHoldingPrimary = false;
            if (firingInterval !== null) { window.clearInterval(firingInterval); firingInterval = null; }
        };

        const onPointerDown = (e: PointerEvent) => {
            if (!e.isPrimary) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            if ((e.target as Element | null)?.closest('[data-shoot-ui]')) return;
            if ((e.target as Element | null)?.closest(SHOOT_SCROLL_INTERACTIVE_SEL)) return;
            if (e.pointerType === 'touch') {
                touchStart = { x: e.clientX, y: e.clientY };
                touchMoved = false;
                return;
            }
            e.preventDefault();
            window.getSelection()?.removeAllRanges();
            updateAimFromPoint(e.clientX, e.clientY);
            fireShot(e.clientX, e.clientY);
            isHoldingPrimary = true;
            if (firingInterval !== null) window.clearInterval(firingInterval);
            firingInterval = window.setInterval(() => {
                if (!isHoldingPrimary) return;
                fireShot(pointerRef.current.x, pointerRef.current.y);
            }, 90);
        };

        const onPointerMove = (e: PointerEvent) => {
            if (!e.isPrimary || e.pointerType !== 'touch' || !touchStart) return;
            if (Math.hypot(e.clientX - touchStart.x, e.clientY - touchStart.y) > touchMoveThreshold) touchMoved = true;
        };

        const onPointerUp = (e: PointerEvent) => {
            if (!e.isPrimary) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;
            if (e.pointerType === 'touch') {
                const upEl = document.elementFromPoint(e.clientX, e.clientY);
                if (!upEl?.closest('[data-shoot-ui]') && !upEl?.closest(SHOOT_SCROLL_INTERACTIVE_SEL) && !touchMoved) {
                    updateAimFromPoint(e.clientX, e.clientY);
                    fireShot(e.clientX, e.clientY);
                }
                touchStart = null;
                touchMoved = false;
            }
            stopHoldFire();
        };

        const onPointerCancel = () => { touchStart = null; touchMoved = false; stopHoldFire(); };

        document.addEventListener('selectstart', onSelectStart);
        document.addEventListener('dragstart', onSelectStart);
        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove, { passive: true });
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerCancel);
        window.addEventListener('blur', stopHoldFire);
        return () => {
            stopHoldFire();
            document.removeEventListener('selectstart', onSelectStart);
            document.removeEventListener('dragstart', onSelectStart);
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerCancel);
            window.removeEventListener('blur', stopHoldFire);
        };
    }, [isOn, updateAimFromPoint]);

    React.useEffect(() => {
        const cursorClass = 'shoot-cursor-hidden';
        const modeClass = 'shoot-mode-active';
        const touchClass = 'shoot-mode-touch-ui';
        if (isOn) {
            document.documentElement.classList.add(modeClass);
            document.body.classList.add(modeClass);
            if (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0) {
                document.documentElement.classList.add(touchClass);
                document.body.classList.add(touchClass);
            }
        } else {
            document.documentElement.classList.remove(modeClass, touchClass);
            document.body.classList.remove(modeClass, touchClass);
        }
        const hide = isOn && showGunCursor && !hoverShootControls;
        if (hide) {
            document.documentElement.classList.add(cursorClass);
            document.body.classList.add(cursorClass);
        } else {
            document.documentElement.classList.remove(cursorClass);
            document.body.classList.remove(cursorClass);
        }
        return () => {
            document.documentElement.classList.remove(cursorClass, modeClass, touchClass);
            document.body.classList.remove(cursorClass, modeClass, touchClass);
        };
    }, [isOn, showGunCursor, hoverShootControls]);

    return (
        <>
            {(isOn || splats.length > 0) && (
                <div className="fixed inset-0 z-[9998] pointer-events-none" aria-hidden>
                    {splats.map((splat) => (
                        <div key={splat.id}
                            className="absolute transition-opacity ease-out"
                            style={{
                                left: splat.x, top: splat.y,
                                width: splat.size, height: splat.size,
                                transform: `translate(-50%, -50%) rotate(${splat.rotation}deg)`,
                                opacity: splat.exiting ? 0 : 1,
                                transitionDuration: `${SPLAT_FADE_MS}ms`,
                            }}>
                            <span className="absolute inset-0 opacity-95" style={{
                                clipPath: 'polygon(50% 0%, 59% 10%, 71% 4%, 77% 16%, 91% 12%, 89% 27%, 100% 38%, 88% 49%, 100% 62%, 84% 67%, 90% 82%, 74% 81%, 69% 97%, 55% 90%, 46% 100%, 35% 88%, 21% 96%, 15% 82%, 0% 77%, 6% 62%, 0% 48%, 11% 39%, 3% 24%, 18% 20%, 24% 5%, 38% 12%)',
                                background: `hsl(${splat.hue} ${splat.saturation}% ${splat.lightness}%)`,
                            }} />
                            <span className="absolute inset-0 opacity-70" style={{
                                clipPath: 'polygon(50% 8%, 62% 16%, 75% 14%, 84% 25%, 90% 38%, 83% 52%, 89% 65%, 77% 71%, 75% 85%, 62% 82%, 53% 92%, 42% 84%, 29% 88%, 22% 76%, 10% 70%, 14% 56%, 8% 44%, 18% 34%, 13% 22%, 27% 21%, 33% 10%, 44% 16%)',
                                background: `hsl(${splat.hue + 12} ${Math.min(splat.saturation + 8, 96)}% ${Math.min(splat.lightness + 10, 66)}%)`,
                            }} />
                            <span className="absolute rounded-full opacity-82" style={{
                                width: splat.size * 0.24, height: splat.size * 0.24,
                                left: -splat.size * 0.18, top: splat.size * 0.12,
                                background: `hsl(${splat.hue - 8} ${splat.saturation}% ${Math.max(splat.lightness - 10, 25)}%)`,
                            }} />
                            <span className="absolute rounded-full opacity-80" style={{
                                width: splat.size * 0.2, height: splat.size * 0.2,
                                right: -splat.size * 0.15, bottom: splat.size * 0.1,
                                background: `hsl(${splat.hue + 16} ${Math.min(splat.saturation + 6, 96)}% ${Math.max(splat.lightness - 4, 28)}%)`,
                            }} />
                            <span className="absolute rounded-full opacity-78" style={{
                                width: splat.size * 0.16, height: splat.size * 0.16,
                                left: splat.size * 0.36, bottom: -splat.size * 0.18,
                                background: `hsl(${splat.hue} ${splat.saturation}% ${Math.max(splat.lightness - 12, 24)}%)`,
                            }} />
                        </div>
                    ))}
                </div>
            )}

            {isOn && showGunCursor && !hoverShootControls && (
                <div className="fixed z-[9999] pointer-events-none"
                    style={{ left: cursorX, top: cursorY, transform: 'translate(-50%, -50%)' }}
                    aria-hidden data-shoot-ui="1">
                    <div className="relative h-7 w-7">
                        <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-foreground/70" />
                        <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-foreground/70" />
                        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/80" />
                        <span className="absolute right-[-8px] top-1/2 h-[2px] w-3 -translate-y-1/2 bg-foreground/80" />
                    </div>
                </div>
            )}

            {isOn && (
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none" data-shoot-ui="1">
                    <React.Suspense fallback={<GunLoadingFallback />}>
                        <GunViewer aimX={aimX} aimY={aimY} />
                    </React.Suspense>
                </div>
            )}

            <div className="fixed bottom-5 inset-x-0 z-[9999] px-6 pointer-events-none" data-shoot-ui="1">
                <div className="flex items-center justify-between">
                    <div className="pointer-events-auto cursor-pointer"
                        data-shoot-controls="1"
                        onMouseEnter={() => setHoverShootControls(true)}
                        onMouseLeave={() => setHoverShootControls(false)}>
                        <button type="button" onClick={toggle}
                            className={['group flex cursor-pointer items-center gap-3 rounded-full backdrop-blur-md px-4 py-2 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.35)] transition-[border-color,background-color] duration-200', isOn ? 'border border-border bg-card' : ''].join(' ')}
                            aria-pressed={isOn} aria-label="Toggle shoot mode">
                            <span aria-hidden className={['relative inline-flex h-5 w-9 items-center rounded-full border border-border bg-transparent transition-[border-color,background-color] duration-200', isOn ? 'bg-muted border-foreground/35' : ''].join(' ')}>
                                <span className={['absolute left-0.5 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-foreground transition-transform duration-200 ease-out', isOn ? 'translate-x-4' : 'translate-x-0'].join(' ')} />
                            </span>
                            <span className="text-[10px] font-mono uppercase tracking-[0.28em] text-foreground/80 select-none">Shoot</span>
                        </button>
                    </div>

                    <div />

                    <div className="pointer-events-none">
                        <div className="rounded-full backdrop-blur-md px-4 py-2">
                            <div className="text-[10px] font-mono uppercase tracking-[0.28em] text-foreground/70 select-none">{dateTimeText}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

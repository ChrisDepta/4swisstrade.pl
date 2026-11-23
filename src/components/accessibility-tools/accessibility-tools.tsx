"use client";

import {
  AlignCenter, Contrast, Eye, Link2, Menu, Minus, MousePointer2, MoveHorizontal,
  MoveVertical, Palette, Plus, RefreshCcw, ScanLine, Type, X, Zap,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import "./accessibility-tools.css";

type Level = 0 | 1 | 2 | 3;
type Section = "text" | "colors" | "reading";
type Settings = {
  scale: number;
  largeText: boolean;
  alignment: Level;
  readableFont: boolean;
  lineSpacing: Level;
  letterSpacing: Level;
  cursor: Level;
  desaturation: Level;
  contrast: boolean;
  invert: boolean;
  links: boolean;
  motion: boolean;
  readingLine: Level;
  readingMask: Level;
};

const defaults: Settings = {
  scale: 1, largeText: false, alignment: 0, readableFont: false,
  lineSpacing: 0, letterSpacing: 0, cursor: 0, desaturation: 0,
  contrast: false, invert: false, links: false, motion: false,
  readingLine: 0, readingMask: 0,
};

export const defaultAccessibilityLabels = {
  open: "Otwórz ustawienia dostępności",
  close: "Zamknij ustawienia dostępności",
  title: "Ustawienia dostępności",
  heading: "Twoja przestrzeń.",
  intro: "Dostosuj stronę do swoich potrzeb.",
  scale: "Wielkość tekstu",
  text: "Tekst",
  colors: "Kolory",
  reading: "Czytanie",
  increase: "Powiększ",
  decrease: "Zmniejsz",
  largeText: "Duży tekst",
  alignment: "Wyrównanie",
  readableFont: "Czytelna czcionka",
  lineSpacing: "Odstępy linii",
  letterSpacing: "Odstępy liter",
  cursor: "Większy kursor",
  desaturation: "Skala szarości",
  contrast: "Wysoki kontrast",
  invert: "Inwersja kolorów",
  links: "Wyróżnij linki",
  motion: "Mniej animacji",
  readingLine: "Linia czytania",
  readingMask: "Maska czytania",
  reset: "Resetuj",
  off: "Wyłączone",
  on: "Włączone",
  level: "Poziom",
  left: "Do lewej",
  center: "Do środka",
  right: "Do prawej",
};

export type AccessibilityLabels = { [K in keyof typeof defaultAccessibilityLabels]: string };
export type AccessibilityToolsProps = {
  children: ReactNode;
  storageKey?: string;
  brand?: string;
  labels?: Partial<AccessibilityLabels>;
  legacyStoragePrefix?: string;
};

function readSettings(storageKey: string, legacyStoragePrefix?: string): Settings {
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        throw new Error("Invalid accessibility settings");
      }
      const values = parsed as Record<string, unknown>;
      const result = { ...defaults };
      for (const key of Object.keys(defaults) as (keyof Settings)[]) {
        const value = values[key];
        if (key === "scale" && typeof value === "number" && Number.isFinite(value)) {
          result.scale = Math.min(4, Math.max(1, value));
        } else if (typeof defaults[key] === "boolean" && typeof value === "boolean") {
          Object.assign(result, { [key]: value });
        } else if (key !== "scale" && typeof defaults[key] === "number" && (value === 0 || value === 1 || value === 2 || value === 3)) {
          Object.assign(result, { [key]: value });
        }
      }
      if (result.readingLine && result.readingMask) result.readingMask = 0;
      return result;
    }
    if (legacyStoragePrefix) {
      const storedScale = Number.parseFloat(localStorage.getItem(`${legacyStoragePrefix}-font-scale`) ?? "1");
      return {
        ...defaults,
        scale: Number.isFinite(storedScale) ? Math.min(4, Math.max(1, storedScale)) : 1,
        contrast: localStorage.getItem(`${legacyStoragePrefix}-high-contrast`) === "true",
        motion: localStorage.getItem(`${legacyStoragePrefix}-reduce-motion`) === "true",
        invert: localStorage.getItem(`${legacyStoragePrefix}-invert-colors`) === "true",
        largeText: localStorage.getItem(`${legacyStoragePrefix}-large-text`) === "true",
      };
    }
  } catch (error) {
    console.warn("Nie udało się odczytać ustawień dostępności.", error);
  }
  return { ...defaults };
}

function nextLevel(level: Level): Level {
  return level === 3 ? 0 : (level + 1) as Level;
}

export function AccessibilityTools({
  children, storageKey = "accessibility-tools", brand = "DOSTĘPNOŚĆ",
  labels, legacyStoragePrefix,
}: AccessibilityToolsProps) {
  const text = { ...defaultAccessibilityLabels, ...labels };
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>("text");
  const [guideY, setGuideY] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setSettings(readSettings(storageKey, legacyStoragePrefix));
      setLoadedKey(storageKey);
    });
    return () => cancelAnimationFrame(frame);
  }, [storageKey, legacyStoragePrefix]);

  useEffect(() => {
    if (loadedKey !== storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (error) {
      console.warn("Nie udało się zapisać ustawień dostępności.", error);
    }
  }, [settings, storageKey, loadedKey]);

  useEffect(() => {
    const root = document.documentElement;
    const previousScale = root.style.getPropertyValue("--a11y-tools-scale");
    const hadAttribute = root.hasAttribute("data-a11y-tools-scale");
    const previousAttribute = root.getAttribute("data-a11y-tools-scale");
    if (settings.scale !== 1) {
      root.style.setProperty("--a11y-tools-scale", String(settings.scale));
      root.setAttribute("data-a11y-tools-scale", "");
    } else {
      root.style.removeProperty("--a11y-tools-scale");
      root.removeAttribute("data-a11y-tools-scale");
    }
    return () => {
      if (previousScale) root.style.setProperty("--a11y-tools-scale", previousScale);
      else root.style.removeProperty("--a11y-tools-scale");
      if (hadAttribute) root.setAttribute("data-a11y-tools-scale", previousAttribute ?? "");
      else root.removeAttribute("data-a11y-tools-scale");
    };
  }, [settings.scale]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!settings.readingLine && !settings.readingMask) return;
    const onPointerMove = (event: PointerEvent) => {
      if (event.target instanceof Node && contentRef.current?.contains(event.target)) setGuideY(event.clientY);
    };
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof HTMLElement && contentRef.current?.contains(event.target)) {
        const bounds = event.target.getBoundingClientRect();
        setGuideY(bounds.top + bounds.height / 2);
      }
    };
    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("focusin", onFocus);
    };
  }, [settings.readingLine, settings.readingMask]);

  const setScale = (value: number) => setSettings((current) => ({
    ...current, largeText: false, scale: Math.round(Math.min(4, Math.max(1, value)) * 10) / 10,
  }));
  const toggle = (key: "largeText" | "readableFont" | "contrast" | "invert" | "links" | "motion") => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
      ...(key === "largeText" ? { scale: current.largeText ? 1 : 1.8 } : {}),
    }));
  };
  const cycle = (key: "alignment" | "lineSpacing" | "letterSpacing" | "cursor" | "desaturation" | "readingLine" | "readingMask") => {
    setSettings((current) => ({
      ...current,
      [key]: nextLevel(current[key]),
      ...(key === "readingLine" ? { readingMask: 0 } : {}),
      ...(key === "readingMask" ? { readingLine: 0 } : {}),
    }));
  };
  const levelDescription = (level: Level) => level ? `${text.level} ${level}/3` : text.off;
  const toggleDescription = (active: boolean) => active ? text.on : text.off;
  const alignmentDescription = [text.off, text.left, text.center, text.right][settings.alignment];
  const cards = {
    text: [
      { id: "increase", icon: Plus, label: text.increase, description: "+0,2×", action: () => setScale(settings.scale + 0.2) },
      { id: "decrease", icon: Minus, label: text.decrease, description: "−0,2×", action: () => setScale(settings.scale - 0.2) },
      { id: "largeText", icon: Eye, label: text.largeText, description: toggleDescription(settings.largeText), action: () => toggle("largeText"), active: settings.largeText },
      { id: "alignment", icon: AlignCenter, label: text.alignment, description: alignmentDescription, action: () => cycle("alignment"), active: settings.alignment > 0 },
      { id: "readableFont", icon: Type, label: text.readableFont, description: toggleDescription(settings.readableFont), action: () => toggle("readableFont"), active: settings.readableFont },
      { id: "lineSpacing", icon: MoveVertical, label: text.lineSpacing, description: levelDescription(settings.lineSpacing), action: () => cycle("lineSpacing"), active: settings.lineSpacing > 0 },
      { id: "letterSpacing", icon: MoveHorizontal, label: text.letterSpacing, description: levelDescription(settings.letterSpacing), action: () => cycle("letterSpacing"), active: settings.letterSpacing > 0 },
    ],
    colors: [
      { id: "contrast", icon: Contrast, label: text.contrast, description: toggleDescription(settings.contrast), action: () => toggle("contrast"), active: settings.contrast },
      { id: "invert", icon: Palette, label: text.invert, description: toggleDescription(settings.invert), action: () => toggle("invert"), active: settings.invert },
      { id: "desaturation", icon: Contrast, label: text.desaturation, description: levelDescription(settings.desaturation), action: () => cycle("desaturation"), active: settings.desaturation > 0 },
    ],
    reading: [
      { id: "cursor", icon: MousePointer2, label: text.cursor, description: levelDescription(settings.cursor), action: () => cycle("cursor"), active: settings.cursor > 0 },
      { id: "links", icon: Link2, label: text.links, description: toggleDescription(settings.links), action: () => toggle("links"), active: settings.links },
      { id: "motion", icon: Zap, label: text.motion, description: toggleDescription(settings.motion), action: () => toggle("motion"), active: settings.motion },
      { id: "readingLine", icon: ScanLine, label: text.readingLine, description: levelDescription(settings.readingLine), action: () => cycle("readingLine"), active: settings.readingLine > 0 },
      { id: "readingMask", icon: Menu, label: text.readingMask, description: levelDescription(settings.readingMask), action: () => cycle("readingMask"), active: settings.readingMask > 0 },
    ],
  };
  const levels: Record<string, Level> = {
    alignment: settings.alignment, lineSpacing: settings.lineSpacing,
    letterSpacing: settings.letterSpacing, cursor: settings.cursor,
    desaturation: settings.desaturation, readingLine: settings.readingLine,
    readingMask: settings.readingMask,
  };
  const guideStyle = { "--a11y-guide-y": guideY === null ? "50vh" : `${guideY}px` } as CSSProperties;

  return (
    <>
      <button ref={triggerRef} type="button" className="accessibility-trigger"
        aria-label={open ? text.close : text.open} aria-expanded={open} aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}>
        {open ? <X size={30} aria-hidden="true" /> : <Eye size={30} aria-hidden="true" />}
      </button>
      <aside id={panelId} aria-label={text.title} aria-hidden={!open} inert={!open}
        className={`accessibility-panel${open ? " is-open" : ""}`}>
        <div className="accessibility-header">
          <p className="accessibility-eyebrow"><span />{brand}</p>
          <h2>{text.heading}</h2>
          <p className="accessibility-intro">{text.intro}</p>
        </div>
        <div className="accessibility-scale">
          <div className="accessibility-scale-heading">
            <label htmlFor={`${panelId}-scale`}>{text.scale}</label>
            <output htmlFor={`${panelId}-scale`}>{settings.scale.toFixed(1)}×</output>
          </div>
          <div className="accessibility-slider-row">
            <span aria-hidden="true">A</span>
            <input id={`${panelId}-scale`} type="range" min="1" max="4" step="0.1"
              value={settings.scale} onChange={(event) => setScale(Number(event.target.value))}
              aria-valuetext={`${settings.scale.toFixed(1)}×`} />
            <span className="accessibility-large-a" aria-hidden="true">A</span>
          </div>
        </div>
        <nav className="accessibility-tabs" aria-label={text.title}>
          {(["text", "colors", "reading"] as const).map((item) => (
            <button type="button" key={item} aria-pressed={section === item}
              className={section === item ? "is-active" : ""} onClick={() => setSection(item)}>
              {text[item]}
            </button>
          ))}
        </nav>
        <div className="accessibility-cards">
          {cards[section].map(({ id, icon: Icon, label, description, action, active }) => (
            <button key={id} type="button" onClick={action} aria-pressed={active}
              aria-label={`${label}: ${description}`}
              className={`accessibility-card${active ? " is-active" : ""}${id === "increase" || id === "decrease" ? " is-font-control" : ""}`}>
              <Icon size={32} strokeWidth={2} aria-hidden="true" />
              <span className="accessibility-card-label">{label}</span>
              <span className="accessibility-card-description">{description}</span>
              {levels[id] !== undefined && (
                <span className="accessibility-levels" aria-hidden="true">
                  {[1, 2, 3].map((level) => <span key={level} className={level <= levels[id] ? "is-filled" : ""} />)}
                </span>
              )}
            </button>
          ))}
        </div>
        <button type="button" className="accessibility-reset" onClick={() => setSettings({ ...defaults })}>
          <RefreshCcw size={18} aria-hidden="true" /> {text.reset}
        </button>
      </aside>
      {(settings.readingLine > 0 || settings.readingMask > 0) && (
        <div className="a11y-reading-guide" style={guideStyle} aria-hidden="true"
          data-line={settings.readingLine || undefined} data-mask={settings.readingMask || undefined}>
          {settings.readingMask > 0 ? <><div className="a11y-mask-top" /><div className="a11y-mask-bottom" /></> : <div className="a11y-guide-line" />}
        </div>
      )}
      <div ref={contentRef} className="a11y-site"
        data-align={settings.alignment || undefined} data-readable={settings.readableFont || undefined}
        data-line-spacing={settings.lineSpacing || undefined} data-letter-spacing={settings.letterSpacing || undefined}
        data-cursor={settings.cursor || undefined} data-desaturation={settings.desaturation || undefined}
        data-contrast={settings.contrast || undefined} data-invert={settings.invert || undefined}
        data-links={settings.links || undefined} data-motion={settings.motion || undefined}>
        {children}
      </div>
    </>
  );
}

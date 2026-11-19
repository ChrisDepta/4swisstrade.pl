"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ darkLabel, lightLabel }: { darkLabel: string; lightLabel: string }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("4swiss-theme");
    const useDark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", useDark);
    Promise.resolve().then(() => setDark(useDark));
  }, []);
  const toggle = () => {
    const value = !dark;
    setDark(value);
    document.documentElement.classList.toggle("dark", value);
    localStorage.setItem("4swiss-theme", value ? "dark" : "light");
  };
  return <button type="button" onClick={toggle} className="focus-ring grid size-10 place-items-center border hairline" aria-label={dark ? lightLabel : darkLabel}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>;
}

"use client";

import { useState, useEffect, useCallback } from "react";

export default function KeyboardShortcuts() {
  const [showHelp, setShowHelp] = useState(false);

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    switch (e.key) {
      case "?":
        e.preventDefault();
        setShowHelp(prev => !prev);
        break;
      case "/":
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
        break;
      case "d":
        if (!e.metaKey && !e.ctrlKey) {
          window.location.href = "/database";
        }
        break;
      case "Escape":
        setShowHelp(false);
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  if (!showHelp) return null;

  const shortcuts = [
    { key: "/", desc: "Focus search" },
    { key: "d", desc: "Go to database" },
    { key: "?", desc: "Toggle this help" },
    { key: "Esc", desc: "Close panels" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowHelp(false)}>
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-80" onClick={e => e.stopPropagation()}>
        <h3 className="text-sm font-semibold text-ink mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-2">
          {shortcuts.map(s => (
            <div key={s.key} className="flex items-center justify-between text-sm">
              <span className="text-muted">{s.desc}</span>
              <kbd className="px-2 py-0.5 bg-bg rounded border border-black/[.06] font-mono text-xs text-ink">{s.key}</kbd>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-black/[.06] text-xs text-muted text-center">
          Press <kbd className="px-1 py-0.5 bg-bg rounded border border-black/[.06] font-mono">?</kbd> to toggle
        </div>
      </div>
    </div>
  );
}

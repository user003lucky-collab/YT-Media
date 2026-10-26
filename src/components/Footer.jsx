import React from 'react';
import { Headphones, Shield, Sparkles } from 'lucide-react';

export default function Footer({ brandAttribution }) {
  return (
    <footer className="mt-16 mb-28 lg:mb-32 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 pb-4 text-xs text-[#cec7b8] select-none">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-[#d4af37] animate-pulse" />
        <p className="font-medium tracking-wide">
          YT Media &bull; {brandAttribution}
        </p>
      </div>

      <div className="flex items-center gap-2 text-[#a8a49c]">
        <Headphones className="size-4 text-[#d4af37]" />
        <span>Make yourself at home.</span>
      </div>
    </footer>
  );
}

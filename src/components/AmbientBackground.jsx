import React from 'react';

export default function AmbientBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none overflow-hidden -z-20">
      {/* Obsidian Space Foundation */}
      <div className="absolute inset-0 bg-[#040407]" />

      {/* Gold Orb Top Left */}
      <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-[#d4af37]/[0.08] blur-[140px] animate-orb-1" />

      {/* Crimson Orb Top Right */}
      <div className="absolute top-28 -right-32 w-[600px] h-[550px] rounded-full bg-[#ff0033]/[0.07] blur-[135px] animate-orb-2" />

      {/* Electric Indigo Orb Bottom Center */}
      <div className="absolute -bottom-40 left-1/4 w-[750px] h-[600px] rounded-full bg-[#4f46e5]/[0.09] blur-[150px] animate-orb-3" />

      {/* Cyber Cyan Orb Center Right */}
      <div className="absolute top-1/2 -right-28 w-[500px] h-[500px] rounded-full bg-[#06b6d4]/[0.07] blur-[140px] animate-orb-4" />

      {/* Subtle Grain / Spatial Shimmer Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
    </div>
  );
}

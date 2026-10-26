import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Delete, Shield, Sparkles } from 'lucide-react';

export default function VaultLock({ onUnlock, brandAttribution }) {
  const [pin, setPin] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Master Secret Validation
  const handleDigit = (digit) => {
    if (pin.length >= 4 || isSuccess) return;
    const nextPin = pin + digit;
    setPin(nextPin);

    if (nextPin.length === 4) {
      // Validate PIN
      if (nextPin === '1999') {
        setIsSuccess(true);
        setTimeout(() => {
          onUnlock();
        }, 600);
      } else {
        setIsError(true);
        setTimeout(() => {
          setPin('');
          setIsError(false);
        }, 700);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isSuccess) {
      setPin(pin.slice(0, -1));
      setIsError(false);
    }
  };

  const handleClear = () => {
    if (!isSuccess) {
      setPin('');
      setIsError(false);
    }
  };

  // Physical Keyboard Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        handleClear();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isSuccess]);

  return (
    <div
      className={`fixed inset-0 z-[999] flex flex-col justify-between items-center px-4 py-8 select-none transition-all duration-700 ${
        isSuccess
          ? 'opacity-0 scale-110 pointer-events-none'
          : 'opacity-100 scale-100'
      }`}
      style={{
        background: 'radial-gradient(circle at center, rgba(14, 14, 24, 0.94) 0%, #040407 100%)',
        backdropFilter: 'blur(45px) saturate(220%)',
        WebkitBackdropFilter: 'blur(45px) saturate(220%)'
      }}
    >
      {/* Dynamic Ambient Background Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-[#d4af37]/15 blur-[120px] animate-orb-1" />
        <div className="absolute top-1/3 -right-20 w-96 h-96 rounded-full bg-[#ff0033]/12 blur-[130px] animate-orb-2" />
        <div className="absolute -bottom-20 left-1/3 w-[500px] h-[400px] rounded-full bg-[#4f46e5]/15 blur-[140px] animate-orb-3" />
      </div>

      {/* Top Header / Emblem */}
      <div className="flex flex-col items-center text-center mt-4 sm:mt-8">
        <div className="relative group">
          <div className="size-20 sm:size-24 rounded-3xl liquid-glass-elevated flex items-center justify-center p-0.5 border border-white/20 shadow-2xl transition-all duration-500 hover:scale-105">
            <div className="w-full h-full rounded-[22px] bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center relative overflow-hidden">
              <span className="font-display text-4xl sm:text-5xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#fbf8ee] via-[#d4af37] to-[#f5e8b2]">
                YT
              </span>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>
          <div className="absolute -inset-1 rounded-3xl bg-[#d4af37]/20 blur-xl -z-10" />
        </div>

        <h1 className="mt-5 text-2xl sm:text-3xl font-semibold tracking-tight text-[#fbf8ee] flex items-center gap-2">
          <span>YT Media Sanctuary</span>
          <Shield className="size-5 text-[#d4af37] opacity-80" />
        </h1>
        <p className="mt-1.5 text-xs sm:text-sm text-[#bbb7ad] max-w-xs font-light tracking-wide">
          Private Spatial Media Ecosystem &bull; Authenticate
        </p>
      </div>

      {/* Central Interactive Vault Interface */}
      <div
        className={`w-full max-w-xs sm:max-w-sm flex flex-col items-center liquid-glass rounded-3xl p-6 sm:p-8 my-auto transition-transform ${
          isError ? 'animate-shake border-red-500/50 shadow-[0_0_40px_rgba(255,0,51,0.35)]' : 'border-white/15'
        }`}
      >
        {/* Lock Status & Status Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {isSuccess ? (
            <Unlock className="size-5 text-emerald-400 transition-all scale-110" />
          ) : (
            <Lock className={`size-5 transition-colors ${isError ? 'text-red-400' : 'text-[#d4af37]'}`} />
          )}
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#d4af37]/90">
            {isSuccess ? 'Access Granted' : isError ? 'Passcode Denied' : 'Enter Passcode'}
          </span>
        </div>

        {/* 4 Glowing PIN Orbs */}
        <div className="flex items-center gap-5 sm:gap-6 mb-8">
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <div
                key={index}
                className={`relative flex items-center justify-center size-4 sm:size-5 rounded-full transition-all duration-300 ${
                  isFilled
                    ? isError
                      ? 'bg-red-500 shadow-[0_0_15px_#ff0033] scale-110'
                      : isSuccess
                      ? 'bg-emerald-400 shadow-[0_0_20px_#10b981] scale-125'
                      : 'bg-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.9)] scale-110'
                    : 'bg-white/10 border border-white/25 shadow-inner'
                }`}
              >
                {isFilled && (
                  <span className="size-1.5 rounded-full bg-white animate-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* 3D Tactile Circular Glass Keypad */}
        <div className="grid grid-cols-3 gap-3.5 sm:gap-4 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="group relative flex flex-col items-center justify-center size-16 sm:size-[72px] mx-auto rounded-full liquid-glass-elevated border border-white/15 active:scale-95 transition-all duration-150 hover:border-[#d4af37]/60 hover:bg-white/10 cursor-pointer shadow-lg"
            >
              <span className="text-xl sm:text-2xl font-light text-[#fbf8ee] group-hover:text-[#d4af37] transition-colors">
                {digit}
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
            </button>
          ))}

          {/* Bottom Row: Clear, 0, Backspace */}
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center justify-center size-16 sm:size-[72px] mx-auto rounded-full liquid-glass border border-white/10 active:scale-90 transition-all text-xs uppercase tracking-wider text-[#bbb7ad] hover:text-white hover:bg-white/10 cursor-pointer"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="group relative flex flex-col items-center justify-center size-16 sm:size-[72px] mx-auto rounded-full liquid-glass-elevated border border-white/15 active:scale-95 transition-all duration-150 hover:border-[#d4af37]/60 hover:bg-white/10 cursor-pointer shadow-lg"
          >
            <span className="text-xl sm:text-2xl font-light text-[#fbf8ee] group-hover:text-[#d4af37] transition-colors">
              0
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none" />
          </button>

          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete digit"
            className="flex items-center justify-center size-16 sm:size-[72px] mx-auto rounded-full liquid-glass border border-white/10 active:scale-90 transition-all text-[#bbb7ad] hover:text-[#d4af37] hover:bg-white/10 cursor-pointer"
          >
            <Delete className="size-5" />
          </button>
        </div>
      </div>

      {/* Footer Branding Attribution (CRITICAL) */}
      <div className="mt-4 text-center">
        <p className="text-xs sm:text-sm text-[#cec7b8]/80 font-medium tracking-wide">
          YT Media &bull; {brandAttribution}
        </p>
      </div>
    </div>
  );
}

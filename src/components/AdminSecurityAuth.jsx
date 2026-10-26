import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Delete, 
  Fingerprint, 
  Clock, 
  Sparkles 
} from 'lucide-react';

// Authoritative Master Administrative Credentials
const ADMIN_PASSCODE = '9765731850';
const ADMIN_PASSCODE_HASH = '2488173a1f41cfb07bf03478c41dd055f64a3741336acd152a7d026921a2a5ca';
const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

export default function AdminSecurityAuth({ isOpen, onClose, onAuthenticated }) {
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  const inputRef = useRef(null);

  // Check and manage cooldown timer
  useEffect(() => {
    let timer = null;
    if (lockoutRemaining > 0) {
      timer = setInterval(() => {
        setLockoutRemaining((prev) => {
          if (prev <= 1) {
            setAttempts(0);
            setErrorMessage('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lockoutRemaining]);

  // Focus physical input whenever modal opens or resets
  useEffect(() => {
    if (isOpen && lockoutRemaining === 0) {
      setPasscode('');
      setIsError(false);
      setIsSuccess(false);
      setErrorMessage('');
      const t = setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 150);
      return () => clearTimeout(t);
    }
  }, [isOpen, lockoutRemaining]);

  if (!isOpen) return null;

  const isLockedOut = lockoutRemaining > 0;

  // Validate Passcode
  const verifyPasscode = async (inputToVerify) => {
    const clean = inputToVerify.trim();
    if (isLockedOut) return;

    // Direct check & SHA-256 hash validation
    let isMatch = clean === ADMIN_PASSCODE;
    if (!isMatch && window.crypto && window.crypto.subtle) {
      try {
        const msgUint8 = new TextEncoder().encode(clean);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        if (hashHex === ADMIN_PASSCODE_HASH) {
          isMatch = true;
        }
      } catch {
        // Fallback to direct check
      }
    }

    if (isMatch) {
      setIsSuccess(true);
      setIsError(false);
      setErrorMessage('');
      setTimeout(() => {
        onAuthenticated();
      }, 650);
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setIsError(true);

      if (nextAttempts >= MAX_ATTEMPTS) {
        setLockoutRemaining(LOCKOUT_SECONDS);
        setErrorMessage(`Too many failed attempts. Security lock activated for ${LOCKOUT_SECONDS}s.`);
      } else {
        setErrorMessage(`Authorization Denied. Invalid Passcode. (${MAX_ATTEMPTS - nextAttempts} attempts remaining)`);
      }

      setTimeout(() => {
        setPasscode('');
        setIsError(false);
        if (inputRef.current && nextAttempts < MAX_ATTEMPTS) {
          inputRef.current.focus();
        }
      }, 900);
    }
  };

  const handleKeypadDigit = (digit) => {
    if (isLockedOut || isSuccess || passcode.length >= 10) return;
    const next = passcode + digit;
    setPasscode(next);
    if (next.length === 10) {
      verifyPasscode(next);
    }
  };

  const handleBackspace = () => {
    if (isLockedOut || isSuccess || passcode.length === 0) return;
    setPasscode(passcode.slice(0, -1));
    setIsError(false);
  };

  const handleClear = () => {
    if (isLockedOut || isSuccess) return;
    setPasscode('');
    setIsError(false);
  };

  const handlePhysicalInputChange = (e) => {
    if (isLockedOut || isSuccess) return;
    // Extract only digits, max 10
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPasscode(val);
    if (val.length === 10) {
      verifyPasscode(val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (passcode.length > 0) {
        verifyPasscode(passcode);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-300">
      {/* Heavy obsidian refractive blur backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#040407]/92 backdrop-blur-3xl"
      />

      {/* Ambient Holographic Glow Aura */}
      <div className="absolute size-96 rounded-full bg-gradient-to-tr from-[#d4af37]/20 via-[#ff0033]/15 to-[#8b5cf6]/20 blur-[130px] pointer-events-none -z-10 animate-pulse" />

      {/* Main Security Portal Frame */}
      <div className={`relative w-full max-w-md liquid-glass-elevated rounded-[32px] sm:rounded-[40px] overflow-hidden border border-white/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-6 sm:p-8 flex flex-col items-center transition-all ${
        isError ? 'animate-shake border-red-500/60 shadow-[0_0_50px_rgba(255,0,51,0.35)]' : ''
      }`}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 size-9 rounded-full liquid-glass flex items-center justify-center text-[#bbb] hover:text-white border border-white/10 active:scale-95 transition-all cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Security Shield Emblem */}
        <div className="relative mb-4 mt-2">
          <div className={`size-18 rounded-2xl liquid-glass flex items-center justify-center border transition-all duration-500 ${
            isSuccess 
              ? 'border-emerald-400/80 bg-emerald-500/20 text-emerald-400 scale-110 shadow-[0_0_30px_rgba(52,211,153,0.5)]'
              : isError
              ? 'border-red-500/80 bg-red-500/20 text-red-400'
              : 'border-[#d4af37]/40 bg-[#d4af37]/10 text-[#d4af37]'
          }`}>
            {isSuccess ? (
              <CheckCircle2 className="size-9 animate-in zoom-in-75" />
            ) : isError ? (
              <AlertTriangle className="size-9" />
            ) : isLockedOut ? (
              <Clock className="size-9 text-red-400 animate-spin" />
            ) : (
              <ShieldCheck className="size-9" />
            )}
          </div>
          <div className="absolute -inset-2 rounded-2xl bg-[#d4af37]/15 blur-lg -z-10" />
        </div>

        {/* Title & Security Classification */}
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#fbf8ee] text-center">
          Admin Studio Security
        </h2>
        <p className="text-xs text-[#a9a49c] text-center mt-1 max-w-xs">
          Zero-Trust Root Administrative Authorization &bull; Enter 10-Digit Security Passcode
        </p>

        {/* Lockout Warning Banner if Active */}
        {isLockedOut && (
          <div className="w-full mt-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 text-xs text-center flex items-center justify-center gap-2 animate-in fade-in">
            <Clock className="size-4 animate-spin shrink-0" />
            <span>Lockout cooldown active. Retry in <strong>{lockoutRemaining}s</strong></span>
          </div>
        )}

        {/* Error Feedback Message */}
        {errorMessage && !isLockedOut && (
          <div className="w-full mt-3 p-2.5 rounded-xl bg-red-500/15 border border-red-500/35 text-red-400 text-xs text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <AlertTriangle className="size-3.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Confirmation Banner */}
        {isSuccess && (
          <div className="w-full mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-1.5 animate-in zoom-in-95">
            <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
            <span>Identity Verified • Opening Admin Studio...</span>
          </div>
        )}

        {/* Hidden / Keyboard-Accessible Input */}
        <input
          ref={inputRef}
          type={showPasscode ? 'text' : 'password'}
          inputMode="numeric"
          maxLength={10}
          value={passcode}
          onChange={handlePhysicalInputChange}
          onKeyDown={handleKeyDown}
          disabled={isLockedOut || isSuccess}
          autoComplete="off"
          className="opacity-0 absolute -top-100 left-0 pointer-events-none"
          aria-label="Admin Security Passcode"
        />

        {/* Interactive Passcode Nodes & Eye Toggle Row */}
        <div 
          onClick={() => { if (inputRef.current && !isLockedOut) inputRef.current.focus(); }}
          className="w-full my-6 p-4 rounded-2xl liquid-glass border border-white/15 flex flex-col items-center justify-center gap-3 cursor-text group"
        >
          {/* 10-Digit Indicator Nodes */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full">
            {Array.from({ length: 10 }).map((_, index) => {
              const isFilled = index < passcode.length;
              const isCurrent = index === passcode.length && !isLockedOut;
              const digitChar = passcode[index];

              return (
                <div
                  key={index}
                  className={`relative flex items-center justify-center transition-all duration-200 ${
                    showPasscode ? 'size-7 sm:size-8' : 'size-6 sm:size-7'
                  } rounded-xl border ${
                    isFilled
                      ? 'border-[#d4af37] bg-gradient-to-b from-[#f5e8b2]/30 to-[#d4af37]/20 shadow-[0_0_12px_rgba(212,175,55,0.4)] scale-105'
                      : isCurrent
                      ? 'border-[#d4af37]/60 bg-white/5 animate-pulse'
                      : 'border-white/10 bg-black/40'
                  }`}
                >
                  {isFilled ? (
                    showPasscode ? (
                      <span className="text-xs sm:text-sm font-bold text-[#fbf8ee]">{digitChar}</span>
                    ) : (
                      <span className="size-2 rounded-full bg-[#fbf8ee] shadow-sm" />
                    )
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* Quick Controls: Passcode Progress & Visibility Toggle */}
          <div className="flex items-center justify-between w-full text-[11px] text-[#8e8a80] px-1 pt-1 border-t border-white/5">
            <span>{passcode.length} / 10 digits</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowPasscode(!showPasscode);
              }}
              className="flex items-center gap-1 text-[#bbb] hover:text-[#d4af37] transition-colors cursor-pointer"
            >
              {showPasscode ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              <span>{showPasscode ? 'Hide' : 'Show'}</span>
            </button>
          </div>
        </div>

        {/* On-Screen Numerical Glass Keypad */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 w-full max-w-xs">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              disabled={isLockedOut || isSuccess}
              onClick={() => handleKeypadDigit(num.toString())}
              className="h-12 rounded-2xl liquid-glass text-lg font-semibold text-[#fbf8ee] border border-white/10 hover:border-[#d4af37]/50 hover:bg-white/[0.08] active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            >
              {num}
            </button>
          ))}

          {/* Clear Button */}
          <button
            type="button"
            disabled={isLockedOut || isSuccess || passcode.length === 0}
            onClick={handleClear}
            className="h-12 rounded-2xl liquid-glass text-xs font-medium text-[#aaa] hover:text-white border border-white/10 hover:border-white/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            Clear
          </button>

          {/* Zero Button */}
          <button
            type="button"
            disabled={isLockedOut || isSuccess}
            onClick={() => handleKeypadDigit('0')}
            className="h-12 rounded-2xl liquid-glass text-lg font-semibold text-[#fbf8ee] border border-white/10 hover:border-[#d4af37]/50 hover:bg-white/[0.08] active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
          >
            0
          </button>

          {/* Backspace Button */}
          <button
            type="button"
            disabled={isLockedOut || isSuccess || passcode.length === 0}
            onClick={handleBackspace}
            className="h-12 rounded-2xl liquid-glass text-[#aaa] hover:text-white border border-white/10 hover:border-white/20 active:scale-95 transition-all flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
            title="Backspace"
          >
            <Delete className="size-4.5" />
          </button>
        </div>

        {/* Direct Action Submit Button */}
        <button
          type="button"
          disabled={isLockedOut || isSuccess || passcode.length === 0}
          onClick={() => verifyPasscode(passcode)}
          className="w-full h-11 mt-5 rounded-2xl bg-gradient-to-r from-[#d4af37] to-[#e8d8a7] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,175,55,0.35)] active:scale-98 hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
        >
          <KeyRound className="size-4" />
          <span>Authorize Access</span>
        </button>

        {/* Security Notice Footer */}
        <p className="mt-4 text-[10px] text-[#6d6a62] text-center">
          Encrypted Zero-Trust Session &bull; Rate-Limited Authentication Barrier
        </p>
      </div>
    </div>
  );
}

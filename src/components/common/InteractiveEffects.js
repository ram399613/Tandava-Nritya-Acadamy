'use client';

import { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Flame } from 'lucide-react';

export default function InteractiveEffects() {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [particles, setParticles] = useState([]);
  const [embers, setEmbers] = useState([]);
  const audioCtxRef = useRef(null);

  
  const playGhungrooSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
      if (!ctx) return;

      
      const frequencies = [880, 1320, 1760, 2400, 3100];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 60, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.95, ctx.currentTime + 0.16);

        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.19);
      });
    } catch (_) {}
  };

  
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const applySavedSettings = () => {
      const savedOpacity = localStorage.getItem('tandava_opacity') || '10';
      const savedBlur = localStorage.getItem('tandava_blur') || '4';
      const savedTheme = localStorage.getItem('tandava_theme') || 'violet';

      const alpha = (Number(savedOpacity) / 100).toFixed(2);
      document.documentElement.style.setProperty('--glass-bg', `rgba(14, 12, 24, ${alpha})`);
      document.documentElement.style.setProperty('--glass-blur', `${savedBlur}px`);

      const themePalettes = {
        violet: { primary: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)', glow: 'rgba(139, 92, 246, 0.45)' },
        solar: { primary: '#f59e0b', gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', glow: 'rgba(245, 158, 11, 0.45)' },
        cyan: { primary: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', glow: 'rgba(6, 182, 212, 0.45)' },
        rose: { primary: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', glow: 'rgba(236, 72, 153, 0.45)' },
        emerald: { primary: '#10b981', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', glow: 'rgba(16, 185, 129, 0.45)' },
      };

      const theme = themePalettes[savedTheme] || themePalettes.violet;
      document.documentElement.style.setProperty('--accent-primary', theme.primary);
      document.documentElement.style.setProperty('--accent-gradient', theme.gradient);
      document.documentElement.style.setProperty('--accent-glow', theme.glow);
    };

    applySavedSettings();
    window.addEventListener('tandava_settings_updated', applySavedSettings);
    return () => window.removeEventListener('tandava_settings_updated', applySavedSettings);
  }, []);

  
  useEffect(() => {
    const initialEmbers = Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 10 + Math.random() * 15,
      delay: Math.random() * 8,
      color: ['#f59e0b', '#fbbf24', '#f97316', '#ec4899', '#c084fc'][Math.floor(Math.random() * 5)],
    }));
    setEmbers(initialEmbers);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.closest('#sound-toggle-btn')) return;

      playGhungrooSound();

      const { clientX: x, clientY: y } = e;
      const count = 8;
      const newSparks = [];

      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
        const distance = 40 + Math.random() * 50;
        const color = ['#f59e0b', '#fbbf24', '#ec4899', '#8b5cf6', '#38bdf8'][Math.floor(Math.random() * 5)];
        const size = 4 + Math.random() * 6;

        newSparks.push({
          id: Math.random() + Date.now(),
          x,
          y,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          color,
          size,
        });
      }

      
      newSparks.push({
        id: Math.random() + Date.now(),
        x,
        y,
        isRipple: true,
      });

      setParticles((prev) => [...prev.slice(-35), ...newSparks]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newSparks.includes(p)));
      }, 700);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [soundEnabled]);

  return (
    <>
      {}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          overflow: 'hidden',
        }}
      >
        {embers.map((emb) => (
          <span
            key={emb.id}
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: `${emb.left}%`,
              width: `${emb.size}px`,
              height: `${emb.size}px`,
              borderRadius: '50%',
              backgroundColor: emb.color,
              boxShadow: `0 0 ${emb.size * 2}px ${emb.color}, 0 0 ${emb.size * 4}px ${emb.color}`,
              opacity: 0.6,
              animation: `emberRise ${emb.duration}s infinite linear`,
              animationDelay: `${emb.delay}s`,
            }}
          />
        ))}
      </div>

      {}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 99999,
          overflow: 'hidden',
        }}
      >
        {particles.map((p) => {
          if (p.isRipple) {
            return (
              <span
                key={p.id}
                style={{
                  position: 'absolute',
                  left: p.x,
                  top: p.y,
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  border: '2px solid rgba(245, 158, 11, 0.85)',
                  boxShadow: '0 0 25px rgba(245, 158, 11, 0.7), inset 0 0 12px rgba(236, 72, 153, 0.5)',
                  animation: 'rippleWave 0.7s cubic-bezier(0.1, 0.8, 0.3, 1) forwards',
                }}
              />
            );
          }

          return (
            <span
              key={p.id}
              style={{
                position: 'absolute',
                left: p.x,
                top: p.y,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                backgroundColor: p.color,
                boxShadow: `0 0 14px ${p.color}, 0 0 24px ${p.color}`,
                transform: 'translate(-50%, -50%)',
                animation: `sparkleFly 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
                '--dx': `${p.dx}px`,
                '--dy': `${p.dy}px`,
              }}
            />
          );
        })}
      </div>

      {}
      <div
        style={{
          position: 'fixed',
          bottom: '1.25rem',
          right: '1.25rem',
          zIndex: 9999,
        }}
      >
        <button
          id="sound-toggle-btn"
          onClick={() => setSoundEnabled((prev) => !prev)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '9999px',
            background: soundEnabled
              ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(217, 70, 239, 0.35) 100%)'
              : 'rgba(15, 12, 24, 0.65)',
            border: soundEnabled
              ? '1px solid rgba(245, 158, 11, 0.6)'
              : '1px solid rgba(255, 255, 255, 0.14)',
            boxShadow: soundEnabled
              ? '0 0 25px rgba(245, 158, 11, 0.4), 0 4px 15px rgba(0,0,0,0.4)'
              : '0 4px 15px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            color: soundEnabled ? '#fef08a' : '#94a3b8',
            fontSize: '0.78rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
          title="Toggle Indian Dance Ghungroo Click Sound & Cosmic FX"
        >
          {soundEnabled ? (
            <>
              <Volume2 size={15} color="#fbbf24" />
              <span>Ghungroo Bells: ON</span>
              <Sparkles size={13} color="#f472b6" />
            </>
          ) : (
            <>
              <VolumeX size={15} />
              <span>Studio FX: OFF</span>
              <Sparkles size={13} style={{ opacity: 0.5 }} />
            </>
          )}
        </button>
      </div>

      <style jsx global>{`
        @keyframes rippleWave {
          0% {
            width: 10px;
            height: 10px;
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            width: 130px;
            height: 130px;
            opacity: 0;
            transform: translate(-50%, -50%) scale(1.6);
          }
        }

        @keyframes sparkleFly {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))) scale(0.2);
          }
        }

        @keyframes emberRise {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          80% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-105vh) scale(1.3) translateX(25px);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

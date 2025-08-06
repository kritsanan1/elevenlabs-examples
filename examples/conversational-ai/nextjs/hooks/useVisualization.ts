import { useState, useEffect, useRef, useCallback } from "react";
import { VisualizationMode, VisualizationConfig } from "@/types/conversation";

interface VisualizationRenderProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  mode: VisualizationMode;
  setMode: (mode: VisualizationMode) => void;
}

/**
 * Custom hook for audio visualization
 * Separates visualization logic from UI components
 */
export function useVisualization(
  config: VisualizationConfig
): VisualizationRenderProps {
  const [mode, setMode] = useState<VisualizationMode>(config.mode);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);

  // Visualization drawing functions
  const drawOrb = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      active: boolean,
      speaking: boolean
    ) => {
      const time = Date.now() * 0.005;
      const baseRadius = 40;
      const pulseRadius = speaking
        ? baseRadius + Math.sin(time * 3) * 15
        : baseRadius;

      // Gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, pulseRadius);
      gradient.addColorStop(0, active ? "#60a5fa" : "#64748b");
      gradient.addColorStop(0.7, active ? "#3b82f6" : "#475569");
      gradient.addColorStop(1, "transparent");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Rings
      if (speaking) {
        for (let i = 0; i < 3; i++) {
          ctx.strokeStyle = `rgba(59, 130, 246, ${0.3 - i * 0.1})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(
            x,
            y,
            pulseRadius + i * 20 + Math.sin(time * 2 + i) * 5,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        }
      }
    },
    []
  );

  const drawWaveform = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      active: boolean,
      speaking: boolean
    ) => {
      const centerY = height / 2;
      const time = Date.now() * 0.01;

      ctx.strokeStyle = active ? "#3b82f6" : "#64748b";
      ctx.lineWidth = 3;
      ctx.beginPath();

      for (let x = 0; x < width; x += 2) {
        const amplitude = speaking ? 30 + Math.random() * 20 : 10;
        const frequency = 0.02;
        const y = centerY + Math.sin(x * frequency + time) * amplitude;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    },
    []
  );

  const drawSpectrum = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      active: boolean,
      speaking: boolean
    ) => {
      const barCount = 32;
      const barWidth = width / barCount;

      for (let i = 0; i < barCount; i++) {
        const barHeight = speaking
          ? Math.random() * height * 0.8
          : Math.sin(Date.now() * 0.005 + i * 0.5) * height * 0.2 +
            height * 0.1;

        const hue = active ? 210 + i * 5 : 220;
        ctx.fillStyle = `hsl(${hue}, 70%, ${active ? 60 : 40}%)`;
        ctx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
      }
    },
    []
  );

  // Animation loop
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      switch (mode) {
        case "orb":
          drawOrb(
            ctx,
            canvas.width / 2,
            canvas.height / 2,
            config.isActive,
            config.isSpeaking
          );
          break;
        case "waveform":
          drawWaveform(
            ctx,
            canvas.width,
            canvas.height,
            config.isActive,
            config.isSpeaking
          );
          break;
        case "spectrum":
          drawSpectrum(
            ctx,
            canvas.width,
            canvas.height,
            config.isActive,
            config.isSpeaking
          );
          break;
      }

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [
    config.isActive,
    config.isSpeaking,
    mode,
    drawOrb,
    drawWaveform,
    drawSpectrum,
  ]);

  return {
    canvasRef,
    mode,
    setMode,
  };
}

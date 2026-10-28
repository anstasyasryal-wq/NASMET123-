/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { X, Download, Share2, Copy, Check, Sparkles, Image, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface VerseCardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseText: string;
  verseRef: string;
  reflection?: string;
  patristicQuote?: string;
  patristicSaint?: string;
  salutation?: string;
}

export const VerseCardGeneratorModal: React.FC<VerseCardGeneratorModalProps> = ({
  isOpen,
  onClose,
  verseText,
  verseRef,
  reflection,
  patristicQuote,
  patristicSaint,
  salutation,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [cardTheme, setCardTheme] = useState<'gold_dark' | 'royal_blue' | 'monastic_stone'>('gold_dark');
  const [isGenerating, setIsGenerating] = useState(true);

  const subNote = reflection || patristicQuote;

  useEffect(() => {
    if (!isOpen) return;
    renderCanvas();
  }, [isOpen, verseText, verseRef, reflection, patristicQuote, patristicSaint, salutation, cardTheme]);

  if (!isOpen) return null;

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsGenerating(true);

    const width = 1080;
    const height = 1350; // Ideal 4:5 Instagram/WhatsApp Story ratio
    canvas.width = width;
    canvas.height = height;

    // 1. Background Fill
    if (cardTheme === 'gold_dark') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0c0a09');
      grad.addColorStop(0.5, '#1c1917');
      grad.addColorStop(1, '#292524');
      ctx.fillStyle = grad;
    } else if (cardTheme === 'royal_blue') {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#09101d');
      grad.addColorStop(0.5, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
    } else {
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#14110e');
      grad.addColorStop(0.5, '#26221c');
      grad.addColorStop(1, '#1c1917');
      ctx.fillStyle = grad;
    }
    ctx.fillRect(0, 0, width, height);

    // 2. Decorative Double Outer Border
    ctx.strokeStyle = cardTheme === 'royal_blue' ? 'rgba(96, 165, 250, 0.4)' : 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 6;
    ctx.strokeRect(40, 40, width - 80, height - 80);

    ctx.strokeStyle = cardTheme === 'royal_blue' ? 'rgba(147, 197, 253, 0.25)' : 'rgba(251, 191, 36, 0.3)';
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, width - 110, height - 110);

    // Corner Ornaments
    const drawCorner = (x: number, y: number) => {
      ctx.fillStyle = cardTheme === 'royal_blue' ? '#60a5fa' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(55, 55);
    drawCorner(width - 55, 55);
    drawCorner(55, height - 55);
    drawCorner(width - 55, height - 55);

    // 3. Header: App Name & Cross
    ctx.textAlign = 'center';
    ctx.fillStyle = cardTheme === 'royal_blue' ? '#93c5fd' : '#fbbf24';
    ctx.font = 'bold 58px system-ui, -apple-system, Cairo, sans-serif';
    ctx.fillText('✝️', width / 2, 170);

    ctx.fillStyle = cardTheme === 'royal_blue' ? '#e0f2fe' : '#fef3c7';
    ctx.font = 'bold 42px system-ui, -apple-system, Cairo, sans-serif';
    ctx.fillText('حسب قلب الله', width / 2, 240);

    ctx.fillStyle = cardTheme === 'royal_blue' ? '#94a3b8' : '#d6d3d1';
    ctx.font = '26px system-ui, -apple-system, Cairo, sans-serif';
    ctx.fillText('رسالة اليوم من أبوك السماوي', width / 2, 285);

    // Horizontal Accent Line
    ctx.strokeStyle = cardTheme === 'royal_blue' ? 'rgba(96, 165, 250, 0.4)' : 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 200, 320);
    ctx.lineTo(width / 2 + 200, 320);
    ctx.stroke();

    // 4. Main Verse Text (Wrapped & Centered)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 46px system-ui, -apple-system, Amiri, Cairo, serif';
    const cleanVerse = `«${verseText.replace(/[«»]/g, '').trim()}»`;
    const verseLines = wrapText(ctx, cleanVerse, width - 220);

    let startY = 460;
    verseLines.forEach((line) => {
      ctx.fillText(line, width / 2, startY);
      startY += 75;
    });

    // 5. Scripture Reference
    startY += 20;
    ctx.fillStyle = cardTheme === 'royal_blue' ? '#60a5fa' : '#fbbf24';
    ctx.font = 'bold 34px system-ui, -apple-system, Cairo, sans-serif';
    ctx.fillText(verseRef, width / 2, startY);

    // 6. Reflection / Patristic Quote Box (If available)
    if (subNote) {
      startY += 80;
      const boxY = startY;
      const boxWidth = width - 200;
      const boxX = 100;

      ctx.font = 'italic 28px system-ui, -apple-system, Amiri, serif';
      const quoteLines = wrapText(ctx, `«${subNote.replace(/[«»]/g, '')}»`, boxWidth - 60);
      const boxHeight = quoteLines.length * 48 + 80;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 24);
      ctx.fill();
      ctx.strokeStyle = cardTheme === 'royal_blue' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(245, 158, 11, 0.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      let qY = boxY + 50;
      ctx.fillStyle = '#e2e8f0';
      quoteLines.forEach((l) => {
        ctx.fillText(l, width / 2, qY);
        qY += 48;
      });

      if (patristicSaint) {
        ctx.fillStyle = cardTheme === 'royal_blue' ? '#93c5fd' : '#f59e0b';
        ctx.font = 'bold 24px system-ui, -apple-system, Cairo, sans-serif';
        ctx.fillText(`— ${patristicSaint}`, width / 2, qY + 15);
      }
    }

    // 7. Footer: App URL & Blessing
    ctx.fillStyle = '#94a3b8';
    ctx.font = '22px system-ui, -apple-system, Cairo, sans-serif';
    ctx.fillText('منصة التكريس والعلوم الكنسية • حسب قلب الله', width / 2, height - 120);

    ctx.fillStyle = cardTheme === 'royal_blue' ? '#60a5fa' : '#fbbf24';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('ais-pre-bn5t4fumf5n6rm2ju75esy-95443394070.europe-west1.run.app', width / 2, height - 85);

    setIsGenerating(false);
  };

  function wrapText(context: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = context.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    soundManager.playTick();
    const link = document.createElement('a');
    link.download = `حسب_قلب_الله_آية_اليوم_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    soundManager.playTick();

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'verse-card.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'رسالة اليوم من أبوك السماوي',
            text: `${verseText}\n${verseRef}\nتطبيق «حسب قلب الله»`,
          });
          return;
        } catch (e: unknown) {
          if ((e as Error)?.name === 'AbortError') return;
        }
      }
      handleDownload();
    }, 'image/png');
  };

  const handleCopyText = async () => {
    soundManager.playTick();
    const fullText = `«${verseText}»\n(${verseRef})\n${patristicQuote ? `\n«${patristicQuote}» (${patristicSaint || ''})` : ''}\n\nتطبيق حسب قلب الله:\nhttps://ais-pre-bn5t4fumf5n6rm2ju75esy-95443394070.europe-west1.run.app`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-fade-in text-right"
      dir="rtl"
    >
      <div className="w-full max-w-lg rounded-3xl border border-amber-500/40 bg-stone-950 p-4 sm:p-6 text-stone-100 shadow-2xl space-y-4 max-h-[94vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Image className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                بطاقة الآية اليومية للمشاركة (Story Card)
              </h3>
              <p className="text-[11px] text-amber-400/80">
                صورة كنسية مصممة خصيصاً للمشاركة على حالات الواتساب وشبكات التواصل
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-stone-400 hover:bg-stone-800 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Picker */}
        <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-stone-900 border border-stone-800 text-xs font-bold">
          <span className="text-stone-300">طابع البطاقة:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCardTheme('gold_dark')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                cardTheme === 'gold_dark'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              ذهبي ملكي
            </button>
            <button
              onClick={() => setCardTheme('royal_blue')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                cardTheme === 'royal_blue'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              سماوي هادئ
            </button>
            <button
              onClick={() => setCardTheme('monastic_stone')}
              className={`px-2.5 py-1 rounded-xl transition cursor-pointer ${
                cardTheme === 'monastic_stone'
                  ? 'bg-stone-700 text-white shadow-xs'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              نسكي عتيق
            </button>
          </div>
        </div>

        {/* Canvas Preview Container */}
        <div className="relative rounded-2xl overflow-hidden border border-amber-600/40 bg-stone-900 shadow-xl flex items-center justify-center p-2">
          <canvas
            ref={canvasRef}
            className="w-full max-w-[360px] h-auto rounded-xl shadow-lg border border-stone-800"
            style={{ maxHeight: '48vh', objectFit: 'contain' }}
          />
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <button
            type="button"
            onClick={handleShareImage}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
          >
            <Share2 className="w-4 h-4 text-stone-950" />
            <span>مشاركة الصورة</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-200 font-bold text-xs transition cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>حفظ الصورة</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-bold text-xs transition cursor-pointer active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

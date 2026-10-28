/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Star, X, Check, Heart, Sparkles, MessageSquare, Send, Award, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';

interface AppRatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RATING_STORAGE_KEY = 'mokarasa_app_user_rating_v1';

export interface UserRatingData {
  stars: number;
  lovedFeatures: string[];
  feedbackText: string;
  submittedAt: string;
}

export const AppRatingModal: React.FC<AppRatingModalProps> = ({ isOpen, onClose }) => {
  const [stars, setStars] = useState<number>(5);
  const [hoveredStars, setHoveredStars] = useState<number | null>(null);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'صلاة المخدع والأجبية',
    'مشغل الترانيم والألحان',
  ]);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasPreviousRating, setHasPreviousRating] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(RATING_STORAGE_KEY);
        if (saved) {
          const parsed: UserRatingData = JSON.parse(saved);
          setStars(parsed.stars || 5);
          setSelectedFeatures(parsed.lovedFeatures || []);
          setFeedbackText(parsed.feedbackText || '');
          setHasPreviousRating(true);
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const featureOptions = [
    { id: 'hymns', label: 'مشغل الترانيم والألحان الكنسية' },
    { id: 'prayers', label: 'صلاة المخدع والأجبية الساعية' },
    { id: 'tree', label: 'شجرة النمو الروحي ودستور التكريس' },
    { id: 'competitions', label: 'المسابقات والمراحل الكنسية' },
    { id: 'library', label: 'المكتبة القبطية ودراسة الأسفار' },
    { id: 'daily_message', label: 'رسالة أبوك السماوي اليومية' },
  ];

  const toggleFeature = (label: string) => {
    soundManager.playTick();
    setSelectedFeatures((prev) =>
      prev.includes(label) ? prev.filter((f) => f !== label) : [...prev, label]
    );
  };

  const handleStarClick = (num: number) => {
    soundManager.playTick();
    setStars(num);
    if (num === 5) {
      soundManager.playCorrect();
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCorrect();

    const ratingData: UserRatingData = {
      stars,
      lovedFeatures: selectedFeatures,
      feedbackText: feedbackText.trim(),
      submittedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(RATING_STORAGE_KEY, JSON.stringify(ratingData));
        // Add 50 blessing points to user
        const curScore = parseInt(localStorage.getItem('mokarasa_consecration_bonus') || '0', 10);
        localStorage.setItem('mokarasa_consecration_bonus', String(curScore + 50));
      } catch {}
    }

    setIsSubmitted(true);
    try {
      confetti({ particleCount: 60, spread: 80, origin: { y: 0.5 } });
    } catch {}

    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/80 p-3 sm:p-4 backdrop-blur-sm animate-fade-in text-right"
      dir="rtl"
    >
      <div className="w-full max-w-lg rounded-3xl border-2 border-amber-500/60 bg-stone-950 p-5 sm:p-7 text-stone-100 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-800/40 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xl shadow-md">
              ⭐
            </div>
            <div>
              <h3 className="font-spiritual text-base sm:text-lg font-bold text-amber-100">
                تقييم التطبيق ودعاء البركة
              </h3>
              <p className="text-[11px] text-amber-400/80">
                رأيك أمانة روحية ومشاركتك تصنع الفارق للوصول لكل مكرس وخادم
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-stone-400 hover:bg-stone-800 hover:text-stone-100 transition cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-3 animate-fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-3xl">
              🕊️
            </div>
            <h4 className="font-spiritual text-xl font-bold text-emerald-300">
              شكراً لبركة تقييمك ومشاركتك الغالية!
            </h4>
            <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
              تم حفظ تقييمك ورأيك، وتمت إضافة ٥٠ نقطة بركة ونمو روحي لمسارك التكريسي. الرب يبارك حياتكم وخدمتكم.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Stars Selector */}
            <div className="p-4 rounded-2xl bg-stone-900/90 border border-amber-500/30 text-center space-y-2">
              <span className="text-xs font-bold text-amber-200 block">
                كم نجمة يستحق تطبيق «حسب قلب الله» في تقييمكم؟
              </span>
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((num) => {
                  const isFilled = (hoveredStars !== null ? hoveredStars : stars) >= num;
                  return (
                    <button
                      type="button"
                      key={num}
                      onMouseEnter={() => setHoveredStars(num)}
                      onMouseLeave={() => setHoveredStars(null)}
                      onClick={() => handleStarClick(num)}
                      className="p-1 transition-transform active:scale-125 hover:scale-110 cursor-pointer touch-manipulation"
                      title={`${num} نجوم`}
                    >
                      <Star
                        className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]'
                            : 'text-stone-600 hover:text-stone-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <span className="text-[11px] font-bold text-amber-300">
                {stars === 5
                  ? '⭐⭐⭐⭐⭐ استثنائي، بركة عظيمة وعمق روحي متكامل'
                  : stars === 4
                  ? '⭐⭐⭐⭐ رائع جداً ومفيد للغاية'
                  : stars === 3
                  ? '⭐⭐⭐ جيد ومبشر'
                  : 'نعمل بكل جهد لنصل لخمس نجوم'}
              </span>
            </div>

            {/* Favorite Features Multi-Select */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>ما أكثر الأقسام التي لمست قلبك واستفدت منها؟ (اختر ما ينطبق)</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {featureOptions.map((opt) => {
                  const isSelected = selectedFeatures.includes(opt.label);
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => toggleFeature(opt.label)}
                      className={`p-2.5 rounded-xl text-xs font-medium transition text-right flex items-center justify-between border cursor-pointer touch-manipulation ${
                        isSelected
                          ? 'bg-amber-950/70 border-amber-500/70 text-amber-100 shadow-xs'
                          : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{opt.label}</span>
                      {isSelected ? (
                        <Check className="w-4 h-4 text-amber-400 shrink-0 mr-1" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-stone-700 shrink-0 mr-1" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Blessing & Feedback Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                <span>كلمة بركة، أو دعاء روحي، أو اقتراح تود إضافته:</span>
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="اكتب هنا أي فكرة ترغب في رؤيتها، أو كلمة بركة للمطورين والخدام..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-400 text-stone-100 text-xs outline-none leading-relaxed resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-stone-950 font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <ThumbsUp className="w-4 h-4 text-stone-950" />
                <span>{hasPreviousRating ? 'تحديث التقييم وإرسال البركة' : 'تأكيد التقييم ٥ نجوم ⭐'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-semibold transition cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { X, Trophy, CheckCircle, Clock, Award } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in text-right">
      <div className="w-full max-w-lg p-5 sm:p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/70 shadow-2xl text-stone-100 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-amber-800/40 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400 shrink-0" />
            <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
              دليل وقواعد مسابقة «حسب قلب الله»
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 min-w-[40px] min-h-[40px] flex items-center justify-center cursor-pointer touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 text-xs sm:text-sm text-stone-300 leading-relaxed">
          <div className="p-4 rounded-2xl bg-stone-950 border border-amber-600/30 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>🎯 تنوع الأنماط والتخصصات:</span>
            </h4>
            <p>
              تشمل المسابقة 3 أنماط أساسية: الاختيار من متعدد، الصواب والخطأ، وتوصيل ومطابقة المفاهيم، موزعة على مجالات:
              العلوم الكنسية واللاهوت، علم الجينات والتصميم الخالق، والتراث والثقافة القبطية.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950 border border-amber-600/30 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>⏱️ التوقيت وحساب النقاط:</span>
            </h4>
            <p>
              لكل مرحلة مؤقت زمني محدد ودرجة نجاح دنيا لفتح المرحلة التالية. تُحسب النقاط فورياً عند كل إجابة صائبة مع شروح لاهوتية وعلمية موثقة.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-950 border border-amber-600/30 space-y-2">
            <h4 className="font-bold text-amber-300 flex items-center gap-1.5">
              <span>👑 التتويج الشرفي:</span>
            </h4>
            <p>
              إتمام المرحلة السادسة بنجاح يمنح المشارك وسام «حسب قلب الله» الشرفي وتخليد اسمه في لوحة الصدارة والتكريم الكنسي.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer min-h-[44px] touch-manipulation flex items-center justify-center"
          >
            فهمت القواعد، فلنبدأ
          </button>
        </div>
      </div>
    </div>
  );
};

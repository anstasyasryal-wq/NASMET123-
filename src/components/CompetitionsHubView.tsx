import React, { useState } from 'react';
import { Stage, Question, Announcement } from '../types';
import {
  getStoredStages,
  getStoredQuestions,
  getCurrentUser,
  getStoredAnnouncements,
} from '../utils/competitionEngine';
import { useLanguage } from '../context/LanguageContext';
import {
  Trophy,
  Play,
  Brain,
  Sparkles,
  BookOpen,
  ChevronLeft,
  CheckCircle2,
  Lock,
  Dna,
  Landmark,
  Cross,
  HelpCircle,
  Filter,
} from 'lucide-react';

interface CompetitionsHubViewProps {
  onStartStage: (stageId: number) => void;
  onBackToHome: () => void;
}

export const CompetitionsHubView: React.FC<CompetitionsHubViewProps> = ({
  onStartStage,
  onBackToHome,
}) => {
  const { language, t, dir, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<'stages' | 'question_bank'>('stages');
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'religion' | 'genetics' | 'culture'>('all');

  const stages: Stage[] = getStoredStages();
  const allQuestions: Question[] = getStoredQuestions();
  const announcements: Announcement[] = getStoredAnnouncements();
  const currentUser = getCurrentUser();
  const userCurrentStage = currentUser?.currentStageId || 1;

  const isStageUnlocked = (stageId: number) => {
    if (stageId === 1) return true;
    if (currentUser?.role === 'supervisor') return true;
    return userCurrentStage >= stageId;
  };

  const filteredQuestions = allQuestions.filter((q) => {
    if (subjectFilter === 'all') return true;
    return q.subject === subjectFilter;
  });

  return (
    <div className={`max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in ${isRTL ? 'text-right' : 'text-left'}`} dir={dir}>
      {/* Top Back Button */}
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{t('backToHome')}</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-purple-950 to-amber-950 text-white p-6 sm:p-8 shadow-xl border border-amber-300/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-2">
          <Trophy className="w-4 h-4 text-amber-300" />
          <span>{language === 'ar' ? 'نظام المسابقات المتدرجة بالأنماط المتعددة' : 'Multi-Pattern Progressive Competition System'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-spiritual text-amber-100">
          🎮 {language === 'ar' ? 'مسيرة «حَسَبَ قَلْبِ اللهِ» التنافسية' : '«According to God\'s Heart» Competition Journey'}
        </h1>
        <p className="text-xs sm:text-sm text-amber-200/90 mt-1 max-w-2xl leading-relaxed">
          {language === 'ar'
            ? 'أنماط تقييم متطورة تشمل: أسئلة الاختيار من متعدد، الصواب والخطأ، ومطابقة وتوصيل المفاهيم عبر محاور العلوم الكنسية، علم الجينات والتصميم الخالق، والثقافة والتاريخ.'
            : 'Advanced evaluation patterns: Multiple choice, true/false, and conceptual matching across Church Sciences, Genetics & Creation, and Coptic History.'}
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-4">
          <button
            onClick={() => setActiveTab('stages')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'stages'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ar' ? 'مراحل المسابقة الست' : '6 Competition Stages'}</span>
          </button>
          <button
            onClick={() => setActiveTab('question_bank')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'question_bank'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900/80 text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ar' ? `استعراض بنك الأسئلة والأنماط (${allQuestions.length})` : `Question Bank (${allQuestions.length})`}</span>
          </button>
        </div>
      </div>

      {/* Announcements */}
      {announcements.length > 0 && (
        <div className="space-y-2">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">📢</span>
                <div>
                  <strong className="text-amber-200 block">{ann.title}</strong>
                  <span className="text-stone-300">{ann.content}</span>
                </div>
              </div>
              <span className="text-[10px] text-amber-400 font-mono hidden sm:inline">{ann.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* TAB 1: STAGES LIST */}
      {activeTab === 'stages' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stages.map((stg) => {
            const unlocked = isStageUnlocked(stg.id);
            const isCompleted = currentUser?.completedStages?.includes(stg.id);
            const userScore = currentUser?.stageScores?.[stg.id];

            return (
              <div
                key={stg.id}
                className={`p-6 rounded-3xl border transition-all flex flex-col justify-between space-y-4 ${
                  unlocked
                    ? 'bg-stone-900/90 border-amber-600/40 shadow-lg'
                    : 'bg-stone-950/60 border-stone-800 opacity-60'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{stg.icon}</span>
                    <div className="flex items-center gap-2">
                      {isCompleted && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>مجتازة: {userScore} نقطة</span>
                        </span>
                      )}
                      <span className="text-xs font-mono text-amber-400 font-bold bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-700/40">
                        {stg.questionIds.length} أسئلة
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-spiritual text-lg sm:text-xl font-bold text-amber-100">
                      {stg.title}
                    </h3>
                    <p className="text-xs text-amber-300/80 font-semibold mt-0.5">
                      {stg.subtitle}
                    </p>
                    <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                      {stg.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-xs text-stone-400">
                    الحد الأدنى للنجاح: <strong className="text-amber-200">{stg.passingScore} نقطة</strong>
                  </span>

                  <button
                    onClick={() => onStartStage(stg.id)}
                    disabled={!unlocked}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
                      unlocked
                        ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white shadow-md'
                        : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                    }`}
                  >
                    {unlocked ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>{isCompleted ? 'إعادة التحدي' : 'بدء المرحلة'}</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>مغلقة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: QUESTION BANK & SUBJECT FILTERS */}
      {activeTab === 'question_bank' && (
        <div className="space-y-4">
          {/* Subject Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-stone-950 border border-stone-800">
            <span className="text-xs font-bold text-stone-400 flex items-center gap-1.5 ml-2">
              <Filter className="w-3.5 h-3.5 text-amber-400" />
              <span>تصفية حسب التخصص:</span>
            </span>
            <button
              onClick={() => setSubjectFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                subjectFilter === 'all'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              الكل ({allQuestions.length})
            </button>
            <button
              onClick={() => setSubjectFilter('religion')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                subjectFilter === 'religion'
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Cross className="w-3.5 h-3.5 text-amber-400" />
              <span>العلوم الكنسية واللاهوت</span>
            </button>
            <button
              onClick={() => setSubjectFilter('genetics')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                subjectFilter === 'genetics'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Dna className="w-3.5 h-3.5 text-emerald-400" />
              <span>علم الجينات والوراثة</span>
            </button>
            <button
              onClick={() => setSubjectFilter('culture')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                subjectFilter === 'culture'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-indigo-400" />
              <span>الثقافة والتاريخ والتراث</span>
            </button>
          </div>

          {/* Questions Grid */}
          <div className="space-y-3">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 text-right"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-amber-400">
                    سؤال #{idx + 1} • {q.type === 'multiple_choice' ? 'اختيار من متعدد' : q.type === 'true_false' ? 'صواب وخطأ' : 'توصيل ومطابقة'}
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    المرحلة {q.stageId} • {q.points} نقطة
                  </span>
                </div>

                <h4 className="font-spiritual text-base sm:text-lg font-bold text-stone-100">
                  {q.text}
                </h4>

                {q.type === 'matching' && q.matchingPairs && (
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs space-y-1">
                    <span className="font-bold text-amber-300 block mb-1">أزواج التوصيل المعتمدة:</span>
                    {q.matchingPairs.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-stone-300 py-0.5">
                        <strong className="text-white">{p.left}</strong>
                        <span>⟷ {p.right}</span>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-stone-400 leading-relaxed pt-1 border-t border-stone-800">
                  💡 {q.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

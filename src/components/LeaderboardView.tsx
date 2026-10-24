import React, { useState, useMemo, useRef, memo, useEffect } from 'react';
import { User, DioceseRanking } from '../types';
import {
  getStoredUsers,
  sortParticipantsByTieBreaker,
  getDiocesesRankings,
} from '../utils/competitionEngine';
import {
  Trophy,
  Medal,
  ChevronLeft,
  Sparkles,
  Award,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { useVirtualList } from '../hooks/useVirtualList';
import { useDataWorker } from '../hooks/useDataWorker';

interface LeaderboardViewProps {
  currentUser: User | null;
  onOpenRegister: () => void;
  onStartStage: (stageId: number) => void;
  onBackToHome?: () => void;
  initialTab?: 'general' | 'dioceses';
}

// Memoized participant rank row
const LeaderboardParticipantRow = memo<{
  user: User;
  rank: number;
  isMe: boolean;
}>(({ user, rank, isMe }) => {
  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition flex items-center justify-between text-xs ${
        isMe
          ? 'bg-amber-950/70 border-amber-400 shadow-md ring-1 ring-amber-400/50'
          : rank === 1
          ? 'bg-stone-900 border-amber-500/60 shadow-md'
          : 'bg-stone-900/80 border-stone-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl font-bold font-mono text-sm flex items-center justify-center shrink-0 ${
            rank === 1
              ? 'bg-amber-500 text-stone-950 shadow-md'
              : rank === 2
              ? 'bg-stone-300 text-stone-900'
              : rank === 3
              ? 'bg-amber-700 text-white'
              : 'bg-stone-800 text-stone-400'
          }`}
        >
          {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <strong className="text-stone-100 text-sm">{user.name}</strong>
            {isMe && (
              <span className="text-[10px] text-amber-300 font-bold bg-amber-900 px-2 py-0.5 rounded-full border border-amber-600">
                أنت
              </span>
            )}
          </div>
          <span className="text-stone-400">
            {user.vocation} • {user.diocese}
          </span>
        </div>
      </div>

      <div className="text-left font-mono">
        <span className="text-amber-400 font-black text-sm block">
          {user.totalScore} نقطة
        </span>
        <span className="text-stone-500 text-[10px]">
          المرحلة {user.currentStageId}
        </span>
      </div>
    </div>
  );
});

LeaderboardParticipantRow.displayName = 'LeaderboardParticipantRow';

// Memoized diocese rank row
const DioceseRankingRow = memo<{
  diocese: DioceseRanking;
  rank: number;
}>(({ diocese, rank }) => {
  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs">
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-stone-800 text-amber-400 font-mono font-bold flex items-center justify-center">
          #{rank}
        </span>
        <div>
          <strong className="text-stone-100 text-sm block">{diocese.diocese}</strong>
          <span className="text-stone-400">
            {diocese.participantsCount} مشارك ومكرس • متوسط النقاط: {diocese.avgScore}
          </span>
        </div>
      </div>
      <span className="text-amber-400 font-mono font-bold text-sm">
        {diocese.totalPoints} نقطة
      </span>
    </div>
  );
});

DioceseRankingRow.displayName = 'DioceseRankingRow';

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  currentUser,
  onOpenRegister,
  onStartStage,
  onBackToHome,
  initialTab,
}) => {
  const [tab, setTab] = useState<'general' | 'dioceses'>(initialTab || 'general');
  const [searchQuery, setSearchQuery] = useState('');
  const [dioceseFilter, setDioceseFilter] = useState('all');
  const allUsers = useMemo(() => getStoredUsers(), []);
  const sortedParticipants = useMemo(() => sortParticipantsByTieBreaker(allUsers), [allUsers]);
  const diocesesRankings = useMemo(() => getDiocesesRankings(), []);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(sortedParticipants);
  const { runWorkerTask } = useDataWorker();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    runWorkerTask('FILTER_LEADERBOARD', {
      users: allUsers,
      query: searchQuery,
      dioceseFilter,
      sortBy: 'score_desc',
    }).then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        setFilteredUsers(res.data);
      } else {
        // Fallback sync
        let result = [...allUsers];
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          result = result.filter(u => u.name.toLowerCase().includes(q) || u.diocese.toLowerCase().includes(q));
        }
        if (dioceseFilter !== 'all') {
          result = result.filter(u => u.diocese === dioceseFilter);
        }
        result.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
        setFilteredUsers(result);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [allUsers, searchQuery, dioceseFilter, runWorkerTask]);

  const PARTICIPANT_ROW_HEIGHT = 74;
  const {
    virtualItems,
    topSpacerHeight,
    bottomSpacerHeight,
    totalHeight,
  } = useVirtualList({
    items: filteredUsers,
    itemHeight: PARTICIPANT_ROW_HEIGHT,
    overscan: 4,
    containerRef,
    useWindowScroll: true,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      {onBackToHome && (
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
            <span>العودة للشاشة الرئيسية والعجلة</span>
          </button>
        </div>
      )}

      {/* Title Card */}
      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-600/40 shadow-xl space-y-3 text-center">
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mx-auto">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="font-spiritual text-2xl sm:text-3xl font-bold text-amber-100">
          🏆 لوحة الشرف والصدارة والتميز
        </h1>
        <p className="text-xs sm:text-sm text-stone-300 max-w-lg mx-auto">
          تصنيف فوري للمشاركين والإيبارشيات وفق درجات التقييم في محاور العلوم الكنسية والجينات والثقافة.
        </p>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-2 pt-2">
          <button
            onClick={() => setTab('general')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === 'general'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
            }`}
          >
            ترتيب الأفراد والمكرسين ({sortedParticipants.length})
          </button>
          <button
            onClick={() => setTab('dioceses')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              tab === 'dioceses'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-stone-900 text-stone-400 hover:bg-stone-800'
            }`}
          >
            ترتيب الإيبارشيات والأديرة ({diocesesRankings.length})
          </button>
        </div>
      </div>

      {/* Virtualized Participants List */}
      {tab === 'general' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3.5 top-3 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو الإيبارشية (معالجة سريعة عبر Web Worker)..."
                className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-amber-400 outline-none shadow-inner"
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={dioceseFilter}
                onChange={(e) => setDioceseFilter(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-200 text-xs focus:border-amber-400 outline-none"
              >
                <option value="all">كل الإيبارشيات والأديرة</option>
                {diocesesRankings.map((d) => (
                  <option key={d.diocese} value={d.diocese}>
                    {d.diocese}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div ref={containerRef} className="space-y-3 relative min-h-[100px]">
            <div style={{ minHeight: totalHeight }}>
              {topSpacerHeight > 0 && (
                <div style={{ height: topSpacerHeight }} aria-hidden="true" />
              )}

              <div className="space-y-3">
                {virtualItems.map(({ item: user, index: idx }) => (
                  <LeaderboardParticipantRow
                    key={user.id}
                    user={user}
                    rank={idx + 1}
                    isMe={currentUser?.id === user.id}
                  />
                ))}
              </div>

              {bottomSpacerHeight > 0 && (
                <div style={{ height: bottomSpacerHeight }} aria-hidden="true" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Dioceses Ranking */}
      {tab === 'dioceses' && (
        <div className="space-y-3">
          {diocesesRankings.map((d, idx) => (
            <DioceseRankingRow key={d.diocese} diocese={d} rank={idx + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

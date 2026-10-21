import React, { useState, useMemo, useRef, useEffect, memo } from 'react';
import { User } from '../types';
import { getStoredUsers } from '../utils/competitionEngine';
import { Users, ChevronLeft, Search, Trophy, User as UserIcon, Filter } from 'lucide-react';
import { useVirtualGrid } from '../hooks/useVirtualList';

interface ParticipantsListViewProps {
  onOpenRegister: () => void;
  onStartStage: (stageId: number) => void;
  onBackToHome: () => void;
}

// Memoized participant item to avoid re-rendering cards during scroll or filter input
const ParticipantCard = memo<{ user: User }>(({ user }) => {
  return (
    <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs transition hover:border-amber-600/40 shadow-xs h-full">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold text-base shrink-0">
          👤
        </div>
        <div className="truncate">
          <strong className="text-stone-100 block text-sm truncate">{user.name}</strong>
          <span className="text-stone-400 truncate block">
            {user.vocation} • {user.diocese}
          </span>
        </div>
      </div>
      <div className="text-left font-mono shrink-0 pr-2">
        <span className="text-amber-400 font-bold block">{user.totalScore} نقطة</span>
        <span className="text-stone-500 text-[10px]">المرحلة {user.currentStageId}</span>
      </div>
    </div>
  );
});

ParticipantCard.displayName = 'ParticipantCard';

export const ParticipantsListView: React.FC<ParticipantsListViewProps> = ({
  onOpenRegister,
  onStartStage,
  onBackToHome,
}) => {
  const users = useMemo(() => getStoredUsers(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVocation, setFilterVocation] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive column detection (1 column on mobile, 2 columns on tablet/desktop)
  const [columns, setColumns] = useState<number>(() => {
    return typeof window !== 'undefined' && window.innerWidth >= 640 ? 2 : 1;
  });

  useEffect(() => {
    const handleResize = () => {
      setColumns(window.innerWidth >= 640 ? 2 : 1);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtered users list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.diocese.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesVocation =
        filterVocation === 'all' || u.vocation === filterVocation;
      return matchesSearch && matchesVocation;
    });
  }, [users, searchTerm, filterVocation]);

  // Virtualized rows (each card row is approx 76px + 12px gap = 88px)
  const ROW_HEIGHT = 88;
  const {
    virtualRows,
    topSpacerHeight,
    bottomSpacerHeight,
    totalHeight,
  } = useVirtualGrid({
    items: filteredUsers,
    columns,
    rowHeight: ROW_HEIGHT,
    overscan: 4,
    containerRef,
    useWindowScroll: true,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in text-right">
      <div className="flex items-center justify-between pb-1">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition cursor-pointer shadow-xs border border-amber-300"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
          <span>العودة للشاشة الرئيسية والعجلة</span>
        </button>
      </div>

      <div className="rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-stone-100 p-6 sm:p-8 border border-amber-600/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/40 text-amber-300 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>سجل المشاركين والمكرسين</span>
          </div>
          <h1 className="font-spiritual text-2xl font-bold text-amber-100">
            قائمة المشاركين المسجلين في المسابقة
          </h1>
          <p className="text-xs text-stone-300 mt-1">
            إجمالي المشاركين النشطين في المراحل التنافسية ({users.length} مكرس/ة) • معالجة خفيفة عبر القائمة الافتراضية
          </p>
        </div>

        <button
          onClick={onOpenRegister}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition cursor-pointer shrink-0"
        >
          تسجيل مشارك جديد
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث باسم المشارك أو الإيبارشية..."
            className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-900 border border-stone-800 focus:border-amber-500 text-stone-100 text-xs outline-none"
          />
          <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'كاهن', label: 'كهنة' },
            { id: 'راهب', label: 'رهبان' },
            { id: 'مكرَّسة', label: 'مكرسات' },
            { id: 'شماس', label: 'شمامسة' },
          ].map((voc) => (
            <button
              key={voc.id}
              onClick={() => setFilterVocation(voc.id)}
              className={`px-3 py-2 rounded-xl font-bold transition whitespace-nowrap cursor-pointer text-xs ${
                filterVocation === voc.id
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
              }`}
            >
              {voc.label}
            </button>
          ))}
        </div>
      </div>

      {/* Virtualized Container */}
      <div ref={containerRef} className="relative min-h-[100px]">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 bg-stone-900/50 rounded-2xl border border-stone-800 text-stone-400 text-xs">
            لا يوجد مشاركون يطابقون خيارات البحث.
          </div>
        ) : (
          <div style={{ minHeight: totalHeight }}>
            {/* Top spacer for virtual window */}
            {topSpacerHeight > 0 && (
              <div style={{ height: topSpacerHeight }} aria-hidden="true" />
            )}

            {/* Virtualized visible rows */}
            <div className="space-y-3">
              {virtualRows.map((virtualRow) => (
                <div
                  key={virtualRow.index}
                  className={`grid gap-3 ${
                    columns === 2 ? 'grid-cols-2' : 'grid-cols-1'
                  }`}
                  style={{ minHeight: ROW_HEIGHT - 12 }}
                >
                  {virtualRow.item.map((user) => (
                    <ParticipantCard key={user.id} user={user} />
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom spacer for virtual window */}
            {bottomSpacerHeight > 0 && (
              <div style={{ height: bottomSpacerHeight }} aria-hidden="true" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

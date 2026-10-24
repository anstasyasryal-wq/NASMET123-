/**
 * Web Worker for heavy data filtering, sorting, and reporting (Competitions & Library)
 */

self.onmessage = function (e: MessageEvent) {
  const { type, payload, requestId } = e.data;

  try {
    switch (type) {
      case 'FILTER_LEADERBOARD': {
        const { users, query, dioceseFilter, sortBy } = payload;
        let result = [...users];

        if (query && query.trim() !== '') {
          const q = query.trim().toLowerCase();
          result = result.filter(
            (u: any) =>
              u.name.toLowerCase().includes(q) ||
              u.diocese.toLowerCase().includes(q) ||
              (u.vocation && u.vocation.toLowerCase().includes(q))
          );
        }

        if (dioceseFilter && dioceseFilter !== 'all') {
          result = result.filter((u: any) => u.diocese === dioceseFilter);
        }

        if (sortBy === 'score_desc') {
          result.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
        } else if (sortBy === 'score_asc') {
          result.sort((a, b) => (a.totalScore || 0) - (b.totalScore || 0));
        } else if (sortBy === 'name') {
          result.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        }

        self.postMessage({ requestId, success: true, data: result });
        break;
      }

      case 'FILTER_LIBRARY': {
        const { items, searchQuery, category } = payload;
        let result = [...items];

        if (searchQuery && searchQuery.trim() !== '') {
          const q = searchQuery.trim().toLowerCase();
          result = result.filter(
            (item: any) =>
              item.title.toLowerCase().includes(q) ||
              (item.author && item.author.toLowerCase().includes(q)) ||
              (item.description && item.description.toLowerCase().includes(q))
          );
        }

        if (category && category !== 'all') {
          result = result.filter((item: any) => item.category === category);
        }

        self.postMessage({ requestId, success: true, data: result });
        break;
      }

      default:
        self.postMessage({ requestId, success: false, error: 'Unknown worker action type' });
    }
  } catch (err: any) {
    self.postMessage({ requestId, success: false, error: err?.message || 'Worker processing error' });
  }
};

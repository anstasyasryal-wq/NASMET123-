import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

export interface UseVirtualListOptions<T> {
  items: T[];
  itemHeight: number; // estimated or fixed height in pixels
  overscan?: number; // extra items above and below to prevent flicker
  containerRef?: React.RefObject<HTMLElement | null>;
  useWindowScroll?: boolean;
}

export interface VirtualListResult<T> {
  virtualItems: { item: T; index: number }[];
  startIndex: number;
  endIndex: number;
  totalHeight: number;
  topSpacerHeight: number;
  bottomSpacerHeight: number;
}

/**
 * High-performance virtual list hook for zero-lag mobile rendering.
 * Renders only visible items + buffer overscan to keep DOM nodes minimal and memory low.
 */
export function useVirtualList<T>({
  items,
  itemHeight,
  overscan = 4,
  containerRef,
  useWindowScroll = true,
}: UseVirtualListOptions<T>): VirtualListResult<T> {
  const totalCount = items.length;
  const [scrollTop, setScrollTop] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800
  );
  const [containerOffsetTop, setContainerOffsetTop] = useState(0);

  const rafId = useRef<number | null>(null);

  // Measure container and scroll
  const updateScroll = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      if (useWindowScroll) {
        const currentScrollY = window.scrollY || window.pageYOffset || 0;
        setScrollTop(currentScrollY);
        setViewportHeight(window.innerHeight);

        if (containerRef?.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const top = rect.top + currentScrollY;
          setContainerOffsetTop(top);
        }
      } else if (containerRef?.current) {
        setScrollTop(containerRef.current.scrollTop);
        setViewportHeight(containerRef.current.clientHeight);
      }
    });
  }, [useWindowScroll, containerRef]);

  useEffect(() => {
    updateScroll();

    if (useWindowScroll) {
      window.addEventListener('scroll', updateScroll, { passive: true });
      window.addEventListener('resize', updateScroll, { passive: true });
      return () => {
        window.removeEventListener('scroll', updateScroll);
        window.removeEventListener('resize', updateScroll);
        if (rafId.current) cancelAnimationFrame(rafId.current);
      };
    } else if (containerRef?.current) {
      const el = containerRef.current;
      el.addEventListener('scroll', updateScroll, { passive: true });
      window.addEventListener('resize', updateScroll, { passive: true });
      return () => {
        el.removeEventListener('scroll', updateScroll);
        window.removeEventListener('resize', updateScroll);
        if (rafId.current) cancelAnimationFrame(rafId.current);
      };
    }
  }, [updateScroll, useWindowScroll, containerRef]);

  // Calculate slice
  const result = useMemo(() => {
    if (totalCount === 0) {
      return {
        virtualItems: [],
        startIndex: 0,
        endIndex: 0,
        totalHeight: 0,
        topSpacerHeight: 0,
        bottomSpacerHeight: 0,
      };
    }

    const totalHeight = totalCount * itemHeight;

    // Relative scroll offset inside the virtual list container
    const relativeScroll = useWindowScroll
      ? Math.max(0, scrollTop - containerOffsetTop)
      : scrollTop;

    const rawStartIndex = Math.floor(relativeScroll / itemHeight);
    const startIndex = Math.max(0, rawStartIndex - overscan);

    const visibleCount = Math.ceil(viewportHeight / itemHeight) + 2 * overscan;
    const endIndex = Math.min(totalCount, startIndex + visibleCount);

    const virtualItems: { item: T; index: number }[] = [];
    for (let i = startIndex; i < endIndex; i++) {
      virtualItems.push({ item: items[i], index: i });
    }

    const topSpacerHeight = startIndex * itemHeight;
    const bottomSpacerHeight = Math.max(0, (totalCount - endIndex) * itemHeight);

    return {
      virtualItems,
      startIndex,
      endIndex,
      totalHeight,
      topSpacerHeight,
      bottomSpacerHeight,
    };
  }, [items, totalCount, itemHeight, overscan, scrollTop, viewportHeight, containerOffsetTop, useWindowScroll]);

  return result;
}

/**
 * Grid-aware virtual list hook for multi-column layouts (responsive grids).
 * Automatically chunks items into rows and virtualizes rows.
 */
export function useVirtualGrid<T>({
  items,
  columns,
  rowHeight,
  overscan = 3,
  containerRef,
  useWindowScroll = true,
}: {
  items: T[];
  columns: number;
  rowHeight: number;
  overscan?: number;
  containerRef?: React.RefObject<HTMLElement | null>;
  useWindowScroll?: boolean;
}) {
  const safeColumns = Math.max(1, columns);

  // Group items into rows
  const rows = useMemo(() => {
    const chunked: T[][] = [];
    for (let i = 0; i < items.length; i += safeColumns) {
      chunked.push(items.slice(i, i + safeColumns));
    }
    return chunked;
  }, [items, safeColumns]);

  const virtualList = useVirtualList({
    items: rows,
    itemHeight: rowHeight,
    overscan,
    containerRef,
    useWindowScroll,
  });

  return {
    ...virtualList,
    virtualRows: virtualList.virtualItems,
  };
}

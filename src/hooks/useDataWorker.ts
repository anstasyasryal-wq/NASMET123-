import { useState, useEffect, useRef, useCallback } from 'react';

export function useDataWorker() {
  const workerRef = useRef<Worker | null>(null);
  const callbacksRef = useRef<Map<string, (result: any) => void>>(new Map());

  useEffect(() => {
    try {
      workerRef.current = new Worker(
        new URL('../workers/dataWorker.ts', import.meta.url),
        { type: 'module' }
      );

      workerRef.current.onmessage = (e: MessageEvent) => {
        const { requestId, success, data, error } = e.data;
        const cb = callbacksRef.current.get(requestId);
        if (cb) {
          callbacksRef.current.delete(requestId);
          cb({ success, data, error });
        }
      };

      workerRef.current.onerror = () => {
        // Fallback gracefully if worker fails to load
        workerRef.current = null;
      };
    } catch {
      workerRef.current = null;
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const runWorkerTask = useCallback((type: string, payload: any): Promise<any> => {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        // Synchronous fallback if worker is not available
        resolve({ success: false, error: 'Worker unavailable, execute sync fallback' });
        return;
      }

      const requestId = Math.random().toString(36).substring(2, 9);
      callbacksRef.current.set(requestId, resolve);
      workerRef.current.postMessage({ type, payload, requestId });

      // Timeout safety (2.5s)
      setTimeout(() => {
        if (callbacksRef.current.has(requestId)) {
          callbacksRef.current.delete(requestId);
          resolve({ success: false, error: 'Worker timeout' });
        }
      }, 2500);
    });
  }, []);

  return { runWorkerTask, hasWorker: workerRef.current !== null };
}

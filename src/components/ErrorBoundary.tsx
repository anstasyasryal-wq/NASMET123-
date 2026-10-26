/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen bg-[#0c0a09] text-amber-100 flex flex-col items-center justify-center p-6 text-center font-sans"
          dir="rtl"
        >
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-500/40 flex items-center justify-center text-3xl shadow-xl mb-4">
            ✝️
          </div>
          <h2 className="font-spiritual text-xl font-bold text-amber-200 mb-2">
            سلام ونعمة — تنبيه استعادة الشاشة
          </h2>
          <p className="text-xs text-stone-300 max-w-md leading-relaxed mb-6">
            حدث تنبيه بسيط في عرض الصفحة. يمكنك إعادة التحميل بالبركة للاستمرار بسلام.
          </p>
          <button
            onClick={this.handleReload}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 text-white font-bold text-xs shadow-lg transition cursor-pointer"
          >
            إعادة تحميل التطبيق بالبركة 🔄
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

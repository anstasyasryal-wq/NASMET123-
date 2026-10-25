import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, Home, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('mokarasa_current_view');
        sessionStorage.removeItem('mokarasa_active_stage_id');
      }
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  private handleClearStorageAndReload = () => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
        localStorage.removeItem('mokarasa_current_view');
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          dir="rtl"
          className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4 selection:bg-amber-500 selection:text-stone-950 font-sans"
        >
          <div className="max-w-lg w-full bg-stone-950 border border-amber-600/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-center text-3xl shadow-lg">
              ✝️
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black text-amber-300 font-spiritual">
                تطبيق «حسب قلب الله»
              </h1>
              <p className="text-sm font-semibold text-stone-300">
                بركة النعمة والسلام معكم
              </p>
              <p className="text-xs text-stone-400 leading-relaxed max-w-md mx-auto">
                حدث أمر غير متوقع أثناء تحميل هذه الشاشة. بياناتك المحفوظة وتقدمك في أمان تام، ويمكنك استئناف التصفح مباشرة.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs sm:text-sm font-bold transition shadow-md cursor-pointer"
              >
                <Home className="w-4 h-4" />
                العودة إلى الشاشة الرئيسية
              </button>

              <button
                type="button"
                onClick={this.handleClearStorageAndReload}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-semibold transition border border-stone-700 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                إعادة المحاولة والتحديث
              </button>
            </div>

            {this.state.error && (
              <details className="text-left bg-stone-900/80 p-3 rounded-xl border border-stone-800 text-[11px] text-stone-400 font-mono mt-4 overflow-x-auto">
                <summary className="cursor-pointer text-amber-400/80 hover:text-amber-300 font-sans font-bold text-xs select-none">
                  تفاصيل الخطأ التقني (للتصحيح)
                </summary>
                <div className="mt-2 text-rose-300 whitespace-pre-wrap break-all">
                  {this.state.error.toString()}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

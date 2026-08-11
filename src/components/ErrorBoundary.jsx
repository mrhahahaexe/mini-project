import React, { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Top-level error boundary. Catches render-time crashes anywhere in the tree
 * and shows a recoverable message instead of white-screening the whole app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong.' };
  }

  componentDidCatch(error, info) {
    // Keep the error visible for debugging without crashing the UI
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 px-4">
          <div className="text-center p-12 bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900/40 rounded-3xl space-y-4 max-w-md mx-auto shadow-sm">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-500 rounded-full w-fit mx-auto">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h1 className="font-display font-bold text-xl text-slate-800 dark:text-slate-100">
              Something went wrong
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {this.state.message}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

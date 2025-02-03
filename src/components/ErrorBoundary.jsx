import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
                <p className="text-gray-600 text-sm mb-4">
                  We're sorry, but something went wrong. Please try refreshing the page or going back to the home page.
                </p>
                <div className="space-x-3">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary)]/90 transition-colors"
                  >
                    Refresh Page
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Go Home
                  </button>
                </div>
                {process.env.NODE_ENV === 'development' && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg overflow-auto max-h-48">
                    <pre className="text-xs text-red-600 whitespace-pre-wrap">
                      {this.state.error?.toString()}
                      {'\n'}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

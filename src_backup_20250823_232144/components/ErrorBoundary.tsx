// ENHANCED ERROR BOUNDARY - Production-grade error handling
// TD Studios ecosystem - comprehensive error catching and reporting

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  level?: 'page' | 'component' | 'critical';
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  showDetails?: boolean;
  autoRecover?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  isRecovering: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  private retryTimer?: NodeJS.Timeout;
  private maxRetries = 3;
  
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      isRecovering: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { onError, level = 'component' } = this.props;
    
    // Enhanced error logging
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      level,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId,
      retryCount: this.state.retryCount
    };

    // Log to console with detailed information
    console.group(`🚨 ${level.toUpperCase()} ERROR CAUGHT`);
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Full Report:', errorReport);
    console.groupEnd();

    // Call custom error handler
    if (onError) {
      onError(error, errorInfo);
    }

    // Report to external service in production
    this.reportError(errorReport);

    // Set error info in state
    this.setState({ errorInfo });

    // Auto-recovery for non-critical errors
    if (this.props.autoRecover && level !== 'critical' && this.state.retryCount < this.maxRetries) {
      this.scheduleRecovery();
    }
  }

  private reportError = async (errorReport: any) => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    try {
      // Report to your error tracking service (Sentry, LogRocket, etc.)
      // await fetch('/api/errors/report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport)
      // });
      
      console.log('Error report would be sent in production:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private scheduleRecovery = () => {
    this.setState({ isRecovering: true });
    
    this.retryTimer = setTimeout(() => {
      this.handleRetry();
    }, Math.pow(2, this.state.retryCount) * 1000); // Exponential backoff
  };

  private handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
      isRecovering: false
    }));

    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  };

  private handleManualRetry = () => {
    if (this.state.retryCount >= this.maxRetries) {
      // Reset retry count for manual attempts
      this.setState({ retryCount: 0 });
    }
    this.handleRetry();
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportBug = () => {
    const subject = encodeURIComponent(`Bug Report - ${this.state.errorId}`);
    const body = encodeURIComponent(`
Error ID: ${this.state.errorId}
Error Message: ${this.state.error?.message}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}

Stack Trace:
${this.state.error?.stack}

Component Stack:
${this.state.errorInfo?.componentStack}
    `);
    
    const mailtoUrl = `mailto:support@tdstudios.com?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
  };

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  render() {
    const { hasError, error, errorInfo, errorId, retryCount, isRecovering } = this.state;
    const { children, fallback, level = 'component', showDetails = false } = this.props;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Different error UIs based on level
      const isCritical = level === 'critical';
      const isPage = level === 'page';

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className={`max-w-lg w-full ${isCritical ? 'border-red-500 bg-red-50 dark:bg-red-950' : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isCritical ? (
                  <Shield className="h-5 w-5 text-red-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                {isCritical ? 'Critical Error' : isPage ? 'Page Error' : 'Component Error'}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert variant={isCritical ? 'destructive' : 'default'}>
                <AlertDescription>
                  {isCritical 
                    ? 'A critical error has occurred that prevents the application from functioning properly.'
                    : isPage
                    ? 'This page encountered an error and cannot be displayed.'
                    : 'A component on this page encountered an error.'
                  }
                </AlertDescription>
              </Alert>

              {showDetails && (
                <div className="space-y-2">
                  <details className="text-sm">
                    <summary className="cursor-pointer font-medium">Error Details</summary>
                    <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">
                      <div><strong>Error ID:</strong> {errorId}</div>
                      <div><strong>Message:</strong> {error.message}</div>
                      {error.stack && (
                        <div className="mt-2">
                          <strong>Stack:</strong>
                          <pre className="mt-1 whitespace-pre-wrap">{error.stack}</pre>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              {isRecovering && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Attempting to recover...
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {!isRecovering && retryCount < this.maxRetries && (
                  <Button 
                    onClick={this.handleManualRetry} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try Again ({this.maxRetries - retryCount} left)
                  </Button>
                )}

                {isPage && (
                  <Button 
                    onClick={this.handleGoHome} 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Go Home
                  </Button>
                )}

                <Button 
                  onClick={this.handleReload} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>

                <Button 
                  onClick={this.handleReportBug} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Bug className="h-4 w-4" />
                  Report Bug
                </Button>
              </div>

              <div className="text-xs text-gray-500">
                Error ID: {errorId} | Attempts: {retryCount}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}

// HOC for easier wrapping
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) => {
  return (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
};

// Hook for error reporting from function components
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: string) => {
    const errorReport = {
      message: error.message,
      stack: error.stack,
      context: errorInfo,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    console.error('🚨 Manual Error Report:', errorReport);
    
    // You can also trigger the error boundary
    throw error;
  };
};

// Specialized error boundaries for different contexts
export const AIErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary
    level="component"
    autoRecover={true}
    showDetails={process.env.NODE_ENV === 'development'}
    fallback={
      <Card className="p-4 border-amber-200 bg-amber-50 dark:bg-amber-950">
        <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
          <AlertTriangle className="h-5 w-5" />
          <span>AI service temporarily unavailable. Please try again.</span>
        </div>
      </Card>
    }
  >
    {children}
  </ErrorBoundary>
);

export const PaymentErrorBoundary = ({ children }: { children: ReactNode }) => (
  <ErrorBoundary
    level="critical"
    autoRecover={false}
    showDetails={false}
    fallback={
      <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-950">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
            <Shield className="h-5 w-5" />
            <span className="font-semibold">Payment Processing Error</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400">
            Payment processing is temporarily unavailable. Please try again or contact support.
          </p>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Payment
          </Button>
        </div>
      </Card>
    }
  >
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;
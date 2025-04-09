
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback: (error: { message: string; code?: string }) => ReactNode;
}

interface State {
  hasError: boolean;
  error: { message: string; code?: string } | null;
}

class GeoErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { 
      hasError: true, 
      error: { 
        message: error.message,
        code: error.name
      } 
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error information for debugging
    console.error('Map component error:', error);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback(this.state.error || { message: 'Une erreur est survenue' });
    }

    return this.props.children;
  }
}

export default GeoErrorBoundary;

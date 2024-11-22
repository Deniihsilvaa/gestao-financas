import React, { Component, ErrorInfo } from 'react';

// Componente ErrorBoundary que captura erros
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log("Erro capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Algo deu errado. Por favor, tente novamente mais tarde.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/* Styles */
import './styles/error-boundary.scss';

/* Packages */
/* Note: mostly code from react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary */
import { Component, ErrorInfo } from 'react';

/* Scripts */
import { ErrorBoundaryProps, ErrorBoundaryStateProps } from './scripts/error-boundary-types';

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryStateProps> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		// The function parameter "error" can be returned in function
		return { hasError: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		if (import.meta.env.DEV) {
			console.error('ErrorBoundary caught an error', error, info);
		}
	}

	render() {
		if (this.state.hasError) {
			return <div className="error-boundary spacing-reset">{this.props.message}</div>;
		}

		return this.props.children;
	}
}

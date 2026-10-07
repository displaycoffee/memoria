/* Packages */
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

/* Scripts */
import type { ErrorBoundaryProps } from './scripts/error-boundary-types';

/* Components */
import { Alert } from '@/components/alert/Alert';

export const ErrorBoundary = (props: ErrorBoundaryProps) => {
	const { children, message } = props;

	return (
		<ReactErrorBoundary
			fallback={<Alert type={'error'}>{message}</Alert>}
			onError={(error, info) => {
				if (import.meta.env.DEV) console.error('ErrorBoundary caught an error', error, info);
			}}
		>
			{children}
		</ReactErrorBoundary>
	);
};

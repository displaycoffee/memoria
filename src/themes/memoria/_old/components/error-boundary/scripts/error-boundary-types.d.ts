/* Type definitions */
type ErrorBoundary = {
	children: ReactNode;
	message: ReactNode;
};

type ErrorBoundaryState = {
	hasError: boolean;
};

/* Export prop types */
export type ErrorBoundaryProps = ErrorBoundary;

export type ErrorBoundaryStateProps = ErrorBoundaryState;

/* Type definitions */
type ContextValues = {
	theme: {
		[key: string]: ObjectPrimitiveType;
	};
	utils: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		[key: string]: (...args: any[]) => any;
	};
	variables: {
		[key: string]: ObjectPrimitiveType;
	};
};

type Context = {
	children: ReactNode;
};

/* Export types */
export type ContextValuesType = ContextValues;

/* Export prop types */
export type ContextProps = Context;

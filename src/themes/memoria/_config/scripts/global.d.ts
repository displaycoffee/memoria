/* Type definitions */
type Events = SyntheticEvent | Event;

type ObjectString = {
	[key: string]: string;
};

type ObjectPrimitive = {
	[key: string]: string | number | boolean;
};

/* WordPress type definitions */
type WP = {
	media(options: { title: string; button: { text: string }; multiple: boolean }): WPMediaFrame;
};

type WPMediaFrame = {
	open(): void;
	on(event: string, callback: () => void): void;
	state(): { get(key: string): { first(): { toJSON(): WPMediaAttachment } } };
};

type WPMediaAttachment = WPMediaFrame & {
	id: number;
	url: string;
	[key: string]: unknown;
	wp: WP;
};

declare global {
	/* Declare global types */
	type EventsType = Events;

	type ObjectStringType = ObjectString;

	type ObjectPrimitiveType = ObjectPrimitive;

	/* Declare global prop types */
	type ObjectPrimitiveProps = ObjectPrimitive;

	/* Declare global WordPress types */
	type WPMediaFrameType = WPMediaFrame;

	const wp: WP;
}

/* Export global types */
export {};

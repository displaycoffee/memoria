/* Packages */
import type { WaveformPlayer, WaveformStyle } from '@arraypress/waveform-player/no-autoinit';

/* Type definitions */
type PlaylistContext = {
	playlistId?: string;
	tracks?: string[];
	waveformStyle?: WaveformStyle;
	showPlayButtonArtwork?: boolean;
	labelPauseTrack?: string;
	labelSelectTrack?: string;
};

type PlaylistTrack = {
	button: HTMLButtonElement;
	url: string;
	title: string;
	artist: string;
	image: string;
	imageAlt: string;
};

type PlaylistState = {
	context: PlaylistContext;
	tracks: PlaylistTrack[];
	current: number;
	isPlaying: boolean;
	player?: WaveformPlayer;
	container?: HTMLElement;
	hasArtwork?: boolean;
	destroy?: () => void;
};

/* Export types */
export type PlaylistContextType = PlaylistContext;
export type PlaylistStateType = PlaylistState;
export type PlaylistTrackType = PlaylistTrack;

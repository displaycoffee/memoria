/* Packages */
import { WaveformPlayer } from '@arraypress/waveform-player/no-autoinit';

/* Scripts */
import type { PlaylistContextType, PlaylistStateType, PlaylistTrackType } from './playlist-types';

/* Selectors for WordPress playlist blocks, e.g. <figure class="wp-block-playlist" data-wp-context='{ "tracks": ["track-0"], "waveformStyle": "bars" }'><div class="wp-block-playlist__waveform-player" data-label-play="Play" /><ol class="wp-block-playlist__tracklist"><li><button class="wp-block-playlist-track__button" data-src="track.mp3" /></li></ol></figure>
   Note: WordPress builds the player with its Interactivity API script (playlist/view.js, which bundles waveform-player), which never reaches Astro, so this replaces it using the same markup
   Note: the track URLs (data-src) and images (data-image) come from memoria-headless (admin/content/content.php), since WordPress only puts them in its Interactivity API state */
const selectors = {
	playlist: '.wp-block-playlist',
	player: ':scope > .wp-block-playlist__waveform-player',
	track: '.wp-block-playlist-track__button',
	trackChild: ':scope > .wp-block-playlist__tracklist .wp-block-playlist-track__button',
	trackTitle: '.wp-block-playlist-track__title',
	trackArtist: '.wp-block-playlist-track__artist',
	trackImage: '.wp-block-playlist-track__image',
	trackLabel: '[data-wp-text="state.trackButtonActionLabel"]',
	waveformContainer: '.waveform-container',
	waveformButton: '.waveform-btn',
};

/* Same defaults as WordPress (waveform-utils) */
const defaults = {
	height: 100,
	labels: { play: 'Play', pause: 'Pause', seek: 'Seek' },
	waveformStyle: 'bars' as const,
};

/* Playlists set up on the current page, so they can be destroyed (and their audio stopped) before the next page swaps in */
const states = new Map<Element, PlaylistStateType>();

/* Color helpers, replacing the colord library WordPress bundles */
const colors = {
	toRgb: (element: Element, value: string | undefined) => {
		// Resolve any CSS color (including var() and keywords) to [r, g, b, a] through the browser
		if (!value || !CSS.supports('color', value)) return undefined;

		const resolver = document.createElement('span');
		resolver.style.color = value;
		element.appendChild(resolver);
		const computed = getComputedStyle(resolver).color;
		resolver.remove();

		// Computed colors come back as rgb() / rgba() (0-255 channels), or color(srgb r g b / a) (0-1 channels) for color-mix() and similar
		// Note: other color spaces (e.g. oklab()) aren't converted, so they fall back to the caller's default
		const isSrgb = computed.startsWith('color(srgb ');
		if (!isSrgb && !computed.startsWith('rgb')) return undefined;

		const channels = computed.replace('color(srgb ', '').match(/[\d.]+/g)?.map(Number);
		if (!channels || channels.length < 3) return undefined;

		const scale = isSrgb ? 255 : 1;
		return [channels[0] * scale, channels[1] * scale, channels[2] * scale, channels[3] ?? 1] as const;
	},
	withAlpha: (element: Element, value: string, alpha: number) => {
		const rgb = colors.toRgb(element, value);
		return rgb ? `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${rgb[3] * alpha})` : value;
	},
	isDark: (element: Element, value: string) => {
		// Same brightness formula as colord's isDark()
		const rgb = colors.toRgb(element, value);
		if (!rgb) return true;
		return (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000 / 255 < 0.5;
	},
	gradientParts: (gradient: string | undefined) => {
		// Split a gradient's arguments on top-level commas, e.g. "90deg, red 0%, rgb(0, 0, 255) 100%" -> ["90deg", "red 0%", "rgb(0, 0, 255) 100%"]
		const match = gradient?.trim().match(/^[\w-]+-gradient\((.*)\)$/i);
		if (!match) return [];

		const parts: string[] = [];
		let depth = 0;
		let part = '';
		for (const character of match[1]) {
			if (character === '(') depth++;
			if (character === ')') depth--;
			if (character === ',' && depth === 0) {
				parts.push(part.trim());
				part = '';
				continue;
			}
			part += character;
		}
		if (part.trim()) parts.push(part.trim());

		return parts;
	},
	gradientStops: (element: Element, gradient: string | undefined) => {
		// Get a gradient's color stops as resolved colors, or nothing if there are fewer than two
		const stops = colors
			.gradientParts(gradient)
			.map((part) => {
				const fn = part.match(/^[\w-]+\((?:[^()]|\([^()]*\))*\)/)?.[0];
				return fn ?? part.split(/\s+/)[0];
			})
			.filter((stop) => CSS.supports('color', stop))
			.map((stop) => {
				const rgb = colors.toRgb(element, stop);
				return rgb ? `rgba(${Math.round(rgb[0])}, ${Math.round(rgb[1])}, ${Math.round(rgb[2])}, ${rgb[3]})` : stop;
			});
		return stops.length > 1 ? stops : undefined;
	},
	gradientDirection: (gradient: string | undefined) => {
		// Map a gradient's angle or "to <side>" to the axis waveform-player draws gradients along
		const direction = colors.gradientParts(gradient)[0]?.toLowerCase();
		const angle = direction?.match(/^(-?\d+(?:\.\d+)?)deg$/)?.[1];
		if (angle) {
			const degrees = ((Number(angle) % 360) + 360) % 360;
			if (degrees === 90 || degrees === 270) return 'horizontal';
			if (degrees === 0 || degrees === 180) return 'vertical';
			return 'diagonal';
		}
		if (!direction?.startsWith('to ')) return undefined;

		const horizontal = /left|right/.test(direction);
		const vertical = /top|bottom/.test(direction);
		if (horizontal && vertical) return 'diagonal';
		if (horizontal) return 'horizontal';
		if (vertical) return 'vertical';
		return undefined;
	},
};

export const playlist = {
	context: (figure: Element): PlaylistContextType => {
		// Read the context WordPress prints on the figure
		try {
			return JSON.parse(figure.getAttribute('data-wp-context') ?? '{}') as PlaylistContextType;
		} catch {
			return {};
		}
	},
	tracks: (figure: Element): PlaylistTrackType[] => {
		// Read each track from its button (title / artist from the markup, URL / image from memoria-headless)
		return Array.from(figure.querySelectorAll<HTMLButtonElement>(selectors.trackChild))
			.map((button) => ({
				button,
				url: button.dataset.src ?? '',
				title: button.querySelector(selectors.trackTitle)?.textContent?.trim() ?? '',
				artist: button.querySelector(selectors.trackArtist)?.textContent?.trim() ?? '',
				image: button.dataset.image ?? button.querySelector<HTMLImageElement>(selectors.trackImage)?.src ?? '',
				imageAlt: button.dataset.imageAlt ?? button.querySelector<HTMLImageElement>(selectors.trackImage)?.alt ?? '',
			}))
			.filter((track) => track.url);
	},
	syncTracks: (state: PlaylistStateType) => {
		// Keep each track button's aria-current and screen reader action label in sync, like WordPress's bindings
		const { context, tracks, current, isPlaying } = state;
		tracks.forEach((track, index) => {
			const isCurrent = index === current;
			if (isCurrent) {
				track.button.setAttribute('aria-current', 'true');
			} else {
				track.button.removeAttribute('aria-current');
			}

			const label = track.button.querySelector(selectors.trackLabel);
			if (label) label.textContent = isCurrent && isPlaying ? (context.labelPauseTrack ?? defaults.labels.pause) : (context.labelSelectTrack ?? defaults.labels.play);
		});
	},
	setArtworkButton: (container: HTMLElement, image: string) => {
		// Show the track's image in the play button (the block's "show artwork in play button" setting)
		container.classList.toggle('has-play-button-artwork', Boolean(image));
		if (image) {
			container.style.setProperty('--wp--playlist--play-button-artwork', `url(${JSON.stringify(image)})`);
		} else {
			container.style.removeProperty('--wp--playlist--play-button-artwork');
		}
	},
	setSeekLabel: (state: PlaylistStateType, label: string) => {
		// Name the seek slider after the current track
		const seekLabel = label || defaults.labels.seek;
		state.container?.querySelector(selectors.waveformContainer)?.setAttribute('aria-label', seekLabel);
	},
	create: (figure: Element, state: PlaylistStateType, autoplay: boolean) => {
		// Build the player for the current track, like WordPress's initWaveformPlayer()
		const element = figure.querySelector<HTMLElement>(selectors.player);
		const track = state.tracks[state.current];
		if (!element || !track) return;

		const { dataset } = element;
		const showArtworkButton = state.context.showPlayButtonArtwork === true;
		const artwork = showArtworkButton ? '' : track.image;
		const labels = {
			play: dataset.labelPlay || defaults.labels.play,
			pause: dataset.labelPause || defaults.labels.pause,
			seek: dataset.labelSeek || defaults.labels.seek,
		};

		// Colors: the waveform uses the picked color or gradient (else the text color) at 30% / 60% opacity, and the play button the gradient's last stop or the picked color
		const textColor = getComputedStyle(element).color;
		const gradientStops = colors.gradientStops(element, dataset.waveformPlayerGradient);
		const baseColor = gradientStops ?? dataset.waveformPlayerColor ?? textColor;
		const waveformColor = Array.isArray(baseColor) ? baseColor.map((color) => colors.withAlpha(element, color, 0.3)) : colors.withAlpha(element, baseColor, 0.3);
		const progressColor = Array.isArray(baseColor) ? baseColor.map((color) => colors.withAlpha(element, color, 0.6)) : colors.withAlpha(element, baseColor, 0.6);
		const buttonColor = gradientStops ? gradientStops[gradientStops.length - 1] : dataset.waveformPlayerColor;

		// The player reads its options from data attributes on its container (like WordPress's createWaveformContainer())
		const container = document.createElement('div');
		const attributes: Record<string, string | undefined> = {
			'data-waveform-player': '',
			'data-url': track.url,
			'data-height': String(defaults.height),
			'data-waveform-style': state.context.waveformStyle ?? defaults.waveformStyle,
			'data-waveform-color': Array.isArray(waveformColor) ? JSON.stringify(waveformColor) : waveformColor,
			'data-progress-color': Array.isArray(progressColor) ? JSON.stringify(progressColor) : progressColor,
			'data-waveform-gradient': gradientStops ? colors.gradientDirection(dataset.waveformPlayerGradient) : undefined,
			'data-button-color': textColor,
			'data-seek-label': track.title || labels.seek,
			'data-seek-value-text': dataset.labelSeekValue,
			'data-text-color': textColor,
			'data-text-secondary-color': textColor,
			'data-title': track.title || undefined,
			'data-artist': track.artist || undefined,
			'data-artwork': artwork || undefined,
		};
		Object.entries(attributes).forEach(([name, value]) => value !== undefined && container.setAttribute(name, value));
		element.appendChild(container);

		const player = new WaveformPlayer(container);

		// Styles WordPress applies after creating the player (applyWaveformPlayerStyles())
		const playButtonColor = showArtworkButton ? undefined : buttonColor;
		if (playButtonColor) container.style.setProperty('--wfp-button-color', playButtonColor);
		container.style.setProperty('--wfp-text-color', textColor);
		container.style.setProperty('--wfp-text-secondary-color', textColor);
		const playButton = container.querySelector<HTMLElement>(selectors.waveformButton);
		if (playButton && !showArtworkButton && dataset.waveformPlayerGradient) playButton.style.background = dataset.waveformPlayerGradient;
		const waveformContainer = container.querySelector<HTMLElement>(selectors.waveformContainer);
		if (waveformContainer) {
			if (dataset.waveformPlayerBackgroundGradient) {
				waveformContainer.style.background = dataset.waveformPlayerBackgroundGradient;
			} else if (dataset.waveformPlayerBackgroundColor) {
				waveformContainer.style.backgroundColor = dataset.waveformPlayerBackgroundColor;
			}
		}

		// Player events
		const onReady = () => {
			// Make the play / pause icons readable on the button color, and label the button
			const iconColor = colors.isDark(container, playButtonColor ?? textColor) ? '#ffffff' : '#000000';
			container.querySelectorAll<SVGPathElement>('svg path').forEach((path) => (path.style.fill = iconColor));
			if (showArtworkButton) playlist.setArtworkButton(container, track.image);
			container.querySelector(selectors.waveformButton)?.setAttribute('aria-label', state.isPlaying ? labels.pause : labels.play);
			if (autoplay) playlist.play(state);
		};
		const onPlay = () => {
			state.isPlaying = true;
			container.querySelector(selectors.waveformButton)?.setAttribute('aria-label', labels.pause);
			playlist.syncTracks(state);
		};
		const onPause = () => {
			state.isPlaying = false;
			container.querySelector(selectors.waveformButton)?.setAttribute('aria-label', labels.play);
			playlist.syncTracks(state);
		};
		const onEnded = () => {
			// Move on to the next track, if there is one
			onPause();
			if (state.current < state.tracks.length - 1) playlist.change(figure, state, state.current + 1);
		};
		container.addEventListener('waveformplayer:ready', onReady);
		container.addEventListener('waveformplayer:play', onPlay);
		container.addEventListener('waveformplayer:pause', onPause);
		container.addEventListener('waveformplayer:ended', onEnded);

		state.player = player;
		state.container = container;
		state.hasArtwork = Boolean(artwork);
		state.destroy = () => {
			container.removeEventListener('waveformplayer:ready', onReady);
			container.removeEventListener('waveformplayer:play', onPlay);
			container.removeEventListener('waveformplayer:pause', onPause);
			container.removeEventListener('waveformplayer:ended', onEnded);
			player.destroy();
			container.remove();
		};
	},
	play: (state: PlaylistStateType) => {
		// Play, ignoring the error a later pause or track change throws for an interrupted play()
		state.player?.play()?.catch((error: unknown) => {
			if (!(error instanceof DOMException && error.name === 'AbortError')) console.error('Playlist play error:', error);
		});
	},
	change: (figure: Element, state: PlaylistStateType, index: number) => {
		// Switch to another track and play it, reusing the player unless its artwork row has to appear or disappear (like WordPress)
		const track = state.tracks[index];
		if (!track) return;

		state.current = index;
		state.isPlaying = false;
		playlist.syncTracks(state);

		const showArtworkButton = state.context.showPlayButtonArtwork === true;
		const artwork = showArtworkButton ? '' : track.image;
		if (!state.player || state.hasArtwork !== Boolean(artwork)) {
			state.destroy?.();
			playlist.create(figure, state, true);
			return;
		}

		const { player, container } = state;
		player
			.loadTrack(track.url, track.title, track.artist, { artwork, artworkAlt: artwork ? track.imageAlt : '' })
			.then(() => {
				playlist.setSeekLabel(state, track.title);
				if (showArtworkButton && container) playlist.setArtworkButton(container, track.image);
				playlist.play(state);
			})
			.catch((error: unknown) => console.error('Playlist load error:', error));
	},
	select: (button: Element) => {
		// Play / pause the current track, or switch to another one
		const figure = button.closest(selectors.playlist);
		const state = figure ? states.get(figure) : undefined;
		if (!figure || !state) return;

		const index = state.tracks.findIndex((track) => track.button === button);
		if (index < 0) return;

		if (index === state.current && state.player) {
			if (state.player.isPlaying) {
				state.player.pause();
			} else {
				playlist.play(state);
			}
			return;
		}

		playlist.change(figure, state, index);
	},
	destroyAll: () => {
		// Stop and remove every player, since a detached <audio> keeps playing after a navigation swaps the page
		states.forEach((state) => state.destroy?.());
		states.clear();
	},
	update: () => {
		// Set up a player on the first track of each playlist (without playing it)
		// Note: call on every page load, since each navigation swaps in new entry content
		document.querySelectorAll(selectors.playlist).forEach((figure) => {
			if (states.has(figure)) return;

			const tracks = playlist.tracks(figure);
			if (tracks.length === 0) return;

			const state: PlaylistStateType = { context: playlist.context(figure), tracks, current: 0, isPlaying: false };
			states.set(figure, state);
			playlist.syncTracks(state);
			playlist.create(figure, state, false);
		});
	},
	init: () => {
		// Handle every playlist's track buttons from document, so playlists on new pages work without new listeners
		// Note: call once, since the listeners stay on document across navigations
		document.addEventListener('click', (e) => {
			const button = e.target instanceof Element ? e.target.closest(selectors.track) : null;
			if (button) playlist.select(button);
		});
		document.addEventListener('astro:before-swap', playlist.destroyAll);
	},
};

/* Scripts */
import { lightbox } from './scripts/lightbox';

/* Components */
import { Button } from '@/components/forms/Forms';
import { Icon } from '@/components/icons/Icons';
import { Overlay } from '@/components/overlay/Overlay';

export const Lightbox = () => {
	const { selectors } = lightbox;

	// Render one shared, closed lightbox, then lightbox.init() (from container.ts) fills it with the clicked image and opens it with overlay.open()
	// Note: WordPress builds its lightbox with its Interactivity API script (image/view.js), which never reaches Astro, so this replaces it
	// Note: the previous / next buttons stay hidden unless the image is in a gallery with other lightbox images
	// Note: each button has an icon and a text span (like WordPress), and lightbox.open() sets data-navigation-button-type on the dialog to show the icon, the text, or both
	// Note: the aria-labels stay on, since they contain the visible text (e.g. "Previous image" and "Previous")
	return (
		<Overlay id={selectors.id} className="lightbox" aria-label="Enlarged image" data-navigation-button-type="icon">
			<div className="lightbox-content pointer">
				<Button
					className="lightbox-close"
					label={'Close'}
					variant={'unstyled'}
					aria-label={'Close gallery'}
					data-autofocus
					data-overlay-close
				>
					<Icon name={'x'} size={'xl'} />
				</Button>

				<nav className="lightbox-navigation" aria-label="Lightbox Navigation">
					<Button
						className="lightbox-navigation-button lightbox-navigation-previous"
						label={'Previous'}
						variant={'unstyled'}
						aria-label={'Previous image'}
						hidden
						data-lightbox-prev
					>
						<Icon name={'chevron-left'} size={'xl'} />
					</Button>

					<Button
						className="lightbox-navigation-button lightbox-navigation-next"
						label={'Next'}
						variant={'unstyled'}
						aria-label={'Next image'}
						hidden
						data-lightbox-next
					>
						<Icon name={'chevron-right'} size={'xl'} />
					</Button>
				</nav>

				<div className="lightbox-image">
					<div className="image-wrapper">
						<img alt="" decoding="async" />
					</div>
				</div>
			</div>
		</Overlay>
	);
};

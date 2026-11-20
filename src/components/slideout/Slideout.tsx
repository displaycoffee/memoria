/* Styles */
import './styles/slideout.scss';

/* Scripts */
import type { SlideoutProps } from './scripts/slideout-types';
import { useFormattedId } from '@displaycoffee/scripts/hooks';
import { slideout } from './scripts/slideout';

/* Components */
import { Button } from '@/components/forms/Forms';
import { Icon } from '@/components/icons/Icons';
import { Overlay } from '@/components/overlay/Overlay';

export const Slideout = (props: SlideoutProps) => {
	const { children, options } = props;
	const { config, get } = slideout;
	const fallbackId = useFormattedId();
	const id = `slideout-${options?.id ?? fallbackId}`;
	const title = `${id}-title`;
	const hideDesktop = typeof options?.hideDesktop == 'boolean' && options.hideDesktop === true;
	const slideoutClass = hideDesktop ? ' hide-desktop' : '';

	// Get default attributes for slideout
	const width = options?.width ?? config.values.width;
	const direction = options?.direction ?? config.values.direction;
	const orientation = get.orientation(direction);

	// Render closed, then overlay.init() opens / closes it and slideout.init() adds swipe, link, and desktop closing (both from container.ts)
	// Note: no client directive, so the slideout ships no React
	return (
		<>
			<Button
				className={`slideout-button${slideoutClass}`}
				label={options.label}
				aria-controls={id}
				aria-expanded={false}
				aria-haspopup={'dialog'}
				aria-label={`Open ${options.label}`}
				data-overlay-open={id}
			>
				<Icon name={'sliders-vertical'} size={'lg'} />
			</Button>

			<Overlay
				id={id}
				className={`slideout slideout-${orientation} slideout-${direction}${slideoutClass}`}
				aria-labelledby={title}
				style={{ width }}
				data-slideout-direction={direction}
			>
				<header className="slideout-header flex-nowrap flex-align-items-center">
					<h2 id={title} className="slideout-title">
						{options.label}
					</h2>

					<Button
						className={'slideout-close'}
						hideLabel={true}
						label={'Slideout Close Button'}
						variant={'unstyled'}
						data-autofocus
						data-overlay-close
					>
						<Icon name={'x'} size={'2xl'} />
					</Button>
				</header>

				<div className="slideout-scrollbar scrollbar">
					<div className="slideout-body">{children}</div>
				</div>
			</Overlay>
		</>
	);
};

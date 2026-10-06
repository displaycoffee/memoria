/* Styles */
import './styles/page.scss';

/* Scripts */
import type { PageBlocksProps } from './scripts/page-types';

/* Components */
import { Image } from '../image/Image';

export const PageImage = (props: PageBlocksProps) => {
	const page = props.page;

	return (
		<div className="page-image">
			<a href={page.url}>
				<Image alt={page.image.alt} hasLazy={true} image={page.image.url} wrapperClasses={['fluid', 'fit']} />
			</a>
		</div>
	);
};

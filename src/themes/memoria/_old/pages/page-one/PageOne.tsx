/* Styles */
import './styles/page-one.scss';

/* Components */
import { Image } from '../../components/image/Image';

export const PageOne = () => {
	const imageClass = 'image-wrapper image-wrapper';

	return (
		<div className="page-one spacing-reset">
			<h2>Page One</h2>

			<p>this is the first page.</p>

			<Image alt={'Cat 01'} hasBg={true} hasLazy={true} image={'/assets/images/test/test-image-01.jpg'} wrapperClass={`${imageClass}-bg`} />

			<Image alt={'Cat 02'} hasLazy={true} image={'/assets/images/test/test-image-02.jpg'} wrapperClass={`${imageClass}-fit`} />

			<Image alt={'Cat 03'} hasLazy={true} image={'/assets/images/test/test-image-03.jpg'} wrapperClass={`${imageClass}-fluid`} />
		</div>
	);
};

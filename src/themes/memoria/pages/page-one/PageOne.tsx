/* Local styles */
import './styles/page-one.scss';

export const PageOne = (props: ObjectPrimitiveProps) => {
	return (
		<div className="page-one spacing-reset">
			<p>this is the first page.</p>

			<div className="image-wrapper image-wrapper-bg" style={{ backgroundImage: 'url(/assets/images/test/test-image-01.jpg)' }}>
				<img src="/assets/images/test/test-image-01.jpg" loading="lazy" alt="Cat 01" />
			</div>

			<div className="image-wrapper image-wrapper-fit">
				<img src="/assets/images/test/test-image-02.jpg" loading="lazy" alt="Cat 02" />
			</div>

			<div className="image-wrapper image-wrapper-fluid">
				<img src="/assets/images/test/test-image-03.jpg" loading="lazy" alt="Cat 03" />
			</div>
		</div>
	);
};

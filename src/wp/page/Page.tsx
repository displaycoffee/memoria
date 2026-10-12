/* Styles */
import './styles/page.scss';

/* Scripts */
import type { PageProps, PageImageProps, PageListProps } from './scripts/page-types';

/* Components */
import { Image } from '@/components/image/Image';
import { ButtonLink } from '@/components/forms/Forms';

export const Page = (props: PageProps) => {
	const { page } = props;

	return (
		<div id={page.id} className="page">
			{!page.image.url.includes('placeholder') ? <PageImage hasLink={false} page={page} /> : null}

			<div className="page-details">
				<h2 className="page-title">{page.title}</h2>

				<div className="page-content margin-trim" dangerouslySetInnerHTML={{ __html: page.content }}></div>
			</div>
		</div>
	);
};

export const PageList = (props: PageListProps) => {
	const { pages } = props;

	return (
		<div className="pages row row-wrap row-spacing-20">
			{pages.map((page: PageType) => {
				return (
					<div id={page.id} className="page column column-width-50" key={page.id}>
						<PageImage page={page} />

						<div className="page-details">
							<h3 className="page-title h5">
								<a className="no-decoration" href={page.url}>
									{page.title}
								</a>
							</h3>

							<div className="page-content margin-trim">{page.excerpt}</div>

							<div className="page-read-more">
								<ButtonLink label={'Read More'} aria-label={`Read more about "${page.title}"`} url={page.url} />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

/* Components for page only; not exported */
const PageImage = (props: PageImageProps) => {
	const { hasLink = true, page } = props;
	const image = <Image alt={page.image.alt} hasLazy={true} image={page.image.url} wrapperClasses={['fluid', 'fit']} />;

	return <div className="page-image">{hasLink ? <a href={page.url}>{image}</a> : image}</div>;
};

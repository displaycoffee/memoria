/* Styles */
import './styles/page.scss';

/* Scripts */
import type { PageListProps } from './scripts/page-types';

/* Components */
import { PageImage } from './PageBlocks';

export const PageList = (props: PageListProps) => {
	const pages = props.pages;

	return (
		<div className="pages row row-wrap row-spacing-20">
			{pages.map((page: PageType) => {
				return (
					<div id={page.id} className="page column column-width-50" key={page.id}>
						<PageImage page={page} />

						<div className="page-details">
							<h3 className="page-title h5">
								<a href={page.url}>{page.title}</a>
							</h3>

							<div className="page-content margin-trim">{page.excerpt}</div>

							<div className="page-read-more">
								<a className="button" href={page.url}>
									Read More<span className="sr-only"> about {page.title}</span>
								</a>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

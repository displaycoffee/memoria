/* Styles */
import './styles/category.scss';

/* Scripts */
import type { CategoryProps, CategoryListProps } from './scripts/category-types';

/* Components */
import { PostList } from '@/wp/post/Post';
import { ButtonLink } from '@/components/forms/Forms';

export const Category = (props: CategoryProps) => {
	const { category, posts } = props;

	return (
		<div id={category.id} className="category">
			<div className="category-details">
				<h2 className="category-title">{category.name}</h2>

				{category.content ? (
					<div className="category-content margin-trim" dangerouslySetInnerHTML={{ __html: category.content }}></div>
				) : null}
			</div>

			<div className="category-posts">
				<PostList posts={posts} />
			</div>
		</div>
	);
};

export const CategoryList = (props: CategoryListProps) => {
	const { categories } = props;

	return (
		<div className="categories row row-wrap row-spacing-20">
			{categories.map((category: CategoryType) => {
				return (
					<div id={category.id} className="category column column-width-50" key={category.id}>
						<div className="category-details">
							<h3 className="category-title h5">
								<a className="no-decoration" href={category.url}>
									{category.name}
								</a>
							</h3>

							{category.excerpt ? <div className="category-content margin-trim">{category.excerpt}</div> : null}

							<div className="category-read-more">
								<ButtonLink label={'Read More'} aria-label={`Read more about "${category.name}"`} url={category.url} />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

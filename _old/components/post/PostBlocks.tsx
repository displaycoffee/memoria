/* Styles */
import './styles/post.scss';

/* Packages */
import { Fragment } from 'react';

/* Scripts */
import type { PostBlocksProps } from './scripts/post-types';

/* Components */
import { Image } from '../image/Image';

export const PostImage = (props: PostBlocksProps) => {
	const post = props.post;

	return (
		<div className="post-image">
			<a href={post.url}>
				<Image alt={post.image.alt} hasLazy={true} image={post.image.url} wrapperClasses={['fluid', 'fit']} />
			</a>
		</div>
	);
};

export const PostMeta = (props: PostBlocksProps) => {
	const post = props.post;

	return (
		<div className="post-meta">
			{post?.author?.name ? (
				<span className="post-author">
					By <a href={post.author.url}>{post.author.name}</a> on
				</span>
			) : null}

			<span className="post-date">{post.date}</span>
		</div>
	);
};

export const PostTaxonomies = (props: PostBlocksProps) => {
	const post = props.post;
	const hasTaxonomies = post.categories.length !== 0 || post.tags.length !== 0;

	return hasTaxonomies ? (
		<div className="post-taxonomies">
			<div className="row row-wrap row-fit row-spacing-20">
				{post.categories.length !== 0 ? (
					<div className="column-categories column">
						<strong>Categories:</strong>

						{post.categories.map((category, index) => {
							const isLast = index == post.categories.length - 1;
							return (
								<Fragment key={category.id}>
									<a href={category.url}>{category.name}</a>
									{isLast ? '' : ', '}
								</Fragment>
							);
						})}
					</div>
				) : null}

				{post.tags.length !== 0 ? (
					<div className="column-tags column">
						<strong>Tags:</strong>

						{post.tags.map((tag, index) => {
							const isLast = index == post.tags.length - 1;
							return (
								<Fragment key={tag.id}>
									<a href={tag.url}>{tag.name}</a>
									{isLast ? '' : ', '}
								</Fragment>
							);
						})}
					</div>
				) : null}
			</div>
		</div>
	) : null;
};

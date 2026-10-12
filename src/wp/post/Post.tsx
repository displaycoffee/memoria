/* Styles */
import './styles/post.scss';

/* Packages */
import { Fragment } from 'react';

/* Scripts */
import type { PostProps, PostBlocksProps, PostImageProps, PostListProps } from './scripts/post-types';

/* Components */
import { Image } from '@/components/image/Image';
import { ButtonLink } from '@/components/forms/Forms';

export const Post = (props: PostProps) => {
	const { post } = props;

	return (
		<div id={post.id} className="post">
			{!post.image.url.includes('placeholder') ? <PostImage hasLink={false} post={post} /> : null}

			<div className="post-details">
				<h2 className="post-title">{post.title}</h2>

				<PostMeta post={post} />

				<div className="post-content margin-trim" dangerouslySetInnerHTML={{ __html: post.content }}></div>

				<PostTaxonomies post={post} />
			</div>
		</div>
	);
};

export const PostList = (props: PostListProps) => {
	const { posts } = props;

	return (
		<div className="posts row row-wrap row-spacing-20">
			{posts.map((post: PostType) => {
				return (
					<div id={post.id} className="post column column-width-50" key={post.id}>
						<PostImage post={post} />

						<div className="post-details">
							<h3 className="post-title h5">
								<a className="no-decoration" href={post.url}>
									{post.title}
								</a>
							</h3>

							<PostMeta post={post} />

							<div className="post-content margin-trim">{post.excerpt}</div>

							<div className="post-read-more">
								<ButtonLink label={'Read More'} aria-label={`Read more about "${post.title}"`} url={post.url} />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

/* Components for post only; not exported */
const PostImage = (props: PostImageProps) => {
	const { hasLink = true, post } = props;
	const image = <Image alt={post.image.alt} hasLazy={true} image={post.image.url} wrapperClasses={['fluid', 'fit']} />;

	return <div className="post-image">{hasLink ? <a href={post.url}>{image}</a> : image}</div>;
};

const PostMeta = (props: PostBlocksProps) => {
	const { post } = props;

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

const PostTaxonomies = (props: PostBlocksProps) => {
	const { post } = props;
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

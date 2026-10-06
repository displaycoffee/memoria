/* Styles */
import './styles/post.scss';

/* Scripts */
import type { PostListProps } from './scripts/post-types';

/* Components */
import { PostImage, PostMeta } from './PostBlocks';

export const PostList = (props: PostListProps) => {
	const posts = props.posts;

	return (
		<div className="posts row row-wrap row-spacing-20">
			{posts.map((post: PostType) => {
				return (
					<div id={post.id} className="post column column-width-50" key={post.id}>
						<PostImage post={post} />

						<div className="post-details">
							<h3 className="post-title h5">
								<a href={post.url}>{post.title}</a>
							</h3>

							<PostMeta post={post} />

							<div className="post-content margin-trim">{post.excerpt}</div>

							<div className="post-read-more">
								<a className="button" href={post.url}>
									Read More<span className="sr-only"> about {post.title}</span>
								</a>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

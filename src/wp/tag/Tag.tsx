/* Styles */
import './styles/tag.scss';

/* Scripts */
import type { TagProps, TagListProps } from './scripts/tag-types';

/* Components */
import { PostList } from '@/wp/post/Post';
import { ButtonLink } from '@/components/forms/Forms';

export const Tag = (props: TagProps) => {
	const { tag, posts } = props;

	return (
		<div id={tag.id} className="tag">
			<div className="tag-details">
				<h2 className="tag-title">{tag.name}</h2>

				{tag.content ? <div className="tag-content margin-trim" dangerouslySetInnerHTML={{ __html: tag.content }}></div> : null}
			</div>

			<div className="tag-posts">
				<PostList posts={posts} />
			</div>
		</div>
	);
};

export const TagList = (props: TagListProps) => {
	const { tags } = props;

	return (
		<div className="tags row row-wrap row-spacing-20">
			{tags.map((tag: TagType) => {
				return (
					<div id={tag.id} className="tag column column-width-50" key={tag.id}>
						<div className="tag-details">
							<h3 className="tag-title h5">
								<a className="no-decoration" href={tag.url}>
									{tag.name}
								</a>
							</h3>

							{tag.excerpt ? <div className="tag-content margin-trim">{tag.excerpt}</div> : null}

							<div className="tag-read-more">
								<ButtonLink label={'Read More'} aria-label={`Read more about "${tag.name}"`} url={tag.url} />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

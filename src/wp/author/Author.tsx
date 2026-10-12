/* Styles */
import './styles/author.scss';

/* Scripts */
import type { AuthorProps, AuthorListProps } from './scripts/author-types';

/* Components */
import { PostList } from '@/wp/post/Post';
import { ButtonLink } from '@/components/forms/Forms';

export const Author = (props: AuthorProps) => {
	const { author, posts } = props;

	return (
		<div id={author.id} className="author">
			<div className="author-details">
				<h2 className="author-title">{author.name}</h2>

				{author.content ? <div className="author-content margin-trim" dangerouslySetInnerHTML={{ __html: author.content }}></div> : null}
			</div>

			<div className="author-posts">
				<PostList posts={posts} />
			</div>
		</div>
	);
};

export const AuthorList = (props: AuthorListProps) => {
	const { authors } = props;

	return (
		<div className="authors row row-wrap row-spacing-20">
			{authors.map((author: AuthorType) => {
				return (
					<div id={author.id} className="author column column-width-50" key={author.id}>
						<div className="author-details">
							<h3 className="author-title h5">
								<a className="no-decoration" href={author.url}>
									{author.name}
								</a>
							</h3>

							{author.excerpt ? <div className="author-content margin-trim">{author.excerpt}</div> : null}

							<div className="author-read-more">
								<ButtonLink label={'Read More'} aria-label={`Read more about "${author.name}"`} url={author.url} />
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

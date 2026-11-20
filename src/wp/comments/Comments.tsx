/* Styles */
import './styles/comments.scss';

/* Scripts */
import type { CommentsProps } from './scripts/comments-types';
import { commentsTheme } from './scripts/comments-theme';

export const Comments = (props: CommentsProps) => {
	const { term } = props;

	// The giscus iframe is added by comments.load() (comments.ts) after each page load, using the theme for the current mode
	return (
		<section className="comments">
			<h3 className="comments-title">Comments</h3>
			<div
				className="comments-giscus giscus"
				data-term={term}
				data-theme-dark={commentsTheme.url('dark')}
				data-theme-light={commentsTheme.url('light')}
			></div>
		</section>
	);
};

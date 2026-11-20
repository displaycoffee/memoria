/* Styles */
import './styles/post.scss';

/* Scripts */
import type { PostProps, PostAdjacentProps, PostListProps, PostNavigationLinkProps } from './scripts/post-types';

/* Components */
import { Icon } from '@/components/icons/Icons';
import { List } from '@/components/blocks/Blocks';
import { Comments } from '@/wp/comments/Comments';
import { Entry, EntryList } from '@/wp/entry/Entry';

export const Post = (props: PostProps) => {
	const { adjacent, post } = props;

	return (
		<>
			<Entry data={post} type={'post'} />
			{adjacent ? <PostNavigation {...adjacent} /> : null}
			<Comments term={post.id} />
		</>
	);
};

export const PostList = (props: PostListProps) => {
	const { posts } = props;

	return <EntryList list={posts} type={'post'} hasPlaceholder={true} />;
};

/* Components for post only; not exported */
const PostNavigation = (props: PostAdjacentProps) => {
	const { next, previous } = props;

	// Nothing to link to (only one post)
	if (!next && !previous) return null;

	return (
		<nav className="post-navigation" aria-label="Post navigation">
			<List className={'post-navigation-list row row-nowrap row-auto row-spacing-20 row-align-items-center'} variant={'ul-unstyled'}>
				<PostNavigationLink direction={'previous'} post={previous} />
				<PostNavigationLink direction={'next'} post={next} />
			</List>
		</nav>
	);
};

const PostNavigationLink = (props: PostNavigationLinkProps) => {
	const { direction, post } = props;
	const isNext = direction == 'next';
	const postTitle = post ? <span className="post-navigation-list-item-title hide-tablet">: {post.title}</span> : null;

	return post ? (
		<li className={`post-navigation-list-item post-navigation-list-item-${direction} column`}>
			<a className="flex-nowrap flex-align-items-center" href={post.url} rel={isNext ? 'next' : 'prev'}>
				{isNext ? (
					<>
						Next Post{postTitle}
						<Icon name={`chevron-right`} />
					</>
				) : (
					<>
						<Icon name={`chevron-left`} />
						Previous Post{postTitle}
					</>
				)}
			</a>
		</li>
	) : null;
};

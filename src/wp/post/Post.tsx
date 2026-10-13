/* Scripts */
import type { PostProps, PostListProps } from './scripts/post-types';

/* Components */
import { Entry, EntryList } from '@/wp/entry/Entry';

export const Post = (props: PostProps) => {
	const { post } = props;

	return <Entry data={post} type={'post'} />;
};

export const PostList = (props: PostListProps) => {
	const { posts } = props;

	return <EntryList list={posts} type={'post'} hasPlaceholder={true} />;
};

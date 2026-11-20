/* Scripts */
import type { AuthorProps, AuthorListProps } from './scripts/author-types';

/* Components */
import { PostList } from '@/wp/post/Post';
import { EntryList, EntryArchive } from '@/wp/entry/Entry';

export const Author = (props: AuthorProps) => {
	const { author, posts } = props;

	return (
		<EntryArchive data={author} type={'author'}>
			<PostList posts={posts} />
		</EntryArchive>
	);
};

export const AuthorList = (props: AuthorListProps) => {
	const { authors } = props;

	return <EntryList hasImage={false} list={authors} type={'author'} />;
};

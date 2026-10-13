/* Scripts */
import type { TagProps, TagListProps } from './scripts/tag-types';

/* Components */
import { PostList } from '@/wp/post/Post';
import { EntryList, EntryArchive } from '@/wp/entry/Entry';

export const Tag = (props: TagProps) => {
	const { tag, posts } = props;

	return (
		<EntryArchive data={tag} type={'tag'}>
			<PostList posts={posts} />
		</EntryArchive>
	);
};

export const TagList = (props: TagListProps) => {
	const { tags } = props;

	return <EntryList hasImage={false} list={tags} type={'tag'} />;
};

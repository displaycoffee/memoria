/* Scripts */
import type { CategoryProps, CategoryListProps } from './scripts/category-types';

/* Components */
import { PostList } from '@/wp/post/Post';
import { EntryList, EntryArchive } from '@/wp/entry/Entry';

export const Category = (props: CategoryProps) => {
	const { category, posts } = props;

	return (
		<EntryArchive data={category} type={'category'}>
			<PostList posts={posts} />
		</EntryArchive>
	);
};

export const CategoryList = (props: CategoryListProps) => {
	const { categories } = props;

	return <EntryList hasImage={false} list={categories} type={'category'} />;
};

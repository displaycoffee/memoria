/* Type definitions */
type Tag = {
	posts: PostsType;
	tag: TagType;
};

type TagList = {
	tags: TagsType;
};

/* Export prop types */
export type TagProps = Tag;

export type TagListProps = TagList;

/* Type definitions */
type Post = {
	post: PostType;
};

type PostBlocks = {
	post: PostType;
};

type PostList = {
	posts: PostsType;
};

/* Export prop types */
export type PostProps = Post;

export type PostBlocksProps = PostBlocks;

export type PostListProps = PostList;

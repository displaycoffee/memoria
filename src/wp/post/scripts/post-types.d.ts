/* Type definitions */
type Post = {
	adjacent?: PostAdjacent;
	post: PostType;
};

type PostAdjacent = {
	next?: PostType; // Newer post
	previous?: PostType; // Older post
};

type PostList = {
	posts: PostsType;
};

type PostNavigationLink = {
	direction: 'next' | 'previous';
	post?: PostType;
};

/* Export prop types */
export type PostProps = Post;

export type PostAdjacentProps = PostAdjacent;

export type PostListProps = PostList;

export type PostNavigationLinkProps = PostNavigationLink;

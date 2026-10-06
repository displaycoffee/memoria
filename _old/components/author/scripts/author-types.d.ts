/* Type definitions */
type Author = {
	author: AuthorType;
	posts: PostsType;
};

type AuthorList = {
	authors: AuthorsType;
};

/* Export prop types */
export type AuthorProps = Author;

export type AuthorListProps = AuthorList;

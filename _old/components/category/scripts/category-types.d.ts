/* Type definitions */
type Category = {
	category: CategoryType;
	posts: PostsType;
};

type CategoryList = {
	categories: CategoriesType;
};

/* Export prop types */
export type CategoryProps = Category;

export type CategoryListProps = CategoryList;

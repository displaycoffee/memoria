/* Scripts */
import type { PageProps, PageListProps } from './scripts/page-types';

/* Components */
import { Entry, EntryList } from '@/wp/entry/Entry';

export const Page = (props: PageProps) => {
	const { page } = props;

	return <Entry data={page} type={'page'} />;
};

export const PageList = (props: PageListProps) => {
	const { pages } = props;

	return <EntryList list={pages} type={'page'} hasPlaceholder={true} />;
};

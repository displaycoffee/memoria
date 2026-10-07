/* Styles */
import './styles/search-form.scss';

/* Scripts */
import type { SearchFormProps, SearchFormButtonProps } from './scripts/search-types';

/* Components */
import { Icon } from '@/components/icons/Icons';
import { Button, Form, FormActions, Input } from '@/components/forms/Forms';

export const SearchForm = (props: SearchFormProps) => {
	const { action, id } = props;
	const searchInputId = `${id}-input`;

	return (
		<Form id={id} className={'search-form flex-nowrap'} hasMarginTrim={false} role={'search'} method={'get'} action={action}>
			<Input id={searchInputId} hasClose={true} label={'Search'} name={'q'} placeholder={'Search for...'} />

			<FormActions>
				<SearchFormButton isDesktop={true} />

				<SearchFormButton isDesktop={false} />
			</FormActions>
		</Form>
	);
};

const SearchFormButton = (props: SearchFormButtonProps) => {
	const { isDesktop } = props;

	return (
		<Button className={`hide-${isDesktop ? 'mobile' : 'desktop'}`} hideLabel={!isDesktop} label={'Submit'} type={'submit'}>
			<Icon name={'search'} />
		</Button>
	);
};

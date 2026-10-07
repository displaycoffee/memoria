/* Packages */
import { useState } from 'react';

/* Components */
import { Button, Choice, FormActions, FormField, Input, Select, Textarea, Toggle } from '@/components/forms/Forms';
import { Icon } from '@/components/icons/Icons';

export const PageFourClient = () => {
	// Sample content
	const description = 'This is a description explaning what the field does.';
	const error = <p>This is an error message.</p>;
	const placeholder = 'Enter your text, please.';

	// Sample state for choice and toggle fields
	const [checkboxes, setCheckboxes] = useState(['checkbox-option-01']);
	const [radio, setRadio] = useState('radio-option-02');
	const [toggles, setToggles] = useState(['toggle-option-03']);

	// Add or remove an id from a multi-select group
	const updateGroup = (group: string[], id: string) => (group.includes(id) ? group.filter((value) => value != id) : [...group, id]);

	// Build state props for each group
	const checkboxProps = (id: string) => ({ id: id, active: checkboxes.includes(id), onChange: () => setCheckboxes(updateGroup(checkboxes, id)) });
	const radioProps = (id: string) => ({ id: id, name: 'radios-01', active: radio == id, onChange: () => setRadio(id) });
	const toggleProps = (id: string) => ({ id: id, active: toggles.includes(id), onChange: () => setToggles(updateGroup(toggles, id)) });

	return (
		<>
			<FormField id={'checkboxes-01'} label={'Checkboxes 01'} isChoice={true}>
				<Choice label={'Checkbox option 01'} {...checkboxProps('checkbox-option-01')} />

				<Choice label={'Checkbox option 02'} {...checkboxProps('checkbox-option-02')} />

				<Choice label={'Checkbox option 03'} {...checkboxProps('checkbox-option-03')} />
			</FormField>

			<FormField id={'radios-01'} label={'Radios 01'} isChoice={true}>
				<Choice label={'Radio option 01'} type={'radio'} {...radioProps('radio-option-01')} />

				<Choice label={'Radio option 02'} type={'radio'} {...radioProps('radio-option-02')} />

				<Choice label={'Radio option 03'} type={'radio'} {...radioProps('radio-option-03')} />
			</FormField>

			<FormField id={'toggles-01'} label={'Toggles 01'} isChoice={true}>
				<Toggle label={'Toggle option 01'} {...toggleProps('toggle-option-01')} />

				<Toggle label={'Toggle option 02'} {...toggleProps('toggle-option-02')} />

				<Toggle label={'Toggle option 03'} {...toggleProps('toggle-option-03')} />
			</FormField>

			<Input hideLabel={true} id={'input-01'} label={'Input 01'} placeholder={'Example with hidden label.'} />

			<Input id={'input-02'} label={'Input 02'} placeholder={placeholder} required={true} />

			<Input id={'input-03'} label={'Input 03'} placeholder={placeholder} error={error} />

			<Input id={'input-04'} label={'Input 04'} description={description} />

			<Input id={'input-05'} hasClose={true} label={'Input 05'} placeholder={placeholder} error={error} description={description} />

			<Select id={'select-01'} label={'Select 01'} error={error} description={description}>
				<option value="option-01">Option 01</option>
				<option value="option-02">Option 02</option>
				<option value="option-03">Option 03</option>
			</Select>

			<Textarea
				id={'textarea-01'}
				hasClose={true}
				label={'Textarea 01'}
				placeholder={placeholder}
				error={error}
				description={description}
				rows={3}
			/>

			<FormActions>
				<Button label={'Primary Button with Children'}>
					<Icon name={'heart'} />
				</Button>
				<Button label={'Secondary Button'} variant={'secondary'} />
				<Button label={'Tertiary Button'} variant={'tertiary'} />
				<Button label={'Button with Hidden Label'} hideLabel={true}>
					<Icon name={'star'} />
				</Button>
			</FormActions>
		</>
	);
};

/* Styles */
import './styles/forms.scss';

/* Scripts */
import type {
	ButtonProps,
	ButtonScrollProps,
	ChoiceProps,
	DescriptionProps,
	ErrorFieldProps,
	FieldCloseProps,
	FormProps,
	FormActionsProps,
	FormFieldProps,
	FormFieldDetailsProps,
	InputProps,
	RequiredProps,
	SelectProps,
	TextareaProps,
	ToggleProps,
} from './scripts/forms-types';
import { forms } from './scripts/forms';

/* Components */
import { Alert } from '@/components/alert/Alert';
import { Icon } from '@/components/icons/Icons';

export const Button = (props: ButtonProps) => {
	const { children, className: propClassName, hideLabel = false, label, type = 'button', variant = 'primary', ...rest } = props;
	const buttonClass = variant != 'unstyled' && variant != 'link' ? 'button ' : '';
	const variantClass = variant == 'link' ? `button-${variant} button-unstyled a` : `button-${variant}`;
	const className = forms.build.className(`${buttonClass}${variantClass}`, propClassName, rest?.disabled, true);

	return (
		<button className={className} type={type} aria-label={hideLabel ? label : undefined} {...rest}>
			{children}
			{hideLabel ? null : <span className="button-label">{label}</span>}
		</button>
	);
};

export const ButtonScroll = (props: ButtonScrollProps) => {
	const { offset = 0, target, ...rest } = props;

	// Note: forms.scroll handles the click from document, since this renders as static HTML without a client directive
	return <Button variant={'link'} data-scroll-offset={offset} data-scroll-target={target} {...rest} />;
};

export const Choice = (props: ChoiceProps) => {
	const { active = false, className: propClassName, hideLabel = false, id, label, name, type = 'checkbox', ...rest } = props;
	const choiceClass = `choice choice-${type}${active ? ' choice-active' : ''} pointer`;
	const className = forms.build.className(choiceClass, propClassName, rest?.disabled);

	// Note: radios in the same group need to share a name, so pass it in (checkboxes fall back to their id)
	return (
		<label className={className} htmlFor={id}>
			{active ? <Icon name={type == 'radio' ? 'dot' : 'check'} /> : <span className="icon-wrapper"></span>}

			<input id={id} className={`choice-input choice-input-${type} sr-only`} checked={active} name={name ?? id} type={type} {...rest} />

			<span className={`choice-label${hideLabel ? ' sr-only' : ''}`}>{label}</span>
		</label>
	);
};

export const Form = (props: FormProps) => {
	const { children, className: propClassName, hasMarginTrim = true, ...rest } = props;
	const formClass = hasMarginTrim ? `form margin-trim` : `form`;
	const className = forms.build.className(formClass, propClassName);

	return (
		<form className={className} {...rest}>
			{children}
		</form>
	);
};

export const FormActions = (props: FormActionsProps) => {
	const { children, className: propClassName } = props;
	const className = forms.build.className(`form-actions`, propClassName);

	return <div className={className}>{children}</div>;
};

export const FormField = (props: FormFieldProps) => {
	const { children, hideLabel, id, isChoice = false, label, required } = props;
	const className = forms.build.className(`form-field`, props?.className);

	// Create elements for form field
	const Tag = isChoice ? 'fieldset' : 'div';
	const Label = isChoice ? 'span' : 'label';

	// Determine attributes for label
	const labelAttributes = {
		className: `label${!hideLabel && !isChoice ? ' pointer' : ''}${hideLabel ? ' sr-only' : ''}`,
		htmlFor: isChoice ? undefined : id,
	};

	return (
		<Tag className={className}>
			{isChoice ? <legend className="sr-only">{label}</legend> : null}

			{hideLabel ? (
				isChoice ? null : (
					<Label {...labelAttributes}>{label}</Label>
				)
			) : (
				<div className="form-field-label">
					<Label {...labelAttributes} aria-hidden={isChoice ? 'true' : undefined}>
						{label}
						<Required isRequired={required ?? false} />
					</Label>
				</div>
			)}

			<div className="form-field-control">{children}</div>
		</Tag>
	);
};

export const Input = (props: InputProps) => {
	const {
		className: propClassName,
		description = '',
		error = '',
		hasClose = false,
		hideLabel = false,
		id,
		label,
		required = false,
		type = 'text',
		...rest
	} = props;
	const freeformFields = ['email', 'number', 'password', 'search', 'tel', 'text', 'url'];
	const inputClass = `input input-${type}${freeformFields.includes(type) ? ' input-freeform' : ''}`;
	const className = forms.build.className(inputClass, propClassName, rest?.disabled);
	const { descriptionId, errorId } = forms.get.ids({ description, error, id });

	// Form field attributes
	const formFieldAttributes = forms.build.formFieldAttributes({ hideLabel, id, label, required });

	// Input attributes
	const inputAttributes = forms.build.fieldAttributes(id, className, descriptionId, error, errorId, required);

	return (
		<FormField {...formFieldAttributes}>
			<FieldClose hasClose={hasClose}>
				<input {...inputAttributes} type={type} {...rest} />
			</FieldClose>
			<FormFieldDetails description={description} descriptionId={descriptionId} error={error} errorId={errorId} />
		</FormField>
	);
};

export const Select = (props: SelectProps) => {
	const { children, className: propClassName, description = '', error = '', hideLabel = false, icon, id, label, required = false, ...rest } = props;
	const className = forms.build.className(`select`, propClassName, rest?.disabled, true);
	const { descriptionId, errorId } = forms.get.ids({ description, error, id });

	// Form field attributes
	const formFieldAttributes = forms.build.formFieldAttributes({ hideLabel, id, label, required });

	// Select attributes
	const selectAttributes = forms.build.fieldAttributes(id, className, descriptionId, error, errorId, required);

	return (
		<FormField {...formFieldAttributes}>
			<div className="select-wrapper">
				<select {...selectAttributes} {...rest}>
					{children}
				</select>
				<Icon name={icon ?? 'chevron-down'} />
			</div>
			<FormFieldDetails description={description} descriptionId={descriptionId} error={error} errorId={errorId} />
		</FormField>
	);
};

export const Textarea = (props: TextareaProps) => {
	const {
		className: propClassName,
		description = '',
		error = '',
		hasClose = false,
		hideLabel = false,
		id,
		label,
		required = false,
		...rest
	} = props;
	const className = forms.build.className(`textarea`, propClassName, rest?.disabled);
	const { descriptionId, errorId } = forms.get.ids({ description, error, id });

	// Form field attributes
	const formFieldAttributes = forms.build.formFieldAttributes({ hideLabel, id, label, required });

	// Textarea attributes
	const textareaAttributes = forms.build.fieldAttributes(id, className, descriptionId, error, errorId, required);

	return (
		<FormField {...formFieldAttributes}>
			<FieldClose hasClose={hasClose}>
				<textarea {...textareaAttributes} {...rest} />
			</FieldClose>
			<FormFieldDetails description={description} descriptionId={descriptionId} error={error} errorId={errorId} />
		</FormField>
	);
};

export const Toggle = (props: ToggleProps) => {
	const { active = false, className: propClassName, hideLabel = false, id, label, ...rest } = props;
	const toggleClass = `toggle${active ? ' toggle-active' : ''}`;
	const className = forms.build.className(`${toggleClass} flex-nowrap flex-align-items-center pointer`, propClassName, rest?.disabled);

	return (
		<label className={className} htmlFor={id}>
			<span className="toggle-slider" aria-hidden="true">
				<span className="toggle-slider-circle"></span>
			</span>

			<span className={`toggle-label${hideLabel ? ' sr-only' : ''}`}>{label}</span>

			<input id={id} className="sr-only" checked={active} name={id} role="switch" type="checkbox" {...rest} />
		</label>
	);
};

/* Components for forms only; not exported */
const Description = (props: DescriptionProps) => {
	const { description, id } = props;

	return description ? (
		<div id={id} className="form-description">
			{description}
		</div>
	) : null;
};

const ErrorField = (props: ErrorFieldProps) => {
	const { error, id } = props;

	return error ? (
		<Alert id={id} type={'warning'}>
			{error}
		</Alert>
	) : null;
};

const FieldClose = (props: FieldCloseProps) => {
	const { children, hasClose } = props;

	// Wrap the field with a clear button, which forms.clearable shows while the field has a value
	// Note: only the field and button are wrapped, so a description or error below can't push the button out of place
	return hasClose ? (
		<div className="form-field-close">
			{children}
			<Button className={'button-close'} hideLabel={true} label={'Clear'} type={'button'} variant={'unstyled'}>
				<Icon name={'x'} />
			</Button>
		</div>
	) : (
		children
	);
};

const FormFieldDetails = (props: FormFieldDetailsProps) => {
	const { description, descriptionId, error, errorId } = props;

	return (
		<>
			<Description description={description} id={descriptionId} />
			<ErrorField error={error} id={errorId} />
		</>
	);
};

const Required = (props: RequiredProps) => {
	const { isRequired } = props;

	return isRequired ? (
		<span className="form-required" aria-hidden="true">
			*
		</span>
	) : null;
};

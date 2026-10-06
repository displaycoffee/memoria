/* Styles */
import './styles/blocks.scss';

/* Packages */
import { useEffect, useRef } from 'react';

/* Scripts */
import type { LinkExternalProps, ListProps, SectionProps } from './scripts/blocks-types';
import { useFormattedId } from '../../_core/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';
import { blocks } from './scripts/blocks';

/* Components */
import { ButtonScroll } from '../forms/Forms';

export const LinkExternal = (props: LinkExternalProps) => {
	const { children, className, href, ...rest } = props;

	return (
		<a className={className} href={href} target="_blank" rel="noreferrer" {...rest}>
			{children}
			<span className="sr-only"> (opens in a new tab)</span>
		</a>
	);
};

export const List = (props: ListProps) => {
	const { children, className: propClassName, reversed, start, type: listType, variant = 'ul', ...rest } = props;
	const isOrdered = variant.includes('ol');
	const isUnstyled = variant.includes('unstyled');
	const Tag = isOrdered ? 'ol' : 'ul';
	const classes = `list-${isUnstyled ? 'unstyled' : isOrdered ? 'ordered' : 'unordered'}`;
	const className = propClassName ? `${propClassName} ${classes}` : classes;
	const olAttributes = isOrdered ? { reversed, start, type: listType } : {};

	return (
		<Tag className={className} role={'list'} {...rest} {...olAttributes}>
			{children}
		</Tag>
	);
};

export const Section = (props: SectionProps) => {
	const { children, className: propClassName, hasScroll = true, id, target = '#index', title } = props;
	const { utils } = useAppContext();
	const fallbackId = useFormattedId();
	const sectionId = `section-${id ? id : title ? utils.handleize(title) : fallbackId}`;
	const classes = `section ${sectionId} margin-trim`;
	const className = propClassName ? `${propClassName} ${classes}` : classes;
	const sectionRef = useRef<HTMLElement>(null);

	// Reveal section with a fade / scroll transition once it comes into view
	useEffect(() => {
		blocks.reveal(sectionRef.current, 'section-visible');
	}, []);

	return (
		<section id={sectionId} className={className} tabIndex={-1} ref={sectionRef}>
			{title ? <h3 className="section-title">{title}</h3> : null}

			<div className="section-content margin-trim">{children}</div>

			{hasScroll ? (
				<div className="section-button">
					<ButtonScroll target={target} label={'Back to top'} />
				</div>
			) : null}
		</section>
	);
};

/* Styles */
import './styles/entry.scss';

/* Packages */
import { Fragment } from 'react';

/* Scripts */
import type {
	EntryProps,
	EntryBlockProps,
	EntryContainerProps,
	EntryDataType,
	EntryImageProps,
	EntryListProps,
	EntryArchiveProps,
} from './scripts/entry-types';
import { entry } from './scripts/entry';
import { image as imageScripts } from '@/components/image/scripts/image';

/* Components */
import { ButtonLink } from '@/components/forms/Forms';
import { Image } from '@/components/image/Image';

export const Entry = (props: EntryProps) => {
	const { data, hasImage = true, type } = props;
	const { image, title } = entry.getData(data);

	return (
		<EntryContainer id={data.id} type={type}>
			{hasImage ? <EntryImage hasLink={false} image={image} url={data.url} /> : null}

			<div className="entry-details">
				<h2 className="entry-title">{title}</h2>

				<EntryMeta data={data} />

				<div className="entry-content margin-trim" dangerouslySetInnerHTML={{ __html: data.content }}></div>

				<EntryTaxonomies data={data} />
			</div>
		</EntryContainer>
	);
};

export const EntryList = (props: EntryListProps) => {
	const { hasImage = true, hasPlaceholder = false, list, type } = props;
	const types = type == `category` ? `categories` : `${type}s`;

	return (
		<div className={`${types} entry-list row row-wrap row-spacing-20`}>
			{list.map((data: EntryDataType) => {
				const { image, title } = entry.getData(data);

				return (
					<EntryContainer id={data.id} type={type} className={'column column-width-50'} key={data.id}>
						{hasImage ? <EntryImage hasPlaceholder={hasPlaceholder} image={image} url={data.url} /> : null}

						<div className="entry-details">
							<h3 className="entry-title h5">
								<a className="no-decoration" href={data.url}>
									{title}
								</a>
							</h3>

							<EntryMeta data={data} />

							{data.excerpt ? <div className="entry-content margin-trim">{data.excerpt}</div> : null}

							<div className="entry-read-more">
								<ButtonLink label={'Read More'} aria-label={`Read more about "${title}"`} url={data.url} />
							</div>
						</div>
					</EntryContainer>
				);
			})}
		</div>
	);
};

export const EntryArchive = (props: EntryArchiveProps) => {
	const { children, data, type } = props;
	const { title } = entry.getData(data);

	return (
		<div id={`entry-archive-${data.id}`} className={`entry-archive ${type}-archive`}>
			<div className="entry-archive-details">
				<h2 className="entry-archive-title">{title}</h2>

				{data.content ? <div className="entry-archive-content margin-trim" dangerouslySetInnerHTML={{ __html: data.content }}></div> : null}
			</div>

			<div className="entry-archive-list">{children}</div>
		</div>
	);
};

/* Components for entry only; not exported */
const EntryContainer = (props: EntryContainerProps) => {
	const { children, className: propClassName, id, type } = props;
	const containerClass = `${type} entry`;
	const className = propClassName ? `${containerClass} ${propClassName}` : containerClass;

	return (
		<div id={id} className={className}>
			{children}
		</div>
	);
};

const EntryImage = (props: EntryImageProps) => {
	const { hasLink = true, hasPlaceholder = false, image, url } = props;

	// Skip categories and tags (no image), and show the theme placeholder for a missing image only if hasPlaceholder is set
	if (!image) return null;
	const imageUrl = image.url || (hasPlaceholder ? imageScripts.placeholder : '');
	if (!imageUrl) return null;

	const imageElement = <Image alt={image.alt} hasLazy={true} image={imageUrl} wrapperClasses={['fluid', 'fit']} />;

	return <div className="entry-image">{hasLink ? <a href={url}>{imageElement}</a> : imageElement}</div>;
};

const EntryMeta = (props: EntryBlockProps) => {
	const { data } = props;

	// Only used on posts
	if (!('date' in data)) return null;

	return (
		<div className="entry-meta">
			{data.author.name ? (
				<span className="entry-author">
					By <a href={data.author.url}>{data.author.name}</a> on
				</span>
			) : null}

			<span className="entry-date">{data.date}</span>
		</div>
	);
};

const EntryTaxonomies = (props: EntryBlockProps) => {
	const { data } = props;

	// Only used on posts, which always have both categories and tags (check 'tags' too if pages ever get categories)
	if (!('categories' in data)) return null;

	return data.categories.length !== 0 || data.tags.length !== 0 ? (
		<div className="entry-taxonomies">
			<div className="row row-wrap row-auto row-spacing-20">
				{data.categories.length !== 0 ? (
					<div className="column-categories column">
						<strong>Categories:</strong>

						{data.categories.map((category, index) => {
							const isLast = index == data.categories.length - 1;
							return (
								<Fragment key={category.id}>
									<a href={category.url}>{category.name}</a>
									{isLast ? '' : ', '}
								</Fragment>
							);
						})}
					</div>
				) : null}

				{data.tags.length !== 0 ? (
					<div className="column-tags column">
						<strong>Tags:</strong>

						{data.tags.map((tag, index) => {
							const isLast = index == data.tags.length - 1;
							return (
								<Fragment key={tag.id}>
									<a href={tag.url}>{tag.name}</a>
									{isLast ? '' : ', '}
								</Fragment>
							);
						})}
					</div>
				) : null}
			</div>
		</div>
	) : null;
};

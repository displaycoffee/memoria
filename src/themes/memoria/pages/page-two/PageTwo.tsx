/* React */
import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';

/* Local styles */
import './styles/page-two.scss';

/* Local scripts */
import { navigationUtils } from '../../components/navigation/scripts/navigation-utils';

/* Local components */
import { Context } from '../../context/Context';
import { ChildPageOne } from './content/child-page-one/ChildPageOne';
import { ChildPageTwo } from './content/child-page-two/ChildPageTwo';

/* Get navigation menu */
const navigationList = navigationUtils.get.children(2);

export const PageTwo = () => {
	const location = useLocation();
	const showPageTwo = location.pathname == '/page-two' ? true : false;

	return showPageTwo ? <PageTwoIndex /> : <PageTwoContent />;
};

export const PageTwoIndex = () => {
	return (
		<div className="page-two spacing-reset">
			<h4>Child Pages</h4>
			<ul>
				{navigationList.map((nav) => {
					return (
						<li key={nav.url}>
							<Link to={`${nav.url}`}>{nav.label}</Link>
						</li>
					);
				})}
			</ul>

			<p>this is the second page.</p>

			<div className="row row-auto row-spacing-20 row-wrap">
				<div className="column column-width-33">column 01</div>

				<div className="column column-width-33">column 02</div>

				<div className="column column-width-33">column 03</div>
			</div>

			<p>an element below the row example.</p>
		</div>
	);
};

export const PageTwoContent = () => {
	const context = useContext(Context);
	const location = useLocation();

	// Get last path
	const last = context.utils.getLast(location.pathname, '/');

	// Default content
	const defaultContent = <p>Thank you! But the page is in another castle.</p>;

	return (
		{
			'child-page-one': <ChildPageOne />,
			'child-page-two': <ChildPageTwo />,
		}[last as string] || defaultContent
	);
};

/* Packages */
import { Link } from 'react-router-dom';

/* Scripts */
import { useAppContext } from '../../../../context/scripts/context-hooks';

export const ChildPageTwo = () => {
	const { utils } = useAppContext();

	return (
		<div className="page-child-page-two spacing-reset">
			<h2>Child Page Two</h2>

			<p>
				this is <strong>child page two</strong> of page two.
			</p>

			<p>
				<Link to={utils.getPage()}>Go back to page two</Link>
			</p>
		</div>
	);
};

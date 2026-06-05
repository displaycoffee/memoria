/* Packages */
import { Link } from 'react-router-dom';

/* Scripts */
import { useAppContext } from '../../../../context/scripts/context-hooks';

export const ChildPageOne = () => {
	const { utils } = useAppContext();

	return (
		<div className="page-child-page-one spacing-reset">
			<h2>Child Page One</h2>

			<p>
				this is <strong>child page one</strong> of page two.
			</p>

			<p>
				<Link to={utils.getPage()}>Go back to page two</Link>
			</p>
		</div>
	);
};

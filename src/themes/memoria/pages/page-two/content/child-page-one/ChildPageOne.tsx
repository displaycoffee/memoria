/* React */
import { useContext } from 'react';
import { Link } from 'react-router-dom';

/* Local components */
import { Context } from '../../../../context/Context';

export const ChildPageOne = () => {
	const context = useContext(Context);

	return (
		<div className="page-child-page-one spacing-reset">
			<p>
				this is <strong>child page one</strong> of page two.
			</p>

			<p>
				<Link to={context.utils.getPage()}>Go back to page two</Link>
			</p>
		</div>
	);
};

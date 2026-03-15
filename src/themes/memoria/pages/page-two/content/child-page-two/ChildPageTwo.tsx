/* React */
import { useContext } from 'react';
import { Link } from 'react-router-dom';

/* Local components */
import { Context } from '../../../../context/Context';

export const ChildPageTwo = (props: ObjectPrimitiveProps) => {
	const context = useContext(Context);

	return (
		<div className="page-child-page-two spacing-reset">
			<p>
				this is <strong>child page two</strong> of page two.
			</p>

			<p>
				<Link to={context.utils.getPage()}>Go back to page two</Link>
			</p>
		</div>
	);
};

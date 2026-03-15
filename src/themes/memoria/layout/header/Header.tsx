/* React */
import { Link } from 'react-router-dom';

/* Local styles */
import './styles/header.scss';

export const Header = () => {
	return (
		<header className="header">
			<h1>
				<Link to="/" title="Burmecia - Home">
					Burmecia
				</Link>
			</h1>
		</header>
	);
};

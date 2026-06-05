/* Styles */
import './styles/header.scss';

/* Packages */
import { Link } from 'react-router-dom';

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

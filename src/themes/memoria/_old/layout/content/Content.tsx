/* Styles */
import './styles/content.scss';

/* Components */
import { NavigationRoutes } from '../../components/navigation/Navigation';

export const Content = () => {
	return (
		<div className="content">
			<NavigationRoutes />
		</div>
	);
};

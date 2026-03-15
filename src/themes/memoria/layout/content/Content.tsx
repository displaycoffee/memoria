/* Local styles */
import './styles/content.scss';

/* Local components */
import { NavigationRoutes } from '../../components/navigation/Navigation';

export const Content = () => {
	return (
		<section className="content">
			<NavigationRoutes />
		</section>
	);
};

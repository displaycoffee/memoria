/* Styles */
import './styles/container.scss';

/* Packages */
import { Link, useLocation } from 'react-router-dom';

/* Scripts */
import { useRespond } from '../../../_config/scripts/hooks';
import { useAppContext } from '../../context/scripts/context-hooks';
import { useBodyClass } from './scripts/container-hooks';

/* Components */
import { ErrorBoundary } from '../../components/error-boundary/ErrorBoundary';
import { Navigation } from '../../components/navigation/Navigation';
import { Slideout, SlideoutOverlay } from '../../components/slideout/Slideout';
import { Header } from '../header/Header';
import { Content } from '../content/Content';
import { Sidebar } from '../sidebar/Sidebar';
import { Footer } from '../footer/Footer';
import { Portal } from '../../targets/portal/Portal';

/* Pages that should exclude the sidebar */
const excludeSidebar: string[] = ['/page-two'];

export const Container = () => {
	const { theme, utils } = useAppContext();
	const location = useLocation();
	const isDesktop = useRespond(theme.bps.bp02 as number);
	const sidebar = !excludeSidebar.includes(location.pathname);

	// Set body class using custom hook
	useBodyClass('home');

	// Slideout options
	const slideoutOptions = {
		id: 'menu',
		isDesktop: isDesktop,
		label: 'Menu',
		content: <Navigation disableTransition={true} />,
		closeOnClick: true,
		button: {
			outside: false,
			show: true,
		},
	};

	return (
		<div className="container">
			<ErrorBoundary message={<ContainerError />}>
				<SlideoutOverlay options={slideoutOptions} />

				<Header />

				{isDesktop ? <Navigation /> : <Slideout options={slideoutOptions} />}

				<main className="main">
					<div className="main-layout flex-wrap">
						<Content />

						<Sidebar show={sidebar && isDesktop} />
					</div>
				</main>

				<Footer />

				<button className="pointer unstyled a" type="button" aria-label="Scroll to top button" onClick={(e) => utils.scrollTo(e, '#index')}>
					Scroll to top
				</button>

				<Portal element={'#portal'}>
					<p>
						This is an example of a portal from index.html. It could also be added inside other components to access details of that
						component.
					</p>
				</Portal>
			</ErrorBoundary>
		</div>
	);
};

const ContainerError = () => {
	return (
		<p>
			Something went wrong. <Link to={'/'}>Go back.</Link>
		</p>
	);
};

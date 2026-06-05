/* Styles */
import './styles/index.scss';

/* Packages */
import { BrowserRouter } from 'react-router-dom';

/* Scripts */
import { index } from './scripts';
import { variables } from '../../../_config/scripts/variables';

/* Components */
import { ContextProvider } from '../../context/Context';
import { Container } from '../../layout/container/Container';

/* Index component */
const Index = () => {
	return (
		<BrowserRouter basename={variables.paths.basename}>
			<ContextProvider>
				<Container />
			</ContextProvider>
		</BrowserRouter>
	);
};

/* Create main target entry point */
index.renderTarget('#index', <Index />);

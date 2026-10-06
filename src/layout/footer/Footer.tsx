/* Styles */
import './styles/footer.scss';

/* Components */
import { LinkExternal } from '@/components/blocks/Blocks';

export const Footer = () => {
	const date = new Date().getFullYear();

	return (
		<footer className="footer">
			<p>
				&copy; {date} <LinkExternal href="//display.coffee">displaycoffee</LinkExternal>
			</p>
		</footer>
	);
};

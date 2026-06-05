/* Styles */
import './styles/footer.scss';

export const Footer = () => {
	const date = new Date().getFullYear();

	return (
		<footer className="footer">
			<p>
				&copy; {date}{' '}
				<a href="//display.coffee" target="_blank" rel="noreferrer">
					displaycoffee
				</a>
			</p>
		</footer>
	);
};

/* Local styles */
import './styles/footer.scss';

export const Footer = () => {
	const date = new Date().getFullYear();

	return (
		<footer className="footer">
			<p>
				&copy; {date} <a href="//github.com/displaycoffee">displaycoffee</a>
			</p>
		</footer>
	);
};

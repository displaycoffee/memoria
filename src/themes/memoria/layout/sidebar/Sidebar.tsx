/* Local styles */
import './styles/sidebar.scss';

/* Local scripts */
import { SidebarProps } from './scripts/sidebar-types';

export const Sidebar = (props: SidebarProps) => {
	const { show } = props;

	return show ? (
		<aside className="sidebar">
			<p>this is sidebar content.</p>
		</aside>
	) : null;
};

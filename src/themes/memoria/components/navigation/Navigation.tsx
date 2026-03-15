/* React */
import { Fragment, useContext, useEffect } from 'react';
import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';

/* Local styles */
import './styles/navigation.scss';

/* Local scripts */
import { NavigationListItemProps, NavigationRoutesProps } from './scripts/navigation-types';
import { navigationUtils } from './scripts/navigation-utils';
import { navigationRoutes } from './scripts/navigation-routes';

/* Local components */
import { Context } from '../../context/Context';
import { Dropdown } from '../dropdown/Dropdown';

/* Get navigation menu */
const navigationList = navigationUtils.get.list();

export const Navigation = () => {
	const { pathname } = useLocation();
	const context = useContext(Context);
	const utils = context.utils;
	const navigationLinkClass = 'navigation-link';

	// Scroll to top when navigation link is clicked on
	useEffect(() => {
		utils.scrollTo();
	}, [pathname]);

	return navigationList && navigationList.length != 0 ? (
		<nav className="navigation">
			<ul className="navigation-list unstyled">
				{navigationList.map((nav) => {
					return (
						<Fragment key={nav.id}>
							{nav?.children && nav.children.length !== 0 ? (
								<li className="navigation-list-item">
									<Dropdown buttonLabel={nav.label} buttonLinkClass={navigationLinkClass} buttonUrl={nav.url} closeOnClick={true}>
										<ul className="navigation-list-submenu unstyled">
											{nav.children.map((child) => {
												return <NavigationListItem nav={child} navigationLinkClass={navigationLinkClass} key={child.id} />;
											})}
										</ul>
									</Dropdown>
								</li>
							) : (
								<NavigationListItem navigationLinkClass={navigationLinkClass} nav={nav} />
							)}
						</Fragment>
					);
				})}
			</ul>
		</nav>
	) : null;
};

export const NavigationListItem = (props: NavigationListItemProps) => {
	const { children, nav, navigationLinkClass } = props;
	const navigationActiveClass = `${navigationLinkClass} ${navigationLinkClass}-active`;

	return (
		<li className="navigation-list-item">
			{nav.isRoute ? (
				<NavLink
					to={nav.url}
					title={nav.alt || nav.label}
					className={({ isActive }) => (isActive ? navigationActiveClass : navigationLinkClass)}
				>
					{nav.label}
				</NavLink>
			) : (
				<a href={nav.url} title={nav.alt || nav.label} target="_blank" rel="noreferrer">
					{nav.label}
				</a>
			)}

			{children ? children : null}
		</li>
	);
};

export const NavigationRoutes = () => {
	return navigationRoutes && navigationRoutes.length != 0 ? (
		<Routes>
			{navigationRoutes.map((nav: NavigationRoutesProps) => {
				const navProps = nav?.props ? nav.props : false;

				return (
					<Fragment key={nav.id}>
						{nav?.children && nav.children.length !== 0 ? (
							<>
								<Route path={`${nav.path}/*`} element={<nav.element {...navProps} />} />

								{nav.children.map((child: NavigationRoutesProps) => {
									const childProps = child?.props ? child.props : false;
									return <Route path={child.path} element={<child.element {...childProps} />} key={child.id} />;
								})}
							</>
						) : (
							<Route path={nav.path} element={<nav.element {...navProps} />} />
						)}
					</Fragment>
				);
			})}

			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	) : null;
};

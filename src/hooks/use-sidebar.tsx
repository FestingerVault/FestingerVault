import { Badge } from '@/components/ui/badge';
import useInstalled from '@/hooks/use-is-installed';
import { __ } from '@/lib/i18n';
import {
	ArrowLeft,
	Drum,
	Heart,
	HomeIcon,
	Library,
	List,
	Palette,
	Repeat,
	Settings,
	ShieldCheck,
	ToyBrick
} from 'lucide-react';
import React from 'react';
import useActivation from './use-activation';

type IconProps = React.HTMLAttributes<SVGElement>;

type NavItemBase = {
	label: string;
	icon: React.ComponentType<IconProps>;
	disabled?: boolean;
	useNotice?: React.ComponentType | (() => React.ReactNode);
	as?: 'link' | 'a';
	external?: boolean;
};

type NavItemWithHref = NavItemBase & {
	href: string;
	subMenu?: never;
};

type NavItemWithSubMenu = NavItemBase & {
	href?: never;
	subMenu: {
		label: string;
		href: string;
		icon: React.ComponentType<IconProps>;
		external?: boolean;
		disabled?: boolean;
	}[];
};

export type NavItem = NavItemWithHref | NavItemWithSubMenu;

export type SidebarNavItems = {
	id: string;
	label: string;
	showLabel?: boolean;
	items: NavItem[];
};

const navIds = {
	discover: 'discover',
	library: 'library',
	settings: 'settings'
};
export default function useSidebar() {
	const { updateable } = useInstalled();
	const { activated, active } = useActivation();
	const items: SidebarNavItems[] = [
		{
			id: 'back-dashboard',
			label: __('Back to Dashboard'),
			showLabel: false,
			items: [
				{
					label: __('Back to Dashboard'),
					icon: ArrowLeft,
					href: 'index.php',
					as: 'a'
				}
			]
		},
		{
			id: navIds.discover,
			label: __('Discover'),
			showLabel: true,
			items: [
				{
					label: __('Home'),
					icon: HomeIcon,
					href: '/'
				},
				{
					label: __('Popular Themes'),
					icon: Palette,
					href: '/popular/theme'
				},
				{
					label: __('Popular Plugins'),
					icon: ToyBrick,
					href: '/popular/plugin'
				}
			]
		},
		{
			id: navIds.library,
			label: __('Library'),
			showLabel: true,

			items: [
				{
					label: __('Themes'),
					icon: Palette,
					href: '/item/theme'
				},
				{
					label: __('Plugins'),
					icon: ToyBrick,
					href: '/item/plugin'
				},
				{
					label: __('Template Kits'),
					icon: Drum,
					href: '/item/template-kit'
				},
				{
					label: __('Requests'),
					icon: Library,
					href: '/requests'
				},
				{
					label: __('Collections'),
					icon: Heart,
					href: '/collection',
					disabled: !activated || !active
				},
				{
					label: __('Updates'),
					icon: Repeat,
					disabled: !activated || !active,
					href: '/updates',
					useNotice: () => {
						if (updateable && updateable.length > 0) {
							return (
								<Badge
									variant="success"
									size="sm"
								>
									{updateable.length}
								</Badge>
							);
						}
					}
				},
				{
					label: __('History'),
					icon: List,
					href: '/history',
					disabled: !activated || !active
				}
			]
		},
		{
			id: navIds.settings,
			label: __('Settings'),
			showLabel: true,
			items: [
				{
					label: __('License Activation'),
					icon: ShieldCheck,
					href: '/activation'
				},
				{
					label: __('Settings'),
					icon: Settings,

					href: '/settings'
				}
			]
		}
	];
	return { items };
}

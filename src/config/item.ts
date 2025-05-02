import { __ } from '@/lib/i18n';
import { EnumItemSlug, EnumItemType } from '@/zod/item';
import { z } from 'zod';

type TItemType = {
	slug: z.infer<typeof EnumItemSlug>;
	type: z.infer<typeof EnumItemType>;
	label: string;
	label_singular: string;
	description: string;
};

export const item_types: Array<TItemType> = [
	{
		slug: 'theme',
		type: 'theme',
		label: __('Themes'),
		label_singular: __('Theme'),
		description: __('Tailored Premium Themes')
	},
	{
		slug: 'plugin',
		type: 'plugin',
		label: __('Plugins'),
		label_singular: __('Plugin'),
		description: __('Tailored Premium Plugins')
	},
	{
		slug: 'template-kit',
		type: 'template-kit',
		label: __('Template Kits'),
		label_singular: __('Template Kit'),
		description: __('Template Kits')
	},
	{
		slug: 'request',
		type: 'request',
		label: __('Requests'),
		label_singular: __('Request'),
		description: __('Requests')
	}
];

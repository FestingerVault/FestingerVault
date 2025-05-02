import { __ } from '@/lib/i18n';
import { z } from 'zod';

export const EnumAccessLevel = z.enum(['gold', 'bronze', 'silver']);

export const EnumItemType = z.enum(
	['theme', 'plugin', 'template-kit', 'request'],
	{
		message: __('Unknown Item Type')
	}
);

export const EnumItemSlug = z.enum(
	['theme', 'plugin', 'template-kit', 'request'],
	{
		message: __('Unknown Item Slug')
	}
);

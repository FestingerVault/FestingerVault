import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { __ } from '@/lib/i18n';
import { TPostItem } from '@/types/item';
import { useMemo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import moment from 'moment';

type Props = {
	item: TPostItem;
};
type Row = {
	label: string;
	el: () => React.ReactNode | React.ReactElement;
	enabled?: boolean;
};
export default function ItemDetail({ item }: Props) {
	const items = useMemo<Row[]>(
		() => [
			{
				label: __('Version'),
				el: () => item.version,
				enabled: item.type !== 'request'
			},
			{
				label: __('Slug'),
				el: () => item.slugs[0],
				enabled: item.type !== 'request'
			},
			{ label: __('Status'), el: () => 'Functional' },
			{
				label: __('Updated'),
				el: () => moment.unix(item.updated).format('MMM D, YYYY')
			},
			{
				label: __('Published'),
				el: () => moment.unix(item.created).format('MMM D, YYYY')
			},
			{
				label: __('Author'),
				el: () =>
					item.terms
						.filter((i) => i.taxonomy === 'fv_item_author')
						.map((i) => decodeEntities(i.name))
						.join(', '),
				enabled:
					item.terms.filter((i) => i.taxonomy === 'fv_item_author')
						.length > 0
			},
			{
				label: __('Documentation'),
				el: () =>
					item.terms
						.filter((i) => i.taxonomy === 'fv_documentation')
						.map((i) => decodeEntities(i.name))
						.join(', '),
				enabled:
					item.terms.filter((i) => i.taxonomy === 'fv_documentation')
						.length > 0
			},
			{
				label: __('Gutenberg Optimized'),
				el: () =>
					item.terms
						.filter((i) => i.taxonomy === 'fv_gutenberg_optimized')
						.map((i) => decodeEntities(i.name))
						.join(', '),
				enabled:
					item.terms.filter(
						(i) => i.taxonomy === 'fv_gutenberg_optimized'
					).length > 0
			},
			{
				label: __('High Resolution'),
				el: () =>
					item.terms
						.filter((i) => i.taxonomy === 'fv_high_resolution')
						.map((i) => decodeEntities(i.name))
						.join(', '),
				enabled:
					item.terms.filter(
						(i) => i.taxonomy === 'fv_high_resolution'
					).length > 0
			},
			{
				label: __('Widget Ready'),
				el: () =>
					item.terms
						.filter((i) => i.taxonomy === 'fv_widget_ready')
						.map((i) => decodeEntities(i.name))
						.join(', '),
				enabled:
					item.terms.filter((i) => i.taxonomy === 'fv_widget_ready')
						.length > 0
			},
			{
				label: __('Access'),
				el: () =>
					item.terms
						.filter((i) => i.taxonomy === 'fv_access_level')
						.map((i) => decodeEntities(i.name))
						.join(', '),
				enabled:
					item.terms.filter((i) => i.taxonomy === 'fv_access_level')
						.length > 0
			}
		],
		[item]
	);

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between border-b">
				{__('Details')}
			</CardHeader>
			<CardContent className="space-y-3">
				{items.map(
					({ label, el: Element, enabled }) =>
						enabled !== false && (
							<div
								key={label}
								className="flex flex-col gap-1 text-sm font-light"
							>
								<div className="text-muted-foreground">
									{label}
								</div>
								<div>
									<Element />
								</div>
							</div>
						)
				)}
			</CardContent>
		</Card>
	);
}

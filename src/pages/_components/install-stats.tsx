import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useApiFetch from '@/hooks/use-api-fetch';
import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { TPostItemCollection } from '@/types/item';
import { useMemo } from '@wordpress/element';
import { ClassNameValue } from 'tailwind-merge';
import { StackedBarChart, StackedBarChartDataType } from './stacked-bar-chart';

type Props = {
	className?: ClassNameValue;
};

export default function InstallStats({ className }: Props) {
	const { data } = useApiFetch<TPostItemCollection>(`update/list`, {});
	const themes = useMemo(() => {
		if (data?.data) {
			return data?.data?.filter((item) => item.type === 'theme');
		}
		return [];
	}, [data]);
	const plugins = useMemo(() => {
		if (data?.data) {
			return data?.data?.filter((item) => item.type === 'plugin');
		}
		return [];
	}, [data]);
	const chartData = useMemo<StackedBarChartDataType[]>(
		() => [
			{
				name: 'theme',
				label: __('Themes'),
				value: themes?.length,
				color: 'var(--chart-1)'
			},
			{
				name: 'plugin',
				label: __('Plugins'),
				value: plugins?.length,
				color: 'var(--chart-2)'
			}
		],
		[plugins, themes]
	);
	const total = plugins.length + themes.length;
	return (
		<Card className={cn('aspect-auto justify-between ', className)}>
			<CardHeader className="border-b border-border">
				<h3 className="text-lg">{__('Installed Assets')}</h3>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<div className="text-muted-foreground">{__('Installed')}</div>
				<div className="space-x-2">
					<span className="text-3xl">{total}</span>
					<span className="text-muted-foreground">{__('Items')}</span>
				</div>
				<StackedBarChart data={chartData} />
			</CardContent>
		</Card>
	);
}

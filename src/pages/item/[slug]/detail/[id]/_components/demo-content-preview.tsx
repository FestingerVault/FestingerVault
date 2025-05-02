import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/components/ui/card';
import useApiFetch from '@/hooks/use-api-fetch';
import { __ } from '@/lib/i18n';
import { Link, useParams } from '@/router';
import { TDemoContentCollection, TPostItem } from '@/types/item';
import { DemoContentTable } from './item-demo-contents';

type Props = {
	item: TPostItem;
};

export default function DemoContentPreview({ item }: Props) {
	const params = useParams('/item/:slug/detail/:id/:tab?');
	const { data, isLoading, isFetching } = useApiFetch<TDemoContentCollection>(
		'item/demo-content',
		{
			item_id: params.id
		}
	);
	return (
		<div className="flex flex-col gap-5 sm:gap-7">
			<Card>
				<CardHeader className="border-b p-5 sm:p-7">
					{__('Demo Contents')}
				</CardHeader>
				<CardContent className="p-5 text-sm sm:p-7">
					{data?.data ? (
						<div className="flex flex-col gap-4">
							<DemoContentTable
								item={item}
								data={data?.data.slice(0, 5)}
							/>
						</div>
					) : isLoading || isFetching ? (
						<div className="">{__('Loading...')}</div>
					) : (
						<div className="">{__('No Items Found')}</div>
					)}
				</CardContent>
				<CardFooter className="justify-center border-t border-border text-center">
					<Link
						to="/item/:slug/detail/:id/:tab?"
						params={{ ...params, tab: 'demo-contents' }}
						className="border-b border-dashed border-primary text-sm text-primary"
					>
						{__('View More')}
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}

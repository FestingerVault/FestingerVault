import InstallButton from '@/components/install-button';
import SimpleTable, { SimpleColumnDef } from '@/components/table/simple-table';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/components/ui/card';
import useApiFetch from '@/hooks/use-api-fetch';
import { __ } from '@/lib/i18n';
import { Link, useParams } from '@/router';
import { TPostChangelogCollection, TPostItem, TPostMedia } from '@/types/item';
import { useMemo } from '@wordpress/element';
import moment from 'moment';

type Props = {
	item: TPostItem;
};
export default function ChangelogPreview({ item }: Props) {
	const params = useParams('/item/:slug/detail/:id/:tab?');
	const { data, isLoading, isFetching } =
		useApiFetch<TPostChangelogCollection>('item/changelog', {
			item_id: params.id,
			page: 1
		});
	const columns = useMemo<SimpleColumnDef<TPostMedia>[]>(
		() => [
			{
				id: 'version',
				label: __('Version'),
				className: '',
				render({ row }) {
					return row.version;
				}
			},
			{
				id: 'date',
				label: __('Date'),
				className: 'whitespace-nowrap text-muted-foreground',
				render({ row }) {
					return moment.unix(row.updated).format('D MMM, YYYY');
				}
			},
			{
				id: 'action',
				render({ row }) {
					return (
						<InstallButton
							item={item}
							media={row}
							size="icon"
							variant="outline"
						/>
					);
				}
			}
		],
		[item]
	);
	return (
		<div className="flex flex-col gap-5 sm:gap-7">
			<Card>
				<CardHeader className="border-b p-5 sm:p-7">
					{__('Changelog')}
				</CardHeader>
				<CardContent className="p-5 text-sm sm:p-7">
					{data?.data ? (
						<div className="flex flex-col gap-4">
							<SimpleTable
								columns={columns}
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
						params={{ ...params, tab: 'changelog' }}
						className="border-b border-dashed border-primary text-sm text-primary"
					>
						{__('Changelog')}
					</Link>
				</CardFooter>
			</Card>
		</div>
	);
}

import { AppPageShell } from '@/components/body/page-shell';
import Paging from '@/components/paging';
import useApiFetch from '@/hooks/use-api-fetch';
import { __ } from '@/lib/i18n';
import PostGridItem from '@/pages/item/[slug]/-[page]/_components/PostGridItem';
import { useParams } from '@/router';
import { CollectionResponse } from '@/types/api';
import {
	BookmarkCollectionDetailSchema,
	BookmarkCollectionItemType,
	BookmarkCollectionType
} from '@/types/bookmark';
import { decodeEntities } from '@wordpress/html-entities';
import { sprintf } from '@wordpress/i18n';

export default function CollectionDetail() {
	const { cid, page = 1 } = useParams('/collection/:cid/:page?');
	const { data: collection } = useApiFetch<
		BookmarkCollectionType,
		BookmarkCollectionDetailSchema
	>('collection/detail', {
		id: Number(cid)
	});
	const {
		data: items,
		isLoading,
		isFetching
	} = useApiFetch<
		CollectionResponse<BookmarkCollectionItemType>,
		BookmarkCollectionDetailSchema
	>('collection/items', {
		id: Number(cid),
		page: Number(page)
	});

	return (
		<AppPageShell
			title={collection && decodeEntities(collection.title)}
			description={collection && decodeEntities(collection.summary)}
			isLoading={isLoading}
			isFetching={isFetching}
			breadcrump={[
				{
					label: __('Collection'),
					href: '/collection'
				},
				{
					label: decodeEntities(collection?.title),
					href: `/collection/${cid}`
				},
				{
					label: sprintf(__('Page %d'), Number(page))
				}
			]}
		>
			{items && items.data.length > 0 ? (
				<>
					<div className="grid gap-5 sm:grid-cols-3">
						{items.data.map((item) => (
							<PostGridItem
								item={item.post}
								key={item.id}
							/>
						))}
					</div>
					{items.meta && (
						<Paging
							totalItems={items.meta?.total}
							currentPage={Number(page)}
							totalPages={items.meta?.last_page}
							urlGenerator={(_page: number) =>
								`/collection/${cid}/${_page}`
							}
						/>
					)}
				</>
			) : (
				<div className="text-sm italic text-muted-foreground">
					{__('No Items found in collection')}
				</div>
			)}
		</AppPageShell>
	);
}

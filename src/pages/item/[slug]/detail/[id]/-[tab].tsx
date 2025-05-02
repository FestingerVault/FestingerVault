import { AppPageShell } from '@/components/body/page-shell';
import useActivation from '@/hooks/use-activation';
import useApiFetch from '@/hooks/use-api-fetch';
import { __ } from '@/lib/i18n';
import { SlugToItemType } from '@/lib/type-to-slug';
import { useParams } from '@/router';
import { TPostItem } from '@/types/item';
import { useMemo } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { sprintf } from '@wordpress/i18n';
import {
	HelpingHand,
	History,
	MessageSquare,
	MessageSquareDiff,
	Package,
	Text
} from 'lucide-react';
import ItemDetailHeader, {
	ItemDetailHeaderSkeleton
} from './_components/detail-header';
import DetailTabContent from './_components/detail-tab-content';
import DetailTabHeaders from './_components/detail-tab-headers';
import ItemChangeLog from './_components/item-changelog';
import ItemComments from './_components/item-comments';
import ItemDemoContents from './_components/item-demo-contents';
import ItemDescription from './_components/item-description';
import ItemRequestUpdate from './_components/item-request-update';
import ItemSidebar from './_components/item-sidebar';
type IconProps = React.HTMLAttributes<SVGElement>;

type TabRecordType = {
	id: string;
	label: string;
	icon: React.ComponentType<IconProps>;
	el?: React.ComponentType;
	enabled?: boolean | undefined;
	external?: string;
};
export type DetailTabType = TabRecordType[];
export default function Component() {
	const params = useParams('/item/:slug/detail/:id/:tab?');
	const { activated, active } = useActivation();
	const { data, isError, isLoading, isFetching } = useApiFetch<TPostItem>(
		'item/detail',
		{
			item_id: params.id
		}
	);
	const item_type = SlugToItemType(params.slug);
	const tabs = useMemo<DetailTabType>(() => {
		if (!data) {
			return [];
		}
		return [
			{
				id: 'description',
				label: __('Description'),
				icon: Text,
				el: () => <ItemDescription item={data} />
			},
			{
				id: 'changelog',
				label: __('Changelog'),
				icon: History,
				el: () => <ItemChangeLog item={data} />,
				enabled: data.media_count ? data.media_count > 0 : false
			},
			{
				id: 'demo-contents',
				label: sprintf(
					__('Demo Contents [%d]'),
					data.additional_content_count
				),
				icon: Package,
				el: () => <ItemDemoContents item={data} />,
				enabled: data.additional_content_count
					? data.additional_content_count > 0
					: false
			},

			{
				id: 'comments',
				label: __('Comments'),
				icon: MessageSquare,
				el: () => <ItemComments />,
				enabled: data.topic_id ? data.topic_id > 0 : false
			},
			{
				id: 'request-update',
				label: __('Request Update'),
				icon: MessageSquareDiff,
				el: () => <ItemRequestUpdate item={data} />,
				enabled: activated && active && data.type != 'request'
			},
			{
				id: 'support',
				label: __('Support'),
				icon: HelpingHand,
				external: data.support_url ?? '', // TODO: add forum support to engine
				enabled: data.support_url
					? data?.support_url?.length > 0
					: false
			}
		].filter((item) => item.enabled ?? true);
	}, [activated, active, data]);
	return (
		<AppPageShell
			title={data?.title ?? __('Item Detail')}
			description=""
			preloader={<ItemDetailHeaderSkeleton />}
			breadcrump={[
				{
					label: item_type?.label,
					href: `/item/${params.slug}`
				},
				{
					label: decodeEntities(data?.title ?? '')
				}
			]}
			{...{ isError, isFetching, isLoading }}
		>
			{data && (
				<>
					<ItemDetailHeader item={data} />
					<div className="w-full">
						<DetailTabHeaders
							item={data}
							tabs={tabs}
						/>
					</div>
					<div className="flex w-full flex-col gap-5 sm:flex-row sm:gap-7">
						<div className="sm:flex-1">
							<DetailTabContent
								item={data}
								tabs={tabs}
							/>
						</div>
						<div className="sm:w-80">
							<ItemSidebar item={data} />
						</div>
					</div>
				</>
			)}
		</AppPageShell>
	);
}

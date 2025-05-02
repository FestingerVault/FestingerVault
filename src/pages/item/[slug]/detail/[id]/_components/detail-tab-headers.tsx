import BulkButton from '@/components/bulk-button';
import CollectionButton from '@/components/collection-button';
import InstallButton from '@/components/install-button';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Link, useParams } from '@/router';
import { TPostItem } from '@/types/item';
import { Slot } from '@radix-ui/react-slot';
import { ExternalLink, Heart } from 'lucide-react';
import { DetailTabType } from '../-[tab]';

type Props = {
	item: TPostItem;
	tabs: DetailTabType;
};
export default function DetailTabHeaders({ item, tabs }: Props) {
	const params = useParams('/item/:slug/detail/:id/:tab?');
	const active =
		tabs.find((tab) => tab.id === params.tab)?.id ?? 'description';
	return (
		<div className="flex flex-col justify-between border-b-2 border-b-card sm:flex-row-reverse sm:items-center">
			<div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
				<div className="flex flex-col gap-4 sm:flex-row">
					<InstallButton item={item} />
					{(item.preview ?? item.product_url) ? (
						<Button
							asChild
							className="flex gap-2"
							variant="outline"
							size="default"
						>
							<a
								href={item.preview ?? item.product_url}
								target="_blank"
								rel="noreferrer noopener"
							>
								<span>{__('Preview')}</span>
								<ExternalLink size={16} />
							</a>
						</Button>
					) : null}
					{siteConfig.provider && (
						<Button
							asChild
							className="flex gap-2"
							variant="outline"
							size="default"
						>
							<a
								href={`${siteConfig.provider}?p=${item.id}`}
								target="_blank"
								rel="noreferrer"
							>
								<span>{__('Product Page')}</span>
								<ExternalLink size={16} />
							</a>
						</Button>
					)}
				</div>
				{item.type !== 'request' ? (
					<div className="flex gap-4">
						<CollectionButton item={item}>
							<Button
								size="icon"
								variant="outline"
							>
								<Heart size={16} />
							</Button>
						</CollectionButton>
						<BulkButton item={item} />
					</div>
				) : null}
			</div>
			<div className="flex flex-row">
				{tabs.map(({ id, label, external, icon: Icon }) => (
					<Slot
						key={id}
						className={cn(
							'rounded-none border-b-2 border-transparent px-6 py-4 text-sm transition-colors hover:border-b-primary',
							id === active && 'border-b-primary'
						)}
					>
						{external ? (
							<a
								href={external}
								target="_blank"
								rel="noreferrer"
							>
								{__('Support')}
							</a>
						) : (
							<Link
								to="/item/:slug/detail/:id/:tab?"
								params={{
									...params,
									tab: id
								}}
							>
								<span className="hidden lg:block">{label}</span>
								<span className="lg:hidden">
									<Icon />
								</span>
							</Link>
						)}
					</Slot>
				))}
			</div>
		</div>
	);
}

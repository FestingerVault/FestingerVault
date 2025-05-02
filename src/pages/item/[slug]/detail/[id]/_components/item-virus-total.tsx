import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { __ } from '@/lib/i18n';
import { TPostItem } from '@/types/item';
import { sprintf } from '@wordpress/i18n';
import { ShieldCheck, ShieldEllipsis } from 'lucide-react';
import moment from 'moment';
type Props = {
	item: TPostItem;
};
export default function VirusTotalScan({ item }: Props) {
	if (item.type === 'request') {
		return null;
	}
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between border-b">
				<span>{__('Virus Total')}</span>
				{item.virus_total && (
					<a
						href={`https://www.virustotal.com/gui/file/${item.virus_total.hash}`}
						target="_blank"
						className="border-b border-dashed border-primary text-sm text-primary"
						rel="noreferrer"
					>
						{__('View Detail')}
					</a>
				)}
			</CardHeader>
			<CardContent className="p-4 sm:p-5">
				{item.virus_total ? (
					<div className="flex flex-row gap-2">
						<div>
							<ShieldCheck
								size={38}
								className="text-green-600"
							/>
						</div>
						<div className="flex-1">
							<div>{item.virus_total.filename}</div>
							<div className="space-x-3 text-xs text-muted-foreground">
								<span>
									{sprintf(
										__('%d threats'),
										item.virus_total.stats.malicious
									)}
								</span>
								<span>
									{moment
										.unix(item.virus_total.updated)
										.format('D MMM YYYY, h:mm a')}
								</span>
							</div>
						</div>
					</div>
				) : (
					<div className="flex animate-pulse flex-row items-center gap-2">
						<div>
							<ShieldEllipsis
								size={38}
								className="text-purple-400"
							/>
						</div>
						<div className="flex-1">
							<div className="">{__('Scanning...')}</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

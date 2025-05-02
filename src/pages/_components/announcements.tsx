import { Card, CardContent, CardHeader } from '@/components/ui/card';
import useApiFetch from '@/hooks/use-api-fetch';
import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { AnnouncementItemType } from '@/types/announcement';
import { sprintf } from '@wordpress/i18n';
import moment from 'moment';
import { ClassNameValue } from 'tailwind-merge';

type Props = {
	className?: ClassNameValue;
};
export default function Announcements({ className }: Props) {
	const { data: announcements } = useApiFetch<AnnouncementItemType[]>(
		'announcement/latest'
	);
	return (
		<Card className={cn('flex flex-col ', className)}>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 border-b">
				<h3 className="text-lg">{__('Announcements')}</h3>
				<a
					href="https://meta.festingervault.com/c/announcements/11"
					target="_blank"
					className="border-b border-dashed border-primary text-sm text-primary"
					rel="noreferrer"
				>
					{__('View All')}
				</a>
			</CardHeader>
			<CardContent>
				{announcements && announcements?.length > 0 ? (
					<div className="flex flex-col divide-y">
						{announcements?.map((item) => (
							<div
								key={item.id}
								className="flex flex-col justify-between gap-2 py-4 text-sm first:pt-0 last:pb-0 lg:flex-row"
							>
								<div>
									<a
										href={`https://meta.festingervault.com/t/${item.slug}/${item.id}`}
										target="_blank"
										className="transition-colors hover:text-muted-foreground"
										rel="noreferrer"
									>
										{item.title}
									</a>
								</div>
								<div className="whitespace-nowrap text-muted-foreground">
									{sprintf(
										__('Updated %s'),
										moment(item.last_posted_at).fromNow()
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center text-sm italic text-muted-foreground">
						{__('No new announcements')}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

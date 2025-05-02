import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/components/ui/card';
import useInstalled from '@/hooks/use-is-installed';
import { __ } from '@/lib/i18n';
import { TypeToSlug } from '@/lib/type-to-slug';
import { cn } from '@/lib/utils';
import { Link } from '@/router';
import { sprintf } from '@wordpress/i18n';
import moment from 'moment';
import { ClassNameValue } from 'tailwind-merge';

type Props = {
	className?: ClassNameValue;
};
export default function AvailableUpdates({ className }: Props) {
	const { updateable } = useInstalled();
	return (
		<Card className={cn('flex flex-col justify-between', className)}>
			<CardHeader className="border-b">
				<h3 className="text-lg">{__('Item Updates')}</h3>
			</CardHeader>
			<CardContent className="px-0">
				{updateable && updateable?.length > 0 ? (
					<div className="divide-y text-sm">
						{updateable.slice(0, 4).map((item) => (
							<div
								key={item.id}
								className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0"
							>
								<div>
									<Link
										to="/item/:slug/detail/:id/:tab?"
										params={{
											id: item.id,
											slug: TypeToSlug(item.type)
										}}
									>
										{item.title}
									</Link>
								</div>
								<div className="flex flex-row justify-between gap-4">
									<div className="text-muted-foreground">
										{sprintf(
											__('Available: %s'),
											item.version
										)}
									</div>
									<div className="text-muted-foreground">
										{sprintf(
											__('Installed: %s'),
											item.installed_version
										)}
									</div>
									<div className="text-muted-foreground">
										{moment.unix(item.updated).fromNow()}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center text-sm italic text-muted-foreground">
						{__('No Update Found')}
					</div>
				)}
			</CardContent>
			<CardFooter className="justify-center border-t border-border text-center">
				<Link
					to="/updates"
					className="border-b border-dashed border-primary text-sm text-primary"
				>
					{__('View All Updates')}
				</Link>
			</CardFooter>
		</Card>
	);
}

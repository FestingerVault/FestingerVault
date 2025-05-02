import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from '@/components/ui/card';
import useApiFetch from '@/hooks/use-api-fetch';
import { __ } from '@/lib/i18n';
import renderHtml from '@/lib/render-html';
import { useParams } from '@/router';
import { TCommentResponse } from '@/types/item';
import moment from 'moment';

export default function ItemComments() {
	const params = useParams('/item/:slug/detail/:id/:tab?');
	const { data, isLoading, isFetching } = useApiFetch<TCommentResponse>(
		'item/comments',
		{
			item_id: params.id
		}
	);
	return (
		<div className="flex flex-col gap-5 sm:gap-7">
			<Card>
				<CardHeader className="border-b p-5 sm:p-7">
					{__('Comments')}
				</CardHeader>
				<CardContent className="item-description p-5 text-sm leading-relaxed sm:p-7">
					{data ? (
						<div className="flex flex-col gap-4 divide-y">
							{data?.comments?.map((comment) => (
								<div
									key={comment.id}
									className="flex flex-col gap-3 pt-4 first:pt-0"
								>
									<div className="flex items-center gap-2">
										<div className="text-primary-background flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-foreground">
											<img
												src={comment.avatar}
												className="rounded-full "
											/>
										</div>
										<div className="flex flex-col">
											<div className="text-sm font-semibold">
												{comment.display_name}
											</div>
											<div className="text-xs text-muted-foreground">
												{moment
													.unix(comment.created_at)
													.format(
														'MMM DD, YYYY HH:mm'
													)}
											</div>
										</div>
									</div>
									<div className="text-sm">
										{renderHtml(comment.comment)}
									</div>
								</div>
							))}
						</div>
					) : isLoading || isFetching ? (
						<div className="">{__('Loading...')}</div>
					) : (
						<div className="">{__('No Items Found')}</div>
					)}
				</CardContent>
				{data && (
					<CardFooter className="justify-center border-t border-border text-center">
						<a
							href={data?.url}
							target="_blank"
							rel="noreferrer"
							className="border-b border-dashed border-primary text-sm text-primary"
						>
							{__('View more comments')}
						</a>
					</CardFooter>
				)}
			</Card>
		</div>
	);
}

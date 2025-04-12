import AddCollectionButton from '@/components/add-collection-dialog';
import { AppPageShell } from '@/components/body/page-shell';
import { Button } from '@/components/ui/button';
import useActivation from '@/hooks/use-activation';
import useApiFetch from '@/hooks/use-api-fetch';
import { __ } from '@/lib/i18n';
import { useNavigate } from '@/router';
import { CollectionResponse } from '@/types/api';
import { BookmarkCollectionType } from '@/types/bookmark';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import Collection from './_components/collection';

export default function Component() {
	const navigate = useNavigate();
	const { active, activated } = useActivation();
	const { data, isLoading, isFetching } =
		useApiFetch<CollectionResponse<BookmarkCollectionType>>(
			'collection/list'
		);
	useEffect(() => {
		if (!active || !activated) {
			navigate('/');
		}
	}, [activated, active, navigate]);
	return (
		<AppPageShell
			title={__('Collections')}
			isLoading={isLoading}
			isFetching={isFetching}
			breadcrump={[
				{
					label: __('Collection')
				}
			]}
		>
			<div>
				<AddCollectionButton>
					<Button className="flex gap-2">
						<Plus size={16} />{' '}
						<span>{__('Add New Collection')}</span>
					</Button>
				</AddCollectionButton>
			</div>
			{data && data.data.length > 0 ? (
				<div className="grid gap-5 sm:grid-cols-3">
					{data.data.map((collection) => (
						<Collection
							collection={collection}
							key={collection.id}
						/>
					))}
				</div>
			) : (
				<div className="text-sm italic text-muted-foreground">
					{__('No Collections Found')}
				</div>
			)}
		</AppPageShell>
	);
}

import { AppPageShell } from '@/components/body/page-shell';
import useActivation from '@/hooks/use-activation';
import useApiFetch from '@/hooks/use-api-fetch';
import { __ } from '@/lib/i18n';
import { useNavigate, useParams } from '@/router';
import { HistoryCollectionType } from '@/types/history';
import { useEffect } from 'react';
import HistoryItems from './_components/history-items';

export default function Component() {
	const { page } = useParams('/history/:page?');
	const navigate = useNavigate();
	const { active, activated } = useActivation();

	useEffect(() => {
		if (!active || !activated) {
			navigate('/');
		}
	}, [activated, active, navigate]);
	const { data, isLoading } = useApiFetch<HistoryCollectionType>(
		'history/list',
		{
			page: Number(page ?? 1)
		}
	);
	return (
		<AppPageShell
			title={__('History')}
			isLoading={isLoading}
		>
			<HistoryItems data={data} />
		</AppPageShell>
	);
}

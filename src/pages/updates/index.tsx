import { AppPageShell } from '@/components/body/page-shell';
import useInstalled from '@/hooks/use-is-installed';
import { __ } from '@/lib/i18n';
import UpdatesTable, {
	UpdatesTableSkeleton
} from './_components/updates-table';
import useActivation from '@/hooks/use-activation';
import { useEffect } from 'react';
import { useNavigate } from '@/router';
export default function Component() {
	const { list, isLoading } = useInstalled();
	const navigate=useNavigate();
	const {active, activated}=useActivation();
	useEffect(()=>{
		if(!active || !activated){
			navigate("/");
		}
	},[activated, active, navigate]);
	return (
		<AppPageShell
			title={__('Updates')}
			isLoading={isLoading}
			preloader={<UpdatesTableSkeleton />}
			breadcrump={[
				{
					label: __('Updates')
				}
			]}
		>
			{list && <UpdatesTable data={list} />}
		</AppPageShell>
	);
}

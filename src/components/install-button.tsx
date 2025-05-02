import { Button, ButtonProps } from '@/components/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger
} from '@/components/ui/drawer';
import useActivation from '@/hooks/use-activation';
import useInstall from '@/hooks/use-install';
import { __, _x } from '@/lib/i18n';
import { TypeToSlug } from '@/lib/type-to-slug';
import { useNavigate, useParams } from '@/router';
import { TPostItem, TPostMedia } from '@/types/item';
import { useState } from '@wordpress/element';
import { decodeEntities } from '@wordpress/html-entities';
import { sprintf } from '@wordpress/i18n';
import {
	CloudDownload,
	Download,
	DownloadCloud,
	Loader,
	RefreshCw
} from 'lucide-react';

type Props = {
	item: TPostItem;
	media?: TPostMedia;
} & ButtonProps;

export default function InstallButton({ item, media, size, variant }: Props) {
	const navigate = useNavigate();
	const {
		data: activation,
		activated,
		active,
		can_download,
		can_install
	} = useActivation();
	const [isPending, setIsPending] = useState<boolean>(false);
	const {
		isInstalled,
		isNewerVersion,
		isInstallable,
		isRollBack,
		installItem,
		downloadItem
	} = useInstall();
	const installed = isInstalled(item);
	const is_new = isNewerVersion(item);
	const installable = isInstallable(item);
	const is_rollback = isRollBack(item, media);
	const { tab } = useParams('/item/:slug/detail/:id/:tab?');
	function install(is_download?: boolean) {
		setIsPending(true);
		if (is_download) {
			downloadItem(item, media)
				.then(() => setIsPending(false))
				.catch(() => setIsPending(false));
		} else {
			installItem(item, media)
				.then(() => setIsPending(false))
				.catch(() => setIsPending(false));
		}
	}
	if (item.type === 'request') {
		return null;
	}
	return (
		can_install &&
		can_download && (
			<Drawer>
				<DrawerTrigger asChild>
					<Button
						variant={variant}
						size={size}
						className="flex items-center gap-2"
						disabled={isPending || !activated || !active}
					>
						{isPending ? (
							<Loader className="h-4 w-4 animate-spin" />
						) : (
							<CloudDownload width={16} />
						)}
						{size != 'icon' && (
							<span>
								{installable
									? is_rollback
										? __('Roll-Back')
										: installed
											? is_new
												? __('Update')
												: __('Re-Install')
											: __('Install')
									: __('Download')}
							</span>
						)}
					</Button>
				</DrawerTrigger>
				<DrawerContent>
					<div className="mx-auto w-full max-w-sm">
						<DrawerHeader className="text-center">
							<DrawerTitle className="text-center leading-normal">
								{decodeEntities(item.title)}
							</DrawerTitle>
							<DrawerDescription
								className="flex flex-col gap-2 text-center"
								asChild
							>
								<div>
									<div>
										{installable
											? is_rollback
												? sprintf(
														__(
															'Roll-back to version from %s to %s'
														),
														installed?.installed_version,
														media?.version
													)
												: installed
													? is_new
														? sprintf(
																__(
																	'Update version from %s to %s'
																),
																installed.installed_version,
																installed.version
															)
														: sprintf(
																__(
																	'Re-install version %s'
																),
																media
																	? media.version
																	: installed.version
															)
													: sprintf(
															__(
																'Install version %s'
															),
															media
																? media.version
																: item.version
														)
											: sprintf(
													__('Download version %s'),
													media
														? media.version
														: item.version
												)}
									</div>
									<div>
										{sprintf(
											__(
												'%d download credit would be consumed from your account.'
											),
											item.owned ? 0 : 1
										)}
									</div>
									<div className="flex flex-row items-center justify-center divide-x whitespace-nowrap">
										<div className="px-4">
											{sprintf(
												_x(
													'Daily Limit: %s',
													'Plan Daily Limit'
												),
												activation?.today_limit?.toLocaleString()
											)}
										</div>
										<div className="px-4">
											{sprintf(
												_x(
													'Used Limit: %s',
													'Plan Used Limit (today)'
												),
												activation?.today_limit_used?.toLocaleString()
											)}
										</div>
										{activation?.plan_type ===
											'onetime' && (
											<div className="px-4 ">
												{sprintf(
													_x(
														'Total Limit: %s',
														'Plan total available limit (applicable to onetime plans)'
													),
													activation?.total_limit?.toLocaleString()
												)}
											</div>
										)}
									</div>
								</div>
							</DrawerDescription>
						</DrawerHeader>
						<DrawerFooter>
							<div className="flex flex-col justify-center gap-4 sm:flex-row">
								{installable && (
									<DrawerClose asChild>
										<Button
											onClick={() => install(false)}
											disabled={!can_install}
											variant="default"
											className="gap-2"
										>
											<DownloadCloud size={16} />
											<span>
												{is_rollback
													? __('Roll-Back')
													: installed
														? is_new
															? __('Update')
															: __('Re-Install')
														: __('Install')}
											</span>
										</Button>
									</DrawerClose>
								)}
								<DrawerClose asChild>
									<Button
										onClick={() => install(true)}
										disabled={!can_download}
										variant="outline"
										className="gap-2"
									>
										<Download size={16} />
										<span>{__('Download')}</span>
									</Button>
								</DrawerClose>
								{tab !== 'changelog' &&
									installable &&
									can_install && (
										<DrawerClose asChild>
											<Button
												onClick={() =>
													navigate(
														'/item/:slug/detail/:id/:tab?',
														{
															params: {
																slug: TypeToSlug(
																	item.type
																),
																id: String(
																	item.id
																),
																tab: 'changelog'
															}
														}
													)
												}
												variant="outline"
												className="gap-2"
											>
												<RefreshCw size={16} />
												<span>{__('Roll-Back')}</span>
											</Button>
										</DrawerClose>
									)}
								<DrawerClose asChild>
									<Button variant="outline">
										{__('Cancel')}
									</Button>
								</DrawerClose>
							</div>
						</DrawerFooter>
					</div>
				</DrawerContent>
			</Drawer>
		)
	);
}

import { __ } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';
import { Fragment, useEffect, type ElementType } from 'react';
import { Link } from 'react-router-dom';
import BulkAction from '../bulk-action';
import DownloadManager from '../download-manager';
import LanguageSelector from '../language-select';
import ModeToggle from '../mode-toggle';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '../ui/breadcrumb';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import Notices from './notices';
type BreadCrumbType = {
	label: string;
	href?: string;
};
type Props = {
	children: React.ReactNode;
	as?: ElementType;
	title: string;
	description?: string;
	isFetching?: boolean;
	isLoading?: boolean;
	isError?: boolean;
	preloader?: JSX.Element;
	error?: JSX.Element;
	breadcrump?: BreadCrumbType[];
};

export function AppPageShell({
	children,
	as,
	title,
	description,
	isFetching = false,
	isLoading = false,
	isError = false,
	preloader: PreloaderComponent,
	error: ErrorComponent,
	breadcrump
}: Props) {
	const Container = as ?? 'main';
	if (!PreloaderComponent) {
		PreloaderComponent = (
			<div className="space-y-2">
				<Skeleton className="h-4 w-[250px]" />
				<Skeleton className="h-4 w-[200px]" />
			</div>
		);
	}
	if (!ErrorComponent) {
		ErrorComponent = (
			<Card>
				<CardContent className="p-5 text-center text-muted-foreground sm:p-7">
					{__('Invalid Request')}
				</CardContent>
			</Card>
		);
	}
	function Out() {
		return isLoading ? (
			PreloaderComponent
		) : isError ? (
			ErrorComponent
		) : (
			<>{children}</>
		);
	}
	return (
		<div className="w-full space-y-8">
			<PageHeader
				title={title}
				description={description}
			/>
			<Container
				className={cn([
					'relative flex flex-col gap-5 pb-8 sm:gap-7',
					(isFetching || isLoading) && 'blur-sm'
				])}
			>
				{breadcrump && (
					<div>
						<Breadcrumb>
							<BreadcrumbList>
								{[
									{
										label: (
											<span className="flex flex-row items-center gap-2">
												<Home size={16} /> {__('Home')}
											</span>
										),
										href: '/'
									},
									...breadcrump
								].map((item, index) => (
									<Fragment key={index}>
										{index > 0 && <BreadcrumbSeparator />}
										<BreadcrumbItem>
											{item.href ? (
												<BreadcrumbLink asChild>
													<Link to={item.href}>
														{item.label}
													</Link>
												</BreadcrumbLink>
											) : (
												<BreadcrumbPage>
													{item.label}
												</BreadcrumbPage>
											)}
										</BreadcrumbItem>
									</Fragment>
								))}
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				)}
				<Notices />
				<Out />
				{(isFetching || isLoading) && (
					<div className="absolute left-0 top-0 h-full w-full cursor-progress"></div>
				)}
			</Container>
		</div>
	);
}

type PageHeaderProps = {
	title: string;
	description?: string;
};

function PageHeader({ title, description }: PageHeaderProps) {
	useEffect(() => {
		document.title = title;
	}, [title]);
	return (
		<header className="flex flex-col items-start gap-4 border-b border-border py-6  sm:flex-row-reverse">
			<div className="hidden lg:flex lg:flex-row lg:gap-2">
				<ModeToggle />
				<BulkAction />
				<DownloadManager />
				{<LanguageSelector />}
			</div>
			<div className="flex flex-1 flex-col gap-1">
				<h1 className="font-heading text-2xl font-bold">{title}</h1>
				{description && (
					<p className="max-w-xl text-muted-foreground">
						{description}
					</p>
				)}
			</div>{' '}
		</header>
	);
}

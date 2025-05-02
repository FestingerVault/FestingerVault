import { __ } from '@/lib/i18n';
import placeholder from '@/lib/placeholder';
import { Link } from '@/router';
import { TPostItem } from '@/types/item';
import { decodeEntities } from '@wordpress/html-entities';
import { useEffect, useRef, useState } from 'react';
import { Hits, useSearchBox } from 'react-instantsearch';
import { Input } from './ui/input';

function Hit({ hit }: { hit: TPostItem }) {
	return (
		<div className="relative flex flex-col items-center gap-2 transition-colors hover:opacity-70 sm:flex-row">
			<div className="flex-shrink">
				<img
					src={hit.image ?? placeholder(hit.title)}
					className="aspect-video w-full object-cover sm:w-24"
				/>
			</div>

			<div className="flex flex-1 flex-col">
				<div>{hit.title}</div>
				{hit.is_forked ? (
					<div className="space-x-1 text-sm text-muted-foreground">
						<span>{__('Forked From')}</span>
						<a
							href={hit.product_url}
							className="text-foreground"
							target="_blank"
							rel="noreferrer"
						>
							{decodeEntities(hit.original_title)}
						</a>
					</div>
				) : null}
			</div>
			<Link
				to={'/item/:slug/detail/:id/:tab?'}
				params={{
					id: hit.id,
					slug: hit.type
				}}
				className="absolute left-0 top-0 h-full w-full"
			></Link>
		</div>
	);
}
export default function TypeSenseSearch() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { query, refine, isSearchStalled, clear, ...rest } = useSearchBox();
	const [showResults, setShowResults] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	// Hide results on outside click
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setShowResults(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);
	return (
		<div
			className="relative"
			ref={wrapperRef}
		>
			<Input
				type="text"
				onChange={(event) => {
					refine(event.currentTarget.value);
					setShowResults(event.currentTarget.value.length > 0);
				}}
				onClick={(event) => {
					setShowResults(event.currentTarget.value.length > 0);
				}}
				placeholder="Search themes and plugins"
				{...rest}
			/>
			{showResults && query.length > 0 ? (
				<Hits
					hitComponent={Hit}
					className="absolute left-0 top-[102%] z-[999] h-auto  w-full rounded-sm border bg-card p-4 text-card-foreground shadow"
				/>
			) : null}
		</div>
	);
}

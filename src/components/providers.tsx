import { BulkProvider } from '@/hooks/use-bulk';
import { DownloadProvider } from '@/hooks/use-download';
import { NoticeProvider } from '@/hooks/use-notice';
import { ThemeProvider } from '@/hooks/use-theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import { InstantSearch } from 'react-instantsearch';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { Toaster } from './ui/sonner';

type ProvidersProps = {
	children: React.ReactNode;
};
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			staleTime: 5 * 60 * 1000 // 5 minutes
		}
	}
});
const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
	server: {
		apiKey: 'CuSXl29yHDDDBHzJkG1DoqogD007uW0L',
		nodes: [
			{
				host: 'ydip76a9fqj1v3o2p-1.a1.typesense.net',
				port: 443,
				path: '',
				protocol: 'https',

			}
		],

		cacheSearchResultsForSeconds: 2 * 60 // Cache search results from server. Defaults to 2 minutes. Set to 0 to disable caching.
	},
	// The following parameters are directly passed to Typesense's search API endpoint.
	//  So you can pass any parameters supported by the search endpoint below.
	//  query_by is required.
	additionalSearchParameters: {
		query_by: 'original_title'
	}
});
const searchClient = typesenseInstantsearchAdapter.searchClient;
export function Providers({ children }: ProvidersProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<InstantSearch
				indexName="engine/items"
				searchClient={searchClient}
			>
				<NoticeProvider>
					<DownloadProvider>
						<BulkProvider>
							<ThemeProvider
								defaultTheme="system"
								storageKey="vault-theme"
							>
								{children}
								<Toaster
									richColors
									position="bottom-left"
									expand
									pauseWhenPageIsHidden={true}
								/>
								<ReactQueryDevtools initialIsOpen={false} />
							</ThemeProvider>
						</BulkProvider>
					</DownloadProvider>
				</NoticeProvider>
			</InstantSearch>
		</QueryClientProvider>
	);
}

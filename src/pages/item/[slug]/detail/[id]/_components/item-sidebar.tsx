import { __ } from '@/lib/i18n';
import { useParams } from '@/router';
import { TPostItem } from '@/types/item';
import ChangelogPreview from './changelog-preview';
import ItemDetail from './item-detail';
import ItemDisclaimer from './item-disclaimer';
import ItemTerms from './item-terms';
import VirusTotalScan from './item-virus-total';

type Props = {
	item: TPostItem;
};
export default function ItemSidebar({ item }: Props) {
	const params = useParams('/item/:slug/detail/:id/:tab?');
	return (
		<div className="flex flex-col gap-5 sm:gap-7">
			<VirusTotalScan item={item} />
			<ItemDisclaimer item={item} />
			<ItemDetail item={item} />
			{item.media_count &&
			item.media_count > 0 &&
			params.tab != 'changelog' ? (
				<ChangelogPreview item={item} />
			) : null}
			<ItemTerms
				title={__('Tags')}
				terms={item.terms?.filter((i) => i.taxonomy === 'fv_tag')}
			/>
			<ItemTerms
				title={__('Browsers')}
				terms={item.terms.filter(
					(i) => i.taxonomy === 'fv_compatible_browsers'
				)}
			/>
			<ItemTerms
				title={__('Compatible With')}
				terms={item.terms?.filter(
					(i) => i.taxonomy === 'fv_compatible_with'
				)}
			/>
			<ItemTerms
				title={__('Included Files')}
				terms={item.terms?.filter(
					(i) => i.taxonomy === 'files_included'
				)}
			/>
			<ItemTerms
				title={__('Software Versions')}
				terms={item.terms?.filter(
					(i) => i.taxonomy === 'software_version'
				)}
			/>
		</div>
	);
}

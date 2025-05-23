import { EnumAccessLevel, EnumItemSlug, EnumItemType } from '@/zod/item';
import { z } from 'zod';
import { CollectionResponse, CursorCollectionResponse } from './api';
type TVirusTotal = {
	filename: string;
	hash: string;
	result: string;
	stats: Record<string, number>;
	updated: number;
};
export type TTerm<T extends string = string> = {
	id: number;
	name: string;
	slug: T;
	taxonomy: string;
};
export type TTermCollectionResponse = CursorCollectionResponse<TTerm>;

export type TItemTypeEnum = z.infer<typeof EnumItemType>;
export type TItemTypeSlugEnum = z.infer<typeof EnumItemSlug>;
export type TItemAccessLevelEnum = z.infer<typeof EnumAccessLevel>;
export type TPostItem<Ex extends TItemTypeEnum = never> = {
	id: string;
	title: string;
	is_forked?: boolean;
	original_title?: string;
	slug?: string;
	slugs: Array<string>;
	summary: string;
	image: string;
	thumbnail: string;
	type: Exclude<TItemTypeEnum, Ex>;
	author: string;
	category: string;
	terms: TTerm[];
	updated: number;
	created: number;
	version: string;
	owned: boolean;
	installed_version?: string;
	additional_content_count?: number;
	download_count?: number;
	install_count?: number;
	media_count?: number;
	preview?: string;
	product_url?: string;
	support_url?: string;
	virus_total?: TVirusTotal;
	path?: string;
	install_dir?: string;
	topic_id?: number;
	collections?: number[];
	copyright?: string;
};
export type TPostMedia = {
	id: number;
	filename: string;
	version: string;
	slug: string;
	size: number;
	updated: number;
};
export type TDemoContent = {
	id: number;
	type: string;
	title: string;
	updated: number;
};
export type TComment = {
	id: number;
	display_name: string;
	avatar: string;
	comment: string;
	created_at: number;
	reads: number;
};
export type TCommentResponse = {
	id: number;
	url: string;
	slug: string;
	topic_id: number;
	views: number;
	title: string;
	created_at: number;
	comments: Array<TComment>;
};
export type TPostItemCollection = CollectionResponse<TPostItem>;
export type TPostChangelogCollection = CollectionResponse<TPostMedia>;
export type TDemoContentCollection = CollectionResponse<TDemoContent>;
export type ItemStatsResponse = {
	total: number;
	themes: number;
	plugins: number;
	kits: number;
};
export type TThemePluginItem = TPostItem<'template-kit'>;

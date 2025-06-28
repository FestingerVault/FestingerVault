<?php

namespace FestingerVault\api;

use FestingerVault\{
	Constants,
	Helper,
	Installer
};

class Item extends ApiBase
{
	public function categories(\WP_REST_Request $request)
	{
		$type = $request->get_param('type');
		return Helper::engine_post('item/categories', [
			'type' => $type,
		]);
	}
	public function terms(\WP_REST_Request $request)
	{
		$type = $request->get_param('type');
		$cursor = $request->get_param('cursor');
		return Helper::engine_post('item/paginated-terms', [
			'type' => $type,
			'cursor' => $cursor,
		]);
	}

	public function changelog(\WP_REST_Request $request)
	{
		$page = $request->get_param('page');
		$item_id = $request->get_param('item_id');
		return Helper::engine_post('item/changelog', [
			'item_id' => $item_id,
			'page' => $page ?? 1,
		]);
	}

	public function demo_content(\WP_REST_Request $request)
	{
		$page = $request->get_param('page');
		$item_id = $request->get_param('item_id');
		return Helper::engine_post('item/demo-content', [
			'item_id' => $item_id,
			'page' => $page ?? 1,
		]);
	}

	public function detail(\WP_REST_Request $request)
	{
		$item_id = $request->get_param('item_id');

		return Helper::engine_post('item/detail', [
			'item_id' => $item_id,
		]);
	}
	public function get_comments(\WP_REST_Request $request)
	{
		$item_id = $request->get_param('item_id');

		return Helper::engine_post('item/comments', [
			'item_id' => $item_id,
		]);
	}
	public function download_additional(\WP_REST_Request $request)
	{
		$item_id = $request->get_param('item_id');
		$media_id = $request->get_param('media_id');
		$item_detail = Helper::engine_post('item/detail', [
			'item_id' => $item_id,
		]);
		if (is_wp_error($item_detail)) {
			return new \WP_Error(
				400,
				__('Error getting Item detail', 'festingervault')
			);
		}
		return Helper::engine_post('item/download-additional', [
			'item_id' => $item_id,
			'media_id' => $media_id,
		]);
	}
	public function endpoints()
	{
		return [
			'list' => [
				'callback' => [$this, 'items'],
			],
			'terms' => [
				'callback' => [$this, 'terms'],
			],
			'categories' => [
				'callback' => [$this, 'categories'],
			],
			'detail' => [
				'callback' => [$this, 'detail'],
			],
			'stats' => [
				'callback' => [$this, 'stats'],
			],
			'changelog' => [
				'callback' => [$this, 'changelog'],
			],
			'demo-content' => [
				'callback' => [$this, 'demo_content'],
			],
			'install' => [
				'callback' => [$this, 'install'],
				'permission_callback' => [$this, 'user_can_install'],
			],
			'download-additional' => [
				'callback' => [$this, 'download_additional'],
			],
			'comments' => [
				'callback' => [$this, 'get_comments'],
			],
			'request-update' => [
				'callback' => [$this, 'request_update'],
			],
		];
	}

	public function install(\WP_REST_Request $request)
	{
		$item_id = $request->get_param('item_id');
		$method = $request->get_param('method');
		$media_id = $request->get_param('media_id');
		$slug = $request->get_param('slug');
		$item_detail = Helper::engine_post('item/detail', [
			'item_id' => $item_id,
		]);
		if (is_wp_error($item_detail)) {
			return $item_detail;
		}
		$download_detail = Helper::engine_post('item/download', [
			'item_id' => $item_id,
			'method' => $method,
			'media_id' => $media_id,
		]);
		if (is_wp_error($download_detail)) {
			return $download_detail;
		}
		if ('template-kit' === $item_detail['type'] || 'download' === $method) {
			return $download_detail;
		}
		$installer = new Installer($item_detail, $download_detail, $slug);
		$status = $installer->run();

		if (is_wp_error($status)) {
			return new \WP_Error(
				400,
				__('Error running item installation/update', 'festingervault')
			);
		}
		$settings = get_option(
			Constants::SETTING_KEY,
			Constants::DEFAULT_SETTINGS
		);
		if (
			$item_detail['type'] === 'plugin' &&
			isset($settings['autoactivate']) &&
			$settings['autoactivate']
		) {
			try {
				$installed_items = Helper::get_item_updates();
				if (
					!is_wp_error($installed_items) &&
					isset($installed_items['data'])
				) {
					$matched = \array_filter(
						$installed_items['data'],
						function ($_item) use ($item_id) {
							return $_item['id'] == $item_id;
						}
					);
					if (!empty($matched)) {
						$item = array_shift($matched);
						\activate_plugin($item['path']);
					}
				}
			} catch (\Exception $e) {
				error_log($e->getMessage());
			}
		}
		return ['success' => true];
	}
	public function request_update(\WP_REST_Request $request)
	{
		$item_id = $request->get_param('item_id');
		$version = $request->get_param('version');
		return Helper::engine_post('update/request', [
			'item_id' => $item_id,
			'version' => $version,
		]);
	}

	public function items(\WP_REST_Request $request)
	{
		$type = $request->get_param('type');
		$page = $request->get_param('page');
		$keyword = $request->get_param('keyword');
		$filter = $request->get_param('filter');
		$sort = $request->get_param('sort');
		$per_page = $request->get_param('per_page');
		return Helper::engine_post('item/list', [
			'type' => $type,
			'page' => $page,
			'keyword' => $keyword,
			'filter' => $filter,
			'sort' => $sort,
			'per_page' => $per_page,
		]);
	}

	public function stats(\WP_REST_Request $request)
	{
		return Helper::engine_post('item/stats');
	}
}

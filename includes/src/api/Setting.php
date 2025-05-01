<?php

namespace FestingerVault\api;

use FestingerVault\Constants;
use FestingerVault\Helper;

class Setting extends ApiBase
{
	public function endpoints()
	{
		return [
			'get' => [
				'callback' => [$this, 'get_setting'],
				'permission_callback' => [$this, 'user_is_adminstrator'],
			],
			'roles' => [
				'callback' => [$this, 'get_roles'],
				'permission_callback' => [$this, 'user_is_adminstrator'],
			],
			'language' => [
				'callback' => [$this, 'get_language'],
			],
			'update' => [
				'callback' => [$this, 'update_setting'],
				'permission_callback' => [$this, 'user_is_adminstrator'],
				'args' => [
					'autoactivate' => [
						'required' => false,
						'validate_callback' => function (
							$param,
							$request,
							$key
						) {
							return is_bool($param);
						},
					],
					'autoupdate_day_of_week' => [
						'required' => false,
						'validate_callback' => function (
							$param,
							$request,
							$key
						) {
							return is_array($param);
						},
					],
					'autoupdate_hour' => [
						'required' => false,
						'validate_callback' => function (
							$param,
							$request,
							$key
						) {
							return is_numeric($param) &&
								($param >= 0) & ($param <= 23);
						},
					],
					'autoupdate_minute' => [
						'required' => false,
						'validate_callback' => function (
							$param,
							$request,
							$key
						) {
							return is_numeric($param) &&
								($param >= 0) & ($param <= 59);
						},
					],
					'clean_on_uninstall' => [
						'required' => false,
						'validate_callback' => function (
							$param,
							$request,
							$key
						) {
							return is_bool($param);
						},
					],

					'roles' => [
						'required' => true,
						'validate_callback' => function (
							$param,
							$request,
							$key
						) {
							return is_array($param);
						},
					],
				],
			],
		];
	}

	/**
	 * @param \WP_REST_Request $request
	 */
	public function get_setting(\WP_REST_Request $request)
	{
		return get_option(Constants::SETTING_KEY, Constants::DEFAULT_SETTINGS);
	}
	public function update_setting(\WP_REST_Request $request)
	{
		$keys = [
			'autoactivate',
			'autoupdate_day_of_week',
			'autoupdate_hour',
			'autoupdate_minute',
			'clean_on_uninstall',
			'roles',
		];
		$setting = [];
		foreach ($keys as $key) {
			$setting[$key] = $request->get_param($key);
		}
		update_option(Constants::SETTING_KEY, $setting);
		Helper::update_capabilities();
		Helper::cancel_autoupdate();
		return ['success' => true];
	}
	public function get_roles()
	{
		return Helper::get_roles();
	}
	function get_language(\WP_REST_Request $request)
	{
		$language = $request->get_param('lang');
		\update_user_meta(
			get_current_user_id(),
			Constants::SLUG . '_lang',
			$language
		);

		return [];
	}
}

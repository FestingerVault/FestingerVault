<?php

namespace FestingerVault;

class Helper
{
	/**
	 * @param string $path
	 * @param array $data
	 * @return array|\WP_Error
	 */
	public static function engine_post(string $path, $data = [], $cache = false)
	{
		$data = array_merge($data, [
			'site_information' => self::get_site_information(),
		]);
		$content_body = json_encode($data);
		$result = wp_remote_post(
			trailingslashit(Constants::ENGINE_URL) .
				'client/' .
				trim($path, '/'),
			[
				'sslverify' =>
					defined('WP_DEBUG') && WP_DEBUG == true ? false : true,
				'headers' => [
					'Content-Type' => 'application/json',
					'X-Install-ID' => get_option(Constants::ACTIVATION_KEY, ''),
				],
				'body' => $content_body,
			]
		);
		$body = json_decode(wp_remote_retrieve_body($result), true);
		if (
			is_wp_error($result) ||
			wp_remote_retrieve_response_code($result) !== 200 ||
			isset($body['error'])
		) {
			return new \WP_Error(
				400,
				$body['message'] ?? __('Something went wrong', 'festingervault')
			);
		}
		return $body;
	}

	public static function get_activation_detail()
	{
		$cache_key = Constants::SLUG . '_activation_details';
		$license_detail = get_transient($cache_key);
		if (!$license_detail) {
			$license_detail = self::engine_post('license/activations');
			if (!is_wp_error($license_detail)) {
				set_transient(
					$cache_key,
					$license_detail,
					30 * MINUTE_IN_SECONDS
				);
			}
		}
		return is_wp_error($license_detail) ? false : $license_detail;
	}

	/**
	 * @return array|\WP_Error
	 */
	public static function get_item_updates()
	{
		$installed_themes = self::installed_themes();
		$installed_plugins = self::installed_plugins();
		$result = self::engine_post('update/list', [
			'themes' => $installed_themes,
			'plugins' => $installed_plugins,
		]);
		if (is_wp_error($result)) {
			return new \WP_Error(400, 'Error Fetching Update List');
		}
		$data = [];
		if (isset($result['data'])) {
			foreach ($result['data'] as $item) {
				if ('theme' == $item['type']) {
					foreach ($item['slugs'] as $slug) {
						if (isset($installed_themes[$slug])) {
							$item['installed_version'] =
								$installed_themes[$slug]['version'];
							$item['path'] = $installed_themes[$slug]['path'];
							$item['slug'] = $slug;
							$item['install_dir'] = self::wp_content_rel_path(
								trailingslashit(
									$installed_themes[$slug]['theme_root']
								) . trim($installed_themes[$slug]['path'], '/')
							);

							$item['data'] = $installed_themes[$slug];
							$data[] = $item;
						}
					}
				}
				if ('plugin' == $item['type']) {
					foreach ($item['slugs'] as $slug) {
						if (isset($installed_plugins[$slug])) {
							$item['installed_version'] =
								$installed_plugins[$slug]['version'];
							$item['path'] = $installed_plugins[$slug]['path'];
							$item['slug'] = $slug;
							$item['install_dir'] = self::wp_content_rel_path(
								\plugin_dir_path(
									trailingslashit(WP_PLUGIN_DIR) .
										trim(
											$installed_plugins[$slug]['path'],
											'/'
										)
								)
							);
							$data[] = $item;
						}
					}
				}
			}
			usort($data, function ($a, $b) {
				return strcmp(strtolower($a['title']), strtolower($b['title']));
			});
			$updatable = array_filter($data, function ($item) {
				return version_compare(
					$item['version'],
					$item['installed_version'],
					'gt'
				);
			});
			$data = array_filter($data, function ($item) {
				return version_compare(
					$item['version'],
					$item['installed_version'],
					'le'
				);
			});
			$data = array_values(array_merge($updatable, $data));
		}

		return ['data' => $data];
	}

	/**
	 * Get user roles
	 * @return array
	 */
	public static function get_roles()
	{
		global $wp_roles;

		if (!isset($wp_roles)) {
			$wp_roles = new \WP_Roles();
		}

		$roles = $wp_roles->roles;

		$res = [];

		foreach ($roles as $role_slug => $role_details) {
			if ($role_slug === 'administrator') {
				continue;
			}
			$res[$role_slug] = $role_details['name'];
		}

		return $res;
	}

	/**
	 * Get only required site information
	 * @return array
	 */
	public static function get_site_information()
	{
		$site_url = get_site_url();
		$info = Plugin::info();

		$data = [
			'site_url' => $site_url,
			'plugin_version' => $info['Version'] ?? null,
		];
		return $data;
	}

	/**
	 * Get installed plugins list
	 * @return array
	 */
	public static function installed_plugins()
	{
		if (!function_exists('get_plugins')) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		$plugins = get_plugins();
		$result = [];
		foreach ($plugins as $file_path => $plugin) {
			$slug = self::slug_from_path($file_path);
			$result[$slug] = [
				'slug' => $slug,
				'path' => $file_path,
				'name' => $plugin['Name'],
				'version' => $plugin['Version'],
			];
		}
		return $result;
	}

	/**
	 * Get installed themes list
	 * @return array
	 */
	public static function installed_themes()
	{
		if (!function_exists('wp_get_themes')) {
			require_once ABSPATH . 'wp-admin/includes/theme.php';
		}
		$themes = wp_get_themes();
		$result = [];
		foreach ($themes as $slug => $theme) {
			$result[$slug] = [
				'slug' => $slug,
				'path' => $slug,
				'theme_root' => $theme->get_theme_root(),
				'name' => $theme->get('Name'),
				'version' => $theme->get('Version'),
			];
		}
		return $result;
	}

	/**
	 * @param string $path
	 * @return string
	 */
	public static function slug_from_path($path = '')
	{
		$parts = explode('/', $path);
		return array_shift($parts);
	}

	public static function cancel_autoupdate()
	{
		wp_clear_scheduled_hook(Constants::SLUG . '/autoupdate');
	}

	public static function update_capabilities()
	{
		$capability = 'access_' . Constants::ADMIN_PAGE_ID;
		$activation_detail = self::get_activation_detail();
		$roles = [];
		if (
			$activation_detail !== false &&
			!empty($activation_detail['roles'])
		) {
			$settings = get_option(
				Constants::SETTING_KEY,
				Constants::DEFAULT_SETTINGS
			);
			$enabled_roles =
				isset($settings['roles']) && is_array($settings['roles'])
					? $settings['roles']
					: [];

			foreach (self::get_roles() as $role => $label) {
				$roles[$role] = in_array($role, $enabled_roles, true);
			}
		}
		foreach ($roles as $role_name => $should_have_cap) {
			$role = get_role($role_name);
			if ($role) {
				$has_cap = $role->has_cap($capability);

				if ($should_have_cap && !$has_cap) {
					$role->add_cap($capability, true);
				} else {
					$role->remove_cap($capability);
				}
			}
		}
	}

	/**
	 * @param $path
	 */
	public static function wp_content_rel_path($path)
	{
		$wp_content_dir = trailingslashit(\wp_normalize_path(\WP_CONTENT_DIR));
		return rtrim(
			str_replace($wp_content_dir, '', \wp_normalize_path($path)),
			'/'
		);
	}
	public static function get_available_languages()
	{
		$file = Plugin::p_dir('languages/available-languages.json');
		$languages = [];
		if (file_exists($file) && is_readable($file)) {
			$languages = json_decode(file_get_contents($file), true);
		}
		sort($languages);
		return $languages;
	}
}

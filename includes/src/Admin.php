<?php
namespace FestingerVault;

class Admin
{
	/**
	 * @var mixed
	 */
	private static $instance = null;

	/**
	 * @var mixed
	 */
	/**
	 * @param array $dependencies
	 */
	private $page = null;

	/**
	 * @var mixed
	 */
	private $update_details = null;

	/**
	 * @var mixed
	 *
	 */
	function __construct()
	{
		add_action('admin_menu', [$this, 'admin_menu']);
		add_action('admin_enqueue_scripts', [$this, 'admin_enqueue_scripts']);
		add_action('admin_init', [$this, 'admin_init']);
		add_filter('plugin_row_meta', [$this, 'plugin_row_meta'], 10, 4);
	}

	/**
	 * @param $screen
	 */
	public function admin_enqueue_scripts($screen)
	{
		$css = $js = [];
		$css[] =
			'li#toplevel_page_' .
			Constants::ADMIN_PAGE_ID .
			'.menu-top{ background: rgb(230,13,145);background: linear-gradient(90deg, rgba(230,13,145,1) 0%, rgba(230,13,82,1) 50%); transition:background ease-in-out .5s;}';
		$css[] =
			'li#toplevel_page_' .
			Constants::ADMIN_PAGE_ID .
			'.menu-top a,li#toplevel_page_' .
			Constants::ADMIN_PAGE_ID .
			'.menu-top div.wp-menu-image:before{ color:#FFF;}';
		$css[] =
			'li#toplevel_page_' .
			Constants::ADMIN_PAGE_ID .
			'.menu-top:hover{ background: rgb(230,13,145);background: linear-gradient(90deg, rgba(230,13,145,1) 0%, rgba(230,13,82,1) 10%)}';
		$css[] =
			'li#toplevel_page_' .
			Constants::ADMIN_PAGE_ID .
			'.menu-top:hover{ background: rgb(230,13,145);background: linear-gradient(90deg, rgba(230,13,145,1) 0%, rgba(230,13,82,1) 10%)}';
		wp_add_inline_style('nav-menus', implode('', $css));
		$js[] = "jQuery(function($){";
		$js[] =
			'$("li#toplevel_page_' .
			Constants::ADMIN_PAGE_ID .
			'").addClass("wp-has-current-submenu wp-menu-open").removeClass("wp-not-current-submenu");';
		$js[] =
			'$("li#toplevel_page_' .
			Constants::ADMIN_PAGE_ID .
			' li.wp-first-item").remove();';

		$js[] = '});';
		\wp_add_inline_script('jquery', implode('', $js));
	}

	public function admin_init()
	{
		$key = Constants::SLUG . '_installed';
		$this->update_details = \get_transient($key);
		if ($this->update_details == null) {
			$this->update_details = Helper::get_item_updates();
			if (!\is_wp_error($this->update_details)) {
				\set_transient(
					$key,
					$this->update_details,
					15 * \MINUTE_IN_SECONDS
				);
			}
		}
		if ($this->is_current()) {
			$this->enqueue_scripts();
			$this->render_page();
			die();
		}
	}

	public function admin_menu()
	{
		$this->page = \add_menu_page(
			Constants::ADMIN_PAGE_TITLE,
			Constants::ADMIN_MENU_TITLE,
			'access_' . Constants::ADMIN_PAGE_ID,
			Constants::ADMIN_PAGE_ID,
			[$this, 'render_page'],
			'dashicons-smiley',
			80
		);
		\add_submenu_page(
			Constants::ADMIN_PAGE_ID,
			__('Dashboard', 'festingervault'),
			__('Dashboard', 'festingervault'),
			'access_' . Constants::ADMIN_PAGE_ID,
			Constants::ADMIN_PAGE_ID . '#/',
			[$this, 'render_page']
		);
		\add_submenu_page(
			Constants::ADMIN_PAGE_ID,
			__('Themes', 'festingervault'),
			__('Themes', 'festingervault'),
			'access_' . Constants::ADMIN_PAGE_ID,
			Constants::ADMIN_PAGE_ID . '#/item/theme',
			[$this, 'render_page']
		);
		\add_submenu_page(
			Constants::ADMIN_PAGE_ID,
			__('Plugins', 'festingervault'),
			__('Plugins', 'festingervault'),
			'access_' . Constants::ADMIN_PAGE_ID,
			Constants::ADMIN_PAGE_ID . '#/item/plugin',
			[$this, 'render_page']
		);
		\add_submenu_page(
			Constants::ADMIN_PAGE_ID,
			__('Template Kits', 'festingervault'),
			__('Template Kits', 'festingervault'),
			'access_' . Constants::ADMIN_PAGE_ID,
			Constants::ADMIN_PAGE_ID . '#/item/template-kit',
			[$this, 'render_page']
		);
		\add_submenu_page(
			Constants::ADMIN_PAGE_ID,
			__('Updates', 'festingervault'),
			__('Updates', 'festingervault'),
			'access_' . Constants::ADMIN_PAGE_ID,
			Constants::ADMIN_PAGE_ID . '#/updates',
			[$this, 'render_page']
		);
		\add_submenu_page(
			Constants::ADMIN_PAGE_ID,
			__('License', 'festingervault'),
			__('License', 'festingervault'),
			'access_' . Constants::ADMIN_PAGE_ID,
			Constants::ADMIN_PAGE_ID . '#/activation',
			[$this, 'render_page']
		);
		\add_submenu_page(
			Constants::ADMIN_PAGE_ID,
			__('Settings', 'festingervault'),
			__('Settings', 'festingervault'),
			'access_' . Constants::ADMIN_PAGE_ID,
			Constants::ADMIN_PAGE_ID . '#/settings',
			[$this, 'render_page']
		);
	}

	public function enqueue_scripts()
	{
		$assets = new ViteAssets(
			Plugin::p_dir('build'),
			Plugin::p_url('build')
		);
		$assets->enqueue('src/index.tsx', [
			'handle' => Constants::SLUG . '-script',
			'script-dependencies' => [
				'wp-element',
				'wp-api-fetch',
				'wp-i18n',
				'wp-html-entities',
				'moment',
			],
		]);
		$locale = \get_user_meta(
			\get_current_user_id(),
			Constants::SLUG . '_lang',
			true
		);

		if (!$locale) {
			\update_user_meta(
				\get_current_user_id(),
				Constants::SLUG . '_lang',
				'en-US'
			);
		}
		wp_localize_script(Constants::SLUG . '-script', 'AVAILABLE_I18NS', [
			'locale' => $locale,
			'available' => Helper::get_available_languages(),
		]);
		$lang_content = Helper::get_langauge_file(
			str_replace('-', '_', $locale)
		);
		if ($lang_content) {
			wp_add_inline_script(
				Constants::SLUG . '-script',
				'( function( domain, translations ) {var localeData = translations.locale_data[ domain ] || translations.locale_data.messages;	localeData[""].domain = domain;	wp.i18n.setLocaleData( localeData, domain );} )("' .
					Constants::TEXTDOMAIN .
					'",' .
					json_encode($lang_content) .
					');',
				'after'
			);
		}
	}

	public static function get_instance()
	{
		if (is_null(self::$instance)) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	public function is_current()
	{
		return !empty($_GET['page']) &&
			Constants::ADMIN_PAGE_ID === $_GET['page'];
	}

	/**
	 * @param $plugin_meta
	 * @param $plugin_file
	 * @param $plugin_data
	 * @param $status
	 * @return array
	 */
	public function plugin_row_meta(
		$plugin_meta,
		$plugin_file,
		$plugin_data,
		$status
	) {
		if ($this->update_details && isset($this->update_details['data'])) {
			foreach ($this->update_details['data'] as $item) {
				if (
					$plugin_file === $item['path'] &&
					$item['type'] === 'plugin' &&
					$item['is_forked']
				) {
					$plugin_meta[] = sprintf(
						'<span style="color: green;">Forked from <strong>%s</strong></span>',
						$item['original_title']
					);
				}
			}
		}
		return $plugin_meta;
	}

	public function render_page()
	{
		require __DIR__ . '/view/admin.php';
	}
}

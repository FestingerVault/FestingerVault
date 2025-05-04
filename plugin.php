<?php
/*
 * Plugin Name: FestingerVault
 * Plugin URI: https://festingervault.com
 * Description: Imagine going to the forest of themes, buying a theme, and logging out. Now, you come to Festinger's, where we offer 25K+ premium themes and plugins directly from your dashboard.
 * Version: 6.0.1746366165
 * Requires at Least: 6.0
 * Requires PHP: 7.4
 * Author: FestingerVault
 * Author URI: https://festingervault.com
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: festingervault
 **/
namespace FestingerVault {
	if (file_exists(__DIR__ . '/includes/lib/autoload.php')) {
		require_once __DIR__ . '/includes/lib/autoload.php';
		Plugin::get_instance(__FILE__);
		Upgrade::get_instance(__FILE__);
	}
}

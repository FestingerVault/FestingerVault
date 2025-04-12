<?php
namespace FestingerVault\view;

if (!defined('ABSPATH')) {
	exit(); // Exit if accessed directly.
} ?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> suppressHydrationWarning>

<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<title></title>
	<base target="_parent">
	<link
		href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:wght@100..900&display=swap"
		rel="stylesheet" />
		<?php wp_print_head_scripts(); ?>
</head>

<body class="font-sans">
	<div id="app"></div>
	<?php wp_print_footer_scripts(); ?>
</body>

</html>

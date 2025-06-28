import dotenv from 'dotenv';
import { existsSync, readFileSync, watch, writeFileSync } from 'fs';
import { sync } from 'glob';
import { dirname, relative, resolve } from 'path';
import { PluginOption, ResolvedConfig } from 'vite';

type Props = {
	envFile?: string;
	mainPluginFile?: string;
	composerJSON?: string;
	constants?: string[];
	constantsFile?: string;
	srcDir?: string;
};
export default function WPEnvProcess({
	envFile,
	mainPluginFile,
	composerJSON,
	constants,
	constantsFile,
	srcDir
}: Props = {}): PluginOption {
	let env: NodeJS.ProcessEnv;
	let config: ResolvedConfig;
	let fsTimeout: NodeJS.Timeout;

	const loadEnv = (override = false) => {
		dotenv.config({ override, path: envFile ?? '.env' });
		env = process.env;
		if (!env.NAMESPACE || !env.TEXTDOMAIN) {
			throw new Error('NAMESPACE and TEXTDOMAIN must be defined in .env');
		}
	};

	const replaceNamespace = (content: string, filePath: string) => {
		const dir = relative(
			srcDir ?? 'includes/src',
			dirname(filePath)
		).replace(new RegExp('/', 'g'), '\\');
		const chunks = [env.NAMESPACE];
		if (dir.length > 0) {
			chunks.push(dir);
		}
		return content
			.replace(
				/namespace\s+(.+)?;/gi,
				'namespace ' + chunks.join('\\') + ';'
			)
			.replace(/^use\s+([0-9a-zA-Z_]+)/gm, 'use ' + env.NAMESPACE);
	};
	const replaceTextdomain = (content: string, textdomain: string) => {
		const pattern =
			/((esc_attr__|esc_attr_e|esc_html_e|esc_html__|__|_e)\s*\(\s*(['"])(.*?)\3\s*(,\s*['"]\w+['"])?\s*\))/gi;

		return content.replace(pattern, (match, p1, p2, p3, p4, p5) => {
			if (p5) {
				// If the text domain is already present, replace it with the new one
				return `${p2}(${p3}${p4}${p3}, '${textdomain}')`;
			} else {
				// If the text domain is missing, add it
				return `${p2}(${p3}${p4}${p3}, '${textdomain}')`;
			}
		});
	};

	const processPHPFiles = () => {
		const files = sync('**/*.php', {
			ignore: ['includes/lib/**', 'vendor/**', 'composer/**'],
			absolute: true,
			cwd: srcDir ?? 'includes/src'
		});
		files.forEach((file) => {
			const filePath = resolve(file);
			let fileContent = readFileSync(filePath, 'utf8');
			fileContent = replaceNamespace(fileContent, filePath);
			fileContent = replaceTextdomain(fileContent, env.TEXTDOMAIN);
			writeFileSync(filePath, fileContent, 'utf8');
		});
	};

	const processMainFile = () => {
		const filePath = resolve(mainPluginFile ?? `plugin.php`);
		if (existsSync(filePath)) {
			let fileContent = readFileSync(filePath, 'utf8');
			const headers = {
				'Plugin Name': env.NAME,
				'Plugin URI': env.URI,
				Version: process.env.VERSION.replace(
					'{TS}',
					process.env?.GITHUB_RUN_NUMBER ??
						Date.now().toString().slice(0, -3)
				),
				Description: env.DESCRIPTION,
				Author: env.AUTHOR_NAME,
				'Author URI': env.AUTHOR_URL,
				'Text Domain': env.TEXTDOMAIN,
				'Requires at Least': env.MIN_WP,
				'Requires PHP': env.MIN_PHP,
				'License URI': env.LICENSE_URL
			};
			Object.entries(headers).forEach(([key, value]) => {
				if (value && value.length > 0) {
					fileContent = fileContent.replace(
						new RegExp(`${key}[\\s+]{0,}:[\\s+]{0,}(.+)`, 'gi'),
						`${key}: ${value}`
					);
				}
			});
			fileContent = fileContent.replace(
				/namespace\s+(.+)?{/gi,
				'namespace ' + env.NAMESPACE + ' {'
			);
			writeFileSync(filePath, fileContent, 'utf8');
		} else {
			console.log('Main Plugin file missing');
		}
	};
	const prepareSettingsFile = () => {
		const settingsJson = {
			slug: env.SLUG,
			name: env.NAME,
			textdomain: env.TEXTDOMAIN,
			logo: {
				dark: env.LOGO_DARK ?? null,
				light: env.LOGO_LIGHT ?? null
			},
			whitelabel: parseInt(env.WHITELABEL) == 1,
			provider: parseInt(env.WHITELABEL) != 1 ? env.MAIN_SITE : false,
			typesense_api_key: env.TYPESENSE_SEARCH_KEY,
			typesense_host: env.TYPESENSE_HOST,
			typesense_port: Number(env.TYPESENSE_PORT),
			typesense_protocol: env.TYPESENSE_PROTOCOL,
			typesense_path: env.TYPESENSE_PATH
		};
		writeFileSync(
			'./src/settings.json',
			JSON.stringify(settingsJson, null, 2),
			'utf8'
		);
	};

	const processConstantsFile = () => {
		const filePath =
			constantsFile ?? resolve('includes/src', 'Constants.php');
		if (existsSync(filePath)) {
			if (constants) {
				let fileContent = readFileSync(filePath, 'utf8');
				constants.forEach((key) => {
					const regexp = new RegExp(
						`(const ${key}\\s?=\\s?'?"?)([^'";]+)('?"?\\s?;)`,
						'g'
					);
					if (env[key] && env[key]?.length > 0) {
						fileContent = fileContent.replace(
							regexp,
							`$1${env[key]}$3`
						);
					}
				});
				writeFileSync(filePath, fileContent, 'utf8');
			}
		} else {
			console.log('Constants file not found');
		}
	};

	const runEvents = () => {
		loadEnv(true);
		processConstantsFile();
		processPHPFiles();
		processMainFile();
		prepareSettingsFile();
	};

	return [
		{
			name: 'sovit:vite-wp-plugin',
			configResolved(resolvedConfig) {
				config = resolvedConfig;
				runEvents();
			},
			buildStart() {
				runEvents();
			},

			configureServer(server) {
				if (server.config.mode === 'development') {
					watch(envFile ?? '.env', (eventType) => {
						if (eventType === 'change') {
							if (!fsTimeout) {
								console.log(
									'.env file changed, reloading environment variables...'
								);
								fsTimeout = setTimeout(function () {
									fsTimeout = null;
									runEvents();
								}, 5000);
							}
						}
					});
				}
			}
		}
	];
}

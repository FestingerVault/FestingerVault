import { siteConfig } from '@/config/site';
import {
	__ as wp__,
	_n as wp_n,
	_nx as wp_nx,
	_x as wp_x
} from '@wordpress/i18n';
import ISO6391 from 'iso-639-1';

/**
 * Retrieve the translation of text.
 *
 *
 * @param {string} text     Text to translate.
 *
 * @return {string} Translated text.
 */
export function __(text: string): string {
	return wp__(text, siteConfig.textdomain);
}
/**
 * Translates and retrieves the singular or plural form based on the supplied
 * number.
 *
 *
 * @param {string} single   The text to be used if the number is singular.
 * @param {string} plural   The text to be used if the number is plural.
 * @param {number} number   The number to compare against to use either the
 *                          singular or plural form.
 *
 * @return {string} The translated singular or plural form.
 */
export function _n(single: string, plural: string, number: number): string {
	return wp_n(single, plural, number, siteConfig.textdomain);
}
/**
 * Retrieve translated string with gettext context.
 *
 *
 * @param {string} text     Text to translate.
 * @param {string} context  Context information for the translators.
 *
 * @return {string} Translated context string without pipe.
 */
export function _x(text: string, context: string): string {
	return wp_x(text, context, siteConfig.textdomain);
}
/**
 * Translates and retrieves the singular or plural form based on the supplied
 * number, with gettext context.
 *
 *
 * @param {string} single   The text to be used if the number is singular.
 * @param {string} plural   The text to be used if the number is plural.
 * @param {number} number   The number to compare against to use either the
 *                          singular or plural form.
 * @param {string} context  Context information for the translators.
 *
 * @return {string} The translated singular or plural form.
 */
export function _nx(
	single: string,
	plural: string,
	number: number,
	context: string
): string {
	return wp_nx(single, plural, number, context, siteConfig.textdomain);
}
export function getLanguageCode(locale: string) {
	return locale.split('_')[0]; // Extract the first part of the locale (e.g., 'en_US' -> 'en')
}

export function getLanguageName(locale: string) {
	const languageCode = getLanguageCode(locale); // Extract the language code (e.g., 'en' from 'en_US')

	// const nativeName = ISO6391.getNativeName(languageCode); // Get the native name (e.g., 'English' -> 'English', 'fr' -> 'Français')
	//const englishName = ISO6391.getName(languageCode); // Get the English name (e.g., 'en' -> 'English', 'fr' -> 'French')

	return ISO6391.getName(languageCode);
}

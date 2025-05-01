import { getByTag } from 'locale-codes';

export const languages = [
	{
		code: 'en-US',
		name: 'English',
		native: 'English'
	},
	...window.AVAILABLE_I18NS.available.map((lang) => {
		const language = getByTag(lang);
		return {
			code: lang,
			name: language?.name,
			native: language?.local ?? language?.name
		};
	})
].filter((lang) => lang?.name);

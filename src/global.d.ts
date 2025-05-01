declare module '*.png';
interface Window {
	vault: {
		logo: string;
	};
	AVAILABLE_I18NS: { locale: string; available: Array<string> };
}

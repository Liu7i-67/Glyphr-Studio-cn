import i18next from 'i18next';
import { ns } from './resources';
import { zhCnConfig } from './zh-CN/config';
import { enConfig } from './en/config';

export const langArr = ['zh-CN', 'en'];

async function initI18N(lang) {
	return i18next.init({
		fallbackLng: 'zh-CN',
		lng: lang,
		debug: true,
		resources: {
			'zh-CN': {
				...zhCnConfig,
			},
			en: {
				...enConfig,
			},
		},
		ns,
		defaultNS: false,
		nonExplicitSupportedLngs: true,
		interpolation: {
			escapeValue: false,
		},
	});
}

function g_lang(_lang) {
	let lang = _lang || window.localStorage.getItem('glyphr_studio_lang') || navigator.language;

	if (langArr.indexOf(lang) === -1) {
		lang = 'en';
	}

	return {
		lang,
	};
}

export async function initLang(cb) {
	try {
		const { lang } = g_lang();
		await initI18N(lang);
		cb();
	} catch (error) {
		console.error('initLang:Error', error);
	}
}

export const changeLng = (lng) => {
	i18next.changeLanguage(lng);
	window.localStorage.setItem('glyphr_studio_lang', lng);
	location.reload();
};

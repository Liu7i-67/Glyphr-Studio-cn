import { ns } from './index';

const resources = { en: {} };

async function init() {
	for (let item of ns) {
		const r = await import(`../en/${item}.json`);
		resources['en'][item] = r.default;
	}
}

init();

export default resources;

import { ns } from './index';

const resources = { 'zh-CN': {} };

async function init() {
	for (let item of ns) {
		const r = await import(`../zh-CN/${item}.json`);
		resources['zh-CN'][item] = r.default;
	}
}

init();

export default resources;

import { getCurrentProject } from '../app/main.js';
import { basicLatinOrder, decToHex } from '../common/unicode.js';
import { isControlChar } from '../lib/unicode_blocks.js';

export class GlyphRange {
	constructor({ begin = 0, end = 0, name = '' }) {
		this.begin = begin;
		this.end = end;
		this.name = name;
	}

	get begin() {
		return this._begin || 0;
	}

	set begin(val) {
		this._begin = parseInt(val);
	}

	get end() {
		return this._end || 0;
	}

	set end(val) {
		this._end = parseInt(val);
	}

	// Generator
	*generator() {
		let basicLatinIndex = 0;
		if (this.begin <= 0x21 && this.end === 0x7f) {
			while (basicLatinIndex < basicLatinOrder.length) {
				yield basicLatinOrder[basicLatinIndex];
				basicLatinIndex++;
			}
		} else {
			let current = this.begin;
			let showControls = getCurrentProject().settings.app.showNonCharPoints;
			if (showControls) {
				while (current <= this.end) yield current++;
			} else {
				while (isControlChar(current)) current++;
				while (current <= this.end) yield current++;
			}
		}
	}

	// Calculated properties
	get isValid() {
		let begin = this.begin !== 0;
		let end = this.end !== 0;
		let name = this.name !== '';
		return begin && end && name;
	}

	save() {
		return {
			begin: this.begin,
			end: this.end,
			name: this.name,
		};
	}

	get beginHex() {
		return decToHex(this.begin);
	}

	get endHex() {
		return decToHex(this.end);
	}

	get note() {
		return `["${this.beginHex}", "${this.endHex}"]`;
	}

	get id() {
		return `${this.name} ${this.note}`;
	}
}

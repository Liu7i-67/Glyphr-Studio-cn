import { getCurrentProject, log } from '../app/main.js';
import { json, clone, makeRandomID } from '../common/functions.js';

/**
 * Base for all Glyph Elements
 */
export class GlyphElement {
	/** Yay! */
	constructor() {
		// this.__ID = makeRandomID();
	}

	/**
	 * Any change that updates the path of any part of a glyph
	 * gets bubbled up through the GlyphElement hierarchy
	 */
	changed() {
		// log(`~~CHANGED ${this.objType}`);
		if (this.cache) {
			this.cache = {};
		}

		if (this.parent) {
			// log(status + ' - calling parent.changed()');
			this.parent.changed();
		} else {
			// log(status + ' - No Parent!');
		}
	}

	/**
	 * Find out what type of Element this is
	 */
	get objType() {
		return this._objType || this.constructor.name;
	}

	get displayType() {
		if (this.id.startsWith('liga-')) return 'Ligature';
		if (this.id.startsWith('comp-')) return 'Component';
		if (this.id.startsWith('0x')) return 'Glyph';
		return this.objType;
	}

	/**
	 * Find out what type of Element this is
	 * @param {string} type
	 * @returns {string}
	 */
	set objType(type) {
		this._objType = type;
	}

	/**
	 * get the cache
	 * @returns {object}
	 */
	get cache() {
		if (!this._cache) this._cache = {};
		return this._cache;
	}

	/**
	 * set the cache
	 * @param {object} cache
	 * @returns {object}
	 */
	set cache(cache = {}) {
		this._cache = cache;
	}

	/**
	 * For glyph elements with lockable properties, this function
	 * will return true.
	 * @returns {Boolean}
	 */
	get isLockable() {
		return false;
	}

	/**
	 * For glyph elements with lockable properties, this function
	 * will be overwritten to return a boolean.
	 * By default, properties are all unlocked.
	 * @param {string} propertyName - property to check if locked
	 * @returns {Boolean}
	 */
	isLocked() {
		return false;
	}

	/**
	 * For glyph elements with lockable properties, this function
	 * will be overwritten to lock properties.
	 * @param {string} propertyName - property to lock
	 */
	lock() {}

	/**
	 * For glyph elements with lockable properties, this function
	 * will be overwritten to lock properties.
	 * @param {string} propertyName - property to unlock
	 */
	unlock() {}

	/**
	 * Export object properties that need to be saved to a project file
	 * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
	 * @returns {*}
	 */
	save(verbose = false) {
		const re = clone(this);

		if (verbose) re.objType = this.objType;
		else delete re.objType;

		if (re.cache) delete re.cache;

		return re;
	}

	/**
	 * Returns a totally new Glyph Element object that
	 * matches this one.
	 * @returns {Object}
	 */
	clone() {
		return new this.constructor(this.save(true));
	}

	/**
	 * String representation of this object
	 * Uses .save() to only get defaults
	 * @returns {string}
	 */
	toString() {
		return json(this.save());
	}

	/**
	 * Test to see if this object uses the Glyph constructor
	 */
	get isGlyphLike() {
		if (this.objType === 'Glyph') return true;
		if (this.objType === 'Component') return true;
		if (this.objType === 'Ligature') return true;
		return false;
	}

	/**
	 * Create a nicely-formatted string for this object
	 * @param {number} level - how far down we are
	 * @param {number} num - increment designator for arrays
	 * @returns {string}
	 */
	print(level = 0, num = false) {
		let ind = '';
		for (let i = 0; i < level; i++) ind += '  ';

		let re = `${ind}{${this.objType} ${num ? num : ''}\n`;
		ind += '  ';

		const safeObj = this.save();
		let elem;

		for (const key of safeObj) {
			elem = this[key];
			if (elem.print) {
				re += `${ind}${key}: ${elem.print(level + 1)}\n`;
			} else {
				if (typeof elem !== 'function') {
					if (typeof elem === 'object') {
						re += `${ind}${key}: ${JSON.stringify(elem)}\n`;
					} else {
						re += `${ind}${key}: ${elem}\n`;
					}
				}
			}
		}

		re += `${ind.substring(2)}}/${this.objType} ${num ? num : ''}`;

		return re;
	}
}

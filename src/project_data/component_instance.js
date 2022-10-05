import { GlyphElement } from './glyph_element.js';
// import { getCurrentProject } from '../app/main.js';
import { parseUnicodeInput } from '../common/unicode.js';
import { strSan, rad, deg } from '../common/functions.js';

/**
 * Glyph Element > Component Instance
 * Component Instances are a link to any other
 * Glyph Object (Glyphs, Components, or Ligatures).
 * Additionally they hold transformation info about
 * how they differ from their root component.
 * Component Instances surface *all* the same
 * methods as a Path, and are stored along side
 * regular Paths in a Glyph.
 */
export class ComponentInstance extends GlyphElement {
	/**
	 * Create a ComponentInstance
	 * @param {number} link - Root component that this instances is based on
	 * @param {string} name - name
	 * @param {number} translateX - horizontal position difference
	 * @param {number} translateY - vertical position difference
	 * @param {number} scaleW - horizontal size difference
	 * @param {number} scaleH - vertical size difference
	 * @param {boolean} flipEW - flipped horizontally
	 * @param {boolean} flipNS - flipped vertically
	 * @param {boolean} reverseWinding - paths have opposite winding
	 * @param {number} rotation - rotation difference
	 * @param {boolean} rotateFirst - rotate/resize is different than resize/rotate
	 * @param {boolean} xLock - can the path be moved horizontally
	 * @param {boolean} yLock - can the path be moved vertically
	 * @param {boolean} wLock - can the path be resized horizontally
	 * @param {boolean} hLock - can the path be resized vertically
	 * @param {boolean} ratioLock - while resizing, maintain aspect ratio
	 * @param {object} parent - link to the parent Glyph object
	 */
	constructor({
		link = '0x0000',
		name = 'Component Instance',
		translateX = 0,
		translateY = 0,
		scaleW = 0,
		scaleH = 0,
		isFlippedNS = false,
		isFlippedEW = false,
		reverseWinding = false,
		rotation = 0,
		rotateFirst = false,
		xLock = false,
		yLock = false,
		wLock = false,
		hLock = false,
		ratioLock = false,
		parent = false,
	} = {}) {
		super();
		this.parent = parent;
		this.link = link;
		this.name = name;
		this.translateX = translateX;
		this.translateY = translateY;
		this.scaleW = scaleW;
		this.scaleH = scaleH;
		this.isFlippedNS = isFlippedNS; // These have a different name because there is a function 'flipNS'
		this.isFlippedEW = isFlippedEW; // These have a different name because there is a function 'flipEW'
		this.reverseWinding = reverseWinding;
		this.rotation = rotation;
		this.rotateFirst = rotateFirst;
		this.xLock = xLock;
		this.yLock = yLock;
		this.wLock = wLock;
		this.hLock = hLock;
		this.ratioLock = ratioLock;

		this.objType = 'ComponentInstance';
	}

	// --------------------------------------------------------------
	// Common Glyphr Studio object methods
	// --------------------------------------------------------------

	/**
	 * Export object properties that need to be saved to a project file
	 * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
	 * @returns {*}
	 */
	save(verbose = false) {
		const re = {
			link: this.link,
		};

		if (this.name !== 'Component Instance') re.name = this.name;
		if (this.translateX !== 0) re.translateX = this.translateX;
		if (this.translateY !== 0) re.translateY = this.translateY;
		if (this.scaleW !== 0) re.scaleW = this.scaleW;
		if (this.scaleH !== 0) re.scaleH = this.scaleH;
		if (this.isFlippedNS !== false) re.isFlippedNS = this.isFlippedNS;
		if (this.isFlippedEW !== false) re.isFlippedEW = this.isFlippedEW;
		if (this.reverseWinding !== false) re.reverseWinding = this.reverseWinding;
		if (this.rotation !== 0) re.rotation = this.rotation;
		if (this.rotateFirst !== false) re.rotateFirst = this.rotateFirst;
		if (this.xLock !== false) re.xLock = this.xLock;
		if (this.yLock !== false) re.yLock = this.yLock;
		if (this.wLock !== false) re.wLock = this.wLock;
		if (this.hLock !== false) re.hLock = this.hLock;
		if (this.ratioLock !== false) re.ratioLock = this.ratioLock;

		if (verbose) re.objType = this.objType;

		return re;
	}

	// --------------------------------------------------------------
	// Getters
	// --------------------------------------------------------------

	/**
	 * get link
	 * @returns {string}
	 */
	get link() {
		return this._link;
	}

	/**
	 * get name
	 * @returns {string}
	 */
	get name() {
		return this._name;
	}

	/**
	 * get translateX
	 * @returns {number}
	 */
	get translateX() {
		return this._translateX;
	}

	/**
	 * get translateY
	 * @returns {number}
	 */
	get translateY() {
		return this._translateY;
	}

	/**
	 * get scaleW
	 * @returns {number}
	 */
	get scaleW() {
		return this._scaleW;
	}

	/**
	 * get scaleH
	 * @returns {number}
	 */
	get scaleH() {
		return this._scaleH;
	}

	/**
	 * get isFlippedEW
	 * @returns {boolean}
	 */
	get isFlippedEW() {
		return this._isFlippedEW;
	}

	/**
	 * get isFlippedNS
	 * @returns {boolean}
	 */
	get isFlippedNS() {
		return this._isFlippedNS;
	}

	/**
	 * get reverseWinding
	 * @returns {boolean}
	 */
	get reverseWinding() {
		return this._reverseWinding;
	}

	/**
	 * get rotation
	 * @returns {number}
	 */
	get rotation() {
		return this._rotation;
	}

	/**
	 * get rotateFirst
	 * @returns {boolean}
	 */
	get rotateFirst() {
		return this._rotateFirst;
	}

	/**
	 * get xLock
	 * @returns {boolean}
	 */
	get xLock() {
		return this._xLock;
	}

	/**
	 * get yLock
	 * @returns {boolean}
	 */
	get yLock() {
		return this._yLock;
	}

	/**
	 * get wLock
	 * @returns {boolean}
	 */
	get wLock() {
		return this._wLock;
	}

	/**
	 * get hLock
	 * @returns {boolean}
	 */
	get hLock() {
		return this._hLock;
	}

	/**
	 * get ratioLock
	 * @returns {boolean}
	 */
	get ratioLock() {
		return this._ratioLock;
	}

	// Computed properties

	/**
	 * get transformedGlyph
	 * @returns {Glyph}
	 */
	get transformedGlyph() {
		if (!this.cache.transformedGlyph) this.makeTransformedGlyph();
		return this.cache.transformedGlyph;
	}

	/**
	 * get x
	 * @returns {number}
	 */
	get x() {
		return this.maxes.xMin;
	}

	/**
	 * get y
	 * @returns {number}
	 */
	get y() {
		return this.maxes.yMax;
	}

	/**
	 * get width
	 * @returns {number} width
	 */
	get width() {
		const g = this.transformedGlyph.maxes;
		return g.xMax - g.xMin;
	}

	/**
	 * get height
	 * @returns {number} height
	 */
	get height() {
		const g = this.transformedGlyph.maxes;
		return g.yMax - g.yMin;
	}

	/**
	 * get maxes
	 * @returns {Maxes} maxes
	 */
	get maxes() {
		return this.transformedGlyph.maxes;
	}

	/**
	 * center
	 * @returns {XYPoint}
	 */
	get center() {
		return this.transformedGlyph.maxes.center;
	}

	// --------------------------------------------------------------
	// Setters
	// --------------------------------------------------------------

	/**
	 * set link
	 * @param {string} link
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set link(link) {
		this._link = parseUnicodeInput(link)[0];
		this.changed();
	}

	/**
	 * set name
	 * @param {string} name
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set name(name = '') {
		name = strSan(name);
		if (name !== '') {
			this._name = name;
		} else {
			// showToast(
			// 	'Invalid component instance name - component instance names must only contain alphanumeric characters or spaces.'
			// );
		}
	}

	/**
	 * set translateX
	 * @param {number} translateX
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set translateX(translateX) {
		this._translateX = parseFloat(translateX);
		if (isNaN(this._translateX)) this._translateX = 0;
		this.changed();
	}

	/**
	 * set translateY
	 * @param {number} translateY
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set translateY(translateY) {
		this._translateY = parseFloat(translateY);
		if (isNaN(this._translateY)) this._translateY = 0;
		this.changed();
	}

	/**
	 * set scaleW
	 * @param {number} scaleW
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set scaleW(scaleW) {
		this._scaleW = parseFloat(scaleW);
		if (isNaN(this._scaleW)) this._scaleW = 0;
		this.changed();
	}

	/**
	 * set scaleH
	 * @param {number} scaleH
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set scaleH(scaleH) {
		this._scaleH = parseFloat(scaleH);
		if (isNaN(this._scaleH)) this._scaleH = 0;
		this.changed();
	}

	/**
	 * set isFlippedNS
	 * @param {boolean} isFlippedNS
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set isFlippedNS(isFlippedNS) {
		this._isFlippedNS = !!isFlippedNS;
		this.changed();
	}

	/**
	 * set isFlippedEW
	 * @param {boolean} isFlippedEW
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set isFlippedEW(isFlippedEW) {
		this._isFlippedEW = !!isFlippedEW;
		this.changed();
	}

	/**
	 * set reverseWinding
	 * @param {boolean} reverseWinding
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set reverseWinding(reverseWinding) {
		this._reverseWinding = !!reverseWinding;
		this.changed();
	}

	/**
	 * set rotation
	 * @param {number} rotation
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set rotation(rotation) {
		this._rotation = parseFloat(rotation);
		if (isNaN(this._rotation)) this._rotation = 0;
		this.changed();
	}

	/**
	 * set rotateFirst
	 * @param {boolean} rotateFirst
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set rotateFirst(rotateFirst) {
		this._rotateFirst = !!rotateFirst;
		this.changed();
	}

	/**
	 * set xLock
	 * @param {boolean} xLock
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set xLock(xLock) {
		this._xLock = !!xLock;
	}

	/**
	 * set yLock
	 * @param {boolean} yLock
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set yLock(yLock) {
		this._yLock = !!yLock;
	}

	/**
	 * set wLock
	 * @param {boolean} wLock
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set wLock(wLock) {
		this._wLock = !!wLock;
	}

	/**
	 * set hLock
	 * @param {boolean} hLock
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set hLock(hLock) {
		this._hLock = !!hLock;
	}

	/**
	 * set ratioLock
	 * @param {boolean} ratioLock
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set ratioLock(ratioLock) {
		this._ratioLock = !!ratioLock;
	}

	// Computed properties

	/**
	 * Set X position
	 * @param {number} x
	 * @returns {ComponentInstance} - reference to this ComponentInstancePath
	 */
	set x(x) {
		this.setPathPosition(x, false);
	}

	/**
	 * Set Y position
	 * @param {number} y
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set y(y) {
		this.setPathPosition(false, y);
	}

	/**
	 * Set Width
	 * @param {number} w
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set width(w) {
		this.setPathSize(w, false);
	}

	/**
	 * Set Height
	 * @param {number} h
	 * @returns {ComponentInstance} - reference to this ComponentInstance
	 */
	set height(h) {
		this.setPathSize(false, h);
	}

	// --------------------------------------------------------------
	// Get Transformed Glyph
	// --------------------------------------------------------------

	/**
	 * Component Instances are basically links to other Glyphs, plus some transformations.
	 * This function grabs a clone of the linked-to Glyph, applies the transformations,
	 * and returns a Glyph object - while also updating the cache
	 * @returns {Glyph}
	 */

	// TODO refactor
	/*
	makeTransformedGlyph() {
		// log('ComponentInstance.makeTransformedGlyph - START ' + this.name);

		const g = this.cloneAndFlattenGlyph();
		if (!g) {
			console.warn(
				'Tried to get Component: ' +
					this.link +
					" but it doesn't exist - bad usedIn array maintenance."
			);
			return false;
		}
		// log('DELTAS' + '\n\t translateX:\t' + this.translateX  + '\n\t translateY:\t' + this.translateY  + '\n\t scaleW:\t' + this.scaleW  + '\n\t scaleH:\t' + this.scaleH  + '\n\t flipEW:\t' + this.isFlippedEW  + '\n\t flipNS:\t' + this.isFlippedNS  + '\n\t reverseWinding:\t' + this.reverseWinding  + '\n\t rotation:\t' + this.rotation);
		if (
			this.translateX ||
			this.translateY ||
			this.scaleW ||
			this.scaleH ||
			this.isFlippedEW ||
			this.isFlippedNS ||
			this.reverseWinding ||
			this.rotation
		) {
			// log('Modifying w ' + this.scaleW + ' h ' + this.scaleH);
			// log('before maxes ' + json(g.maxes, true));
			if (this.rotateFirst) g.rotate(rad(this.rotation, g.maxes.center));
			if (this.isFlippedEW) g.flipEW();
			if (this.isFlippedNS) g.flipNS();
			g.updateGlyphPosition(this.translateX, this.translateY, true);
			g.updateGlyphSize(this.scaleW, this.scaleH, false);
			if (this.reverseWinding) g.reverseWinding();
			if (!this.rotateFirst) g.rotate(rad(this.rotation, g.maxes.center));
			// log('afters maxes ' + json(g.maxes, true));
		} else {
			// log('Not changing, no deltas');
		}

		g.changed();
		this.cache.transformedGlyph = g;
		// log('ComponentInstance.makeTransformedGlyph', 'end');

		return g;
	}

	cloneAndFlattenGlyph() {
		// log(`ComponentInstance.cloneAndFlatten`, 'start');
		// log('\t gid: ' + gid);

		let og = getGlyph(gid, true);
		if(og) og = new Glyph(clone(og, 'convertComponentInstanceToGlyph'));

		let newPaths = [];
		let tempglyph;

		if(og.paths){
			for(let s=0; s<og.paths.length; s++){
				if(og.paths[s].objtype === 'componentinstance'){
					tempglyph = og.paths[s].makeTransformedGlyph();
					newPaths = newPaths.concat(tempglyph.paths);

				} else {
					newPaths.push(og.paths[s]);
				}
			}

			og.paths = newPaths;
		} else {
			og.paths = [];
		}

		// log(og);
		// log(`ComponentInstance.cloneAndFlatten`, 'end');
		return og;
	}
*/

	// --------------------------------------------------------------
	// Export to different languages
	// --------------------------------------------------------------

	/**
	 * Make a PostScript path from this path
	 * PostScript paths use relative MoveTo commands, so
	 * this path must know about where the last path left off
	 * @param {number} lastX - x from previous path
	 * @param {number} lastY - y from previous path
	 * @returns {string} - PostScript path data
	 */
	makePostScript(lastX, lastY) {
		const g = this.transformedGlyph;
		let re;
		let part;
		for (let s = 0; s < g.paths.length; s++) {
			part = g.paths[s].makePostScript(lastX, lastY);
			lastX = part.lastX;
			lastY = part.lastY;
			re += part.re;
		}
		return {
			re: re,
			lastX: lastX,
			lastY: lastY,
		};
	}

	// --------------------------------------------------------------
	// Parity methods, shared between Paths and ComponentInstances
	// --------------------------------------------------------------

	/**
	 * updatePathPosition
	 * @param {number} dx - delta x
	 * @param {number} dy - delta y
	 */
	updatePathPosition(dx, dy) {
		// log('ComponentInstance.updatePathPosition', 'start');
		// log('passed dx/dy/force: ' + dx + ' / ' + dy + ' / ' + force);
		// log('translate was: ' + this.translateX + ' / ' + this.translateY);
		dx = parseFloat(dx) || 0;
		dy = parseFloat(dy) || 0;
		this.translateX = 1 * this.translateX + dx;
		this.translateY = 1 * this.translateY + dy;
		// log('translate now: ' + this.translateX + ' / ' + this.translateY);
		// log('ComponentInstance.updatePathPosition', 'end');
	}

	/**
	 * setPathPosition
	 * @param {number} nx - new x value
	 * @param {number} ny - new y value
	 */
	setPathPosition(nx, ny) {
		// log('ComponentInstance.setPathPosition', 'start');
		// log('passed nx/ny/force: ' + nx + ' / ' + ny + ' / ' + force);
		// log('translate was: ' + this.translateX + ' / ' + this.translateY);
		// TODO fix project access
		// const linkMaxes = getCurrentProject().getGlyph(this.link).maxes;
		const linkMaxes = { xMin: 0, yMax: 0 };

		nx = parseFloat(nx);
		ny = parseFloat(ny);
		// log('linkMaxes ' + json(linkMaxes, true));
		if (!isNaN(nx)) this.translateX = nx - linkMaxes.xMin;
		if (!isNaN(ny)) this.translateY = ny - linkMaxes.yMax;
		// log('translate now: ' + this.translateX + ' / ' + this.translateY);
		// log('ComponentInstance.setPathPosition', 'end');
	}

	/**
	 * updatePathSize
	 * @param {number} dw - delta width
	 * @param {number} dh - delta height
	 * @param {boolean} ratioLock - maintain aspect ratio
	 */
	updatePathSize(dw, dh, ratioLock) {
		// log('ComponentInstance.updatePathSize', 'start');
		// log('passed dw/dh/ratioLock: ' + dw + ' / ' + dh + ' / ' + ratioLock);
		if (dw !== false) dw = parseFloat(dw) || 0;
		if (dh !== false) dh = parseFloat(dh) || 0;
		if (ratioLock) {
			const ts = this.transformedGlyph.maxes;
			const w = ts.xMax - ts.xMin;
			const h = ts.yMax - ts.yMin;
			if (Math.abs(dw) > Math.abs(dh)) {
				dh = dw * (h / w);
			} else {
				dw = dh * (w / h);
			}
		}
		// log('translate was: ' + this.scaleW + ' / ' + this.scaleH);
		this.scaleW = 1 * this.scaleW + dw;
		this.scaleH = 1 * this.scaleH + dh;
		if (this.rotation === 0) this.rotateFirst = false;
		// log('translate now: ' + this.scaleW + ' / ' + this.scaleH);
		// log('ComponentInstance.updatePathSize', 'end');
	}

	/**
	 * setPathSize
	 * @param {number} nw - new width
	 * @param {number} nh - new height
	 * @param {boolean} ratioLock - maintain aspect ratio
	 */
	setPathSize(nw, nh, ratioLock) {
		// TODO fix project access
		// const linkMaxes = getCurrentProject().getGlyph(this.link).maxes;
		const linkMaxes = { xMin: 0, yMax: 0 };

		const dx = nw ? nw * 1 - linkMaxes.xMin : 0;
		const dy = nh ? nh * 1 - linkMaxes.yMax : 0;
		this.updatePathPosition(dx, dy, ratioLock);
	}

	/**
	 * flipEW
	 * @param {number} mid - x value about which to flip
	 * @returns {ComponentInstance} - reference to this component instance
	 */
	flipEW(mid) {
		this.isFlippedEW = !this.isFlippedEW;
		if (mid) {
			const g = this.transformedGlyph.maxes;
			this.translateX += mid - g.xMax + mid - g.xMin;
		}
		if (this.rotation === 0) this.rotateFirst = false;
		return this;
	}

	/**
	 * flipNS
	 * @param {number} mid - y value about which to flip
	 * @returns {ComponentInstance} - reference to this component instance
	 */
	flipNS(mid) {
		this.isFlippedNS = !this.isFlippedNS;
		if (mid) {
			const g = this.transformedGlyph.maxes;
			this.translateY += mid - g.yMax + mid - g.yMin;
		}
		if (this.rotation === 0) this.rotateFirst = false;
		return this;
	}

	/**
	 * rotate
	 * @param {number} angle - how much to rotate (radians)
	 * @returns {ComponentInstance} - reference to this component instance
	 */
	rotate(angle) {
		// log('ComponentInstance.rotate', 'start');
		// log('passed ' + angle);
		const degrees = deg(angle);
		// log('deg ' + degrees);
		// log('was ' + this.rotation);
		// if(this.isFlippedEW || this.isFlippedNS) degrees *= -1;
		this.rotation = (this.rotation + degrees) % 360;
		if (this.scaleH === 0 && this.scaleW === 0 && !this.isFlippedEW && !this.isFlippedNS) {
			this.rotateFirst = true;
		}
		// log('is now ' + this.rotation);
		// log('ComponentInstance.rotate', 'end');
		return this;
	}
}

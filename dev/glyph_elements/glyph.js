import GlyphElement from './glyphelement.js';
import Maxes from './maxes.js';
import Shape from './shape.js';
import ComponentInstance from './componentinstance.js';
import {getGlyph, getProject} from '../app/globalgetters.js';
import {clone, hasNonValues, isVal} from '../app/functions.js';
import {parseUnicodeInput} from '../app/unicode.js';


/**
 * Glyph Element > Glyph
 * A single collection of outlines that could
 * either represent a character, or be used as
 * part of another character through components.
 * The following objects are stored as Glyph
 * Objects:
 *   Glyphs (Characters)
 *   Ligatures
 *   Components
 */
export default class Glyph extends GlyphElement {
    /**
     * Create a Glyph
     * @param {string} hex
     * @param {boolean} isAutoWide
     * @param {number} glyphWidth
     * @param {number} leftSideBearing
     * @param {number} rightSideBearing
     * @param {boolean} ratioLock
     * @param {boolean} shapes
     * @param {boolean} usedIn
     * @param {boolean} contextGlyphs
     */
    constructor({
        hex = false,
        shapes = [],
        isAutoWide = true,
        glyphWidth = 0,
        leftSideBearing = false,
        rightSideBearing = false,
        ratioLock = false,
        usedIn = [],
        contextGlyphs = '',
    } = {}) {
        super();
        this.hex = hex || false;
        this.shapes = shapes;
        this.isAutoWide = isAutoWide;
        this.glyphWidth = glyphWidth;
        this.leftSideBearing = leftSideBearing;
        this.rightSideBearing = rightSideBearing;
        this.ratioLock = ratioLock;
        this.usedIn = usedIn;
        this.contextGlyphs = contextGlyphs;

        this.changed();
    }


    // --------------------------------------------------------------
    // Common Glyphr Studio object methods
    // --------------------------------------------------------------

    /**
     * Any change that updates the shape of any part of a glyph
     * gets bubbled up through the GlyphElement hierarchy
     */
    changed() {
        this.calcMaxes();
        for (let g=0; g<this.usedIn.length; g++) {
            getGlyph(this.usedIn[g]).changed();
        }
    }

    /**
     * Export object properties that need to be saved to a project file
     * @param {boolean} verbose - export some extra stuff that makes the saved object more readable
     * @returns {*}
     */
    save(verbose = false) {
        let re = {
            objType: this.objType,
            name: this.name,
            hex: this._hex,
        };

        if (isAutoWide !== true) re.isAutoWide = this.isAutoWide;
        if (glyphWidth !== 0) re.glyphWidth = this.glyphWidth;
        if (leftSideBearing !== false) re.leftSideBearing = this.leftSideBearing;
        if (rightSideBearing !== false) re.rightSideBearing = this.rightSideBearing;
        if (ratioLock !== false) re.ratioLock = this.ratioLock;
        if (usedIn !== []) re.usedIn = this.usedIn;
        if (contextGlyphs !== '') re.contextGlyphs = this.contextGlyphs;

        if (this.shapes.length) {
            re.shapes = [];
            for (let s=0; s<this.shapes.length; s++) re.shapes.push(this.shapes[s].save(verbose));
        }

        if (!verbose) {
            delete re.objType;
            delete re.name;
        }

        return re;
    }

/*
    changed(descend, ascend) {
        this.cache = {};
        if (ascend) {
            for (let g = 0; g < this.usedIn.length; g++) {
                getGlyph(this.usedIn[g]).changed(descend, ascend);
            }
        }
        if (descend) {
            for (let s = 0; s < this.shapes.length; s++)
                this.shapes[s].changed(descend, ascend);
        }
        this.calcMaxes();
    }
    print(indents) {
        indents = indents || '   ';
        let re = (indents + 'GLYPH ' + this.name + '\n');
        let ts;
        for (let s = 0; s < this.shapes.length; s++) {
            ts = this.shapes[s];
            if (ts.objType === 'Shape') {
                re += (indents + '-' + s + '-' + ts.name + ' ' + json(ts.path.maxes, true) + '\n');
            } else if (ts.objType === 'ComponentInstance') {
                re += (indents + '~' + s + '~' + ts.name + '\n');
                re += getGlyph(ts.link).map(indents + '   ');
            }
        }
        return re;
    }
*/
    // --------------------------------------------------------------
    // Getters
    // --------------------------------------------------------------

    /**
     * get hex
     * @returns {string}
     */
    get hex() {
        return this._hex;
    }

    /**
     * get shapes
     * @returns {array}
     */
    get shapes() {
        return this._shapes;
    }

    /**
     * get isAutoWide
     * @returns {boolean}
     */
    get isAutoWide() {
        return this._isAutoWide;
    }

    /**
     * get glyphWidth
     * @returns {number}
     */
    get glyphWidth() {
        return this._glyphWidth;
    }

    /**
     * get leftSideBearing
     * @returns {number}
     */
    get leftSideBearing() {
        return this._leftSideBearing;
    }

    /**
     * get rightSideBearing
     * @returns {number}
     */
    get rightSideBearing() {
        return this._rightSideBearing;
    }

    /**
     * get ratioLock
     * @returns {boolean}
     */
    get ratioLock() {
        return this._ratioLock;
    }

    /**
     * get usedIn
     * @returns {array}
     */
    get usedIn() {
        return this._usedIn;
    }

    /**
     * get contextGlyphs
     * @returns {string}
     */
    get contextGlyphs() {
        return this._contextGlyphs;
    }

    // computed properties

    /**
     * Get X position
     * @returns {number}
     */
    get x() {
        return this.maxes.xMin;
    }

    /**
     * Get Y position
     * @returns {number}
     */
    get y() {
        return this.maxes.yMax;
    }

    /**
     * Get Width
     * @returns {number}
     */
    get width() {
        if (this.isAutoWide) {
            let w = this.maxes.xMax - this.maxes.xMin;
            return Math.max(w, 0);
        } else {
            return this.glyphWidth;
        }
    }

    /**
     * Get Height
     * @returns {number}
     */
    get height() {
        let h = this.maxes.yMax - this.maxes.yMin;
        return Math.max(h, 0);
    }

    /**
     * get maxes
     * @returns {boolean}
     */
    get maxes() {
        // debug('\n Glyph.getMaxes - START ' + this.name);
        if (!this._maxes || hasNonValues(this._maxes)) {
            this.calcMaxes();
        }
        if (this.shapes.length) {
            if (this._maxes.xMin === this._maxes.maxBounds.xMin ||
                this._maxes.xMax === this._maxes.maxBounds.xMax ||
                this._maxes.yMin === this._maxes.maxBounds.yMin ||
                this._maxes.yMax === this._maxes.maxBounds.yMax
            ) {
                this.calcMaxes();
            }
        }
        // debug('\t returning ' + json(this.maxes));
        // debug(' Glyph.getMaxes - END ' + this.name + '\n');
        return this._maxes;
    }

    // Computed properties

    /**
     * get name
     * @returns {string}
     */
    get name() {
        return getUnicodeName(this.hex);
    }

    /**
     * get char name
     * @returns {string}
     */
    get char() {
        return getGlyphName(this.hex);
    }

    /**
     * get HTML Char Code
     * @returns {String}
     */
    get charCode() {
        let code = hexToHTML(this.hex);
        return code || '';
    }

    /**
     * get Left Side Bearing
     * @returns {number}
     */
    get lsb() {
        if (this.leftSideBearing === false) {
            return getProject().projectSettings.defaultLSB;
        } else {
            return this.leftSideBearing;
        }
    }

    /**
     * get Right Side Bearing
     * @returns {number}
     */
    get rsb() {
        if (this.rightSideBearing === false) {
            return getProject().projectSettings.defaultRSB;
        } else {
            return this.rightSideBearing;
        }
    }

    /**
     * get Advance Width
     * @returns {number}
     */
    get advanceWidth() {
        if (this.isAutoWide) this.width + this.lsb + this.rsb;
        else return this.glyphWidth;
    }

    /**
     * get SVG Path Data
     * @returns {string}
     */
    get svgPathData() {
        if (this.cache.svgPathData) return this.cache.svgPathData;
        this.cache.svgPathData = this.makeSVGPathData();
        return this.cache.svgPathData;
    }


    // --------------------------------------------------------------
    // Setters
    // --------------------------------------------------------------

    /**
     * set hex
     * @param {string} hex
     * @returns {Glyph} - reference to this Glyph
     */
    set hex(hex) {
        hex = parseUnicodeInput(hex);
        hex = hex.join? hex.join('') : '0x0000';
        this._hex = hex;
        return this;
    }

    /**
     * set shapes
     * @param {array} shapes
     * @returns {Glyph} - reference to this Glyph
     */
    set shapes(shapes = []) {
        if (shapes && shapes.length) {
            for (let i = 0; i < shapes.length; i++) {
                if (isVal(shapes[i].link)) {
                    // debug('\t hydrating ci ' + shapes[i].name);
                    this._shapes[i] = new ComponentInstance(shapes[i]);
                    this._shapes[i].parent = this;
                } else if (isVal(shapes[i].name)) {
                    // debug('\t hydrating sh ' + shapes[i].name);
                    this._shapes[i] = new Shape(shapes[i]);
                    this._shapes[i].parent = this;
                }
            }
        } else {
            this._shapes = [];
        }

        return this;
    }

    /**
     * set isAutoWide
     * @param {boolean} isAutoWide
     * @returns {Glyph} - reference to this Glyph
     */
    set isAutoWide(isAutoWide) {
        this._isAutoWide = !!isAutoWide;
        return this;
    }

    /**
     * set glyphWidth
     * @param {number} glyphWidth
     * @returns {Glyph} - reference to this Glyph
     */
    set glyphWidth(glyphWidth) {
        this._glyphWidth = parseFloat(glyphWidth);
        if (isNaN(this._glyphWidth)) this._glyphWidth = 0;
        return this;
    }

    /**
     * set leftSideBearing
     * @param {number} leftSideBearing
     * @returns {Glyph} - reference to this Glyph
     */
    set leftSideBearing(leftSideBearing) {
        this._leftSideBearing = parseFloat(leftSideBearing);
        if (isNaN(this._leftSideBearing)) this._leftSideBearing = 0;
        return this;
    }

    /**
     * set rightSideBearing
     * @param {number} rightSideBearing
     * @returns {Glyph} - reference to this Glyph
     */
    set rightSideBearing(rightSideBearing) {
        this._rightSideBearing = parseFloat(rightSideBearing);
        if (isNaN(this._rightSideBearing)) this._rightSideBearing = 0;
        return this;
    }

    /**
     * set ratioLock
     * @param {boolean} ratioLock
     * @returns {Glyph} - reference to this Glyph
     */
    set ratioLock(ratioLock) {
        this._ratioLock = !!ratioLock;
        return this;
    }

    /**
     * set usedIn
     * @param {array} usedIn
     * @returns {Glyph} - reference to this Glyph
     */
    set usedIn(usedIn) {
        this._usedIn = usedIn;
        return this;
    }

    /**
     * set contextGlyphs
     * @param {string} contextGlyphs
     * @returns {Glyph} - reference to this Glyph
     */
    set contextGlyphs(contextGlyphs) {
        this._contextGlyphs = contextGlyphs;
        return this;
    }

    // computed properties

    /**
     * Set X position
     * @param {number} x
     * @returns {Glyph} - reference to this Glyph
     */
    set x(x) {
        this.setGlyphPosition(x, false);
        return this;
    }

    /**
     * Set Y position
     * @param {number} y
     * @returns {Glyph} - reference to this Glyph
     */
    set y(y) {
        this.setGlyphPosition(false, y);
        return this;
    }

    /**
     * Set Width
     * @param {number} w
     * @returns {Glyph} - reference to this Glyph
     */
    set width(w) {
        this.setGlyphSize(w, false);
        return this;
    }

    /**
     * Set Height
     * @param {number} h
     * @returns {Glyph} - reference to this Glyph
     */
    set height(h) {
        this.setGlyphSize(false, h);
        return this;
    }

    /**
     * Set Maxes
     * @param {Maxes} maxes
     * @returns {Glyph} - reference to this Glyph
     */
    set maxes(maxes) {
        this._maxes = new Maxes(maxes);
        return this;
    }


    // --------------------------------------------------------------
    // Transform & move
    // --------------------------------------------------------------

    /**
     * Move all the shapes in this glyph as one group
     * @param {number} nx - new x
     * @param {number} ny - new y
     */
    setGlyphPosition(nx, ny) {
        // debug('Glyph.setGlyphPosition - START');
        // debug('\t nx/ny/force: ' + nx + ' ' + ny + ' ' + force);
        let m = this.maxes;
        if (nx !== false) nx = parseFloat(nx);
        if (ny !== false) ny = parseFloat(ny);
        let dx = (nx !== false) ? (nx - m.xMin) : 0;
        let dy = (ny !== false) ? (ny - m.yMax) : 0;
        this.updateGlyphPosition(dx, dy);
        // debug(' Glyph.setGlyphPosition - END\n');
    }

    /**
     * Update all the shapes' positions in this glyph as one group
     * @param {number} dx - delta x
     * @param {number} dy - delta y
     */
    updateGlyphPosition(dx, dy) {
        // debug('\n Glyph.updateGlyphPosition - START ' + this.name);
        // debug('\t dx/dy/force: ' + dx + ' ' + dy + ' ' + force);
        // debug('\t number of shapes: ' + this.shapes.length);
        dx = parseFloat(dx) || 0;
        dy = parseFloat(dy) || 0;
        let cs = this.shapes;
        for (let i = 0; i < cs.length; i++) {
            cs[i].updateShapePosition(dx, dy);
        }
        this.changed();
        // debug(' Glyph.updateGlyphPosition - END ' + this.name + '\n\n');
    }

    /**
     * Set all the sizes of the shapes in this glyph as one group
     * @param {number} nw - new width
     * @param {number} nh - new height
     * @param {boolean} ratioLock - true to scale width and height 1:1
     */
    setGlyphSize(nw, nh, ratioLock) {
        let m = this.maxes;
        if (nw !== false) nw = parseFloat(nw);
        if (nh !== false) nh = parseFloat(nh);
        let ch = (m.yMax - m.yMin);
        let cw = (m.xMax - m.xMin);
        let dw = (nw !== false) ? (nw - cw) : 0;
        let dh = (nh !== false) ? (nh - ch) : 0;
        if (ratioLock) {
            if (Math.abs(nh) > Math.abs(nw)) dw = (cw * (nh / ch)) - cw;
            else dh = (ch * (nw / cw)) - ch;
        }
        this.updateGlyphSize(dw, dh, false);
    }

    /**
     * Update all the sizes of the shapes in this glyph as one group
     * @param {number} dw - delta width
     * @param {number} dh - delta height
     * @param {boolean} ratioLock - true to scale width and height 1:1
     */
    updateGlyphSize(dw, dh, ratioLock) {
        // debug('\n Glyph.updateGlyphSize - START ' + this.name);
        // debug('\t number of shapes: ' + this.shapes.length);
        // debug('\t dw dh rl:\t' + dw + '/' + dh + '/' + ratioLock);
        let m = this.maxes;
        if (dw !== false) dw = parseFloat(dw) || 0;
        if (dh !== false) dh = parseFloat(dh) || 0;
        // debug('\t adjust dw/dh:\t' + dw + '/' + dh);
        let oldW = m.xMax - m.xMin;
        let oldH = m.yMax - m.yMin;
        let newW = (oldW + dw);
        let newH = (oldH + dh);
        if (Math.abs(newW) < 1) newW = 1;
        if (Math.abs(newH) < 1) newH = 1;
        // debug('\t new w/h:\t' + newW + '/' + newH);
        let ratioHeight = (newH / oldH);
        let ratioWidth = (newW / oldW);
        // debug('\t ratio dw/dh:\t' + ratioWidth + '/' + ratioHeight);
        if (ratioLock) {
            // Assuming only one will be nonzero
            // if(Math.abs(ratioHeight) > Math.abs(ratioWidth)) ratioWidth = ratioHeight;
            // else ratioHeight = ratioWidth;
            if (dw !== 0 && dh === 0) ratioHeight = ratioWidth;
            else ratioWidth = ratioHeight;
        }
        // debug('\t ratio dw/dh:\t' + ratioWidth + '/' + ratioHeight);

        let shape;
        let shapeMaxes;
        let oldShapeWidth;
        let oldShapeHeight;
        let oldShapeX;
        let oldShapeY;
        let newShapeWidth;
        let newShapeHeight;
        let newShapeX;
        let newShapeY;
        let deltaWidth;
        let deltaHeight;
        let deltaX;
        let deltaY;

        // debug('\t Before Maxes ' + json(m, true));
        for (let i = 0; i < this.shapes.length; i++) {
            shape = this.shapes[i];
            // debug('\t >>> Updating ' + shape.objType + ' ' + i + '/' + this.shapes.length + ' : ' + shape.name);
            shapeMaxes = shape.maxes;

            // scale
            oldShapeWidth = shapeMaxes.xMax - shapeMaxes.xMin;
            newShapeWidth = oldShapeWidth * ratioWidth;

            if (ratioWidth === 0) deltaWidth = false;
            else deltaWidth = newShapeWidth - oldShapeWidth;

            oldShapeHeight = shapeMaxes.yMax - shapeMaxes.yMin;
            newShapeHeight = oldShapeHeight * ratioHeight;

            if (ratioHeight === 0) deltaHeight = false;
            else deltaHeight = newShapeHeight - oldShapeHeight;

            // debug('\t Shape ' + i + ' dw dh ' + deltaWidth + ' ' + deltaHeight);
            shape.updateShapeSize(deltaWidth, deltaHeight, false);

            // move
            oldShapeX = shapeMaxes.xMin - m.xMin;
            newShapeX = oldShapeX * ratioWidth;

            if (ratioWidth === 0) deltaX = false;
            else deltaX = newShapeX - oldShapeX;

            oldShapeY = shapeMaxes.yMin - m.yMin;
            newShapeY = oldShapeY * ratioHeight;

            if (ratioHeight === 0) deltaY = false;
            else deltaY = newShapeY - oldShapeY;

            // debug('\t Shape Pos ' + i + ' dx dy ' + deltaX + ' ' + deltaY);
            s.updateShapePosition(deltaX, deltaY, true);
        }

        this.changed();
        // debug('\t Afters Maxes ' + json(this.maxes, true));
        // debug(' Glyph.updateGlyphSize - END ' + this.name + '\n');
    }

    /**
     * Flips this glyph about a horizontal line
     * @param {number} mid - y value about which to flip
     * @returns {Glyph} - reference to this glyph
     */
    flipNS(mid) {
        let m = this.maxes;
        mid = isVal(mid) ? mid : ((m.yMax - m.yMin) / 2) + m.yMin;
        for (let s = 0; s < this.shapes.length; s++) {
            this.shapes[s].flipNS(mid);
        }
        this.changed();

        return this;
    }

    /**
     * Flips this glyph about a vertical line
     * @param {number} mid - y value about which to flip
     * @returns {Glyph} - reference to this glyph
     */
    flipEW(mid) {
        // debug('\n Glyph.flipEW - START');
        // debug('\t ' + this.name);
        // debug('\t passed mid = ' + mid);
        let m = this.maxes;
        mid = isVal(mid) ? mid : ((m.xMax - m.xMin) / 2) + m.xMin;
        // debug('\t mid = ' + mid);
        // debug('\t maxes = ' + json(m, true));
        for (let s = 0; s < this.shapes.length; s++) {
            this.shapes[s].flipEW(mid);
        }
        this.changed();
        // debug('\t maxes = ' + json(this.maxes, true));
        return this;
    }

    /**
     * Rotate about a point
     * @param {number} angle - how much to rotate
     * @param {XYPoint} about - x/y center of rotation
     * @returns {Glyph} - reference to this glyph
     */
    rotate(angle, about) {
        about = about || this.center;
        for (let s = 0; s < this.shapes.length; s++) {
            this.shapes[s].rotate(angle, about);
        }
        this.changed();

        return this;
    }

    /**
     * Reverses the order of the path points in all the paths,
     * thus reversing the winding
     */
    reverseWinding() {
        for (let s = 0; s < this.shapes.length; s++) {
            this.shapes[s].reverseWinding();
        }
        this.changed();
    }


    // --------------------------------------------------------------
    // Alignment
    // --------------------------------------------------------------


    /**
     * Move all the shapes to align with an edge
     * @param {string} edge - which edge to align all the shapes to
     */
    alignShapes(edge) {
        // debug('\n Glyph.alignShapes - START');
        // debug('\t edge: ' + edge);
        let target;
        let offset;

        if (edge === 'top') {
            target = -999999;
            this.shapes.forEach(function(v) {
                target = Math.max(target, v.maxes.yMax);
            });
            // debug('\t found TOP: ' + target);
            this.shapes.forEach(function(v) {
                v.setShapePosition(false, target);
            });
        } else if (edge === 'middle') {
            target = this.center.y;
            // debug('\t found MIDDLE: ' + target);
            this.shapes.forEach(function(v) {
                offset = v.center.y;
                v.updateShapePosition(false, (target - offset));
            });
        } else if (edge === 'bottom') {
            target = 999999;
            this.shapes.forEach(function(v) {
                target = Math.min(target, v.maxes.yMin);
            });
            // debug('\t found BOTTOM: ' + target);
            this.shapes.forEach(function(v) {
                offset = v.maxes.yMin;
                v.updateShapePosition(false, (target - offset));
            });
        } else if (edge === 'left') {
            target = 999999;
            this.shapes.forEach(function(v) {
                target = Math.min(target, v.maxes.xMin);
            });
            // debug('\t found LEFT: ' + target);
            this.shapes.forEach(function(v) {
                v.setShapePosition(target, false);
            });
        } else if (edge === 'center') {
            target = this.center.x;
            // debug('\t found CENTER: ' + target);
            this.shapes.forEach(function(v) {
                offset = v.center.x;
                v.updateShapePosition((target - offset), false);
            });
        } else if (edge === 'right') {
            target = -999999;
            this.shapes.forEach(function(v) {
                target = Math.max(target, v.maxes.xMax);
            });
            // debug('\t found RIGHT: ' + target);
            this.shapes.forEach(function(v) {
                offset = v.maxes.xMax;
                v.updateShapePosition((target - offset), false);
            });
        }

        this.changed();
        // debug(' Glyph.alignShapes - END\n');
    }


    // --------------------------------------------------------------
    // Calculating dimensions
    // --------------------------------------------------------------

    /**
     * Calculate the overall maxes for this Glyph
     * @returns {Maxes}
     */
    calcMaxes() {
        // debug('\n Glyph.calcMaxes - START ' + this.name);
        let tm;
        if (this.shapes.length > 0) {
            for (let jj = 0; jj < this.shapes.length; jj++) {
                // debug('\t ++++++ START shape ' + jj);
                // debug(this.shapes[jj]);
                if (this.shapes[jj].getMaxes) {
                    tm = this.shapes[jj].maxes;
                    // debug('\t before ' + json(tm, true));
                    this.maxes = getOverallMaxes([tm, this.maxes]);
                    // debug('\t afters ' + json(tm, true));
                    // debug('\t ++++++ END shape ' + jj + ' - ' + this.shapes[jj].name);
                }
            }
        } else {
            this.maxes = {'xMax': 0, 'xMin': 0, 'yMax': 0, 'yMin': 0};
        }

        // debug(' Glyph.calcMaxes - END ' + this.name + '\n');
        return this.maxes;
    }


    // --------------------------------------------------------------
    // COMPONENT STUFF
    // --------------------------------------------------------------

    /**
     * Searches this Glyph for any Component Instance
     * @returns {boolean}
     */
    containsComponents() {
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType === 'ComponentInstance') {
                return true;
            }
        }
        return false;
    }

    /**
     * Component Instances contain links to other Glyphs, or
     * other Component Instances.  Circular links cause the world
     * to explode, so let's check for those before we add a new link.
     * @param {string} cid - ID of component to look for
     * @returns {boolean}
     */
    canAddComponent(cid) {
        // debug('\n Glyph.canAddComponent - START');
        let myID = '' + getMyID(this);
        // debug('\t adding ' + cid + ' to (me) ' + myID);
        if (myID === cid) return false;
        if (this.usedIn.length === 0) return true;
        let downlinks = this.collectAllDownstreamLinks([], true);
        downlinks = downlinks.filter(function(elem, pos) {
            return downlinks.indexOf(elem) === pos;
        });
        let uplinks = this.collectAllUpstreamLinks([]);
        uplinks = uplinks.filter(function(elem, pos) {
            return uplinks.indexOf(elem) === pos;
        });
        // debug('\t downlinks: ' + downlinks);
        // debug('\t uplinks: ' + uplinks);
        if (downlinks.indexOf(cid) > -1) return false;
        if (uplinks.indexOf(cid) > -1) return false;

        return true;
    }

    /**
     * Look "down" through component instances, collecting IDs
     * @param {array} re - collection of glyph IDs
     * @param {boolean} excludePeers - At the top level, no need to collect IDs
     * @returns {array}
     */
    collectAllDownstreamLinks(re = [], excludePeers = false) {
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType === 'ComponentInstance') {
                re = re.concat(getGlyph(this.shapes[s].link).collectAllDownstreamLinks(re));
                if (!excludePeers) re.push(this.shapes[s].link);
            }
        }
        return re;
    }

    /**
     * Look "up" through the usedIn array to collect IDs
     * @param {array} re - collection of glyph IDs
     * @returns {array}
     */
    collectAllUpstreamLinks(re = []) {
        for (let g = 0; g < this.usedIn.length; g++) {
            re = re.concat(getGlyph(this.usedIn[g]).collectAllUpstreamLinks(re));
            re.push(this.usedIn[g]);
        }
        return re;
    }

    /**
     * This method is called on Glyphs just before they are deleted
     * to clean up all the component instance linking
     * @param {string} thisID - ID of the glyph being deleted
     */
    deleteLinks(thisID) {
        // debug('\n Glyph.deleteLinks - START');
        // debug('\t passed this as id: ' + thisID);
        // Delete upstream Component Instances
        let upstreamGlyph;
        for (let c = 0; c < this.usedIn.length; c++) {
            upstreamGlyph = getGlyph(this.usedIn[c]);
            // debug('\t removing from ' + upstreamGlyph.name);
            // debug(upstreamGlyph.shapes);
            for (let u = 0; u < upstreamGlyph.shapes.length; u++) {
                if (upstreamGlyph.shapes[u].objType === 'ComponentInstance' && upstreamGlyph.shapes[u].link === thisID) {
                    upstreamGlyph.shapes.splice(u, 1);
                    u--;
                }
            }
            // debug(upstreamGlyph.shapes);
        }
        // Delete downstream usedIn array values
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType === 'ComponentInstance') {
                removeFromUsedIn(this.shapes[s].link, thisID);
            }
        }
    }


    // --------------------------------------------------------------
    // Drawing
    // --------------------------------------------------------------
    /**
     * Draw a Glyph to a canvas
     * @param {object} ctx - canvas context
     * @param {object} view - x/y/z view object
     * @param {number} alpha - transparency between 0 and 1
     * @param {boolean} addLSB - optionally move everything to account for LSB
     * @param {string} fill - glyph fill color
     * @returns {number} - Advance Width, according to view.z
     */
    drawGlyph(ctx, view = {x: 0, y: 0, z: 1}, alpha = 1, addLSB = false, fill = '#000') {
        // debug('\n Glyph.drawGlyph - START ' + this.name);
        // debug('\t view ' + json(view, true));
        let sl = this.shapes;
        let shape;
        let drewShape;

        if (addLSB && this.isAutoWide) view.dx += (this.getLSB() * view.dz);

        ctx.beginPath();
        for (let j = 0; j < sl.length; j++) {
            shape = sl[j];
            if (shape.visible) {
                // debug('\t ' + this.name + ' drawing ' + shape.objType + ' ' + j + ' ' + shape.name);
                drewShape = shape.drawShape(ctx, view);
                if (!drewShape) {
                    console.warn('Could not draw shape ' + shape.name + ' in Glyph ' + this.name);
                    if (shape.objType === 'ComponentInstance' && !getGlyph(shape.link)) {
                        console.warn('>>> Component Instance has bad link: ' + shape.link);
                        let i = this.shapes.indexOf(shape);
                        if (i > -1) {
                            this.shapes.splice(i, 1);
                            console.warn('>>> Deleted the Instance');
                        }
                    }
                }
            }
        }

        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.globalAlpha = alpha;
        ctx.fill('nonzero');
        ctx.globalAlpha = 1;
        // debug(' Glyph.drawGlyph - END ' + this.name + '\n');

        return (this.getAdvanceWidth() * view.dz);
    }

    /**
     * Draw points that can be multi-selected
     * @param {string} color - accent color
     */
    drawMultiSelectAffordances(color = '#000') {
        let allPoints = [];
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType !== 'ComponentInstance') {
                allPoints = allPoints.concat(this.shapes[s].path.pathPoints);
                this.shapes[s].draw_PathOutline(color, 1);
            }
        }
        draw_PathPoints(allPoints, color);
    }

    /**
     * Check to see if a Glyph shape is here, for cursor hover effect
     * @param {number} x - x to check
     * @param {number} y - y to check
     * @returns {boolean}
     */
    isHere(x, y) {
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].isHere(x, y)) return true;
        }
        return false;
    }

    /**
     * Checks to see if the cursor is over a control point, for cursor hover effect
     * @param {number} x - x to check
     * @param {number} y - y to check
     * @param {number} targetSize - hit target around point to check
     * @param {boolean} noHandles - only check for Path Points, not Handles
     * @returns {boolean}
     */
    isOverControlPoint(x, y, targetSize, noHandles) {
        let re = false;
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType !== 'ComponentInstance') {
                re = this.shapes[s].path.isOverControlPoint(x, y, targetSize, noHandles);
                if (re) return re;
            }
        }
        return false;
    }


    // --------------------------------------------------------------
    // Export to different languages
    // --------------------------------------------------------------

    /**
     * Make SVG from this Shape
     * @param {number} size - how big
     * @param {number} gutter - margin
     * @returns {string} - svg
     */
    makeSVG(size = 50, gutter = 5) {
        // debug('\n Glyph.makeSVG - START');
        let ps = getProject().projectSettings;
        let emSquare = Math.max(ps.upm, (ps.ascent - ps.descent));
        let desc = Math.abs(ps.descent);
        let charScale = (size - (gutter * 2)) / size;
        let gutterScale = (gutter / size) * emSquare;
        let vbSize = emSquare - (gutter * 2);
        let pathData = this.svgPathData;
        // Assemble SVG
        let re = '<svg version="1.1" ';
        re += 'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ';
        re += 'width="' + size + '" height="' + size + '" viewBox="0,0,' + vbSize + ',' + vbSize + '">';
        re += '<g transform="translate(' + (gutterScale) + ',' + (emSquare - desc - (gutterScale / 2)) + ') scale(' + charScale + ',-' + charScale + ')">';
        // re += '<rect x="0" y="-'+desc+'" height="'+desc+'" width="1000" fill="lime"/>';
        // re += '<rect x="0" y="0" height="'+(emSquare-desc)+'" width="1000" fill="cyan"/>';
        re += '<path d="' + pathData + '"/>';
        re += '</g>';
        re += '</svg>';
        // debug(' Glyph.makeSVG - END\n');
        return re;
    }

    /**
     * Make the data (attribute d="") for an SVG path tag
     * @returns {string}
     */
    makeSVGPathData() {
        if (this.cache.svg) return this.cache.svg;

        let sl = this.shapes;
        let pathData = '';
        let lsb = this.getLSB();
        let shape;
        let path;
        let tg;

        // Make Path Data
        for (let j = 0; j < sl.length; j++) {
            shape = sl[j];
            if (shape.visible) {
                if (shape.objType === 'ComponentInstance') {
                    tg = shape.getTransformedGlyph();
                    if (tg) pathData += tg.svgPathData;
                } else {
                    path = shape.getPath();
                    path.updatePathPosition(lsb, 0, true);
                    pathData += path.svgPathData('Glyph ' + this.name + ' Shape ' + shape.name);
                    if (j < sl.length - 1) pathData += ' ';
                }
            }
        }
        if (trim(pathData) === '') pathData = 'M0,0Z';
        this.cache.svg = pathData;
        return pathData;
    }

    /**
     * Make an OpenType.js Path
     * @param {opentype.Path} otPath
     * @returns {opentype.Path}
     */
    makeOpenTypeJsPath(otPath) {
        otPath = otPath || new opentype.Path();
        for (let s = 0; s < this.shapes.length; s++) {
            otPath = this.shapes[s].makeOpenTypeJsPath(otPath);
        }
        return otPath;
    }


    // --------------------------------------------------------------
    // Boolean Combine
    // --------------------------------------------------------------

    /**
     * Converts all the Component Instances in this Glyph to stand-alone shapes
     * @returns {Glyph}
     */
    flattenGlyph() {
        let reshapes = [];
        let ts;
        let tg;
        for (let s = 0; s < this.shapes.length; s++) {
            ts = this.shapes[s];
            if (ts.objType === 'Shape') {
                reshapes.push(clone(ts));
            } else if (ts.objType === 'ComponentInstance') {
                tg = ts.getTransformedGlyph();
                tg = tg.flattenGlyph();
                reshapes = reshapes.concat(tg.shapes);
            } else {
                // debug('\n Glyph.flattenGlyph - ERROR - none shape or ci in shapes array');
            }
        }
        this.shapes = reshapes;
        // this.calcMaxes();
        this.changed();
        return this;
    }

    /**
     * Boolean combine all shapes in this Glyph to as few shapes as possible
     * @param {boolean} dontToast - don't show progress messages
     * @param {boolean} dontResolveOverlaps - speed up process by skipping resolve overlaps
     * @returns {Glyph}
     */
    combineAllShapes(dontToast = false, dontResolveOverlaps = false) {
        // debug('\n Glyph.combineAllShapes - START - ' + this.name);
        this.flattenGlyph();
        let shapes = combineShapes(this.shapes, dontToast, dontResolveOverlaps);
        if (shapes) {
            // debug('\t new shapes');
            this.shapes = shapes;
            // debug(this.shapes);
            this.changed();
        }
        // debug(this.name + ' \t\t ' + this.shapes.length);
        // debug(' Glyph.combineAllShapes - END - ' + this.name + '\n');
        return this;
    }

    /**
     * If a path in this Glyph overlaps itself, split them into separate shapes
     */
    resolveOverlapsForAllShapes() {
        let newShapes = [];
        for (let ts = 0; ts < this.shapes.length; ts++) {
            newShapes = newShapes.concat(this.shapes[ts].resolveSelfOverlaps());
        }
        this.shapes = newShapes;
        this.changed();
    }


    // --------------------------------------------------------------
    // Methods
    // --------------------------------------------------------------

    /**
     * Copy shapes (and attributes) from one glyph to another
     * @param {string} destinationID - where to copy shapes to
     * @param {object} copyGlyphAttributes - which attributes to copy in addition to shapes
     */
    copyShapesTo(destinationID, copyGlyphAttributes = {
        srcAutoWidth: false, srcWidth: false, srcLSB: false, srcRSB: false,
    }) {
        // debug('\n Glyph.copyShapesTo - START');
        let destinationGlyph = getGlyph(destinationID, true);
        let tc;
        for (let c = 0; c < this.shapes.length; c++) {
            tc = this.shapes[c];
            if (tc.objType === 'ComponentInstance') {
                getGlyph(tc.link).addToUsedIn(destinationID);
                tc = new ComponentInstance(clone(tc));
            } else if (tc.objType === 'Shape') {
                tc = new Shape(clone(tc));
            }
            destinationGlyph.shapes.push(tc);
        }
        if (copyGlyphAttributes.srcAutoWidth) destinationGlyph.isAutoWide = this.isAutoWide;
        if (copyGlyphAttributes.srcWidth) destinationGlyph.glyphWidth = this.glyphWidth;
        if (copyGlyphAttributes.srcLSB) destinationGlyph.leftSideBearing = this.leftSideBearing;
        if (copyGlyphAttributes.srcRSB) destinationGlyph.rightSideBearing = this.rightSideBearing;
        showToast('Copied ' + this.shapes.length + ' shapes');
        destinationGlyph.changed();
        // debug('\t new shapes');
        // debug(destinationGlyph.shapes);
        // debug(' Glyph.copyShapesTo - END\n');
    }

    /**
     * Return true if there is anything to draw for this Glyph
     * @returns {boolean}
     */
    hasShapes() {
        let tg;
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].objType !== 'ComponentInstance') return true;
            else {
                tg = this.shapes[s].getTransformedGlyph();
                if (tg.hasShapes()) return true;
            }
        }
        return false;
    }

    /**
     * Clean up any shapes with zero path points
     */
    removeShapesWithZeroLengthPaths() {
        for (let s = 0; s < this.shapes.length; s++) {
            if (this.shapes[s].path && this.shapes[s].path.pathPoints.length === 0) {
                this.shapes.splice(s, 1);
                s--;
            }
        }
    }

    // --------------------------------------------------------------
    // Used-In array
    // --------------------------------------------------------------

    /**
     * When this Glyph is linked-to from another ComponentInstance, track
     * where it's being used by adding it to this.usedIn
     * @param {string} linkID - GlyphID where this Glyph is being used as a Component Instance
     */
    addToUsedIn(linkID) {
        this.usedIn.push(''+linkID);
        // sort numerically as opposed to alpha
        this.usedIn.sort(function(a, b) {
            return a-b;
        });
    }

    /**
     * Removes a link from this usedIn array
     * @param {string} linkID - GlyphID where this Glyph is being used as a Component Instance
     */
    removeFromUsedIn(linkID) {
        let id = this.usedIn.indexOf(''+linkID);
        if (id !== -1) {
            this.usedIn.splice(id, 1);
        }
    }
}

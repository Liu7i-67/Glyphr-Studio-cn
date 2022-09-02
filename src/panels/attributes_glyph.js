/**
		Panel > Attributes > Glyph
		Builds a panel of attributes for a Glyph,
		which changes based on Shape or Path Point
		selection.
**/
import { log } from "../common/functions.js";
import { addAsChildren, makeElement } from "../common/dom.js";
import { getCurrentProjectEditor } from "../app/main.js";
import { makeAttributesGroup_pathPoint, makeAttributesGroup_shape, makeInputs_position, makeInputs_size } from "./attributes.js";


export function makePanel_GlyphAttributes() {
	log('makePanel_GlyphAttributes', 'start');
	let projectEditor = getCurrentProjectEditor();
	let selShapes = projectEditor.multiSelect.shapes;
	// let selPoints = projectEditor.multiSelect.points;
	let selGlyph = projectEditor.selectedGlyph;
	// log(projectEditor);

	log(selShapes);
	log(`multiSelect length: ${selShapes.length}`);

	let glyphSection = makeElement({
		tag: 'div',
		className: 'panel__section',
		innerHTML: '<h3>Glyph</h3>'
	});
	addAsChildren(glyphSection, makeInputs_position(selGlyph));
	addAsChildren(glyphSection, makeInputs_size(selGlyph));

	let shapesSection = false;
	let componentsSection = false;
	let pathPointSection = false;
	if(selShapes.length > 0) {
		if (selShapes.length === 1) {
			// One shape selected
			log('One shape selected');
			log(selShapes.singleton);
			if (selShapes.singleton.objType === 'ComponentInstance') {
				// component selected
				log("...Component selected");
				componentsSection = makeAttributesGroup_componentInstance(selShapes.singleton);
			} else {
				// regular shape selected
				log("...Regular shape selected");
				shapesSection = makeAttributesGroup_shape(selShapes.singleton);

				let isPointSelected = projectEditor.multiSelect.points.count() === 1;
				// if (!(_UI.selectedTool === 'pathEdit' || _UI.selectedTool === 'pathAddPoint'))
				//   isPointSelected = false;

				if (isPointSelected) {
					pathPointSection = makeAttributesGroup_pathPoint(projectEditor.multiSelect.points.singleton);
				}
			}
		} else {
			// Many shapes selected
			log('More than one shape selected');
			let virtualGlyph = selShapes.getGlyph();

			shapesSection = makeElement({
				tag: 'div',
				className: 'panel__section',
				innerHTML: `<h3>${selShapes.length} selected shapes</h3>`
			});
			addAsChildren(shapesSection, makeInputs_position(virtualGlyph));
			addAsChildren(shapesSection, makeInputs_size(virtualGlyph));
		}
	}

	// Put it all together
	let content = [];
	content.push(glyphSection);
	if (shapesSection) content.push(shapesSection);
	if (componentsSection) content.push(componentsSection);
	if (pathPointSection) content.push(pathPointSection);

	log(content);
	log('makePanel_GlyphAttributes', 'end');
	return content;
}


export function makePointButton(type, selected) {
	let color = _UI.colors.gray.l40;
	let bgcolor = 'transparent';

	if (selected) {
		color = _UI.colors.blue.l65;
		bgcolor = _UI.colors.gray.offWhite;
	}

	// log("MAKEPOINTBUTTON - " + type + " selected: " + selected + " color: " + color);
	let re = '';

	re +=
		'<button class="pointtypebutton" style="background-color:' +
		bgcolor +
		';" ';
	re +=
		'onclick="_UI.multiSelect.points.setPointType(\'' +
		type +
		"'); historyPut('Point Type: " +
		type +
		"'); redraw({calledBy:'pointDetails'});\" ";
	re += 'title="point type: ' + type + '" ';
	re += '>';
	re += '<svg version="1.1" ';
	re +=
		'xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ';
	re += 'x="0px" y="0px" width="20px" height="20px" viewBox="0 0 20 20" ';
	re += '><g fill="' + color + '">';
	re += '<rect x="8" y="8" width="1" height="4"/>';
	re += '<rect x="11" y="8" width="1" height="4"/>';
	re += '<rect x="8" y="8" width="4" height="1"/>';
	re += '<rect x="8" y="11" width="4" height="1"/>';
	re += '<rect x="4" y="4" width="1" height="1"/>';
	re += '<rect x="5" y="5" width="1" height="1"/>';
	re += '<rect x="6" y="6" width="1" height="1"/>';
	re += '<rect x="7" y="7" width="1" height="1"/>';
	re += '<circle cx="3" cy="3" r="1.5"/>';

	switch (type) {
		case 'corner':
			re += '<rect x="7" y="12" width="1" height="1"/>';
			re += '<rect x="6" y="13" width="1" height="1"/>';
			re += '<rect x="5" y="14" width="1" height="1"/>';
			re += '<rect x="4" y="15" width="1" height="1"/>';
			re += '<circle cx="3" cy="17" r="1.5"/>';
			break;

		case 'symmetric':
			re += '<rect x="12" y="12" width="1" height="1"/>';
			re += '<rect x="13" y="13" width="1" height="1"/>';
			re += '<rect x="14" y="14" width="1" height="1"/>';
			re += '<rect x="15" y="15" width="1" height="1"/>';
			re += '<circle cx="17" cy="17" r="1.5"/>';
			break;

		case 'flat':
			re += '<rect x="12" y="12" width="1" height="1"/>';
			re += '<rect x="13" y="13" width="1" height="1"/>';
			re += '<circle cx="15" cy="15" r="1.5"/>';
			break;
	}

	re += '</g></svg></button>';

	return re;
}

	/*
OLD GLYPH DETAILS
	if (projectEditor.nav.page === 'components') return content;

	// AUTO GLYPH WIDTH
	content += '<h3> glyph width </h3>';

	content +=`
		<label>auto calculate <span class="unit">(em units)</span></label>
		<input type="checkbox" checked="getSelectedWorkItem().isAutoWide"/>
	`;

	if (!glyph.isAutoWide) {
		content +=
			'<input type="number" id="charaw" step="' +
			spinn +
			'" ' +
			'value="' +
			round(glyph.glyphWidth, 3) +
			'" ' +
			'onchange="_UI.focusElement=this.id; getSelectedWorkItem().glyphWidth = (this.value*1); redraw({calledBy:{calledBy:\'glyphDetails\'}});">';
	} else {
		content +=
			'<input type="number" disabled="disabled" ' +
			'value="' +
			round(glyph.glyphWidth, 3) +
			'"/>';
	}

	content += '</td>' + '</tr>';

	// LEFT SIDE BEARING
	if (glyph.isAutoWide) {
		content +=
			'<tr><td colspan=2 class="detailtitle"><h3> left side bearing </h3>';

		content +=
			'<tr>' +
			'<td> use default <span class="unit">(em units)</span> </td>' +
			'<td>' +
			// checkUI(  'getSelectedWorkItem().leftSideBearing',  glyph.leftSideBearing,  true,  true) +
			'&emsp;';

		if (glyph.leftSideBearing) {
			if (glyph.leftSideBearing === true)
				glyph.leftSideBearing = getCurrentProject().projectSettings.defaultLSB;
			content +=
				'<input type="number" id="charlsb" step="' +
				spinn +
				'" ' +
				'value="' +
				glyph.leftSideBearing +
				'" ' +
				'onchange="_UI.focusElement=this.id; getSelectedWorkItem().leftSideBearing = (this.value*1); redraw({calledBy:\'glyphDetails\'});">';
		} else {
			content +=
				'<input type="number" disabled="disabled" ' +
				'value="' +
				round(getCurrentProject().projectSettings.defaultLSB, 3) +
				'"/>';
		}
		content += '</td>' + '</tr>';
	}

	// RIGHT SIDE BEARING
	if (glyph.isAutoWide) {
		content +=
			'<tr><td colspan=2 class="detailtitle"><h3> right side bearing </h3>';

		content +=
			'<tr>' +
			'<td> use default <span class="unit">(em units)</span> </td>' +
			'<td>' +
			// checkUI(  'getSelectedWorkItem().rightSideBearing',  glyph.rightSideBearing,  true,  true) +
			'&emsp;';

		if (glyph.rightSideBearing) {
			if (glyph.rightSideBearing === true)
				glyph.rightSideBearing = getCurrentProject().projectSettings.defaultRSB;
			content +=
				'<input type="number" id="charrsb" step="' +
				spinn +
				'" ' +
				'value="' +
				glyph.rightSideBearing +
				'" ' +
				'onchange="_UI.focusElement=this.id; getSelectedWorkItem().rightSideBearing = (this.value*1); redraw({calledBy:\'glyphDetails\'});">';
		} else {
			content +=
				'<input type="number" disabled="disabled" ' +
				'value="' +
				round(getCurrentProject().projectSettings.defaultRSB, 3) +
				'"/>';
		}
		content += '</td>' + '</tr>';
	}

	// USED IN
	if (glyph.usedIn.length > 0) {
		content +=
			'<tr><td colspan=2><br class="detailtitle"><h3>glyphs that use this component</h3>';
		content += '<tr><td colspan=2>';
		content += makeUsedInThumbs();
		content += '';
	}

	return content;
}

*/
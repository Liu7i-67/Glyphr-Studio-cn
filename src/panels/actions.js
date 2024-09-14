import { t } from 'i18next';
import { addCrossProjectCopyShapeOptionControls } from '../app/cross_project_actions/action_copy_shapes.js';
import { getCurrentProjectEditor, getGlyphrStudioApp } from '../app/main.js';
import { getFilesFromFilePicker } from '../app/open_project.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import {
	closeEveryTypeOfDialog,
	showError,
	showModalDialog,
	showToast,
} from '../controls/dialogs/dialogs.js';
import { eventHandlerData } from '../edit_canvas/events.js';
import { importSVGtoCurrentItem } from '../edit_canvas/events_drag_drop_paste.js';
import { rectPathFromMaxes } from '../edit_canvas/tools/new_basic_path.js';
import { addComponent } from '../pages/components.js';
import {
	showAddEditKernGroupDialog,
	showDeleteSingleLetterPairDialog,
	showFindSingleLetterPairDialog,
} from '../pages/kerning.js';
import { ComponentInstance } from '../project_data/component_instance.js';
import { Glyph } from '../project_data/glyph.js';
import { Path } from '../project_data/path.js';
import {
	addLinkToUsedIn,
	canAddComponentInstance,
	makeGlyphSVGforExport,
	removeLinkFromUsedIn,
} from '../project_editor/cross_item_actions.js';
import { saveTextFile } from '../project_editor/file_io.js';
import { makeActionButton } from './action_buttons.js';
import { makeSingleLabel } from './cards.js';
import { makeAllItemTypeChooserContent } from './item_chooser.js';
import { refreshPanel } from './panels.js';

// --------------------------------------------------------------
// Define action button data
// --------------------------------------------------------------

/**
 * Data format for creating action buttons:
 * ----------------------------------------
 * iconName = 'default',
 * iconOptions = false,
 * title = '',
 * disabled = false,
 * onClick = false
 */

export function getActionData(name) {
	// log(`getActionData`, 'start');
	// log(`name: ${name}`);
	const editor = getCurrentProjectEditor();
	let selectedPaths = editor.multiSelect.shapes.members;
	let selectedPoints = editor.multiSelect.points.members;
	let actionData = {};
	let clipBoardShapes = editor.clipboard.shapes;
	let clipBoardPathCount = clipBoardShapes ? clipBoardShapes.length : 0;
	let historyLength = editor.history.queue.length;

	// UNIVERSAL ACTIONS
	if (name === 'allActions') {
		actionData = [
			{
				iconName: 'copy',
				iconOptions: !clipBoardShapes,
				title: t('ui:character.action.copy'),
				disabled: !editor.multiSelect.shapes.length,
				id: 'actionButtonCopy',
				onClick: clipboardCopy,
			},
			{
				iconName: 'paste',
				iconOptions: !clipBoardShapes,
				title: makeActionButtonPasteTooltip(clipBoardPathCount),
				disabled: !clipBoardShapes,
				id: 'actionButtonPaste',
				onClick: clipboardPaste,
			},
			{
				iconName: 'clearClipboard',
				iconOptions: !clipBoardShapes,
				title: makeActionButtonClearClipboardTooltip(clipBoardPathCount),
				disabled: !clipBoardShapes,
				id: 'actionButtonClearClipboard',
				onClick: clipboardClear,
			},
			{
				iconName: 'undo',
				iconOptions: !historyLength,
				title: t('ui:character.action.undo'),
				disabled: !historyLength,
				id: 'actionButtonUndo',
				onClick: () => {
					editor.history.restoreState();
				},
			},
		];

		if (editor.nav.page === 'Components') {
			actionData.push({
				iconName: 'linkToGlyph',
				title: t('ui:character.action.linkToGlyph'),
				onClick: () => {
					showDialogChooseOtherItem('linkAsComponent');
				},
			});
		}
	}

	// ADDING PATH STUFF
	if (name === 'addShapeActions') {
		actionData = [
			{
				iconName: 'addPath',
				iconOptions: false,
				title: t('ui:character.action.addPath'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let newPath = editor.selectedItem.addOneShape(rectPathFromMaxes());
					editor.history.addState(`Added a default rectangle path`);
					editor.multiSelect.shapes.select(newPath);
					editor.publish('whichShapeIsSelected', newPath);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'addPath',
				iconOptions: true,
				title: t('ui:character.action.addPathTure'),
				onClick: () => {
					showDialogChooseOtherItem('addAsComponentInstance');
				},
			},
			{
				iconName: 'pastePathsFromAnotherGlyph',
				title: t('ui:character.action.pastePathsFromAnotherGlyph'),
				onClick: () => {
					showDialogChooseOtherItem('copyPaths');
				},
			},
			{
				iconName: 'pastePathsFromAnotherProject',
				title: t('ui:character.action.pastePathsFromAnotherProject'),
				onClick: () => {
					showDialogChooseItemFromOtherProject();
				},
				disabled: getGlyphrStudioApp().projectEditors.length === 1,
			},
		];
	}

	// GLYPH
	if (name === 'glyphActions') {
		actionData = [
			{
				iconName: 'flipHorizontal',
				title: t('ui:character.action.flipHorizontal'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.selectedItem.flipEW();
					editor.history.addState(`Flipped all shapes in this glyph vertically`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'flipVertical',
				title: t('ui:character.action.flipVertical'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.selectedItem.flipNS();
					editor.history.addState(`Flipped all shapes in this glyph horizontally`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'round',
				title: t('ui:character.action.round'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.selectedItem.roundAll();
					editor.history.addState(
						`Rounded all the path point and handle position values in this glyph`
					);
					editor.publish('currentItem', editor.selectedItem);
					refreshPanel();
					showToast('Values were rounded for all path points in this glyph.');
				},
			},
			{
				iconName: 'combine_unite',
				title: t('ui:character.action.combine_unite'),
				disabled: editor.selectedItem?.shapes?.length < 2,
				onClick: combineUniteAllGlyphPaths,
			},
			{
				iconName: 'deleteGlyph',
				title: t('ui:character.action.deleteGlyph'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const name = editor.selectedItem.name;
					editor.deleteSelectedItemFromProject();
					editor.history.addState(`Automatically navigated to ${editor.selectedItem.name}`);
					// log(`New item id: ${editor.selectedItemID}`);
					editor.publish('whichGlyphIsSelected', editor.selectedItemID);
					showToast(`
						Deleted ${name}.<br>
						(Don't worry, this action can be undone)<br>
						Navigated to ${editor.selectedItem.name}
					`);
				},
			},
			{
				iconName: 'exportGlyphSVG',
				title: t('ui:character.action.exportGlyphSVG'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let content = makeGlyphSVGforExport(editor.selectedItem);
					let name = editor.selectedItem.name;
					saveTextFile(name + '.svg', content);
				},
			},
			{
				iconName: 'importGlyphSVG',
				title: t('ui:character.action.importGlyphSVG'),
				onClick: async () => {
					getFilesFromFilePicker(
						async (files) => {
							// log(`ACTION importGlyphSVG`, 'start');
							// log(files);
							let file;
							if (files[0]) {
								let fileInput = files[0];
								// log(fileInput);
								if (fileInput.getFile) file = await fileInput.getFile();
								else if (fileInput.getAsFile) file = await fileInput.getAsFile();
								else file = fileInput;
							} else {
								showError(`No files were found that could be imported.`);
							}
							// log(file);
							let fileSuffix = file.name.split('.');
							fileSuffix = fileSuffix[fileSuffix.length - 1].toLowerCase();
							// log('\t fileSuffix = ' + fileSuffix);

							const reader = new FileReader();

							if (fileSuffix === 'svg') {
								reader.onload = function () {
									importSVGtoCurrentItem(
										reader.result.toString(),
										'<br>from the imported SVG file'
									);
								};

								reader.readAsText(file);
							} else {
								showToast('Only SVG files can be imported to a glyph.');
							}
						},
						{
							types: [
								{
									description: 'SVG Files',
									accept: {
										'image/svg+xml': ['.svg'],
									},
								},
							],
							excludeAcceptAllOption: true,
							multiple: false,
						}
					);
					// log(`ACTION importGlyphSVG`, 'end');
				},
			},
		];
	}

	// PATH
	if (name === 'shapeActions') {
		actionData = [
			{
				iconName: 'copy',
				iconOptions: !clipBoardShapes,
				title: t('ui:character.action.copy'),
				id: 'actionButtonCopyPath',
				onClick: clipboardCopy,
			},
			{
				iconName: 'deletePath',
				title: t('ui:character.action.deletePath'),
				onClick: deleteSelectedPaths,
			},
			{
				iconName: 'switchPathComponent',
				iconOptions: false,
				title: t('ui:character.action.switchPathComponent'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.history.addWholeProjectChangePreState('Turned a path into a component instance');
					const newComponent = new Glyph({
						objType: 'Component',
						name: `Component ${countItems(editor.project.components)}`,
					});
					editor.multiSelect.shapes.members.forEach((shape) => {
						if (shape.objType === 'Path') {
							newComponent.addOneShape(new Path(shape));
						} else if (shape.objType === 'ComponentInstance') {
							newComponent.addOneShape(new ComponentInstance(shape));
						}
						name += ' ' + shape.name;
					});
					const addedComponent = addComponent(newComponent);
					if (editor.selectedItemID) addLinkToUsedIn(addedComponent, editor.selectedItemID);
					const newShape = editor.selectedItem.addOneShape(
						new ComponentInstance({
							link: addedComponent.id,
						})
					);
					editor.multiSelect.shapes.deleteShapes();
					editor.history.addWholeProjectChangePostState();
					editor.multiSelect.shapes.select(newShape);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'flipHorizontal',
				title: t('ui:character.action.pathFlipHorizontal'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let shape = editor.multiSelect.shapes.virtualGlyph;
					shape.flipEW();
					editor.history.addState(`Flipped shape ${shape.name} horizontally`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'flipVertical',
				title: t('ui:character.action.pathFlipVertical'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let shape = editor.multiSelect.shapes.virtualGlyph;
					shape.flipNS();
					editor.history.addState(`Flipped shape ${shape.name} vertically`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'round',
				title: t('ui:character.action.round'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let shape = editor.multiSelect.shapes.virtualGlyph;
					shape.roundAll();
					editor.history.addState(
						`Rounded all the path point and handle position values in this shape`
					);
					editor.publish('currentItem', editor.selectedItem);
					refreshPanel();
					showToast('Values were rounded for all the path points in the selected paths.');
				},
			},
		];
	}

	// COMPONENT INSTANCE
	if (name === 'componentInstanceActions') {
		actionData = [
			{
				iconName: 'switchPathComponent',
				iconOptions: true,
				title: `Turn Component Instance into a Path\nTakes the selected Component Instance, and un-links it from its Root Component,\nthen adds copies of all the Root Component's paths as regular Paths to this glyph.`,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.history.addWholeProjectChangePreState('Turned a component instance into a path');
					let newShapes = [];
					editor.multiSelect.shapes.members.forEach((shape) => {
						if (shape.objType === 'ComponentInstance') {
							const sourceItem = editor.project.getItem(shape.link);
							newShapes = newShapes.concat(
								copyShapesFromTo(shape.transformedGlyph, editor.selectedItem)
							);
							if (editor.selectedItemID) removeLinkFromUsedIn(sourceItem, editor.selectedItemID);
						}
					});
					editor.multiSelect.shapes.deleteShapes();
					newShapes.forEach((shape) => editor.multiSelect.shapes.add(shape));
					editor.history.addWholeProjectChangePostState();
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'deletePath',
				iconOptions: true,
				title: 'Delete\nRemoves the currently selected component instance from this glyph.',
				onClick: deleteSelectedPaths,
			},
		];
	}

	// KERN GROUP
	if (name === 'kernGroupActions') {
		actionData = [
			{
				iconName: 'edit',
				title: 'Edit this kern group',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					showAddEditKernGroupDialog(editor.selectedKernGroup);
				},
			},
			{
				iconName: 'delete',
				title: 'Delete this kern group',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const name = editor.selectedKernGroupID;
					editor.deleteSelectedItemFromProject();
					editor.history.addState(`Automatically navigated to ${editor.selectedItemID}`);
					editor.publish('whichKernGroupIsSelected', editor.selectedItemID);
					showToast(`
						Deleted ${name}.<br>
						(Don't worry, this action can be undone)<br>
						Navigated to ${editor.selectedItem.name}
					`);
				},
			},
		];
	}

	// OTHER KERN GROUP STUFF (GLOBAL)
	if (name === 'otherKernGroupActions') {
		actionData = [
			{
				iconName: 'findSingleLetterPair',
				title: 'Find instances of a single letter pair across all kern groups',
				onClick: showFindSingleLetterPairDialog,
			},
			{
				iconName: 'deleteSingleLetterPair',
				title: 'Find and delete a single letter pair from all kern groups',
				onClick: showDeleteSingleLetterPairDialog,
			},
		];
	}

	// LAYERS
	if (name === 'layerActions') {
		actionData = [
			{
				iconName: 'moveLayerUp',
				title: t('ui:character.action.moveLayerUp'),
				disabled: selectedPaths.length !== 1,
				onClick: () => {
					moveLayer('up');
					const editor = getCurrentProjectEditor();
					editor.history.addState(`Moved layer up`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'moveLayerDown',
				title: t('ui:character.action.moveLayerDown'),
				disabled: selectedPaths.length !== 1,
				onClick: () => {
					moveLayer('down');
					const editor = getCurrentProjectEditor();
					editor.history.addState(`Moved layer down`);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
		];
	}

	// ALIGN
	if (name === 'alignActions') {
		actionData = [
			{
				title: `Align Left\nMoves all the selected shape so they are left aligned with the leftmost shape.`,
				iconName: 'align',
				iconOptions: 'left',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('left');
					editor.history.addState(`Left aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
			{
				title: `Align Center\nMoves all the selected shapes so they are center aligned between the leftmost and rightmost shape.`,
				iconName: 'align',
				iconOptions: 'center',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('center');
					editor.history.addState(`Center aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
			{
				title: `Align Right\nMoves all the selected shapes so they are right aligned with the rightmost shape.`,
				iconName: 'align',
				iconOptions: 'right',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('right');
					editor.history.addState(`Right aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
			{
				title: `Align Top\nMoves all the selected shapes so they are top aligned with the topmost shape.`,
				iconName: 'align',
				iconOptions: 'top',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('top');
					editor.history.addState(`Top aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
			{
				title: `Align Middle\nMoves all the selected shapes so they are middle aligned between the topmost and bottommost shape.`,
				iconName: 'align',
				iconOptions: 'middle',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('middle');
					editor.history.addState(`Middle aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
			{
				title: `Align Bottom\nMoves all the selected shapes so they are bottom aligned with the bottommost shape.`,
				iconName: 'align',
				iconOptions: 'bottom',
				onClick: () => {
					const editor = getCurrentProjectEditor();
					const vGlyph = editor.multiSelect.shapes;
					vGlyph.align('bottom');
					editor.history.addState(`Bottom aligned ${editor.multiSelect.shapes.length} shapes`);
					editor.publish('currentItem', vGlyph);
				},
			},
		];
	}

	// COMBINE
	if (name === 'boolActions') {
		actionData = [
			{
				iconName: 'combine_unite',
				title: `Combine Shapes: Unite\nMerges selected paths into as few paths as possible.`,
				disabled: !editor.multiSelect.shapes.length,
				onClick: () => combineSelectedPaths('unite'),
			},
			{
				iconName: 'combine_divide',
				title: `Combine Shapes: Divide\nUses the outlines of all overlapping shapes to slice and divide.`,
				disabled: !editor.multiSelect.shapes.length,
				onClick: () => combineSelectedPaths('divide'),
			},
			{
				iconName: 'combine_subtract',
				title: `Combine Shapes: Subtract\nUses the topmost shape in the stack to cut away all shapes below it.`,
				disabled: !editor.multiSelect.shapes.length,
				onClick: () => combineSelectedPaths('subtract'),
			},
			{
				iconName: 'combine_exclude',
				title: `Combine Shapes: Exclude\nOnly keeps the portions of shapes that are not overlapping.`,
				disabled: !editor.multiSelect.shapes.length,
				onClick: () => combineSelectedPaths('exclude'),
			},
			{
				iconName: 'combine_intersect',
				title: `Combine Shapes: Intersect\nOnly keeps the portion of shapes that overlap.`,
				disabled: !editor.multiSelect.shapes.length,
				onClick: () => combineSelectedPaths('intersect'),
			},
		];
	}

	// PATH POINT
	if (name === 'pointActions') {
		actionData = [
			{
				iconName: 'insertPathPoint',
				title: t('ui:character.action.insertPathPoint'),
				disabled: selectedPoints.length !== 1,
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let newPoint = editor.multiSelect.shapes.singleton.insertPathPoint(
						selectedPoints[0].pointNumber
					);
					editor.history.addState(`Inserted a new path point at position ${newPoint.pointNumber}`);
					editor.multiSelect.points.select(newPoint);
					// editor.publish('currentPathPoint', editor.multiSelect.points.singleton);
				},
			},
			{
				iconName: 'deletePathPoint',
				title: t('ui:character.action.deletePathPoint'),
				disabled: selectedPaths.length === 0,
				onClick: deleteSelectedPoints,
			},
			{
				iconName: 'resetPathPoint',
				title: t('ui:character.action.resetPathPoint'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.multiSelect.points.resetHandles();
					editor.history.addState(
						`Reset the handles for ${editor.multiSelect.points.length} path point(s)`
					);
					editor.publish('currentItem', editor.selectedItem);
				},
			},
			{
				iconName: 'round',
				title: t('ui:character.action.pointRound'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					editor.multiSelect.points.roundAll(0);
					editor.history.addState(
						`Rounded path point and handle position values for ${editor.multiSelect.points.length} path point(s)`
					);
					editor.publish('currentItem', editor.selectedItem);
					refreshPanel();
					showToast('Values were rounded for the selected path points.');
				},
			},
			{
				iconName: 'selectPreviousPathPoint',
				disabled: editor.multiSelect.points.hasMultipleParents,
				title: t('ui:character.action.selectPreviousPathPoint'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let msPoints = editor.multiSelect.points;
					let path = msPoints.members[0].parent;
					let thisIndex = msPoints.lowestSelectedPointNumber;
					let previousIndex = path.getPreviousPointNum(thisIndex);
					// log(`eventHandlerData.isCtrlDown: ${eventHandlerData.isCtrlDown}`);

					if (eventHandlerData.isCtrlDown) {
						msPoints.add(path.pathPoints[previousIndex]);
					} else {
						msPoints.select(path.pathPoints[previousIndex]);
					}
					editor.publish('whichPathPointIsSelected', path.pathPoints[previousIndex]);
				},
			},
			{
				iconName: 'selectNextPathPoint',
				disabled: editor.multiSelect.points.hasMultipleParents,
				title: t('ui:character.action.selectNextPathPoint'),
				onClick: () => {
					const editor = getCurrentProjectEditor();
					let msPoints = editor.multiSelect.points;
					let path = msPoints.members[0].parent;
					let thisIndex = msPoints.highestSelectedPointNumber;
					let nextIndex = path.getNextPointNum(thisIndex);
					// log(`eventHandlerData.isCtrlDown: ${eventHandlerData.isCtrlDown}`);

					if (eventHandlerData.isCtrlDown) {
						msPoints.add(path.pathPoints[nextIndex]);
					} else {
						msPoints.select(path.pathPoints[nextIndex]);
					}
					editor.publish('whichPathPointIsSelected', path.pathPoints[nextIndex]);
				},
			},
		];
	}

	// log(`\n⮟actionData⮟`);
	// log(actionData);
	// log(`getActionData`, 'end');
	return actionData;
}

// --------------------------------------------------------------
// Individual actions areas
// --------------------------------------------------------------

export function addChildActions(parent, actionsArray) {
	addAsChildren(
		parent,
		actionsArray.map((iconData) => makeActionButton(iconData))
	);
	return parent;
}

// Universal actions
export function makeActionsArea_Universal() {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });

	addChildActions(actionsArea, getActionData('allActions'));
	addChildActions(actionsArea, getActionData('addShapeActions'));

	// Dev actions for testing

	let dev = getGlyphrStudioApp().settings.dev;
	if (dev.testActions.length) {
		// DEV
		let devActions = [];
		if (dev.mode) {
			for (let a = 0; a < dev.testActions.length; a++) {
				devActions.push({
					iconName: 'test',
					title: dev.testActions[a].name,
					onClick: dev.testActions[a].onClick,
				});
			}
		}
		// actionsArea.appendChild(makeElement({tag:'h4', content:'test'}));
		addChildActions(actionsArea, devActions);
	}

	return actionsArea;
}

// Glyph actions
export function makeActionsArea_Glyph() {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	addChildActions(actionsArea, getActionData('glyphActions'));
	return actionsArea;
}

// Path actions
export function makeActionsArea_Path(test = false) {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	let multiActions = makeElement({ tag: 'div', className: 'panel__actions-area' });
	let selectedPaths = getCurrentProjectEditor().multiSelect.shapes.members;

	if (selectedPaths.length > 0 || test) {
		addChildActions(actionsArea, getActionData('shapeActions'));
	}

	// Boolean combine actions
	if (selectedPaths.length > 1 || test) {
		addChildActions(multiActions, getActionData('boolActions'));
	}

	// Layer actions
	if (selectedPaths.length === 1 || test) {
		addChildActions(actionsArea, getActionData('layerActions'));
	}

	// Path align actions
	if (selectedPaths.length > 1 || test) {
		addChildActions(multiActions, getActionData('alignActions'));
	}

	return selectedPaths.length > 1 ? [actionsArea, multiActions] : actionsArea;
}

export function makeActionsArea_ComponentInstance(test = false) {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	let alignActions = false;
	let selectedPaths = getCurrentProjectEditor().multiSelect.shapes.members;

	if (selectedPaths.length > 0 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'paths'}));
		addChildActions(actionsArea, getActionData('componentInstanceActions'));
	}

	// Layer actions
	if (selectedPaths.length === 1 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'path layers'}));
		addChildActions(actionsArea, getActionData('layerActions'));
	}

	// Path align actions
	if (selectedPaths.length > 1 || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'align paths'}));
		// @ts-ignore
		alignActions = makeElement({ tag: 'div', className: 'panel__actions-area' });
		addChildActions(alignActions, getActionData('alignActions'));
	}

	return alignActions ? [actionsArea, alignActions] : actionsArea;
}

// Point actions
export function makeActionsArea_PathPoint(test = false) {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	let selectedPoints = getCurrentProjectEditor().multiSelect.points;
	let isPointSelected = false;
	if (selectedPoints.length > 0) isPointSelected = true;
	// if (_UI.selectedTool !== 'pathEdit') isPointSelected = false;
	if (isPointSelected || test) {
		// actionsArea.appendChild(makeElement({tag:'h4', content:'path point'}));
		addChildActions(actionsArea, getActionData('pointActions'));
	}

	return actionsArea;
}

// Kern Group actions
export function makeActionsArea_KernGroup() {
	let actionsArea = makeElement({ tag: 'div', className: 'panel__actions-area' });
	addChildActions(actionsArea, getActionData('kernGroupActions'));
	return actionsArea;
}

// --------------------------------------------------------------
// Delete selected path / point
// --------------------------------------------------------------

export function deleteSelectedPaths() {
	const editor = getCurrentProjectEditor();
	let msShapes = editor.multiSelect.shapes;

	let historyTitle;
	if (msShapes.length > 1) {
		historyTitle = `Deleted ${msShapes.length} paths`;
	} else {
		historyTitle = `Deleted path: ${msShapes.singleton.name}`;
	}

	msShapes.deleteShapes();
	editor.history.addState(historyTitle);
	editor.publish('currentItem', editor.multiSelect.shapes.virtualGlyph);
}

export function deleteSelectedPoints() {
	const editor = getCurrentProjectEditor();
	let msPoints = editor.multiSelect.points;

	let historyTitle;
	if (msPoints.length > 1) {
		historyTitle = `Deleted ${msPoints.length} path points`;
	} else {
		historyTitle = `Deleted path point: ${msPoints.singleton.pointNumber}`;
	}

	let minDeletedPoint = msPoints.deleteShapesPoints();
	editor.history.addState(historyTitle);
	let pathSingleton = editor.multiSelect.shapes.singleton;
	if (pathSingleton) {
		msPoints.select(pathSingleton.pathPoints[pathSingleton.getPreviousPointNum(minDeletedPoint)]);
	} else {
		editor.publish('whichPathPointIsSelected', editor.multiSelect.shapes);
	}
}

// --------------------------------------------------------------
// Layers
// --------------------------------------------------------------

function moveLayer(direction = 'up') {
	const editor = getCurrentProjectEditor();
	const selectedPath = editor.multiSelect.shapes.singleton;
	const itemPaths = editor.selectedItem.shapes;
	const currentIndex = itemPaths.indexOf(selectedPath);
	let tempPath;

	if (direction === 'down') {
		if (currentIndex > 0 && currentIndex < itemPaths.length) {
			tempPath = itemPaths[currentIndex - 1];
			itemPaths[currentIndex - 1] = itemPaths[currentIndex];
			itemPaths[currentIndex] = tempPath;
		}
	} else {
		if (currentIndex > -1 && currentIndex < itemPaths.length - 1) {
			tempPath = itemPaths[currentIndex + 1];
			itemPaths[currentIndex + 1] = itemPaths[currentIndex];
			itemPaths[currentIndex] = tempPath;
		}
	}
}

// --------------------------------------------------------------
// Combine
// --------------------------------------------------------------

function combineSelectedPaths(operation = 'unite') {
	showToast(`Combine: ${operation} - selected shapes... `, 10000);
	const editor = getCurrentProjectEditor();
	setTimeout(function () {
		let successful = editor.multiSelect.shapes.combine(operation);
		if (successful) editor.history.addState(`Combine: ${operation} - all selected paths`);
	}, 200);
}

function combineUniteAllGlyphPaths() {
	showToast('Uniting all glyph shapes... ', 10000);
	const editor = getCurrentProjectEditor();
	setTimeout(function () {
		editor.multiSelect.shapes.selectAll();
		let successful = editor.multiSelect.shapes.combine('unite');
		if (successful) editor.history.addState('Combine: unite - all glyph paths');
	}, 200);
}

// --------------------------------------------------------------
// Copy Paste
// --------------------------------------------------------------
export function clipboardCopy() {
	// log(`clipboardCopy`, 'start');

	const editor = getCurrentProjectEditor();
	let selPaths = [];
	editor.multiSelect.shapes.members.forEach((shape) => {
		selPaths.push(shape.save(true));
	});

	if (selPaths.length) {
		editor.clipboard = {
			shapes: selPaths,
			sourceID: editor.selectedItemID,
			dx: 0,
			dy: 0,
		};
	} else {
		editor.clipboard = false;
	}

	updateClipboardActionIcons(selPaths.length);
	// log(editor.clipboard);
	// log(`clipboardCopy`, 'end');
}

export function clipboardPaste() {
	// log('clipboardPaste', 'start');
	const editor = getCurrentProjectEditor();
	let clipboard = editor.clipboard;
	let offsetPaths = clipboard.sourceID === editor.selectedItemID;

	if (clipboard && offsetPaths) {
		clipboard.dx += 20;
		clipboard.dy -= 20;
	}

	if (clipboard && clipboard.shapes.length) {
		let newShapes = [];

		let newShape, newName, newSuffix, caret, suffix;
		clipboard.shapes.forEach((shape) => {
			if (shape.objType === 'ComponentInstance') {
				newShape = new ComponentInstance(shape);
			} else {
				newShape = new Path(shape);
			}

			if (offsetPaths) {
				newShape.updateShapePosition(clipboard.dx, clipboard.dy);
			}

			newName = newShape.name;
			newSuffix = ' (copy)';
			caret = newShape.name.lastIndexOf('(copy');

			if (caret > 0) {
				suffix = newName.substring(caret + 5);
				newName = newName.substring(0, caret);
				if (suffix === ')') {
					newSuffix = '(copy 2)';
				} else {
					// log("\t - suffix " + suffix);
					suffix = suffix.substring(1);
					// log("\t - suffix " + suffix);
					suffix = suffix.substring(0, suffix.length - 1);
					// log("\t - suffix " + suffix);
					newSuffix = '(copy ' + (parseInt(suffix) + 1) + ')';
					// log("\t - newSuffix " + newSuffix);
				}
			}
			newShape.name = newName + newSuffix;

			if (newShape.objType === 'ComponentInstance' && newShape?.link && editor.selectedItemID) {
				let newShapeLink = '' + newShape.link;
				addLinkToUsedIn(editor.project.getItem(newShapeLink), editor.selectedItemID);
			}

			newShapes.push(newShape);
		});

		// log(`New paths that have been copied`);
		// log(newShapes);

		editor.multiSelect.shapes.clear();
		editor.multiSelect.points.clear();

		const addedShapes = [];
		newShapes.forEach((shape) => {
			addedShapes.push(editor.selectedItem.addOneShape(shape));
		});

		addedShapes.forEach((shape) => editor.multiSelect.shapes.add(shape));

		clipboard.sourceID = editor.selectedItemID;

		let len = newShapes.length;
		editor.history.addState(len === 1 ? 'Pasted Path' : `Pasted ${len} Paths`);
		showToast(
			len === 1
				? 'Pasted Path<br>from the Glyphr Studio clipboard'
				: `Pasted ${len} Paths<br>from the Glyphr Studio clipboard`
		);
		editor.publish('currentItem', editor.selectedItem);
	}
	// log('clipboardPaste', 'end');
}

export function clipboardClear() {
	const editor = getCurrentProjectEditor();
	editor.clipboard = false;
	updateClipboardActionIcons(0);
}

function updateClipboardActionIcons(numberOfClipboardItems = 0) {
	const editor = getCurrentProjectEditor();
	let pasteButton = document.querySelector('#actionButtonPaste');
	let clearButton = document.querySelector('#actionButtonClearClipboard');

	if (editor.clipboard) {
		pasteButton.removeAttribute('disabled');
		clearButton.removeAttribute('disabled');
	} else {
		pasteButton.setAttribute('disabled', 'disabled');
		clearButton.setAttribute('disabled', 'disabled');
	}

	pasteButton.setAttribute('title', makeActionButtonPasteTooltip(numberOfClipboardItems));
	clearButton.setAttribute('title', makeActionButtonClearClipboardTooltip(numberOfClipboardItems));
}

export function makeActionButtonPasteTooltip(clipBoardPathCount) {
	let re = `${t('ui:character.action.pasteTooltip1')}`;
	re += `${t('ui:character.action.pasteTooltip2')}${clipBoardPathCount}${t(
		'ui:character.action.pasteTooltip3'
	)}${clipBoardPathCount === 1 ? '' : 's'}${t('ui:character.action.pasteTooltip4')}`;
	return re;
}

export function makeActionButtonClearClipboardTooltip(clipBoardPathCount) {
	let re = `${t('ui:character.action.clearTooltip1')}`;
	re += `${t('ui:character.action.clearTooltip2')}`;
	re += `${t('ui:character.action.clearTooltip3')}${clipBoardPathCount}${t(
		'ui:character.action.clearTooltip4'
	)}${clipBoardPathCount === 1 ? '' : 's'}${t('ui:character.action.clearTooltip5')}`;
	return re;
}

function showDialogChooseOtherItem(type) {
	// log(`showDialogChooseOtherItem`, 'start');
	// log(`type: ${type}`);

	let content = makeElement({
		innerHTML: `<h2>Choose another glyph</h2>`,
	});
	let onClick;

	if (type === 'copyPaths') {
		content.innerHTML += `All the paths from the glyph you select will be copied and pasted into this glyph.<br><br>`;
		addCopyActionsForChooseOtherItem(content);
		onClick = (itemID) => {
			const editor = getCurrentProjectEditor();
			const otherItem = editor.project.getItem(itemID);
			if (!otherItem || otherItem.shapes.length === 0) {
				showToast(`Item doesn't exist, or has no shapes.`);
				return;
			}
			const thisItem = editor.selectedItem;
			const oldRSB = thisItem.rightSideBearing;
			const newShapes = copyShapesFromTo(otherItem, thisItem, false);
			editor.multiSelect.shapes.clear();
			newShapes.forEach((shape) => editor.multiSelect.shapes.add(shape));
			/** @ts-ignore */
			if (document.querySelector('#checkbox-maintain-rsb').checked) {
				thisItem.rightSideBearing = oldRSB;
			}
			editor.publish('currentItem', thisItem);
			editor.history.addState(`Paths were copied from ${otherItem.name}.`);
			closeEveryTypeOfDialog();
			showToast(`${otherItem.shapes.length} paths copied from<br>${otherItem.name}`);
		};
	}

	if (type === 'addAsComponentInstance') {
		// log(`Dialog addAsComponentInstance`, 'start');
		content.innerHTML += `The glyph you select will be treated as a root component, and added to this glyph as a component instance.<br><br>`;
		addCopyActionsForChooseOtherItem(content);

		onClick = (itemID) => {
			const editor = getCurrentProjectEditor();
			let otherItem = editor.project.getItem(itemID);
			if (!otherItem) {
				editor.project.addItemByType(new Glyph({}), 'Glyph', itemID);
				otherItem = editor.project.getItem(itemID);
			}
			const thisItem = editor.selectedItem;
			const oldRSB = thisItem.rightSideBearing;

			editor.history.addWholeProjectChangePreState(
				`Component instance was linked from ${otherItem.name}.`
			);
			const newInstance = linkComponentFromTo(otherItem, thisItem);
			if (newInstance) {
				editor.publish('currentItem', thisItem);
				editor.multiSelect.shapes.add(newInstance);
				/** @ts-ignore */
				if (document.querySelector('#checkbox-maintain-rsb').checked) {
					thisItem.rightSideBearing = oldRSB;
				}
				editor.history.addWholeProjectChangePostState();
				closeEveryTypeOfDialog();
				showToast(`Component instance linked from<br>${otherItem.name}`);
			} else {
				editor.history.queue.shift();
				closeEveryTypeOfDialog();
				showError(`
				Cannot add ${thisItem.name} to ${otherItem.name} as a component instance.
				<br>
				This is usually because adding the link would create a circular reference.
				`);
			}
		};
		// log(`Dialog addAsComponentInstance`, 'end');
	}

	if (type === 'linkAsComponent') {
		content.innerHTML += `This component will be linked to the glyph you select as a component instance.<br><br>`;
		onClick = (itemID) => {
			const editor = getCurrentProjectEditor();
			let destinationItem = editor.project.getItem(itemID);
			if (!destinationItem) {
				editor.project.addItemByType(new Glyph({}), 'Glyph', itemID);
				destinationItem = editor.project.getItem(itemID);
			}
			editor.history.addWholeProjectChangePreState(
				`Component was linked to ${destinationItem.name}.`
			);
			const thisItem = editor.selectedItem;
			const newInstance = linkComponentFromTo(thisItem, destinationItem);
			if (newInstance) {
				editor.publish('currentItem', thisItem);
				editor.history.addWholeProjectChangePostState();
				closeEveryTypeOfDialog();
				showToast(`Component was linked to<br>${destinationItem.name}`);
			} else {
				editor.history.queue.shift();
				closeEveryTypeOfDialog();
				showError(`
				Cannot add ${thisItem.name} to ${destinationItem.name} as a component instance.
					<br>
					This is usually because adding the link would create a circular reference.
					`);
			}
		};
	}

	const scrollArea = makeElement({
		tag: 'div',
		className: 'modal-dialog__glyph-chooser-scroll-area',
	});

	const chooserArea = makeAllItemTypeChooserContent(onClick, 'Characters');
	scrollArea.appendChild(chooserArea);
	content.appendChild(scrollArea);
	showModalDialog(content);
	// log(`showDialogChooseOtherItem`, 'end');
}

function addCopyActionsForChooseOtherItem(parent) {
	parent.appendChild(
		makeElement({
			tag: 'strong',
			content: 'Copy options:',
			style: 'display: inline-block; margin-bottom: 10px;',
		})
	);
	parent.appendChild(makeElement({ tag: 'br' }));
	parent.appendChild(
		makeElement({
			tag: 'input',
			attributes: { type: 'checkbox' },
			className: 'copy-shapes-options__checkbox',
			id: 'checkbox-maintain-rsb',
		})
	);
	parent.appendChild(
		makeSingleLabel(
			`Maintain right side bearing, accounting for the width of the added items.`,
			false,
			'checkbox-maintain-rsb',
			'copy-shapes-options__label'
		)
	);
	parent.appendChild(makeElement({ tag: 'br' }));
	parent.appendChild(makeElement({ tag: 'br' }));
}

function showDialogChooseItemFromOtherProject() {
	let content = makeElement({
		innerHTML: `
			<h2>Choose a glyph from the other open project</h2>
			All the paths from the glyph you select will be copied and pasted into this glyph.
			<br><br>
			<strong style="display: inline-block; margin-bottom:10px;">Copy options:</strong>
			<br>`,
	});

	const thisEditor = getCurrentProjectEditor();
	const otherEditor = getGlyphrStudioApp().otherProjectEditor;
	addCrossProjectCopyShapeOptionControls(content, otherEditor, thisEditor);

	let onClick = (itemID) => {
		const otherItem = otherEditor.project.getItem(itemID);
		const thisItem = thisEditor.selectedItem;
		const emRatio = thisEditor.project.settings.font.upm / otherEditor.project.settings.font.upm;
		// log(`emRatio: ${emRatio}`);

		/**@type {HTMLInputElement} */
		const updateAdvanceWidthBox = document.querySelector('#checkbox-advance-width');
		const updateAdvanceWidth = updateAdvanceWidthBox.checked;
		// log(`updateAdvanceWidth: ${updateAdvanceWidth}`);

		/**@type {HTMLInputElement} */
		const scaleItemsBox = document.querySelector('#checkbox-scale');
		const scaleItems = scaleItemsBox.checked;
		// log(`scaleItems: ${scaleItems}`);

		/**@type {HTMLInputElement} */
		const reverseWindingsBox = document.querySelector('#checkbox-reverse-windings');
		const reverseWindings = reverseWindingsBox.checked;
		// log(`reverseWindings: ${reverseWindings}`);

		const oldRSB = thisItem.rightSideBearing;
		const newShapes = copyShapesFromTo(otherItem, thisItem, false);
		const msShapes = thisEditor.multiSelect.shapes;
		msShapes.clear();
		newShapes.forEach((shape) => msShapes.add(shape));

		if (scaleItems) {
			let deltaWidth = otherItem.advanceWidth * emRatio - otherItem.advanceWidth;
			// log(`deltaWidth: ${deltaWidth}`);
			msShapes.virtualGlyph.updateGlyphSize({
				width: deltaWidth,
				ratioLock: true,
				transformOrigin: 'baseline-left',
			});
		}

		if (reverseWindings) msShapes.virtualGlyph.reverseWinding();
		if (updateAdvanceWidth) thisItem.rightSideBearing = oldRSB;

		thisEditor.publish('currentItem', thisItem);
		let title = `
			${otherItem.shapes.length} paths were copied<br>
			from ${otherEditor.project.settings.project.name} : ${otherItem.name}`;
		thisEditor.history.addState(title);
		closeEveryTypeOfDialog();
		showToast(title);
	};

	const scrollArea = makeElement({
		tag: 'div',
		className: 'modal-dialog__glyph-chooser-scroll-area',
	});

	const chooserArea = makeAllItemTypeChooserContent(
		onClick,
		'Characters',
		getGlyphrStudioApp().otherProjectEditor,
		true
	);
	scrollArea.appendChild(chooserArea);
	content.appendChild(scrollArea);
	showModalDialog(content);
}

/**
 * Create a component instance given another item.
 * @param {Glyph} sourceItem - new component root
 * @param {Glyph} destinationItem - where to put the component instance
 */
export function linkComponentFromTo(sourceItem, destinationItem) {
	if (!canAddComponentInstance(destinationItem, sourceItem.id)) return false;
	const newInstance = new ComponentInstance({ link: sourceItem.id });
	destinationItem.addOneShape(newInstance);
	addLinkToUsedIn(sourceItem, destinationItem.id);
	return newInstance;
}

/**
 * Copy paths (and attributes) from one glyph to another
 * @param {Glyph} sourceItem - source to copy paths from
 * @param {Glyph} destinationItem - where to copy paths to
 * @param {Object} updateWidth - should advance width copy as well
 */
export function copyShapesFromTo(sourceItem, destinationItem, updateWidth = false) {
	// log('copyShapesFromTo', 'start');
	// log(`Source item`);
	// log(sourceItem);
	// log(`Destination item`);
	// log(destinationItem);

	const editor = getCurrentProjectEditor();
	let item;
	let newShape;
	let newShapes = [];
	for (let c = 0; c < sourceItem.shapes.length; c++) {
		item = sourceItem.shapes[c];
		if (item.objType === 'ComponentInstance') {
			addLinkToUsedIn(editor.project.getItem(item.link), destinationItem.id);
			item = new ComponentInstance(item);
		} else if (item.objType === 'Path') {
			item = new Path(item);
		}

		newShape = destinationItem.addOneShape(item);
		newShapes.push(newShape);
	}

	if (updateWidth) {
		destinationItem.advanceWidth = sourceItem.advanceWidth;
	}

	// log('Result for destination item:');
	// log(destinationItem);
	// log(`Returning newShapes`);
	// log(newShapes);
	// log('copyShapesFromTo', 'end');
	return newShapes;
}

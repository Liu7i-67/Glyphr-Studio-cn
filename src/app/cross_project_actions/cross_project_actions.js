import { makeElement } from '../../common/dom';
import { countItems, duplicates } from '../../common/functions';
import { getCurrentProjectEditor, getGlyphrStudioApp } from '../main';
import {
	updateCharacterCopyTable,
	updateContent_copyShapes,
	updateFooter_copyShapes,
} from './action_copy_shapes';

export let sourceEditor;
export let destinationEditor;
export let selectedItemIDs = [];
export let selectedRange = false;

export function makePage_CrossProjectActions() {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
			<div id="cross-project-actions__page">
				<div class="cross-project-actions__page-header">
					<h1>Cross&#8209;project&nbsp;actions</h1><span></span><span id="cross-project-actions__close-button">✖</span>
					<option-chooser id="cross-project-actions__action-chooser"
						selected-id="Copy character or ligature shapes"
						selected-name="Copy character or ligature shapes">
						<option>Copy character or ligature shapes</option>
						<option>Add component roots</option>
						<option>Add kern groups</option>
						<option>Merge two projects</option>
					</option-chooser>
					<span id="cross-project-actions__item-count"></span>
					<span></span>
				</div>
				<div id="cross-project-actions__page-content">
				</div>
				<div id="cross-project-actions__page-footer">
				</div>
			</div>
		`,
	});

	// Set up projects
	const app = getGlyphrStudioApp();
	sourceEditor = app.otherProjectEditor;
	destinationEditor = app.selectedProjectEditor;

	// Set up window
	const closeButton = content.querySelector('#cross-project-actions__close-button');
	closeButton.addEventListener('click', () => {
		getCurrentProjectEditor().navigate();
	});

	// Make content
	let actionChooser = content.querySelector('#cross-project-actions__action-chooser');
	actionChooser.addEventListener('change', () => {
		updateCrossProjectActionsPage(content);
	});
	updateCrossProjectActionsPage(content);
	return content;
}

function updateCrossProjectActionsPage(content) {
	log(`updateCrossProjectActionsPage`, 'start');
	let actionChooser = content.querySelector('#cross-project-actions__action-chooser');
	let selectedAction = actionChooser.getAttribute('selected-id');
	log(`selectedAction: ${selectedAction}`);
	let pageContent = content.querySelector('#cross-project-actions__page-content');
	let pageFooter = content.querySelector('#cross-project-actions__page-footer');

	pageContent.innerHTML = '';
	pageFooter.innerHTML = '';
	if (selectedAction === 'Copy character or ligature shapes') {
		updateContent_copyShapes(pageContent);
		updateFooter_copyShapes(pageFooter);
	} else if (selectedAction === 'Add component roots') {
		pageContent.innerHTML = 'Add component roots';
	} else if (selectedAction === 'Add kern groups') {
		pageContent.innerHTML = 'Add kern groups';
	} else if (selectedAction === 'Merge two projects') {
		pageContent.innerHTML = 'Merge two projects';
	}
	log(`updateCrossProjectActionsPage`, 'end');
}

export function makeProjectFlipper(textPrefix = 'From') {
	let sourceProject = sourceEditor.project.settings.project;
	let destinationProject = destinationEditor.project.settings.project;
	const wrapper = makeElement({
		tag: 'span',
		id: 'cross-project-actions__project-flipper',
		innerHTML: `
			${textPrefix} project
			<code id="project-flipper-source-name"
				title="${sourceProject.name}\n${sourceProject.id}">
				${sourceProject.name}
			</code>
			to
			<code id="project-flipper-destination-name"
				title="${destinationProject.name}\n${destinationProject.id}">
				${destinationProject.name}
			</code>
		`,
	});

	const flipButton = makeElement({
		className: 'flip-button',
		innerHTML: '⮀',
		title: 'Flip from/to projects',
		onClick: flipProjects,
	});
	wrapper.appendChild(flipButton);
	return wrapper;
}

function flipProjects() {
	let temp = sourceEditor;
	sourceEditor = destinationEditor;
	destinationEditor = temp;

	updateContent_copyShapes(document.querySelector('#cross-project-actions__page-content'));
}

export function toggleCheckboxes() {
	let state = document.getElementById('toggle-all-checkbox').checked;
	const checkboxes = document.querySelectorAll('.item-select-checkbox');
	checkboxes.forEach((box) => {
		box.checked = state;
		updateSelectedIDs(box.getAttribute('item-id'), box.checked);
	});
}

export function clearAllSelections() {
	selectedItemIDs = [];
	document.getElementById('cross-project-actions__item-count').innerHTML = '';
}

export function updateSelectedIDs(itemID, add = true) {
	if (add) selectedItemIDs.push(itemID);
	else selectedItemIDs.splice(selectedItemIDs.indexOf(itemID), 1);
	selectedItemIDs = selectedItemIDs.filter(duplicates);
	selectedItemIDs = selectedItemIDs.filter((item) => !!item);
	document.getElementById('cross-project-actions__item-count').innerHTML = `
		${selectedItemIDs.length} item${selectedItemIDs.length === 1 ? '' : 's'} selected
	`;
}

// --------------------------------------------------------------
// Item and Range Chooser
// --------------------------------------------------------------

export function makeItemAndRangeChooser(
	{ showLigatures = false, showComponents = false, showKernGroups = false },
	updateHandler
) {
	log(`\n⮟sourceEditor⮟`);
	log(sourceEditor);
	const project = sourceEditor.project;

	if (!selectedRange) selectedRange = sourceEditor.selectedCharacterRange;
	// log(selectedRange);
	let optionChooser = makeElement({
		tag: 'option-chooser',
		className: 'cross-project-actions__range-chooser',
		attributes: {
			'selected-name': selectedRange.name || selectedRange,
			'selected-id': selectedRange.id || selectedRange,
		},
	});

	let option;
	let addHR = false;

	if (showLigatures) {
		let ligatureCount = countItems(project.ligatures);
		if (ligatureCount) {
			// log(`range.name: Ligatures`);
			option = makeElement({
				tag: 'option',
				innerHTML: 'Ligatures',
				attributes: { note: `${ligatureCount}&nbsp;items` },
			});
			option.addEventListener('click', () => {
				selectedRange = 'Ligatures';
				updateHandler();
			});
			optionChooser.appendChild(option);
			addHR = true;
		}
	}

	if (showComponents) {
		let componentCount = countItems(project.components);
		if (componentCount) {
			// log(`range.name: Components`);
			option = makeElement({
				tag: 'option',
				innerHTML: 'Components',
				attributes: { note: `${componentCount}&nbsp;items` },
			});
			option.addEventListener('click', () => {
				selectedRange = 'Components';
				updateHandler();
			});
			optionChooser.appendChild(option);
			addHR = true;
		}
	}

	if (showKernGroups) {
		let kernCount = countItems(project.kerning);
		if (kernCount) {
			// log(`range.name: Kern groups`);
			option = makeElement({
				tag: 'option',
				innerHTML: 'Kern groups',
				attributes: { note: `${kernCount}&nbsp;items` },
			});
			option.addEventListener('click', () => {
				selectedRange = 'Kern groups';
				updateHandler();
			});
			optionChooser.appendChild(option);
			addHR = true;
		}
	}

	if (addHR) optionChooser.appendChild(makeElement({ tag: 'hr' }));

	let ranges = project.settings.project.characterRanges;
	log(ranges);
	ranges.forEach((range) => {
		// log(`range.name: ${range.name}`);
		option = makeElement({
			tag: 'option',
			innerHTML: range.name,
			attributes: { note: range.note },
		});

		option.addEventListener('click', () => {
			selectedRange = range;
			let table = document.getElementById('cross-project-actions__character-copy-table');
			updateCharacterCopyTable(table);
		});

		optionChooser.appendChild(option);
	});

	return optionChooser;
}

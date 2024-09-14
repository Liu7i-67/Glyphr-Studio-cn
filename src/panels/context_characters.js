import { t } from 'i18next';
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { addAsChildren, makeElement } from '../common/dom.js';
import { makeFancySlider } from '../controls/fancy-slider/fancy_slider.js';
import { makeLivePreviewPopOutCard } from '../project_editor/pop_out_window.js';
import { makeDirectCheckbox, makeSingleInput, makeSingleLabel, rowPad } from './cards.js';

// --------------------------------------------------------------
// Context Characters panel
// --------------------------------------------------------------

export function makePanel_ContextCharacters() {
	// log(`makePanel_ContextCharacters`, 'start');
	const editor = getCurrentProjectEditor();
	const project = getCurrentProject();

	let charsCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: `<h3>${t('ui:Characters')}</h3>`,
	});

	let description = makeElement({
		tag: 'p',
		className: 'spanAll',
		content: `${t('ui:context_characters.charactersTips')}`,
	});

	const ccOptions = project.settings.app.contextCharacters;
	let toggleCheckboxLabel = makeSingleLabel(t('ui:context_characters.showContextCharacters'));
	let toggleCheckbox = makeDirectCheckbox(ccOptions, 'showCharacters', () => {
		getCurrentProjectEditor().autoFitView();
		refresh();
	});

	let charsInput = makeSingleInput(
		editor.selectedItem,
		'contextCharacters',
		'editCanvasView',
		'input',
		['input']
	);
	charsInput.addEventListener('input', () => getCurrentProjectEditor().autoFitView());

	let transparencyLabel = makeSingleLabel(t('ui:context_characters.Transparency'));
	let transparencyInput = makeFancySlider(ccOptions.characterTransparency, (newValue) => {
		ccOptions.characterTransparency = newValue;
		getCurrentProjectEditor().editCanvas.redraw();
	});
	charsInput.classList.add('spanAll');
	addAsChildren(charsCard, [
		description,
		charsInput,
		rowPad(),
		toggleCheckboxLabel,
		toggleCheckbox,
		transparencyLabel,
		transparencyInput,
	]);

	// Options
	let optionsCard = makeElement({
		tag: 'div',
		className: 'panel__card',
		innerHTML: `<h3>${t('ui:context_characters.guideLabels')}</h3>
	`,
	});

	let guidesCheckboxLabel = makeSingleLabel(t('ui:context_characters.showGuideLabels'));
	let guidesCheckbox = makeDirectCheckbox(ccOptions, 'showGuides', refresh);

	let guidesLabel = makeSingleLabel(t('ui:context_characters.Transparency'));
	let guidesInput = makeFancySlider(ccOptions.guidesTransparency, (newValue) => {
		ccOptions.guidesTransparency = newValue;
		getCurrentProjectEditor().editCanvas.redraw();
	});

	addAsChildren(optionsCard, [guidesCheckboxLabel, guidesCheckbox, guidesLabel, guidesInput]);

	// log(`makePanel_ContextCharacters`, 'end');
	return [charsCard, optionsCard, makeLivePreviewPopOutCard(true)];
}

function refresh() {
	const editor = getCurrentProjectEditor();
	editor.editCanvas.redraw();
}

import { t } from 'i18next';
import { getCurrentProject, getCurrentProjectEditor } from '../app/main.js';
import { makeElement } from '../common/dom.js';
import { countItems } from '../common/functions.js';
import { showModalDialog } from '../controls/dialogs/dialogs.js';
import { makeAllItemTypeChooserContent } from '../panels/item_chooser.js';
import { makeNavButton, toggleNavDropdown } from '../project_editor/navigator.js';
import { makeContributeContent, makeReleaseNote } from './about.js';

/**
 * Page > Overview
 * The first page you land on, with project and glyph information.
 * @returns {Element} - page content
 */
export function makePage_Overview() {
	const content = makeElement({
		tag: 'div',
		id: 'app__page',
		innerHTML: `
		<div class="content__page">
			<div class="content-page__left-area">
				<div class="content-page__nav-area">
					${makeNavButton({ level: 'l1', superTitle: 'PAGE', title: 'Overview' })}
				</div>
				<div id="content-page__panel"></div>
			</div>
			<div class="content-page__right-area"></div>
		</div>
	`,
	});

	// log(content);

	let itemsContent = makeAllItemTypeChooserContent((itemID) => {
		// log(`Overview page - Glyph Chooser tile click handler`, 'start');
		// log(`itemID: ${itemID}`);

		const editor = getCurrentProjectEditor();
		editor.selectedItemID = itemID;
		// log(`editor.selectedItemID: ${editor.selectedItemID}`);

		if (itemID.startsWith('glyph-')) editor.nav.page = 'Characters';
		else if (itemID.startsWith('liga-')) editor.nav.page = 'Ligatures';
		else if (itemID.startsWith('comp-')) editor.nav.page = 'Components';
		else if (itemID.startsWith('kern-')) editor.nav.page = 'Kerning';
		// log(`editor.nav.page: ${editor.nav.page}`);
		editor.navigate();

		editor.history.addState(`Navigated to ${editor.project.getItemName(itemID, true)}`);
		// log(`Overview page - Glyph Chooser tile click handler`, 'end');
	});

	const project = getCurrentProject();
	const rightArea = content.querySelector('.content-page__right-area');
	let previewText = project.settings.app.previewText || 'Aa Bb Cc Xx Yy Zz';

	rightArea.appendChild(
		makeElement({
			tag: 'display-canvas',
			attributes: { text: previewText, 'font-size': '64', 'show-placeholder-message': 'true' },
			title: 'You can customize the the project preview text from the Settings > App page.',
		})
	);

	rightArea.appendChild(makeElement({ tag: 'hr', style: 'margin: 10px 0px 20px 0px;' }));
	rightArea.appendChild(makeElement({ tag: 'br' }));
	rightArea.appendChild(itemsContent);
	// Page Selector
	let l1 = content.querySelector('#nav-button-l1');
	l1.addEventListener('click', function () {
		toggleNavDropdown(l1);
	});

	const panelArea = content.querySelector('#content-page__panel');
	const welcomeCard = makeElement({
		className: 'panel__card full-width more-padding',
	});
	welcomeCard.appendChild(makeReleaseNote(false));

	const projectSummaryCard = makeElement({
		className: 'panel__card more-padding',
		innerHTML: `
			<h2>${t('ui:ProjectInfo')}</h2>
			<label>${t('ui:ProjectName')}: </label><span>${project.settings.project.name}</span>
			<label>${t('ui:FontFamily')}: </label><span>${project.settings.font.family}</span>
			<label>${t('ui:Style')}: </label><span>${project.settings.font.style}</span>
			<label>${t('ui:GlyphCount')}: </label><span>${
			countItems(project.glyphs) + countItems(project.ligatures)
		}</span>
			<label>${t('ui:UPM')}: </label><span>${project.settings.font.upm}</span>
			<label>${t('ui:Ascent')}: </label><span>${project.settings.font.ascent}</span>
			<label>${t('ui:Descent')}: </label><span>${project.settings.font.descent}</span>
			<br><span></span>
		`,
	});
	projectSummaryCard.appendChild(
		makeElement({
			tag: 'fancy-button',
			innerHTML: t('ui:EditTips'),
			attributes: { secondary: '' },
			onClick: () => {
				const editor = getCurrentProjectEditor();
				editor.nav.page = 'Settings';
				editor.navigate();
			},
		})
	);

	const contributeCard = makeElement({
		className: 'panel__card full-width more-padding',
		innerHTML: `
			Glyphr Studio ${t('ui:openTips')}
			<br>
			`,
	});
	contributeCard.appendChild(
		makeElement({
			tag: 'fancy-button',
			innerHTML: t('ui:learnTips'),
			attributes: { secondary: '' },
			onClick: () => {
				showModalDialog(makeContributeContent(), 500);
			},
		})
	);

	panelArea.appendChild(projectSummaryCard);
	panelArea.appendChild(welcomeCard);
	panelArea.appendChild(contributeCard);

	return content;
}

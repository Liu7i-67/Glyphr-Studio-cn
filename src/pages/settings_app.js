import { t } from 'i18next';
import { updateWindowUnloadEvent } from '../app/app';
import { getGlyphrStudioApp } from '../app/main';
import { addAsChildren, makeElement, textToNode } from '../common/dom';
import { showToast } from '../controls/dialogs/dialogs';
import { makeOneSettingsRow } from './settings';

/**
 * Makes the content for the Settings > App tab
 * @returns {Element}
 */
export function makeSettingsTabContentApp() {
	const tabContent = makeElement({
		tag: 'div',
		className: 'settings-page__tab-content settings-table',
		id: 'tab-content__app',
		innerHTML: `
			<h1>${t('ui:app.preferences')}</h1>
			<p>${t('ui:app.tips')}</p>
		`,
	});

	addAsChildren(tabContent, [
		textToNode(`<h3>${t('ui:app.Saving')}</h3>`),
		makeOneSettingsRow('app', 'stopPageNavigation', updateWindowUnloadEvent),
		makeOneSettingsRow('app', 'formatSaveFile'),
		makeOneSettingsRow('app', 'saveLivePreviews'),
		makeOneSettingsRow('app', 'autoSave'),
		textToNode(`<span class="settings__label">${t('ui:app.deleteAllSave')}</span>`),
		makeElement({
			tag: 'info-bubble',
			content: t('ui:app.deleteAllSaveDescription'),
		}),
		makeElement({
			tag: 'fancy-button',
			attributes: { danger: '', style: 'height: 24px;' },
			innerHTML: t('ui:Delete'),
			onClick: () => {
				getGlyphrStudioApp().setLocalStorage('autoSaves', '');
				showToast(t('ui:app.deleteTips'));
			},
		}),
		textToNode('<span></span>'),
		textToNode('<br>'),
		textToNode('<br>'),
		textToNode(`<h3>${t('ui:app.Behavior')}</h3>`),
		makeOneSettingsRow('app', 'unlinkComponentInstances'),
		textToNode('<br>'),
		textToNode('<br>'),
		textToNode(`<h3>${t('ui:app.Visibility')}</h3>`),
		makeOneSettingsRow('app', 'showNonCharPoints'),
		makeOneSettingsRow('app', 'itemChooserPageSize'),
		makeOneSettingsRow('app', 'previewText'),
		textToNode('<br>'),
		textToNode('<br>'),
		textToNode(`<h3>${t('ui:app.ImportingExporting')}</h3>`),
		makeOneSettingsRow('app', 'exportLigatures'),
		makeOneSettingsRow('app', 'exportKerning'),
		makeOneSettingsRow('app', 'exportUneditedItems'),
		makeOneSettingsRow('app', 'moveShapesOnSVGDragDrop'),
	]);

	return tabContent;
}

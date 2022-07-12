import { makeElement } from '../controls.js';
import { uiColors, accentColors } from '../../common/colors.js';

/**
 * description
 */
export default class PanelArea extends HTMLElement {
  /**
   * Create an PanelArea
   * @param {object} attributes - collection of key: value pairs to set as attributes
   */
  constructor(attributes = {}) {
    super();

    Object.keys(attributes).forEach((key) =>
      this.setAttribute(key, attributes[key])
    );

    this.wrapper = makeElement({ className: 'wrapper' });

    let style = makeElement({
      tag: 'style',
      content: `
            * {
                box-sizing: border-box;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }

            .wrapper {
                margin: 0px;
                padding: 0px;
                height: 100%;
                width: 100%;
                border-style: solid;
                border-width: 0px;
                border-color: ${uiColors.enabled.resting.border};
                background-color: ${uiColors.offWhite};
                display: grid;
                grid-template-rows: 30px 1fr;
            }

            .wrapper:hover,
            .wrapper *:hover,
            .wrapper:focus,
            .wrapper *:focus {
                border-color: ${uiColors.enabled.focus.border};
            }

            .wrapper[disabled],
            .wrapper:hover[disabled],
            .wrapper:focus[disabled],
            .wrapper:active[disabled] {
                background-color: ${uiColors.disabled.background};
                border-color: ${uiColors.disabled.border};
            }

            #header {
                width: 100%;
                grid-row: 1;
                background-color: ${accentColors.gray.l95};
                color: ${accentColors.blue.l05};
                cursor: pointer;
                align-items: center;
                padding: 5px 10px;
            }

            #content {
                grid-row: 2;
                background-color: ${uiColors.offWhite};
                overflow-y: scroll;
                padding: 5px;
              }
        `,
    });

    let panelName = this.getAttribute('panel') || 'panel';

    let header = makeElement({ id: 'header', innerHTML: panelName });
    let content = makeElement({ id: 'content' });
    let outsideContent = makeElement({ tag: 'slot' });

    // outsideContent.innerHTML = outsideContent.innerHTML.replace(/\n/g, '');

    // Put it all together
    let shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(style);
    this.wrapper.appendChild(header);
    content.appendChild(outsideContent);
    this.wrapper.appendChild(content);
    /*
    this.observer = new MutationObserver(this.childAttributeChanged);
    this.observer.elementRoot = this;
    this.observer.observe(this.padlock, {attributes: true, attributeOldValue: true});
    */

    shadow.appendChild(this.wrapper);
  }

  /**
   * Specify which attributes are observed and trigger attributeChangedCallback
   */
  static get observedAttributes() {
    return ['disabled'];
  }

  /**
   * Listens for attribute changes on this element
   * @param {string} attributeName - which attribute was changed
   * @param {string} oldValue - value before the change
   * @param {string} newValue - value after the change
   */
  attributeChangedCallback(attributeName, oldValue, newValue) {
    // console.log(`Attribute ${attributeName} was ${oldValue}, is now ${newValue}`);

    if (attributeName === 'disabled') {
      if (newValue === '') {
        // disabled
      } else if (oldValue === '') {
        // enabled
      }
    }
  }

  /**
   * Listen for changes on child elements
   * @param {object} mutationsList - collection of changes
   */
  childAttributeChanged(mutationsList) {
    for (let mutation of mutationsList) {
      if (
        mutation.type == 'attributes' &&
        mutation.attributeName === 'disabled'
      ) {
        console.log(
          'The ' + mutation.attributeName + ' attribute was modified.'
        );
        console.log(mutation);

        if (mutation.oldValue === '') {
          // enabled
          this.elementRoot.inputNumber.removeAttribute('disabled');
        } else {
          // disabled
          this.elementRoot.inputNumber.setAttribute('disabled', '');
        }
      }
    }
  }
}

// customElements.define('panel-area', PanelArea);

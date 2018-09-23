/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import { getAttributesConfig } from '../componentManager';
import Event from '../../common/events';
import { findTargetByAttr, createJqueryPlugin, sleep } from '../../common/utils';

const Collapse = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'collapse';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    element: null,
    toggle: false,
  };
  const DATA_ATTRS_PROPERTIES = [
  ];
  const components = [];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);

      this.onTransition = false;

      // toggle directly
      if (this.options.toggle) {
        this.show();
      }
    }

    getHeight() {
      return this.options.element.getBoundingClientRect(this.options.element).height;
    }

    toggle() {
      if (this.options.element.classList.contains('show')) {
        return this.hide();
      }

      return this.show();
    }

    /**
     * Shows the collapse
     * @returns {Promise} Promise object represents the completed animation
     */
    show() {
      return new Promise(async (resolve, reject) => {
        if (this.onTransition) {
          reject();
          return;
        }

        if (this.options.element.classList.contains('show')) {
          reject();
          return;
        }

        this.onTransition = true;

        this.triggerEvent(Event.SHOW);

        const onCollapsed = () => {
          this.triggerEvent(Event.SHOWN);

          this.options.element.classList.add('show');
          this.options.element.classList.remove('collapsing');
          this.options.element.removeEventListener(Event.TRANSITION_END, onCollapsed);

          this.options.element.setAttribute('aria-expanded', true);

          this.onTransition = false;

          // reset the normal height after the animation
          this.options.element.style.height = 'auto';

          resolve();
        };

        if (!this.options.element.classList.contains('collapsing')) {
          this.options.element.classList.add('collapsing');
        }

        this.options.element.addEventListener(Event.TRANSITION_END, onCollapsed);

        if (!this.isVerticalCollapse()) {
          // expandableElement
          this.options.element.classList.add('slide');
        } else {
          // get real height
          const height = this.getHeight();

          this.options.element.style.height = '0px';

          await sleep(20);

          this.options.element.style.height = `${height}px`;
        }
      });
    }

    /**
     * Hides the collapse
     * @returns {Promise} Promise object represents the completed animation
     */
    hide() {
      return new Promise((resolve, reject) => {
        if (this.onTransition) {
          reject();
          return;
        }

        if (!this.options.element.classList.contains('show')) {
          reject();
          return;
        }

        this.onTransition = true;

        this.triggerEvent(Event.HIDE);

        const onCollapsed = () => {
          this.triggerEvent(Event.HIDDEN);

          this.options.element.classList.remove('collapsing');
          this.options.element.style.height = 'auto';
          this.options.element.removeEventListener(Event.TRANSITION_END, onCollapsed);

          this.options.element.setAttribute('aria-expanded', false);

          this.onTransition = false;

          resolve();
        };

        this.options.element.addEventListener(Event.TRANSITION_END, onCollapsed);

        if (!this.isVerticalCollapse()) {
          if (this.options.element.classList.contains('slide')) {
            this.options.element.classList.remove('slide');
          }
        } else {
          this.options.element.style.height = '0px';
        }

        if (!this.options.element.classList.contains('collapsing')) {
          this.options.element.classList.add('collapsing');
        }

        this.options.element.classList.remove('show');
      });
    }

    isVerticalCollapse() {
      return !this.options.element.classList.contains('collapse-l')
        && !this.options.element.classList.contains('collapse-r');
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return super.DOMInterface(Collapse, options, components);
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  createJqueryPlugin($, NAME, Collapse);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const collapses = Array.from(document.querySelectorAll(`.${NAME}`) || []);

  collapses.forEach((element) => {
    const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
    config.element = element;

    components.push(Collapse.DOMInterface(config));
  });

  document.addEventListener(Event.CLICK, (event) => {
    const target = findTargetByAttr(event.target, 'data-toggle');
    if (!target) {
      return;
    }

    const dataToggleAttr = target.getAttribute('data-toggle');

    if (dataToggleAttr && dataToggleAttr === NAME) {
      let id = target.getAttribute('data-target') || target.getAttribute('href');
      id = id.replace('#', '');

      const component = components.find(c => c.getElement().getAttribute('id') === id);

      if (!component) {
        return;
      }

      component.toggle();
    }
  });

  return Collapse;
})(window.$ ? window.$ : null);

export default Collapse;

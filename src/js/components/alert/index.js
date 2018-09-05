/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component';
import { getAttributesConfig } from '../componentManager';
import Event from '../../common/events';
import { findTargetByAttr, findTargetByClass, createJqueryPlugin } from '../../common/utils';

const Alert = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'alert';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    element: null,
    fade: true,
  };
  const DATA_ATTRS_PROPERTIES = [
    'fade',
  ];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Alert extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);
      this.onTransition = false;
    }

    /**
     * Shows the alert
     * @returns {Promise} Promise object represents the completed animation
     */
    show() {
      return new Promise((resolve, reject) => {
        if (this.onTransition) {
          reject();
        }

        if (this.options.element.classList.contains('show') && this.getOpacity() !== 0) {
          reject();
        }

        this.onTransition = true;

        this.triggerEvent(Event.SHOW);

        const onShow = () => {
          this.triggerEvent(Event.SHOWN);

          if (this.options.element.classList.contains('fade')) {
            this.options.element.classList.remove('fade');
          }

          this.options.element.removeEventListener(Event.TRANSITION_END, onShow);
          this.onTransition = false;

          resolve();
        };

        if (this.options.fade && !this.options.element.classList.contains('fade')) {
          this.options.element.classList.add('fade');
        }

        this.options.element.classList.add('show');

        this.options.element.addEventListener(Event.TRANSITION_END, onShow);

        if (this.options.element.classList.contains('hide')) {
          this.options.element.classList.remove('hide');
        }

        if (!this.options.fade) {
          onShow();
        }
      });
    }

    getOpacity() {
      const { opacity } = window.getComputedStyle(this.options.element);
      return parseFloat(opacity);
    }

    /**
     * Hides the alert
     * @returns {Promise} Promise object represents the end of the animation
     */
    hide() {
      return new Promise((resolve, reject) => {
        if (this.onTransition) {
          reject();
          return;
        }

        if (this.getOpacity() === 0) {
          reject();
          return;
        }

        this.onTransition = true;
        this.triggerEvent(Event.HIDE);

        const onHide = () => {
          this.triggerEvent(Event.HIDDEN);
          this.options.element.removeEventListener(Event.TRANSITION_END, onHide);
          this.onTransition = false;
          resolve();
        };

        if (this.options.fade && !this.options.element.classList.contains('fade')) {
          this.options.element.classList.add('fade');
        }

        this.options.element.addEventListener(Event.TRANSITION_END, onHide);

        if (!this.options.element.classList.contains('hide')) {
          this.options.element.classList.add('hide');
        }

        if (this.options.element.classList.contains('show')) {
          this.options.element.classList.remove('show');
        }

        if (!this.options.fade) {
          onHide();
        }
      });
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return super.DOMInterface(Alert, options);
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  createJqueryPlugin($, NAME, Alert);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const components = [];

  const alerts = Array.from(document.querySelectorAll(`.${NAME}`) || []);

  alerts.forEach((element) => {
    const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
    config.element = element;

    components.push(Alert.DOMInterface(config));
  });

  document.addEventListener('click', (event) => {
    const target = findTargetByAttr(event.target, 'data-dismiss');
    if (!target) {
      return;
    }

    const dataToggleAttr = target.getAttribute('data-dismiss');

    if (dataToggleAttr && dataToggleAttr === NAME) {
      const alert = findTargetByClass(event.target, NAME);
      const id = alert.getAttribute('id');
      const component = components.find(c => c.getElement().getAttribute('id') === id);

      if (!component) {
        return;
      }

      component.hide();
    }
  });

  return Alert;
})(window.$ ? window.$ : null);

export default Alert;

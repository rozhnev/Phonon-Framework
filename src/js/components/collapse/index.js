/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Component from '../component'
import { getAttributesConfig } from '../componentManager'
import Event from '../../common/events'
import { findTargetByAttr, createJqueryPlugin } from '../../common/utils'

const Collapse = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'collapse'
  const VERSION = '2.0.0'
  const DEFAULT_PROPERTIES = {
    element: null,
    toggle: false,
  }
  const DATA_ATTRS_PROPERTIES = [
  ]

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse extends Component {

    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false)

      this.onTransition = false

      // toggle directly
      if (this.options.toggle) {
        this.show()
      }
    }

    getHeight() {
      return this.options.element.getBoundingClientRect(this.options.element).height
    }

    toggle() {
      if (this.options.element.classList.contains('show')) {
        return this.hide()
      }

      return this.show()
    }

    show() {
      if (this.onTransition) {
        return false
      }

      if (this.options.element.classList.contains('show')) {
        return false
      }

      this.onTransition = true

      this.triggerEvent(Event.SHOW);

      const onCollapsed = () => {
        this.triggerEvent(Event.SHOWN);

        this.options.element.classList.add('show')
        this.options.element.classList.remove('collapsing')
        this.options.element.removeEventListener(Event.TRANSITION_END, onCollapsed)

        this.options.element.setAttribute('aria-expanded', true)

        this.onTransition = false
      }

      if (!this.options.element.classList.contains('collapsing')) {
        this.options.element.classList.add('collapsing')
      }

      this.options.element.addEventListener(Event.TRANSITION_END, onCollapsed);

      if (!this.isVerticalCollapse()) {
        this.options.element.classList.add('slide');
      } else {
        // get real height
        const height = this.getHeight();

        this.options.element.style.height = '0px';

        setTimeout(() => {
          this.options.element.style.height = `${height}px`;
        }, 20);
      }

      return true;
    }

    hide() {
      if (this.onTransition) {
        return false
      }

      if (!this.options.element.classList.contains('show')) {
        return false
      }

      this.onTransition = true

      this.triggerEvent(Event.HIDE);

      const onCollapsed = () => {
        this.triggerEvent(Event.HIDDEN);

        this.options.element.classList.remove('collapsing')
        this.options.element.style.height = 'auto'
        this.options.element.removeEventListener(Event.TRANSITION_END, onCollapsed)

        this.options.element.setAttribute('aria-expanded', false)

        this.onTransition = false
      }

      this.options.element.addEventListener(Event.TRANSITION_END, onCollapsed)

      if (!this.isVerticalCollapse()) {
        if (this.options.element.classList.contains('slide')) {
          this.options.element.classList.remove('slide');
        }
      } else {
        this.options.element.style.height = '0px'
      }

      if (!this.options.element.classList.contains('collapsing')) {
        this.options.element.classList.add('collapsing')
      }

      this.options.element.classList.remove('show')

      return true
    }

    isVerticalCollapse() {
      return !this.options.element.classList.contains('collapse-l')
        && !this.options.element.classList.contains('collapse-r');
    }

    static identifier() {
      return NAME
    }

    static DOMInterface(options) {
      return super.DOMInterface(Collapse, options)
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
  const components = []

  const collapses = document.querySelectorAll(`.${NAME}`)
  if (collapses) {
    collapses.forEach((element) => {
      // const config = {}
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES)
      config.element = element

      components.push(Collapse.DOMInterface(config))
    })
  }

  document.addEventListener(Event.CLICK, (event) => {
    const target = findTargetByAttr(event.target, 'data-toggle')
    if (!target) {
      return
    }

    const dataToggleAttr = target.getAttribute('data-toggle')

    if (dataToggleAttr && dataToggleAttr === NAME) {
      let id = target.getAttribute('data-target') || target.getAttribute('href')
      id = id.replace('#', '')

      const component = components.find(c => c.getElement().getAttribute('id') === id)

      if (!component) {
        return
      }

      component.toggle()
    }
  })

  return Collapse
})(window.$ ? window.$ : null)

export default Collapse

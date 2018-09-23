/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Event from '../../common/events'
import Component from '../component'
import { getAttributesConfig } from '../componentManager'
import { findTargetByAttr, createJqueryPlugin, sleep } from '../../common/utils'

const OffCanvas = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'offcanvas'
  const VERSION = '2.0.0'
  const BACKDROP_SELECTOR = 'offcanvas-backdrop'
  const DEFAULT_PROPERTIES = {
    element: null,
    container: document.body,
    toggle: false,
    aside: {
      md: false,
      lg: true,
      xl: true,
    },
  }
  const DATA_ATTRS_PROPERTIES = [
    'aside',
    'toggle',
  ]
  const components = [];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class OffCanvas extends Component {

    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, true)

      this.currentWidth = null
      this.animate = true
      this.showAside = false

      this.directions = ['left', 'right']

      const sm = { name: 'sm', media: window.matchMedia('(min-width: 1px)') }
      const md = { name: 'md', media: window.matchMedia('(min-width: 768px)') }
      const lg = { name: 'lg', media: window.matchMedia('(min-width: 992px)') }
      const xl = { name: 'xl', media: window.matchMedia('(min-width: 1200px)') }

      this.sizes = [sm, md, lg, xl].reverse()

      this.checkDirection()
      this.checkWidth()

      if (this.options.toggle) {
        this.toggle();
      }

      window.addEventListener('resize', () => this.checkWidth(), false)
    }

    checkDirection() {
      this.directions.every((direction) => {
        if (this.options.element.classList.contains(`offcanvas-${direction}`)) {
          this.direction = direction;
          return false
        }
        return true
      })
    }

    checkWidth() {
      if (!('matchMedia' in window)) {
        return;
      }

      this.sizes.every((size) => {
        const match = size.media.media.match(/[a-z]?-width:\s?([0-9]+)/)

        if (match) {
          if (size.media.matches) {
            if (this.currentWidth !== size.name) {
              this.setAside(size.name)
            }
            this.currentWidth = size.name;
            return false;
          }
        }

        return true;
      })
    }

    setAside(name) {
      const content = this.getConfig('container', DEFAULT_PROPERTIES.container);

      this.showAside = this.options.aside[name] === true;

      if (this.options.aside[name] === true) {
        if (!content.classList.contains(`offcanvas-aside-${this.direction}`)) {
          content.classList.add(`offcanvas-aside-${this.direction}`)
        }

        // avoid animation by setting animate to false
        this.animate = false
        // remove previous backdrop
        if (this.getBackdrop()) {
          this.removeBackdrop();
        }

        if (this.isVisible() && !content.classList.contains('show')) {
          content.classList.add('show');
        } else if (!this.isVisible() && content.classList.contains('show')) {
          content.classList.remove('show');
        }
      } else {
        if (content.classList.contains(`offcanvas-aside-${this.direction}`)) {
          content.classList.remove(`offcanvas-aside-${this.direction}`)
        }

        this.animate = true

        if (!this.getBackdrop() && this.isVisible()) {
          this.createBackdrop();
          this.attachEvents();
        }
      }
    }

    onElementEvent(event) {
      if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
        return
      }

      // hide the offcanvas
      this.hide()
    }

    isVisible() {
      return this.options.element.classList.contains('show');
    }

    show() {
      return new Promise(async (resolve, reject) => {
        if (this.options.element.classList.contains('show')) {
          reject();
          return;
        }

        this.triggerEvent(Event.SHOW);

        if (!this.showAside) {
          this.createBackdrop();
        }

        // add a timeout so that the CSS animation works
        await sleep(20);

        // attach event
        console.log('attach events')
        this.attachEvents();

        const onShown = () => {
          this.triggerEvent(Event.SHOWN)

          if (this.animate) {
            this.options.element.removeEventListener(Event.TRANSITION_END, onShown)
            this.options.element.classList.remove('animate')
          }

          resolve();
        }

        if (this.showAside) {
          const container = this.getConfig('container', DEFAULT_PROPERTIES.container);
          if (!container.classList.contains('show')) {
            container.classList.add('show');
          }
        }

        if (this.animate) {
          this.options.element.addEventListener(Event.TRANSITION_END, onShown)
          this.options.element.classList.add('animate')
        } else {
          // directly trigger the onShown
          onShown()
        }

        this.options.element.classList.add('show')
      });
    }

    hide() {
      return new Promise(async (resolve, reject) => {
        if (!this.options.element.classList.contains('show')) {
          reject();
          return;
        }

        this.triggerEvent(Event.HIDE)

        this.detachEvents()

        if (this.animate) {
          this.options.element.classList.add('animate')
        }

        if (this.showAside) {
          const container = this.getConfig('container', DEFAULT_PROPERTIES.container);
          if (container.classList.contains('show')) {
            container.classList.remove('show');
          }
        }

        this.options.element.classList.remove('show')

        resolve();

        if (!this.showAside) {
          const backdrop = this.getBackdrop()

          const onHidden = () => {
            if (this.animate) {
              this.options.element.classList.remove('animate')
            }

            backdrop.removeEventListener(Event.TRANSITION_END, onHidden)
            this.triggerEvent(Event.HIDDEN)
            this.removeBackdrop()
          }

          backdrop.addEventListener(Event.TRANSITION_END, onHidden)
          backdrop.classList.add('fadeout')
        }
      });
    }

    toggle() {
      if (this.isVisible()) {
        return this.hide();
      }

      return this.show();
    }

    createBackdrop() {
      const backdrop = document.createElement('div')
      backdrop.setAttribute('data-id', this.id)
      backdrop.classList.add(BACKDROP_SELECTOR)

      document.body.appendChild(backdrop)
    }

    getBackdrop() {
      return document.querySelector(`.${BACKDROP_SELECTOR}[data-id="${this.id}"]`)
    }

    removeBackdrop() {
      const backdrop = this.getBackdrop()
      if (backdrop) {
        document.body.removeChild(backdrop)
      }
    }

    attachEvents() {
      Array.from(this.options.element.querySelectorAll('[data-dismiss]') || [])
        .forEach(button => this.registerElement({ target: button, event: 'click' }))

      if (!this.showAside) {
        const backdrop = this.getBackdrop()
        this.registerElement({ target: backdrop, event: Event.START })
      }

      this.registerElement({ target: document, event: 'keyup' })
    }

    detachEvents() {
      console.log('detch')
      const dismissButtons = this.options.element.querySelectorAll('[data-dismiss]')

      if (dismissButtons) {
        Array.from(dismissButtons).forEach(button => this.unregisterElement({ target: button, event: 'click' }))
      }

      if (!this.showAside) {
        const backdrop = this.getBackdrop()
        this.unregisterElement({ target: backdrop, event: Event.START })
      }

      this.unregisterElement({ target: document, event: 'keyup' })
    }

    static identifier() {
      return NAME
    }

    static DOMInterface(options) {
      return super.DOMInterface(OffCanvas, options, components);
    }
  }

  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */
  createJqueryPlugin($, NAME, OffCanvas);

  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */
  const offCanvas = Array.from(document.querySelectorAll(`.${NAME}`) || [])

  offCanvas.forEach((element) => {
    const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES)
    config.element = element

    components.push({ element, offCanvas: new OffCanvas(config) })
  })

  document.addEventListener('click', (event) => {
    const target = findTargetByAttr(event.target, 'data-toggle')
    if (!target) {
      return
    }

    const dataToggleAttr = target.getAttribute('data-toggle')
    if (dataToggleAttr && dataToggleAttr === NAME) {
      const id = target.getAttribute('data-target')
      const element = document.querySelector(id)

      const component = components.find(c => c.element === element)

      if (!component) {
        return
      }

      target.blur()

      component.offCanvas.toggle()
    }
  })

  return OffCanvas
})(window.$ ? window.$ : null)

export default OffCanvas

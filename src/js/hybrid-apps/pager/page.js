/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import { dispatchPageEvent } from '../../common/events/dispatch'

const Page = (() => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = 'page'
  const VERSION = '2.0.0'

  const TEMPLATE_SELECTOR = '[data-template]'

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Page {
    /**
     * Creates an instance of Page.
     * @param {string} pageName
     */
    constructor(pageName) {
      this.name = pageName
      this.events = []
      this.templatePath = null
      this.renderFunction = null
    }

    // getters

    static get version() {
      return `${NAME}.${VERSION}`
    }

    /**
     * Get events
     * @returns {Function[]}
     */
    getEvents() {
      return this.events
    }

    /**
     * Get template
     * @returns {string}
     */
    getTemplate() {
      return this.template
    }

    /**
     * Get render function
     * @returns {Function}
     */
    getRenderFunction() {
      return this.renderFunction
    }

    async renderTemplate() {
      const pageElement = document.querySelector(`[data-page="${this.name}"]`)

      let render = async function (DOMPage, template, elements) {
        if (elements) {
          Array.from(elements).forEach((el) => {
            el.innerHTML = template
          })
        } else {
          DOMPage.innerHTML = template
        }
      }

      if (this.getRenderFunction()) {
        render = this.getRenderFunction()
      }

      await render(pageElement, this.getTemplate(), Array.from(pageElement.querySelectorAll(TEMPLATE_SELECTOR) || []))
    }

    // public

    /**
     *
     * @param {*} callbackFn
     */
    addEventCallback(callbackFn) {
      this.events.push(callbackFn)
    }

    /**
     * Use the given template
     *
     * @param {string} template
     * @param {Function} renderFunction
     */
    setTemplate(template = null, renderFunction = null) {
      if (typeof template !== 'string') {
        throw new Error('The template path must be a string. ' + typeof template + ' is given')
      }

      this.template = template

      if (typeof renderFunction === 'function') {
        this.renderFunction = renderFunction
      }
    }

    /**
     * Add a transition handler
     *
     * @param {Function} fn
     */
    setPreventTransition(fn) {
      if (typeof fn !== 'function') {
        throw new Error(`${NAME}: invalid function to handle page transitions`);
      }
      this.preventTransitionFn = fn;
    }

    getPreventTransition() {
      return this.preventTransitionFn;
    }

    /**
     * Trigger scopes
     * @param {string} eventName
     * @param {{}} [eventParams={}]
     */
    triggerScopes(eventName, eventParams = {}) {
      const eventNameAlias = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`

      this.events.forEach((scope) => {
        const scopeEvent = scope[eventName]
        const scopeEventAlias = scope[eventNameAlias]
        if (typeof scopeEvent === 'function') {
          scopeEvent.apply(this, eventParams)
        }

        // trigger the event alias
        if (typeof scopeEventAlias === 'function') {
          scopeEventAlias.apply(this, eventParams)
        }
      })

      dispatchPageEvent(eventName, this.name, eventParams)
    }
  }

  return Page
})()

export default Page

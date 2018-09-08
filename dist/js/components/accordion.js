'use strict';

function dispatchWinDocEvent(eventName, moduleName, detail = {}) {
  const fullEventName = `${eventName}.ph.${moduleName}`;
  window.dispatchEvent(new CustomEvent(fullEventName, {
    detail
  }));
  document.dispatchEvent(new CustomEvent(fullEventName, {
    detail
  }));
}
function dispatchElementEvent(domElement, eventName, moduleName, detail = {}) {
  const fullEventName = `${eventName}.ph.${moduleName}`;
  domElement.dispatchEvent(new CustomEvent(fullEventName, {
    detail
  }));
}

function generateId() {
  return Math.random().toString(36).substr(2, 10);
}
function findTargetByClass(target, parentClass) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.classList.contains(parentClass)) {
      return target;
    }
  }

  return null;
}
function findTargetByAttr(target, attr) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.getAttribute(attr) !== null) {
      return target;
    }
  }

  return null;
}
/* eslint no-param-reassign: 0 */

function createJqueryPlugin($ = null, name, obj) {
  if (!$) {
    return;
  }

  const mainFn = function mainFn(options = {}) {
    const opts = options;

    if (this[0]) {
      opts.element = this[0];
    }

    return obj.DOMInterface(opts);
  };

  $.fn[name] = mainFn;
  $.fn[name].Constructor = obj;
  $.fn[name].noConflict = mainFn;
}
function sleep(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

// @todo keep ?
if (typeof window !== 'undefined') {
  window.addEventListener('error', () => {
    console.error('An error has occured! You can pen an issue here: https://github.com/quark-dev/Phonon-Framework/issues');
  });
} // Use available events


let availableEvents = ['mousedown', 'mousemove', 'mouseup'];
let touchScreen = false;

if (typeof window !== 'undefined') {
  if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
    touchScreen = true;
    availableEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
  }

  if (window.navigator.pointerEnabled) {
    availableEvents = ['pointerdown', 'pointermove', 'pointerup', 'pointercancel'];
  } else if (window.navigator.msPointerEnabled) {
    availableEvents = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel'];
  }
}

const el = document.createElement('div');
const transitions = [{
  name: 'transition',
  start: 'transitionstart',
  end: 'transitionend'
}, {
  name: 'MozTransition',
  start: 'transitionstart',
  end: 'transitionend'
}, {
  name: 'msTransition',
  start: 'msTransitionStart',
  end: 'msTransitionEnd'
}, {
  name: 'WebkitTransition',
  start: 'webkitTransitionStart',
  end: 'webkitTransitionEnd'
}];
const animations = [{
  name: 'animation',
  start: 'animationstart',
  end: 'animationend'
}, {
  name: 'MozAnimation',
  start: 'animationstart',
  end: 'animationend'
}, {
  name: 'msAnimation',
  start: 'msAnimationStart',
  end: 'msAnimationEnd'
}, {
  name: 'WebkitAnimation',
  start: 'webkitAnimationStart',
  end: 'webkitAnimationEnd'
}];
const transitionStart = transitions.find(t => el.style[t.name] !== undefined).start;
const transitionEnd = transitions.find(t => el.style[t.name] !== undefined).end;
const animationStart = animations.find(t => el.style[t.name] !== undefined).start;
const animationEnd = animations.find(t => el.style[t.name] !== undefined).end;
var Event = {
  // touch screen support
  TOUCH_SCREEN: touchScreen,
  // network
  NETWORK_ONLINE: 'online',
  NETWORK_OFFLINE: 'offline',
  NETWORK_RECONNECTING: 'reconnecting',
  NETWORK_RECONNECTING_SUCCESS: 'reconnect.success',
  NETWORK_RECONNECTING_FAILURE: 'reconnect.failure',
  // user interface states
  SHOW: 'show',
  SHOWN: 'shown',
  HIDE: 'hide',
  HIDDEN: 'hidden',
  // hash
  HASH: 'hash',
  // touch, mouse and pointer events polyfill
  START: availableEvents[0],
  MOVE: availableEvents[1],
  END: availableEvents[2],
  CANCEL: typeof availableEvents[3] === 'undefined' ? null : availableEvents[3],
  // click
  CLICK: 'click',
  // transitions
  TRANSITION_START: transitionStart,
  TRANSITION_END: transitionEnd,
  // animations
  ANIMATION_START: animationStart,
  ANIMATION_END: animationEnd,
  // selectbox
  ITEM_SELECTED: 'itemSelected'
};

const getAttribute = (first, second) => {
  if (first === '') {
    return `data-${second}`;
  }

  return `data-${first}-${second}`;
};

function setAttributesConfig(element, obj = {}, attrs, start = '') {
  const keys = Object.keys(obj);
  keys.forEach(key => {
    if (start === '' && attrs.indexOf(key) === -1) {
      // continue with next iteration
      return;
    }

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      let keyStart = key;

      if (start !== '') {
        keyStart = `${start}-${key}`;
      }

      setAttributesConfig(element, obj[key], attrs, keyStart);
      return;
    }

    const attr = getAttribute(start, key);
    element.setAttribute(attr, obj[key]);
  });
}
function getAttributesConfig(element, obj = {}, attrs, start = '') {
  const newObj = Object.assign({}, obj);
  const keys = Object.keys(obj);
  keys.forEach(key => {
    if (start === '' && attrs.indexOf(key) === -1) {
      // continue with next iteration
      return;
    }

    if (obj[key] !== null && obj[key].constructor === Object) {
      let keyStart = key;

      if (start !== '') {
        keyStart = `${start}-${key}`;
      }

      newObj[key] = getAttributesConfig(element, obj[key], attrs, keyStart);
      return;
    } // update value


    let value = obj[key]; // default value

    const type = typeof value;
    const attr = getAttribute(start, key);
    const attrValue = element.getAttribute(attr);

    if (attrValue !== null) {
      if (type === 'boolean') {
        // convert string to boolean
        value = attrValue === 'true';
      } else if (!Number.isNaN(attrValue)) {
        value = parseInt(attrValue, 10);
      } else {
        value = attrValue;
      }
    }

    newObj[key] = value;
  });
  return newObj;
}
const stack = [];
var ComponentManager = {
  add(component) {
    stack.push(component);
  },

  remove(component) {
    const index = stack.findIndex(c => Object.is(component, c));

    if (index > -1) {
      stack.splice(index, 1);
    }
  },

  closable(component) {
    return stack.length === 0 || Object.is(stack[stack.length - 1], component);
  }

};

/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Component {
  constructor(name, version, defaultOptions = {}, options = {}, optionAttrs = [], supportDynamicElement = false, addToStack = false) {
    this.name = name;
    this.version = version;
    this.options = options;
    Object.keys(defaultOptions).forEach(prop => {
      if (typeof this.options[prop] === 'undefined') {
        this.options[prop] = defaultOptions[prop];
      }
    });
    this.optionAttrs = optionAttrs;
    this.supportDynamicElement = supportDynamicElement;
    this.addToStack = addToStack;
    this.id = generateId();
    const checkElement = !this.supportDynamicElement || this.options.element !== null;

    if (typeof this.options.element === 'string') {
      this.options.element = document.querySelector(this.options.element);
    }

    if (checkElement && !this.options.element) {
      throw new Error(`${this.name}. The element is not a HTMLElement.`);
    }

    this.dynamicElement = this.options.element === null;
    this.registeredElements = [];

    if (!this.dynamicElement) {
      /**
       * if the element exists, we read the data attributes config
       * then we overwrite existing config keys defined in JavaScript, so that
       * we keep the following order
       * [1] default JavaScript configuration of the component
       * [2] Data attributes configuration
       * [3] JavaScript configuration
       */
      this.options = Object.assign(this.options, this.assignJsConfig(this.getAttributes(), this.options)); // then, set the new data attributes to the element

      this.setAttributes();
    }

    this.elementListener = event => this.onBeforeElementEvent(event);
  }

  assignJsConfig(attrConfig, jsConfig) {
    const config = attrConfig;
    this.optionAttrs.forEach(key => {
      if (typeof jsConfig[key] !== 'undefined') {
        config[key] = jsConfig[key];
      }
    });
    return config;
  }

  getVersion() {
    return this.version;
  }

  getElement() {
    return this.options.element;
  }

  getId() {
    return this.id;
  }

  registerElements(elements) {
    elements.forEach(element => this.registerElement(element));
  }

  registerElement(element) {
    element.target.addEventListener(element.event, this.elementListener);
    this.registeredElements.push(element);
  }

  unregisterElements() {
    this.registeredElements.forEach(element => {
      this.unregisterElement(element);
    });
  }

  unregisterElement(element) {
    const registeredElementIndex = this.registeredElements.findIndex(el => el.target === element.target && el.event === element.event);

    if (registeredElementIndex > -1) {
      element.target.removeEventListener(element.event, this.elementListener);
      this.registeredElements.splice(registeredElementIndex, 1);
    } else {
      console.error(`Warning! Unknown registered element: ${element.target} with event: ${element.event}.`);
    }
  }

  triggerEvent(eventName, detail = {}, objectEventOnly = false) {
    if (typeof eventName !== 'string') {
      throw new Error('The event name is not valid.');
    }

    if (this.addToStack) {
      if (eventName === Event.SHOW) {
        ComponentManager.add(this);
      } else if (eventName === Event.HIDE) {
        ComponentManager.remove(this);
      }
    } // event names can be with dot notation like reconnecting.success


    const eventNameObject = eventName.split('.').reduce((acc, current, index) => {
      if (index === 0) {
        return current;
      }

      return acc + current.charAt(0).toUpperCase() + current.slice(1);
    });
    const eventNameAlias = `on${eventNameObject.charAt(0).toUpperCase()}${eventNameObject.slice(1)}`; // object event

    if (typeof this.options[eventNameObject] === 'function') {
      this.options[eventNameObject].apply(this, [detail]);
    }

    if (typeof this.options[eventNameAlias] === 'function') {
      this.options[eventNameAlias].apply(this, [detail]);
    }

    if (objectEventOnly) {
      return;
    } // dom event


    if (this.options.element) {
      dispatchElementEvent(this.options.element, eventName, this.name, detail);
    } else {
      dispatchWinDocEvent(eventName, this.name, detail);
    }
  }

  setAttributes() {
    if (this.optionAttrs.length > 0) {
      setAttributesConfig(this.options.element, this.options, this.optionAttrs);
    }
  }

  getAttributes() {
    const options = Object.assign({}, this.options);
    return getAttributesConfig(this.options.element, options, this.optionAttrs);
  }
  /**
   * the preventClosable method manages concurrency between active components.
   * For example, if there is a shown off-canvas and modal, the last
   * shown component gains the processing priority
   */


  preventClosable() {
    return this.addToStack && !ComponentManager.closable(this);
  }

  onBeforeElementEvent(event) {
    if (this.preventClosable()) {
      return;
    }

    this.onElementEvent(event);
  }
  /**
   * @emits {Event} emit events registered by the component
   * @param {Event} event
   */


  onElementEvent() {
    /* eslint class-methods-use-this: 0 */
  }

  static identifier() {
    return this.name;
  }

  static DOMInterface(ComponentClass, options) {
    return new ComponentClass(options);
  }

}

/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Collapse = ($ => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const NAME = 'collapse';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    element: null,
    toggle: false
  };
  const DATA_ATTRS_PROPERTIES = [];
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Collapse extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);
      this.onTransition = false; // toggle directly

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
          resolve();
        };

        if (!this.options.element.classList.contains('collapsing')) {
          this.options.element.classList.add('collapsing');
        }

        this.options.element.addEventListener(Event.TRANSITION_END, onCollapsed);

        if (!this.isVerticalCollapse()) {
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
      return !this.options.element.classList.contains('collapse-l') && !this.options.element.classList.contains('collapse-r');
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return super.DOMInterface(Collapse, options);
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

  const components = [];
  const collapses = Array.from(document.querySelectorAll(`.${NAME}`) || []);
  collapses.forEach(element => {
    const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
    config.element = element;
    components.push(Collapse.DOMInterface(config));
  });
  document.addEventListener(Event.CLICK, event => {
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

/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const Accordion = ($ => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const NAME = 'accordion';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    element: null
  };
  const DATA_ATTRS_PROPERTIES = [];
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Accordion extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);
      this.collapses = [];
      const toggles = this.options.element.querySelectorAll(`[data-toggle="${NAME}"]`);
      Array.from(toggles).forEach(toggle => {
        const collapseId = toggle.getAttribute('href');
        const collapse = document.querySelector(collapseId);

        if (collapse) {
          this.addCollapse(collapse);
        }
      });
    }

    onElementEvent(event) {
      const id = event.target.getAttribute('href');
      const element = document.querySelector(id);
      this.setCollapses(element);
    }

    addCollapse(element) {
      const collapse = new Collapse({
        element
      });
      this.collapses.push(collapse);
      return collapse;
    }

    getCollapse(element) {
      let collapse = this.collapses.find(c => c.options.element.getAttribute('id') === element.getAttribute('id'));

      if (!collapse) {
        // create a new collapse
        collapse = this.addCollapse();
      }

      return collapse;
    }

    getCollapses() {
      return this.collapses;
    }
    /**
     * Shows the collapse element and hides the other active collapse elements
     * @param {Element} showCollapse
     * @returns {undefined}
     */


    setCollapses(showCollapse) {
      const collapse = this.getCollapse(showCollapse);
      this.collapses.forEach(c => {
        if (c.options.element.getAttribute('id') !== showCollapse.getAttribute('id')) {
          c.hide();
        } else {
          collapse.toggle();
        }
      });
    }
    /**
     * Shows the collapse element
     * @param {(string|Element)} collapseEl
     * @returns {Promise} Promise object represents the completed animation
     */


    async show(collapseEl) {
      let collapse = collapseEl;

      if (typeof collapseEl === 'string') {
        collapse = document.querySelector(collapseEl);
      }

      if (!collapse) {
        throw new Error(`${NAME}. The collapsible ${collapseEl} is an invalid HTMLElement.`);
      }

      this.setCollapses(collapse);
      return true;
    }
    /**
     * Hides the collapse element
     * @param {(string|Element)} collapseEl
     * @returns {Promise} Promise object represents the completed animation
     */


    async hide(collapseEl) {
      let collapse = collapseEl;

      if (typeof collapseEl === 'string') {
        collapse = document.querySelector(collapseEl);
      }

      if (!collapse) {
        throw new Error(`${NAME}. The collapsible ${collapseEl} is an invalid HTMLElement.`);
      }

      const collapseObj = this.getCollapse(collapse);
      return collapseObj.hide();
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return super.DOMInterface(Accordion, options);
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  createJqueryPlugin($, NAME, Accordion);
  /**
   * ------------------------------------------------------------------------
   * DOM Api implementation
   * ------------------------------------------------------------------------
   */

  const components = [];
  const accordions = Array.from(document.querySelectorAll(`.${NAME}`) || []);
  accordions.forEach(element => {
    const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
    config.element = element;
    components.push(Accordion.DOMInterface(config));
  });
  document.addEventListener('click', event => {
    const dataToggleAttr = event.target.getAttribute('data-toggle');

    if (dataToggleAttr && dataToggleAttr === NAME) {
      const collapseId = event.target.getAttribute('data-target') || event.target.getAttribute('href');
      const collapseEl = document.querySelector(collapseId);
      const accordion = findTargetByClass(event.target, 'accordion');

      if (accordion === null) {
        return;
      }

      const accordionId = accordion.getAttribute('id');
      const component = components.find(c => c.getElement().getAttribute('id') === accordionId);

      if (!component) {
        return;
      } // if the collapse has been added programmatically, we add it


      const targetCollapse = component.getCollapses().find(c => c.getElement() === collapseEl);

      if (!targetCollapse) {
        component.addCollapse(collapseEl);
      }

      component.show(collapseId);
    }
  });
  return Accordion;
})(window.$ ? window.$ : null);

module.exports = Accordion;
//# sourceMappingURL=accordion.js.map

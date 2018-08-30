'use strict';

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
  // transitions
  TRANSITION_START: transitionStart,
  TRANSITION_END: transitionEnd,
  // animations
  ANIMATION_START: animationStart,
  ANIMATION_END: animationEnd,
  // dropdown
  ITEM_SELECTED: 'itemSelected'
};

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
function findTargetByAttr(target, attr) {
  for (; target && target !== document; target = target.parentNode) {
    if (target.getAttribute(attr) !== null) {
      return target;
    }
  }

  return null;
}
function createJqueryPlugin($ = null, name, obj) {
  if (!$) {
    return;
  }

  const mainFn = function mainFn(options = {}) {
    const opts = options;

    if (this[0]) {
      opts.element = this[0];
    }

    return obj._DOMInterface(opts);
  };

  $.fn[name] = mainFn;
  $.fn[name].Constructor = obj;
  $.fn[name].noConflict = mainFn;
}

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
      } else if (!isNaN(attrValue)) {
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
    this.options = options; // @todo keep?
    // this.options = Object.assign(defaultOptions, options)

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
       * then we overwrite existing config keys in JavaScript, so that
       * we keep the following order
       * [1] default JavaScript configuration of the component
       * [2] Data attributes configuration if the element exists in the DOM
       * [3] JavaScript configuration
       */
      this.options = Object.assign(this.options, this.assignJsConfig(this.getAttributes(), options)); // then, set the new data attributes to the element

      this.setAttributes();
    }

    this.elementListener = event => this.onBeforeElementEvent(event);
  }

  assignJsConfig(attrConfig, options) {
    this.optionAttrs.forEach(key => {
      if (options[key]) {
        attrConfig[key] = options[key];
      }
    });
    return attrConfig;
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
   * For example, if there is a shown off-canvas and dialog, the last
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

  onElementEvent(event) {//
  }

  static identifier() {
    return this.name;
  }

  static _DOMInterface(ComponentClass, options) {
    return new ComponentClass(options);
  }

}

/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

const OffCanvas = ($ => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */
  const NAME = 'offCanvas';
  const VERSION = '2.0.0';
  const BACKDROP_SELECTOR = 'off-canvas-backdrop';
  const DEFAULT_PROPERTIES = {
    element: null,
    aside: {
      md: false,
      lg: false,
      xl: false
    }
  };
  const DATA_ATTRS_PROPERTIES = ['aside'];
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class OffCanvas extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, true);
      this.useBackdrop = true;
      this.currentWidth = null;
      this.animate = true;
      this.directions = ['left', 'right'];
      const sm = {
        name: 'sm',
        media: window.matchMedia('(min-width: 1px)')
      };
      const md = {
        name: 'md',
        media: window.matchMedia('(min-width: 768px)')
      };
      const lg = {
        name: 'lg',
        media: window.matchMedia('(min-width: 992px)')
      };
      const xl = {
        name: 'xl',
        media: window.matchMedia('(min-width: 1200px)')
      };
      this.sizes = [sm, md, lg, xl].reverse();
      this.checkDirection();
      this.checkWidth();
      window.addEventListener('resize', () => this.checkWidth(), false);
    }

    checkDirection() {
      this.directions.every(direction => {
        if (this.options.element.classList.contains(`off-canvas-${direction}`)) {
          this.direction = direction;
          return false;
        }

        return true;
      });
    }

    checkWidth() {
      if (!('matchMedia' in window)) {
        return;
      }

      this.sizes.every(size => {
        const match = size.media.media.match(/[a-z]?-width:\s?([0-9]+)/);

        if (match) {
          if (size.media.matches) {
            if (this.currentWidth !== size.name) {
              this.setAside(size.name);
            }

            this.currentWidth = size.name;
            return false;
          }
        }

        return true;
      });
    }

    preventClosable() {
      return super.preventClosable() || this.options.aside[this.currentWidth] === true;
    }

    setAside(name) {
      const content = document.body;

      if (this.options.aside[name] === true) {
        if (!content.classList.contains(`off-canvas-aside-${this.direction}`)) {
          content.classList.add(`off-canvas-aside-${this.direction}`);
        }

        this.useBackdrop = false; // avoid animation by setting animate to false

        this.animate = false;
        this.show(); // remove previous backdrop

        this.removeBackdrop();
      } else {
        if (content.classList.contains(`off-canvas-aside-${this.direction}`)) {
          content.classList.remove(`off-canvas-aside-${this.direction}`);
        }

        this.hide();
        this.useBackdrop = true;
        this.animate = true;
      }
    }

    onElementEvent(event) {
      if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
        return;
      } // hide the off-canvas


      this.hide();
    }

    show() {
      if (this.options.element.classList.contains('show')) {
        return false;
      } // add a timeout so that the CSS animation works


      setTimeout(() => {
        this.triggerEvent(Event.SHOW);

        const onShown = () => {
          this.triggerEvent(Event.SHOWN);

          if (this.animate) {
            this.options.element.removeEventListener(Event.TRANSITION_END, onShown);
            this.options.element.classList.remove('animate');
          }
        };

        if (this.useBackdrop) {
          this.createBackdrop();
        }

        if (this.animate) {
          this.options.element.addEventListener(Event.TRANSITION_END, onShown);
          this.options.element.classList.add('animate');
        } else {
          // directly trigger the onShown
          onShown();
        }

        this.options.element.classList.add('show'); // attach event

        this.attachEvents();
      }, 1);
      return true;
    }

    hide() {
      if (!this.options.element.classList.contains('show')) {
        return false;
      }

      this.triggerEvent(Event.HIDE);
      this.detachEvents();

      if (this.animate) {
        this.options.element.classList.add('animate');
      }

      this.options.element.classList.remove('show');

      if (this.useBackdrop) {
        const backdrop = this.getBackdrop();

        const onHidden = () => {
          if (this.animate) {
            this.options.element.classList.remove('animate');
          }

          backdrop.removeEventListener(Event.TRANSITION_END, onHidden);
          this.triggerEvent(Event.HIDDEN);
          this.removeBackdrop();
        };

        backdrop.addEventListener(Event.TRANSITION_END, onHidden);
        backdrop.classList.add('fadeout');
      }

      return true;
    }

    createBackdrop() {
      const backdrop = document.createElement('div');
      backdrop.setAttribute('data-id', this.id);
      backdrop.classList.add(BACKDROP_SELECTOR);
      document.body.appendChild(backdrop);
    }

    getBackdrop() {
      return document.querySelector(`.${BACKDROP_SELECTOR}[data-id="${this.id}"]`);
    }

    removeBackdrop() {
      const backdrop = this.getBackdrop();

      if (backdrop) {
        document.body.removeChild(backdrop);
      }
    }

    attachEvents() {
      const dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');

      if (dismissButtons) {
        Array.from(dismissButtons).forEach(button => this.registerElement({
          target: button,
          event: 'click'
        }));
      }

      if (this.useBackdrop) {
        const backdrop = this.getBackdrop();
        this.registerElement({
          target: backdrop,
          event: Event.START
        });
      }

      this.registerElement({
        target: document,
        event: 'keyup'
      });
    }

    detachEvents() {
      const dismissButtons = this.options.element.querySelectorAll('[data-dismiss]');

      if (dismissButtons) {
        Array.from(dismissButtons).forEach(button => this.unregisterElement({
          target: button,
          event: 'click'
        }));
      }

      if (this.useBackdrop) {
        const backdrop = this.getBackdrop();
        this.unregisterElement({
          target: backdrop,
          event: Event.START
        });
      }

      this.unregisterElement({
        target: document,
        event: 'keyup'
      });
    }

    static identifier() {
      return NAME;
    }

    static _DOMInterface(options) {
      return super._DOMInterface(OffCanvas, options);
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

  const components = [];
  const offCanvas = document.querySelectorAll(`.${NAME}`);

  if (offCanvas) {
    Array.from(offCanvas).forEach(element => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;
      components.push({
        element,
        offCanvas: new OffCanvas(config)
      });
    });
  }

  document.addEventListener('click', event => {
    const target = findTargetByAttr(event.target, 'data-toggle');

    if (!target) {
      return;
    }

    const dataToggleAttr = target.getAttribute('data-toggle');

    if (dataToggleAttr && dataToggleAttr === NAME) {
      const id = target.getAttribute('data-target');
      const element = document.querySelector(id);
      const component = components.find(c => c.element === element);

      if (!component) {
        return;
      }

      target.blur();
      component.offCanvas.show();
    }
  });
  return OffCanvas;
})(window.$ ? window.$ : null);

module.exports = OffCanvas;
//# sourceMappingURL=offcanvas.js.map

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
  // click
  CLICK: 'click',
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

  static DOMInterface(ComponentClass, options) {
    return new ComponentClass(options);
  }

}

/**
* --------------------------------------------------------------------------
* Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
* --------------------------------------------------------------------------
*/

const Notification = ($ => {
  /**
   * ------------------------------------------------------------------------
  * Constants
  * ------------------------------------------------------------------------
  */
  const NAME = 'notification';
  const VERSION = '2.0.0';
  const DEFAULT_PROPERTIES = {
    element: null,
    message: '',
    showButton: true,
    timeout: null,
    background: 'primary'
  };
  const DATA_ATTRS_PROPERTIES = ['timeout'];
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class Notification extends Component {
    constructor(options = {}) {
      super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, false);
      this.template = '' + '<div class="notification">' + '<div class="notification-inner">' + '<div class="message"></div>' + '<button type="button" class="close" data-dismiss="notification" aria-label="Close">' + '<span aria-hidden="true">&times;</span>' + '</button>' + '</div>' + '</div>';

      if (this.dynamicElement) {
        this.build();
      }

      this.timeoutCallback = null;
    }

    build() {
      const builder = document.createElement('div');
      builder.innerHTML = this.template;
      this.options.element = builder.firstChild; // text message

      this.options.element.querySelector('.message').innerHTML = this.options.message;

      if (!this.options.showButton) {
        this.options.element.querySelector('button').style.display = 'none';
      }

      document.body.appendChild(this.options.element);
      this.setAttributes();
    }

    show() {
      if (this.options.element === null) {
        // build and insert a new DOM element
        this.build();
      }

      if (this.options.element.classList.contains('show')) {
        return false;
      } // reset color


      if (this.options.background) {
        this.options.element.removeAttribute('class');
        this.options.element.setAttribute('class', 'notification');
        this.options.element.classList.add(`bg-${this.options.background}`);
        this.options.element.querySelector('button').classList.add(`btn-${this.options.background}`);
      }

      if (this.options.showButton) {
        // attach the button handler
        const buttonElement = this.options.element.querySelector('button');
        this.registerElement({
          target: buttonElement,
          event: 'click'
        });
      }

      setTimeout(() => {
        this.options.element.classList.add('show'); // set position

        const activeNotifications = document.querySelectorAll('.notification.show') || [];
        let pushDistance = 0;
        activeNotifications.forEach(notification => {
          if (this.options.element !== notification) {
            const style = getComputedStyle(notification);
            pushDistance += notification.offsetHeight + parseInt(style.marginBottom, 10);
          }
        });
        this.options.element.style.transform = `translateY(${pushDistance}px)`;
        this.triggerEvent(Event.SHOW);

        const onShown = () => {
          this.triggerEvent(Event.SHOWN);
          this.options.element.removeEventListener(Event.TRANSITION_END, onShown);
        };

        this.options.element.addEventListener(Event.TRANSITION_END, onShown);
      }, 1);

      if (Number.isInteger(this.options.timeout) && this.options.timeout > 0) {
        // if there is a timeout, auto hide the notification
        this.timeoutCallback = setTimeout(() => {
          this.hide();
        }, this.options.timeout + 1);
      }

      return true;
    }

    hide() {
      /*
       * prevent to close a notification with a timeout
       * if the user has already clicked on the button
       */
      if (this.timeoutCallback) {
        clearTimeout(this.timeoutCallback);
        this.timeoutCallback = null;
      }

      if (!this.options.element.classList.contains('show')) {
        return false;
      }

      this.triggerEvent(Event.HIDE);

      if (this.options.showButton) {
        const buttonElement = this.options.element.querySelector('button');
        this.unregisterElement({
          target: buttonElement,
          event: 'click'
        });
      }

      this.options.element.classList.remove('show');
      this.options.element.classList.add('hide');

      const onHidden = () => {
        this.options.element.removeEventListener(Event.TRANSITION_END, onHidden);
        this.options.element.classList.remove('hide');
        this.triggerEvent(Event.HIDDEN);

        if (this.dynamicElement) {
          document.body.removeChild(this.options.element);
          this.options.element = null;
        }
      };

      this.options.element.addEventListener(Event.TRANSITION_END, onHidden);
      return true;
    }

    onElementEvent() {
      this.hide();
    }

    static identifier() {
      return NAME;
    }

    static DOMInterface(options) {
      return super.DOMInterface(Notification, options);
    }

  }
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  createJqueryPlugin($, NAME, Notification);
  return Notification;
})(window.$ ? window.$ : null);

module.exports = Notification;
//# sourceMappingURL=notification.js.map

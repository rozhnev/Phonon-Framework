/*!
    * Phonon v2.0.0 (https://github.com/quark-dev/Phonon-Framework)
    * Copyright 2015-2018 Quarkdev
    * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
    */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.phonon = factory());
}(this, (function () { 'use strict';

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
  function dispatchPageEvent(eventName, pageName, detail = {}) {
    const fullEventName = `${pageName}.${eventName}`;
    window.dispatchEvent(new CustomEvent(fullEventName, {
      detail
    }));
    document.dispatchEvent(new CustomEvent(fullEventName, {
      detail
    }));
  }

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Page = (() => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'page';
    const VERSION = '2.0.0';
    const TEMPLATE_SELECTOR = '[data-template]';
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
        this.name = pageName;
        this.events = [];
        this.templatePath = null;
        this.renderFunction = null;
      } // getters


      static get version() {
        return `${NAME}.${VERSION}`;
      }
      /**
       * Get events
       * @returns {Function[]}
       */


      getEvents() {
        return this.events;
      }
      /**
       * Get template
       * @returns {string}
       */


      getTemplate() {
        return this.template;
      }
      /**
       * Get render function
       * @returns {Function}
       */


      getRenderFunction() {
        return this.renderFunction;
      }

      async renderTemplate() {
        const pageElement = document.querySelector(`[data-page="${this.name}"]`);

        let render = async function render(DOMPage, template, elements) {
          if (elements) {
            Array.from(elements).forEach(el => {
              el.innerHTML = template;
            });
          } else {
            DOMPage.innerHTML = template;
          }
        };

        if (this.getRenderFunction()) {
          render = this.getRenderFunction();
        }

        await render(pageElement, this.getTemplate(), pageElement.querySelectorAll(TEMPLATE_SELECTOR));
      } // public

      /**
       *
       * @param {*} callbackFn
       */


      addEventCallback(callbackFn) {
        this.events.push(callbackFn);
      }
      /**
       * Use the given template
       *
       * @param {string} template
       * @param {Function} renderFunction
       */


      setTemplate(template = null, renderFunction = null) {
        if (typeof template !== 'string') {
          throw new Error('The template path must be a string. ' + typeof template + ' is given');
        }

        this.template = template;

        if (typeof renderFunction === 'function') {
          this.renderFunction = renderFunction;
        }
      }
      /**
       * Trigger scopes
       * @param {string} eventName
       * @param {{}} [eventParams={}]
       */


      triggerScopes(eventName, eventParams = {}) {
        const eventNameAlias = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
        this.events.forEach(scope => {
          const scopeEvent = scope[eventName];
          const scopeEventAlias = scope[eventNameAlias];

          if (typeof scopeEvent === 'function') {
            scopeEvent.apply(this, eventParams);
          } // trigger the event alias


          if (typeof scopeEventAlias === 'function') {
            scopeEventAlias.apply(this, eventParams);
          }
        });
        dispatchPageEvent(eventName, this.name, eventParams);
      }

    }

    return Page;
  })();

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

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Pager = (() => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'pager';
    const VERSION = '2.0.0';
    const DEFAULT_PROPERTIES = {
      hashPrefix: '#!',
      useHash: true,
      defaultPage: null,
      animatePages: true
    };
    let currentPage;
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Pager {
      /**
       * @constructor
       *
       * @param options {Object}
       */
      constructor(options = {}) {
        this.options = Object.assign(DEFAULT_PROPERTIES, options);
        this.pages = [];
        this.started = false; // add global listeners such ash hash change, navigation, etc.

        this.addPagerEvents(); // faster way to init pages before the DOM is ready

        this.onDOMLoaded();
      } // private


      _(selector) {
        return document.querySelector(selector);
      }

      getHash() {
        return window.location.hash.split(this.options.hashPrefix)[1];
      }

      getPageFromHash() {
        const hash = this.getHash();
        const re = new RegExp('[?\/]([^\/]*)');
        const matches = re.exec(hash);

        if (matches && matches[1]) {
          return matches[1];
        }

        return null;
      }

      setHash(pageName) {
        window.location.hash = `${this.options.hashPrefix}/${pageName}`;
      }

      isPageOf(pageName1, pageName2) {
        const page1 = this.getPageModel(pageName1);
        const page2 = this.getPageModel(pageName2);
        return page1 && page2 && page1.name === page2.name;
      }
      /**
       * Attaches the main events for tracking hash changes,
       * click on navigation buttons and links and back history
       */


      addPagerEvents() {
        document.addEventListener('click', event => this.onClick(event));
        window.addEventListener('popstate', event => this.onBackHistory(event));
        window.addEventListener('hashchange', event => this.onHashChange(event));
        document.addEventListener('DOMContentLoaded', event => this.onDOMLoaded(event));
      } // getters


      static get version() {
        return `${NAME}.${VERSION}`;
      } // public


      async showPage(pageName, addToHistory = true, back = false) {
        const oldPage = this._('.current');

        if (oldPage) {
          const oldPageName = oldPage.getAttribute('data-page');

          if (this.isPageOf(pageName, oldPageName)) {
            return;
          }

          oldPage.classList.remove('current'); // history

          window.history.replaceState({
            page: oldPageName
          }, oldPageName, window.location.href);
          this.triggerPageEvent(oldPageName, Event.HIDE);
        }

        this.triggerPageEvent(pageName, Event.SHOW);
        currentPage = pageName; // new page

        const newPage = this._(`[data-page="${pageName}"]`);

        newPage.classList.add('current'); // render template

        const pageModel = this.getPageModel(pageName);

        if (pageModel && pageModel.getTemplate()) {
          await pageModel.renderTemplate();
        }

        if (oldPage) {
          const oldPageName = oldPage.getAttribute('data-page'); // use of prototype-oriented language

          oldPage.back = back;
          oldPage.previousPageName = oldPageName;

          const onPageAnimationEnd = () => {
            if (oldPage.classList.contains('animate')) {
              oldPage.classList.remove('animate');
            }

            oldPage.classList.remove(oldPage.back ? 'pop-page' : 'push-page');
            this.triggerPageEvent(currentPage, Event.SHOWN);
            this.triggerPageEvent(oldPage.previousPageName, Event.HIDDEN);
            oldPage.removeEventListener(Event.ANIMATION_END, onPageAnimationEnd);
          };

          if (this.options.animatePages) {
            oldPage.addEventListener(Event.ANIMATION_END, onPageAnimationEnd);
            oldPage.classList.add('animate');
          } else {
            onPageAnimationEnd();
          }

          oldPage.classList.add(back ? 'pop-page' : 'push-page');
        }
      }

      addUniquePageModel(pageName) {
        if (!this.getPageModel(pageName)) {
          this.pages.push(new Page(pageName));
        }
      }

      getPageModel(pageName) {
        return this.pages.find(page => page.name === pageName);
      }

      getPagesModel(pageNames) {
        return this.pages.filter(page => pageNames.indexOf(page.name) > -1);
      }

      selectorToArray(str) {
        return str.split(',').map(item => item.trim());
      }

      addEvents(callback) {
        if (this.cachePageSelector === '*') {
          // add to all page models
          this.pages.forEach(page => {
            page.addEventCallback(callback);
          });
          return;
        }

        const pageModels = this.getPagesModel(this.selectorToArray(this.cachePageSelector), true);
        pageModels.forEach(page => {
          page.addEventCallback(callback);
        });
        this.cachePageSelector = null;
      }

      setTemplate(templatePath, renderFunction = null) {
        const pageModels = this.getPagesModel(this.selectorToArray(this.cachePageSelector), true);
        pageModels.forEach(page => {
          page.setTemplate(templatePath, renderFunction);
        });
        this.cachePageSelector = null;
      }

      triggerPageEvent(pageName, eventName, eventParams = null) {
        const pageModel = this.getPageModel(pageName);

        if (pageModel) {
          pageModel.triggerScopes(eventName, eventParams);
        }
      }

      onClick(event) {
        const pageName = event.target.getAttribute('data-navigate');
        const pushPage = !(event.target.getAttribute('data-pop-page') === 'true');

        if (pageName) {
          if (pageName === '$back') {
            // the popstate event will be triggered
            window.history.back();
            return;
          }
          /*
           * If we he use the hash as trigger,
           * we change it dynamically so that the hashchange event is called
           * Otherwise, we show the page
           */


          if (this.options.useHash) {
            this.setHash(pageName);
          } else {
            this.showPage(pageName, true, pushPage);
          }
        }
      }

      onBackHistory(event = {}) {
        const pageName = event.state ? event.state.page : null;

        if (!pageName) {
          return;
        }

        this.showPage(pageName, true, true);
      }

      onHashChange() {
        const params = (this.getHash() ? this.getHash().split('/') : []).filter(p => p.length > 0);

        if (params.length > 0) {
          // remove first value which is the page name
          params.shift();
        }

        this.triggerPageEvent(currentPage, Event.HASH, params);
        const navPage = this.getPageFromHash();

        if (navPage) {
          this.showPage(navPage);
        }
      }
      /**
       * Queries the page nodes in the DOM
       */


      onDOMLoaded() {
        const pages = document.querySelectorAll('[data-page]');

        if (!pages) {
          return;
        }

        pages.forEach(page => {
          let pageName = page.getAttribute('data-page');
          /*
           * the page name can be given with the attribute data-page
           * or with its node name
           */

          if (!pageName) {
            pageName = page.nodeName;
          }

          this.addUniquePageModel(pageName);
        });
      }

      select(pageName, addPageModel = true) {
        this.cachePageSelector = pageName;

        if (addPageModel && pageName !== '*') {
          this.addUniquePageModel(pageName);
        }

        return this;
      }

      start(forceDefaultPage = false) {
        // check if the app has been already started
        if (this.started) {
          throw new Error(`${NAME}. The app has been already started.`);
        }

        this.started = true; // force default page on Cordova

        if (window.cordova) {
          forceDefaultPage = true;
        }

        let pageName = this.getPageFromHash();

        if (!this.getPageModel(pageName)) {
          pageName = this.options.defaultPage;
        }

        if (forceDefaultPage && !this.options.defaultPage) {
          throw new Error(`${NAME}. The default page must exist for forcing its launch!`);
        }
        /*
         * if the app is configurated to use hash tracking
         * we add the page dynamically in the url
         */


        if (this.options.useHash) {
          this.setHash(pageName);
        }

        this.showPage(forceDefaultPage ? this.options.defaultPage : pageName);
      } // static


      static _DOMInterface(options) {
        return new Pager(options);
      }

    }

    return Pager;
  })();

  /**
  * --------------------------------------------------------------------------
  * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
  * --------------------------------------------------------------------------
  */
  const Binder = (() => {
    /**
    * ------------------------------------------------------------------------
    * Constants
    * ------------------------------------------------------------------------
    */
    const NAME = 'intl-binder';
    const VERSION = '2.0.0';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Binder {
      /**
       * @param {HTMLElement} element
       * @param {Object} data
       */
      constructor(element, data) {
        this.element = element;
        this.data = data;

        if (!this.isElement(this.element)) {
          console.log('Warning, an element is invalid');
          return;
        } // array of HTMLElement


        if (this.element.length && this.element.length > 0) {
          this.setNodes(this.element);
        } else {
          // single HTMLElement
          this.setNode(this.element);
        }
      } // getters


      static get version() {
        return `${NAME}.${VERSION}`;
      }
      /**
       * Checks if the given argument is a DOM element
       * @param {HTMLElement} the argument to test
       * @return {boolean} true if the object is a DOM element, false otherwise
       */


      isElement(element) {
        if (element === null) {
          return false;
        }

        return element instanceof Node || element instanceof NodeList;
      }
      /**
      * Binds some text to the given DOM element
      * @param {HTMLElement} element
      * @param {String} text
      */


      setText(element, text) {
        if (!('textContent' in element)) {
          element.innerText = text;
        } else {
          element.textContent = text;
        }
      }
      /**
       * Binds some html to the given DOM element
       * @param {HTMLElement} element
       * @param {String} text
       */


      setHtml(element, text) {
        element.innerHTML = text;
      }
      /**
       * Binds custom attributes to the given DOM element
       * @param {HTMLElement} element
       * @param {String} attr
       * @param {String} text
       */


      setAttribute(element, attr, text) {
        element.setAttribute(attr, text);
      }
      /**
       * Binds DOM elements
       * @param {HTMLElement} element
       */


      setNode(element) {
        let attr = element.getAttribute('data-i18n');

        if (!attr) {
          return;
        }

        attr = attr.trim();
        const r = /(?:\s|^)([A-Za-z-_0-9]+):\s*(.*?)(?=\s+\w+:|$)/g;
        let m;

        while (m = r.exec(attr)) {
          const key = m[1].trim();
          const value = m[2].trim().replace(',', '');
          let intlValue = this.data[value];

          if (!this.data[value]) {
            console.log(`${NAME}. Warning, ${value} does not exist.`);
            intlValue = value;
          }

          const methodName = 'set' + key.charAt(0).toUpperCase() + key.slice(1);

          if (this[methodName]) {
            this[methodName](element, intlValue);
          } else {
            this.setAttribute(element, key, intlValue);
          }
        }
      }
      /**
       * Binds DOM elements
       * @param {HTMLElement} element
       */


      setNodes(element) {
        Array.from(element).forEach(el => this.setNode(el));
      }

    }

    return Binder;
  })();

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Intl = (() => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'Intl';
    const VERSION = '2.0.0';
    const DEFAULT_PROPERTIES = {
      fallbackLocale: 'en',
      locale: 'en',
      bind: false,
      data: null
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    class Intl {
      /**
       * Creates an instance of Intl.
       * @param {fallbackLocale: string, locale: string, bind: boolean, data: {[lang: string]: {[key: string]: string}}}
       */
      constructor(options = {}) {
        this.options = Object.assign(DEFAULT_PROPERTIES, options);

        if (typeof this.options.fallbackLocale !== 'string') {
          throw new Error(`${NAME}. The fallback locale is mandatory and must be a string.`);
        }

        if (this.options.data === null) {
          throw new Error(`${NAME}. There is no translation data.`);
        }

        if (typeof this.options.data[this.options.fallbackLocale] !== 'object') {
          throw new Error(`${NAME}. The fallback locale must necessarily have translation data.`);
        }

        this.setLocale(this.options.locale, this.options.bind);
      }

      static get version() {
        return `${NAME}.${VERSION}`;
      }

      getLocale() {
        return this.options.locale;
      }

      getFallbackLocale() {
        return this.options.fallbackLocale;
      }
      /**
       * Set default locale
       * @param {string} locale
       * @param {boolean} [bind=true]
       */


      setLocale(locale, bind = false) {
        if (typeof this.options.data[locale] !== 'object') {
          console.error(`${NAME}. ${locale} has no data, fallback in ${this.options.fallbackLocale}.`);
        } else {
          this.options.locale = locale;
        }

        if (bind) {
          this.updateHtml();
        }
      }

      getLanguages() {
        return Object.keys(this.options.data);
      }

      insertValues(value = null, injectableValues = {}) {
        if (typeof value !== 'string') {
          return undefined;
        }

        const match = value.match(/:([a-zA-Z-_0-9]+)/);

        if (match) {
          value = value.replace(match[0], injectableValues[match[1]]);
        }

        if (value.match(/:([a-zA-Z-_0-9]+)/)) {
          return this.insertValues(value, injectableValues);
        }

        return value;
      }

      translate(keyName = null, inject = {}) {
        let data = this.options.data[this.options.locale];

        if (!data) {
          data = this.options.data[this.options.fallbackLocale];
        }

        if (keyName === null || keyName === '*' || Array.isArray(keyName)) {
          if (Array.isArray(keyName)) {
            const keys = Object.keys(data).filter(key => keyName.indexOf(key) > -1);
            const filteredData = {};
            keys.forEach(key => {
              filteredData[key] = this.insertValues(data[key], inject);
            });
            data = filteredData;
          }

          const dataMap = {};

          for (const key in data) {
            dataMap[key] = this.insertValues(data[key], inject);
          }

          return dataMap;
        }

        return this.insertValues(data[keyName], inject);
      } // alias of t()


      t(keyName = null, inject = {}) {
        return this.translate(keyName, inject);
      }
      /**
       * Updates the HTML views
       * @param {HTMLElement} element
       */


      updateHtml(element = null) {
        if (!element) {
          element = document.querySelectorAll('[data-i18n]');
        }

        if (typeof element === 'string') {
          element = document.querySelector(element);
        }

        new Binder(element, this.t());
      } // static


      static _DOMInterface(options) {
        return new Intl(options);
      }

    }

    return Intl;
  })();

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

  const Network = (() => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'network';
    const VERSION = '2.0.0';
    const DEFAULT_PROPERTIES = {
      element: null,
      initialDelay: 3000,
      delay: 5000
    };
    const DATA_ATTRS_PROPERTIES = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Network extends Component {
      /**
       * Creates an instance of Network.
       * @param {{}} [options={}]
       */
      constructor(options = {}) {
        super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, false);
        this.xhr = null;
        this.checkInterval = null;
        this.setStatus(Event.NETWORK_ONLINE);
        setTimeout(() => {
          this.startCheck();
        }, this.options.initialDelay);
      }

      getStatus() {
        return this.status;
      }

      setStatus(status) {
        this.status = status;
      }

      startRequest() {
        this.xhr = new XMLHttpRequest();
        this.xhr.offline = false;
        const url = `/favicon.ico?_=${new Date().getTime()}`;
        this.triggerEvent(Event.NETWORK_RECONNECTING, {
          date: new Date()
        }, false);
        this.xhr.open('HEAD', url, true);
        this.xhr.timeout = this.options.delay - 1;

        this.xhr.ontimeout = () => {
          this.xhr.abort();
          this.xhr = null;
        };

        this.xhr.onload = () => {
          this.onUp();
        };

        this.xhr.onerror = () => {
          this.onDown();
        };

        try {
          this.xhr.send();
        } catch (e) {
          this.onDown();
        }
      }

      onUp() {
        this.triggerEvent(Event.NETWORK_RECONNECTING_SUCCESS, {
          date: new Date()
        }, false);

        if (this.getStatus() !== Event.NETWORK_ONLINE) {
          this.triggerEvent(Event.NETWORK_ONLINE, {
            date: new Date()
          }, false);
        }

        this.setStatus(Event.NETWORK_ONLINE);
      }

      onDown() {
        this.triggerEvent(Event.NETWORK_RECONNECTING_FAILURE, {
          date: new Date()
        }, false);

        if (this.getStatus() !== Event.NETWORK_OFFLINE) {
          this.triggerEvent(Event.NETWORK_OFFLINE, {
            date: new Date()
          }, false);
        }

        this.setStatus(Event.NETWORK_OFFLINE);
      }

      startCheck() {
        this.stopCheck();
        this.startRequest();
        this.checkInterval = setInterval(() => {
          this.startRequest();
        }, this.options.delay);
      }

      stopCheck() {
        if (this.checkInterval !== null) {
          clearInterval(this.checkInterval);
          this.checkInterval = null;
        }
      }

      static _DOMInterface(options) {
        return super._DOMInterface(Network, options);
      }

    }

    return Network;
  })();

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Dialog = ($ => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'dialog';
    const VERSION = '2.0.0';
    const BACKDROP_SELECTOR = 'dialog-backdrop';
    const DEFAULT_PROPERTIES = {
      element: null,
      title: null,
      message: null,
      cancelable: true,
      type: null,
      cancelableKeyCodes: [27, // Escape
      13],
      buttons: [{
        event: 'confirm',
        text: 'Ok',
        dismiss: true,
        class: 'btn btn-primary'
      }]
    };
    const DATA_ATTRS_PROPERTIES = ['cancelable'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Dialog extends Component {
      constructor(options = {}, template = null) {
        super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, true);
        this.template = template || '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<p></p>' + '</div>' + '<div class="dialog-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (this.dynamicElement) {
          this.build();
        }
      }

      build() {
        const builder = document.createElement('div');
        builder.innerHTML = this.template;
        this.options.element = builder.firstChild; // title

        if (this.options.title !== null) {
          this.options.element.querySelector('.dialog-title').innerHTML = this.options.title;
        } // message


        if (this.options.message !== null) {
          this.options.element.querySelector('.dialog-body').firstChild.innerHTML = this.options.message;
        } else {
          // remove paragraph node
          this.removeTextBody();
        } // buttons


        if (this.options.buttons !== null && Array.isArray(this.options.buttons)) {
          if (this.options.buttons.length > 0) {
            this.options.buttons.forEach(button => {
              this.options.element.querySelector('.dialog-footer').appendChild(this.buildButton(button));
            });
          } else {
            this.removeFooter();
          }
        } else {
          this.removeFooter();
        }

        document.body.appendChild(this.options.element);
        this.setAttributes();
      }

      buildButton(buttonInfo = {}) {
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('class', buttonInfo.class || 'btn');
        button.setAttribute('data-event', buttonInfo.event);
        button.innerHTML = buttonInfo.text;

        if (buttonInfo.dismiss) {
          button.setAttribute('data-dismiss', NAME);
        }

        return button;
      }

      buildBackdrop() {
        const backdrop = document.createElement('div');
        backdrop.setAttribute('data-id', this.id);
        backdrop.classList.add(BACKDROP_SELECTOR);
        document.body.appendChild(backdrop);
      }

      getBackdrop() {
        return document.querySelector(`.${BACKDROP_SELECTOR}[data-id="${this.id}"]`);
      }

      removeTextBody() {
        this.options.element.querySelector('.dialog-body').removeChild(this.options.element.querySelector('.dialog-body').firstChild);
      }

      removeFooter() {
        const footer = this.options.element.querySelector('.dialog-footer');
        this.options.element.querySelector('.dialog-content').removeChild(footer);
      }

      center() {
        const computedStyle = window.getComputedStyle(this.options.element);
        const height = computedStyle.height.slice(0, computedStyle.height.length - 2);
        const top = window.innerHeight / 2 - height / 2;
        this.options.element.style.top = `${top}px`;
      }

      show() {
        if (this.options.element === null) {
          // build and insert a new DOM element
          this.build();
        }

        if (this.options.element.classList.contains('show')) {
          return false;
        } // add a timeout so that the CSS animation works


        setTimeout(() => {
          this.triggerEvent(Event.SHOW);
          this.buildBackdrop(); // attach event

          this.attachEvents();

          const onShown = () => {
            this.triggerEvent(Event.SHOWN);
            this.options.element.removeEventListener(Event.TRANSITION_END, onShown);
          };

          this.options.element.addEventListener(Event.TRANSITION_END, onShown);
          this.options.element.classList.add('show');
          this.center();
        }, 10);
        return true;
      }

      onElementEvent(event) {
        // keyboard event (escape and enter)
        if (event.type === 'keyup') {
          if (this.options.cancelableKeyCodes.find(k => k === event.keyCode)) {
            this.hide();
          }

          return;
        } // backdrop event


        if (event.type === Event.START) {
          // hide the dialog
          this.hide();
          return;
        } // button event


        if (event.type === 'click') {
          const eventName = event.target.getAttribute('data-event');

          if (eventName) {
            this.triggerEvent(eventName);
          }

          if (event.target.getAttribute('data-dismiss') === NAME) {
            this.hide();
          }
        }
      }

      hide() {
        if (!this.options.element.classList.contains('show')) {
          return false;
        }

        this.triggerEvent(Event.HIDE);
        this.detachEvents();
        this.options.element.classList.add('hide');
        this.options.element.classList.remove('show');
        const backdrop = this.getBackdrop();

        const onHidden = () => {
          document.body.removeChild(backdrop);
          this.options.element.classList.remove('hide');
          this.triggerEvent(Event.HIDDEN);
          backdrop.removeEventListener(Event.TRANSITION_END, onHidden); // remove generated dialogs from the DOM

          if (this.dynamicElement) {
            document.body.removeChild(this.options.element);
            this.options.element = null;
          }
        };

        backdrop.addEventListener(Event.TRANSITION_END, onHidden);
        backdrop.classList.add('fadeout');
        return true;
      }

      attachEvents() {
        const buttons = this.options.element.querySelectorAll('[data-dismiss], .dialog-footer button');

        if (buttons) {
          Array.from(buttons).forEach(button => this.registerElement({
            target: button,
            event: 'click'
          }));
        } // add events if the dialog is cancelable
        // which means the user can hide the dialog
        // by pressing the ESC key or click on the backdrop


        if (this.options.cancelable) {
          const backdrop = this.getBackdrop();
          this.registerElement({
            target: backdrop,
            event: Event.START
          });
          this.registerElement({
            target: document,
            event: 'keyup'
          });
        }
      }

      detachEvents() {
        const buttons = this.options.element.querySelectorAll('[data-dismiss], .dialog-footer button');

        if (buttons) {
          Array.from(buttons).forEach(button => this.unregisterElement({
            target: button,
            event: 'click'
          }));
        }

        if (this.options.cancelable) {
          const backdrop = this.getBackdrop();
          this.unregisterElement({
            target: backdrop,
            event: Event.START
          });
          this.unregisterElement({
            target: document,
            event: 'keyup'
          });
        }
      }

      static identifier() {
        return NAME;
      }

      static _DOMInterface(options) {
        return super._DOMInterface(Dialog, options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Dialog);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    const components = [];
    const dialogs = document.querySelectorAll(`.${NAME}`);

    if (dialogs) {
      Array.from(dialogs).forEach(element => {
        const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;
        components.push({
          element,
          dialog: new Dialog(config)
        });
      });
    }

    document.addEventListener('click', event => {
      const dataToggleAttr = event.target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        const id = event.target.getAttribute('data-target');
        const element = document.querySelector(id);
        const component = components.find(c => c.element === element);

        if (!component) {
          return;
        } // remove the focus state of the trigger


        event.target.blur();
        component.dialog.show();
      }
    });
    return Dialog;
  })(window.$ ? window.$ : null);

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Prompt = (() => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'prompt';
    const DEFAULT_PROPERTIES = {
      element: null,
      title: null,
      message: null,
      cancelable: true,
      type: NAME,
      buttons: [{
        event: 'cancel',
        text: 'Cancel',
        dismiss: true,
        class: 'btn btn-secondary'
      }, {
        event: 'confirm',
        text: 'Ok',
        dismiss: true,
        class: 'btn btn-primary'
      }]
    };
    const DATA_ATTRS_PROPERTIES = ['cancelable'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Prompt extends Dialog {
      constructor(options = {}) {
        const template = '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<p></p>' + '<input class="form-control" type="text" value="">' + '</div>' + '<div class="dialog-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (!Array.isArray(options.buttons)) {
          options.buttons = DEFAULT_PROPERTIES.buttons;
        }

        super(options, template);
      }

      show() {
        super.show();
        this.attachInputEvent();
      }

      hide() {
        super.hide();
        this.detachInputEvent();
      }

      getInput() {
        return this.options.element.querySelector('.form-control');
      }

      attachInputEvent() {
        this.registerElement({
          target: this.getInput(),
          event: 'keyup'
        });
      }

      detachInputEvent() {
        this.unregisterElement({
          target: this.getInput(),
          event: 'keyup'
        });
      }

      onElementEvent(event) {
        if (event.target === this.getInput()) {
          return;
        }

        super.onElementEvent(event);
      }

      setInputValue(value = '') {
        this.getInput().value = value;
      }

      getInputValue() {
        return this.getInput().value;
      }

      static identifier() {
        return NAME;
      }

      static _DOMInterface(options) {
        return new Prompt(options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */


    const components = [];
    const dialogs = document.querySelectorAll(`.${Dialog.identifier()}`);

    if (dialogs) {
      Array.from(dialogs).forEach(element => {
        const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;

        if (config.type === NAME) {
          // prompt
          components.push(new Prompt(config));
        }
      });
    }

    document.addEventListener('click', event => {
      const dataToggleAttr = event.target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        const id = event.target.getAttribute('data-target');
        const element = document.querySelector(id);
        const component = components.find(c => c.element === element);

        if (!component) {
          return;
        } // remove the focus state of the trigger


        event.target.blur();
        component.dialog.show();
      }
    });
    return Prompt;
  })();

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Confirm = (() => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'confirm';
    const DEFAULT_PROPERTIES = {
      element: null,
      title: null,
      message: null,
      cancelable: true,
      type: NAME,
      buttons: [{
        event: 'cancel',
        text: 'Cancel',
        dismiss: true,
        class: 'btn btn-secondary'
      }, {
        event: 'confirm',
        text: 'Ok',
        dismiss: true,
        class: 'btn btn-primary'
      }]
    };
    const DATA_ATTRS_PROPERTIES = ['cancelable'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Confirm extends Dialog {
      constructor(options = {}) {
        const template = '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<p></p>' + '</div>' + '<div class="dialog-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (!Array.isArray(options.buttons)) {
          options.buttons = DEFAULT_PROPERTIES.buttons;
        }

        super(options, template);
      }

      static identifier() {
        return NAME;
      }

      static _DOMInterface(options) {
        return new Confirm(options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */


    const components = [];
    const dialogs = document.querySelectorAll(`.${Dialog.identifier()}`);

    if (dialogs) {
      Array.from(dialogs).forEach(element => {
        const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;

        if (config.type === NAME) {
          // confirm
          components.push(new Confirm(config));
        }
      });
    }

    document.addEventListener('click', event => {
      const dataToggleAttr = event.target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        const id = event.target.getAttribute('data-target');
        const element = document.querySelector(id);
        const component = components.find(c => c.element === element);

        if (!component) {
          return;
        } // remove the focus state of the trigger


        event.target.blur();
        component.dialog.show();
      }
    });
    return Confirm;
  })();

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Loader = ($ => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'loader';
    const VERSION = '2.0.0';
    const DEFAULT_PROPERTIES = {
      element: null,
      color: null,
      size: null
    };
    const DATA_ATTRS_PROPERTIES = [];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Loader extends Component {
      constructor(options = {}) {
        super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false); // set color

        const loaderSpinner = this.getSpinner();

        if (typeof this.options.color === 'string' && !loaderSpinner.classList.contains(`color-${this.options.color}`)) {
          loaderSpinner.classList.add(`color-${this.options.color}`);
        }

        this.customSize = this.options.size !== null;
      }

      getClientSize() {
        if (!this.customSize) {
          const size = this.options.element.getBoundingClientRect();
          return size.height;
        }

        return this.options.size;
      }

      getSpinner() {
        return this.options.element.querySelector('.loader-spinner');
      }

      show() {
        if (this.options.element.classList.contains('hide')) {
          this.options.element.classList.remove('hide');
        }

        const size = this.getClientSize();
        this.options.size = size;

        if (this.customSize) {
          this.options.element.style.width = `${this.options.size}px`;
          this.options.element.style.height = `${this.options.size}px`;
          const loaderSpinner = this.getSpinner();
          loaderSpinner.style.width = `${this.options.size}px`;
          loaderSpinner.style.height = `${this.options.size}px`;
        }

        return true;
      }

      animate(startAnimation = true) {
        if (startAnimation) {
          this.show();
        } else {
          this.hide();
        }

        const loaderSpinner = this.getSpinner();

        if (startAnimation && !loaderSpinner.classList.contains('loader-spinner-animated')) {
          loaderSpinner.classList.add('loader-spinner-animated');
          return true;
        }

        if (!startAnimation && loaderSpinner.classList.contains('loader-spinner-animated')) {
          loaderSpinner.classList.remove('loader-spinner-animated');
        }

        return true;
      }

      hide() {
        if (!this.options.element.classList.contains('hide')) {
          this.options.element.classList.add('hide');
        }

        return true;
      }

      static identifier() {
        return NAME;
      }

      static _DOMInterface(options) {
        return super._DOMInterface(Loader, options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Loader);
    return Loader;
  })(window.$ ? window.$ : null);

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Loader$1 = (() => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'loader';
    const DEFAULT_PROPERTIES = {
      element: null,
      title: null,
      message: null,
      cancelable: true,
      type: NAME,
      buttons: []
    };
    const DATA_ATTRS_PROPERTIES = ['cancelable'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Loader$$1 extends Dialog {
      constructor(options = {}) {
        const template = '' + '<div class="dialog" tabindex="-1" role="dialog">' + '<div class="dialog-inner" role="document">' + '<div class="dialog-content">' + '<div class="dialog-header">' + '<h5 class="dialog-title"></h5>' + '</div>' + '<div class="dialog-body">' + '<p></p>' + '<div class="mx-auto text-center">' + '<div class="loader mx-auto d-block">' + '<div class="loader-spinner"></div>' + '</div>' + '</div>' + '</div>' + '<div class="dialog-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (!Array.isArray(options.buttons)) {
          options.buttons = options.cancelable ? DEFAULT_PROPERTIES.buttons : [];
        }

        super(options, template);
        this.spinner = null;
      }

      show() {
        super.show();
        this.spinner = new Loader({
          element: this.getElement().querySelector('.loader')
        });
        this.spinner.animate(true);
      }

      hide() {
        super.hide();
        this.spinner.animate(false);
        this.spinner = null;
      }

      static identifier() {
        return NAME;
      }

      static _DOMInterface(options) {
        return new Loader$$1(options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */


    const components = [];
    const dialogs = document.querySelectorAll(`.${Dialog.identifier()}`);

    if (dialogs) {
      Array.from(dialogs).forEach(element => {
        const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;

        if (config.type === NAME) {
          // loader
          components.push(new Loader$$1(config));
        }
      });
    }

    document.addEventListener('click', event => {
      const dataToggleAttr = event.target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        const id = event.target.getAttribute('data-target');
        const element = document.querySelector(id);
        const component = components.find(c => c.element === element);

        if (!component) {
          return;
        } // remove the focus state of the trigger


        event.target.blur();
        component.dialog.show();
      }
    });
    return Loader$$1;
  })();

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

      static _DOMInterface(options) {
        return super._DOMInterface(Notification, options);
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
    const DATA_ATTRS_PROPERTIES = ['toggle'];
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

      show() {
        if (this.onTransition) {
          return false;
        }

        if (this.options.element.classList.contains('show')) {
          return false;
        }

        this.onTransition = true;

        const onCollapsed = () => {
          this.options.element.classList.add('show');
          this.options.element.classList.remove('collapsing');
          this.options.element.removeEventListener(Event.TRANSITION_END, onCollapsed);
          this.options.element.setAttribute('aria-expanded', true);
          this.onTransition = false;
        };

        if (!this.options.element.classList.contains('collapsing')) {
          this.options.element.classList.add('collapsing');
        }

        this.options.element.addEventListener(Event.TRANSITION_END, onCollapsed);
        const height = this.getHeight();
        this.options.element.style.height = '0px';
        setTimeout(() => {
          this.options.element.style.height = `${height}px`;
        }, 20);
        return true;
      }

      hide() {
        if (this.onTransition) {
          return false;
        }

        if (!this.options.element.classList.contains('show')) {
          return false;
        }

        this.onTransition = true;

        const onCollapsed = () => {
          this.options.element.classList.remove('collapsing');
          this.options.element.style.height = 'auto';
          this.options.element.removeEventListener(Event.TRANSITION_END, onCollapsed);
          this.options.element.setAttribute('aria-expanded', false);
          this.onTransition = false;
        };

        this.options.element.style.height = '0px';

        if (!this.options.element.classList.contains('collapsing')) {
          this.options.element.classList.add('collapsing');
        }

        this.options.element.addEventListener(Event.TRANSITION_END, onCollapsed);
        this.options.element.classList.remove('show');
        return true;
      }

      static identifier() {
        return NAME;
      }

      static _DOMInterface(options) {
        return super._DOMInterface(Collapse, options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */


    const components = [];
    const collapses = document.querySelectorAll(`.${NAME}`);

    if (collapses) {
      collapses.forEach(element => {
        // const config = {}
        const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;
        components.push(Collapse._DOMInterface(config));
      });
    }

    document.addEventListener('click', event => {
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

      show(collapseEl) {
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

      hide(collapseEl) {
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

      static _DOMInterface(options) {
        return super._DOMInterface(Accordion, options);
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
    const accordions = document.querySelectorAll(`.${NAME}`);

    if (accordions) {
      Array.from(accordions).forEach(element => {
        const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;
        components.push(Accordion._DOMInterface(config));
      });
    }

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

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Tab = ($ => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'tab';
    const VERSION = '2.0.0';
    const DEFAULT_PROPERTIES = {};
    const DATA_ATTRS_PROPERTIES = [];
    const TAB_CONTENT_SELECTOR = '.tab-pane';
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Tab extends Component {
      constructor(options = {}) {
        super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);
      }

      show() {
        if (this.options.element.classList.contains('active')) {
          return false;
        }

        const id = this.options.element.getAttribute('href');
        const nav = findTargetByClass(this.options.element, 'nav');
        const navTabs = nav ? nav.querySelectorAll(`[data-toggle="${NAME}"]`) : null;

        if (navTabs) {
          Array.from(navTabs).forEach(tab => {
            if (tab.classList.contains('active')) {
              tab.classList.remove('active');
            }

            tab.setAttribute('aria-selected', false);
          });
        }

        this.options.element.classList.add('active');
        this.options.element.setAttribute('aria-selected', true);
        const tabContent = document.querySelector(id);
        const tabContents = tabContent.parentNode.querySelectorAll(TAB_CONTENT_SELECTOR);

        if (tabContents) {
          Array.from(tabContents).forEach(tab => {
            if (tab.classList.contains('active')) {
              tab.classList.remove('active');
            }
          });
        }

        tabContent.classList.add('showing');
        setTimeout(() => {
          const onShowed = () => {
            tabContent.classList.remove('animate');
            tabContent.classList.add('active');
            tabContent.classList.remove('showing');
            tabContent.removeEventListener(Event.TRANSITION_END, onShowed);
          };

          tabContent.addEventListener(Event.TRANSITION_END, onShowed);
          tabContent.classList.add('animate');
        }, 20);
        return true;
      }

      hide() {
        if (!this.options.element.classList.contains('active')) {
          return false;
        }

        if (this.options.element.classList.contains('active')) {
          this.options.element.classList.remove('active');
        }

        this.options.element.setAttribute('aria-selected', false);
        const id = this.options.element.getAttribute('href');
        const tabContent = document.querySelector(id);

        if (tabContent.classList.contains('active')) {
          tabContent.classList.remove('active');
        }

        return true;
      }

      static identifier() {
        return NAME;
      }

      static _DOMInterface(options) {
        return super._DOMInterface(Tab, options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Tab);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    const components = [];
    const tabs = document.querySelectorAll(`[data-toggle="${NAME}"]`);

    if (tabs) {
      Array.from(tabs).forEach(element => {
        // const config = {}
        const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;
        components.push(Tab._DOMInterface(config));
      });
    }

    document.addEventListener('click', event => {
      const dataToggleAttr = event.target.getAttribute('data-toggle');

      if (dataToggleAttr && dataToggleAttr === NAME) {
        const id = event.target.getAttribute('href');
        const component = components.find(c => c.getElement().getAttribute('href') === id);

        if (!component) {
          return;
        }

        component.show();
      }
    });
    return Tab;
  })(window.$ ? window.$ : null);

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Progress = ($ => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'progress';
    const VERSION = '2.0.0';
    const DEFAULT_PROPERTIES = {
      element: null,
      height: 5,
      min: 0,
      max: 100,
      label: false,
      striped: false,
      background: null
    };
    const DATA_ATTRS_PROPERTIES = ['height', 'min', 'max', 'label', 'striped', 'background'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Progress extends Component {
      constructor(options = {}) {
        super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false); // set the wanted height

        this.options.element.style.height = `${this.options.height}px`; // set min and max values

        const progressBar = this.getProgressBar();
        progressBar.setAttribute('aria-valuemin', `${this.options.min}`);
        progressBar.setAttribute('aria-valuemax', `${this.options.max}`); // set striped

        if (this.options.striped && !progressBar.classList.contains('progress-bar-striped')) {
          progressBar.classList.add('progress-bar-striped');
        } // set background


        if (typeof this.options.background === 'string' && !progressBar.classList.contains(`bg-${this.options.background}`)) {
          progressBar.classList.add(`bg-${this.options.background}`);
        }
      }

      getProgressBar() {
        return this.options.element.querySelector('.progress-bar');
      }

      set(value = 0) {
        const progressBar = this.getProgressBar();
        const progress = Math.round(value / (this.options.min + this.options.max) * 100);

        if (value < this.options.min) {
          console.error(`${NAME}. Warning, ${value} is under min value.`);
          return false;
        }

        if (value > this.options.max) {
          console.error(`${NAME}. Warning, ${value} is above max value.`);
          return false;
        }

        progressBar.setAttribute('aria-valuenow', `${value}`); // set label

        if (this.options.label) {
          progressBar.innerHTML = `${progress}%`;
        } // set percentage


        progressBar.style.width = `${progress}%`;
        return true;
      }

      animate(startAnimation = true) {
        if (!this.options.striped) {
          console.error(`${NAME}. Animation works only with striped progress.`);
          return false;
        }

        const progressBar = this.getProgressBar();

        if (startAnimation && !progressBar.classList.contains('progress-bar-animated')) {
          progressBar.classList.add('progress-bar-animated');
        }

        if (!startAnimation && progressBar.classList.contains('progress-bar-animated')) {
          progressBar.classList.remove('progress-bar-animated');
        }

        return true;
      }

      show() {
        this.options.element.style.height = `${this.options.height}px`;
        this.triggerEvent(Event.SHOW);
        this.triggerEvent(Event.SHOWN);
        return true;
      }

      hide() {
        this.options.element.style.height = '0px';
        this.triggerEvent(Event.HIDE);
        this.triggerEvent(Event.HIDDEN);
        return true;
      }

      static identifier() {
        return NAME;
      }

      static _DOMInterface(options) {
        return super._DOMInterface(Progress, options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Progress);
    return Progress;
  })(window.$ ? window.$ : null);

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

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Dropdown = (() => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'dropdown';
    const VERSION = '2.0.0';
    const DEFAULT_PROPERTIES = {
      element: null,
      default: true,
      search: false
    };
    const DATA_ATTRS_PROPERTIES = ['default', 'search'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Dropdown extends Component {
      constructor(options = {}) {
        super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);
        const selected = this.options.element.querySelector('[data-selected]');
        const item = this.getItemData(selected);
        this.setSelected(item.value, item.text, false);
      }

      setSelected(value = '', text = null, checkExists = true) {
        if (!this.options.default) {
          return false;
        }

        let textDisplay = text;
        this.options.element.querySelector('.default-text').innerHTML = text;
        this.options.element.querySelector('input[type="hidden"]').value = value;
        const items = this.options.element.querySelectorAll('.item') || [];
        let itemFound = false;
        Array.from(items).forEach(item => {
          if (item.classList.contains('selected')) {
            item.classList.remove('selected');
          }

          const data = this.getItemData(item);

          if (value === data.value) {
            if (!item.classList.contains('selected')) {
              item.classList.add('selected');
            }

            textDisplay = data.text;
            itemFound = true;
          }
        });

        if (checkExists && itemFound) {
          this.options.element.querySelector('.default-text').innerHTML = textDisplay;
        } else if (checkExists && !itemFound) {
          throw new Error(`${NAME}. The value "${value}" does not exist in the list of items.`);
        }

        return true;
      }

      getSelected() {
        return this.options.element.querySelector('input[type="hidden"]').value;
      }

      getItemData(item = null) {
        let text = '';
        let value = '';

        if (item) {
          text = item.getAttribute('data-text') || item.innerHTML;
          const selectedTextNode = item.querySelector('.text');

          if (selectedTextNode) {
            text = selectedTextNode.innerHTML;
          }

          value = item.getAttribute('data-value') || '';
        }

        return {
          text,
          value
        };
      }

      onElementEvent(event) {
        if (event.type === Event.START) {
          const dropdown = findTargetByClass(event.target, 'dropdown');
          /*
           * hide the current dropdown only if the event concerns another dropdown
           * hide also if the user clicks outside a dropdown
           */

          if (!dropdown || dropdown !== this.getElement()) {
            this.hide();
          }
        } else if (event.type === 'click') {
          const item = findTargetByClass(event.target, 'item');

          if (item) {
            if (item.classList.contains('disabled')) {
              return;
            }

            const itemInfo = this.getItemData(item);

            if (this.getSelected() !== itemInfo.value) {
              // the user selected another value, we dispatch the event
              this.setSelected(itemInfo.value, itemInfo.text, false);
              const detail = {
                item,
                text: itemInfo.text,
                value: itemInfo.value
              };
              this.triggerEvent(Event.ITEM_SELECTED, detail);
            }

            this.hide();
            return;
          } // don't toggle the dropdown if the event concerns headers, dividers


          const dropdownMenu = findTargetByClass(event.target, 'dropdown-menu');

          if (dropdownMenu) {
            return;
          }

          this.toggle();
        }
      }

      toggle() {
        if (this.options.element.classList.contains('active')) {
          return this.hide();
        }

        return this.show();
      }

      show() {
        if (this.options.element.classList.contains('active')) {
          return false;
        }

        this.options.element.classList.add('active');
        const dropdownMenu = this.options.element.querySelector('.dropdown-menu'); // scroll to top

        dropdownMenu.scrollTop = 0;
        this.triggerEvent(Event.SHOW);
        this.triggerEvent(Event.SHOWN);
        this.registerElement({
          target: dropdownMenu,
          event: 'click'
        });
        this.registerElement({
          target: document.body,
          event: Event.START
        });
        return true;
      }

      hide() {
        if (!this.options.element.classList.contains('active')) {
          return false;
        }

        this.options.element.classList.remove('active');
        this.triggerEvent(Event.HIDE);
        this.triggerEvent(Event.HIDDEN);
        this.unregisterElement({
          target: this.options.element.querySelector('.dropdown-menu'),
          event: 'click'
        });
        this.unregisterElement({
          target: document.body,
          event: Event.START
        });
        return true;
      }

      static identifier() {
        return NAME;
      }

      static _DOMInterface(options) {
        return super._DOMInterface(Dropdown, options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */


    const components = [];
    const dropdowns = document.querySelectorAll(`.${NAME}`);

    if (dropdowns) {
      Array.from(dropdowns).forEach(element => {
        const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;

        if (!config.search) {
          components.push(new Dropdown(config));
        }
      });
    }

    document.addEventListener('click', event => {
      const dropdownMenu = findTargetByClass(event.target, 'dropdown-menu');

      if (dropdownMenu) {
        return;
      }

      const dropdown = findTargetByClass(event.target, 'dropdown');

      if (dropdown) {
        const dataToggleAttr = dropdown.getAttribute('data-toggle');

        if (dataToggleAttr && dataToggleAttr === NAME && dropdown) {
          const component = components.find(c => c.getElement() === dropdown);

          if (!component) {
            return;
          }

          component.toggle();
        }
      }
    });
    return Dropdown;
  })();

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const DropdownSearch = (() => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = Dropdown.identifier();
    const DEFAULT_PROPERTIES = {
      element: null,
      default: true,
      search: true
    };
    const DATA_ATTRS_PROPERTIES = ['default', 'search'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class DropdownSearch extends Dropdown {
      constructor(options = {}) {
        super(options);

        this.filterItemsHandler = event => {
          const search = event.target.value;

          if (search === '') {
            this.showItems();
            return;
          }

          this.getItems().forEach(item => {
            const fn = typeof this.options.filterItem === 'function' ? this.options.filterItem : this.filterItem;

            if (fn(search, item)) {
              item.element.style.display = 'block';
            } else {
              item.element.style.display = 'none';
            }
          });
        };

        this.getSearchInput().addEventListener('keyup', this.filterItemsHandler);
      }

      filterItem(search = '', item = {}) {
        if (item.value.indexOf(search) > -1 || item.text.indexOf(search) > -1) {
          return true;
        }

        return false;
      }

      getItems() {
        let items = Array.from(this.options.element.querySelectorAll('.item') || []);
        items = items.map(item => {
          const info = this.getItemData(item);
          return {
            text: info.text,
            value: info.value,
            element: item
          };
        });
        return items;
      }

      showItems() {
        this.getItems().forEach(item => {
          const i = item;
          i.element.style.display = 'block';
        });
      }

      getSearchInput() {
        return this.options.element.querySelector('.dropdown-menu input');
      }

      hide() {
        if (super.hide()) {
          // reset the value
          this.getSearchInput().value = ''; // show all items

          this.showItems();
        }
      }

      static _DOMInterface(options) {
        return new DropdownSearch(options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */


    const components = [];
    const dropdowns = document.querySelectorAll(`.${NAME}`);

    if (dropdowns) {
      Array.from(dropdowns).forEach(element => {
        const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
        config.element = element;

        if (config.search) {
          // search
          components.push(new DropdownSearch(config));
        }
      });
    }

    if (dropdowns) {
      document.addEventListener('click', event => {
        const dropdownMenu = findTargetByClass(event.target, 'dropdown-menu');

        if (dropdownMenu) {
          return;
        }

        const dropdown = findTargetByClass(event.target, 'dropdown');

        if (dropdown) {
          const dataToggleAttr = dropdown.getAttribute('data-toggle');

          if (dataToggleAttr && dataToggleAttr === NAME && dropdown) {
            const component = components.find(c => c.getElement() === dropdown);

            if (!component) {
              return;
            }

            component.toggle();
          }
        }
      });
    }

    return DropdownSearch;
  })();

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  const api = {};
  /**
   * ------------------------------------------------------------------------
   * Pager
   * ------------------------------------------------------------------------
   */

  api.pager = options => {
    if (typeof api._pager === 'undefined') {
      api._pager = Pager._DOMInterface(options);
    }

    return api._pager;
  };
  /**
   * ------------------------------------------------------------------------
   * Intl
   * ------------------------------------------------------------------------
   */


  api.intl = Intl._DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Network
   * ------------------------------------------------------------------------
   */

  api.network = Network._DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Notification
   * ------------------------------------------------------------------------
   */

  api.notification = Notification._DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Dialog
   * ------------------------------------------------------------------------
   */
  // generic

  api.dialog = Dialog._DOMInterface; // prompt dialog

  api.prompt = Prompt._DOMInterface; // confirm dialog

  api.confirm = Confirm._DOMInterface; // loader dialog

  api.dialogLoader = Loader$1._DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Collapse
   * ------------------------------------------------------------------------
   */

  api.collapse = Collapse._DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Accordion
   * ------------------------------------------------------------------------
   */

  api.accordion = Accordion._DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Tab
   * ------------------------------------------------------------------------
   */

  api.tab = Tab._DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Progress
   * ------------------------------------------------------------------------
   */

  api.progress = Progress._DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Loader
   * ------------------------------------------------------------------------
   */

  api.loader = Loader._DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Off canvas
   * ------------------------------------------------------------------------
   */

  api.offCanvas = OffCanvas._DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Dropdown
   * ------------------------------------------------------------------------
   */

  api.dropdown = options => {
    if (options.search) {
      // search dropdown
      return DropdownSearch._DOMInterface(options);
    } // generic dropdown


    return Dropdown._DOMInterface(options);
  }; // Make the API live


  window.phonon = api;

  return api;

})));
//# sourceMappingURL=phonon.js.map

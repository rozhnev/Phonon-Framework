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
        this.route = `/${pageName}`;
        this.routeRegex = null;
        this.routeParams = [];
        this.setRoute(`/${pageName}`);
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
       * Get route
       * @returns {string}
       */


      getRoute() {
        return {
          route: this.route,
          regex: this.routeRegex,
          params: this.routeParams
        };
      }
      /**
       * Set route
       * @returns {undefined}
       */


      setRoute(route) {
        const regParams = /{(.*?)}/g;
        this.route = route;
        this.routeRegex = `${route.replace(/({.*?})/g, '(.*?)')}$`;
        this.routeParams = (route.match(regParams) || []).map(e => e.replace(regParams, '$1'));
      }

      getRouteLink(params = null) {
        const reg = /{(.*?)}/g;

        const _this$getRoute = this.getRoute(),
              route = _this$getRoute.route;

        const linkWithParams = (route.match(reg) || []).reduce((cur, param) => {
          const paramName = param.replace(/{|}/g, '');
          return cur.replace(new RegExp(param), params ? params[paramName] : 'null');
        }, route);
        return linkWithParams;
      }

      validHash(hash) {
        const link = this.getRouteLink(this.getParams(hash));
        return link === hash;
      }

      getParams(hash) {
        const hashParams = {};

        const _this$getRoute2 = this.getRoute(),
              regex = _this$getRoute2.regex,
              params = _this$getRoute2.params;

        const hashValues = (new RegExp(regex, 'g').exec(hash) || []).slice(1);
        params.forEach((p, i) => {
          hashParams[p] = hashValues[i];
        });
        return hashParams;
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

        await render(pageElement, this.getTemplate(), Array.from(pageElement.querySelectorAll(TEMPLATE_SELECTOR) || []));
      } // public

      /**
       *
       * @param {*} callbackFn
       */


      addEvents(callbackFn) {
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
          throw new Error(`The template path must be a string. ${typeof template} is given`);
        }

        this.template = template;

        if (typeof renderFunction === 'function') {
          this.renderFunction = renderFunction;
        }
      }
      /**
       * Add a transition handler
       *
       * @param {Function} fn
       */


      preventTransition(fn) {
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
        const eventNameAlias = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
        this.events.forEach(scope => {
          const scopeEvent = scope[eventName];
          const scopeEventAlias = scope[eventNameAlias];

          if (typeof scopeEvent === 'function') {
            scopeEvent.apply(this, [eventParams]);
          } // trigger the event alias


          if (typeof scopeEventAlias === 'function') {
            scopeEventAlias.apply(this, [eventParams]);
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
    let lastHash = null;
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

      getRoute() {
        return window.location.hash.split(this.options.hashPrefix)[1];
      }

      getHash() {
        return window.location.hash;
      }

      getHashParams() {
        const page = this.getPageModel(currentPage);
        return page.getParams(this.getHash());
      }

      getPageFromHash() {
        const hash = this.getHash() || '';
        const page = this.pages.find(p => hash.match(p.getRoute().regex));
        return page ? page.name : null;
      }

      setHash(pageName, params = null) {
        const page = this.getPageModel(pageName);

        if (!page) {
          throw new Error(`Cannot change the route of unknown page ${pageName}`);
        }

        window.location.hash = `${this.options.hashPrefix}${page.getRouteLink(params)}`;
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
        document.addEventListener('DOMContentLoaded', event => this.onDOMLoaded(event));

        if (this.options.useHash) {
          window.addEventListener('hashchange', event => this.onHashChange(event));
        }
      } // getters


      static get version() {
        return `${NAME}.${VERSION}`;
      }

      async preventChangePage(oldPageName, pageName, params) {
        const oldPage = this.getPageModel(oldPageName);
        const preventFn = oldPage.getPreventTransition();

        if (typeof preventFn === 'function') {
          return preventFn(oldPageName, pageName, params);
        }

        return false;
      } // public


      async showPage(pageName, params = null, back = false) {
        /*
         * If we he use the hash as trigger,
         * we change it dynamically so that the hashchange event is called
         * Otherwise, we show the page
         */
        if (this.options.useHash && this.getPageFromHash() !== pageName) {
          this.setHash(pageName, params);
          return;
        }

        const oldPage = this._('.current');

        let oldPageName = null;

        if (oldPage) {
          oldPageName = oldPage.getAttribute('data-page');

          if (this.isPageOf(pageName, oldPageName)) {
            return;
          }

          if (await this.preventChangePage(oldPageName, pageName, params)) {
            if (this.options.useHash) {
              window.location.hash = lastHash;
            }

            return;
          }

          oldPage.classList.remove('current'); // history

          window.history.replaceState({
            page: pageName
          }, oldPageName);
          this.triggerPageEvent(oldPageName, Event.HIDE);
        }

        currentPage = pageName; // new page

        const newPage = this._(`[data-page="${currentPage}"]`);

        newPage.classList.add('current'); // render template

        const pageModel = this.getPageModel(currentPage);
        const hashParams = pageModel.getParams(this.getHash());
        this.triggerPageEvent(currentPage, Event.SHOW, hashParams);

        if (pageModel && pageModel.getTemplate()) {
          await pageModel.renderTemplate();
        }

        if (oldPage) {
          // use of prototype-oriented language
          oldPage.back = back;
          oldPage.previousPageName = oldPageName;

          const onPageAnimationEnd = () => {
            if (oldPage.classList.contains('animate')) {
              oldPage.classList.remove('animate');
            }

            oldPage.classList.remove(oldPage.back ? 'pop-page' : 'push-page');
            this.triggerPageEvent(currentPage, Event.SHOWN, hashParams);
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

        lastHash = this.getHash();
      }

      addUniquePageModel(pageName) {
        if (!this.getPageModel(pageName)) {
          this.pages.push(new Page(pageName));
        }
      }

      getPageModel(pageName) {
        return this.pages.find(page => page.name === pageName);
      }

      selectorToArray(str) {
        return str.split(',').map(item => item.trim());
      }

      triggerPageEvent(pageName, eventName, eventParams = null) {
        const pageModel = this.getPageModel(pageName);

        if (pageModel) {
          pageModel.triggerScopes(eventName, eventParams);
        }
      }

      onClick(event) {
        const pageName = event.target.getAttribute('data-navigate');
        const backNavigation = event.target.getAttribute('data-pop-page') === 'true';

        if (!pageName) {
          return;
        }

        this.showPage(pageName, null, backNavigation);
      }

      onHashChange() {
        const params = this.getHashParams();
        const navPage = this.getPageFromHash(); // avoid concurrent pages if prevent page change is defined

        if (navPage === currentPage) {
          this.triggerPageEvent(currentPage, Event.HASH, params);
        }

        if (navPage) {
          this.showPage(navPage, null, false, params);
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
          /*
           * the page name can be given with the attribute data-page
           * or with its node name
           */
          const pageName = page.getAttribute('data-page') || page.nodeName;
          this.addUniquePageModel(pageName);
        });
      }

      select(pageName, addPageModel = true) {
        if (addPageModel) {
          this.addUniquePageModel(pageName);
        }

        return this.getPageModel(pageName);
      }

      start(forceDefaultPage = false) {
        let force = forceDefaultPage; // check if the app has been already started

        if (this.started) {
          throw new Error(`${NAME}. The app has been already started.`);
        }

        this.started = true; // force default page on Cordova

        if (window.cordova) {
          force = true;
        }

        let pageName = this.getPageFromHash();

        if (!this.getPageModel(pageName)) {
          pageName = this.options.defaultPage;
        }

        const page = this.getPageModel(pageName);

        if (force && !this.options.defaultPage) {
          throw new Error(`${NAME}. The default page must exist for forcing its launch!`);
        }
        /*
         * if the app is configurated to use hash tracking
         * we add the page dynamically in the url
         */


        if (this.options.useHash) {
          if (!page.validHash(this.getHash())) {
            this.setHash(pageName);
          }
        }

        this.showPage(force ? this.options.defaultPage : pageName);
      } // static


      static DOMInterface(options) {
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
    const NAME = 'i18n-binder';
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
       * @param {Element} the argument to test
       * @returns {boolean} true if the object is a DOM element, false otherwise
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
        let attr = element.getAttribute('data-t');

        if (!attr) {
          return;
        }

        attr = attr.trim();
        const r = /(?:\s|^)([A-Za-z-_0-9]+):\s*(.*?)(?=\s+\w+:|$)/g;
        let m;

        while (m = r.exec(attr)) {
          const key = m[1].trim();
          const value = m[2].trim().replace(',', '');
          let i18nValue = this.data[value];

          if (!this.data[value]) {
            console.log(`${NAME}. Warning, ${value} does not exist.`);
            i18nValue = value;
          }

          const methodName = `set${key.charAt(0).toUpperCase()}${key.slice(1)}`;

          if (this[methodName]) {
            this[methodName](element, i18nValue);
          } else {
            this.setAttribute(element, key, i18nValue);
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

  const I18n = (() => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'i18n';
    const VERSION = '2.0.0';
    const DEFAULT_PROPERTIES = {
      fallbackLocale: 'en',
      locale: 'en',
      bind: false,
      data: null
    };
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class I18n {
      /**
       * Creates an instance of I18n.
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
        let el = element;

        if (!el) {
          el = document.querySelectorAll('[data-t]');
        }

        if (typeof el === 'string') {
          el = document.querySelector(el);
        }
        /* eslint no-new: 0 */


        new Binder(el, this.t());
      } // static


      static DOMInterface(options) {
        return new I18n(options);
      }

    }

    return I18n;
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

      static DOMInterface(options) {
        return super.DOMInterface(Network, options);
      }

    }

    return Network;
  })();

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Alert = ($ => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'alert';
    const VERSION = '2.0.0';
    const DEFAULT_PROPERTIES = {
      element: null,
      fade: true
    };
    const DATA_ATTRS_PROPERTIES = ['fade'];
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
        const _window$getComputedSt = window.getComputedStyle(this.options.element),
              opacity = _window$getComputedSt.opacity;

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
    alerts.forEach(element => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;
      components.push(Alert.DOMInterface(config));
    });
    document.addEventListener('click', event => {
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

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Modal = ($ => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'modal';
    const VERSION = '2.0.0';
    const BACKDROP_SELECTOR = 'modal-backdrop';
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

    class Modal extends Component {
      constructor(options = {}, template = null) {
        super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, true, true);
        this.template = template || '' + '<div class="modal" tabindex="-1" role="modal">' + '<div class="modal-inner" role="document">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h5 class="modal-title"></h5>' + '</div>' + '<div class="modal-body">' + '<p></p>' + '</div>' + '<div class="modal-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (this.dynamicElement) {
          this.build();
        }
      }

      build() {
        const builder = document.createElement('div');
        builder.innerHTML = this.template;
        this.options.element = builder.firstChild; // title

        if (this.options.title !== null) {
          this.options.element.querySelector('.modal-title').innerHTML = this.options.title;
        } // message


        if (this.options.message !== null) {
          this.options.element.querySelector('.modal-body').firstChild.innerHTML = this.options.message;
        } else {
          // remove paragraph node
          this.removeTextBody();
        } // buttons


        if (this.options.buttons !== null && Array.isArray(this.options.buttons)) {
          if (this.options.buttons.length > 0) {
            this.options.buttons.forEach(button => {
              this.options.element.querySelector('.modal-footer').appendChild(this.buildButton(button));
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
        this.options.element.querySelector('.modal-body').removeChild(this.options.element.querySelector('.modal-body').firstChild);
      }

      removeFooter() {
        const footer = this.options.element.querySelector('.modal-footer');
        this.options.element.querySelector('.modal-content').removeChild(footer);
      }

      center() {
        const computedStyle = window.getComputedStyle(this.options.element);
        const height = computedStyle.height.slice(0, computedStyle.height.length - 2);
        const top = window.innerHeight / 2 - height / 2;
        this.options.element.style.top = `${top}px`;
      }

      show() {
        return new Promise(async (resolve, reject) => {
          if (this.options.element === null) {
            // build and insert a new DOM element
            this.build();
          }

          if (this.options.element.classList.contains('show')) {
            reject(new Error('The modal is already active'));
            return;
          } // add a timeout so that the CSS animation works


          await sleep(20);
          this.triggerEvent(Event.SHOW);
          this.buildBackdrop(); // attach event

          this.attachEvents();

          const onShown = () => {
            this.triggerEvent(Event.SHOWN);
            this.options.element.removeEventListener(Event.TRANSITION_END, onShown);
            resolve();
          };

          this.options.element.addEventListener(Event.TRANSITION_END, onShown);
          this.options.element.classList.add('show');
          this.center();
        });
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
          // hide the modal
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
      /**
       * Hides the modal
       * @returns {Promise} Promise object represents the completed animation
       */


      hide() {
        return new Promise((resolve, reject) => {
          if (!this.options.element.classList.contains('show')) {
            reject(new Error('The modal is not active'));
            return;
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
            backdrop.removeEventListener(Event.TRANSITION_END, onHidden); // remove generated modals from the DOM

            if (this.dynamicElement) {
              document.body.removeChild(this.options.element);
              this.options.element = null;
            }

            resolve();
          };

          backdrop.addEventListener(Event.TRANSITION_END, onHidden);
          backdrop.classList.add('fadeout');
        });
      }

      attachEvents() {
        const buttons = this.options.element.querySelectorAll('[data-dismiss], .modal-footer button');

        if (buttons) {
          Array.from(buttons).forEach(button => this.registerElement({
            target: button,
            event: 'click'
          }));
        } // add events if the modal is cancelable
        // which means the user can hide the modal
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
        const buttons = this.options.element.querySelectorAll('[data-dismiss], .modal-footer button');

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

      static DOMInterface(options) {
        return super.DOMInterface(Modal, options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Modal);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    const components = [];
    const modals = Array.from(document.querySelectorAll(`.${NAME}`) || []);
    modals.forEach(element => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;
      components.push({
        element,
        modal: new Modal(config)
      });
    });
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
        component.modal.show();
      }
    });
    return Modal;
  })(window.$ ? window.$ : null);

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Prompt = ($ => {
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

    class Prompt extends Modal {
      constructor(options = {}) {
        const template = '' + '<div class="modal" tabindex="-1" role="modal">' + '<div class="modal-inner" role="document">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h5 class="modal-title"></h5>' + '</div>' + '<div class="modal-body">' + '<p></p>' + '<input class="form-control" type="text" value="">' + '</div>' + '<div class="modal-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (!Array.isArray(options.buttons)) {
          options.buttons = DEFAULT_PROPERTIES.buttons;
        }

        super(options, template);
      }
      /**
       * Shows the prompt
       * @returns {Promise} Promise object represents the completed animation
       */


      async show() {
        super.show();
        this.attachInputEvent();
      }
      /**
       * Hides the prompt
       * @returns {Promise} Promise object represents the completed animation
       */


      async hide() {
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

      static DOMInterface(options) {
        return new Prompt(options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Prompt);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    const components = [];
    const modals = document.querySelectorAll(`.${Modal.identifier()}`);

    if (modals) {
      Array.from(modals).forEach(element => {
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
        component.modal.show();
      }
    });
    return Prompt;
  })(window.$ ? window.$ : null);

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Confirm = ($ => {
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

    class Confirm extends Modal {
      constructor(options = {}) {
        const opts = options;
        const template = '' + '<div class="modal" tabindex="-1" role="modal">' + '<div class="modal-inner" role="document">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h5 class="modal-title"></h5>' + '</div>' + '<div class="modal-body">' + '<p></p>' + '</div>' + '<div class="modal-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (!Array.isArray(opts.buttons)) {
          opts.buttons = DEFAULT_PROPERTIES.buttons;
        }

        super(opts, template);
      }

      static identifier() {
        return NAME;
      }

      static DOMInterface(options) {
        return new Confirm(options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Confirm);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    const components = [];
    const modals = document.querySelectorAll(`.${Modal.identifier()}`);

    if (modals) {
      Array.from(modals).forEach(element => {
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
        component.modal.show();
      }
    });
    return Confirm;
  })(window.$ ? window.$ : null);

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

      async show() {
        if (this.options.element.classList.contains('hide')) {
          this.options.element.classList.remove('hide');
        }

        this.triggerEvent(Event.SHOW);
        const size = this.getClientSize();
        this.options.size = size;

        if (this.customSize) {
          this.options.element.style.width = `${this.options.size}px`;
          this.options.element.style.height = `${this.options.size}px`;
          const loaderSpinner = this.getSpinner();
          loaderSpinner.style.width = `${this.options.size}px`;
          loaderSpinner.style.height = `${this.options.size}px`;
        }

        this.triggerEvent(Event.SHOWN);
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

      async hide() {
        if (!this.options.element.classList.contains('hide')) {
          this.options.element.classList.add('hide');
        }

        this.triggerEvent(Event.HIDE);
        this.triggerEvent(Event.HIDDEN);
        return true;
      }

      static identifier() {
        return NAME;
      }

      static DOMInterface(options) {
        return super.DOMInterface(Loader, options);
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

  const Loader$1 = ($ => {
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

    class Loader$$1 extends Modal {
      constructor(options = {}) {
        const opts = options;
        const template = '' + '<div class="modal" tabindex="-1" role="modal">' + '<div class="modal-inner" role="document">' + '<div class="modal-content">' + '<div class="modal-header">' + '<h5 class="modal-title"></h5>' + '</div>' + '<div class="modal-body">' + '<p></p>' + '<div class="mx-auto text-center">' + '<div class="loader mx-auto d-block">' + '<div class="loader-spinner"></div>' + '</div>' + '</div>' + '</div>' + '<div class="modal-footer">' + '</div>' + '</div>' + '</div>' + '</div>';

        if (!Array.isArray(opts.buttons)) {
          opts.buttons = opts.cancelable ? DEFAULT_PROPERTIES.buttons : [];
        }

        super(opts, template);
        this.spinner = null;
      }

      async show() {
        super.show();
        this.spinner = new Loader({
          element: this.getElement().querySelector('.loader')
        });
        this.spinner.animate(true);
      }

      async hide() {
        super.hide();
        this.spinner.animate(false);
        this.spinner = null;
      }

      static identifier() {
        return NAME;
      }

      static DOMInterface(options) {
        return new Loader$$1(options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Loader$$1);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    const components = [];
    const modals = document.querySelectorAll(`.${Modal.identifier()}`);

    if (modals) {
      Array.from(modals).forEach(element => {
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
        component.modal.show();
      }
    });
    return Loader$$1;
  })(window.$ ? window.$ : null);

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
      /**
       * Shows the notification
       * @returns {Promise} Promise object represents the completed animation
       */


      show() {
        return new Promise(async (resolve, reject) => {
          if (this.options.element === null) {
            // build and insert a new DOM element
            this.build();
          }

          if (this.options.element.classList.contains('show')) {
            reject(new Error('The notification is already active'));
            return;
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

          await sleep(20);

          if (Number.isInteger(this.options.timeout) && this.options.timeout > 0) {
            // if there is a timeout, auto hide the notification
            this.timeoutCallback = setTimeout(() => {
              this.hide();
            }, this.options.timeout + 1);
          }

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
            resolve();
          };

          this.options.element.addEventListener(Event.TRANSITION_END, onShown);
          return true;
        });
      }
      /**
       * Hides the notification
       * @returns {Promise} Promise object represents the completed animation
       */


      hide() {
        return new Promise((resolve, reject) => {
          /*
          * prevent to close a notification with a timeout
          * if the user has already clicked on the button
          */
          if (this.timeoutCallback) {
            clearTimeout(this.timeoutCallback);
            this.timeoutCallback = null;
          }

          if (!this.options.element.classList.contains('show')) {
            reject(new Error('The notification is not active'));
            return;
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

            resolve();
          };

          this.options.element.addEventListener(Event.TRANSITION_END, onHidden);
        });
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
      /**
       * Shows the tab
       * @returns {Promise} Promise object represents the completed animation
       */


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

      async hide() {
        if (!this.options.element.classList.contains('active')) {
          throw new Error('The tab is not active');
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

      static DOMInterface(options) {
        return super.DOMInterface(Tab, options);
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
        components.push(Tab.DOMInterface(config));
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
      /**
       * Shows the progress bar
       * @returns {Promise} Promise object represents the completed animation
       */


      async show() {
        this.options.element.style.height = `${this.options.height}px`;
        this.triggerEvent(Event.SHOW);
        this.triggerEvent(Event.SHOWN);
        return true;
      }
      /**
       * Hides the progress bar
       * @returns {Promise} Promise object represents the completed animation
       */


      async hide() {
        this.options.element.style.height = '0px';
        this.triggerEvent(Event.HIDE);
        this.triggerEvent(Event.HIDDEN);
        return true;
      }

      static identifier() {
        return NAME;
      }

      static DOMInterface(options) {
        return super.DOMInterface(Progress, options);
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
    const NAME = 'offcanvas';
    const VERSION = '2.0.0';
    const BACKDROP_SELECTOR = 'offcanvas-backdrop';
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
          if (this.options.element.classList.contains(`offcanvas-${direction}`)) {
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
          if (!content.classList.contains(`offcanvas-aside-${this.direction}`)) {
            content.classList.add(`offcanvas-aside-${this.direction}`);
          }

          this.useBackdrop = false; // avoid animation by setting animate to false

          this.animate = false;
          this.show(); // remove previous backdrop

          this.removeBackdrop();
        } else {
          if (content.classList.contains(`offcanvas-aside-${this.direction}`)) {
            content.classList.remove(`offcanvas-aside-${this.direction}`);
          }

          this.hide();
          this.useBackdrop = true;
          this.animate = true;
        }
      }

      onElementEvent(event) {
        if (event.type === 'keyup' && event.keyCode !== 27 && event.keyCode !== 13) {
          return;
        } // hide the offcanvas


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

      static DOMInterface(options) {
        return super.DOMInterface(OffCanvas, options);
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
    const offCanvas = Array.from(document.querySelectorAll(`.${NAME}`) || []);
    offCanvas.forEach(element => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;
      components.push({
        element,
        offCanvas: new OffCanvas(config)
      });
    });
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

  const Selectbox = (() => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'selectbox';
    const VERSION = '2.0.0';
    const DEFAULT_PROPERTIES = {
      element: null,
      selectable: true,
      search: false,
      filterItems: null
    };
    const DATA_ATTRS_PROPERTIES = ['selectable', 'search'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Selectbox extends Component {
      constructor(options = {}) {
        super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);
        const selected = this.options.element.querySelector('[data-selected]');
        const item = this.getItemData(selected);
        this.setSelected(item.value, item.text, false);
      }

      setSelected(value = '', text = null, checkExists = true) {
        if (!this.options.selectable) {
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
          const selectbox = findTargetByClass(event.target, 'selectbox');
          /*
           * hide the current selectbox only if the event concerns another selectbox
           * hide also if the user clicks outside a selectbox
           */

          if (!selectbox || selectbox !== this.getElement()) {
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
          } // don't toggle the selectbox if the event concerns headers, dividers


          const selectboxMenu = findTargetByClass(event.target, 'selectbox-menu');

          if (selectboxMenu) {
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
      /**
       * Shows the selectbox
       * @returns {Promise} Promise object represents the completed animation
       */


      async show() {
        if (this.options.element.classList.contains('active')) {
          return false;
        }

        this.options.element.classList.add('active');
        const selectboxMenu = this.options.element.querySelector('.selectbox-menu'); // scroll to top

        selectboxMenu.scrollTop = 0;
        this.triggerEvent(Event.SHOW);
        this.triggerEvent(Event.SHOWN);
        this.registerElement({
          target: selectboxMenu,
          event: 'click'
        });
        this.registerElement({
          target: document.body,
          event: Event.START
        });
        return true;
      }
      /**
       * Hides the selectbox
       * @returns {Promise} Promise object represents the completed animation
       */


      async hide() {
        if (!this.options.element.classList.contains('active')) {
          throw new Error('The selectbox is not active');
        }

        this.options.element.classList.remove('active');
        this.triggerEvent(Event.HIDE);
        this.triggerEvent(Event.HIDDEN);
        this.unregisterElement({
          target: this.options.element.querySelector('.selectbox-menu'),
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

      static DOMInterface(options) {
        return super.DOMInterface(Selectbox, options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */


    const components = [];
    const selectboxes = Array.from(document.querySelectorAll(`.${NAME}`) || []);
    selectboxes.filter(d => !d.classList.contains('nav-item')).forEach(element => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (!config.search) {
        components.push(new Selectbox(config));
      }
    });
    document.addEventListener('click', event => {
      const selectboxMenu = findTargetByClass(event.target, 'selectbox-menu');

      if (selectboxMenu) {
        return;
      }

      const selectbox = findTargetByClass(event.target, 'selectbox');

      if (selectbox) {
        const dataToggleAttr = selectbox.getAttribute('data-toggle');

        if (dataToggleAttr && dataToggleAttr === NAME && selectbox) {
          const component = components.find(c => c.getElement() === selectbox);

          if (!component) {
            return;
          }

          component.toggle();
        }
      }
    });
    return Selectbox;
  })();

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const SelectboxSearch = ($ => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = Selectbox.identifier();
    const DEFAULT_PROPERTIES = {
      element: null,
      selectable: true,
      search: true,
      filterItems: null
    };
    const DATA_ATTRS_PROPERTIES = ['selectable', 'search'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class SelectboxSearch extends Selectbox {
      constructor(options = {}) {
        super(options);

        this.filterItemsHandler = event => {
          const search = event.target.value;

          if (search === '') {
            this.showItems();
            return;
          }

          this.getItems().forEach(item => {
            const fn = typeof this.options.filterItems === 'function' ? this.options.filterItems : this.filterItems;

            if (fn(search, item)) {
              item.element.style.display = 'block';
            } else {
              item.element.style.display = 'none';
            }
          });
        };

        this.getSearchInput().addEventListener('keyup', this.filterItemsHandler);
      }

      filterItems(search = '', item = {}) {
        return item.value.indexOf(search) > -1 || item.text.indexOf(search) > -1;
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
        return this.options.element.querySelector('.selectbox-menu input');
      }
      /**
       * Shows the search selectbox
       * @returns {Promise} Promise object represents the completed animation
       */


      async show() {
        return super.hide();
      }
      /**
       * Hides the search selectbox
       * @returns {Promise} Promise object represents the completed animation
       */


      async hide() {
        await super.hide(); // reset the value

        this.getSearchInput().value = ''; // show all items

        this.showItems();
        return true;
      }

      static DOMInterface(options) {
        return new SelectboxSearch(options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, SelectboxSearch);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    const components = [];
    const selectboxes = Array.from(document.querySelectorAll(`.${NAME}`) || []);
    selectboxes.filter(d => !d.classList.contains('nav-item')).forEach(element => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;

      if (config.search) {
        // search
        components.push(new SelectboxSearch(config));
      }
    });

    if (selectboxes) {
      document.addEventListener('click', event => {
        const selectboxMenu = findTargetByClass(event.target, 'selectbox-menu');

        if (selectboxMenu) {
          return;
        }

        const selectbox = findTargetByClass(event.target, 'selectbox');

        if (selectbox) {
          const dataToggleAttr = selectbox.getAttribute('data-toggle');

          if (dataToggleAttr && dataToggleAttr === NAME && selectbox) {
            const component = components.find(c => c.getElement() === selectbox);

            if (!component) {
              return;
            }

            component.toggle();
          }
        }
      });
    }

    return SelectboxSearch;
  })(window.$ ? window.$ : null);

  /**
   * --------------------------------------------------------------------------
   * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  const Dropdown = ($ => {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    const NAME = 'dropdown';
    const MENU = 'dropdown-menu';
    const MENU_ITEM = 'dropdown-item';
    const VERSION = '2.0.0';
    const DEFAULT_PROPERTIES = {
      element: null,
      hover: true
    };
    const DATA_ATTRS_PROPERTIES = ['hover'];
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

    class Dropdown extends Component {
      constructor(options = {}) {
        super(NAME, VERSION, DEFAULT_PROPERTIES, options, DATA_ATTRS_PROPERTIES, false, false);
        this.onTransition = false;

        if (this.options.hover) {
          this.registerElement({
            target: this.options.element,
            event: 'mouseover'
          });
          this.registerElement({
            target: this.options.element,
            event: 'mouseleave'
          });
          this.options.element.addEventListener('mouseover', event => {
            this.show();
          });
          this.options.element.addEventListener('mouseleave', event => {
            this.hide();
          });
        }
      }

      onElementEvent(event) {
        if (event.type === 'mouseover') {
          this.show();
          return;
        }

        if (event.type === 'mouseleave') {
          this.hide();
        }
      }
      /**
       * Shows the dropdown
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

          const onShow = () => {
            // dropdown menu
            this.triggerEvent(Event.SHOWN);
            this.getMenu().removeEventListener(Event.TRANSITION_END, onShow);
            this.onTransition = false;
            resolve();
          }; // dropdown handler


          this.options.element.classList.add('show');
          this.getMenu().classList.add('show');
          this.getMenu().addEventListener(Event.TRANSITION_END, onShow);
          await sleep(20);
          this.getMenu().classList.add('animate');
        });
      }

      getMenu() {
        return this.options.element.querySelector(`.${MENU}`);
      }

      async toggle() {
        if (this.options.element.classList.contains('show')) {
          await this.hide();
        } else {
          await this.show();
        }
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

          const onHide = () => {
            // dropdown menu
            this.getMenu().classList.remove('show');
            this.triggerEvent(Event.HIDDEN);
            this.getMenu().removeEventListener(Event.TRANSITION_END, onHide);
            this.onTransition = false;
            resolve();
          }; // dropdown handler


          this.options.element.classList.remove('show');
          this.getMenu().addEventListener(Event.TRANSITION_END, onHide);
          this.getMenu().classList.remove('animate');
        });
      }

      static identifier() {
        return NAME;
      }

      static DOMInterface(options) {
        return super.DOMInterface(Dropdown, options);
      }

    }
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */


    createJqueryPlugin($, NAME, Dropdown);
    /**
     * ------------------------------------------------------------------------
     * DOM Api implementation
     * ------------------------------------------------------------------------
     */

    const components = [];
    const dropdowns = Array.from(document.querySelectorAll(`.${NAME}`) || []);
    dropdowns.forEach(element => {
      const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
      config.element = element;
      components.push(Dropdown.DOMInterface(config));
    });
    document.addEventListener('click', event => {
      const dropdown = findTargetByClass(event.target, NAME);
      const dropdownMenuItem = findTargetByClass(event.target, MENU_ITEM);

      if (dropdown) {
        const component = components.find(c => c.getElement() === dropdown);

        if (!component) {
          return;
        }

        if (dropdownMenuItem) {
          // click in menu
          component.hide();
          return;
        }

        component.show();
      }
    });
    document.addEventListener(Event.START, event => {
      const dropdown = findTargetByClass(event.target, NAME);
      const activeDropdown = document.querySelector('.dropdown.show');

      if (dropdown || !activeDropdown) {
        return;
      }

      const activeComponent = components.find(c => c.getElement() === activeDropdown);
      activeComponent.hide();
    });
    return Dropdown;
  })(window.$ ? window.$ : null);

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
    /* eslint no-underscore-dangle: 0 */
    if (typeof api._pager === 'undefined') {
      api._pager = Pager.DOMInterface(options);
    }

    return api._pager;
  };
  /**
   * ------------------------------------------------------------------------
   * i18n
   * ------------------------------------------------------------------------
   */


  api.i18n = I18n.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Network
   * ------------------------------------------------------------------------
   */

  api.network = Network.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Notification
   * ------------------------------------------------------------------------
   */

  api.notification = Notification.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Modal
   * ------------------------------------------------------------------------
   */
  // generic

  api.modal = Modal.DOMInterface; // prompt modal

  api.prompt = Prompt.DOMInterface; // confirm modal

  api.confirm = Confirm.DOMInterface; // loader modal

  api.modalLoader = Loader$1.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Collapse
   * ------------------------------------------------------------------------
   */

  api.collapse = Collapse.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Alert
   * ------------------------------------------------------------------------
   */

  api.alert = Alert.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Accordion
   * ------------------------------------------------------------------------
   */

  api.accordion = Accordion.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Tab
   * ------------------------------------------------------------------------
   */

  api.tab = Tab.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Progress
   * ------------------------------------------------------------------------
   */

  api.progress = Progress.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Loader
   * ------------------------------------------------------------------------
   */

  api.loader = Loader.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Off canvas
   * ------------------------------------------------------------------------
   */

  api.offCanvas = OffCanvas.DOMInterface;
  /**
   * ------------------------------------------------------------------------
   * Selectbox
   * ------------------------------------------------------------------------
   */

  api.selectbox = options => {
    if (options.search) {
      // search selectbox
      return SelectboxSearch.DOMInterface(options);
    } // generic selectbox


    return Selectbox.DOMInterface(options);
  };
  /**
   * ------------------------------------------------------------------------
   * Dropdown
   * ------------------------------------------------------------------------
   */


  api.dropdown = Dropdown.DOMInterface; // Make the API live

  window.phonon = api;

  return api;

})));
//# sourceMappingURL=phonon.js.map

/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */
import Selectbox from './index';
import { findTargetByClass, createJqueryPlugin } from '../../common/utils';
import { getAttributesConfig } from '../componentManager';

const SelectboxSearch = (($) => {
  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  const NAME = Selectbox.identifier();
  const DEFAULT_PROPERTIES = {
    element: null,
    default: true,
    search: true,
  };
  const DATA_ATTRS_PROPERTIES = [
    'default',
    'search',
  ];

  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  class SelectboxSearch extends Selectbox {
    constructor(options = {}) {
      super(options);

      this.filterItemsHandler = (event) => {
        const search = event.target.value;

        if (search === '') {
          this.showItems();
          return;
        }


        this.getItems().forEach((item) => {
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
      if (item.value.indexOf(search) > -1
        || item.text.indexOf(search) > -1) {
        return true;
      }

      return false;
    }

    getItems() {
      let items = Array.from(this.options.element.querySelectorAll('.item') || []);
      items = items.map((item) => {
        const info = this.getItemData(item);
        return { text: info.text, value: info.value, element: item };
      });

      return items;
    }

    showItems() {
      this.getItems().forEach((item) => {
        const i = item;
        i.element.style.display = 'block';
      });
    }

    getSearchInput() {
      return this.options.element.querySelector('.selectbox-menu input');
    }

    /**
     * Shows the search selectbox
     * @return {Promise} Promise object represents the completed animation
     */
    async show() {
      return super.hide();
    }

    /**
     * Hides the search selectbox
     * @return {Promise} Promise object represents the completed animation
     */
    async hide() {
      await super.hide();

      // reset the value
      this.getSearchInput().value = '';

      // show all items
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

  selectboxes.filter(d => !d.classList.contains('nav-item')).forEach((element) => {
    const config = getAttributesConfig(element, DEFAULT_PROPERTIES, DATA_ATTRS_PROPERTIES);
    config.element = element;

    if (config.search) {
      // search
      components.push(new SelectboxSearch(config));
    }
  });

  if (selectboxes) {
    document.addEventListener('click', (event) => {
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

export default SelectboxSearch;

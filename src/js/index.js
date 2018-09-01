/**
 * --------------------------------------------------------------------------
 * Licensed under MIT (https://github.com/quark-dev/Phonon-Framework/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

import Pager from './hybrid-apps/pager/index'
import I18n from './hybrid-apps/i18n'
import Network from './common/network'

// components
import Alert from './components/alert'
import Dialog from './components/dialog'
import Prompt from './components/dialog/prompt'
import Confirm from './components/dialog/confirm'
import DialogLoader from './components/dialog/loader'
import Notification from './components/notification'
import Collapse from './components/collapse'
import Accordion from './components/accordion'
import Tab from './components/tab'
import Progress from './components/progress'
import Loader from './components/loader'
import OffCanvas from './components/off-canvas'
import Dropdown from './components/dropdown'
import DropdownSearch from './components/dropdown/search'

const api = {}

/**
 * ------------------------------------------------------------------------
 * Pager
 * ------------------------------------------------------------------------
 */
api.pager = (options) => {
  if (typeof api._pager === 'undefined') {
    api._pager = Pager.DOMInterface(options)
  }
  return api._pager
}

/**
 * ------------------------------------------------------------------------
 * i18n
 * ------------------------------------------------------------------------
 */
api.i18n = I18n.DOMInterface

/**
 * ------------------------------------------------------------------------
 * Network
 * ------------------------------------------------------------------------
 */
api.network = Network.DOMInterface

/**
 * ------------------------------------------------------------------------
 * Notification
 * ------------------------------------------------------------------------
 */
api.notification = Notification.DOMInterface

/**
 * ------------------------------------------------------------------------
 * Dialog
 * ------------------------------------------------------------------------
 */

// generic
api.dialog = Dialog.DOMInterface

// prompt dialog
api.prompt = Prompt.DOMInterface
// confirm dialog
api.confirm = Confirm.DOMInterface
// loader dialog
api.dialogLoader = DialogLoader.DOMInterface

/**
 * ------------------------------------------------------------------------
 * Collapse
 * ------------------------------------------------------------------------
 */
api.collapse = Collapse.DOMInterface

/**
 * ------------------------------------------------------------------------
 * Collapse
 * ------------------------------------------------------------------------
 */
api.alert = Alert.DOMInterface

/**
 * ------------------------------------------------------------------------
 * Accordion
 * ------------------------------------------------------------------------
 */
api.accordion = Accordion.DOMInterface


/**
 * ------------------------------------------------------------------------
 * Tab
 * ------------------------------------------------------------------------
 */
api.tab = Tab.DOMInterface

/**
 * ------------------------------------------------------------------------
 * Progress
 * ------------------------------------------------------------------------
 */
api.progress = Progress.DOMInterface

/**
 * ------------------------------------------------------------------------
 * Loader
 * ------------------------------------------------------------------------
 */
api.loader = Loader.DOMInterface

/**
 * ------------------------------------------------------------------------
 * Off canvas
 * ------------------------------------------------------------------------
 */
api.offCanvas = OffCanvas.DOMInterface

/**
 * ------------------------------------------------------------------------
 * Dropdown
 * ------------------------------------------------------------------------
 */
api.dropdown = (options) => {
  if (options.search) {
    // search dropdown
    return DropdownSearch.DOMInterface(options)
  }

  // generic dropdown
  return Dropdown.DOMInterface(options)
}

// Make the API live
window.phonon = api

export default api

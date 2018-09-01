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
import Modal from './components/modal'
import ModalPrompt from './components/modal/prompt'
import ModalConfirm from './components/modal/confirm'
import ModalLoader from './components/modal/loader'
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
 * Modal
 * ------------------------------------------------------------------------
 */

// generic
api.modal = Modal.DOMInterface

// prompt modal
api.prompt = ModalPrompt.DOMInterface
// confirm modal
api.confirm = ModalConfirm.DOMInterface
// loader modal
api.modalLoader = ModalLoader.DOMInterface

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

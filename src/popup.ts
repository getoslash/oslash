import './app.css'
import './popup.css'
import Popup from './lib/components/popup/Popup.svelte'

const popupDOMElement = document.getElementById('popup')
let popup: Popup | null = null
if (popupDOMElement) {
  popup = new Popup({
    target: popupDOMElement,
  })
}

export default popup

import './app.css'
import './option.css'
import Option from './lib/components/option/Option.svelte'

const optionDOMElement = document.getElementById('option')
let option: Option | null = null
if (optionDOMElement) {
  option = new Option({
    target: optionDOMElement,
  })
}

export default option

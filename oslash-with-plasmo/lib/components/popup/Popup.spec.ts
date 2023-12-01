import Popup from "./Popup.svelte";
import { render } from '@testing-library/svelte'
describe("Popup Component", () => {
  test("should render the Popup component", () => {
    render(Popup)
  })
})

import Button from './Button.svelte'
import { render } from '@testing-library/svelte'
describe("Button Component", () => {
  test("should render the Button component", () => {
    render(Button)
  })
})
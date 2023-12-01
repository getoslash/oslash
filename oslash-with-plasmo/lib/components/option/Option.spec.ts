import Option from './Option.svelte'
import { render } from '@testing-library/svelte'
describe("Option Component", () => {
  test("should render the Option component", () => {
    render(Option)
  })
})
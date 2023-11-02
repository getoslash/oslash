import Input from './Input.svelte'
import { render } from '@testing-library/svelte'
describe("Input Component", () => {
  test("should render the Input component", () => {
    render(Input)
  })
})
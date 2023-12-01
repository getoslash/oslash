import CopyButton from './CopyButton.svelte'
import { render } from '@testing-library/svelte'
describe("Copy Button Component", () => {
  test("should render the Copy Button component", () => {
    render(CopyButton)
  })
})
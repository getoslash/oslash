import Success from "./Success.svelte";
import { render } from '@testing-library/svelte'
describe("Success Component", () => {
  test("should render the Success component", () => {
    render(Success)
  })
})

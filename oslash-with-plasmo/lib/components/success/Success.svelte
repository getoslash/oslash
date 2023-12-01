<script lang="ts">
  import { openNewTab } from "~lib/utils/browser/tabOperations"

  import type { Shortcut } from "../../types"
  import { copyToClipboard } from "../../utils/copyToClipboard"
  import Button from "../button/Button.svelte"
  import CopyButton from "./../copybutton/CopyButton.svelte"
  import IconExternalLink from "./../icons/IconExternalLink.svelte"

  export let shortcut: Shortcut = {
    shortlink: "",
    url: "",
    updatedAt: new Date(),
    createdAt: new Date()
  }
  export let closePopup: () => void

  function openShortcutInNewTab() {
    openNewTab({ url: shortcut.url })
  }
</script>

<div class="flex-auto flex flex-col justify-between px-6 py-4 text-center">
  <h2 class="text-black text-2xl font-semibold">Congratulations! 🎉</h2>

  <p class="text-gray-900 text-base font-medium">
    Shortcut created successfully
  </p>

  <div class="flex flex-col px-6 gap-3">
    <div
      class="group flex items-center gap-3 p-3 shadow ring-1 ring-gray-200 rounded-lg"
      on:click={openShortcutInNewTab}
      on:keypress={openShortcutInNewTab}
      role="button"
      tabindex="0">
      <span
        class="flex-auto text-left text-gray-900 text-sm font-medium truncate">
        {shortcut.shortlink}
      </span>

      <span
        class="flex-none inline-flex h-7 w-7 items-center justify-center rounded bg-white transition-colors group-hover:bg-indigo-50 focus:outline-none">
        <span class="sr-only">External Link</span>
        <IconExternalLink
          className="h-4 w-4 fill-gray-500 transition-colors group-hover:fill-indigo-500" />
      </span>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <CopyButton
        onClick={() => {
          copyToClipboard(shortcut.shortlink)
        }} />

      <Button
        colorScheme="white"
        variant="outline"
        isFullWidth
        on:click={closePopup}>
        Close
      </Button>
    </div>
  </div>
</div>

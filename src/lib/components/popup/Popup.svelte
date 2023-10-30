<script lang="ts">
  import { onMount } from "svelte";
  import IconChevronRight from "../icons/IconChevronRight.svelte";
  import IconOslash from "../icons/IconOslash.svelte";
  import { getSavedShortcuts } from "../../utils/getSavedShortcuts";
  import { type Shortcut } from "../../types";
  import { checkIfShortcutExists } from "../../utils/checkIfShortcutExists";
  import { createNewShortcut, updateShortcut } from "../../utils/shortcuts";
  import ShortcutForm from "../ShortcutForm/ShortcutForm.svelte";
  import Success from "../success/Success.svelte";

  let shortcutURL = "";
  let shortcutName = "";
  let savedShortcutNames: Set<string> | null = null;
  let savedShortcutURLs: Set<string> | null = null;
  let savedShortcuts: Shortcut[] = [];
  let savedNewShortcut: Shortcut | null = null;

  $: shortcutExistsCheck = checkIfShortcutExists(
    shortcutURL,
    savedShortcutURLs,
    savedShortcuts
  );

  /**
   * Closes the Popup window
   * @returns {void} void
   */
  function closePopup() {
    window.close();
  }

  /**
   * Triggered when CTA submit button is clicked
   * @returns {Promise<void>} void
   */
  async function handleCreateOrUpdateShortcut(newShortcut: Shortcut) {
    if (shortcutExistsCheck) {
      // update existing shortcut
      const oldShortcut = shortcutExistsCheck;
      await updateShortcut(oldShortcut, newShortcut);
    } else {
      // create new shortcut
      await createNewShortcut(newShortcut);
    }
    savedNewShortcut = newShortcut;
  }

  onMount(async () => {
    // get the current tab url
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      shortcutURL = tabs[0].url ?? "";
    });

    // load saved shortcuts on mount
    savedShortcuts = await getSavedShortcuts();

    // create Sets of saved Shortcut names and URLs for performant computation
    savedShortcutNames = new Set(
      savedShortcuts.map((shortcut) => shortcut.shortlink)
    );
    savedShortcutURLs = new Set(savedShortcuts.map((shortcut) => shortcut.url));

    // set the shortcut name if the tab url is already a saved shortcut
    if (savedShortcutURLs.has(shortcutURL)) {
      shortcutName =
        savedShortcuts.find((shortcut) => shortcut.url === shortcutURL)
          ?.shortlink ?? "";
    }
  });
</script>

<div class="bg-white h-full flex flex-col divide-y divide-gray-200">
  <div class="flex items-center justify-between px-6 py-4">
    <span class="inline-flex items-center gap-3">
      <span
        class="bg-gray-900 w-6 h-6 inline-flex items-center justify-center rounded-full"
      >
        <IconOslash className="w-[18px] h-3 fill-white" />
      </span>

      <span class="text-gray-900 text-base font-medium">Shortcuts</span>
    </span>

    <!-- REFER: https://dev.to/tohodo/comment/1mei2 -->
    <!-- svelte-ignore missing-declaration -->
    <button
      type="button"
      class="group inline-flex items-center justify-center text-base text-gray-900 hover:text-gray-800 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 focus-visible:rounded-sm"
      on:click={() => {
        chrome.tabs.create({ url: "/option.html" });
      }}
    >
      Manage

      <IconChevronRight
        className="w-5 h-5 fill-black group-hover:fill-black/80 transition-colors"
      />
    </button>
  </div>

  {#if savedShortcutNames && !savedNewShortcut}
    <ShortcutForm
      shortcut={{
        shortlink: shortcutName,
        url: shortcutURL,
        createdAt: new Date(),
        updatedAt: new Date(),
      }}
      {savedShortcutNames}
      closeForm={() => {}}
      cancelForm={closePopup}
      submitForm={handleCreateOrUpdateShortcut}
      submitButtonText={shortcutExistsCheck ? "Update" : "Create"}
    />
  {/if}

  {#if savedNewShortcut}
    <Success shortcut={savedNewShortcut} {closePopup} />
  {/if}
</div>

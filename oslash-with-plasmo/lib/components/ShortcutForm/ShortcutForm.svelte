<script lang="ts">
  import {
    SHORTCUT_NAME_INPUT_ID,
    SHORTCUT_URL_INPUT_ID,
  } from "../../constants/keys";
  import type { Shortcut } from "../../types";
  import {
    validateShortcutName,
    validateShortcutURL,
  } from "../../utils/validate";
  import Button, { type ButtonColorScheme } from "../button/Button.svelte";
  import Input from "../input/Input.svelte";

  export let savedShortcutNames: Set<string>;
  export let closeForm: () => void;
  export let cancelForm: () => void;
  export let submitForm: (shortcut: Shortcut) => Promise<void>;
  export let submitButtonText = "";
  export let shortcut: Shortcut = {
    shortlink: "",
    url: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  export let disabledFields: string[] = [];
  export let submitButtonColorScheme: ButtonColorScheme = "indigo";

  let isShortcutFormLoading = false;
  let shortcutName = shortcut.shortlink;
  let shortcutURL = shortcut.url;
  let shortcutNameErrorMessage: string | null = null;
  let shortcutURLErrorMessage: string | null = null;

  /**
   * validates and sets error message when input event is triggered in shortcut name text field
   * @returns {void} void
   */
  function handleShortcutNameInput() {
    shortcutNameErrorMessage = validateShortcutName(
      shortcutName,
      savedShortcutNames
    );
  }

  /**
   * validates and sets error message when input event is triggered in shortcut url text field
   * @returns {void} void
   */
  function handleShortcutURLInput() {
    shortcutURLErrorMessage = validateShortcutURL(shortcutURL);
  }

  /**
   * validates, sets error message and submits the form
   * @returns {void} void
   */
  async function handleSubmitForm() {
    isShortcutFormLoading = true;

    const shortcut: Shortcut = {
      shortlink: shortcutName,
      url: shortcutURL,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!disabledFields.includes(SHORTCUT_NAME_INPUT_ID)) {
      shortcutNameErrorMessage = validateShortcutName(
        shortcutName,
        savedShortcutNames
      );
    }
    if (!disabledFields.includes(SHORTCUT_URL_INPUT_ID)) {
      shortcutURLErrorMessage = validateShortcutURL(shortcutURL);
    }

    if (!shortcutNameErrorMessage && !shortcutURLErrorMessage) {
      await submitForm(shortcut);
      closeForm();
    }

    isShortcutFormLoading = false;
  }
</script>

<div class="flex flex-col p-6 gap-2">
  <form on:submit|preventDefault>
    <Input
      id={SHORTCUT_NAME_INPUT_ID}
      shouldFocusOnMount={true}
      placeholder="shortcut-name"
      bind:value={shortcutName}
      isError={!!shortcutNameErrorMessage}
      hint={shortcutNameErrorMessage ?? ""}
      on:input={handleShortcutNameInput}
      isDisabled={disabledFields.includes(SHORTCUT_NAME_INPUT_ID)}
    />

    <Input
      id={SHORTCUT_URL_INPUT_ID}
      placeholder="shortcut-url"
      bind:value={shortcutURL}
      isError={!!shortcutURLErrorMessage}
      hint={shortcutURLErrorMessage ?? ""}
      on:input={handleShortcutURLInput}
      isDisabled={disabledFields.includes(SHORTCUT_URL_INPUT_ID)}
    />

    <div class="flex justify-end gap-2">
      <Button variant="outline" on:click={cancelForm}>Cancel</Button>
      <Button
        type={"submit"}
        on:click={handleSubmitForm}
        isLoading={isShortcutFormLoading}
        colorScheme={submitButtonColorScheme}
        isDisabled={!!shortcutNameErrorMessage || !!shortcutURLErrorMessage}
        >{submitButtonText}</Button
      >
    </div>
  </form>
</div>

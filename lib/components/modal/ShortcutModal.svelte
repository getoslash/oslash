<script lang="ts">
  import {
    Dialog,
    DialogOverlay,
    DialogTitle
  } from "@rgossiaux/svelte-headlessui";

  import type { Shortcut } from "../../types";
  import ShortcutForm from "../ShortcutForm/ShortcutForm.svelte";
  import type { ButtonColorScheme } from "../button/Button.svelte";


  let isOpen = true
  export let closeModal: () => void;

  export let shortcut: Shortcut = {
    shortlink: "",
    url: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  export let savedShortcutNames: Set<string> | null;
  export let submitModal: (shortcut: Shortcut) => Promise<void>;
  export let modalTitle: string = "";
  export let ctaButtonTitle: string = "";
  export let disabledFields: string[] = [];
  export let submitButtonColorScheme: ButtonColorScheme = "indigo";

  /**
   * submits the modal data and closes the modal
   * @param {Shortcut} shortcut
   * @returns {void} void
   */
  async function handleModalSubmit(shortcut: Shortcut) {
    await submitModal(shortcut);
    closeModal();
  }
</script>
<Dialog
  open
  on:close={() => {
    closeModal()
  }}
  as="div"
  class="relative z-10"
>
  <DialogOverlay class="fixed inset-0 bg-black bg-opacity-25" />

  <div class="fixed inset-0">
    <div class="flex min-h-full items-center justify-center">
      <div class="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle border border-gray-300 shadow transition-all">
        <DialogTitle class="text-black text-lg font-semibold">
          {modalTitle}
        </DialogTitle>
        
        {#if savedShortcutNames}
          <div class="-mx-6 -mb-6">
            <ShortcutForm
              {shortcut}
              {savedShortcutNames}
              closeForm={closeModal}
              submitForm={handleModalSubmit}
              submitButtonText={ctaButtonTitle}
              {submitButtonColorScheme}
              cancelForm={closeModal}
              {disabledFields}
            />
          </div>
        {/if}
      </div>
    </div>
  </div>
</Dialog>

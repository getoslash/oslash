<script lang="ts">
  import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
  } from "@rgossiaux/svelte-headlessui"
  import Fuse from "fuse.js"
  import PapaParse from "papaparse"
  import { onMount } from "svelte"

  import { shortcuts } from "~lib/store/shortcuts"
  import { getFaviconURL } from "~lib/utils/browser/getFaviconURL"

  import {
    SHORTCUT_NAME_INPUT_ID,
    SHORTCUT_URL_INPUT_ID
  } from "../../constants/keys"
  import type { Shortcut } from "../../types"
  import { constructShortcutsFromCSVData } from "../../utils/constructShortcutsFromCSVData"
  import {
    createNewShortcut,
    createNewShortcuts,
    deleteShortcut,
    updateShortcut
  } from "../../utils/shortcutOperations"
  import Button from "../button/Button.svelte"
  import IconDotsVertical from "../icons/IconDotsVertical.svelte"
  import IconSearch from "../icons/IconSearch.svelte"
  import Input from "../input/Input.svelte"
  import ShortcutModal from "../modal/ShortcutModal.svelte"

  let searchQuery = ""
  const fuseOptions = {
    includeScore: true,
    keys: ["shortlink", "url"]
  }

  $: fuse = new Fuse($shortcuts, fuseOptions)

  let filteredShortcuts: Shortcut[] = []
  let savedShortcutNames: Set<string> | null = null
  let selectedShortcut: Shortcut | null = null
  let openCreateShortcut = false
  let openDeleteShortcutModal = false
  let openEditShortcutModal = false
  let uploadCSVError: string | null = null

  $: savedShortcutNames = new Set(
    $shortcuts.map((shortcut) => shortcut.shortlink)
  )

  $: if (uploadCSVError) {
    alert(uploadCSVError)
  }

  // reset search query every-time shortcut list changes
  $: resetSearchQuery($shortcuts)

  async function loadShortcuts() {
    await shortcuts.init()
  }

  onMount(() => {
    loadShortcuts()
  })

  /**
   * filters shortcut list according to query
   * @returns {void} void
   */
  function handleSearchQueryInput() {
    if (searchQuery === "") {
      filteredShortcuts = $shortcuts
      return
    }
    const searchResults = fuse.search(searchQuery)
    filteredShortcuts = searchResults.map((searchResult) => searchResult.item)
  }

  /**
   * resets the search query and filtered list
   * @param {Shortcut[]} savedShortcuts latest shortcut list
   * @returns {void} void
   */
  function resetSearchQuery(savedShortcuts: Shortcut[]) {
    searchQuery = ""
    filteredShortcuts = savedShortcuts
  }

  /**
   * updates the selected Shortcut
   * @param {Shortcut} updatedShortcut updated Shortcut
   * @returns {Promise<void>} void
   */
  async function updateSelectedShortcut(updatedShortcut: Shortcut) {
    if (selectedShortcut) {
      const oldShortcut = selectedShortcut
      await updateShortcut(oldShortcut, updatedShortcut)
    }
  }

  /**
   * creates a new Shortcut
   * @param {Shortcut} newShortcut new Shortcut
   * @returns {Promise<void>} void
   */
  async function createShortcut(newShortcut: Shortcut) {
    await createNewShortcut(newShortcut)
  }

  /**
   * deletes a Shortcut
   * @param {Shortcut} selectedShortcut shortcut to be deleted
   * @returns {Promise<void>} void
   */
  async function deleteSelectedShortcut(selectedShortcut: Shortcut) {
    await deleteShortcut(selectedShortcut)
  }

  /**
   * uploads the shortcuts CSV and creates shortcuts
   * @param {Event} uploadEvent
   * @returns {void} void
   */
  function uploadCSVFile(uploadEvent: Event) {
    // reset error on reupload
    uploadCSVError = null

    const fileDOMElement = uploadEvent.target as HTMLInputElement

    // prevent any associated default event
    uploadEvent.preventDefault()
    if (fileDOMElement && fileDOMElement.files) {
      // accessing the first selected file
      const csvFile = fileDOMElement.files[0]

      // parsing the csv file
      PapaParse.parse(csvFile, {
        escapeChar: "\\",
        error: (error) => {
          uploadCSVError = error.message
        },
        complete: async (results) => {
          // If there is no parsing error
          if (results.errors.length === 0) {
            const resultData = results.data as string[][]
            try {
              const newShortcuts = await constructShortcutsFromCSVData(
                resultData,
                $shortcuts
              )
              await createNewShortcuts(newShortcuts)
            } catch (error) {
              // setting error
              if (error instanceof Error) {
                uploadCSVError = error.message
              }
            }
          } else {
            uploadCSVError = results.errors[0].message
          }
        }
      })
    }
  }

  /**
   * exports the shortcuts into downloadable CSV
   * @returns {void} void
   */
  function exportShortcutsToCSV() {
    // only include shortcut name and url in exports
    const shortcutData = $shortcuts.map((shortcut) => {
      return {
        name: shortcut.shortlink,
        url: shortcut.url
      }
    })
    const csv = PapaParse.unparse(shortcutData, {
      header: false
    })
    const csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const csvURL = window.URL.createObjectURL(csvData)
    const tempLink = document.createElement("a")
    tempLink.href = csvURL
    tempLink.setAttribute("download", `shortcuts-${new Date().valueOf()}`)
    tempLink.click()
  }
</script>

<div class="w-full h-full flex overflow-auto">
  <div class="w-full max-w-3xl px-5 py-16 mb-auto mx-auto">
    <div class="bg-white flex items-center">
      <h5 class="text-3xl font-semibold text-black">Shortcuts</h5>

      <div class="inline-flex gap-2 ml-auto">
        <div class="max-w-[240px] w-full relative inline-flex items-center">
          <Input
            placeholder="Search"
            showStartIcon
            bind:value={searchQuery}
            hideHint={true}
            on:input={handleSearchQueryInput}>
            <span slot="startIcon" class="pointer-events-none absolute left-4">
              <IconSearch className="w-5 h-5 fill-gray-400" />
            </span>
          </Input>
        </div>

        <Button shadow="shadow-sm" on:click={() => (openCreateShortcut = true)}>
          Create
        </Button>

        <Menu class="relative inline-block text-left">
          <MenuButton class="focus:outline-none" as="div">
            <button
              class="group btn inline-flex flex-shrink-0 h-[38px] w-[38px] items-center justify-center rounded-md bg-white border border-gray-300 shadow-sm transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2">
              <span class="sr-only">Dots vertical</span>
              <IconDotsVertical
                className="w-5 h-5 fill-gray-400 group-hover:fill-gray-500 transition-colors" />
            </button>
          </MenuButton>
          <MenuItems
            unmount={false}
            class="absolute right-0 mt-1 origin-top-right w-40 rounded-lg bg-white ring-1 ring-gray-200 shadow-lg overflow-hidden focus:outline-none">
            <MenuItem let:active>
              <label
                for="file-upload"
                class="relative {active
                  ? 'bg-gray-100'
                  : 'bg-white'} w-full block px-4 py-3 text-left text-sm text-gray-600 overflow-hidden">
                Import as CSV

                <input
                  id="file-upload"
                  name="file-upload"
                  class="absolute inset-0 opacity-0 cursor-pointer"
                  type="file"
                  on:change={uploadCSVFile}
                  accept=".csv"
                  multiple={false} />
              </label>
            </MenuItem>

            <MenuItem
              let:active
              on:click={exportShortcutsToCSV}
              class="cursor-pointer">
              <span
                class="{active
                  ? 'bg-gray-100'
                  : 'bg-white'} w-full block px-4 py-3 text-left text-sm text-gray-600">
                Export as CSV
              </span>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>

    <div class="mt-8 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto">
        <div class="inline-block min-w-full px-4 py-2 align-middle">
          <div
            class="overflow-hidden shadow ring-1 ring-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="w-[200px] px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:px-6"
                    >Shortcut</th>

                  <th
                    scope="col"
                    class="w-[420px] px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500 sm:px-6"
                    >destination</th>

                  <th scope="col" class="w-[52px] p-3">
                    <span class="sr-only">Edit</span>
                  </th>

                  <th scope="col" class="w-[52px] p-3">
                    <span class="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 bg-white">
                {#if filteredShortcuts.length}
                  {#each filteredShortcuts as shortcut}
                    <tr>
                      <td
                        class="max-w-[200px] whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900 sm:px-6">
                        <span class="flex items-center gap-2">
                          <img
                            src={getFaviconURL(shortcut.url)}
                            alt={""}
                            class="h-4 w-4 shrink-0" />
                          <span class="block truncate"
                            >{shortcut.shortlink}</span>
                        </span>
                      </td>

                      <td
                        class="max-w-[420px] whitespace-nowrap px-4 py-4 text-sm text-gray-500 sm:px-6">
                        <span class="block truncate">{shortcut.url}</span>
                      </td>

                      <td class="p-2.5 text-sm text-gray-500">
                        <button
                          class="group inline-flex h-8 w-8 items-center justify-center rounded bg-white transition-colors hover:bg-indigo-50 focus:outline-none"
                          on:click={() => {
                            selectedShortcut = shortcut
                            openEditShortcutModal = true
                          }}>
                          <span class="sr-only">Edit</span>

                          <svg
                            class="h-4 w-4 fill-gray-500 transition-colors group-hover:fill-indigo-500"
                            viewBox="0 0 17 16"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            ><path
                              d="M2.5 11.64v2.027a.33.33 0 0 0 .333.333H4.86a.313.313 0 0 0 .233-.1l7.28-7.273-2.5-2.5L2.6 11.4a.327.327 0 0 0-.1.24Zm11.807-6.947c.26-.26.26-.68 0-.94l-1.56-1.56a.664.664 0 0 0-.94 0l-1.22 1.22 2.5 2.5 1.22-1.22Z" /></svg>
                        </button>
                      </td>

                      <td class="p-2.5 text-right text-sm font-medium">
                        <button
                          class="group inline-flex h-8 w-8 items-center justify-center rounded bg-white transition-colors hover:bg-red-50 focus:outline-none"
                          on:click={() => {
                            selectedShortcut = shortcut
                            openDeleteShortcutModal = true
                          }}>
                          <svg
                            class="h-4 w-4 fill-gray-500 transition-colors group-hover:fill-red-500"
                            viewBox="0 0 17 16"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                            ><path
                              d="M4.5 12.667C4.5 13.4 5.1 14 5.833 14h5.334c.733 0 1.333-.6 1.333-1.333V6c0-.733-.6-1.333-1.333-1.333H5.834C5.1 4.667 4.5 5.267 4.5 6v6.667Zm8-10h-1.666l-.474-.474A.673.673 0 0 0 9.894 2H7.106a.672.672 0 0 0-.467.193l-.473.474H4.5c-.367 0-.667.3-.667.666 0 .367.3.667.667.667h8c.367 0 .667-.3.667-.667 0-.366-.3-.666-.667-.666Z" /></svg>

                          <span class="sr-only">Delete</span>
                        </button>
                      </td>
                    </tr>
                  {/each}
                {:else}
                  <tr>
                    <td
                      colspan="4"
                      class="whitespace-nowrap px-4 py-12 text-sm text-gray-900 text-center sm:px-6">
                      <div class="inline-flex flex-col gap-4">
                        <span>
                          Uh-oh looked everywhere!
                          <br />
                          Couldn’t find a Shortcut
                        </span>

                        <span>
                          <Button
                            colorScheme="white"
                            variant="outline"
                            on:click={() => (openCreateShortcut = true)}>
                            Let's create one
                          </Button>
                        </span>
                      </div>
                    </td>
                  </tr>
                {/if}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  {#if selectedShortcut && openEditShortcutModal}
    <ShortcutModal
      closeModal={() => {
        selectedShortcut = null
        openEditShortcutModal = false
      }}
      {savedShortcutNames}
      shortcut={selectedShortcut}
      submitModal={updateSelectedShortcut}
      modalTitle="Update Shortcut"
      ctaButtonTitle="Update" />
  {/if}

  {#if openCreateShortcut}
    <ShortcutModal
      closeModal={() => {
        openCreateShortcut = false
      }}
      {savedShortcutNames}
      submitModal={createShortcut}
      modalTitle="Create Shortcut"
      ctaButtonTitle="Create" />
  {/if}

  {#if selectedShortcut && openDeleteShortcutModal}
    <ShortcutModal
      closeModal={() => {
        selectedShortcut = null
        openDeleteShortcutModal = false
      }}
      {savedShortcutNames}
      submitModal={deleteSelectedShortcut}
      modalTitle="Do you want to delete this Shortcut ?"
      ctaButtonTitle="Delete"
      disabledFields={[SHORTCUT_NAME_INPUT_ID, SHORTCUT_URL_INPUT_ID]}
      submitButtonColorScheme={"red"}
      shortcut={selectedShortcut} />
  {/if}
</div>

<style>
  .btn:active:not([disabled]) {
    animation: button-pop 0.25s ease-out;
  }
  .btn:active:hover:not([disabled]),
  .btn:active:focus:not([disabled]) {
    transform: scale(0.97);
    animation: button-pop 0s ease-out;
  }
  @keyframes button-pop {
    0% {
      transform: scale(0.98);
    }
    40% {
      transform: scale(1.02);
    }
    to {
      transform: scale(1);
    }
  }
</style>

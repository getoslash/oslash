<script lang="ts">
  import { onMount } from "svelte";
  import IconExclamationCircle from "./../icons/IconExclamationCircle.svelte";
  export let placeholder: string | null = null;
  export let value: string;
  export let isError = false;
  export let hint = "";
  export let hideHint = false;
  export let isDisabled = false;
  export let id = "";
  export let isReadOnly = false;
  export let inputRef: HTMLInputElement | null = null;
  export let onEnter = async () => {
    // do nothing
  };
  export let shouldFocusOnMount = false;
  export let showStartIcon = false;

  onMount(() => {
    if (inputRef && shouldFocusOnMount) {
      inputRef.focus();
    }
  });
</script>

<div class="flex flex-col gap-1">
  <div class="relative flex items-center">
    <input
      type="text"
      {id}
      name={id}
      {placeholder}
      class:readOnly={isReadOnly}
      class:disabled={isDisabled}
      class:error={isError}
      class="p-2 pr-3"
      class:pl-10={showStartIcon}
      class:pr-10={isError}
      disabled={isDisabled}
      bind:value
      bind:this={inputRef}
      required
      readonly={isReadOnly}
      on:keydown={(e) => {
        if (e.key === "Enter") {
          onEnter();
        }
      }}
      on:change
      on:input
    />

    {#if showStartIcon}
      <slot name="startIcon" />
    {/if}

    {#if isError}
      <IconExclamationCircle
        className="absolute right-3 w-5 h-5 fill-red-500 animate-shake pointer-events-none"
      />
    {/if}
  </div>

  {#if !hideHint}
    <p class="min-h-[20px] text-sm text-gray-500">{hint}</p>
  {/if}
</div>

<style>
  /* input style starts */
  input {
    @apply block w-full h-[38px] text-base text-gray-900 rounded-md border-0 ring-1 ring-gray-300;

    &:placeholder-shown {
      @apply text-gray-500;
    }

    &:focus {
      @apply ring-indigo-600 outline-none;
    }

    &.readOnly {
      @apply bg-gray-50 text-gray-400 ring-gray-200;
    }
    &.disabled {
      @apply bg-gray-50 text-gray-400 ring-gray-200 cursor-not-allowed;
    }

    &.readOnly,
    &.disabled {
      &:placeholder-shown {
        @apply text-gray-300;
      }
      & + span[slot="startIcon"] {
        @apply opacity-70;
      }
    }

    &.error {
      @apply text-red-900 ring-red-500;

      &:focus {
        @apply ring-red-500;
      }
    }
  }
</style>

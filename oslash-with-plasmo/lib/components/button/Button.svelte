<script context="module" lang="ts">
  export type ButtonColorScheme = "white" | "indigo" | "red";
  export type ButtonVariant = "filled" | "outline";
  export type ButtonShadow = "shadow-sm" | "shadow-none";
</script>

<script lang="ts">
  export let colorScheme: ButtonColorScheme = "indigo";
  export let variant: ButtonVariant = "filled";
  export let isDisabled = false;
  export let isLoading = false;
  export let type: HTMLButtonElement["type"] = "button";
  export let shadow: ButtonShadow = "shadow-none";
  export let isFullWidth = false;
</script>

<button
  {type}
  class:filled={variant === "filled"}
  class:outline={variant === "outline"}
  class:white={colorScheme === "white"}
  class:indigo={colorScheme === "indigo"}
  class:red={colorScheme === "red"}
  class:loading={isLoading}
  class:disabled={isDisabled && (variant === "filled" || variant === "outline")}
  class="btn btn-reset {isLoading ? 'cursor-wait' : ''}"
  class:shadow-sm={shadow === "shadow-sm"}
  class:shadow-none={shadow === "shadow-none"}
  class:fullWidth={isFullWidth}
  disabled={isDisabled || isLoading}
  on:click
>
  <slot />
</button>

<style>
  .btn-reset {
    @apply inline-flex items-center px-4 py-1.5 text-base font-medium whitespace-nowrap align-middle rounded-md transition-colors appearance-none;

    &:focus {
      @apply outline-none;
    }
    &:focus-visible {
      outline-style: solid;
      outline-color: #4f46e5;
      outline-offset: 2px;
    }
  }

  .filled.white {
    @apply bg-white text-black;
    &:hover {
      @apply bg-white;
    }
  }

  .filled.indigo {
    @apply bg-indigo-600 text-white;
    &:hover {
      @apply bg-indigo-600/90;
    }
  }

  .filled.indigo.loading {
    @apply bg-indigo-50 text-indigo-600;
  }

  .filled.red {
    @apply bg-red-600 text-white;
    &:hover {
      @apply bg-red-600/90;
    }
  }

  .filled.disabled {
    @apply bg-gray-200 cursor-not-allowed;

    &:hover {
      @apply bg-gray-200;
    }
  }

  .outline {
    @apply bg-white text-gray-700 border border-gray-300 outline-none;

    &:hover {
      @apply bg-gray-50 border-gray-400;
    }
  }

  .outline.disabled {
    @apply bg-gray-50 text-opacity-60 border-gray-200 cursor-not-allowed;

    &:hover {
      @apply bg-gray-50 border-gray-200;
    }
  }

  .fullWidth {
    @apply w-full justify-center;
  }

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

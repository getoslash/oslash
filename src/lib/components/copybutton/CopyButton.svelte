<script lang="ts">
    import IconCopy from '../icons/IconCopy.svelte';
	export let onClick: () => void;
	let isCopied = false;
</script>

<button
	class="btn relative bg-gray-900 hover:bg-gray-800 inline-flex flex-shrink-0 items-center justify-center px-4 py-1.5 text-base text-white font-medium border border-gray-900 rounded-md transition-colors focus:outline-none"
	on:click={() => {
		if (!isCopied) {
			onClick();
			isCopied = true;
			setTimeout(() => {
				isCopied = false;
			}, 1000);
		}
	}}
	disabled={isCopied}
>
	<IconCopy className="h-5 w-5 fill-white mr-1" />
	{isCopied ? 'Copied!' : 'Copy'}
</button>


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
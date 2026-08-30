<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils';

	let {
		class: className,
		children,
		type = 'button',
		...restProps
	}: HTMLButtonAttributes = $props();
</script>

<button
	{type}
	class={cn(
		'inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
		className
	)}
	{...restProps}
>
	{@render children?.()}
</button>

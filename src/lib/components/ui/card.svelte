<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '#lib/utils';

	let { class: className, children, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={cn('rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm', className)}
	{...restProps}
>
	{@render children?.()}
</div>

<script setup lang="ts">
import { useToxicityStore } from './model/toxicity-store';

const busy = defineModel<boolean>('busy');

const toxicityStore = useToxicityStore();
const inputRef = ref('');

const lastResult = ref();

const testToxic = async () => {

	if (busy.value) return;
	busy.value = true;

	lastResult.value = '';
	lastResult.value = await toxicityStore.classify(inputRef.value) ?? 'Not toxic';

	busy.value = false;

}
</script>
<template>
	<div class="flex w-full min-w-96">
		<div v-if="!toxicityStore.loaded">Loading Toxicity model...</div>
		<div v-else class="flex w-full space-x-2 grow">

			<input class="min-w-96" type="text" v-model="inputRef" placeholder="Enter test text">
			<button type="button"
					class="bg-gray-300 rounded-xs px-2 disabled:opacity-60"
					@click="testToxic"
					:disabled="busy || !inputRef">Test</button>
		</div>
		<div v-if="lastResult">
			{{ lastResult }}
		</div>
	</div>
</template>
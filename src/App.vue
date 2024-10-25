<script setup lang="ts">
import { useToxicityStore } from './model/toxicity-store';

const toxicityStore = useToxicityStore();
const inputRef = ref('');

const lastResult = ref();
const busy = ref(false);

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
		<div v-if="!toxicityStore.loaded">Loading model...</div>
		<div v-else class="flex w-full space-x-2 grow">

			<input class="min-w-96" type="text" v-model="inputRef">
			<button type="button"
					@click="testToxic"
					:disabled="busy || !inputRef">Test</button>
		</div>
		<div v-if="lastResult">
			{{ lastResult }}
		</div>
	</div>
</template>
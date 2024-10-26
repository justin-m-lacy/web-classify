<script setup lang="ts">
import { useImageStore } from './model/image-store';

const busy = defineModel<boolean>('busy');

const imageStore = useImageStore();

const previewRef = ref<HTMLImageElement>();

const loadedImage = ref<string | null>(null);
const lastResult = ref();

const readerRef = ref<FileReader | null>(null);

const onImageChange = (e: Event) => {

	const file = (e.target as HTMLInputElement).files?.[0];
	if (!file) return;

	if (readerRef.value) {
		readerRef.value.abort();
		readerRef.value = null;
	}

	const reader = readerRef.value = new FileReader();
	reader.onload = function (e) {

		if (readerRef.value === reader) {
			readerRef.value = null;
		}

		if (e.target?.result == null) {
			loadedImage.value = null;
		} else if (typeof e.target.result === 'string') {
			loadedImage.value = e.target.result;
		}

	}
	reader.onabort = reader.onerror = () => {
		if (readerRef.value === reader) {
			readerRef.value = null;
		}
	}

	reader.readAsDataURL(file);

}

const classify = async () => {

	if (!loadedImage.value || !previewRef.value) return;
	if (busy.value) return;
	busy.value = true;

	lastResult.value = '';
	lastResult.value = await imageStore.classify(previewRef.value) ?? 'Unknown';

	busy.value = false;

}
</script>
<template>
	<div class="flex w-full min-w-96">
		<div v-if="!imageStore.loaded">Loading Image model...</div>
		<div v-else class="flex w-full space-x-2 grow">

			<input class="min-w-96" type="file" @change="onImageChange">
			<img v-show="loadedImage" ref="previewRef" :src="loadedImage ?? '#'">
			<button type="button"
					@click="classify"
					:disabled="busy || !loadedImage">Test</button>
		</div>
		<div v-if="lastResult">
			{{ lastResult }}
		</div>
	</div>
</template>
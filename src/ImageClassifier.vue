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
	<div class="flex min-w-96">
		<div v-if="!imageStore.loaded">Loading Image model...</div>
		<div v-else class="flex space-x-4 space-y-2">

			<div class="flex flex-col space-y-2 items-start">
				<input class="min-w-96" type="file" @change="onImageChange">
				<button type="button"
						class="bg-gray-300 rounded-xs px-2 disabled:opacity-60"
						@click="classify"
						:disabled="busy || !loadedImage">Test</button>

				<div v-show="lastResult">
					<span>Prediction:</span><span>{{ lastResult }}</span>
				</div>
			</div>

			<img v-show="loadedImage" ref="previewRef" class="max-w-80" :src="loadedImage ?? '#'">

		</div>

	</div>
</template>
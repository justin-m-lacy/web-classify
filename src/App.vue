<script setup lang="ts">
import ImageClassifier from './ImageClassifier.vue';
import ToxicClassifier from './ToxicClassifier.vue';

type Section = typeof sections[number];

const sections = ['image', 'toxicity'];

const busy = ref(false);

const section = ref<Section>('image');



</script>
<template>
	<div class="flex flex-col w-full items-stretch px-3">
		<div class="flex justify-start select-none p-2 space-x-4">
			<div class="cursor-pointer" v-for="sect in sections"
				 @click="section = sect">
				{{ sect }}
			</div>
		</div>
		<div class="flex w-full min-w-96">
			<ImageClassifier v-if="section === 'image'" v-model:busy="busy" />
			<ToxicClassifier v-else-if="section === 'toxicity'" v-model:busy="busy" />
		</div>
	</div>
</template>
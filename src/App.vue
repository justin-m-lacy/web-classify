<script setup lang="ts">
import ImageClassifier from './ImageClassifier.vue';
import ToxicClassifier from './ToxicClassifier.vue';

const busy = ref(false);

</script>
<template>
	<div class="flex w-full min-w-96">
		<ToxicClassifier v-model:busy="busy" />
		<ImageClassifier v-model:busy="busy" />
	</div>
</template>
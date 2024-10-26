import * as mobilenet from '@tensorflow-models/mobilenet';
import { MobileNet } from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-webgl';
import { defineStore } from "pinia";

export const useImageStore = defineStore('images', () => {

	const modelRef = shallowRef<Readonly<MobileNet>>();

	mobilenet.load({
		version: 2,
		alpha: 1
	}).then(model => {

		modelRef.value = Object.freeze(model);

	})

	async function classify(s: Parameters<MobileNet['classify']>[0]) {

		if (modelRef.value == null) return null;

		const predict = await modelRef.value.classify(s);

		let bestIndex = -1;
		let bestProb = 0;
		for (let i = predict.length - 1; i >= 0; i--) {
			if (predict[i].probability > bestProb) {
				bestProb = predict[i].probability;
				bestIndex = i;
			}
		}
		if (bestIndex >= 0) {
			return predict[bestIndex].className;
		}
		return null;

	}

	return {
		classify,
		loaded: computed(() => { return modelRef.value != null }),
	};

});
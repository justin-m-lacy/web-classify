import * as mobilenet from '@tensorflow-models/mobilenet';
import { MobileNet } from '@tensorflow-models/mobilenet';
import { defineStore } from "pinia";

export const useImageStore = defineStore('images', () => {

	const modelRef = shallowRef<Readonly<MobileNet>>();

	mobilenet.load({
		version: 2,
		alpha: 0.75
	}).then(model => {

		modelRef.value = Object.freeze(model);

	})

	async function classify(s: Parameters<MobileNet['classify']>[0]) {

		if (modelRef.value == null) return null;

		/// note: predictions[i].results.probabilities are
		/// the [0,1] (true/false) (on/off) probabilities for that label
		const predictions = await modelRef.value.classify(s);

		let bestIndex = -1;
		let bestProb = 0;
		for (let i = predictions.length; i >= 0; i--) {
			if (predictions[i].probability > bestProb) {
				bestIndex = i;
			}
		}
		if (bestIndex >= 0) {
			return predictions[bestIndex].className;
		}
		return null;

	}

	return {
		classify,
		loaded: computed(() => { return modelRef.value != null }),
	};

});
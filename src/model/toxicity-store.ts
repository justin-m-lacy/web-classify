import * as toxicity from '@tensorflow-models/toxicity';
import { ToxicityClassifier } from '@tensorflow-models/toxicity';
import { defineStore } from "pinia";

const toxicLabels = [
	"identity_attack", "insult", "obscene", "severe_toxicity", "sexual_explicit", "threat", "toxicity"
]
export const useToxicityStore = defineStore('toxicity', () => {

	const threshold = 0.7;
	const modelRef = shallowRef<Readonly<ToxicityClassifier>>();

	console.log(`loading model...`);
	toxicity.load(threshold, toxicLabels).then(model => {

		console.log(`model loaded...`);
		modelRef.value = Object.freeze(model);

	})

	async function classify(s: string) {

		if (modelRef.value == null) return null;

		/// note: predictions[i].results.probabilities are
		/// the [0,1] (true/false) (on/off) probabilities for that label
		const predictions = await modelRef.value.classify([s, "i will kill you"]);
		console.dir(predictions);

		for (const p of predictions) {
			if (p.results[0].match) {
				return p.label;
			}
		}

	}

	return {
		classify,
		loaded: computed(() => { return modelRef.value != null }),
	};

});
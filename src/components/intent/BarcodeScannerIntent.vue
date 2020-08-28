<template>
	<div class="barcodescanner">
		<BarcodeScanner :onDetected="onDetected"></BarcodeScanner>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import BarcodeScanner from "../BarcodeScanner.vue";

@Component({
	components: {
		BarcodeScanner,
	},
})
export default class BarcodeScannerIntent extends Vue {
	@Prop({ default: () => {} }) onDetected: Function | undefined;
}
</script>

<style lang="scss" scoped>
.barcodescanner {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;

	background-color: rgba(0, 0, 0, 0.2);

	z-index: 1000;

	button {
		position: absolute;
		bottom: 50px;

		width: 100%;
		text-align: center;

		background: none;
		text-decoration: underline;
	}
}
</style>

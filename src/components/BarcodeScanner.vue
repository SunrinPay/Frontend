<template>
	<div class="barcodescanner scanner">
		<div ref="screen" class="barcodescanner__screen">
			<video />
			<canvas class="drawingBuffer" />
		</div>
	</div>
</template>

<script lang="ts">
import Quagga from "quagga";

import { Vue, Component, Watch, Prop } from "vue-property-decorator";

@Component
export default class BarcodeScanner extends Vue {
	result: string = "";
	resultResetTimer: any = 0;

	@Prop({ default: () => {} }) onDetected: Function | undefined;
	mounted() {
		this.start();
	}
	start() {
		Quagga.onDetected(this.onDet);
		Quagga.onProcessed(this.onProcessed);

		let config = {
			inputStream: {
				name: "Live",
				type: "LiveStream",
				target: this.$refs.screen,
				constraints: {
					width: 1024,
					height: 1024,
					facingMode: "environment"
				}
			},
			decoder: {
				readers: [
					"code_128_reader",
					"ean_reader",
					"ean_8_reader",
					"code_39_reader",
					"code_39_vin_reader",
					"code_93_reader"
				]
			},
			locate: false, // 가로 인식
			numOfWorkers: navigator.hardwareConcurrency,
			frequency: 10
		};

		Quagga.init(config, err => {
			if (err) {
				console.log(err);
				return;
			}
			console.log("Initialization finished. Ready to start");
			Quagga.start();
		});
	}
	stop() {
		Quagga.stop();
	}
	onDet(data) {
		let barcode = data.codeResult.code;
		if (barcode != this.result && barcode) {
			if (this.onDetected) this.onDetected(barcode);
			this.result = barcode;
			if (!this.resultResetTimer) {
				this.resultResetTimer = setTimeout(() => {
					this.result = "";
					this.resultResetTimer = 0;
				}, 1000);
			}
		}
	}
	onProcessed(result) {
		let drawingCtx = Quagga.canvas.ctx.overlay;
		let drawingCanvas = Quagga.canvas.dom.overlay;
		if (result) {
			if (result.codeResult && result.codeResult.code) {
				drawingCtx.clearRect(
					0,
					0,
					parseInt(drawingCanvas.getAttribute("width")),
					parseInt(drawingCanvas.getAttribute("height"))
				);
				Quagga.ImageDebug.drawPath(
					result.line,
					{ x: "x", y: "y" },
					drawingCtx,
					{ color: "red", lineWidth: 3 }
				);
			}
		}
	}
}
</script>

<style lang="scss" scoped>
.barcodescanner {
	position: relative;
	width: 100%;
	height: 100%;
	background-color: black;

	.barcodescanner__startbtn {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 50;
	}
	.barcodescanner__stopbtn {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 50;
	}
	.barcodescanner__screen {
		position: absolute;
		width: 100%;
		height: 100%;
		video,
		canvas {
			position: absolute;
			top: 0;
			left: 0;
			width: 100% !important;
			height: 100% !important;
		}
	}
}
</style>

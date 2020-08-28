<template>
	<div class="qrscanner">
		<qrcode-stream @decode="onDecode"></qrcode-stream>
		<button>수동으로 결제 코드 입력</button>
		<!-- TODO: 클릭이벤트 -->
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from "vue-qrcode-reader";
@Component({
	components: {
		QrcodeStream
	}
})
export default class QRScannerIntent extends Vue {}
</script>

<style lang="scss" scoped>
.qrscanner {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;

	background-color: rgba(0, 0, 0, 0.2);

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

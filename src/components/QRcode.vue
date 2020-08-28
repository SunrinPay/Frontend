<template>
	<img class="qrcode" :src="qrdata" alt="qrcode" />
</template>

<script lang="ts">
import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class QRcode extends Vue {
	@Prop() readonly data: string | undefined;

	qrdata: string = "";
	options: QRCodeToDataURLOptions = {
		errorCorrectionLevel: "H",
		margin: 0,
		scale: 15,
		type: "image/png",
		color: {
			dark: "#FFFFFF",
			light: "#00000000"
		}
	};

	created() {
		this.QRgenerate();
	}

	@Watch("data")
	onChangeData() {
		this.QRgenerate();
	}

	QRgenerate(): void {
		if (this.data)
			QRCode.toDataURL(this.data, this.options, (err, url) => {
				this.qrdata = url;
			});
	}
}
</script>

<style lang="scss" scoped>
</style>

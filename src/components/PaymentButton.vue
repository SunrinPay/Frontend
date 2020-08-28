<template>
	<button class="paymentbtn" v-on="$listeners">
		<h2 class="paymentbtn__title">{{ paymentName }} 결제</h2>
		<!-- <p class="paymentbtn__content">pay 호환</p> -->
	</button>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PropType } from "vue";

@Component
export default class PaymentButton extends Vue {
	@Prop({ type: String as PropType<string>, default: "Sunrin Pay" })
	paymentName!: string;
}
</script>

<style lang="scss" scoped>
.paymentbtn {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.paymentbtn__title {
		font-size: $normal-size;
		font-weight: bold;
		word-break: keep-all;
	}
	.paymentbtn__content {
		font-size: $small-up-size;
		word-break: keep-all;
	}
}
</style>

<template>
	<div class="simpleuserpayment">
		<div class="simpleuserpayment__price">
			<p>결제하실 금액</p>
			<h2><NumberCounter text="25565" :isNumberFormat="true" defaultChar="0"></NumberCounter>원</h2>
		</div>
		<div class="simpleuserpayment__paymentselected">
			<h2>결제 수단 선택</h2>
			<PaymentSelected v-model="paymentResult"></PaymentSelected>
		</div>
		<button class="simpleuserpayment__ok">결제하기</button>
	</div>
</template>

<script lang="ts">
import PaymentSelected from "../components/PaymentSelected.vue";
import NumberCounter from "vue-roller";

import { Vue, Component } from "vue-property-decorator";

@Component({
	components: {
		PaymentSelected,
		NumberCounter,
	},
})
export default class SimpleUserPayment extends Vue {
	paymentResult: string = "sunrinpay";
}
</script>

<style lang="scss" scoped>
.simpleuserpayment {
	padding: 25px;

	height: 100%;

	display: flex;
	flex-direction: column;

	h2 {
		font-size: $small-size;
		opacity: 0.6;
		margin-bottom: 15px;
	}
	p {
		font-size: $small-up-size;
	}
	.simpleuserpayment__price {
		flex: 1;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		p {
			font-size: $small-normal-size;
		}
		h2 {
			opacity: 1;
			font-size: $large-size;
			display: flex;
			align-items: center;
		}
	}
	.simpleuserpayment__paymentselected {
		margin-bottom: 45px;
	}
	.simpleuserpayment__ok {
		border-radius: 8px;
		padding: 10px;

		font-size: $small-size;
		font-weight: bold;
	}
}
</style>

<template>
	<div class="paymentselected">
		<label class="paymentselected__label">
			<input type="radio" name="payment" value="sunrinpay" v-model="selectResult" />
			<span></span>
			<div class="paymentselected__content">
				<h3>Sunrin Pay 지갑</h3>
				<p>잔액 2,147,483,647원</p>
			</div>
		</label>
		<label class="paymentselected__label">
			<input type="radio" name="payment" value="kakaopay" v-model="selectResult" />
			<span></span>
			<div class="paymentselected__content">
				<h3>Kakao Pay</h3>
				<p>잔액 2,147,483,647원</p>
			</div>
		</label>
		<label class="paymentselected__label">
			<input type="radio" name="payment" value="samsungpay" v-model="selectResult" />
			<span></span>
			<div class="paymentselected__content">
				<h3>Samsung Pay</h3>
				<p>잔액 2,147,483,647원</p>
			</div>
		</label>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Model } from "vue-property-decorator";

@Component
export default class PaymentSelected extends Vue {
	@Model("change", { type: String }) readonly result;

	selectResult: string = "sunrinpay";

	@Watch("selectResult")
	onChangeSelectResult(value: string) {
		this.$emit("change", value);
	}
}
</script>

<style lang="scss" scoped>
.paymentselected {
	.paymentselected__label {
		display: flex;
		align-items: center;

		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
		span {
			margin-right: 20px;
		}

		.paymentselected__content {
			h3 {
				font-size: $small-normal-size;
				line-height: 1.4em;
			}
			p {
				font-size: $small-size;
				line-height: 1.4em;
			}
		}
	}
}
</style>
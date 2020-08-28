<template>
	<button class="cashbtn" v-on="$listeners">
		<h2 class="cashbtn__title">현금 결제</h2>
		<p class="cashbtn__content">현금영수증 발급</p>
	</button>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class CashButton extends Vue {}
</script>

<style lang="scss" scoped>
.cashbtn {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	background-color: $disable-color;
	.cashbtn__title {
		font-size: $normal-size;
		font-weight: bold;
		word-break: keep-all;
	}
	.cashbtn__content {
		font-size: $small-up-size;
		word-break: keep-all;
	}
}
</style>

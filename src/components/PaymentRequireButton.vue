<template>
	<button class="pos__content__okbtn" v-on="$listeners">
		<h2>계산 완료</h2>
		<p>고객에게 결제를 요청합니다.</p>
	</button>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class PaymentRequireButton extends Vue {}
</script>

<style lang="scss" scoped>
.pos__content__okbtn {
	border-radius: 24px;
	box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
	background-color: $primary-color;

	h2 {
		font-size: $normal-size;
		font-weight: bold;
		word-break: keep-all;
	}
	p {
		font-size: $small-up-size;
		word-break: keep-all;
	}
}
</style>

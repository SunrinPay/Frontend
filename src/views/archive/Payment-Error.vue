<template>
	<div class="paymenterror">
		<i class="iconify paymenterror__icon" data-icon="mdi-alert-circle-outline"></i>

		<div class="paymenterror__content">
			<h2>결제 요청이 만료되었습니다.</h2>
			<p>
				시간이 초과되어 결제 요청이 만료되었습니다.
				<br />결제를 다시 요청해주세요.
			</p>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
@Component
export default class PaymentError extends Vue {}
</script>

<style lang="scss" scoped>
.paymenterror {
	color: white;
	background-color: $primary-color;
	padding: 50px;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.paymenterror__icon {
		font-size: 15rem;
	}
	.paymenterror__content {
		margin-top: 40px;
		h2 {
			font-size: $large-size;
			text-align: center;
		}
		p {
			font-size: $normal-size;
			text-align: center;
		}
	}
}
@media all and (max-aspect-ratio: 4/3) {
	.paymenterror {
		.paymenterror__content {
			font-size: 0.9em;
			h2 {
				white-space: nowrap;
			}
			p {
				word-break: keep-all;
				br {
					display: none;
				}
			}
		}
	}
}
@media all and (max-aspect-ratio: 3/4) {
	.paymenterror {
		.paymenterror__content {
			font-size: 0.6em;
		}
	}
}
</style>

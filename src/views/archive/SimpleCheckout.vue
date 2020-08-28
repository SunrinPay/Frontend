<template>
	<div class="simplemode">
		<div class="simplemode__content">
			<p>결제하실 금액</p>
			<h2><NumberCounter text="25565" :isNumberFormat="true" defaultChar="0"></NumberCounter>원</h2>
		</div>
		<div class="simplemode__content2">
			<p>어떤 수단을 이용하시겠어요?</p>
		</div>
		<div class="simplemode__actions">
			<PaymentButton class="simplemode__actions__btn" @click="test"></PaymentButton>
			<PaymentButton class="simplemode__actions__btn" paymentName="Kakao Pay" @click="checkoutWithKakaoPay"></PaymentButton>
		</div>
	</div>
</template>

<script lang="ts">
import PaymentButton from "@/components/PaymentButton.vue";
import CashButton from "@/components/CashButton.vue";
import NumberCounter from "vue-roller";

import { Vue, Component } from "vue-property-decorator";
import isMobile from "../../lib/isMobile";

@Component({
	components: {
		PaymentButton,
		CashButton,
		NumberCounter,
	},
})
export default class SimpleCheckout extends Vue {
	test() {
		console.log("test");
		this.$store.dispatch("bindTodos");
		this.$store
			.dispatch("CHECKOUT", {
				idToken:
					"eyJhbGciOiJSUzI1NiIsImtpZCI6IjdkNTU0ZjBjMTJjNjQ3MGZiMTg1MmY3OWRiZjY0ZjhjODQzYmIxZDciLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiSHl1bndvbyBLaW0iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EtL0FPaDE0R2o5elBhN1JSSUMyN3FsQzBGQUdaSFBycHBBMnVDSEdDSE1EeVZBQ3ciLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc3VucmlucGF5IiwiYXVkIjoic3VucmlucGF5IiwiYXV0aF90aW1lIjoxNTkzMTMyNjE1LCJ1c2VyX2lkIjoiQWNRRnF0b1VlUWJBbklMcmxIUWZkbHFPeUZPMiIsInN1YiI6IkFjUUZxdG9VZVFiQW5JTHJsSFFmZGxxT3lGTzIiLCJpYXQiOjE1OTMxMzI2MTUsImV4cCI6MTU5MzEzNjIxNSwiZW1haWwiOiJyYXlraW0wNjIxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTA2MzY4OTYxNDk2NDgwMjk2NTMwIl0sImZhY2Vib29rLmNvbSI6WyIxMzcxNTE3MDAzMjM3MjEyIl0sImVtYWlsIjpbInJheWtpbTA2MjFAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.DD6Dmr2B0CUUZ9uXLFP_9T_kREaeKJrLx9JP2rxIlurAtlnDRuEc73giZ9okUecxABz2GHmOioy3P91iREhea6KJcf3YyOjKoknO-8H20aozkJaUML8Wn5gs_ScvMMaG0P_Q9UGX1N2wtbLM-SQgh7Sfrg-haulFmEiQoXdEs2shj3SIFVS8qJjG2Pye6VI-U0II7vVnfXgq-7UZIVRfSMgrS2Q1BX6pdON3Cv9FO-AJDVoOI5srxuCgIq1osGWFaU_puw1iZaQ7Vhd52t4X_65wGR0pVDVxyc7dxJiXvgJNWB6R_-JxI-egDk8rTVLavwS3bd5vkxsNAIC-qrXcbQ",
				price: 1000,
			})
			.then(res => console.log(res))
			.catch(err => console.log(err));
	}
	async checkoutWithKakaoPay() {
		let res = await this.$store.dispatch("CHECKOUT_KAKAOPAY", {
			item_name: "초코파이",
			quantity: 1,
			total_amount: 2200,
			vat_amount: 0,
			tax_free_amount: 0,
			price: 1000,
		});
		if (isMobile()) {
			// 모바일
			window.open(res.next_redirect_mobile_url);
		} else {
			window.open(res.next_redirect_pc_url);
		}
	}
}
</script>

<style lang="scss" scoped>
.simplemode {
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: center;
	.simplemode__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		p {
			font-size: $normal-size;
		}
		h2 {
			display: flex;
			align-items: center;
			font-size: $large-size;
		}
	}
	.simplemode__content2 {
		font-size: $normal-size;
	}
	.simplemode__actions {
		width: 90%;
		height: 300px;
		display: flex;

		margin-bottom: 50px;
		.simplemode__actions__btn {
			flex: 1;
			height: auto;
			margin: 0 40px;
		}
	}
}
@media all and (max-aspect-ratio: 1/1) {
	.simplemode {
		.simplemode__content {
			margin-top: 10%;
		}
		.simplemode__content2 {
			display: none;
		}
		.simplemode__actions {
			height: auto;
			flex-direction: column-reverse;

			margin-bottom: 30px;
			font-size: 0.9rem;
			.simplemode__actions__btn {
				height: 200px;
				margin: 0 20px;
				margin-top: 30px;
			}
		}
	}
}
</style>

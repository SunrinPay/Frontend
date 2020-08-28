<template>
	<div class="orderrequest">
		<QRcode class="orderrequest__qrcode" :data="link"></QRcode>
		<div class="orderrequest__content">
			<h2>Sunrin Pay 결제</h2>
			<p>
				QR 코드를 통해 접속하여,
				<br />결제를 진행해주세요.
			</p>
			<p class="orderrequest__content__expirationtime">
				<NumberCounter :text="String(getMinute)" defaultChar="0"></NumberCounter>:
				<NumberCounter :text="String(getSecond)" defaultChar="0"></NumberCounter>
			</p>
		</div>
		<div class="orderrequest__actions">
			<div class="orderrequest__actions__btn" @click="resetOrder">
				<i class="iconify" data-icon="mdi-close"></i>
				<p>취소하기</p>
			</div>
			<div class="orderrequest__actions__btn" @click="resetTimer">
				<i class="iconify" data-icon="mdi-timer-sand-full"></i>
				<p>시간 연장</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import QRcode from "@/components/QRcode.vue";
import NumberCounter from "vue-roller";
import { db } from "@/DB";

import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
	components: {
		QRcode,
		NumberCounter
	},
	firestore: {
		orders: db.collection("orders")
	}
})
export default class OrderRequest extends Vue {
	orders: any = [];
	time: number = 180;
	link: string = "";
	async created() {
		// let data = await this.$store.dispatch("GET_ORDER", {
		// 	orderID: this.getOrderID,
		// });
		this.link = `https://sunrinpay.com/checkout?orderID=${this.getOrderID}`;
	}
	mounted() {
		let countDown = setInterval(() => {
			this.time--;
			if (this.time <= 0) clearInterval(countDown);
		}, 1000);
	}

	@Watch("orders")
	onOrdersChanged(next: any[], prev: any[]) {
		let ifOrderExists = false;
		this.orders.forEach(doc => {
			if (doc.orderID == this.getOrderID) ifOrderExists = true;
		});
		if (!ifOrderExists)
			this.$router.replace({ name: "Order" }).catch(() => {});
	}

	get getSecond(): string {
		return String(
			this.time % 60 == 0 ? "0" + (this.time % 60) : this.time % 60
		);
	}
	get getMinute(): number {
		return Math.floor(this.time / 60);
	}
	get getOrderID(): string {
		return this.$route.query.orderID as string;
	}

	resetTimer() {
		this.time = 180;
	}
	async resetOrder() {
		await this.$store.dispatch("DELETE_ORDER", {
			orderID: this.getOrderID
		});
		this.$router.replace({ name: "Order" }).catch(() => {});
	}
}
</script>

<style lang="scss" scoped>
.orderrequest {
	color: white;
	background-color: $primary-color;

	display: flex;
	justify-content: center;
	align-items: center;

	padding: 20px;

	.orderrequest__qrcode {
		width: 100%;
		max-width: 400px;
	}
	.orderrequest__content {
		height: 400px;

		margin-left: 150px;

		display: flex;
		flex-direction: column;

		h2 {
			font-size: $large-size;
		}
		p {
			font-size: $normal-size;
			margin-top: 10px;
			white-space: nowrap;
		}
		p.orderrequest__content__expirationtime {
			flex: 1;

			display: flex;
			align-items: flex-end;

			font-size: $large-size;
			font-weight: bold;
		}
	}
	.orderrequest__actions {
		position: fixed;
		bottom: 0;
		left: 0;

		width: 100%;
		height: 200px;

		display: flex;
		justify-content: center;
		align-items: center;

		.orderrequest__actions__btn {
			cursor: pointer;

			padding: 10px;
			margin: 0 60px;

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			font-weight: bold;
			font-size: $small-size;
			i {
				margin-bottom: 5px;
				font-size: $small-normal-size;
			}
		}
	}
}
@media all and (max-aspect-ratio: 4/3) {
	.orderrequest {
		.orderrequest__qrcode {
			max-width: 350px;
		}
		.orderrequest__content {
			height: 350px;
			font-size: 0.8rem;
			margin-left: 50px;
		}
	}
}
@media all and (max-aspect-ratio: 1/1) {
	.orderrequest {
		overflow-y: auto !important;
		padding: 40px;

		flex-direction: column;
		justify-content: space-between;
		.orderrequest__qrcode {
			margin-top: 20px;
		}
		.orderrequest__content {
			height: fit-content;
			margin-left: 0;
			font-size: 0.7rem;

			h2,
			p {
				text-align: center;
			}
			p.orderrequest__content__expirationtime {
				flex: 0;
				justify-content: center;
			}
		}

		.orderrequest__actions {
			position: relative;
			height: auto;
			.orderrequest__actions__btn {
				margin: 0 10px;
			}
		}
	}
}
</style>

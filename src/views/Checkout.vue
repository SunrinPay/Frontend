<template>
	<div class="checkout">
		<div class="checkout__content">
			<ul class="checkout__content__prices">
				<div class="checkout__content__prices__item">
					<p>금액</p>
					<h2>
						<NumberCounter :text="String(originalPrice)" :isNumberFormat="true" defaultChar="0"></NumberCounter>원
					</h2>
				</div>
				<div class="checkout__content__prices__item">
					<p>할인된 금액</p>
					<h2>
						<NumberCounter :text="String(discountPrice)" :isNumberFormat="true" defaultChar="0"></NumberCounter>원
					</h2>
				</div>
				<div class="checkout__content__prices__item total">
					<p>결제하실 금액</p>
					<h2>
						<NumberCounter :text="String(totalPrice)" :isNumberFormat="true" defaultChar="0"></NumberCounter>원
					</h2>
				</div>
			</ul>
			<ul class="checkout__content__list">
				<li class="checkout__content__list__item" v-for="i in itemData" :key="i.name">
					<p class="name">{{ i.name }}</p>
					<p class="quantity">{{ i.quantity }}</p>
					<p class="price">
						{{ (Number(i.price) * ((100 - Number(i.discount || 0)) / 100)).numberFormat() }}
						<span
							v-if="i.discount"
						>(-{{ (Number(i.price) * (Number(i.discount || 0) / 100)).numberFormat() }})</span>
					</p>
				</li>
			</ul>
		</div>
		<div class="checkout__actions">
			<PaymentButton
				class="checkout__actions__btn"
				paymentName="Kakao Pay"
				@click="checkoutWithKakaoPay"
			></PaymentButton>
			<PaymentButton class="checkout__actions__btn" @click="checkout"></PaymentButton>
		</div>
		<p>{{ result }}</p>
	</div>
</template>

<script lang="ts">
import PaymentButton from "@/components/PaymentButton.vue";
import CashButton from "@/components/CashButton.vue";
import NumberCounter from "vue-roller";

import { Vue, Component } from "vue-property-decorator";

import isMobile from "@/lib/isMobile";
import { StockItem } from "../schema";

@Component({
	components: {
		PaymentButton,
		CashButton,
		NumberCounter
	}
})
export default class Checkout extends Vue {
	orderID: string = "";

	itemData: StockItem[] = [];
	originalPrice: number = 0;
	discountPrice: number = 0;
	totalPrice: number = 0;

	result: string = "";

	async created() {
		if (this.getOrderID) this.orderID = this.getOrderID;
		let orderData = await this.$store.dispatch("GET_ORDER", {
			orderID: this.orderID
		});
		this.itemData = orderData.itemData;
		console.log();

		this.originalPrice = this.itemData.reduce(
			(t, { price }) => t + Number(price),
			0
		);
		this.discountPrice = this.itemData.reduce(
			(t, { price, discount }) =>
				t + Number(price) * ((discount || 0) / 100),
			0
		);
		this.totalPrice = orderData.totalPrice;
	}

	get getOrderID(): string {
		return this.$route.query.orderID as string;
	}

	async checkout() {
		this.result = await this.$store.dispatch("CHECKOUT", {
			orderID: this.orderID
		});
		if (this.result) this.$router.replace("/");
	}

	async checkoutWithKakaoPay() {
		let res = await this.$store.dispatch("CHECKOUT_KAKAOPAY", {
			orderID: this.orderID
		});
		console.log(res);
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
.checkout {
	padding: 80px;
	display: flex;
	flex-direction: column;

	.checkout__content {
		flex: 1;
		display: flex;

		overflow-y: hidden;
		.checkout__content__prices {
			flex: 3;

			position: relative;

			display: flex;
			flex-direction: column;
			justify-content: space-between;

			&::after {
				content: "";
				position: absolute;
				right: 0;
				top: 5%;

				width: 1px;
				height: 90%;

				background-color: $gray-text-color;
			}
			.checkout__content__prices__item {
				color: $gray-text-color;
				p {
					font-size: $small-normal-size;
				}
				h2 {
					display: flex;
					align-items: center;
					font-size: $small-large-size;
				}
			}
			.checkout__content__prices__item.total {
				color: $text-color;
				p {
					font-size: $normal-size;
				}
				h2 {
					font-size: $large-size;
				}
			}
		}
		.checkout__content__list {
			flex: 7;
			margin-left: 20px;
			overflow-y: scroll;
			.checkout__content__list__item {
				font-size: $small-normal-size;
				width: 100%;

				padding: 10px;

				display: flex;
				justify-content: space-between;

				.name {
					flex: 5;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.quantity {
					flex: 1;
				}
				.price {
					flex: 4;
					text-align: right;
				}
				&:hover {
					background-color: $select-color;
				}
			}
		}
	}
	.checkout__actions {
		display: flex;
		height: 160px;

		margin-top: 80px;
		.checkout__actions__btn {
			flex: 1;
			height: 100%;
			&:nth-child(1) {
				margin-right: 100px;
			}
		}
	}
}
@media all and (max-aspect-ratio: 4/3) {
	.checkout {
		padding: 60px;
		.checkout__content {
			.checkout__content__prices {
				flex: 5;
			}
			.checkout__content__list {
				flex: 5;
				.checkout__content__list__item {
					font-size: 1rem;
				}
			}
		}
		.checkout__actions {
			font-size: 0.9rem;
			.checkout__actions__btn {
				&:nth-child(1) {
					margin-right: 20px;
				}
			}
		}
	}
}

@media all and (max-aspect-ratio: 1/1) {
	.checkout {
		.checkout__content {
			flex-direction: column-reverse;
			.checkout__content__prices {
				flex: 1;

				align-items: center;

				flex-direction: row;
				flex-wrap: wrap;

				&::after {
					display: none;
				}
				.checkout__content__prices__item {
					display: none;
				}
				.checkout__content__prices__item.total {
					display: flex;
					justify-content: space-between;
					align-items: center;
					p {
						font-size: $small-size;
					}
					h2 {
						font-size: $small-normal-size;
					}
					width: 100%;
					text-align: center;
				}
			}
			.checkout__content__list {
				margin-left: 0;
				margin-bottom: 20px;
			}
		}
		.checkout__actions {
			font-size: 0.75rem;
			.checkout__actions__btn {
				&:nth-child(1) {
					margin-right: 30px;
				}
			}
		}
	}
}
@media all and (max-aspect-ratio: 3/4) {
	.checkout {
		.checkout__actions {
			height: auto;
			flex-direction: column-reverse;
			margin-top: 30px;
			.checkout__actions__btn {
				padding: 10px 0;
				&:nth-child(1) {
					margin-right: 0;
					margin-top: 30px;
				}
			}
		}
	}
}
</style>

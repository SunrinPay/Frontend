<template>
	<div class="receipt">
		<div class="receipt__close" @click="close">
			<BackButton></BackButton>
		</div>
		<div class="receipt__wrap">
			<div class="receipt__title">
				<img src="https://firebasestorage.googleapis.com/v0/b/sunrinpay.appspot.com/o/ReceiptLogo.svg?alt=media&token=657c8dbc-1718-484a-a374-21daa7b396ca" class="receipt__title__image" />
				<div>
					<h1>{{ setting.name }}</h1>
					<p>{{ setting.address }}</p>
					<p>{{ setting.manager }} {{ setting.regNo }}</p>
				</div>
			</div>
			<hr />
			<div class="receipt__list">
				<div class="receipt__list__item" v-for="item in data.data" :key="item.name">
					<div>
						<p>{{ item.name }}</p>
					</div>
					<div class="price">
						<div class="quantity">
							<p>X{{ item.quantity }}</p>
							<p v-if="item.discount">할인 적용</p>
						</div>
						<div>
							<p class="line" v-if="item.discount">{{ item.quantity * item.price }}</p>
							<p>{{ item.quantity * item.price * ((100 - (item.discount || 0)) / 100) }}</p>
						</div>
					</div>
				</div>
			</div>
			<div class="receipt__total">
				<h3>{{ data.type == "충전" ? "충전 금액" : "결제 금액" }}</h3>
				<p>{{ data.type == "충전" ? "+" + Number(data.totalPrice).numberFormat() : Number(data.totalPrice).numberFormat() }}</p>
			</div>
			<hr />
			<div class="receipt__result">
				<p><img src="https://firebasestorage.googleapis.com/v0/b/sunrinpay.appspot.com/o/ReceiptLogo.svg?alt=media&token=657c8dbc-1718-484a-a374-21daa7b396ca" /> 결제 내역</p>
				<p>
					{{ getUser.displayName }}({{ getUser.email }}) <br />{{
						data.type == "충전" ? "Sunrin Pay 지갑에 잔액 추가됨" : data.type == "일반 결제" ? "Sunrin Pay 지갑으로 지불함" : "카카오페이를 통해 결제됨"
					}}
				</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import BackButton from "../BackButton.vue";
import { db } from "@/DB";

import { Vue, Component, Watch, Prop } from "vue-property-decorator";

@Component({
	components: {
		BackButton,
	},
	firestore: {
		setting: db.collection("settings").doc("settings"),
	},
})
export default class Receipt extends Vue {
	setting: object = {};

	@Watch("setting")
	onSettingChanged(next: any[], prev: any[]) {}

	@Prop({ type: Object }) data: any;
	list = [
		{ name: "할인가", price: 10000, discount: 10, quantity: 3 },
		{ name: "정가", price: 10000, discount: 0, quantity: 3 },
	];
	get getUser() {
		return this.$store.state.userInformation;
	}

	close() {
		this.$emit("close", false);
	}
}
</script>

<style lang="scss" scoped>
.receipt {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;

	background-color: $content-color;

	display: flex;
	justify-content: center;

	padding: 20px;

	.receipt__close {
		position: fixed;
		right: 20px;
		bottom: 20px;
	}

	.receipt__wrap {
		width: 100%;
		max-width: 720px;
	}
	.receipt__title {
		display: flex;
		.receipt__title__image {
			width: 100px;
		}
		div {
			padding: 20px;
			h1 {
				font-size: $small-normal-size;
			}
		}
	}
	.receipt__list {
		display: flex;
		flex-direction: column;

		width: 100%;
		.receipt__list__item {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			margin-top: 20px;

			div {
				display: flex;
				flex-direction: column;
			}
			div:nth-child(1){
				flex: 1;
			}
			div:nth-child(2),
			div:nth-child(3) {
				text-align: right;

				p {
					display: flex;
					align-items: center;
					justify-content: flex-end;

					height: 100%;
					&.line {
						text-decoration: line-through;
					}
				}

				p:nth-child(2) {
					font-weight: bold;
				}
			}
			.quantity p {
				justify-content: center !important;
			}
			.price {
				flex: 2;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}
		}
	}
	.receipt__total {
		padding: 30px 0;
		display: flex;
		justify-content: space-between;

		font-weight: bold;
		h3 {
			font-size: $small-up-size;
		}
		p {
			font-size: $small-up-size;
		}
	}
	.receipt__result {
		margin-top: 10px;
		p:nth-child(1) {
			padding: 20px 0;
			img {
				height: 1.5em;
			}
			display: flex;
			align-items: center;
		}
	}
}
</style>

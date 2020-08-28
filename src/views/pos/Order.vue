<template>
	<div class="order">
		<div class="order__viewpager">
			<ViewPager :tab="['바코드', '상품 목록', '직접 입력']">
				<template v-slot:tab0>
					<div class="order__viewpager__barcodescanner">
						<BarcodeScanner :onDetected="onDetected"></BarcodeScanner>
					</div>
				</template>
				<template v-slot:tab1>
					<StockList :data="list" @add-item="appendSelectedItem"></StockList>
				</template>
				<template v-slot:tab2>
					<div class="order__viewpager__numpad">
						<div class="order__viewpager__numpad__total">
							<p>결제 요청 금액</p>
							<h2>
								<NumberCounter :text="getTotal" :isNumberFormat="true" defaultChar="0"></NumberCounter>
							</h2>
						</div>
						<div class="order__viewpager__numpad__hr"></div>
						<div class="order__viewpager__numpad__content">
							<div v-for="idx in 9" :key="idx" class="order__viewpager__numpad__content__item" @click="appendTotalStr(idx)">{{ idx }}</div>
							<div class="order__viewpager__numpad__content__item"></div>
							<div class="order__viewpager__numpad__content__item" @click="appendTotalStr(0)">0</div>
							<div class="order__viewpager__numpad__content__item">
								<span @click="removeTotalStr">
									<i class="iconify" data-icon="mdi-backspace"></i>
								</span>
							</div>
							<button @click="insert" class="input__price">입력</button>
						</div>
					</div>
				</template>
			</ViewPager>
		</div>
		<div class="order__content">
			<ul class="order__content__list">
				<li class="order__content__list__item" v-for="item in selectedList" :key="item.name">
					<p class="name">{{ item.name }}</p>
					<div v-if="item.barcode" class="count">
						<button class="count__action count__action__minous" @click="minousItemCount(item)">-</button>
						<p>×{{ item.quantity }}</p>
						<button class="count__action count__action__plus" @click="plusItemCount(item)">+</button>
					</div>
					<p class="price">
						{{ (Number(item.price) * ((100 - Number(item.discount || 0)) / 100)).numberFormat() }}
						<span v-if="item.discount">(-{{ (Number(item.price) * (Number(item.discount || 0) / 100)).numberFormat() }})</span>
					</p>
					<span class="delete" @click="removeSelectItem(item)">
						<i class="iconify" data-icon="mdi-delete-forever"></i>
					</span>
				</li>
			</ul>
			<PaymentRequireButton @click="createOrder"></PaymentRequireButton>
		</div>
	</div>
</template>

<script lang="ts">
// import randomWords from "random-words";
import ViewPager from "../../components/ViewPager.vue";
import BarcodeScanner from "../../components/BarcodeScanner.vue";
import StockList from "../../components/StockList.vue";
import { StockItem } from "../../schema";
import PaymentRequireButton from "../../components/PaymentRequireButton.vue";
import NumberCounter from "vue-roller";

import { Vue, Component, Watch, Prop } from "vue-property-decorator";

import { db } from "@/DB";
import createRandomNumber from "../../lib/createRandomNumber";

@Component({
	components: {
		ViewPager,
		BarcodeScanner,
		StockList,
		PaymentRequireButton,
		NumberCounter,
	},
	firestore: {
		list: db.collection("stock"),
	},
})
export default class Order extends Vue {
	// 테스트 데이터 (상품 목록)
	list: StockItem[] = [];
	// 선택된 목록
	selectedList: StockItem[] = [];
	// 현 스크롤 위치 (터치 전용)
	currentConsonant: string = "";

	totalString: string = "";

	orderID: string = "";

	@Watch("list")
	onListChanged(next: any[], prev: any[]) {}

	appendSelectedItem(item: StockItem) {
		let idx = this.selectedList.findIndex(i => i.name == item.name);
		if (item.quantity > 0) {
			item.quantity--;

			if (idx == -1) {
				let copyObject = Object.assign({}, item);
				copyObject.quantity = 1;
				this.selectedList.push(copyObject);
			} else {
				this.selectedList[idx].quantity++;
			}
		}
	}
	removeSelectItem(item: StockItem) {
		let idx = this.selectedList.findIndex(i => i.name == item.name);
		this.list.find(i => i.name == this.selectedList[idx].name)!.quantity += item.quantity;
		this.selectedList.splice(idx, 1);
	}
	onDetected(result: string) {
		let idx = this.list.findIndex(item => item.barcode == result);
		if (idx != -1) {
			let beep = new Audio("https://firebasestorage.googleapis.com/v0/b/sunrinpay.appspot.com/o/beep.mp3?alt=media&token=935710df-2dce-4af9-bd4c-bcbfc425533d");
			beep.play();
			this.appendSelectedItem(this.list[idx]);
		}
	}

	plusItemCount(item: StockItem) {
		let idx = this.list.findIndex(i => i.name == item.name);
		let original = this.list[idx];
		if (original.quantity > 0) {
			original.quantity--;
			item.quantity++;
		}
	}
	minousItemCount(item: StockItem) {
		let idx = this.list.findIndex(i => i.name == item.name);
		let original = this.list[idx];
		original.quantity++;
		item.quantity--;
		if (item.quantity <= 0) this.removeSelectItem(item);
	}

	get getTotal() {
		return this.totalString;
	}
	appendTotalStr(str: string | number) {
		this.totalString = this.totalString + str;
	}
	removeTotalStr() {
		this.totalString = this.totalString.substring(0, this.totalString.length - 1);
	}
	insert() {
		let customPrice = Number(this.totalString);
		this.selectedList.push({
			name: `[${customPrice}원]`,
			price: customPrice,
			quantity: 1,
			discount: 0,
			barcode: "",
		});
		this.totalString = "0";
	}

	get calculateTotalPrice(): number {
		return this.selectedList.reduce((t, { price, discount }) => {
			discount = discount || 0;
			return t + Number(price) * ((100 - Number(discount)) / 100);
		}, 0);
	}

	async createOrder() {
		this.orderID = createRandomNumber();
		await this.$store.dispatch("CREATE_ORDER", {
			orderID: this.orderID,
			itemData: this.selectedList,
			totalPrice: this.calculateTotalPrice,
		});
		this.$router.push({
			name: "OrderRequest",
			query: {
				orderID: this.orderID,
			},
		});
	}
}
</script>

<style lang="scss" scoped>
.input__price {
	margin-top: 25px;
	width: 100%;
}

.order {
	display: flex;

	flex-direction: row;
	.order__viewpager {
		flex: 1 1 50%;
		color: white;

		.order__viewpager__barcodescanner {
			display: flex;
			justify-content: center;
			align-items: center;

			width: 100%;
			height: 100%;
			overflow: hidden;
		}

		.order__viewpager__numpad {
			padding: 50px 60px;
			width: 100%;
			height: 100%;
			background-color: $content-color;
			box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.order__viewpager__numpad__total {
				display: flex;
				justify-content: space-between;
				align-items: center;

				width: 100%;

				padding-bottom: 20px;

				p {
					font-size: $normal-size;
				}
				h2 {
					display: flex;
					align-items: center;
					font-size: $large-size;
				}
			}
			.order__viewpager__numpad__hr {
				width: 90%;
				height: 1px;

				background-color: $text-color;
				margin: 0 auto;
			}
			.order__viewpager__numpad__content {
				width: 100%;
				max-width: 50%;

				margin: 0 auto;
				margin-top: 40px;

				display: flex;
				flex-wrap: wrap;

				.order__viewpager__numpad__content__item {
					flex: 1 33%;
					width: 1.5em;
					height: 1.5em;

					display: flex;
					justify-content: center;
					align-items: center;

					font-size: $large-size;

					cursor: pointer;
					i {
						font-size: 0.7em;
						color: $gray-text-color;
					}
				}
			}
		}
	}
	.order__content {
		flex: 1 1 50%;

		display: flex;
		flex-direction: column;

		overflow-y: scroll;

		padding: 50px;
		box-sizing: border-box !important;
		.order__content__list {
			flex: 1;
			overflow-y: auto;
			margin-bottom: 50px;
			.order__content__list__item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: $small-up-size;

				padding: 10px;

				.name {
					flex: 5;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
				.count {
					flex: 1;

					display: flex;
					justify-content: center;
					align-items: center;

					.count__action {
						display: flex;
						justify-content: center;
						align-items: center;
						background-color: rgba(88, 88, 88, 0.25);
						border-radius: 50%;
					}
					.count__action__plus {
						width: 50px;
						height: 50px;

						margin-left: 20px;
					}
					.count__action__minous {
						width: 50px;
						height: 50px;

						margin-right: 20px;
					}
				}
				.price {
					flex: 3;
					text-align: right;
				}
				.delete {
					cursor: pointer;

					display: flex;
					justify-content: center;
					align-items: center;

					color: red;
					font-size: 1.1em;

					margin-left: 20px;
				}
			}
		}
	}
}
</style>

<template>
	<div class="stockmanagement">
		<div class="stockmanagement__stocklist">
			<StockList :data="list" @add-item="selectItem" :highlight="selectedItem"></StockList>
			<button class="stockmanagement__stocklist__addbtn" @click="toggleCreateStock">+</button>
		</div>
		<div class="stockmanagement__stockedit" v-if="selectedItem">
			<h3 class="stockmanagement__stockedit__title">
				상품 정보 업데이트
				<i class="iconify cube" data-icon="mdi-cube-outline"></i>
			</h3>
			<h2 class="stockmanagement__stockedit__name">
				<input type="text" class="editable name" v-model="selectedItem.name" ref="name" @change="updateItem('name')" />
				<i class="iconify multiply" data-icon="mdi-close"></i>
				<input type="text" class="editable quantity" v-model="selectedItem.quantity" ref="quantity" @change="updateItem('quantity')" />
			</h2>
			<div class="stockmanagement__stockedit__barcode">
				<h3>
					바코드
					<i class="iconify" data-icon="mdi-barcode"></i>
				</h3>

				<div>
					<input type="text" class="editable" v-model="selectedItem.barcode" ref="barcode" @change="updateItem('barcode')" />
					<button @click="toggleBarcodeScanner">
						<i class="iconify" data-icon="mdi-barcode-scan"></i>
					</button>
				</div>
			</div>
			<div class="stockmanagement__stockedit__flex">
				<div>
					<h3>
						단가
						<i class="iconify" data-icon="mdi-currency-krw"></i>
					</h3>
					<input type="text" class="editable" v-model="selectedItem.price" ref="price" @change="updateItem('price')" />원
				</div>
				<div>
					<h3>
						할인율
						<i class="iconify" data-icon="mdi-sale"></i>
					</h3>
					<input type="text" class="editable" v-model="selectedItem.discount" ref="discount" max="100" min="0" @change="updateItem('discount')" />%
				</div>
				<div>
					<h3>판매가</h3>
					<span>{{ (selectedItem.price * ((100 - Number(selectedItem.discount || 0)) / 100)).numberFormat() }}원</span>
				</div>
			</div>
			<SalesChart></SalesChart>
		</div>
		<BarcodeScannerIntent v-if="isShowBarcodeScanner" :onDetected="onDetected"></BarcodeScannerIntent>
		<CreateStock v-if="isShowCreateStock" @close="toggleCreateStock" @submit="addItem"></CreateStock>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import SalesChart from "../../components/SalesChart.vue";

import { db } from "@/DB";
import { StockItem } from "../../schema";
import BarcodeScannerIntent from "../../components/intent/BarcodeScannerIntent.vue";
import StockList from "../../components/StockList.vue";
import CreateStock from "../../components/intent/CreateStockIntent.vue";

@Component({
	components: {
		StockList,
		SalesChart,
		BarcodeScannerIntent,
		CreateStock,
	},
	firestore: {
		list: db.collection("stock"),
	},
})
export default class StockManagement extends Vue {
	list: StockItem[] = [];
	selectedItem: StockItem | null = null;
	isShowBarcodeScanner: boolean = false;
	isShowCreateStock: boolean = false;

	@Watch("list")
	onListChanged(next: any[], prev: any[]) {
		if (this.selectedItem === null) this.selectedItem = this.list[0];
	}

	toggleCreateStock() {
		this.isShowCreateStock = !this.isShowCreateStock;
	}
	toggleBarcodeScanner() {
		this.isShowBarcodeScanner = !this.isShowBarcodeScanner;
	}
	onDetected(barcode: string) {
		console.log(barcode);
		this.isShowBarcodeScanner = false;
		this.selectedItem!.barcode = barcode;
	}
	selectItem(item: StockItem) {
		this.selectedItem = item;
	}
	async addItem(preData: { name: string }) {
		this.isShowCreateStock = false;
		let data = await db.collection("stock").add({
			name: preData.name,
			barcode: "",
			quantity: 1,
			price: 1000,
			discount: 0,
		});
		this.selectedItem = this.list[this.list.findIndex((item) => item.id == data.id)];
	}
	async updateItem(_key: string) {
		let result = await this.$store.dispatch("UPDATE_ITEM", {
			item: this.selectedItem,
			key: _key,
		});
		if (result) {
			let el: any = this.$refs[_key];
			el.classList.add("update__success");
			setTimeout(() => el.classList.remove("update__success"), 1000);
		} else {
			let el: any = this.$refs[_key];
			el.classList.add("update__error");
		}
	}
}
</script>

<style lang="scss">
.stockmanagement {
	display: flex;
	.stockmanagement__stocklist {
		flex: 1 1 50%;
		max-width: 50%;

		position: relative;

		.stockmanagement__stocklist__addbtn {
			position: absolute;
			right: 20px;
			bottom: 20px;

			width: $small-large-size;
			height: $small-large-size;

			display: flex;
			justify-content: center;
			align-items: center;

			border-radius: 50%;
			box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.2);
			background-color: #ff53a3;

			font-size: $small-normal-size;

			z-index: 100;
		}
	}
	.stockmanagement__stockedit {
		flex: 1 1 50%;
		padding: 50px;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		input {
			transition-duration: 0.3s;
		}
		h3 {
			font-size: $small-size;
			color: $gray-text-color;
			font-weight: normal !important;
		}
		.update__success {
			background-color: rgba(60, 134, 123, 0.5);
		}
		.update__error {
			background-color: rgba(194, 40, 28, 0.5);
		}
		.stockmanagement__stockedit__title {
			font-weight: bold;
		}
		.stockmanagement__stockedit__name {
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: $small-normal-size;
			width: 100%;
			.cube {
				flex: 1.5;
			}
			input {
				width: 100%;
			}
			.name {
				flex: 8;
			}
			.multiply {
				flex: 1;
				margin-bottom: 3px;
				align-self: flex-end;
			}
			.quantity {
				flex: 2;
			}
		}
		.stockmanagement__stockedit__barcode {
			div {
				display: flex;
			}
			input {
				font-size: $small-normal-size;
				flex: 11;
			}
			button {
				flex: 1;
				padding: 10px 20px;
			}
		}
		.stockmanagement__stockedit__flex {
			display: flex;

			div {
				flex: 1;
				span {
					font-weight: bold;
					font-size: $small-normal-size;
				}
				input {
					font-weight: bold;
					font-size: $small-normal-size;
					width: 60%;
				}
			}
		}
	}
}
</style>

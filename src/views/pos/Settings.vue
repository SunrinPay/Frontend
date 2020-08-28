<template>
	<div class="setting">
		<div class="setting__content">
			<div class="setting__content__v">
				<div class="setting__content__title">
					<div>
						<h2>
							<input class="editable" type="text" value="선린인터넷고등학교 매점" ref="name" v-model="setting.name" placeholder="점포명" @change="update('name')" />
						</h2>
						<p>
							<input class="editable" type="text" value="서울특별시 용산구 원효로97길 33-4" ref="address" v-model="setting.address" placeholder="주소" @change="update('address')" />
						</p>
					</div>
					<div>
						<i class="iconify" data-icon="mdi-edit"></i>
					</div>
				</div>
				<div class="setting__content__map">
					<img src="https://firebasestorage.googleapis.com/v0/b/sunrinpay.appspot.com/o/map.png?alt=media&token=ab11fd7f-edc9-4760-b6e7-fb74f100583c" alt="map" draggable="false" />
				</div>
				<h3>영업 시간</h3>

				<div class="setting__content__time" ref="operationHours">
					<p v-for="(item, idx) in setting.operationHours" :key="idx">
						<input type="text" v-model="item.range" placeholder="요일" @change="update('operationHours')" />
						<input type="text" v-model="item.time" placeholder="시간대" @change="update('operationHours')" />
						<span @click="removeTimesetItem(idx)" class="remove">
							<i class="iconify" data-icon="mdi-delete"></i>
						</span>
					</p>
					<p class="add" @click="addTimesetItem">+ 영업 시간 추가하기</p>
				</div>
			</div>
			<div class="setting__content__v">
				<h3>사업자 정보</h3>
				<div class="setting__content__account">
					<div>
						<h2>
							<input class="editable" type="text" ref="manager" v-model="setting.manager" placeholder="대표자명" @change="update('manager')" />
							<input class="editable" type="text" ref="regNo" v-model="setting.regNo" placeholder="사업자등록번호" @change="update('regNo')" />
						</h2>
					</div>
				</div>
				<h3>재고 관리 모드</h3>
				<div class="setting__content__stock">
					<label>
						<input type="radio" name="stock" value="detailed" v-model="setting.mode" />
						<span></span>
						<div class="content">
							<h4>상세 모드 (기본)</h4>
							<p>바코드를 인식시켜 제품을 계산할 수 있고, 재고와 매출 관리가 동시에 가능합니다.</p>
						</div>
					</label>
					<label>
						<input type="radio" name="stock" value="simple" v-model="setting.mode" />
						<span></span>
						<div class="content">
							<h4>간편 모드</h4>
							<p>가격만 입력하면 바로 결제가 가능해 빠르고 편리합니다. 재고 관리 메뉴가 비활성화됩니다.</p>
						</div>
					</label>
				</div>
				<h3>결제 수단</h3>
				<div class="setting__content__pay">
					<label>
						<input type="radio" name="payment" value="sunrinpay" checked disabled />
						<span></span>
						<div class="content">
							<h4>Sunrin Pay</h4>
							<p>빠르고 편리한 Sunrin Pay를 이용합니다. 카카오페이와 호환됩니다.</p>
						</div>
					</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { db } from "@/DB";

import { Vue, Component, Watch } from "vue-property-decorator";

@Component({
	firestore: {
		setting: db.collection("settings").doc("settings"),
	},
})
export default class Setting extends Vue {
	setting: any = {};
	// name: string = "";
	// address: string = "";
	// regNo: string = "";

	// mode: string = "detailed";
	// operationHours: { range: string; time: string }[] = [];

	@Watch("setting")
	onSettingChanged(next: any[], prev: any[]) {}
	@Watch("mode")
	changeMode() {
		this.update("mode");
	}
	@Watch("operationHours")
	changeTimeset() {
		this.update("operationHours");
	}
	async created() {
		this.setting = await this.$store.dispatch("GET_SETTING");
		// this.name = data.name;
		// this.address = data.address;
		// this.mode = data.mode;
		// this.timeset = data.timeset;
	}
	async update(_key: string) {
		let result = await this.$store.dispatch("UPDATE_SETTING", {
			key: _key,
			value: this.setting[_key],
		});
		if (result) {
			let el: any = this.$refs[_key];
			if (el) {
				el.classList.add("update__success");
				setTimeout(() => el.classList.remove("update__success"), 1000);
			}
		}
	}

	addTimesetItem() {
		this.setting.operationHours.push({
			range: "",
			time: "",
		});
		this.update("operationHours");
	}
	removeTimesetItem(idx: number) {
		this.setting.operationHours.splice(idx, 1);
		this.update("operationHours");
	}
}
</script>

<style lang="scss" scoped>
.update__success {
	background-color: rgba(60, 134, 123, 0.5) !important;
}
.update__error {
	background-color: rgba(194, 40, 28, 0.5) !important;
}
input {
	transition-duration: 0.3s;
}
.setting {
	padding: 30px;
	.setting__content {
		padding: 40px;
		width: 100%;
		height: 100%;

		background-color: $content-color;

		border-radius: 24px;
		box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

		display: flex;
		h3 {
			font-size: $small-size;
			color: $gray-text-color;
			margin-bottom: 20px;
		}
		label {
			display: flex;
			align-items: center;
			margin-bottom: 20px;

			span {
				margin-right: 10px;
			}
			.content {
				font-size: $small-up-size;
				h4 {
				}
				p {
					font-size: 0.6em;
				}
			}
		}
		.setting__content__v {
			flex: 1;
			&:nth-child(1) {
				margin-right: 30px;
			}
		}
		.setting__content__title {
			display: flex;
			justify-content: space-between;
			align-items: center;
			h2 {
				font-size: $small-normal-size;
			}
		}
		.setting__content__map {
			img {
				// height: 300px;
				max-width: 80%;
			}
		}
		.setting__content__time {
			transition-duration: 0.3s;
			p {
				display: flex;
				justify-content: space-between;

				border-bottom: 1px solid $gray-text-color;
				padding: 10px 0;

				font-size: $small-up-size;
			}
			.remove {
				cursor: pointer;
			}
			.add {
				color: $gray-text-color;
				cursor: pointer;
			}

			input {
				border-bottom: none;
			}
		}
		.setting__content__account {
			display: flex;
			align-items: center;
			h2 {
				font-size: $small-normal-size;
			}
			p {
			}
			.qr {
				height: 100px;
				margin-right: 20px;
			}
			margin-bottom: 40px;
		}
		.setting__content__stock {
			margin-bottom: 40px;
		}
		.setting__content__pay {
		}
	}
}
</style>

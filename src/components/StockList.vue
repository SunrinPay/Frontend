<template>
	<div class="stocklist">
		<div class="stocklist__search">
			<i class="iconify stocklist__search__icon" data-icon="mdi-search"></i>
			<input type="search" class="stocklist__search__input" placeholder="검색" v-model="searchString" />
		</div>
		<div class="stocklist__list__wrapper" ref="searchList">
			<div class="stocklist__list" ref="searchList__scroll">
				<ul v-for="fl in getFilterList" :key="fl.consonant" :ref="`searchItem_${fl.consonant}`">
					<h2>{{ fl.consonant }}</h2>
					<li
						class="stocklist__list__item"
						:class="{ active: getHighlightId == item.id }"
						v-for="(item, idx) in fl.list"
						:key="item.name + idx"
						@click="addItem(item)"
					>
						<div>
							<h3>{{ item.name }}</h3>
							<p>{{ item.quantity }}개 남음</p>
						</div>
						<div>
							<h4>{{ Number(item.price).numberFormat() }}원</h4>
						</div>
					</li>
				</ul>
				<div
					class="stocklist__tip"
					ref="search_tip"
					@touchmove="touchSearchTip"
					@touchend="currentConsonant = ''"
				>
					<span
						v-for="consonant in getConsonantList"
						:key="consonant"
						@click="moveScroll(consonant)"
					>{{ consonant }}</span>
				</div>
				<div class="stocklist__tiptext" v-if="currentConsonant">{{ currentConsonant }}</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { PropType } from "vue";
import { StockItem } from "../schema";

interface FilterConsonantItem {
	consonant: string;
	list: StockItem[];
}
@Component
export default class StockList extends Vue {
	currentConsonant: string = "";
	searchString: string = "";
	@Prop({ type: Array as PropType<StockItem[]> }) data:
		| StockItem[]
		| undefined;
	@Prop({ type: Object as PropType<StockItem> }) highlight:
		| StockItem
		| undefined;
	get getFilterList(): FilterConsonantItem[] {
		let result: FilterConsonantItem[] = [];
		this.data!.filter(item => {
			return item.name.indexOf(this.searchString) != -1;
		}).forEach(item => {
			let consonant = this.getConsonant(item.name);
			let idx = result.findIndex(item => item.consonant == consonant);
			if (idx == -1) {
				result.push({
					consonant: consonant,
					list: [item]
				});
			} else {
				result[idx].list.push(item);
			}
		});
		return result.sort((a, b) =>
			a.consonant < b.consonant ? -1 : a.consonant > b.consonant ? 1 : 0
		);
	}

	get getConsonantList(): string[] {
		return this.getFilterList.map(item => item.consonant);
	}
	get getHighlightId(): string {
		return this.highlight ? this.highlight.id! : "";
	}

	getConsonant(word: string): string {
		if (word) {
			const f: string[] = [
				"ㄱ",
				"ㄲ",
				"ㄴ",
				"ㄷ",
				"ㄸ",
				"ㄹ",
				"ㅁ",
				"ㅂ",
				"ㅃ",
				"ㅅ",
				"ㅆ",
				"ㅇ",
				"ㅈ",
				"ㅉ",
				"ㅊ",
				"ㅋ",
				"ㅌ",
				"ㅍ",
				"ㅎ"
			];
			let uni: number = word.charCodeAt(0) - 44032;
			let fn: number = Math.floor(uni / 588);
			return f[fn] || word[0].toUpperCase();
		} else {
			return "-";
		}
	}
	touchSearchTip(e: TouchEvent) {
		let el: HTMLDivElement = this.$refs.search_tip as HTMLDivElement;
		let height = el.clientHeight + 20;

		let y = e.touches[0].clientY - el.getBoundingClientRect().y;

		let idx = Math.floor(y / (height / this.getConsonantList.length));

		if (idx >= 0 && idx < this.getConsonantList.length) {
			this.currentConsonant = this.getConsonantList[idx];
			this.moveScroll(this.getConsonantList[idx]);
		}
	}
	moveScroll(consonant: string) {
		let searchList: HTMLElement = this.$refs
			.searchList__scroll as HTMLElement;
		let el: HTMLElement = this.$refs[
			`searchItem_${consonant}`
		][0] as HTMLElement;
		if (searchList && el) {
			searchList.scrollTo(0, el.offsetTop);
		}
	}
	addItem(item: StockItem) {
		this.$emit("add-item", item);
	}
}
</script>

<style lang="scss" scoped>
.stocklist {
	width: 100%;
	height: 100%;

	position: relative;

	display: flex;
	flex-direction: column;
	overflow: hidden;

	background-color: $primary-color;

	.stocklist__search {
		display: flex;
		align-items: center;

		padding: 10px 20px;

		background-color: rgba(42, 117, 255, 0.55);

		.stocklist__search__icon {
			font-size: 3em;
			padding: 10px;
		}
		.stocklist__search__input {
			flex: 1;
			background: none;
			border: none;
			outline: none;
			color: white;

			font-size: $small-up-size;

			&::placeholder {
				color: white;
				opacity: 0.5;
			}
		}
	}
	.stocklist__list__wrapper {
		position: relative;
		flex: 1;
		width: 100%;
		overflow: hidden;
	}
	.stocklist__list {
		padding: 30px 50px;

		height: 100%;

		overflow-y: auto;

		/* scroll-behavior: smooth; */
		&::-webkit-scrollbar {
			display: none;
		}
		h2 {
			margin: 20px 0;

			&:first-child {
				margin-top: 0;
			}
		}
		h2,
		h3 {
			font-size: $small-normal-size;
		}
		h4 {
			font-size: $small-up-size;
		}

		.stocklist__list__item {
			display: flex;
			justify-content: space-between;
			align-items: center;

			padding: 15px 30px;

			border-radius: 24px;
			box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

			background-color: white;
			color: black;

			cursor: pointer;
			margin-bottom: 20px;

			transition: 0.2s;
			&.active {
				background-color: $primary-color;
				color: white;
			}
		}
	}
	.stocklist__tip {
		position: absolute;
		top: 20px;
		left: 20px;

		padding: 20px 0;

		width: 20px;
		height: calc(100% - 40px);

		border-radius: 16px;
		background-color: rgba(0, 0, 0, 0.15);

		display: flex;
		align-items: center;
		flex-direction: column;

		z-index: 50;

		span {
			width: 100%;
			font-size: 0.7em;
			flex: 1;

			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	.stocklist__tiptext {
		position: absolute;
		left: 50%;
		top: 50%;

		display: flex;
		justify-content: center;
		align-items: center;

		width: 1.5em;
		height: 1.5em;

		transform: translateX(-50%) translateY(-50%);
		background-color: rgba(0, 0, 0, 0.15);

		font-size: $large-size;

		z-index: 50;
	}
}
</style>

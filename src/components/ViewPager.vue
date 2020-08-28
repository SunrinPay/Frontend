<template>
	<div class="viewpager">
		<ul class="viewpager__tabhost">
			<li
				class="viewpager__tabhost__item"
				:class="{ selected: idx == selectedIdx }"
				v-for="(tab, idx) in tab"
				@click="selectIdx(idx)"
				:key="tab"
			>
				{{ tab }}
			</li>
			<div
				class="viewpager__tabhost__bar"
				:class="{ 'no-transition': isMoveStarted }"
				:style="{
					width: `${100 / tab.length}%`,
					left: `calc(${(100 / tab.length) *
						selectedIdx}% + ${movePosition / tab.length}px)`,
				}"
			></div>
		</ul>
		<div
			class="viewpager__fragments__wrapper"
			@mousedown="moveStart"
			@touchstart="moveStart"
			@mousemove="moveUpdate"
			@touchmove="moveUpdate"
			@mouseup="moveStop"
			@mouseout="moveForceStop"
			@touchend="moveStop"
		>
			<ul
				class="viewpager__fragments"
				:class="{ 'no-transition': isMoveStarted }"
				:style="{
					width: `${tab.length * 100}%`,
					left: `calc(-${selectedIdx * 100}% - ${movePosition}px)`,
				}"
			>
				<li
					class="viewpager__fragments__content"
					v-for="(tab, idx) in tab"
					:key="tab"
				>
					<slot :name="`tab${idx}`"></slot>
				</li>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component
export default class PaymentClear extends Vue {
	@Prop({ default: ["TAB"] }) readonly tab: string[] | undefined;

	selectedIdx: number = 0;
	isMoveStarted: boolean = false;
	mouseStartPostiionX: number = 0;
	mouseStartPostiionY: number = 0;
	mouseEndPositionX: number = 0;
	mouseEndPositionY: number = 0;
	movePosition: number = 0;

	selectIdx(idx): void {
		this.selectedIdx = idx;
	}
	moveStart(e: TouchEvent | MouseEvent) {
		let x = 0;
		let y = 0;
		if (e instanceof TouchEvent) {
			x = e.touches[0].clientX;
			y = e.touches[0].clientY;
		} else {
			x = e.x;
			y = e.y;
		}
		this.mouseStartPostiionX = x;
		this.mouseStartPostiionY = y;
		this.mouseEndPositionX = x;
		this.mouseEndPositionY = y;
		this.isMoveStarted = true;
	}
	moveUpdate(e: TouchEvent | MouseEvent) {
		if (this.isMoveStarted) {
			let x = 0;
			let y = 0;
			if (e instanceof TouchEvent) {
				x = e.touches[0].clientX;
				y = e.touches[0].clientY;
			} else {
				x = e.x;
				y = e.y;
			}
			if (
				(Math.abs(this.mouseStartPostiionY - y) < 100 &&
					Math.abs(this.mouseStartPostiionX - x) > 50) ||
				e instanceof MouseEvent
			)
				this.movePosition = this.mouseStartPostiionX - x;
			else this.movePosition = 0;
			this.mouseEndPositionX = x;
			this.mouseEndPositionY = y;
		}
	}
	moveForceStop() {
		if (this.isMoveStarted) {
			this.mouseStartPostiionX = 0;
			this.mouseStartPostiionY = 0;
			this.mouseEndPositionX = 0;
			this.movePosition = 0;
			this.isMoveStarted = false;
		}
	}
	moveStop(e: TouchEvent | MouseEvent) {
		if (this.isMoveStarted) {
			let gapX = 0;
			let gapY = 0;
			if (e instanceof TouchEvent) {
				gapX = this.mouseStartPostiionX - this.mouseEndPositionX;
				gapY = this.mouseStartPostiionY - this.mouseEndPositionY;
			} else {
				gapX = this.mouseStartPostiionX - e.x;
				// gapY = this.mouseStartPostiionY - e.y;
			}
			if (
				gapX > 100 &&
				gapY < 100 &&
				this.tab!.length - 1 > this.selectedIdx
			)
				this.selectedIdx++;
			if (gapX < -100 && gapY < 100 && 0 < this.selectedIdx)
				this.selectedIdx--;

			this.moveForceStop();
		}
	}
}
</script>

<style lang="scss" scoped>
.viewpager {
	width: 100%;
	height: 100%;
	overflow: hidden;

	display: flex;
	flex-direction: column;

	-webkit-user-select: none;

	.viewpager__tabhost {
		cursor: pointer;

		position: relative;

		display: flex;
		align-items: center;
		background-color: $primary-color;

		box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

		z-index: 100;
		.viewpager__tabhost__item {
			flex: 1;

			position: relative;

			padding: 20px;

			font-size: $small-size;
			font-weight: bold;
			text-align: center;
		}
		.viewpager__tabhost__bar {
			position: absolute;

			bottom: 0;
			left: 0;

			height: 5px;

			background-color: white;
			transition: left 0.2s;
			&.no-transition {
				transition: none;
			}
		}
	}
	.viewpager__fragments__wrapper {
		flex: 1;

		touch-action: none;

		position: relative;
	}
	.viewpager__fragments {
		position: absolute;

		transition: left 0.2s;
		&.no-transition {
			transition: none;
		}

		height: 100%;
		display: flex;
		.viewpager__fragments__content {
			position: relative;

			flex: 1;
			display: inline-block;
			width: 100%;
			height: 100%;
		}
	}
}
</style>

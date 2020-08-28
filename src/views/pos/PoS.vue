<template>
	<div class="pos">
		<div class="pos__content">
			<h2 class="pos__content__title">업장 정보</h2>
			<div class="pos__content__actions">
				<h2>오늘 시간대별 방문객</h2>
			</div>
			<div class="pos__content__chart">
				<SalesChart style="width:100%; height:90%;" v-if="isMounted"></SalesChart>
			</div>
			<div class="pos__content__actions">
				<h2>지난 7일간 매출</h2>
				<p>표시 범위 변경</p>
			</div>
			<div class="pos__content__chart">
				<SalesChart style="width:100%; height:90%;" v-if="isMounted"></SalesChart>
			</div>
		</div>
		<div class="pos__content">
			<h2 class="pos__content__title">판매 정보</h2>
			<div class="pos__content__fg">
				<div class="pos__content__actions">
					<h2>오늘 판매 순위 TOP 5</h2>
				</div>
				<div class="pos__content__top5">
					<div class="pos__content__top5__item">
						<h4>과자</h4>
						<p>57,000원</p>
					</div>
					<div class="pos__content__top5__item">
						<h4>과자</h4>
						<p>57,000원</p>
					</div>
					<div class="pos__content__top5__item">
						<h4>과자</h4>
						<p>57,000원</p>
					</div>
					<div class="pos__content__top5__item">
						<h4>과자</h4>
						<p>57,000원</p>
					</div>
					<div class="pos__content__top5__item">
						<h4>과자</h4>
						<p>57,000원</p>
					</div>
				</div>
			</div>
			<div class="pos__content__fg">
				<div class="pos__content__actions">
					<h2>오늘 판매 순위 TOP 5</h2>
				</div>
				<div class="pos__content__top3">
					<ul class="pos__content__top3__list">
						<li class="pos__content__top3__list__item">
							<div class="score">1</div>
							<div class="name">커피콜라맛우유</div>
							<div class="price">4,200원</div>
							<div class="sales">5,740</div>
						</li>
						<li class="pos__content__top3__list__item">
							<div class="score">2</div>
							<div class="name">커피콜라맛우유</div>
							<div class="price">4,200원</div>
							<div class="sales">5,740</div>
						</li>
						<li class="pos__content__top3__list__item">
							<div class="score">3</div>
							<div class="name">커피콜라맛우유</div>
							<div class="price">4,200원</div>
							<div class="sales">5,740</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import SalesChart from "../../components/SalesChart.vue";
@Component({
	components: {
		SalesChart
	}
})
export default class pos extends Vue {
	isMounted = false;
	mounted() {
		setTimeout(() => {
			this.isMounted = true;
		}, 1000);
	}
}
</script>

<style lang="scss">
.pos {
	display: flex;
	.pos__content {
		display: flex;
		flex-direction: column;

		flex: 1;
		margin: 30px;
		padding: 30px;

		border-radius: 24px;
		box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
		background-color: $content-color;

		h2 {
			font-size: $small-normal-size;
		}
		.pos__content__fg {
			flex: 1;
		}
		.pos__content__actions {
			display: flex;
			justify-content: space-between;
			h2 {
				font-size: $small-size;
				color: #656666;
			}
			p {
				color: $primary-color;
			}
		}
		.pos__content__chart {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			overflow: hidden;
		}
		.pos__content__top5 {
			display: flex;
			flex-wrap: wrap;

			margin-top: 20px;

			.pos__content__top5__item {
				border-left: 5px solid $primary-color;
				padding-left: 10px;
				margin-bottom: 20px;

				flex-basis: 30%;
				h4 {
					font-size: $small-size;
					font-weight: normal;
				}
				p {
					font-size: $small-normal-size;
					font-weight: bold;
				}
			}
		}
		.pos__content__top3 {
			h2 {
				font-size: $small-size;
				color: #656666;
				margin: 20px 0;
			}
			.pos__content__top3__list {
				.pos__content__top3__list__item {
					padding: 10px 0;

					display: flex;
					font-size: $small-up-size;
					.score {
						flex: 1;
					}
					.name {
						flex: 5;
					}
					.price {
						flex: 2;
						text-align: right;
					}
					.sales {
						flex: 2;
						text-align: right;
					}
				}
			}
		}
	}
}
</style>

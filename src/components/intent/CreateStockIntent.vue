<template>
	<div class="createstock">
		<form action="javascript:void()" class="createstock__popup" @submit="submit">
			<div class="createstock__popup__action">
				<h2>상품 등록하기</h2>
				<span @click="close">
					<i class="iconify" data-icon="mdi-close"></i>
				</span>
			</div>
			<div class="createstock__popup__content">
				<input type="text" placeholder="이름" min="1" required v-model="name" />
			</div>
			<div class="createstock__popup__endaction">
				<button type="submit">생성하기</button>
			</div>
		</form>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class CreateStock extends Vue {
	name: string = "";
	// @Prop({ default: () => {} }) onSubmit!: Function;
	submit() {
		this.$emit("submit", {
			name: this.name,
		});
	}
	close() {
		this.$emit("close", false);
	}
}
</script>

<style lang="scss" scoped>
.createstock {
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;

	background-color: rgba(0, 0, 0, 0.2);

	z-index: 1000;

	display: flex;
	justify-content: center;
	align-items: center;

	.createstock__popup {
		background-color: $content-color;

		padding: 30px;
		padding-top: 20px;

		min-width: 400px;

		border-radius: 25px;
		.createstock__popup__action {
			display: flex;
			justify-content: space-between;
			margin-bottom: 20px;

			h2 {
				font-size: $small-up-size;
			}
		}
		.createstock__popup__endaction {
			display: flex;
			justify-content: flex-end;
			button {
				margin-top: 20px;
			}
		}
	}
}
</style>

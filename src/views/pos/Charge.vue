<template>
	<div class="charge">
		<form action="javascript:void(0)" @submit="submitForm">
			<input type="email" v-model="email" placeholder="소비자 이메일" :disabled="isLoading" required autofocus />
			<input type="tel" v-model="amount" placeholder="금액" :disabled="isLoading" required />
			<button type="submit" :disabled="isLoading">
				<div v-if="!isLoading">승인</div>
				<span v-else>
					<i class="iconify loading" data-icon="mdi-loading"></i>
				</span>
			</button>
			<p>{{ result }}</p>
		</form>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";

@Component
export default class Charge extends Vue {
	email: string = "";
	amount: number = 0;
	isLoading: boolean = false;

	result: string = "";

	async submitForm() {
		if (!this.isLoading) {
			this.isLoading = true;
			this.result = await this.$store.dispatch("CHARGE", {
				email: this.email,
				amount: this.amount,
			});
			this.isLoading = false;
		}
	}
}
</script>

<style lang="scss" scoped>
@keyframes loading {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}
.charge {
	max-width: 480px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	form {
		text-align: center;
	}
	input {
		margin-bottom: 20px;
	}
	.loading {
		font-size: 40px;
		animation: loading 0.5s linear infinite;
	}
}
</style>

<template>
	<div class="signout">
		<img
			class="home__logo"
			src="https://firebasestorage.googleapis.com/v0/b/sunrinpay.appspot.com/o/LogoDark.png?alt=media&token=e8cef60d-6d5c-41b9-8204-dae9e02ef820"
			alt="SunrinPay Logo"
			width="250px"
			draggable="false"
		/>
		<span v-if="loading">
			<i class="iconify loading" data-icon="mdi-loading"></i>
		</span>
		<p v-else>로그아웃 되었습니다.<br />잠시 후 메인으로 이동합니다.</p>
	</div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

import { signOut } from "@/Auth";

@Component
export default class SignOut extends Vue {
	loading: boolean = true;

	async created() {
		if (await signOut()) {
			this.loading = false;
			setTimeout(() => this.$router.push("/"), 5000);
		}
	}
}
</script>

<style lang="scss" scoped>
.signout {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	.loading {
		font-size: 40px;
		animation: loading 0.5s linear infinite;
	}
	@keyframes loading {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
}
</style>

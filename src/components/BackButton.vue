<template>
	<button class="backbutton" v-on="$listeners">
		<i class="iconify" data-icon="mdi-arrow-back"></i>
	</button>
</template>

<script lang="ts">
import QRcode from "../components/QRcode.vue";
import NumberCounterVue from "vue-roller";

import { Vue, Component } from "vue-property-decorator";

@Component
export default class BackButton extends Vue {}
</script>

<style lang="scss" scoped>
.backbutton {
	width: 50px;
	height: 50px;

	display: flex;
	justify-content: center;
	align-items: center;

	border-radius: 50%;
	padding: 0;
	.iconify {
		font-size: $small-up-size !important;
	}
}
</style>

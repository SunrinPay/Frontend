<template>
	<div id="app">
		<div class="pwa" v-if="deferredPrompt" @click="showPWA">앱 설치하기</div>
		<router-view class="router" />
	</div>
</template>

<script lang="ts">
import firebase from "firebase/app";
import "firebase/auth";

import { ui, uiConfig, signIn, signOut } from "@/Auth";

import { Vue, Component } from "vue-property-decorator";
@Component
export default class App extends Vue {
	deferredPrompt: any = false;

	async created() {
		firebase.auth().onAuthStateChanged(async user => {
			if (user) {
				this.$store.commit("setAuth", true);
				this.$store.commit("setDocRef");
				this.$store.commit("setUserInformation", user);
				await signIn(user);
				await this.$store.dispatch("GET_BALANCE");
				await this.$store.dispatch("GET_TRANSACTIONS");
				if (user.photoURL === null) {
					user.providerData.forEach(data => {
						if (data?.photoURL !== null) this.$store.state.userInformation.photoURL = data?.photoURL;
					});
				}
			} else {
				this.$store.commit("setAuth", false);
				this.$router.replace("/");
			}
		});
	}

	async mounted() {
		console.log("mounted");
		window.addEventListener("beforeinstallprompt", (e: any) => {
			e.preventDefault();
			this.deferredPrompt = e;
			console.log("installed");
			e.prompt();
		});
	}
	showPWA() {
		this.deferredPrompt.prompt();
	}
}
</script>

<style lang="scss">
@import "@/main.scss";
#app {
	width: 100%;
	height: 100%;

	display: flex;
	justify-content: center;

	.pwa {
		position: fixed;
		left: 0;
		top: 0;

		background-color: $primary-color;

		padding: 10px;

		border-radius: 0 0 10px 0;
	}
}
.router {
	height: 100%;
	width: 100%;

	overflow: hidden;
}
</style>

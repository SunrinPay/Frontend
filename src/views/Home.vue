<template>
	<div class="home">
		<img
			v-if="!getIsAuth"
			class="home__logo"
			src="https://firebasestorage.googleapis.com/v0/b/sunrinpay.appspot.com/o/HomeLogo.png?alt=media&token=89218436-fd2e-411e-98cf-6ab865059b8e"
			alt="SunrinPay Logo"
			width="250px"
			draggable="false"
		/>
		<!-- 로그인 UI -->
		<div id="loader" :class="{ inactive: getIsAuth }">
			<span>
				<i class="iconify loading" data-icon="mdi-loading"></i>
			</span>
		</div>
		<div id="firebaseui-auth-container" :class="{ inactive: getIsAuth }"></div>

		<div class="medal">
			<img
				v-if="!getIsAuth"
				src="https://firebasestorage.googleapis.com/v0/b/sunrinpay.appspot.com/o/medal_commits.PNG?alt=media&token=309b6bd9-57c4-40a0-a920-14d81e9c030f"
				alt="Medal for GitHub 300+ Commits"
				width="40px"
				draggable="false"
			/>
		</div>
		<main v-if="getIsAuth">
			<div class="home__title">
				<h3>{{ getUserInformation.displayName }}</h3>
				<img
					:src="getUserInformation.photoURL"
					width="32px"
					height="32px"
					draggable="false"
					@click="()=>{isProfileOpen = !isProfileOpen}"
				/>
			</div>
			<div v-if="isProfileOpen" class="home__profile" @click="$event.stopImmediatePropagation()">
				<div>
					<img :src="getUserInformation.photoURL" width="40px" height="40px" draggable="false" />
					<p>
						<span class="email">{{ getUserInformation.email }}</span>
						<!-- <span v-if="!userInformation.emailVerified" class="badge-unverified">미인증</span> -->
					</p>
				</div>
				<!-- <button>
					<i class="iconify" data-icon="mdi-theme-light-dark"></i>
					다크 모드
				</button>-->
				<button @click="signOut">
					<i class="iconify" data-icon="mdi-logout-variant"></i>
					로그아웃
				</button>
			</div>
			<div
				class="home__profile__background"
				v-if="isProfileOpen"
				@click="()=>{isProfileOpen = !isProfileOpen}"
			></div>
			<div class="home__account" :class="{ isFlip: isFlip, isFlipReverse: !isFlip && !isFirst }">
				<div class="home__account__info" :class="{ unshown: isDelayFlip }">
					내 지갑
					<span v-if="!isReloading" class="home__account__info__reload">
						<span v-if="!isReloadingDelay" @click="reload">
							<i class="iconify reload" data-icon="mdi-reload"></i>
						</span>
						<span v-else>
							업데이트됨
							<i class="iconify" data-icon="mdi-check"></i>
						</span>
					</span>
					<span v-else>
						<i class="iconify loading" data-icon="mdi-loading"></i>
					</span>
				</div>

				<h3 class="home__account__money" :class="{ unshown: isDelayFlip }">
					<NumberCounter :text="String(getBalance)" :isNumberFormat="true" defaultChar="0"></NumberCounter>원
				</h3>

				<div class="home__account__qr" :class="{ unshown: !isDelayFlip }">
					<QRcode
						:data="'https://sunrinpay.com/sendmoney?account=' + getUserInformation.email"
						class="qr"
					></QRcode>
				</div>

				<p class="home__account__action">
					<router-link :to="{ name: 'SendMoney' }">송금하기</router-link>
					<span v-if="!isFlip" @click="toggleFlip">내 QR 보기</span>
					<span v-else @click="toggleFlip">닫기</span>
				</p>
			</div>
			<div class="home__log">
				<h2>송금 및 결제 내역</h2>
				<ul class="home__log__list">
					<li
						class="home__log__list__item"
						v-for="i in getTransactions"
						:key="i.timestamp.seconds"
						@click="()=>showReceiptIntent(i)"
					>
						<div class="left">
							<h3>{{ i.type }}</h3>
							<p>{{ formatDate(i.timestamp.toDate()) }}</p>
						</div>
						<div class="right">
							<p class="result">
								{{ i.type == "충전" ? "+" + numberFormat(i.totalPrice) : numberFormat(i.totalPrice) }}원
								<br />내 지갑
							</p>
						</div>
					</li>
				</ul>
			</div>
		</main>
		<Receipt v-if="isShowReceipt" :data="selectedReceipt" @close="isShowReceipt = false"></Receipt>
	</div>
</template>

<script lang="ts">
import QRcode from "../components/QRcode.vue";
import NumberCounter from "vue-roller";

import firebase from "firebase/app";
import "firebase/auth";

import { db, log } from "@/DB";
import { ui, uiConfig, signOut } from "@/Auth";

import { Vue, Component, Watch } from "vue-property-decorator";
import Receipt from "../components/intent/ReceiptIntent.vue";

@Component({
	components: {
		QRcode,
		NumberCounter,
		Receipt,
	},
})
export default class Home extends Vue {
	isReloading: boolean = false;
	isReloadingDelay: boolean = false;
	isProfileOpen: boolean = false;
	isFirst: boolean = true;

	isFlip: boolean = false;
	isDelayFlip: boolean = false;

	isShowReceipt = false;
	selectedReceipt = [];

	mounted() {
		setTimeout(async () => {
			if (!firebase.auth().currentUser && !this.$store.state.isAuth) {
				await ui.start("#firebaseui-auth-container", uiConfig);
			}
		}, 1500);
	}

	get getIsAuth(): boolean {
		return this.$store.state.isAuth;
	}

	get getUserInformation(): any {
		return this.$store.state.userInformation;
	}

	get getBalance(): number {
		return this.$store.state.balance;
	}

	get getTransactions(): any {
		return this.$store.state.transactions;
	}

	formatDate(date: Date): string {
		return `${date.getMonth() + 1}.${date.getDate()} ${
			date.getHours() > 9 ? date.getHours() : "0" + date.getHours()
		}:${
			date.getMinutes() > 9 ? date.getMinutes() : "0" + date.getMinutes()
		}:${
			date.getSeconds() > 9 ? date.getSeconds() : "0" + date.getSeconds()
		}`;
	}

	numberFormat(number: number): string {
		return new Intl.NumberFormat().format(number);
	}

	async reload() {
		this.isReloading = this.isReloadingDelay = true;
		await this.$store.dispatch("GET_BALANCE");
		await this.$store.dispatch("GET_TRANSACTIONS");
		this.isReloading = false;
		setTimeout(() => (this.isReloadingDelay = false), 3000);
	}

	toggleFlip() {
		this.isFirst = false;
		this.isFlip = !this.isFlip;
		setTimeout(() => {
			this.isDelayFlip = this.isFlip;
		}, 250);
	}

	async signOut() {
		await signOut();
		await ui.start("#firebaseui-auth-container", uiConfig);
	}

	showReceiptIntent(data): void {
		if (data.data) {
			this.selectedReceipt = data;
			this.isShowReceipt = true;
		}
	}
}
</script>

<style lang="scss" scoped>
@import url("https://www.gstatic.com/firebasejs/ui/4.5.0/firebase-ui-auth.css");
@keyframes loading {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.home {
	max-width: 720px;

	padding: 40px;
	overflow-y: scroll;

	.medal {
		position: absolute;
		right: 5px;
		bottom: 0;
		justify-content: flex-end;
		transform-origin: center;
		transition-duration: 0.3s;
		cursor: pointer;
		z-index: 10;
		&:active {
			transform: scale(6.5);
			right: 100px;
			bottom: 115px;
		}
	}

	.inactive {
		display: none;
	}

	.home__logo {
		display: block;
		margin: 40px auto;
	}

	#loader {
		text-align: center;
		.loading {
			font-size: 40px;
			animation: loading 0.5s linear infinite;
		}
	}

	main {
		position: relative;

		.home__title {
			margin-top: 10px;
			margin-bottom: 30px;
			display: flex;
			justify-content: space-between;

			span {
				font-size: $small-normal-size;
			}
			img {
				border-radius: 50%;
				box-shadow: 0 3px 3px rgba(0, 0, 0, 0.15);
				cursor: pointer;
				&:hover {
					box-shadow: 0 2px 5px rgba(232, 234, 237, 0.08);
				}
				position: relative;
			}
			.email {
				font-size: 0.7em;
				margin-right: 10px;
			}
			.badge-unverified {
				font-size: 0.6em;
				padding: 2px 5px;
				background-color: #777;
				border-radius: 20px;
			}
		}

		.home__profile {
			position: absolute;
			right: 0;
			margin-top: -20px;
			background: $content-color;
			border-radius: 20px;
			z-index: 10;

			* {
				color: white;
			}

			div {
				padding: 20px;
				display: flex;
				align-items: center;
			}
			p {
				margin-left: 20px;
				display: flex;
				flex-direction: column;
				.email {
				}
				.badge-unverified {
				}
			}
			img {
				border-radius: 50%;
			}
			button {
				padding: 12px;
				width: 100%;
				padding-left: 20px;

				background: none;

				margin-bottom: 20px;

				display: flex;
				align-items: center;
				justify-content: flex-start;

				&:hover {
					background-color: $background-color;

					border-radius: 0;
				}

				.iconify {
					margin-right: 5px;
				}
			}
		}
		.home__profile__background {
			z-index: 9;
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
		}

		.home__account {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 30vh;
			width: 100% !important;

			background-color: $primary-color;
			border-radius: 8px;
			box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

			padding: 25px;

			overflow: hidden;
			color: white;

			.unshown {
				display: none !important;
			}
			.home__account__info {
				display: flex;
				justify-content: space-between;
				height: 1.5em;
				font-size: $small-size;
				.home__account__info__reload {
					.reload {
						font-size: 30px;
						cursor: pointer;
					}
					span {
						font-size: 20px;
					}
				}
				.loading {
					font-size: 30px;
					animation: loading 0.5s linear infinite;
				}
			}
			.home__account__qr {
				flex: 1;
				overflow: hidden;

				margin-bottom: 20px;

				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				.qr {
					height: 100%;
				}

				.content {
					margin-left: 20px;
					h3 {
						font-size: $small-up-size;
					}
				}
			}
			.home__account__money {
				display: flex;
				justify-content: center;
				font-size: $normal-size;
			}
			.home__account__action {
				height: 1.5em;
				font-size: $small-size;
				text-align: center;

				display: flex;
				justify-content: space-around;
				* {
					color: white;
				}
				span {
					cursor: pointer;
				}
			}

			&.isFlip {
				animation: flip 0.5s;
			}

			&.isFlipReverse {
				animation: flipReverse 0.5s;
			}

			@keyframes flip {
				0% {
					transform: rotateY(0) scale(1) translateY(0);
				}
				50% {
					transform: rotateY(90deg) scale(1.1) translateY(-20px);
					box-shadow: 0 20px 10px rgba(0, 0, 0, 0.5);
				}
				100% {
					transform: rotateY(0) scale(1) translateY(0);
				}
			}
			@keyframes flipReverse {
				0% {
					transform: rotateY(0) scale(1) translateY(0);
				}
				50% {
					transform: rotateY(90deg) scale(1.1) translateY(-20px);
					box-shadow: 0 20px 10px rgba(0, 0, 0, 0.5);
				}
				100% {
					transform: rotateY(0) scale(1) translateY(0);
				}
			}
		}
		.home__log {
			h2 {
				font-size: $small-size;
				opacity: 0.6;
				margin-top: 20px;
				margin-bottom: 15px;
			}
			.home__log__list {
				.home__log__list__item {
					cursor: pointer;

					display: flex;
					justify-content: space-between;

					padding: 10px 0;

					border-bottom: 1px solid #fcfeff;

					.left {
						flex: 1;
						text-overflow: ellipsis;
						overflow: hidden;
						white-space: nowrap;
						h3 {
							font-size: $small-size;
						}
					}
					.right {
						.result {
							display: flex;
							justify-content: flex-end;
							align-items: flex-end;
							text-align: right;
						}
					}
				}
			}
		}
	}
}
</style>

import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";
import "firebase/analytics";
import axios from "axios";

import { db, log, transaction } from "@/DB";
import { query } from "vue-analytics";

const event: any = require("vue-analytics").event;
let docRef: any = "";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		balance: 0 as number,
		transactions: [] as any,
	},
	mutations: {
		setDocRef(state, data) {
			docRef = db.collection("accounts").doc(firebase.auth().currentUser!.uid);
		},
	},
	actions: {
		async GET_BALANCE({ commit, state }, data): Promise<boolean | number> {
			event("action", "GET_BALANCE", "getBalance", data);
			try {
				let snapshot = await docRef.get();
				state.balance = snapshot.data()!.balance;
				return state.balance;
			} catch (err) {
				log("error", `CREATE_ORDER : ${err}`);
				return false;
			}
		},
		async GET_TRANSACTIONS({ commit, state }, data): Promise<any> {
			event("action", "GET_TRANSACTIONS", "getTransactions", data);
			try {
				let querySnapshot = await db
					.collection("transactions")
					.where("uid", "==", firebase.auth().currentUser!.uid)
					.orderBy("timestamp", "desc")
					.get();
				state.transactions = [];
				querySnapshot.forEach(doc => {
					state.transactions.push(doc.data());
					// console.log(doc.id, ": ", doc.data().timestamp.seconds);
				});
				// console.log(state.transactions[0].type);
				return true;
			} catch (err) {
				await log("error", `GET_TRANSACTIONS : ${err}`);
				return false;
			}
		},
		async SEND_MONEY({ commit, state }, data): Promise<string> {
			event("action", "SEND_MONEY", "sendMoney", data);
			if (firebase.auth().currentUser!.email == data.recipient) return "본인에게 송금할 수 없습니다.";
			try {
				// 받는 사람 도큐먼트의 uid 조회
				let recipientQuerySnapshot = await db
					.collection("accounts")
					.where("email", "==", data.recipient)
					.get();
				if (!recipientQuerySnapshot.docs[0]) return "계정이 존재하지 않습니다.";

				// 보내는 사람 도큐먼트 가져오기
				let snapshot = await docRef.get();

				if (snapshot.data()!.balance - data.amount < 0) return `잔액이 ${Math.abs(snapshot.data()!.balance - data.amount)}원 부족합니다.`;

				// 보내는 사람 잔액 차감
				await docRef.update({
					balance: snapshot.data()!.balance - data.amount,
				});

				// 받는 사람  도큐먼트 가져오기
				let recipientDocRef = db.collection("accounts").doc(recipientQuerySnapshot.docs[0].id);
				let recipientSnapshot = await recipientDocRef.get();

				// 받는 사람 잔액 증감
				await recipientDocRef.update({
					balance: recipientSnapshot.data()!.balance + data.amount,
				});

				// state 잔액 갱신
				snapshot = await docRef.get();
				state.balance = snapshot.data()!.balance;

				await transaction(`송금 : ${data.recipient}`, {}, data.amount);
				return `${data.recipient}님에게 ${data.amount}원을 보냈습니다.`;
			} catch (err) {
				log("error", `SEND_MONEY : ${err}`);
				return "오류가 발생하였습니다.";
			}
		},
		async CREATE_ORDER({ commit, state }, data): Promise<boolean> {
			event("action", "CREATE_ORDER", "createOrder", data);
			try {
				await db
					.collection("orders")
					.doc(data.orderID)
					.set({
						id: data.orderID,
						itemData: data.itemData,
						totalPrice: data.totalPrice,
					});
				return true;
			} catch (err) {
				await log("error", `CREATE_ORDER : ${err}`);
				return false;
			}
		},
		async GET_ORDER({ commit, state }, data): Promise<any> {
			event("action", "GET_ORDER", "getOrder", data);
			try {
				let orderDocSnapshot = await db
					.collection("orders")
					.doc(data.orderID)
					.get();
				return orderDocSnapshot.data();
			} catch (err) {
				await log("error", `CREATE_ORDER : ${err}`);
				return false;
			}
		},
		async CHECKOUT({ commit, state }, data): Promise<boolean | string> {
			event("action", "CHECKOUT", "checkout", data);
			try {
				let orderDocRef = db.collection("orders").doc(data.orderID);
				let orderDocSnapshot = await orderDocRef.get();

				let snapshot = await docRef.get();
				let newBalance: number = Number(snapshot.data()!.balance) - orderDocSnapshot.data()!.totalPrice;
				if (newBalance >= 0) {
					// 결제 가능
					await docRef.update({ balance: newBalance });
					await orderDocRef.delete();
					await transaction("일반 결제", orderDocSnapshot.data()!.itemData, orderDocSnapshot.data()!.totalPrice);
					return true;
				} else {
					// 결제 불가
					await log("info", `잔액 부족 : ${Math.abs(newBalance)}원`);
					return `잔액이 ${Math.abs(newBalance)}원 부족합니다.`;
				}
			} catch (err) {
				await log("error", `결제 실패 : ${err}`);
				return false;
			}
		},
		async CHECKOUT_KAKAOPAY({ commit, state }, data) {
			event("action", "CHECKOUT_KAKAOPAY", "checkout_kakaopay", data);
			try {
				let orderDocRef = db.collection("orders").doc(data.orderID);
				let orderDocSnapshot = await orderDocRef.get();

				let result = await axios.post("https://kl9h2eg0hk.execute-api.ap-northeast-2.amazonaws.com/default/relayPayment", {
					item_name: `주문번호 [${data.orderID}]`,
					quantity: 1,
					total_amount: orderDocSnapshot.data()!.itemData,
					vat_amount: 0,
					tax_free_amount: 0,
				});
				if (result) {
					await transaction("카카오페이 결제", orderDocSnapshot.data()!.itemData, orderDocSnapshot.data()!.totalPrice);
				}
				return result.data;
			} catch (err) {
				return console.dir(err);
			}
		},
		async CHARGE({ commit, state }, data): Promise<string> {
			event("action", "CHARGE", "charge", data);
			try {
				let customerQuerySnapshot = await db
					.collection("accounts")
					.where("email", "==", data.email)
					.get();

				if (!customerQuerySnapshot.docs[0]) return "계정이 존재하지 않습니다.";

				// 소비자  도큐먼트 가져오기
				let customerDocRef = db.collection("accounts").doc(customerQuerySnapshot.docs[0].id);
				let customerSnapshot = await customerDocRef.get();

				let newBalance: number = Number(customerSnapshot.data()!.balance) + Number(data.amount);

				await customerDocRef.update({ balance: newBalance });
				await transaction("충전", {}, data.amount);
				return `${data.email}님의 계정에 ${data.amount}원을 충전하여 ${newBalance}원이 되었습니다.`;
			} catch (err) {
				await log("error", `충전 실패 : ${err}`);
				return "오류가 발생하였습니다.";
			}
		},
	},
	modules: {},
});

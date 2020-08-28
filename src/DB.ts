import firebase from "firebase/app";
import "firebase/firestore";
import "dotenv/config";

export const db = firebase
	.initializeApp({
		apiKey: process.env.VUE_APP_FIREBASE_API_KEY || "AIzaSyC4TcH94TCyNYppi8VadESHta-6u6VTPts",
		authDomain: "sunrinpay.firebaseapp.com",
		databaseURL: "https://sunrinpay.firebaseio.com",
		projectId: "sunrinpay",
		storageBucket: "sunrinpay.appspot.com",
		messagingSenderId: "604565159530",
		appId: "1:604565159530:web:f5a102d54869c502051413",
		measurementId: "G-1ZF3X6NF8V",
	})
	.firestore();

export async function transaction(_type: string, _data: object, _totalPrice: number): Promise<boolean> {
	try {
		await db.collection("transactions").add({
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			uid: firebase.auth().currentUser?.uid,
			type: _type,
			data: _data,
			totalPrice: _totalPrice,
		});
		return true;
	} catch (err) {
		await log("error", `트랜잭션 추가 실패 : ${err}`);
		return false;
	}
}

export async function log(_type: string, _message: string): Promise<void> {
	try {
		await db.collection("logs").add({
			a0_timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			a1_year: new Date().getFullYear(),
			a2_month: new Date().getMonth() + 1,
			a3_date: new Date().getDate(),
			a4_hour: new Date().getHours(),
			a5_minute: new Date().getMinutes(),
			b0_uid: firebase.auth().currentUser?.uid ? firebase.auth().currentUser?.uid : null,
			b1_email: firebase.auth().currentUser?.email ? firebase.auth().currentUser?.email : null,
			b2_displayName: firebase.auth().currentUser?.displayName ? firebase.auth().currentUser?.displayName : null,
			b3_providerData: firebase.auth().currentUser?.providerData ? firebase.auth().currentUser?.providerData : null,
			c0_type: _type,
			c1_message: _message,
		});
	} catch (err) {
		console.log(`Unexpected Error While Logging`);
	}
}

// Export types that exists in Firestore
// This is not always necessary, but it's used in other examples
// const { TimeStamp, GeoPoint } = firebase.firestore;
// export { TimeStamp, GeoPoint };

// if using Firebase JS SDK < 5.8.0
// db.settings({ timestampsInSnapshots: true });

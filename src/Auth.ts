import firebase from "firebase/app";
import "firebase/auth";
import * as firebaseui from "firebaseui";
firebase.auth().languageCode = "ko";

import { db, log } from "@/DB";

export const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth());
export const uiConfig = {
	callbacks: {
		signInSuccessWithAuthResult: (authResult, redirectUrl) => {
			return true;
		},
		uiShown: () => {
			document.getElementById("loader")!.style.display = "none";
		},
	},
	signInSuccessUrl: "/",
	signInOptions: [
		{
			provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
			requireDisplayName: true,
		},
		{
			provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID,
			clientId: "604565159530-tf5rvkljdec8n0o83lj2hjba53831q6i.apps.googleusercontent.com",
			scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"],
		},
		{
			provider: firebase.auth.FacebookAuthProvider.PROVIDER_ID,
			scopes: ["email"],
		},
		firebase.auth.TwitterAuthProvider.PROVIDER_ID,
		{
			provider: firebase.auth.GithubAuthProvider.PROVIDER_ID,
			scopes: ["read:user", "user:email"],
		},
		{
			provider: "apple.com",
			scopes: ["email", "name"],
			locale: "ko_KR",
		},
		{
			provider: "microsoft.com",
			scopes: ["email", "profile"],
		},
	],
	credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
	tosUrl: "https://sunrinpay.web.app/privacy",
	privacyPolicyUrl: "https://sunrinpay.web.app/privacy",
};
ui.disableAutoSignIn();

export async function signIn(user: any): Promise<any> {
	let idToken = await user.getIdToken();
	// 사용자 문서 존재 여부 확인
	try {
		let doc = await db
			.collection("accounts")
			.doc(user.uid)
			.get();

		if (doc.exists) {
			// 기존 사용자
			try {
				await db
					.collection("accounts")
					.doc(user.uid)
					.update({
						displayName: user.displayName,
						email: user.email,
						emailVerified: user.emailVerified,
						photoURL: user.photoURL,
						providerData: user.providerData,
						idToken: idToken,
						lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
					});
				return true;
			} catch (err) {
				await log("error", `기존 사용자 문서 업데이트 실패 : ${err}`);
				return false;
			}
		} else {
			// 신규 사용자
			try {
				await db
					.collection("accounts")
					.doc(user.uid)
					.set({
						displayName: user.displayName,
						email: user.email,
						emailVerified: user.emailVerified,
						photoURL: user.photoURL,
						uid: user.uid,
						providerData: user.providerData,
						idToken: idToken,
						joinedOn: firebase.firestore.FieldValue.serverTimestamp(),
						lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
						balance: 0,
					});
				return true;
			} catch (err) {
				await log("error", `신규 사용자 문서 추가 실패 : ${err}`);
				return false;
			}
		}
	} catch (err) {
		await log("error", `accounts 컬렉션 가져오기 실패 : ${err}`);
		return false;
	}
}

export async function signOut(): Promise<boolean> {
	try {
		await firebase.auth().signOut();
		return true;
	} catch (err) {
		await log("error", `로그아웃 실패 : ${err}`);
		return false;
	}
}

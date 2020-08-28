import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import VueAnalytics from "vue-analytics";

import Home from "@/views/Home.vue";
import PrivacyPolicy from "@/views/PrivacyPolicy.vue";
import Sitemap from "@/views/Sitemap.vue";
import SignOut from "@/views/SignOut.vue";

// Customer
import Checkout from "@/views/Checkout.vue";
import SendMoney from "@/views/SendMoney.vue";

// Pos
import PoS from "@/views/pos/PoS.vue";
import Order from "@/views/pos/Order.vue";
import OrderRequest from "@/views/pos/OrderRequest.vue";
import StockManagement from "@/views/pos/StockManagement.vue";
import Setting from "@/views/pos/Settings.vue";
import Charge from "@/views/pos/Charge.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/privacy",
		name: "PrivacyPolicy",
		component: PrivacyPolicy,
	},
	{
		path: "/sitemap",
		name: "Sitemap",
		component: Sitemap,
	},
	{
		path: "/signout",
		name: "SignOut",
		component: SignOut,
	},

	// Customer
	{
		path: "/checkout",
		name: "Checkout",
		component: Checkout,
	},
	{
		path: "/sendmoney",
		name: "SendMoney",
		component: SendMoney,
	},

	// PoS
	{
		path: "/pos",
		name: "PoS",
		component: PoS,
	},
	{
		path: "/pos/order",
		name: "Order",
		component: Order,
	},
	{
		path: "/pos/order-request",
		name: "OrderRequest",
		component: OrderRequest,
	},
	{
		path: "/pos/stock-management",
		name: "StockManagement",
		component: StockManagement,
	},
	{
		path: "/pos/setting",
		name: "Setting",
		component: Setting,
	},
	{
		path: "/pos/charge",
		name: "Charge",
		component: Charge,
	},
];

const router = new VueRouter({
	mode: "history",
	base: process.env.BASE_URL,
	routes,
});

Vue.use(VueAnalytics, {
	id: "232816031",
	router,
});

export default router;

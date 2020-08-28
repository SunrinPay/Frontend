const storage = `https://firebasestorage.googleapis.com/v0/b/sunrinpay.appspot.com/o/`;
module.exports = {
	// publicPath: process.env.NODE_ENV === "production" ? "/Frontend/" : "/",
	outputDir: "docs",
	// devServer: {
	// 	https: true,
	// 	hotOnly: false,
	// },
	pwa: {
		name: "Sunrin Pay",
		themeColor: "#538fff",
		workboxPluginMode: "InjectManifest",
		workboxOptions: {
			swSrc: "public/service-worker.js",
		},
	},
	css: {
		loaderOptions: {
			scss: {
				prependData: `@import "@/variable.scss";`,
			},
		},
	},
	chainWebpack: config => {
		config.plugin("html").tap(args => {
			args[0].title = "SunrinPay";
			args[0].banner = `${storage}sunrinpay_banner.PNG?alt=media&token=1a20e6d5-3c53-4aa6-b8a1-0353c541ab0d`;
			args[0].favicon_ico = `${storage}icon%2Ffavicon.ico?alt=media&token=2fa978f2-5d0e-4a0d-b3ec-101f5a64411e`;
			args[0].apple_icon_57x57 = `${storage}icon%2Fapple-icon-57x57.png?alt=media&token=162cf499-cd14-477e-9dc0-f035a34b304c`;
			args[0].apple_icon_60x60 = `${storage}icon%2Fapple-icon-60x60.png?alt=media&token=ca09f87b-8bf2-46a8-9b48-8987820bedba`;
			args[0].apple_icon_72x72 = `${storage}icon%2Fapple-icon-72x72.png?alt=media&token=7a6edd48-8986-42f2-8d87-d1a4be1eb928`;
			args[0].apple_icon_76x76 = `${storage}icon%2Fapple-icon-76x76.png?alt=media&token=72e8739b-ac8c-4928-807a-f0da9681095f`;
			args[0].apple_icon_114x114 = `${storage}icon%2Fapple-icon-114x114.png?alt=media&token=8da46db5-dea4-4c18-a462-ec776aa71510`;
			args[0].apple_icon_120x120 = `${storage}icon%2Fapple-icon-120x120.png?alt=media&token=de8b08cb-146c-4943-9a4d-bb24174b8e15`;
			args[0].apple_icon_144x144 = `${storage}icon%2Fapple-icon-144x144.png?alt=media&token=7471114d-0a45-49d9-b992-5674f6e91705`;
			args[0].apple_icon_152x152 = `${storage}icon%2Fapple-icon-152x152.png?alt=media&token=bb1b3542-a4e8-4719-96f4-b3075437d1d9`;
			args[0].apple_icon_180x180 = `${storage}icon%2Fapple-icon-180x180.png?alt=media&token=b032b33c-ee38-4142-9039-0679d2590551`;
			args[0].android_icon_192x192 = `${storage}icon%2Fandroid-icon-192x192.png?alt=media&token=f522fa7b-4b4a-4770-b74a-586247bbe68e`;
			args[0].favicon_16x16 = `${storage}icon%2Ffavicon-16x16.png?alt=media&token=3449fb98-83b6-4d0c-b999-7e1f68c9f27f`;
			args[0].favicon_32x32 = `${storage}icon%2Ffavicon-32x32.png?alt=media&token=ff70b62a-1a4f-464b-8ba4-8298c1916308`;
			args[0].favicon_96x96 = `${storage}icon%2Ffavicon-96x96.png?alt=media&token=7072819b-fcdb-4310-b9b3-7dc54c720e64`;
			args[0].ms_icon_144x144 = `${storage}icon%2Fms-icon-144x144.png?alt=media&token=3ebddf95-10ec-46c2-8def-4e67855ae056`;
			return args;
		});
	},
};

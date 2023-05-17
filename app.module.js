// Source: app.module.js
var app = angular.module('ABHI',[
	'ngRoute',
	"ngStorage",
	"countUpModule",
	"oc.lazyLoad"
]);

/* 	
Author: Pankaj Patil
Block Name :- App Constants
Date:- 18-06-2018
*/

var timeStamp = "090320231744";

var originUrl = window.location.protocol+"//"+window.location.hostname;

// app.constant('ABHI_CONFIG', {	
// 	'apiUrl': originUrl+window.location.pathname+"observicesV2/api/",
// 	'baseUrl': originUrl+window.location.pathname,
// 	"healthWebsiteUrl": originUrl+"/hServices/api/",
// 	"hservicesv2" : "https://www.adityabirlacapital.com/healthinsurance/hServices_v2/api",
// 	"hservices" : "https://www.adityabirlacapital.com/hServices/api",
// 	'apiToken': "a6I2VgDhhVjUzB3j80agqwdM0BHhiloe5X7MnLYCeTzziYy7eh7SPJgGYI9azazmJaeljQzGPMN8TsYm",
// 	"hAService": originUrl+"/healthinsurance/opddrm/api/",
// 	"hAPPMCToken": "2299C0C8D8DA4288BEFF90E7F31DD10B5EB373D346A04792852B7FE0DF88AB628CF4A82FAA47461AB2C884D11BCFEE9D",
// 	"templateGenerationUrl": "https://www.adityabirlacapital.com/healthinsurance/TemplateGeneration/api/",
// 	"templateGenerationToken": "tsP1Zmw1nYDG8EjRLZQF79anHcJ1tdyrtBINqknV"
// });

// app.constant('ABHI_CONFIG', {
// 	'apiUrl': "https://www.adityabirlacapital.com/healthinsurance/buy-insurance-online/observicesV2/api/",
// 	'baseUrl': "https://www.adityabirlacapital.com/healthinsurance/buy-insurance-online",
// 	"healthWebsiteUrl": "https://www.adityabirlacapital.com/healthinsurance/hServices/api/",
// 	"healthWebsite": "https://www.adityabirlacapital.com/healthinsurance/",
// 	"hservicesv2" : "https://www.adityabirlacapital.com/healthinsurance/hServices_v2/api",
// 	'apiToken': "a6I2VgDhhVjUzB3j80agqwdM0BHhiloe5X7MnLYCeTzziYy7eh7SPJgGYI9azazmJaeljQzGPMN8TsYm",
// 	"hAService": "https://www.adityabirlacapital.com/healthinsurance/healthinsurance/opddrm/api/",
// 	"hAPPMCToken": "2299C0C8D8DA4288BEFF90E7F31DD10B5EB373D346A04792852B7FE0DF88AB628CF4A82FAA47461AB2C884D11BCFEE9D",
// 	"templateGenerationUrl": "https://www.adityabirlacapital.com/healthinsurance/TemplateGeneration/api/",
// 	"templateGenerationToken": "tsP1Zmw1nYDG8EjRLZQF79anHcJ1tdyrtBINqknV"
// });

// app.constant('ABHI_CONFIG', {
// 	'apiUrl': "https://hpre.adityabirlahealth.com/buy-online-health-v2/obServicesV2/api/",
// 	'baseUrl': "https://hpre.adityabirlahealth.com/buy-online-health-v2/",
// 	"healthWebsiteUrl": "https://hpre.adityabirlahealth.com/hServices/api/",
// 	'apiToken': "wNgekvJWiueZTcFfbKvNx6EpCNPpYU3A1TCusb2Bnrh45BMjpCnk1aN2YGQRpBzj1Uza5xIHYqSnhD94",
// 	"hAService": "https://hpre.adityabirlahealth.com/HAAHC-PPMC/api/",
// 	"hservicesv2" : "https://hpre.adityabirlahealth.com/hServices_v2/api",
// 	"hAPPMCToken": "5E466B24-59D6-4F07-97E5-F9D499134027",
// 	"communicationUrl": "https://hpre.adityabirlahealth.com/ABHCommunication/",
// 	"templateGenerationUrl": "https://hpre.adityabirlahealth.com/TemplateGeneration/api/",
// 	"templateGenerationToken": "uIhsjJfDOnGo3KZV6i47pywmFltAka5tk0lVVjLG"
// });

app.constant('ABHI_CONFIG', {
	'apiUrl': "https://mtpre.adityabirlahealth.com/healthinsurance/buy-insurance-online/obServicesV2/api/",
	'baseUrl': "https://mtpre.adityabirlahealth.com/healthinsurance/buy-insurance-online/",
	"healthWebsiteUrl": "https://mtpre.adityabirlahealth.com/buy-insurance-online/hServices/api/",	
	"hServicesUrl": "https://mtpre.adityabirlahealth.com/buy-insurance-online/hServices/api/",
	"healthWebsite": "https://mtpre.adityabirlahealth.com/healthinsurance/",
	'apiToken': "a6I2VgDhhVjUzB3j80agqwdM0BHhiloe5X7MnLYCeTzziYy7eh7SPJgGYI9azazmJaeljQzGPMN8TsYm",
	"hAService": "https://mtpre.adityabirlahealth.com/HAAHC-PPMC/api/",
	"hservicesv2" : "https://mtpre.adityabirlahealth.com/buy-insurance-online/hServices/api",
	"hAPPMCToken": "2299C0C8D8DA4288BEFF90E7F31DD10B5EB373D346A04792852B7FE0DF88AB628CF4A82FAA47461AB2C884D11BCFEE9D",
	"templateGenerationUrl": "https://mtpre.adityabirlahealth.com/healthinsurance/TemplateGeneration/api/",
	"templateGenerationToken": "tsP1Zmw1nYDG8EjRLZQF79anHcJ1tdyrtBINqknV",
});
/* End of app constants */

/* Updating urf header dynamically */

	app.service('urf', function () {
		var pS = this;
		let urlArr= ["https://wellnesslayerapis.adityabirlahealth.com/getjourney/api/v1/token/generate", "https://wellnesslayerapis.adityabirlahealth.com/tyk/a2b40563-cfe8-4a59-8b68-4de2173520d7/", "https://wellnesslayerapis.adityabirlahealth.com/tyk/a7233c08-9be5-4f46-ab27-c1aa93c2330b/"];
		pS.request =  function (config) {
			if(!urlArr.includes(config.url)){
			config.headers.urf = window.location.href;
		}
		if(urlArr.includes(config.url)){
			delete config.headers["x-ob-at"];
	}
			return config;
		}  
	});

/* End of updating urf header dynamically */


/* Updating xObUt header dynamically */

	app.service('xObUT', function () {
		var pS = this;
		let urlArr= ["https://wellnesslayerapis.adityabirlahealth.com/getjourney/api/v1/token/generate", "https://wellnesslayerapis.adityabirlahealth.com/tyk/a2b40563-cfe8-4a59-8b68-4de2173520d7/", "https://wellnesslayerapis.adityabirlahealth.com/tyk/a7233c08-9be5-4f46-ab27-c1aa93c2330b/"];
		pS.request =  function (config) {
			if(!urlArr.includes(config.url)){
				config.headers['x-ob-ut'] = sessionStorage.getItem('ut');
			}
			
			return config;
		}  
	});

/* End of updating urf header dynamically */


/* 	
Author: ABHI Digital
Block Name :- App Config 
Date:- 15-06-2018
*/
	
app.config(['$locationProvider','$httpProvider','$routeProvider','ABHI_CONFIG',function($locationProvider, $httpProvider,$routeProvider,ABHI_CONFIG) {
	
	/* Default http config headers */

		$httpProvider.defaults.headers.post['x-ob-at'] = ABHI_CONFIG.apiToken;
		$httpProvider.defaults.headers.common['x-ob-at'] = ABHI_CONFIG.apiToken;
		$httpProvider.interceptors.push('urf');
		$httpProvider.interceptors.push('xObUT');

	/* End of default http config headers */


	/* CSS array mapping */

var cssArray = ['part-pay','pre-quote', 'reco', 'plans', 'aa-quote', 'platinum-quote', 'pa-quote', 'cs-quote', 'ci-quote', 'proposer-details', 'insured-detail', 'health-lifestyle', 'health-lifestyle-new', 'declaration', 'post-payment', 'new-hili', 'corona-kavach-quote', 'tax-tool', 'platinum-quote-v2', 'sales-preminum-cal', 'arogya-sanjeevani-quote', 'renewal-new-quick-renew', 'counter-offer', 'new-renewal', 'vil-login', 'vil-raise-track', 'vil-raise', 'axis-telesales-renew-policy', 'product-detail','sales-preminum-cal','editable-proposal','activ-fit-quote','juspay-status','renewal-new-quick-renew-new','customer-profile','pharmeasy','terms-conditions', 'group-activ-travel', 'group-activ-travel-payment']

		function removeLazyLoadedCSS(timeStamp,neededCss){
			for(var i = 0;i<cssArray.length;i++){
				$('link[href="assets/css-min/'+cssArray[i]+'.css?v='+timeStamp+'"]').remove();
			}
			$('<link rel="stylesheet" type="text/css" href="assets/css-min/'+neededCss+'.css?v='+timeStamp+'">').appendTo($('head'));
		}

	/* End of CSS array mapping */


	/* All routing of application */
		
		  $routeProvider
			   .when('/', {
				redirectTo: '/pre-quote'
			})
			.when('/web-agg/:imdCode', {
				templateUrl: 'partials/web-agg.html?v='+timeStamp,
				controller: 'webAggApp',
				controllerAs: "wA",
				resolve: {
					wAApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						return $ocLazyLoad.load({
							name: "wAApp",
							files: [
								"assets/js/web-agg.controller.js?v="+timeStamp,
							]
						})
					}]
				}
			})
			.when('/new-prod-test', {
				redirectTo: '/pre-quote'
				
				// title: 'Buy Health Insurance Online - Aditya Birla Health Insurance',
				// templateUrl: 'partials/new-pre-quote.html?v='+timeStamp,
				// controller: 'preQuoteApp',
				// controllerAs: "pQA",
				// metaDescription: "Buy Health Insurance plans by Aditya Birla Capital and secure yourself against any medical emergency. Our Medical Insurance policies help you avail cashless claim services from our 3,000+ network of Hospitals. Buy Health Insurance from Aditya Birla Capital now!",
				// metaKeywords: "buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance",
				// resolve: {
				// 	preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
				// 		removeLazyLoadedCSS(timeStamp,'pre-quote');
				// 		return $ocLazyLoad.load({
				// 			name: "preQuoteApp",
				// 			files: [
				// 				'assets/js/new-pre-quote.directive.js?v='+timeStamp,
				// 				'assets/js/new-pre-quote.controller.js?v='+timeStamp
				// 			]
				// 		})
				// 	}]
				// }
			})
			.when('/pre-quote', {
				title: 'Buy Health Insurance Online - Aditya Birla Health Insurance',
				templateUrl: 'partials/pre-quote.html?v='+timeStamp,
				controller: 'preQuoteApp',
				controllerAs: "pQA",
				metaDescription: "Buy Health Insurance plans by Aditya Birla Capital and secure yourself against any medical emergency. Our Medical Insurance policies help you avail cashless claim services from our 3,000+ network of Hospitals. Buy Health Insurance from Aditya Birla Capital now!",
				metaKeywords: "buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "preQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								'assets/js/pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/refer-friend', {
				title: 'Buy Health Insurance Online - Aditya Birla Health Insurance',
				templateUrl: 'partials/refer-friend.html?v='+timeStamp,
				controller: 'preQuoteApp',
				controllerAs: "pQA",
				metaDescription: "Buy Health Insurance plans by Aditya Birla Capital and secure yourself against any medical emergency. Our Medical Insurance policies help you avail cashless claim services from our 3,000+ network of Hospitals. Buy Health Insurance from Aditya Birla Capital now!",
				metaKeywords: "buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "preQuoteApp",
							files: [
								'assets/js/refer-friend.directive.js?v='+timeStamp,
								'assets/js/refer-friend.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/refer-friend-new', {
				title: 'Buy Health Insurance Online - Aditya Birla Health Insurance',
				templateUrl: 'partials/refer-friend-new.html?v='+timeStamp,
				controller: 'preQuoteApp',
				controllerAs: "pQA",
				metaDescription: "Buy Health Insurance plans by Aditya Birla Capital and secure yourself against any medical emergency. Our Medical Insurance policies help you avail cashless claim services from our 3,000+ network of Hospitals. Buy Health Insurance from Aditya Birla Capital now!",
				metaKeywords: "buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'refer-friend-new');
						return $ocLazyLoad.load({
							name: "preQuoteApp",
							files: [
								'assets/js/refer-friend-new.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/premium-calculator', {
				title: 'Health Insurance Premium Calculator: Mediclaim Policy Premium Calculator - Aditya Birla Health Insurance',
				templateUrl: 'partials/calculate-preminum.html?v='+timeStamp,
				controller: 'preQuoteApp',
				controllerAs: "pQA",
				metaDescription: "Mediclaim premium calculator helps you calculate your heath insurance costs. Click here to calculate your medical insurance premium online hassle free.",
				metaKeywords: "buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'calculate-preminum');
						return $ocLazyLoad.load({
							name: "preQuoteApp",
							files: [
								'assets/js/calculate-preminum.directive.js?v='+timeStamp,
								'assets/js/calculate-preminum.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/new-pre-quote', {
				title: 'Buy Health Insurance Online - Aditya Birla Health Insurance',
				templateUrl: 'partials/pre-quote.html?v='+timeStamp,
				controller: 'preQuoteApp',
				controllerAs: "pQA",
				metaDescription: "Buy Health Insurance plans by Aditya Birla Capital and secure yourself against any medical emergency. Our Medical Insurance policies help you avail cashless claim services from our 3,000+ network of Hospitals. Buy Health Insurance from Aditya Birla Capital now!",
				metaKeywords: "buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "preQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								'assets/js/pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/camp-pre-quote', {
				redirectTo: '/pre-quote'
			})
			.when('/whats-app-call', {
				title: 'Buy Health Insurance- Platinum Activ Health by Aditya Birla Health Insurance',
				templateUrl: 'partials/whats-app-call.html?v='+timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Buy Activ Health Platinum plans from Aditya Birla Health Insurance and get upto 30% premium returns to stay fit and healthy. Secure yourself with any medical emergency with the best Mediclaim Policy and health Insurance plans by Aditya Birla Capital. Get your free quote now!",
				metaKeywords: "buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/whats-app-call.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/diamond-pre-quote', {
				title: 'Buy Health Insurance- Platinum Activ Health by Aditya Birla Health Insurance',
				templateUrl: 'partials/new-hili.html?v='+timeStamp,
				controller: 'hiliController',
				controllerAs: "ePQA",
				metaDescription: "Buy Activ Health Platinum plans from Aditya Birla Health Insurance and get upto 30% premium returns to stay fit and healthy. Secure yourself with any medical emergency with the best Mediclaim Policy and health Insurance plans by Aditya Birla Capital. Get your free quote now!",
				metaKeywords: "buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'new-hili');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								'assets/js/new-hili.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-health-pre-quote', {
				title: 'Buy Health Insurance- Platinum Activ Health by Aditya Birla Health Insurance',
				templateUrl: 'partials/ext-pre-quote.html?v='+timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Buy Activ Health Platinum plans from Aditya Birla Health Insurance and get upto 30% premium returns to stay fit and healthy. Secure yourself with any medical emergency with the best Mediclaim Policy and health Insurance plans by Aditya Birla Capital. Get your free quote now!",
				metaKeywords: "buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								'assets/js/ext-pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-assure-pre-quote', {
				title: 'Buy Health Insurance - Activ Assure - Mediclaim Plans by Aditya Birla Capital',
				templateUrl: 'partials/ext-pre-quote.html?v='+timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Health Insurane plans for Family and Individuals by Aditya Birla Capital. Stay protected with our mediclaim insurance and Health Insurance plans. Buy Health Insurance Online Now!",
				metaKeywords: "Health insurance plans for family, buy health insurance, mediclaim, mediclaim insurance, health insurance, health insurance online, aditya birla capital health insurance.",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								'assets/js/ext-pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-secure-personal-accident-pre-quote', {
				title: 'Get Free Quote - Personal Accident Health Insurance Plans by Aditya Birla Health',
				templateUrl: 'partials/ext-pre-quote.html?v='+timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Buy Personal Accident Medical Insurance from Aditya Birla Health Insurance & protect yourself & your family financially from any kind of accident or permanent disability.",
				metaKeywords: "buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								'assets/js/ext-pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-secure-personal-accident-pre-quote-v2', {
				title: 'Get Free Quote - Personal Accident Health Insurance Plans by Aditya Birla Health',
				templateUrl: 'partials/ext-pre-quote.html?v='+timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Buy Personal Accident Medical Insurance from Aditya Birla Health Insurance & protect yourself & your family financially from any kind of accident or permanent disability.",
				metaKeywords: "buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								'assets/js/ext-pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-secure-critical-illness-pre-quote', {
				title: 'Buy Critical Illness Insurance Online - Activ Secure by Aditya Birla Health Insurance',
				templateUrl: 'partials/ext-pre-quote.html?v='+timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Protect yourself from over 64 critical illness diseases with Aditya Birla Capital's Critical Health Insurance Plans. Overcome your financial shortcoming for any Medical treatment with a critical illness mediclaim policy. Visit us now to buy your Health Insurance online.",
				metaKeywords: "Critical Illness insurance, Critical Illness policy, buy health insurance online, buy health insurance, health insurance, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								'assets/js/ext-pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-secure-cancer-secure-pre-quote', {
				title: 'Cancer Insurance Policy - Health Insurance Online by Aditya Birla Capital',
				templateUrl: 'partials/ext-pre-quote.html?v='+timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Cancer Insurance Policy by Aditya Birla Capital protects you from heavy costs of cancer treatment. Secure yourself financially and fight cancer with Aditya Birla Capital’s Cancer Secure plans.",
				metaKeywords: "Cancer insurance, cancer insurance policy, buy health insurance online, buy health insurance, health insurance, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								'assets/js/ext-pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-care-pre-quote', {
				title: 'Buy Health Insurance- Activ Care Activ Health by Aditya Birla Health Insurance',
				templateUrl: 'partials/ext-pre-quote.html?v='+timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Cancer Insurance Policy by Aditya Birla Capital protects you from heavy costs of cancer treatment. Secure yourself financially and fight cancer with Aditya Birla Capital’s Cancer Secure plans.",
				metaKeywords: "Cancer insurance, cancer insurance policy, buy health insurance online, buy health insurance, health insurance, aditya birla capital health insurance online, aditya birla capital health insurance",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								'assets/js/ext-pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/super-health-plus-top-tp-plus-activ-assure', {
				title: 'Buy Health Insurance - Activ Assure - Mediclaim Plans by Aditya Birla Capital',
				templateUrl: 'partials/ext-pre-quote.html?v=' + timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Health Insurane plans for Family and Individuals by Aditya Birla Capital. Stay protected with our mediclaim insurance and Health Insurance plans. Buy Health Insurance Online Now!",
				metaKeywords: "Health insurance plans for family, buy health insurance, mediclaim, mediclaim insurance, health insurance, health insurance online, aditya birla capital health insurance.",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v=' + timeStamp,
								"assets/js/addMember.directive.js?v=" + timeStamp,
								'assets/js/ext-pre-quote.controller.js?v=' + timeStamp
							]
						})
					}]
				}
			})
			.when('/corona-kavach-pre-quote', {
				title: 'Buy Health Insurance - Corona-Kavach - Mediclaim Plans by Aditya Birla Capital',
				templateUrl: 'partials/ext-pre-quote.html?v='+timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Health Insurane plans for Family and Individuals by Aditya Birla Capital. Stay protected with our mediclaim insurance and Health Insurance plans. Buy Health Insurance Online Now!",
				metaKeywords: "Health insurance plans for family, buy health insurance, mediclaim, mediclaim insurance, health insurance, health insurance online, aditya birla capital health insurance.",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								'assets/js/ext-pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/arogya-sanjeevani-pre-quote', {
				title: 'Buy Health Insurance - Arogya Sanjeevani - Mediclaim Plans by Aditya Birla Capital',
				templateUrl: 'partials/ext-pre-quote.html?v='+timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Health Insurane plans for Family and Individuals by Aditya Birla Capital. Stay protected with our mediclaim insurance and Health Insurance plans. Buy Health Insurance Online Now!",
				metaKeywords: "Health insurance plans for family, buy health insurance, mediclaim, mediclaim insurance, health insurance, health insurance online, aditya birla capital health insurance.",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								'assets/js/ext-pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-fit-pre-quote', {
				title: 'Buy Health Insurance - Activ Fit - by Aditya Birla Capital',
				templateUrl: 'partials/ext-pre-quote.html?v='+timeStamp,
				controller: 'extPreQuote',
				controllerAs: "ePQA",
				metaDescription: "Health Insurane plans for Family and Individuals by Aditya Birla Capital. Stay protected with our mediclaim insurance and Health Insurance plans. Buy Health Insurance Online Now!",
				metaKeywords: "Health insurance plans for family, buy health insurance, mediclaim, mediclaim insurance, health insurance, health insurance online, aditya birla capital health insurance.",
				resolve: {
					extPreQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pre-quote');
						return $ocLazyLoad.load({
							name: "extPreQuoteApp",
							files: [
								'assets/js/pre-quote.directive.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								'assets/js/ext-pre-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/reco', {
				title: 'Reco - Aditya Birla Health Insurance',
				templateUrl: 'partials/reco.html?v='+timeStamp,
				controller: 'recoQuoteApp',
				controllerAs: "rC",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'reco');
						return $ocLazyLoad.load({
							name: "recoQuoteApp",
							files: [
								"assets/css-min/slick.css?v="+timeStamp,
								"assets/css-min/activ-care-add-modal.css?v="+timeStamp,
								"assets/js/slick.js?v="+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								"assets/js/aCAddMember.directive.js?v="+timeStamp,
								'assets/js/reco.controller.js?v='+timeStamp,
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
							]
						})
					}]
				}
			})
			.when('/plans', {
				title: 'Plans - Aditya Birla Health Insurance',
				templateUrl: 'partials/plans.html?v='+timeStamp,
				controller: 'plansQuoteCtrl',
				controllerAs: "pC",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'plans');
						return $ocLazyLoad.load({
							name: "plansQuoteApp",
							files: [
								"assets/css-min/slick.css?v="+timeStamp,
								"assets/js/slick.js?v="+timeStamp,
								'assets/js/plans.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			/*.when('/diamond-quote', {
				title: 'Diamond Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/aa-quote.html?v='+timeStamp,
				controller: 'activeAssure',
				controllerAs: "aA",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'aa-quote');
						return $ocLazyLoad.load({
							name: "activeAssure",
							files: [
								"assets/js/addMember.directive.js?v="+timeStamp,
								"assets/js/cross-sell-quote.js?v="+timeStamp,
								'assets/js/aa-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/diamond-stp-quote', {
				title: 'Diamond Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/aa-quote.html?v='+timeStamp,
				controller: 'activeAssure',
				controllerAs: "aA",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'aa-quote');
						return $ocLazyLoad.load({
							name: "activeAssure",
							files: [
								"assets/js/addMember.directive.js?v="+timeStamp,
								"assets/js/cross-sell-quote.js?v="+timeStamp,
								'assets/js/aa-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			*/

			/*.when('/platinum-quote', {

				title: 'Platinum Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/platinum-quote.html?v='+timeStamp,
				controller: 'platinumQuote',
				controllerAs: "plA",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'platinum-quote');
						return $ocLazyLoad.load({
							name: "activeAssure",
							files: [
								"assets/js/cross-sell-quote.js?v="+timeStamp,
								'assets/js/platinum-quote.controller.js?v='+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp
							]
						})
					}]
				}
			})*/
			.when('/platinum-quote', {
				title: 'Activ Health Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/platinum-quote-v2.html?v=' + timeStamp,
				controller: 'platinumQuoteNewQuoteController',
				controllerAs: "pLV",
				resolve: {
					preQuoteApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'platinum-quote-v2');
						return $ocLazyLoad.load({
							name: "platinumQuoteNewQuoteApp",
							files: [
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
								"assets/js/addMember.directive.js?v=" + timeStamp,

								"assets/js/platinum-quote-v2.controller.js?v=" + timeStamp
							]
						})
					}]
				}
			})
			.when('/diamond-stp-quote', {
					title: 'Diamond Quote - Aditya Birla Health Insurance',
					templateUrl: 'partials/diamond-quote.html?v=' + timeStamp,
					controller: 'diQuoteApp',
					controllerAs: "diA",
					resolve: {
						preQuoteApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
							removeLazyLoadedCSS(timeStamp, 'diamond-quote');
							return $ocLazyLoad.load({
								name: "diQuoteApp",
								files: [
									"assets/css-min/owl.carousel.css?v=" + timeStamp,
									"assets/js/owl.carousel.js?v=" + timeStamp,
									"assets/js/addMember.directive.js?v=" + timeStamp,
									"assets/js/cross-sell-quote.js?v=" + timeStamp,
		 

									"assets/js/diamond-quote.controller.js?v=" + timeStamp
								]
							})
						}]
					}
				})
				.when('/diamond-quote', {
					title: 'Diamond Quote - Aditya Birla Health Insurance',
					templateUrl: 'partials/diamond-quote.html?v=' + timeStamp,
					controller: 'diQuoteApp',
					controllerAs: "diA",
					resolve: {
						preQuoteApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
							removeLazyLoadedCSS(timeStamp, 'diamond-quote');
							return $ocLazyLoad.load({
								name: "diQuoteApp",
								files: [
									"assets/css-min/owl.carousel.css?v=" + timeStamp,
									"assets/js/owl.carousel.js?v=" + timeStamp,
									"assets/js/addMember.directive.js?v=" + timeStamp,
									"assets/js/cross-sell-quote.js?v=" + timeStamp,
									"assets/js/diamond-quote.controller.js?v=" + timeStamp
								]
							})
						}]
					}
				})
			.when('/sale-preminum-cal', {
				title: 'Corona Kavach Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/sales-preminum-cal.html?v=' + timeStamp,
				controller: 'salePreminumCalQuote',
				controllerAs: "sPC",
				resolve: {
					preQuoteApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'sales-preminum-cal');
						return $ocLazyLoad.load({
							name: "salePreminumCalApp",
							files: [
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
								"assets/js/addMember.directive.js?v=" + timeStamp,

								"assets/js/sales-preminum-cal.controller.js?v=" + timeStamp
							]
						})
					}]
				}
			})
			.when('/pa-quote', {
				title: 'Personal Accident Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/pa-quote.html?v='+timeStamp,
				controller: 'pAQuoteCtrl',
				controllerAs: "pA",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pa-quote');
						return $ocLazyLoad.load({
							name: "pAQuoteApp",
							files: [
								"assets/css-min/owl.carousel.css?v="+timeStamp,
								"assets/js/owl.carousel.js?v="+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								"assets/js/cross-sell-quote.js?v="+timeStamp,
								'assets/js/pa-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/pa-quote-v2', {
				title: 'Personal Accident Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/pa-v2-quote.html?v='+timeStamp,
				controller: 'pAQuoteCtrl',
				controllerAs: "pA",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pa-quote');
						return $ocLazyLoad.load({
							name: "pAQuoteApp",
							files: [
								"assets/css-min/insured-detail.css?v="+timeStamp,
								"assets/css-min/owl.carousel.css?v="+timeStamp,
								"assets/js/owl.carousel.js?v="+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								"assets/js/cross-sell-quote.js?v="+timeStamp,
								'assets/js/pa-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/pa-customize-quote', {
				title: 'Personal Accident Customize Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/pa-customize-quote.html?v='+timeStamp,
				controller: 'pACustQuoteCtrl',
				controllerAs: "pAC",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'pa-quote');
						return $ocLazyLoad.load({
							name: "pACustQuote",
							files: [
								"assets/css-min/owl.carousel.css?v="+timeStamp,
								"assets/js/owl.carousel.js?v="+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								"assets/js/cross-sell-quote.js?v="+timeStamp,
								'assets/js/pa-cust-quote.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})
			.when('/ci-quote', {
				title: 'Critical Illness Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/ci-quote.html?v='+timeStamp,
				controller: 'ciQuoteAppCtrl',
				controllerAs: "cI",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'ci-quote');
						return $ocLazyLoad.load({
							name: "ciQuoteApp",
							files: [
								"assets/css-min/owl.carousel.css?v="+timeStamp,
								"assets/js/owl.carousel.js?v="+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								"assets/js/cross-sell-quote.js?v="+timeStamp,
								"assets/js/ci-quote.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/cs-quote', {
				title: 'Cancer Secure Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/cs-quote.html?v='+timeStamp,
				controller: 'csQuoteApp',
				controllerAs: "cS",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'cs-quote');
						return $ocLazyLoad.load({
							name: "csQuoteApp",
							files: [
								"assets/css-min/owl.carousel.css?v="+timeStamp,
								"assets/js/owl.carousel.js?v="+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								"assets/js/cross-sell-quote.js?v="+timeStamp,
								"assets/js/cs-quote.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-care-quote', {
				title: 'Active Care Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/activ-care-quote.html?v='+timeStamp,
				controller: 'activCareQuoteApp',
				controllerAs: "aC",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'activ-care-quote');
						return $ocLazyLoad.load({
							name: "activCareQuoteApp",
							files: [
								"assets/css-min/owl.carousel.css?v="+timeStamp,
								"assets/css-min/activ-care-add-modal.css?v="+timeStamp,
								"assets/js/owl.carousel.js?v="+timeStamp,
								"assets/js/aCAddMember.directive.js?v="+timeStamp,
								"assets/js/cross-sell-quote.js?v="+timeStamp,
								"assets/js/activ-care-quote.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/corona-kavach-quote', {
				title: 'Corona Kavach Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/corona-kavach-quote.html?v='+timeStamp,
				controller: 'activCareQuoteApp',
				controllerAs: "cK",
				resolve: {
					preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'corona-kavach-quote');
						return $ocLazyLoad.load({
							name: "activCareQuoteApp",
							files: [
								"assets/css-min/owl.carousel.css?v="+timeStamp,
								"assets/js/owl.carousel.js?v="+timeStamp,
								"assets/js/addMember.directive.js?v="+timeStamp,
								
								"assets/js/corona-kavach-quote.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/arogya-sanjeevani-quote', {
				title: 'Arogya Sanjeevani Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/arogya-sanjeevani-quote.html?v=' + timeStamp,
				controller: 'arogyaSanjeevaniQuoteApp',
				controllerAs: "aRS",
				resolve: {
					preQuoteApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'arogya-sanjeevani-quote');
						return $ocLazyLoad.load({
							name: "arogyaSanjeevaniQuoteApp",
							files: [
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
								"assets/js/addMember.directive.js?v=" + timeStamp,
								"assets/js/arogya-sanjeevani-quote.controller.js?v=" + timeStamp
							]
						})
					}]
				}
			})
			.when('/fit-quote', {
				title: 'Activ Health Quote - Aditya Birla Health Insurance',
				templateUrl: 'partials/activ-fit-quote.html?v=' + timeStamp,
				controller: 'activFitQuoteController',
				controllerAs: "aFV",
				resolve: {
					preQuoteApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'activ-fit-quote');
						return $ocLazyLoad.load({
							name: "activFitQuoteApp",
							files: [
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
								"assets/js/addMember.directive.js?v=" + timeStamp,
								"assets/js/activ-fit-quote.controller.js?v=" + timeStamp
							]
						})
					}]
				}
			})
			.when('/juspay-status', {
				title: 'Juspay - Aditya Birla Health Insurance',
				templateUrl: 'partials/jus-pay-status.html?v=' + timeStamp,
				controller: 'juspayController',
				controllerAs: "jpV",
				resolve: {
					juspayApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'jus-pay-status');
						return $ocLazyLoad.load({
							name: "juspayApp",
							files: [
								"assets/js/jus-pay-status.controller.js"
							]
						})
					}]
				}
			})
			.when('/platinum-proposer-details', {
				title: 'Platinum Proposer Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/proposer-details.html?v='+timeStamp,
				controller: 'proposerDetailsCtrl',
				controllerAs: "pDC",
				resolve: {
					proposerDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'proposer-details');
						return $ocLazyLoad.load({
							name: "proposerDetailsApp",
							files: [
								"assets/js/proposer-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/fit-proposer-details', {
				title: 'Fit Proposer Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/proposer-details.html?v='+timeStamp,
				controller: 'proposerDetailsCtrl',
				controllerAs: "pDC",
				resolve: {
					proposerDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'proposer-details');
						return $ocLazyLoad.load({
							name: "proposerDetailsApp",
							files: [
								"assets/js/proposer-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/diamond-proposer-details', {
				title: 'Diamond Proposer Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/proposer-details.html?v='+timeStamp,
				controller: 'proposerDetailsCtrl',
				controllerAs: "pDC",
				resolve: {
					proposerDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'proposer-details');
						return $ocLazyLoad.load({
							name: "proposerDetailsApp",
							files: [
								"assets/css-min/proposer-details.css?v="+timeStamp,
								"assets/js/proposer-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/rfb-proposer-details', {
				title: 'RFB Proposer Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/proposer-details.html?v='+timeStamp,
				controller: 'proposerDetailsCtrl',
				controllerAs: "pDC",
				resolve: {
					proposerDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'proposer-details');
						return $ocLazyLoad.load({
							name: "proposerDetailsApp",
							files: [
								"assets/js/proposer-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-care-proposer-details', {
				title: 'Activ Care Proposer Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/proposer-details.html?v='+timeStamp,
				controller: 'proposerDetailsCtrl',
				controllerAs: "pDC",
				resolve: {
					proposerDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'proposer-details');
						return $ocLazyLoad.load({
							name: "proposerDetailsApp",
							files: [
								"assets/js/proposer-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
	/* Premium calculator */
	.when('/sale-preminum-cal', {
		title: 'Sale Preminum Calulator - Aditya Birla Health Insurance',
		templateUrl: 'partials/sales-preminum-cal.html?v=' + timeStamp,
		controller: 'salePreminumCalQuote',
		controllerAs: "sPC",
		resolve: {
			preQuoteApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
				removeLazyLoadedCSS(timeStamp, 'sales-preminum-cal');
				return $ocLazyLoad.load({
					name: "salePreminumCalApp",
					files: [
						"assets/css-min/owl.carousel.css?v=" + timeStamp,
						"assets/js/owl.carousel.js?v=" + timeStamp,
						"assets/js/addMember.directive.js?v=" + timeStamp,

						"assets/js/sales-preminum-cal.controller.js?v=" + timeStamp
					]
				})
			}]
		}
	})
	/* premium calculator */
			.when('/corona-kavach-proposer-details', {
				title: 'Corona Kavach Proposer Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/proposer-details.html?v='+timeStamp,
				controller: 'proposerDetailsCtrl',
				controllerAs: "pDC",
				resolve: {
					proposerDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'proposer-details');
						return $ocLazyLoad.load({
							name: "proposerDetailsApp",
							files: [
								"assets/js/proposer-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/arogya-sanjeevani-proposer-details', {
				title: 'Arogya Sanjeevani Proposer Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/proposer-details.html?v=' + timeStamp,
				controller: 'proposerDetailsCtrl',
				controllerAs: "pDC",
				resolve: {
					proposerDetailsApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'proposer-details');
						return $ocLazyLoad.load({
							name: "proposerDetailsApp",
							files: [
								"assets/js/proposer-details.controller.js?v=" + timeStamp
							]
						})
					}]
				}
			})
			.when('/cross-sell-proposer-details', {
				title: 'Cross sell Proposer Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/proposer-details.html?v='+timeStamp,
				controller: 'proposerDetailsCtrl',
				controllerAs: "pDC",
				resolve: {
					proposerDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'proposer-details');
						return $ocLazyLoad.load({
							name: "proposerDetailsApp",
							files: [
								"assets/js/proposer-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			
			.when('/platinum-insured-details', {
				title: 'Platinum Insured Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/insured-detail.html?v='+timeStamp,
				controller: 'insuredDetails',
				controllerAs: "iDC",
				resolve: {
					insuredDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'insured-detail');
						return $ocLazyLoad.load({
							name: "insuredDetailsApp",
							files: [
								"assets/css-min/insured-detail.css?v="+timeStamp,
								"assets/js/insured-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/diamond-insured-details', {
				title: 'Diamond Insured Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/insured-detail.html?v='+timeStamp,
				controller: 'insuredDetails',
				controllerAs: "iDC",
				resolve: {
					insuredDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'insured-detail');		
						return $ocLazyLoad.load({
							name: "insuredDetailsApp",
							files: [
								"assets/js/insured-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-care-insured-details', {
				title: 'Activ Care Insured Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/insured-detail.html?v='+timeStamp,
				controller: 'insuredDetails',
				controllerAs: "iDC",
				resolve: {
					insuredDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'insured-detail');
						return $ocLazyLoad.load({
							name: "insuredDetailsApp",
							files: [
								"assets/css-min/insured-detail.css?v="+timeStamp,
								"assets/js/insured-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/corona-kavach-insured-details', {
				title: 'Corona Kavach Insured Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/insured-detail.html?v='+timeStamp,
				controller: 'insuredDetails',
				controllerAs: "iDC",
				resolve: {
					insuredDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'insured-detail');
						return $ocLazyLoad.load({
							name: "insuredDetailsApp",
							files: [
								"assets/css-min/insured-detail.css?v="+timeStamp,
								"assets/js/insured-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/arogya-sanjeevani-insured-details', {
				title: 'Arogya Sanjeevani Insured Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/insured-detail.html?v=' + timeStamp,
				controller: 'insuredDetails',
				controllerAs: "iDC",
				resolve: {
					insuredDetailsApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'insured-detail');
						return $ocLazyLoad.load({
							name: "insuredDetailsApp",
							files: [
								"assets/css-min/insured-detail.css?v=" + timeStamp,
								"assets/js/insured-details.controller.js?v=" + timeStamp
							]
						})
					}]
				}
			})
			.when('/fit-insured-details', {
				title: 'Fit Insured Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/insured-detail.html?v='+timeStamp,
				controller: 'insuredDetails',
				controllerAs: "iDC",
				resolve: {
					insuredDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'insured-detail');
						return $ocLazyLoad.load({
							name: "insuredDetailsApp",
							files: [
								"assets/css-min/insured-detail.css?v="+timeStamp,
								"assets/js/insured-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/rfb-insured-details', {
				title: 'RFB Insured Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/insured-detail.html?v='+timeStamp,
				controller: 'insuredDetails',
				controllerAs: "iDC",
				resolve: {
					insuredDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'insured-detail');
						return $ocLazyLoad.load({
							name: "insuredDetailsApp",
							files: [
								"assets/css-min/insured-detail.css?v="+timeStamp,
								"assets/js/insured-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/cross-sell-insured-details', {
				title: 'Cross sell Insured Details - Aditya Birla Health Insurance',
				templateUrl: 'partials/insured-detail.html?v='+timeStamp,
				controller: 'insuredDetails',
				controllerAs: "iDC",
				crossSell: true,
				resolve: {
					insuredDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'insured-detail');
						return $ocLazyLoad.load({
							name: "insuredDetailsApp",
							files: [
								"assets/js/insured-details.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/platinum-health-lifestyle', {
				title: 'Platinum Health and Lifestyle - Aditya Birla Health Insurance',
				templateUrl: 'partials/health-lifestyle.html?v='+timeStamp,
				controller: 'healthLifeStyle',
				controllerAs: "pLS",
				resolve: {
					healthStyleApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'health-lifestyle');
						return $ocLazyLoad.load({
							name: "healthStyleApp",
							files: [
								"assets/js/health-lifestyle.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/fit-health-lifestyle', {
				title: 'Fit Health and Lifestyle - Aditya Birla Health Insurance',
				templateUrl: 'partials/health-lifestyle.html?v='+timeStamp,
				controller: 'healthLifeStyle',
				controllerAs: "pLS",
				resolve: {
					healthStyleApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'health-lifestyle');
						return $ocLazyLoad.load({
							name: "healthStyleApp",
							files: [
								"assets/js/health-lifestyle.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/diamond-health-lifestyle', {
				title: 'Diamond Health and Lifestyle - Aditya Birla Health Insurance',
				templateUrl: 'partials/health-lifestyle.html?v='+timeStamp,
				controller: 'healthLifeStyle',
				controllerAs: "pLS",
				resolve: {
					healthStyleApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'health-lifestyle');
						return $ocLazyLoad.load({
							name: "healthStyleApp",
							files: [
								"assets/js/health-lifestyle.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-care-health-lifestyle', {
				title: 'Activ Care Health and Lifestyle - Aditya Birla Health Insurance',
				templateUrl: 'partials/health-lifestyle.html?v='+timeStamp,
				controller: 'healthLifeStyle',
				controllerAs: "pLS",
				resolve: {
					healthStyleApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'health-lifestyle');
						return $ocLazyLoad.load({
							name: "healthStyleApp",
							files: [
								"assets/js/health-lifestyle.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/corona-kavach-health-lifestyle', {
				title: 'Corona Kavach Health and Lifestyle - Aditya Birla Health Insurance',
				templateUrl: 'partials/health-lifestyle.html?v='+timeStamp,
				controller: 'healthLifeStyle',
				controllerAs: "pLS",
				resolve: {
					healthStyleApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'health-lifestyle');
						return $ocLazyLoad.load({
							name: "healthStyleApp",
							files: [
								"assets/js/health-lifestyle.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/arogya-sanjeevani-health-lifestyle', {
				title: 'Arogya Sanjeevani Health and Lifestyle - Aditya Birla Health Insurance',
				templateUrl: 'partials/health-lifestyle.html?v=' + timeStamp,
				controller: 'healthLifeStyle',
				controllerAs: "pLS",
				resolve: {
					healthStyleApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'health-lifestyle');
						return $ocLazyLoad.load({
							name: "healthStyleApp",
							files: [
								"assets/js/health-lifestyle.controller.js?v=" + timeStamp
							]
						})
					}]
				}
			})
			.when('/arogya-sanjeevani-health-lifestyle-new', {
				title: 'Arogya Sanjeevani Health and Lifestyle - Aditya Birla Health Insurance',
				templateUrl: 'partials/health-lifestyle-new.html?v=' + timeStamp,
				controller: 'healthLifeStyleNew',
				controllerAs: "pLS",
				resolve: {
					healthStyleAppNew: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'health-lifestyle-new');
						return $ocLazyLoad.load({
							name: "healthStyleAppNew",
							files: [
								"assets/js/health-lifestyle-new.controller.js?v=" + timeStamp
							]
						})
					}]
				}
			})
			.when('/rfb-health-lifestyle', {
				title: 'RFB Health and Lifestyle - Aditya Birla Health Insurance',
				templateUrl: 'partials/health-lifestyle.html?v='+timeStamp,
				controller: 'healthLifeStyle',
				controllerAs: "pLS",
				resolve: {
					healthStyleApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'health-lifestyle');
						return $ocLazyLoad.load({
							name: "healthStyleApp",
							files: [
								"assets/js/health-lifestyle.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/cross-sell-health-lifestyle', {
				title: 'Cross sell Health and Lifestyle - Aditya Birla Health Insurance',
				templateUrl: 'partials/health-lifestyle.html?v='+timeStamp,
				controller: 'healthLifeStyle',
				controllerAs: "pLS",
				crossSell: true,
				resolve: {
					healthStyleApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'health-lifestyle');
						return $ocLazyLoad.load({
							name: "healthStyleApp",
							files: [
								"assets/js/health-lifestyle.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/diamond-declaration', {
				title: 'Diamond Declaration - Aditya Birla Health Insurance',
				templateUrl: 'partials/declaration.html?v='+timeStamp,
				controller: 'declarationCtrl',
				controllerAs: "dLC",
				resolve: {
					delcarationApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'declaration');
						return $ocLazyLoad.load({
							name: "delcarationApp",
							files: [
								"assets/js/declaration.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/platinum-declaration', {
				title: 'Platinum Declaration - Aditya Birla Health Insurance',
				templateUrl: 'partials/declaration.html?v='+timeStamp,
				controller: 'declarationCtrl',
				controllerAs: "dLC",
				resolve: {
					delcarationApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'declaration');
						return $ocLazyLoad.load({
							name: "delcarationApp",
							files: [
								"assets/js/declaration.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/corona-kavach-declaration', {
				title: 'Corona Kavach Declaration - Aditya Birla Health Insurance',
				templateUrl: 'partials/declaration.html?v='+timeStamp,
				controller: 'declarationCtrl',
				controllerAs: "dLC",
				resolve: {
					delcarationApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'declaration');
						return $ocLazyLoad.load({
							name: "delcarationApp",
							files: [
								"assets/js/declaration.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/arogya-sanjeevani-declaration', {
				title: 'Arogya Sanjeevani Declaration - Aditya Birla Health Insurance',
				templateUrl: 'partials/declaration.html?v=' + timeStamp,
				controller: 'declarationCtrl',
				controllerAs: "dLC",
				resolve: {
					delcarationApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'declaration');
						return $ocLazyLoad.load({
							name: "delcarationApp",
							files: [
								"assets/js/declaration.controller.js?v=" + timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-care-declaration', {
				title: 'Activ Care Declaration - Aditya Birla Health Insurance',
				templateUrl: 'partials/declaration.html?v='+timeStamp,
				controller: 'declarationCtrl',
				controllerAs: "dLC",
				resolve: {
					delcarationApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'declaration');
						return $ocLazyLoad.load({
							name: "delcarationApp",
							files: [
								"assets/js/declaration.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/fit-declaration', {
				title: 'Fit Declaration - Aditya Birla Health Insurance',
				templateUrl: 'partials/declaration.html?v='+timeStamp,
				controller: 'declarationCtrl',
				controllerAs: "dLC",
				resolve: {
					delcarationApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'declaration');
						return $ocLazyLoad.load({
							name: "delcarationApp",
							files: [
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
								"assets/js/declaration.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/rfb-declaration', {
				title: 'RFB Declaration - Aditya Birla Health Insurance',
				templateUrl: 'partials/declaration.html?v='+timeStamp,
				controller: 'declarationCtrl',
				controllerAs: "dLC",
				resolve: {
					delcarationApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'declaration');
						return $ocLazyLoad.load({
							name: "delcarationApp",
							files: [
								"assets/js/declaration.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/cross-sell-declaration', {
				title: 'Cross sell Declaration - Aditya Birla Health Insurance',
				templateUrl: 'partials/declaration.html?v='+timeStamp,
				controller: 'declarationCtrl',
				controllerAs: "dLC",
				resolve: {
					delcarationApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'declaration');
						return $ocLazyLoad.load({
							name: "delcarationApp",
							files: [
								"assets/js/declaration.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/paymentResponse', {
				title: 'Payment Processing - Aditya Birla Health Insurance',
				templateUrl: 'partials/payment-processing.html?v='+timeStamp,
				controller: 'paymentResponse',
				controllerAs: "pAY",
				resolve: {
					paymentApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						return $ocLazyLoad.load({
							name: "paymentApp",
							files: [
								"assets/js/payment-processing.controller.js?v="+timeStamp,
							]
						})
					}]
				}
			})
			.when('/paymentProcess', {
				title: 'Payment Processing - Aditya Birla Health Insurance',
				template: '',
				controller: function($timeout,$location){
					$timeout(function(){
						var pData = JSON.parse(sessionStorage.getItem('responseData'));
						if (pData.Page == "PQ") { /* If PQ then redirect to Post Payment */
							if (pData.Product.length > 1) {
								$location.url('cross-sell-post-payment?product='+sessionStorage.getItem('productSelctedInCross'));
							}  else if (pData.Product[0] == 'PL') {
								$location.url('platinum-post-payment');
							}else if (pData.Product[0] == 'FIT') {
								$location.url('fit-post-payment');
							} else if (pData.Product[0] == 'DI') {
								$location.url('diamond-post-payment');
							} else if (pData.Product[0] == 'AC') {
								$location.url('activ-care-post-payment');
							} else if (pData.Product[0] == 'AS') {
								$location.url('arogya-sanjeevani-post-payment');
							} else if (pData.Product[0] == 'PA' || pData.Product[0] == 'CI' || pData.Product[0] == 'CS') {
								$location.url('rfb-post-payment');
							}
						} else {
							if (pData.Product.length > 1) { /* If TY then redirect to thank you page */
								$location.url('cross-sell-thank-you?product='+sessionStorage.getItem('productSelctedInCross'));
							} else if (pData.Product[0] == 'PL') {
								$location.url('platinum-thank-you');
							} else if (pData.Product[0] == 'FIT') {
								$location.url('Fit-thank-you');
							} else if (pData.Product[0] == 'DI') {
								$location.url('diamond-thank-you');
							} else if (pData.Product[0] == 'AC') {
								$location.url('activ-care-thank-you');
							} else if (pData.Product[0] == 'CK') {
								$location.url('corona-kavach-thank-you');
							} else if (pData.Product[0] == 'AS') {
								$location.url('arogya-sanjeevani-thank-you');
							} else if (pData.Product[0] == 'PA' || pData.Product[0] == 'CI' || pData.Product[0] == 'CS') {
								$location.url('rfb-thank-you');
							}
						}
					},1000);
				},			       
			})
			.when('/url-process/:urlKey', {
				templateUrl: 'partials/url-processing.html?v='+timeStamp,
				controller: 'urlProcess',
				controllerAs: "uP",
				resolve: {
					urlProcessApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						return $ocLazyLoad.load({
							name: "urlProcessApp",
							files: [
								"assets/js/url-processing.controller.js?v="+timeStamp,
							]
						})
					}]
				}
			})
			.when('/platinum-post-payment', {
				title: 'Platinum Post Payment - Aditya Birla Health Insurance',
				templateUrl: 'partials/post-payment.html?v='+timeStamp,
				controller: 'postPaymentCtrl',
				controllerAs: "pPC",
				resolve: {
					postPaymentApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'post-payment');
						return $ocLazyLoad.load({
							name: "postPaymentApp",
							files: [
								"assets/js/post-payment.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/diamond-post-payment', {
				title: 'Diamond Post Payment - Aditya Birla Health Insurance',
				templateUrl: 'partials/post-payment.html?v='+timeStamp,
				controller: 'postPaymentCtrl',
				controllerAs: "pPC",
				resolve: {
					postPaymentApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'post-payment');
						return $ocLazyLoad.load({
							name: "postPaymentApp",
							files: [
								"assets/js/post-payment.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/activ-care-post-payment', {
				title: 'Active Care Post Payment - Aditya Birla Health Insurance',
				templateUrl: 'partials/post-payment.html?v='+timeStamp,
				controller: 'postPaymentCtrl',
				controllerAs: "pPC",
				resolve: {
					postPaymentApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'post-payment');
						return $ocLazyLoad.load({
							name: "postPaymentApp",
							files: [
								"assets/js/post-payment.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/arogya-sanjeevani-post-payment', {
				title: 'Arogya Sanjeevani Post Payment - Aditya Birla Health Insurance',
				templateUrl: 'partials/post-payment.html?v=' + timeStamp,
				controller: 'postPaymentCtrl',
				controllerAs: "pPC",
				resolve: {
					postPaymentApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'post-payment');
						return $ocLazyLoad.load({
							name: "postPaymentApp",
							files: [
								"assets/js/post-payment.controller.js?v=" + timeStamp
							]
						})
					}]
				}
			})
			.when('/rfb-post-payment', {
				title: 'RFB Post Payment - Aditya Birla Health Insurance',
				templateUrl: 'partials/post-payment.html?v='+timeStamp,
				controller: 'postPaymentCtrl',
				controllerAs: "pPC",
				resolve: {
					postPaymentApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'post-payment');
						return $ocLazyLoad.load({
							name: "postPaymentApp",
							files: [
								"assets/js/post-payment.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/cross-sell-post-payment', {
				title: 'Cross sell Post Payment - Aditya Birla Health Insurance',
				templateUrl: 'partials/post-payment.html?v='+timeStamp,
				controller: 'postPaymentCtrl',
				controllerAs: "pPC",
				resolve: {
					postPaymentApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'post-payment');
						return $ocLazyLoad.load({
							name: "postPaymentApp",
							files: [
								"assets/js/post-payment.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/diamond-thank-you', {
				title: 'Diamond Thank You - Aditya Birla Health Insurance',
				templateUrl: 'partials/thank-you.html?v='+timeStamp,
				controller: 'thankYou',
				controllerAs: "tY",
				resolve: {
					diathankYouApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'thank-you');
						return $ocLazyLoad.load({
							name: "thankYouApp",
							files: [
								"assets/js/thank-you.controller.js?v="+timeStamp,
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
							]
						})
					}]
				}
			})
			.when('/fit-post-payment', {
				title: 'Platinum Post Payment - Aditya Birla Health Insurance',
				templateUrl: 'partials/post-payment.html?v='+timeStamp,
				controller: 'postPaymentCtrl',
				controllerAs: "pPC",
				resolve: {
					postPaymentApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'post-payment');
						return $ocLazyLoad.load({
							name: "postPaymentApp",
							files: [
								"assets/js/post-payment.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			.when('/Fit-thank-you', {
				title: 'Platinum Thank You - Aditya Birla Health Insurance',
				templateUrl: 'partials/thank-you.html?v='+timeStamp,
				controller: 'thankYou',
				controllerAs: "tY",
				resolve: {
					diathankYouApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'thank-you');
						return $ocLazyLoad.load({
							name: "thankYouApp",
							files: [
								"assets/js/thank-you.controller.js?v="+timeStamp,
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
							]
						})
					}]
				}
			})
			.when('/platinum-thank-you', {
				title: 'Platinum Thank You - Aditya Birla Health Insurance',
				templateUrl: 'partials/thank-you.html?v='+timeStamp,
				controller: 'thankYou',
				controllerAs: "tY",
				resolve: {
					diathankYouApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'thank-you');
						return $ocLazyLoad.load({
							name: "thankYouApp",
							files: [
								"assets/js/thank-you.controller.js?v="+timeStamp,
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
							]
						})
					}]
				}
			})
			.when('/activ-care-thank-you', {
				title: 'Activ Care Thank You - Aditya Birla Health Insurance',
				templateUrl: 'partials/thank-you.html?v='+timeStamp,
				controller: 'thankYou',
				controllerAs: "tY",
				resolve: {
					diathankYouApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'thank-you');
						return $ocLazyLoad.load({
							name: "thankYouApp",
							files: [
								"assets/js/thank-you.controller.js?v="+timeStamp,
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
							]
						})
					}]
				}
			})
			.when('/corona-kavach-thank-you', {
				title: 'Corona-Kavach Thank You - Aditya Birla Health Insurance',
				templateUrl: 'partials/thank-you.html?v='+timeStamp,
				controller: 'thankYou',
				controllerAs: "tY",
				resolve: {
					diathankYouApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'thank-you');
						return $ocLazyLoad.load({
							name: "thankYouApp",
							files: [
								"assets/js/thank-you.controller.js?v="+timeStamp,
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
							]
						})
					}]
				}
			})
			.when('/arogya-sanjeevani-thank-you', {
				title: 'Arogya Sanjeevani Thank You - Aditya Birla Health Insurance',
				templateUrl: 'partials/thank-you.html?v=' + timeStamp,
				controller: 'thankYou',
				controllerAs: "tY",
				resolve: {
					diathankYouApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
						removeLazyLoadedCSS(timeStamp, 'thank-you');
						return $ocLazyLoad.load({
							name: "thankYouApp",
							files: [
								"assets/js/thank-you.controller.js?v=" + timeStamp,
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
							]
						})
					}]
				}
			})
			.when('/rfb-thank-you', {
				title: 'RFB Thank You - Aditya Birla Health Insurance',
				templateUrl: 'partials/thank-you.html?v='+timeStamp,
				controller: 'thankYou',
				controllerAs: "tY",
				resolve: {
					diathankYouApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'thank-you');
						return $ocLazyLoad.load({
							name: "thankYouApp",
							files: [
								"assets/js/thank-you.controller.js?v="+timeStamp,
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
							]
						})
					}]
				}
			})
			.when('/cross-sell-thank-you', {
				title: 'Cross sell Thank You - Aditya Birla Health Insurance',
				templateUrl: 'partials/thank-you.html?v='+timeStamp,
				controller: 'thankYou',
				controllerAs: "tY",
				resolve: {
					diathankYouApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'thank-you');
						return $ocLazyLoad.load({
							name: "thankYouApp",
							files: [
								"assets/js/thank-you.controller.js?v="+timeStamp,
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
							]
						})
					}]
				}
			})
			.when('/payment-done', {
				title: 'Payment Done - Aditya Birla Health Insurance',
				templateUrl: 'partials/payment-done.html?v='+timeStamp,
				controller: 'paymentDone',
				controllerAs: "pD",
				resolve: {
					paymentDoneApp: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: "paymentDoneApp",
							files: [
								"assets/js/payment-done.controller.js?v="+timeStamp,
							]
						})
					}]
				}
			})

			.when('/tax-tool', {
					title: 'Tax tool',
					templateUrl: 'partials/tax-tool.html?v='+timeStamp,
					controller: 'taxToolCtrl',
					controllerAs: "tAX",
					resolve: {
						preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
							removeLazyLoadedCSS(timeStamp,'tax-tool');
							return $ocLazyLoad.load({
								name: "taxToolApp",
								files: [
									"assets/css-min/owl.carousel.css?v="+timeStamp,
									"assets/js/owl.carousel.js?v="+timeStamp,
									//"assets/js/addMember.directive.js?v="+timeStamp,			                    	
									"assets/js/tax-tool.controller.js?v="+timeStamp
								]
							})
						}]
					}
			})

			.when('/tax-tool-detail', {
					title: 'Tax tool',
					templateUrl: 'partials/tax-tool-detail.html?v='+timeStamp,
					controller: 'taxToolDetailCtrl',
					controllerAs: "tADE",
					resolve: {
						preQuoteApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
							removeLazyLoadedCSS(timeStamp,'tax-tool');
							return $ocLazyLoad.load({
								name: "taxToolApp",
								files: [
									"assets/css-min/owl.carousel.css?v="+timeStamp,
									"assets/js/owl.carousel.js?v="+timeStamp,
									//"assets/js/addMember.directive.js?v="+timeStamp,			                    	
									"assets/js/tax-tool-detail.controller.js?v="+timeStamp
								]
							})
						}]
					}
			})

/* VIL Routing */

.when('/vil-login', {
	title: 'VIL - Aditya Birla Health Insurance',
	templateUrl: 'partials/vil-login.html?v='+timeStamp,
	controller: 'vil-login',
	resolve: {
	vilLoginApp: ['$ocLazyLoad', function ($ocLazyLoad) {
		removeLazyLoadedCSS(timeStamp,'vil-login');
		return $ocLazyLoad.load({
			name: "vilLoginApp",
			files: [
				'assets/js/vil-login.controller.js?v='+timeStamp
				]
			})
		}]
	}
})

.when('/vil-raise-track', {
	title: 'VIL - Aditya Birla Health Insurance',
	templateUrl: 'partials/vil-raise-track.html?v='+timeStamp,
	controller: 'vil-raise-track',
	resolve: {
		vilRaiseTrackApp: ['$ocLazyLoad', function ($ocLazyLoad) {
		removeLazyLoadedCSS(timeStamp,'vil-raise-track');
		return $ocLazyLoad.load({
			name: "vilRaiseTrackApp",
			files: [
				'assets/js/vil-raise-track.controller.js?v='+timeStamp
				]
			})
		}]
	}
})

.when('/vil-raise', {
	title: 'VIL - Aditya Birla Health Insurance',
	templateUrl: 'partials/vil-raise.html?v='+timeStamp,
	controller: 'vil-raise',
	resolve: {
		vilRaiseApp: ['$ocLazyLoad', function ($ocLazyLoad) {
			removeLazyLoadedCSS(timeStamp,'vil-raise');
			return $ocLazyLoad.load({
				name: "vilRaiseApp",
				files: [
					'assets/js/vil-raise.controller.js?v='+timeStamp
				]
			})
		}]
	}
})

.when('/vil-track', {
	title: 'VIL - Aditya Birla Health Insurance',
	templateUrl: 'partials/vil-track.html?v='+timeStamp,
	controller: 'vil-track',
	resolve: {
		vilTrackApp: ['$ocLazyLoad', function ($ocLazyLoad) {
			removeLazyLoadedCSS(timeStamp,'vil-track');
			return $ocLazyLoad.load({
				name: "vilTrackApp",
				files: [
					'assets/js/vil-track.controller.js?v='+timeStamp
				]
			})
		}]
	}
})

/* End of VIL Routing */

		/* product detail landing page */
			.when('/product-detail', {
				title: 'Product Detail landing page - Aditya Birla Health Insurance',
				templateUrl: 'partials/product-detail.html?v=' + timeStamp,
				controller: 'product-details',
				controllerAs: "pD",
				resolve: {
					productDetailApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
				removeLazyLoadedCSS(timeStamp, 'product-detail');
				return $ocLazyLoad.load({
					name: "productDetailApp",
					files: [
						"assets/js/product-detail.controller.js?v=" + timeStamp,
						'assets/js/pre-quote.directive.js?v=' + timeStamp
								]
							})
						}]
					}
				})
			/* product detail landing page */

			/* DCB product detail landing page */
			.when('/dcb-product-detail', {
				title: 'Product Detail landing page - Aditya Birla Health Insurance',
				templateUrl: 'partials/product-detail.html?v=' + timeStamp,
				controller: 'product-details',
				controllerAs: "pD",
				resolve: {
					productDetailApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
				removeLazyLoadedCSS(timeStamp, 'product-detail');
				return $ocLazyLoad.load({
					name: "productDetailApp",
					files: [
						"assets/js/product-detail.controller.js?v=" + timeStamp,
						'assets/js/pre-quote.directive.js?v=' + timeStamp
								]
							})
						}]
					}
				})
			/* product detail landing page */
	/*Editable proposal form start*/
	.when('/editable-proposal-form', {
		title: 'Editable-Proposal-Form - Aditya Birla Health Insurance',
		templateUrl: 'partials/editable-proposal.html?v=' + timeStamp,
		controller: 'editableProposal',
		controllerAs: "ePF",
		resolve: {
			editableProposalApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
				removeLazyLoadedCSS(timeStamp, 'editable-proposal');
				return $ocLazyLoad.load({
					name: "editableProposalApp",
					files: [
						"assets/js/editable-proposal-controller.js?v=" + timeStamp
					]
				})
			}]
		}
	})
	/*Editable proposal form end*/	
	
	/* New Renew Routing */
	
	.when('/counter-offer-quote', {
		title: 'Counter Offer - Aditya Birla Health Insurance',
		templateUrl: 'partials/counter-offer-quote.html?v='+timeStamp,
		controller: 'counter-offer-quote',
		resolve: {
			renewalRenewModule: ['$ocLazyLoad', function ($ocLazyLoad) {
				removeLazyLoadedCSS(timeStamp,'counter-offer');
				return $ocLazyLoad.load({
					name: "counterOfferQuoteModule",
					files: [
						'assets/js/counter-offer-quote.controller.js?v='+timeStamp
					]
				})
			}]
		},
		keyword:'aditya birla health insurance counter offer, aditya birla capital health insurance counter offer, health insurance renew policy, abhi counter offer, abc health insurance counter offer',
		description:'Renew your Aditya Birla Health Insurance policy with ease. Get your Aditya Birla Health Insurance policy renew in ABHI here. Click here to renew.'
	})

	.when('/counter-offer-login', {
		title: 'Counter Offer - Aditya Birla Health Insurance',
		templateUrl: 'partials/counter-offer-login.html?v='+timeStamp,
		controller: 'counter-offer',
		resolve: {
			renewalRenewModule: ['$ocLazyLoad', function ($ocLazyLoad) {
				removeLazyLoadedCSS(timeStamp,'counter-offer');
				return $ocLazyLoad.load({
					name: "counterOfferModule",
					files: [
						'assets/js/counter-offer-login.controller.js?v='+timeStamp
					]
				})
			}]
		},
		keyword:'aditya birla health insurance counter offer, aditya birla capital health insurance counter offer, health insurance renew policy, abhi counter offer, abc health insurance counter offer',
		description:'Renew your Aditya Birla Health Insurance policy with ease. Get your Aditya Birla Health Insurance policy renew in ABHI here. Click here to renew.'
	})


			/* New Renew Routing */

			.when('/renewal-renew-policy', {
				title: 'Renew Policy - Aditya Birla Health Insurance',
				templateUrl: 'partials/renewal-renew.html?v='+timeStamp,
				controller: 'renewal-renew',
				resolve: {
					renewalRenewModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'renewal-new-quick-renew');
						return $ocLazyLoad.load({
							name: "renewalRenewModule",
							files: [
								'assets/js/renewal-renew.js?v='+timeStamp
							]
						})
					}]
				},
				keyword:'aditya birla health insurance renew policy, aditya birla capital health insurance renew policy, health insurance renew policy, abhi renew policy, abc health insurance renew policy',
				description:'Renew your Aditya Birla Health Insurance policy with ease. Get your Aditya Birla Health Insurance policy renew in ABHI here. Click here to renew.'
			})

			.when('/new-renewal-landing', {
				title: "Health Insurance  - Aditya Birla Health Insurance",
				templateUrl: 'partials/new-renewal-landing.html?v='+timeStamp,
				controller: 'newRenewLanding',
				resolve: {
					newRenewModule: ['$ocLazyLoad', function($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'new-renewal');
						return $ocLazyLoad.load({
							name: "newRenewModule",
							files: [
								'assets/css-min/owl.carousel.min.css?v='+timeStamp,
								'assets/css-min/owl.theme.default.min.css?v='+timeStamp,
								'assets/css-min/slick.min.css?v='+timeStamp,
								'assets/js/slick.min.js?v='+timeStamp,
								'assets/js/new-renewal-landing.js?v='+timeStamp,
								'assets/js/header-details.directive.js?v='+timeStamp
							]
						})
					}]
				},
				keyword: 'health insurance login, login health insurance, aditya birla capital health insurance login',
				description: 'Login to your Aditya Birla Capital Health Insurance Account to explore your Health Insurance Plan, Policy Status, Health Returns, Rewards, Hospital Networks and more. Also, plan your days and diet for a better lifestyle and earn rewards with Aditya Birla Capital Health Insurance.'
			})

			.when('/renewal-view-member-landing', {
				title: "Renewal View Member Landing",
				templateUrl: 'partials/renewal-view-member-landing.html?v='+timeStamp,
				controller: 'renewal-view-member-landing',
				resolve: {
					renewalViewMemberLandingModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'new-renewal');
						return $ocLazyLoad.load({
							name: "renewalViewMemberLandingModule",
							files: [
								'assets/js/renewal-view-member-landing.js?v='+timeStamp,
								'assets/js/header-details.directive.js?v='+timeStamp
							]
						})
					}]
				}
			})

			.when('/renewal-edit-member-landing', {
				title: "Renewal Edit Member Landing",
				templateUrl: 'partials/renewal-edit-member-landing.html?v='+timeStamp,
				controller: 'renewal-edit-member-landing',
				resolve: {
					renewalEditMemberLandingModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'new-renewal');
						return $ocLazyLoad.load({
							name: "renewalEditMemberLandingModule",
							files: [
								'assets/js/renewal-edit-member-landing.js?v='+timeStamp,
								'assets/js/header-details.directive.js?v='+timeStamp
							]
						})
					}]
				}
			})

			.when('/renewal-edit-optional-covers', {
				title: "Renewal Edit Member Landing",
				templateUrl: 'partials/renewal-edit-optional-covers.html?v='+timeStamp,
				controller: 'renewal-edit-member-landing',
				resolve: {
					renewalEditMemberLandingModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'new-renewal');
						return $ocLazyLoad.load({
							name: "renewalEditMemberLandingModule",
							files: [
								'assets/js/renewal-edit-member-landing.js?v='+timeStamp,
								'assets/js/header-details.directive.js?v='+timeStamp
							]
						})
					}]
				}
			})

			.when('/renewal-view-member-add-user', {
				title: "Renewal View Member Add User",
				templateUrl: 'partials/renewal-view-member-add-user.html?v='+timeStamp,
				controller: 'renewal-view-member-add-user',
				resolve: {
					renewalViewMemberAddUserModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'new-renewal');
						return $ocLazyLoad.load({
							name: "renewalViewMemberAddUserModule",
							files: [
								'assets/js/renewal-view-member-add-user.js?v='+timeStamp,
								'assets/js/header-details.directive.js?v='+timeStamp
							]
						})
					}]
				}
			})

			.when('/renewal-edit-nominee-details-landing', {
				title: "Renewal Edit Nominee Details Landing",
				templateUrl: 'partials/renewal-edit-nominee-details-landing.html?v='+timeStamp,
				controller: 'renewal-edit-nominee-details-landing',
				resolve: {
					renewalEditNomineeDetailsLandingModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'new-renewal');
						return $ocLazyLoad.load({
							name: "renewalEditNomineeDetailsLandingModule",
							files: [
								'assets/js/renewal-edit-nominee-details-landing.js?v='+timeStamp,
								'assets/js/header-details.directive.js?v='+timeStamp
							]
						})
					}]
				}
			})

			.when('/renewal-increase-policy-tenure-landing', {
				title: "Renewal Increase Policy Tenure Landing",
				templateUrl: 'partials/renewal-increase-policy-tenure-landing.html?v='+timeStamp,
				controller: 'renewal-increase-policy-tenure-landing',
				resolve: {
					renewalIncreasePolicyTenureLandingModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'new-renewal');
						return $ocLazyLoad.load({
							name: "renewalIncreasePolicyTenureLandingModule",
							files: [
								'assets/js/renewal-increase-policy-tenure-landing.js?v='+timeStamp,
								'assets/js/header-details.directive.js?v='+timeStamp
							]
						})
					}]
				}
			})

			.when('/renewal-increase-sum-insured-landing', {
				title: "Renewal Increase Sum Insured Landing",
				templateUrl: 'partials/renewal-increase-sum-insured-landing.html?v='+timeStamp,
				controller: 'renewal-increase-sum-insured-landing',
				resolve: {
					renewalIncreaseSumInsuredLandingModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'new-renewal');
						return $ocLazyLoad.load({
							name: "renewalIncreaseSumInsuredLandingModule",
							files: [
								'assets/js/renewal-increase-sum-insured-landing.js?v='+timeStamp,
								'assets/js/header-details.directive.js?v='+timeStamp
							]
						})
					}]
				}
			})

			.when('/renewal-upgrade-zone-landing', {
				title: "Renewal Upgrade Zone Landing",
				templateUrl: 'partials/renewal-upgrade-zone-landing.html?v='+timeStamp,
				controller: 'renewal-upgrade-zone-landing',
				resolve: {
					renewalUpgradeZoneLandingModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'new-renewal');
						return $ocLazyLoad.load({
							name: "renewalUpgradeZoneLandingModule",
							files: [
								'assets/js/renewal-upgrade-zone-landing.js?v='+timeStamp,
								'assets/js/header-details.directive.js?v='+timeStamp
							]
						})
					}]
				}
			})

			.when('/renewal-change-address-details', {
				title: "Renewal Change Address Details",
				templateUrl: 'partials/renewal-change-address-details.html?v='+timeStamp,
				controller: 'renewal-change-address-details',
				resolve: {
					renewalChangeAddressDetailsModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'new-renewal');
						return $ocLazyLoad.load({
							name: "renewalChangeAddressDetailsModule",
							files: [
								'assets/js/renewal-change-address-details.js?v='+timeStamp,
								'assets/js/header-details.directive.js?v='+timeStamp
							]
						})
					}]
				}
			})

			.when('/new-renewal-renew-thank-you', {
				templateUrl: 'partials/renewal-renew-thank-you.html?v='+timeStamp,
				controller: 'renewal-renew-thank-you',
				resolve: {
					renewModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'renewal-new-quick-renew');
						return $ocLazyLoad.load({
							name: "renewModule",
							files: [
								'assets/js/renewal-renew-thank-you.js?v='+timeStamp,
								"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
							]
						})
					}]
				}
			})

	.when('/part-payment-thank-you', {
		templateUrl: 'partials/renewal-renew-thank-you.html?v=' + timeStamp,
		controller: 'renewal-renew-thank-you',
		resolve: {
			renewModule: ['$ocLazyLoad', function ($ocLazyLoad) {
				removeLazyLoadedCSS(timeStamp, 'renewal-new-quick-renew');
				return $ocLazyLoad.load({
					name: "renewModule",
					files: [
						'assets/js/renewal-renew-thank-you.js?v=' + timeStamp,
						"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
					]
				})
			}]
		}
	})

	.when('/counter-offer-thank-you', {
		templateUrl: 'partials/renewal-renew-thank-you.html?v=' + timeStamp,
		controller: 'renewal-renew-thank-you',
		resolve: {
			renewModule: ['$ocLazyLoad', function ($ocLazyLoad) {
				removeLazyLoadedCSS(timeStamp, 'renewal-new-quick-renew');
				return $ocLazyLoad.load({
					name: "renewModule",
					files: [
						'assets/js/renewal-renew-thank-you.js?v=' + timeStamp,
						"assets/css-min/owl.carousel.css?v=" + timeStamp,
								"assets/js/owl.carousel.js?v=" + timeStamp,
					]
				})
			}]
		}
	})

			.when('/renewal-payment-processing', {
				title: "Renewal Payment Processing",
				templateUrl: 'partials/renewal-payment-processing.html?v='+timeStamp,
				controller: 'renewal-payment-processing',
				resolve: {
					renewalPaymentProcessingModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: "renewalPaymentProcessingModule",
							files: [
								'assets/js/renewal-payment-processing.js?v='+timeStamp,
							]
						})
					}]
				}
			})

	.when('/part-payment-processing', {
		title: "Part Payment Processing",
		templateUrl: 'partials/renewal-payment-processing.html?v=' + timeStamp,
		controller: 'part-payment-processing',
		resolve: {
			renewalPaymentProcessingModule: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load({
					name: "partPaymentProcessingModule",
					files: [
						'assets/js/part-payment-processing.controller.js?v=' + timeStamp,
					]
				})
			}]
		}
	})

	.when('/cfr-payment-processing', {
		title: "counter offer Payment Processing",
		templateUrl: 'partials/renewal-payment-processing.html?v=' + timeStamp,
		controller: 'cfr-payment-processing',
		resolve: {
			renewalPaymentProcessingModule: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load({
					name: "crfPaymentProcessingModule",
					files: [
						'assets/js/cfr-payment-processing.controller.js?v=' + timeStamp,
					]
				})
			}]
		}
	})

			.when('/renewal-url-processing/:urlKey', {
				title: "Renewal Url Processing",
				templateUrl: 'partials/renewal-url-processing.html?v='+timeStamp,
				controller: 'renewal-url-processing',
				resolve: {
					renewalUrlProcessingModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: "renewalUrlProcessingModule",
							files: [
								'assets/js/renewal-url-processing.js?v='+timeStamp,
							]
						})
					}]
				}
			})

			.when('/renew-dropout', {
				title: "Renewal Renew Dropout",
				templateUrl: 'partials/renewal-renew-dropout.html?v='+timeStamp,
				controller: 'renewal-renew-dropout',
				resolve: {
					renewalRenewDropoutModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: "renewalRenewDropoutModule",
							files: [
								'assets/js/renewal-renew-dropout.js?v='+timeStamp,
							]
						})
					}]
				}
			})

			.when('/renewal-renew-dropout', {
				title: "Renewal Renew Dropout",
				templateUrl: 'partials/renewal-renew-dropout.html?v='+timeStamp,
				controller: 'renewal-renew-dropout',
				resolve: {
					renewalRenewDropoutModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: "renewalRenewDropoutModule",
							files: [
								'assets/js/renewal-renew-dropout.js?v='+timeStamp,
							]
						})
					}]
				}
			})

			.when('/renewPaymentProcess', {
				title: 'Payment Processing - Aditya Birla Health Insurance',
				template: '',
				controller: 'renewPaymentProcess',
				resolve: {
					renewPaymentProcessModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load({
							name: "renewPaymentProcessModule",
							files: [
								'assets/js/renewPaymentProcess.js?v='+timeStamp,
							]
						})
					}]
				}
			})
			
			/* End of New Renew Routing */


	.when('/partPaymentProcess', {
		title: 'Payment Processing - Aditya Birla Health Insurance',
		template: '',
		controller: 'partPaymentProcess',
		resolve: {
			partPaymentProcessModule: ['$ocLazyLoad', function ($ocLazyLoad) {
				return $ocLazyLoad.load({
					name: "partPaymentProcessModule",
					files: [
						'assets/js/partPaymentProcess.js?v=' + timeStamp,
					]
				})
			}]
		}
	})


			/* Axis Telesales Renew Routes */

			.when('/axis-telesales-renew-policy', {
				title: 'Axis Telesales Renew Policy - Aditya Birla Health Insurance',
				templateUrl: 'partials/axis-telesales-renew-policy.html?v='+timeStamp,
				controller: 'axis-telesales-renew-policy',
				resolve: {
					axisTeleRenewPolicyModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						removeLazyLoadedCSS(timeStamp,'axis-telesales-renew-policy');
						return $ocLazyLoad.load({
							name: "axisTeleRenewPolicyModule",
							files: [
								'assets/js/axis-telesales-renew-policy.controller.js?v='+timeStamp
							]
						})
					}]
				}
			})

			/* End of Axis Telesales Renew Routes */

/* Part Payment Routing start */
.when('/part-payment-login', {
	title: 'Policy Part Payment - Aditya Birla Health Insurance',
	templateUrl: 'partials/pp-login.html?v=' + timeStamp,
	controller: 'part-payment',
	controllerAs: "pPay",
	resolve: {
		partPaymentModule: ['$ocLazyLoad', function ($ocLazyLoad) {
			removeLazyLoadedCSS(timeStamp, 'part-payment');
			return $ocLazyLoad.load({
				name: "partPaymentModule",
				files: [
					'assets/js/pp-login.js?v=' + timeStamp
				]
			})
		}]
	},
	keyword: 'aditya birla health insurance renew policy, aditya birla capital health insurance renew policy, health insurance renew policy, abhi renew policy, abc health insurance renew policy',
	description: 'Renew your Aditya Birla Health Insurance policy with ease. Get your Aditya Birla Health Insurance policy renew in ABHI here. Click here to renew.'
})

.when('/part-payment', {
	title: 'Part Payment - Aditya Birla Health Insurance',
	templateUrl: 'partials/part-pay.html?v=' + timeStamp,
	controller: 'partPay',
	// controllerAs: "pP",
	resolve: {
		partPayModule: ['$ocLazyLoad', function ($ocLazyLoad) {
			removeLazyLoadedCSS(timeStamp, 'part-pay');
			return $ocLazyLoad.load({
				name: "partPayModule",
				files: [
					// "assets/css-min/owl.carousel.css?v=" + timeStamp,
					// "assets/js/owl.carousel.js?v=" + timeStamp,
					// "assets/js/addMember.directive.js?v=" + timeStamp,
					// "assets/js/cross-sell-quote.js?v=" + timeStamp,
					'assets/js/part-pay.controller.js?v=' + timeStamp
				]
			})
		}]
	}
})



/* End of Part Payment Routing */

/* New UI Renewal Routing */
.when('/renewal-renew-policy-new', {
	title: 'Renew Policy - Aditya Birla Health Insurance',
	templateUrl: 'partials/renewal-renew-new.html?v=' + timeStamp,
	controller: 'renewal-renew',
	resolve: {
		renewalRenewModule: ['$ocLazyLoad', function ($ocLazyLoad) {
			removeLazyLoadedCSS(timeStamp, 'renewal-new-quick-renew');
			return $ocLazyLoad.load({
				name: "renewalRenewModule",
				files: [
					'assets/js/renewal-renew.js?v=' + timeStamp,
					'assets/css-min/renewal-new-quick-renew-new.css?v=' + timeStamp
				]
			})
		}]
	},
	keyword: 'aditya birla health insurance renew policy, aditya birla capital health insurance renew policy, health insurance renew policy, abhi renew policy, abc health insurance renew policy',
	description: 'Renew your Aditya Birla Health Insurance policy with ease. Get your Aditya Birla Health Insurance policy renew in ABHI here. Click here to renew.'
})

.when('/new-renewal-landing-new', {
	title: "Health Insurance  - Aditya Birla Health Insurance",
	templateUrl: 'partials/new-renewal-landing-new.html?v=' + timeStamp,
	controller: 'newRenewLanding',
	resolve: {
		newRenewModule: ['$ocLazyLoad', function ($ocLazyLoad) {
			removeLazyLoadedCSS(timeStamp, 'new-renewal');
			return $ocLazyLoad.load({
				name: "newRenewModule",
				files: [
					'assets/css-min/owl.carousel.min.css?v=' + timeStamp,
					'assets/css-min/owl.theme.default.min.css?v=' + timeStamp,
					'assets/css-min/slick.min.css?v=' + timeStamp,
					'assets/js/slick.min.js?v=' + timeStamp,
					'assets/js/new-renewal-landing.js?v=' + timeStamp,
					'assets/css-min/renewal-new-quick-renew-new.css?v=' + timeStamp
				]
			})
		}]
	},
	keyword: 'health insurance login, login health insurance, aditya birla capital health insurance login',
	description: 'Login to your Aditya Birla Capital Health Insurance Account to explore your Health Insurance Plan, Policy Status, Health Returns, Rewards, Hospital Networks and more. Also, plan your days and diet for a better lifestyle and earn rewards with Aditya Birla Capital Health Insurance.'
})

/* HDFC QR Code Product landing page */
.when('/hdfcqr-product-detail', {
	title: 'Product Detail landing page - Aditya Birla Health Insurance',
	templateUrl: 'partials/hdfcqr-product-detail.html?v=' + timeStamp,
	controller: 'product-details',
	controllerAs: "pD",
	resolve: {
		productDetailApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
	removeLazyLoadedCSS(timeStamp, 'product-detail');
	return $ocLazyLoad.load({
		name: "productDetailApp",
		files: [
			"assets/js/product-detail.controller.js?v=" + timeStamp,
			'assets/js/pre-quote.directive.js?v=' + timeStamp
					]
				})
			}]
		}
	})
/* HDFC QR Code Product landing page */

/* customer profile page */
.when('/profile', {
	title: 'Customer Profile - Aditya Birla Health Insurance',
	templateUrl: 'partials/customer-profile.html?v=' + timeStamp,
	controller: 'customer-profile',
	controllerAs: "cP",
	resolve: {
		customerProfileApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
	removeLazyLoadedCSS(timeStamp, 'customer-profile');
	return $ocLazyLoad.load({
		name: "customerProfileApp",
		files: [
			"assets/js/customer-profile.controller.js?v=" + timeStamp
					]
				})
			}]
		}
	})

	.when('/pharmeasy', {
		title: 'Free Personal Accident Insurance cover for Pharmeasy Plus customers',
		templateUrl: 'partials/pharmeasy.html?v=' + timeStamp,
		controller: 'pharmeasy-update',
		controllerAs: "pe",
		resolve: {
			pharmeasyApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
		removeLazyLoadedCSS(timeStamp, 'pharmeasy');
		return $ocLazyLoad.load({
			name: "pharmeasyApp",
			files: [
				"assets/js/pharmeasy.controller.js?v=" + timeStamp
						]
					})
				}]
			}
		})
/* customer profile page */

/* IDFC PASA landing page */
.when('/idfc-pasa', {
	title: 'IDFC PASA - Aditya Birla Health Insurance',
	templateUrl: 'partials/idfc-pasa.html?v=' + timeStamp,
	controller: 'product-details',
	controllerAs: "pD",
	resolve: {
		productDetailApp: ['$ocLazyLoad', 'appService', function ($ocLazyLoad, appService) {
	removeLazyLoadedCSS(timeStamp, 'product-detail');
	return $ocLazyLoad.load({
		name: "productDetailApp",
		files: [
			"assets/js/product-detail.controller.js?v=" + timeStamp,
			'assets/js/pre-quote.directive.js?v=' + timeStamp
					]
				})
			}]
		}
	})
/* IDFC PASA landing page */

/* Payment terms term-conditions */
.when('/juspay-TnC', {
	title: 'Terms & Conditions - Aditya Birla Capital Health Insurance',
	templateUrl: 'partials/terms-conditions.html?v=' + timeStamp,
	controller: 'termsConditions',
	controllerAs: "tc",
	resolve: {
		termsConditionsApp: ['$ocLazyLoad', function ($ocLazyLoad) {
	removeLazyLoadedCSS(timeStamp, 'terms-conditions');
	return $ocLazyLoad.load({
		name: "termsConditionsApp",
		files: [
			"assets/js/terms-conditions.controller.js?v=" + timeStamp
		]})
			}]
		}
	})
/* term-conditions end */

			/* Vodafone Group Activ Travel */	
			.when('/group-activ-travel', {
				title: 'Vodafone Group Activ Travel - Aditya Birla Health Insurance',
				templateUrl: 'partials/group-activ-travel.html?v='+timeStamp,
				controller: 'travellerDetails',
				controllerAs: "tDC",
				resolve: {
					travellerDetailsApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'group-activ-travel');
						return $ocLazyLoad.load({
							name: "travellerDetailsApp",
							files: [
								"assets/css-min/group-activ-travel.css?v="+timeStamp,
								"assets/js/group-activ-travel.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})

			.when('/group-activ-travel-payment', {
				title: 'Vodafone Group Activ Travel - Aditya Birla Health Insurance',
				templateUrl: 'partials/group-activ-travel-payment.html?v='+timeStamp,
				controller: 'travelPayment',
				controllerAs: "tPC",
				resolve: {
					travelPaymentApp: ['$ocLazyLoad','appService', function ($ocLazyLoad,appService) {
						removeLazyLoadedCSS(timeStamp,'group-activ-travel');
						return $ocLazyLoad.load({
							name: "travelPaymentApp",
							files: [
								"assets/css-min/group-activ-travel.css?v="+timeStamp,
								"assets/js/group-activ-travel-payment.controller.js?v="+timeStamp
							]
						})
					}]
				}
			})
			/* End of Vodafone Group Activ Travel */

/* End of UI Renewal Routing */

	/* End of all routing  */

}]);

/* End of app connfig */


/* 	
Author: ABHI Digital
Block Name :- App Run 
Date:- 06-08-2018
*/


app.run(['$window','$rootScope','$timeout','appService','$location','ABHI_CONFIG','$route','$sessionStorage',function($window,$rootScope,$timeout,appService,$location,ABHI_CONFIG,$route,$sessionStorage) {

	/* New Renew GA Event */
	$rootScope.gotoPageGAParam = function (act, lab, cat) {
		$window.gtag('event', act,
		{
			'event_category': cat,
			'event_label': lab
		})
	}
	/* End of New Renew GA Event */

	/* Route Change Start Function */

		$rootScope.$on('$routeChangeStart', function (event, next, prev) {
			$rootScope.showWhiteLoader = true;

			var cookiesArray = document.cookie.split(';')
			var vizId ;
			for(var i = 0 ; i<cookiesArray.length ; i++){
				var lemniskID = cookiesArray[i].split('=')
				if(lemniskID[0] == ' _vz'){
					vizId = lemniskID[1]
				}

			}

			sessionStorage.setItem('lemniskIdVal' , vizId);

			if(next.$$route.originalPath.includes("corona-kavach-pre-quote")){
				$location.url('pre-quote');
			}

			if(!angular.isUndefined(next)){

		if (sessionStorage.getItem('rid') == null && !(next.$$route.controller == 'preQuoteApp' || next.$$route.controller == 'urlProcess' || next.$$route.controller == 'paymentResponse' || next.$$route.controller == 'extPreQuote' || next.$$route.controller == 'webAggApp' || next.$$route.controller == 'recoQuoteApp' || next.$$route.controller == 'hiliController' || next.$$route.controller == 'taxToolCtrl' || next.$$route.controller == 'taxToolDetailCtrl' ||  next.$$route.controller == 'salePreminumCalQuote' || next.$$route.controller == 'editableProposal' ||next.$$route.controller == 'vil-login' || next.$$route.controller == 'vil-raise-track' || next.$$route.controller == 'vil-raise' || next.$$route.controller == 'vil-track' || next.$$route.controller == 'product-details' || next.$$route.controller == 'counter-offer' || next.$$route.controller == 'counter-offer-quote' || next.$$route.controller == 'renewal-renew' || next.$$route.controller == 'newRenewLanding' || next.$$route.controller == 'renewal-view-member-landing' || next.$$route.controller == 'renewal-edit-member-landing' || next.$$route.controller == 'renewal-view-member-add-user' || next.$$route.controller == 'renewal-edit-nominee-details-landing' || next.$$route.controller == 'renewal-increase-policy-tenure-landing' || next.$$route.controller == 'renewal-increase-sum-insured-landing' || next.$$route.controller == 'renewal-upgrade-zone-landing' || next.$$route.controller == 'renewal-change-address-details' || next.$$route.controller == 'renewal-renew-thank-you' || next.$$route.controller == 'renewal-payment-processing' || next.$$route.controller == 'part-payment-processing' || next.$$route.controller == 'cfr-payment-processing' || next.$$route.controller == 'renewPaymentProcess' || next.$$route.controller == 'partPaymentProcess' || next.$$route.controller == 'renewal-url-processing' || next.$$route.controller == 'renewal-renew-dropout' || next.$$route.controller == 'axis-telesales-renew-policy' || next.$$route.controller == 'part-payment' || next.$$route.controller == 'partPay' || next.$$route.controller == 'customer-profile' || next.$$route.controller == 'pharmeasy-update'  || next.$$route.controller == 'juspayController' || next.$$route.controller == 'termsConditions' || next.$$route.controller == 'travellerDetails' || next.$$route.controller == 'travelPayment')) {
					$location.url('pre-quote');
					return false;
				}
			}

			/* Adding Description/Title/Keyword */

				if(!angular.isUndefined(next.$$route)){
					if(!angular.isUndefined(next.$$route.title)){
						$rootScope.pageTitle = next.$$route.title;
					}

					if(!angular.isUndefined(next.$$route.metaDescription)){
						$('#metadescription').attr('content',next.$$route.metaDescription);
					}else{
						$('#metadescription').attr('content',"Buy Health Insurance plans by Aditya Birla Capital and secure yourself against any medical emergency. Our Medical Insurance policies help you avail cashless claim services from our 3,000+ network of Hospitals. Buy Health Insurance from Aditya Birla Capital now!");
					}

					if(!angular.isUndefined(next.$$route.metaKeywords)){
						$('#metakeyword').attr('content',next.$$route.metaKeywords);
					}else{
						$('#metakeyword').attr('content',"buy health insurance online, buy health insurance, health insurance, Medical Insurance, Mediclaim, Health insurance Plans, aditya birla capital health insurance online, aditya birla capital health insurance");
					}
				}

			/* End of adding Description/Title/Keyword */

		});

	/* End of route change start function */

	

	$rootScope.lemniskCodeExcute = function(param){
		/*window.vizLayer = $rootScope.leminiskObj
			
			if(param != "/pre-quote" || param != "/activ-care-quote"
			|| param != "/activ-health-pre-quote"  || param != "/activ-assure-pre-quote" || 
			param != "/activ-secure-personal-accident-pre-quote" || param != "/activ-secure-critical-illness-pre-quote"  ){
				lmSMTObj.parse(true)
			}*/
			
	}


	/* To call page drop service */

		function callPageDropService(pagename,apiTail,showLoader){
			var rNumber;
			if(pagename == "paymentResponse"){
				rNumber = $location.search().id;
			}else{
				rNumber = sessionStorage.getItem('rid');
			}
			appService.postData(ABHI_CONFIG.apiUrl+"GEN/"+apiTail,{
				"ReferenceNumber": rNumber,
				"PageDrop": pagename
				},showLoader,{
					headers:{
						'Content-Type': 'application/json'
					}
				})
				.then(function(data){
				if(pagename != "paymentResponse"){
					callOminichannelService(pagename, apiTail, showLoader);
				}
				if(data.ResponseCode == 1 && showLoader){
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "SMS sent successfully",
						"modalBodyText": "<p>SMS has been triggered to customer successfully.</p><ul><li>Please close this journey window to allow customer to access the link.</li><li>Please do not proceed to payment page now, it should be done by customer alone using the link in the SMS.</li></ul>",
						"showCancelBtn": false,
						"hideCloseBtn": true,
						"gtagPostiveFunction" : "click-button,send-customer-sms,alert-success_send-sms ",
						"gtagNegativeFunction" : "click-button,send-customer-sms,alert-success_not-now ",
						"gtagCrossFunction" : "click-button,send-customer-sms,alert-success_cross",
						"modalSuccessText" : "Ok",
						"showAlertModal": true,
						"positiveFunction": function(){
							$location.url('pre-quote');
							sessionStorage.clear();
							fetchIPDetails();
						}
					}
				}else if(showLoader){
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "SMS sending failed",
						"modalBodyText": "SMS sending has failed",
						"showCancelBtn": true,
						"gtagPostiveFunction" : "click-button,send-customer-sms,alert-fail_send-sms ",
						"gtagNegativeFunction" : "click-button,send-customer-sms,alert-fail_not-now ",
						"gtagCrossFunction" : "click-button,send-customer-sms,alert-fail_cross",
						"modalSuccessText" : "Retry",
						"modalCancelText" : "Close",
						"showAlertModal": true,
						"positiveFunction": function(){
							callPageDropService($rootScope.currentRoute[1],'SendUserSMS',true);
						}
					}
				}
			},function(err){});
		}

	/* End of call page drop service */
	
			/*-----to call Omnichannel service start---- */
function callOminichannelService(pagename, apiTail, showLoader){
	var rNumber;
	if (pagename == "paymentResponse") {
		rNumber = $location.search().id;
	} else {
		rNumber = sessionStorage.getItem('rid');
	}  
	
	var requestPage;
	if(pagename == 'cross-sell-thank-you'|| pagename == 'platinum-thank-you'|| pagename == 'Fit-thank-you'|| pagename == 'diamond-thank-you' || pagename == 'activ-care-thank-you' || pagename == 'corona-kavach-thank-you'|| pagename =='arogya-sanjeevani-thank-you'|| pagename == 'rfb-thank-you'||pagename =='cross-sell-thank-you'){
		requestPage = 'buy-Success';
	}else{
		requestPage = 'buy-dropoff';
	}
	appService.postData(ABHI_CONFIG.apiUrl + "OmniChannel/BuyJourneyDropoff", {
		"ReferrenceNo": rNumber,
		"PageName": requestPage
	}, showLoader, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
	.then(function (data) {
		if (data.ResponseCode == 1) {
			
		} else{
			// $rootScope.alertData = {
			// 	"modalClass": "regular-alert",
			// 	"modalHeader": "Alert",
			// 	"modalBodyText": data.ResponseMessage,
			// 	"showCancelBtn": false,
			// 	"modalSuccessText": "Ok",
			// 	"showAlertModal": true
			// }
		}
	}, function (err) { });
}
/*-----to call Omnichannel service end------ */

$rootScope.ModificationProduct = $sessionStorage.productName;
$rootScope.platinumPlan = "";


	/* Route change success function  */

		$rootScope.$on('$routeChangeSuccess', function (e, newLocation, oldLocation) {
			$rootScope.showWhiteLoader = false;
			$rootScope.currentRoute = newLocation.$$route.originalPath.split('/');
			if(angular.isUndefined(newLocation.$$route)){
			   return false;
			}
			$rootScope.pageNoSeq = sessionStorage.getItem('pageNoSeq');
			$rootScope.preExeDisease = sessionStorage.getItem('preExeDis');
			if(newLocation.$$route.controller == 'hiliController'){
				$rootScope.showhiliheader = true;
			}else if(newLocation.$$route.controller == 'product-details'){
				$rootScope.showhiliheader = true;
			}
			else{
				$rootScope.showhiliheader = false;
			}

			if (newLocation.$$route.controller == 'taxToolCtrl' || newLocation.$$route.controller == 'taxToolDetailCtrl' ) {
				$rootScope.citipresent = true;
			} else {
				$rootScope.citipresent = false;
			}

			/* New Renew Setting Product Flags */
			if($sessionStorage.productName == 'Activ Health' || $sessionStorage.productName == 'Activ Health V2'){
				$rootScope.platinumProduct = true;
			}
			if($sessionStorage.productName == 'Activ Secure'){
				$rootScope.rfbProduct = true;
			}
			if($sessionStorage.productName == 'Activ Assure' || $sessionStorage.productName == 'Activ Assure V2'){
				$rootScope.diamondProduct = true;   
			}
			/* End of New Renew Setting Product Flags */

			if(oldLocation){
				$timeout(function(){
					if(sessionStorage.getItem('leadId') != undefined && sessionStorage.getItem('leadId') != null){
				$window.gtag('config', 'UA-87053058-4', {
					'page_path': window.location.pathname + window.location.hash,
						'crm_leadid': sessionStorage.getItem('leadId'),
						'crm_proposerid': "",
						'crm_product': sessionStorage.getItem('pName'),
						'custom_map': {
							'dimension3': 'crm_leadid',
							'dimension4': 'crm_proposerid',
							'dimension5': 'crm_product',
							}
						});
					}
					/* New Renew GTtag To Run From Controller */
					else if($location.$$path != '/new-renewal-landing'){
						$window.gtag('config', 'UA-87053058-4',{'page_path': window.location.pathname+window.location.hash,'title':newLocation.$$route.title});
					}
					/* End of New Renew GTtag To Run From Controller */
					// else{
					// 	$window.gtag('config', 'UA-87053058-4',{'page_path': window.location.pathname+window.location.hash,'title':newLocation.$$route.title});
					// }
					if(newLocation.$$route.originalPath != '/' && newLocation.$$route.originalPath != '/plans'){
						$("html, body").animate({ scrollTop: 180 }, 300);
					}else if(newLocation.$$route.originalPath == '/plans'){
						$("html, body").animate({ scrollTop: $(".select-plan").offset().top }, 300);
					}
				},400);
			}	

			/* Function for page drop */

				if(newLocation.$$route.controller != 'preQuoteApp' && newLocation.$$route.controller != 'urlProcess' && newLocation.$$route.controller != 'extPreQuote' && newLocation.$$route.controller != 'thankYou' && newLocation.$$route.controller != 'webAggApp' && newLocation.$$route.controller != 'paymentDone'){
					var pageNoSeq = sessionStorage.getItem('pageNoSeq');
					if(pageNoSeq == null){
						pageNoSeq = 0;
					}
					if($rootScope.currentRoute[1] == 'reco' && pageNoSeq == 0){
						callPageDropService($rootScope.currentRoute[1],'PageDrop',false);
						sessionStorage.setItem('lastRouteVisted',$rootScope.currentRoute[1]);
						sessionStorage.setItem('pageNoSeq', 1);
					}else if($rootScope.currentRoute[1] == 'plans' && pageNoSeq == 1){
						callPageDropService($rootScope.currentRoute[1],'PageDrop',false);
						sessionStorage.setItem('lastRouteVisted',$rootScope.currentRoute[1]);
						sessionStorage.setItem('pageNoSeq', 2);
					}else if(($rootScope.currentRoute[1] == 'activ-care-quote' || $rootScope.currentRoute[1] == 'diamond-stp-quote' || $rootScope.currentRoute[1] == 'corona-kavach-quote' || $rootScope.currentRoute[1] == 'arogya-sanjeevani-quote' || $rootScope.currentRoute[1] == 'platinum-quote' || $rootScope.currentRoute[1] == 'diamond-quote' || $rootScope.currentRoute[1] == 'pa-quote' || $rootScope.currentRoute[1] == 'ci-quote' || $rootScope.currentRoute[1] == 'cs-quote' || $rootScope.currentRoute[1] == 'fit-quote' ) ){
						callPageDropService($rootScope.currentRoute[1],'PageDrop',false);
						sessionStorage.setItem('lastRouteVisted',$rootScope.currentRoute[1]);
						sessionStorage.setItem('pageNoSeq', 3);
					}else if($rootScope.currentRoute[1] == 'pa-customize-quote'){
						callPageDropService($rootScope.currentRoute[1],'PageDrop',false);
						sessionStorage.setItem('lastRouteVisted',$rootScope.currentRoute[1]);
						sessionStorage.setItem('pageNoSeq', 3);
					}else if(( $rootScope.currentRoute[1] == 'activ-care-proposer-details' || $rootScope.currentRoute[1] == 'corona-kavach-proposer-details' || $rootScope.currentRoute[1] == 'arogya-sanjeevani-proposer-details' || $rootScope.currentRoute[1] == 'platinum-proposer-details' || $rootScope.currentRoute[1] == 'diamond-proposer-details' || $rootScope.currentRoute[1] == 'rfb-proposer-details' || $rootScope.currentRoute[1] == 'cross-sell-proposer-details' || $rootScope.currentRoute[1] == 'fit-proposer-details' ) ){
						callPageDropService($rootScope.currentRoute[1],'PageDrop',false);
						sessionStorage.setItem('lastRouteVisted',$rootScope.currentRoute[1]);
						sessionStorage.setItem('pageNoSeq', 4);
					}else if(($rootScope.currentRoute[1] == 'activ-care-insured-details' || $rootScope.currentRoute[1] == 'corona-kavach-insured-details' || $rootScope.currentRoute[1] == 'arogya-sanjeevani-insured-details' || $rootScope.currentRoute[1] == 'platinum-insured-details' || $rootScope.currentRoute[1] == 'diamond-insured-details' || $rootScope.currentRoute[1] == 'rfb-insured-details' || $rootScope.currentRoute[1] == 'cross-sell-insured-details' || $rootScope.currentRoute[1] == 'fit-insured-details') ){
						callPageDropService($rootScope.currentRoute[1],'PageDrop',false);
						sessionStorage.setItem('lastRouteVisted',$rootScope.currentRoute[1]);
						sessionStorage.setItem('pageNoSeq', 5);
					}else if(($rootScope.currentRoute[1] == 'activ-care-health-lifestyle' || $rootScope.currentRoute[1] == 'corona-kavach-health-lifestyle' || $rootScope.currentRoute[1] == 'arogya-sanjeevani-health-lifestyle' || $rootScope.currentRoute[1] == 'platinum-health-lifestyle' || $rootScope.currentRoute[1] == 'diamond-health-lifestyle' || $rootScope.currentRoute[1] == 'rfb-health-lifestyle' || $rootScope.currentRoute[1] == 'cross-sell-health-lifestyle' || $rootScope.currentRoute[1] == 'fit-health-lifestyle' ) ){
						callPageDropService($rootScope.currentRoute[1],'PageDrop',false);
						sessionStorage.setItem('lastRouteVisted',$rootScope.currentRoute[1]);
						sessionStorage.setItem('pageNoSeq', 6);
					}else if(($rootScope.currentRoute[1] == 'activ-care-declaration' || $rootScope.currentRoute[1] == 'corona-kavach-declaration' || $rootScope.currentRoute[1] == 'arogya-sanjeevani-declaration' || $rootScope.currentRoute[1] == 'platinum-declaration' || $rootScope.currentRoute[1] == 'diamond-declaration' || $rootScope.currentRoute[1] == 'rfb-declaration' || $rootScope.currentRoute[1] == 'cross-sell-declaration' || $rootScope.currentRoute[1] == 'fit-declaration' ) ){
						callPageDropService($rootScope.currentRoute[1],'PageDrop',false);
						sessionStorage.setItem('lastRouteVisted',$rootScope.currentRoute[1]);
						sessionStorage.setItem('pageNoSeq', 7);
					}else if(newLocation.$$route.controller == 'paymentResponse'){
						callPageDropService('paymentResponse','PageDrop',false);
						sessionStorage.setItem('lastRouteVisted',$rootScope.currentRoute[1]);
						sessionStorage.setItem('pageNoSeq', 8);
					}else if(newLocation.$$route.controller == 'postPaymentCtrl' ){
						callPageDropService($rootScope.currentRoute[1],'PageDrop',false);
						sessionStorage.setItem('lastRouteVisted',$rootScope.currentRoute[1]);
						sessionStorage.setItem('pageNoSeq', 9);
					}
				}

			/* End of function to page drop */

			/* start lemnisk page load */
			var pagePath = window.location.href;
			var pageName = pagePath.split("/").pop();
			var realName = pageName;
			if(pageName.indexOf("?") !== -1){
				var temp = pageName.split("?");
				realName = temp[0];
			};
			lmSMTObj.page(
				{
					"pageProps": {
						"name": realName
					}
				},
				function () { }
			);

			clevertap.event.push("Page Viewed", {
				"Page name": realName
			});
			//console.log(realName);
			/* end lemnisk page load */
		});

	/* End of changing route */

	
	/* Function to call gtag events */

		$rootScope.callGtag = function(event,event_category,event_label){
			$window.gtag('event', event, {'event_category': event_category ,'event_label':event_label });
		}

	/* End of function to call gtag events */

	/* Function to call gtag events */

		$rootScope.callGtagAccord = function(event,event_category,event_label,accorVal){
			if($('#'+accorVal).css('display') == "block"){
				$window.gtag('event', event, {'event_category': event_category ,'event_label':event_label+'_close' });
			}
			else{
				$window.gtag('event', event, {'event_category': event_category ,'event_label':event_label+'_open' });
			}
			
		}

	/* End of function to call gtag events */


	/* Proposer page navigation through bradcrumb */

		$rootScope.breadcrumbNavigation = function(breadcrumbType,url,gtagUrl,pageNum){
			if(url == 'health-lifestyle' && $rootScope.preExeDisease != 'true'){
				return false;
			}
			if(sessionStorage.getItem('pageNoSeq') >= pageNum){
				var isCrossSell = sessionStorage.getItem('crossSell');
				var primProduct = sessionStorage.getItem('pName');
				if(isCrossSell == 'true'){
					$location.url('cross-sell-'+url);
				}else{
					if(primProduct == 'Activ Health'){
						$location.url('platinum-'+url);
					}else if(primProduct == 'Activ Assure'){
						$location.url('diamond-'+url);
					}else if(primProduct == 'Activ Care'){
						$location.url('activ-care-'+url);
					}else if(primProduct == 'Corona Kavach'){
						$location.url('corona-kavach-'+url);
					}else if(primProduct == 'Arogya Sanjeevani') {
						$location.url('arogya-sanjeevani-'+url);
					}else if(primProduct == 'Activ Fit') {
						$location.url('fit-'+url);
					}
					else{
						$location.url('rfb-'+url);
					}
				}
				$rootScope.callGtag('click-item', 'buy-universal' ,'buy-universal_'+breadcrumbType+'-['+$rootScope.currentRoute[1]+'-'+gtagUrl+']');
			}
		}

	/* End of proposer page */

	/* click to call stand alone functionality */

		$rootScope.clickToCallAlone = function(){

			if(!angular.isUndefined(sessionStorage.getItem('mobNo'))){
				var mob = sessionStorage.getItem('mobNo')
			}

			 appService.get(ABHI_CONFIG.hservicesv2+"/ClickToCall/click2call?customerNumber=" +$rootScope.encryptWithoutString(mob)).then(function(response){
					 console.log("hello")
			 })

		}

	/* click to call stand alone functionality ends */	 	

	/* Quote Page navigation through breadcrumb */

		$rootScope.quoteNavigation = function(){
			var primProduct = sessionStorage.getItem('pName');
			switch(primProduct){
				case 'Activ Health':
					$location.url('platinum-quote');
					break;
				case 'Activ Assure':
					$location.url('diamond-quote');
					break;
				case 'Activ Secure Personal Accident':
					$location.url('pa-quote');
					break;
				case 'Activ Secure Critical Illness':
					$location.url('ci-quote');
					break;
				case 'Activ Secure Cancer Secure':
					$location.url('cs-quote');
					break;
				case 'Activ Care':
					$location.url('activ-care-quote');
					break;
				case 'Corona Kavach':
					$location.url('corona-kavach-quote');
					break;
				case 'Arogya Sanjeevani':
					$location.url('arogya-sanjeevani-quote');
					break;	
				case 'Activ Fit':
					$location.url('fit-quote');
					break;			
				default:
					break;
			}
			$rootScope.callGtag('click-item', 'buy-universal' ,'buy-universal_breadcrumbs-['+$rootScope.currentRoute[1]+'-Quotation]');
		}

	/* End of quote page navigation trhough breadcrumb */


	/* Popup alert configuration */

		$rootScope.showAlert = {
			'type': "",
			'message': ""
		}
		var tOut;
		$rootScope.alertConfiguration = function(type,message,gtagLabel){
			$rootScope.showAlert = {
				'type': type,
				'message': message
			}
			tOut = $timeout(function(){
				$rootScope.showAlert = {
					'type': "",
					'message': ""
				}
			},6000);
			$rootScope.callGtag("alert",$rootScope.currentRoute[1],gtagLabel)
		}

		$rootScope.alertClose = function(){
			$rootScope.showAlert = {
				'type': "",
				'message': ""
			}
			$timeout.cancel(tOut);
		}

	/* End of popup alert configuration */

	$rootScope.iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

	/* Enabling send sms btn */

		function fetchIPDetails(){
			$rootScope.sendSmsBtn = false;
			$.getJSON('http://ip-api.com/json/', function(data) {
				if((data.query.match(/103.68.199/g) || []).length > 0 || (data.query.match(/203.77.177/g) || []).length > 0){
					sessionStorage.setItem('sendSMS','1');
					$rootScope.sendSmsBtn = true;
				}
			});
		}
		var isSendSMS = sessionStorage.getItem('sendSMS');
		$(document).ready(function(){
			if(isSendSMS == '1'){
				sessionStorage.setItem('sendSMS','1');
				$rootScope.sendSmsBtn = true;
			}else{
				fetchIPDetails();
			}
		});

	/* End of enabling send smm btn */
	var myKeys = {17: false, 16: false , 65 : false}; // 17 for ctrl key, 16 for shift key, and 75 for B key
		$rootScope.keydownEvent = function(ev){
			if (ev.keyCode in myKeys) {
								myKeys[ev.keyCode] = true;
								if (myKeys[17] && myKeys[16] && myKeys[65]) {
									console.log("ctrl-shift-k pressed");
									$rootScope.sendSMS();
								}
							}
							else{
								myKeys = {17: false, 16: false , 65 : false}
							}
		}
		$rootScope.keyupEvent = function(es){
			if (es.keyCode in myKeys) {
								myKeys[es.keyCode] = false;
							}
		}

	/* Sending SMS */

		$rootScope.sendSMS = function(){
			$rootScope.callGtag("click-button","send-customer-sms","send-btn");
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Send SMS to customer",
				"modalBodyText": "<p>Please confirm if you wish to trigger drop off SMS to customer. Please note that you will have to close the window once the SMS is sent successfully to allow customer to proceed.</p>",
				"showCancelBtn": true,
				"modalSuccessText" : "Send SMS",
				"modalCancelText" : "Not Now",
				"showAlertModal": true,
				"hideCloseBtn": true,
				"gtagPostiveFunction" : "click-button,send-customer-sms,alert-confirm_send-sms ",
				"gtagNegativeFunction" : "click-button,send-customer-sms,alert-confirm_not-now ",
				"gtagCrossFunction" : "click-button,send-customer-sms,alert-confirm_cross",
				"positiveFunction": function(){
					callPageDropService($rootScope.currentRoute[1],'SendUserSMS',true);
				},
				"negativeFunction": function(){
					myKeys = {17: false, 16: false , 65 : false};
				}	                	
			}
		}

	/* End of sending SMS */


		var BlockNos = [9999999999, 9999999998, 9989898989, 9989888888, 9987878787, 9987833248, 9987310018, 9971099720, 9930956001, 9911037796, 9906255123, 9902398846, 9899999999, 9899898989, 9898999898, 9898998989, 9898989989, 9898989898, 9898989889, 9898988989, 9898988888, 9897979878, 9892952052, 9891331263, 9889898989, 9888888999, 9888888888, 9885527755, 9876543210, 9871222121, 9856333333, 9855555555, 9854166351, 9834508986, 9831058650, 9821216313, 9820924276, 9820098200, 9810098433, 9797977979, 9777777777, 9769931166, 9699076631, 9696969696, 9655555555, 9595959599, 9595959595, 9574444453, 9483075525, 9372419107, 9351275304, 9324746479, 9172730889, 9119419719, 9108074242, 9100000000, 9099999999, 9090990909, 9090909909, 9090909099, 9090909090, 9014190141, 9009999999, 9000888777, 9000121000, 9000000000, 8999999999, 8998989898, 8998988998, 8998898989, 8989988989, 8989898989, 8989898988, 8989898987, 8989898986, 8979797987, 8978979879, 8978978978, 8978797978, 8939324939, 8898989898, 8888899999, 8888889999, 8888888999, 8888888899, 8888888889, 8886792844, 8884019013, 8806389228, 8805225266, 8797140028, 8588888888, 8547864701, 8539975132, 8472085615, 8437040648, 8426985374, 8233532274, 8146235486, 8103293494, 8076355542, 8074036280, 8000060000, 7990314344, 7985360545, 7888888888, 7780743998, 7738528181, 7503261053, 7405615117, 7358827266, 7351774354, 7045656454, 7026206999, 7006111467, 7004777429, 6393197632, 6305945342, 6262323232, 6000000000, 2067135800];

			$rootScope.ValidateBlockNo = function (mobno) {
				if (mobno) {
					return BlockNos.includes(Number(mobno)) ? true : false
				}
			}


/*Block List Numbers End */

/* New Renew Function For Page Navigation */
$rootScope.newRenewRouting = function(url){
	$location.url(url)
}
/* End of New Renew Function For Page Navigation */	

$rootScope.lemniskTrack = function (propName, propVal, properties) {
	var pagePath = window.location.href;
	var pageName = pagePath.split("/").pop();
	var realName = pageName;
	if(pageName.indexOf("?") !== -1){
		var temp = pageName.split("?");
		realName = temp[0];
	};
	//console.log("lemniskTrack: " + propName + " : " + propVal);
	if(properties != "" && properties != undefined){
	console.log("lemniskTrack: " + JSON.stringify(properties));
		lmSMTObj.track("leadForm",
		{
			"leadFormProperties": {
				"name": realName,
				properties
			}
		}, function () { });
		
		let cleverProp = JSON.stringify(properties);
		clevertap.event.push("Product Viewed", {
			"Product name":realName,
			cleverProp
		});
		console.log("clever 01 : " + cleverProp);
	}
	else{
		lmSMTObj.track("leadForm",
		{
			"leadFormProperties": {
				"name": realName,
				"properties": {
					propName: propVal,
				}
			}
		}, function () { });

		clevertap.event.push("Product Viewed", {
			"Product name":realName,
			"properties": {
				propName: propVal,
			}
		});
		console.log("clever 02 : " + cleverProp);
	}
}

$rootScope.lemniskPage = function (pageName) {
	console.log("lemniskPage: " + pageName);
	lmSMTObj.page(
		{
			"pageProps": {
				"name": pageName
			}
		},
		function () { }
	);

	clevertap.event.push("Product Viewed", {
		"Product name": {
			"properties": pageName
		}
	});
}

}]);

/* End of app Run */

/* Encryption Logic */

var CryptoJS = CryptoJS || function (u, p) {
var d = {}, l = d.lib = {}, s = function () { }, t = l.Base = { extend: function (a) { s.prototype = this; var c = new s; a && c.mixIn(a); c.hasOwnProperty("init") || (c.init = function () { c.$super.init.apply(this, arguments) }); c.init.prototype = c; c.$super = this; return c }, create: function () { var a = this.extend(); a.init.apply(a, arguments); return a }, init: function () { }, mixIn: function (a) { for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]); a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function () { return this.init.prototype.extend(this) } },
r = l.WordArray = t.extend({
	init: function (a, c) { a = this.words = a || []; this.sigBytes = c != p ? c : 4 * a.length }, toString: function (a) { return (a || v).stringify(this) }, concat: function (a) { var c = this.words, e = a.words, j = this.sigBytes; a = a.sigBytes; this.clamp(); if (j % 4) for (var k = 0; k < a; k++)c[j + k >>> 2] |= (e[k >>> 2] >>> 24 - 8 * (k % 4) & 255) << 24 - 8 * ((j + k) % 4); else if (65535 < e.length) for (k = 0; k < a; k += 4)c[j + k >>> 2] = e[k >>> 2]; else c.push.apply(c, e); this.sigBytes += a; return this }, clamp: function () {
		var a = this.words, c = this.sigBytes; a[c >>> 2] &= 4294967295 <<
			32 - 8 * (c % 4); a.length = u.ceil(c / 4)
	}, clone: function () { var a = t.clone.call(this); a.words = this.words.slice(0); return a }, random: function (a) { for (var c = [], e = 0; e < a; e += 4)c.push(4294967296 * u.random() | 0); return new r.init(c, a) }
}), w = d.enc = {}, v = w.Hex = {
	stringify: function (a) { var c = a.words; a = a.sigBytes; for (var e = [], j = 0; j < a; j++) { var k = c[j >>> 2] >>> 24 - 8 * (j % 4) & 255; e.push((k >>> 4).toString(16)); e.push((k & 15).toString(16)) } return e.join("") }, parse: function (a) {
		for (var c = a.length, e = [], j = 0; j < c; j += 2)e[j >>> 3] |= parseInt(a.substr(j,
			2), 16) << 24 - 4 * (j % 8); return new r.init(e, c / 2)
	}
}, b = w.Latin1 = { stringify: function (a) { var c = a.words; a = a.sigBytes; for (var e = [], j = 0; j < a; j++)e.push(String.fromCharCode(c[j >>> 2] >>> 24 - 8 * (j % 4) & 255)); return e.join("") }, parse: function (a) { for (var c = a.length, e = [], j = 0; j < c; j++)e[j >>> 2] |= (a.charCodeAt(j) & 255) << 24 - 8 * (j % 4); return new r.init(e, c) } }, x = w.Utf8 = { stringify: function (a) { try { return decodeURIComponent(escape(b.stringify(a))) } catch (c) { throw Error("Malformed UTF-8 data"); } }, parse: function (a) { return b.parse(unescape(encodeURIComponent(a))) } },
q = l.BufferedBlockAlgorithm = t.extend({
	reset: function () { this._data = new r.init; this._nDataBytes = 0 }, _append: function (a) { "string" == typeof a && (a = x.parse(a)); this._data.concat(a); this._nDataBytes += a.sigBytes }, _process: function (a) { var c = this._data, e = c.words, j = c.sigBytes, k = this.blockSize, b = j / (4 * k), b = a ? u.ceil(b) : u.max((b | 0) - this._minBufferSize, 0); a = b * k; j = u.min(4 * a, j); if (a) { for (var q = 0; q < a; q += k)this._doProcessBlock(e, q); q = e.splice(0, a); c.sigBytes -= j } return new r.init(q, j) }, clone: function () {
		var a = t.clone.call(this);
		a._data = this._data.clone(); return a
	}, _minBufferSize: 0
}); l.Hasher = q.extend({
	cfg: t.extend(), init: function (a) { this.cfg = this.cfg.extend(a); this.reset() }, reset: function () { q.reset.call(this); this._doReset() }, update: function (a) { this._append(a); this._process(); return this }, finalize: function (a) { a && this._append(a); return this._doFinalize() }, blockSize: 16, _createHelper: function (a) { return function (b, e) { return (new a.init(e)).finalize(b) } }, _createHmacHelper: function (a) {
		return function (b, e) {
			return (new n.HMAC.init(a,
				e)).finalize(b)
		}
	}
}); var n = d.algo = {}; return d
}(Math);
(function () {
var u = CryptoJS, p = u.lib.WordArray; u.enc.Base64 = {
	stringify: function (d) { var l = d.words, p = d.sigBytes, t = this._map; d.clamp(); d = []; for (var r = 0; r < p; r += 3)for (var w = (l[r >>> 2] >>> 24 - 8 * (r % 4) & 255) << 16 | (l[r + 1 >>> 2] >>> 24 - 8 * ((r + 1) % 4) & 255) << 8 | l[r + 2 >>> 2] >>> 24 - 8 * ((r + 2) % 4) & 255, v = 0; 4 > v && r + 0.75 * v < p; v++)d.push(t.charAt(w >>> 6 * (3 - v) & 63)); if (l = t.charAt(64)) for (; d.length % 4;)d.push(l); return d.join("") }, parse: function (d) {
		var l = d.length, s = this._map, t = s.charAt(64); t && (t = d.indexOf(t), -1 != t && (l = t)); for (var t = [], r = 0, w = 0; w <
			l; w++)if (w % 4) { var v = s.indexOf(d.charAt(w - 1)) << 2 * (w % 4), b = s.indexOf(d.charAt(w)) >>> 6 - 2 * (w % 4); t[r >>> 2] |= (v | b) << 24 - 8 * (r % 4); r++ } return p.create(t, r)
	}, _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
}
})();
(function (u) {
function p(b, n, a, c, e, j, k) { b = b + (n & a | ~n & c) + e + k; return (b << j | b >>> 32 - j) + n } function d(b, n, a, c, e, j, k) { b = b + (n & c | a & ~c) + e + k; return (b << j | b >>> 32 - j) + n } function l(b, n, a, c, e, j, k) { b = b + (n ^ a ^ c) + e + k; return (b << j | b >>> 32 - j) + n } function s(b, n, a, c, e, j, k) { b = b + (a ^ (n | ~c)) + e + k; return (b << j | b >>> 32 - j) + n } for (var t = CryptoJS, r = t.lib, w = r.WordArray, v = r.Hasher, r = t.algo, b = [], x = 0; 64 > x; x++)b[x] = 4294967296 * u.abs(u.sin(x + 1)) | 0; r = r.MD5 = v.extend({
	_doReset: function () { this._hash = new w.init([1732584193, 4023233417, 2562383102, 271733878]) },
	_doProcessBlock: function (q, n) {
		for (var a = 0; 16 > a; a++) { var c = n + a, e = q[c]; q[c] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360 } var a = this._hash.words, c = q[n + 0], e = q[n + 1], j = q[n + 2], k = q[n + 3], z = q[n + 4], r = q[n + 5], t = q[n + 6], w = q[n + 7], v = q[n + 8], A = q[n + 9], B = q[n + 10], C = q[n + 11], u = q[n + 12], D = q[n + 13], E = q[n + 14], x = q[n + 15], f = a[0], m = a[1], g = a[2], h = a[3], f = p(f, m, g, h, c, 7, b[0]), h = p(h, f, m, g, e, 12, b[1]), g = p(g, h, f, m, j, 17, b[2]), m = p(m, g, h, f, k, 22, b[3]), f = p(f, m, g, h, z, 7, b[4]), h = p(h, f, m, g, r, 12, b[5]), g = p(g, h, f, m, t, 17, b[6]), m = p(m, g, h, f, w, 22, b[7]),
f=p(f,m,g,h,v,7,b[8]),h=p(h,f,m,g,A,12,b[9]),g=p(g,h,f,m,B,17,b[10]),m=p(m,g,h,f,C,22,b[11]),f=p(f,m,g,h,u,7,b[12]),h=p(h,f,m,g,D,12,b[13]),g=p(g,h,f,m,E,17,b[14]),m=p(m,g,h,f,x,22,b[15]),f=d(f,m,g,h,e,5,b[16]),h=d(h,f,m,g,t,9,b[17]),g=d(g,h,f,m,C,14,b[18]),m=d(m,g,h,f,c,20,b[19]),f=d(f,m,g,h,r,5,b[20]),h=d(h,f,m,g,B,9,b[21]),g=d(g,h,f,m,x,14,b[22]),m=d(m,g,h,f,z,20,b[23]),f=d(f,m,g,h,A,5,b[24]),h=d(h,f,m,g,E,9,b[25]),g=d(g,h,f,m,k,14,b[26]),m=d(m,g,h,f,v,20,b[27]),f=d(f,m,g,h,D,5,b[28]),h=d(h,f,
m,g,j,9,b[29]),g=d(g,h,f,m,w,14,b[30]),m=d(m,g,h,f,u,20,b[31]),f=l(f,m,g,h,r,4,b[32]),h=l(h,f,m,g,v,11,b[33]),g=l(g,h,f,m,C,16,b[34]),m=l(m,g,h,f,E,23,b[35]),f=l(f,m,g,h,e,4,b[36]),h=l(h,f,m,g,z,11,b[37]),g=l(g,h,f,m,w,16,b[38]),m=l(m,g,h,f,B,23,b[39]),f=l(f,m,g,h,D,4,b[40]),h=l(h,f,m,g,c,11,b[41]),g=l(g,h,f,m,k,16,b[42]),m=l(m,g,h,f,t,23,b[43]),f=l(f,m,g,h,A,4,b[44]),h=l(h,f,m,g,u,11,b[45]),g=l(g,h,f,m,x,16,b[46]),m=l(m,g,h,f,j,23,b[47]),f=s(f,m,g,h,c,6,b[48]),h=s(h,f,m,g,w,10,b[49]),g=s(g,h,f,m,
					E, 15, b[50]), m = s(m, g, h, f, r, 21, b[51]), f = s(f, m, g, h, u, 6, b[52]), h = s(h, f, m, g, k, 10, b[53]), g = s(g, h, f, m, B, 15, b[54]), m = s(m, g, h, f, e, 21, b[55]), f = s(f, m, g, h, v, 6, b[56]), h = s(h, f, m, g, x, 10, b[57]), g = s(g, h, f, m, t, 15, b[58]), m = s(m, g, h, f, D, 21, b[59]), f = s(f, m, g, h, z, 6, b[60]), h = s(h, f, m, g, C, 10, b[61]), g = s(g, h, f, m, j, 15, b[62]), m = s(m, g, h, f, A, 21, b[63]); a[0] = a[0] + f | 0; a[1] = a[1] + m | 0; a[2] = a[2] + g | 0; a[3] = a[3] + h | 0
	}, _doFinalize: function () {
		var b = this._data, n = b.words, a = 8 * this._nDataBytes, c = 8 * b.sigBytes; n[c >>> 5] |= 128 << 24 - c % 32; var e = u.floor(a /
			4294967296); n[(c + 64 >>> 9 << 4) + 15] = (e << 8 | e >>> 24) & 16711935 | (e << 24 | e >>> 8) & 4278255360; n[(c + 64 >>> 9 << 4) + 14] = (a << 8 | a >>> 24) & 16711935 | (a << 24 | a >>> 8) & 4278255360; b.sigBytes = 4 * (n.length + 1); this._process(); b = this._hash; n = b.words; for (a = 0; 4 > a; a++)c = n[a], n[a] = (c << 8 | c >>> 24) & 16711935 | (c << 24 | c >>> 8) & 4278255360; return b
	}, clone: function () { var b = v.clone.call(this); b._hash = this._hash.clone(); return b }
}); t.MD5 = v._createHelper(r); t.HmacMD5 = v._createHmacHelper(r)
})(Math);
(function () {
var u = CryptoJS, p = u.lib, d = p.Base, l = p.WordArray, p = u.algo, s = p.EvpKDF = d.extend({ cfg: d.extend({ keySize: 4, hasher: p.MD5, iterations: 1 }), init: function (d) { this.cfg = this.cfg.extend(d) }, compute: function (d, r) { for (var p = this.cfg, s = p.hasher.create(), b = l.create(), u = b.words, q = p.keySize, p = p.iterations; u.length < q;) { n && s.update(n); var n = s.update(d).finalize(r); s.reset(); for (var a = 1; a < p; a++)n = s.finalize(n), s.reset(); b.concat(n) } b.sigBytes = 4 * q; return b } }); u.EvpKDF = function (d, l, p) {
	return s.create(p).compute(d,
		l)
}
})();
CryptoJS.lib.Cipher || function (u) {
var p = CryptoJS, d = p.lib, l = d.Base, s = d.WordArray, t = d.BufferedBlockAlgorithm, r = p.enc.Base64, w = p.algo.EvpKDF, v = d.Cipher = t.extend({
	cfg: l.extend(), createEncryptor: function (e, a) { return this.create(this._ENC_XFORM_MODE, e, a) }, createDecryptor: function (e, a) { return this.create(this._DEC_XFORM_MODE, e, a) }, init: function (e, a, b) { this.cfg = this.cfg.extend(b); this._xformMode = e; this._key = a; this.reset() }, reset: function () { t.reset.call(this); this._doReset() }, process: function (e) { this._append(e); return this._process() },
	finalize: function (e) { e && this._append(e); return this._doFinalize() }, keySize: 4, ivSize: 4, _ENC_XFORM_MODE: 1, _DEC_XFORM_MODE: 2, _createHelper: function (e) { return { encrypt: function (b, k, d) { return ("string" == typeof k ? c : a).encrypt(e, b, k, d) }, decrypt: function (b, k, d) { return ("string" == typeof k ? c : a).decrypt(e, b, k, d) } } }
}); d.StreamCipher = v.extend({ _doFinalize: function () { return this._process(!0) }, blockSize: 1 }); var b = p.mode = {}, x = function (e, a, b) {
	var c = this._iv; c ? this._iv = u : c = this._prevBlock; for (var d = 0; d < b; d++)e[a + d] ^=
		c[d]
}, q = (d.BlockCipherMode = l.extend({ createEncryptor: function (e, a) { return this.Encryptor.create(e, a) }, createDecryptor: function (e, a) { return this.Decryptor.create(e, a) }, init: function (e, a) { this._cipher = e; this._iv = a } })).extend(); q.Encryptor = q.extend({ processBlock: function (e, a) { var b = this._cipher, c = b.blockSize; x.call(this, e, a, c); b.encryptBlock(e, a); this._prevBlock = e.slice(a, a + c) } }); q.Decryptor = q.extend({
	processBlock: function (e, a) {
		var b = this._cipher, c = b.blockSize, d = e.slice(a, a + c); b.decryptBlock(e, a); x.call(this,
			e, a, c); this._prevBlock = d
	}
}); b = b.CBC = q; q = (p.pad = {}).Pkcs7 = { pad: function (a, b) { for (var c = 4 * b, c = c - a.sigBytes % c, d = c << 24 | c << 16 | c << 8 | c, l = [], n = 0; n < c; n += 4)l.push(d); c = s.create(l, c); a.concat(c) }, unpad: function (a) { a.sigBytes -= a.words[a.sigBytes - 1 >>> 2] & 255 } }; d.BlockCipher = v.extend({
	cfg: v.cfg.extend({ mode: b, padding: q }), reset: function () {
		v.reset.call(this); var a = this.cfg, b = a.iv, a = a.mode; if (this._xformMode == this._ENC_XFORM_MODE) var c = a.createEncryptor; else c = a.createDecryptor, this._minBufferSize = 1; this._mode = c.call(a,
			this, b && b.words)
	}, _doProcessBlock: function (a, b) { this._mode.processBlock(a, b) }, _doFinalize: function () { var a = this.cfg.padding; if (this._xformMode == this._ENC_XFORM_MODE) { a.pad(this._data, this.blockSize); var b = this._process(!0) } else b = this._process(!0), a.unpad(b); return b }, blockSize: 4
}); var n = d.CipherParams = l.extend({ init: function (a) { this.mixIn(a) }, toString: function (a) { return (a || this.formatter).stringify(this) } }), b = (p.format = {}).OpenSSL = {
	stringify: function (a) {
		var b = a.ciphertext; a = a.salt; return (a ? s.create([1398893684,
			1701076831]).concat(a).concat(b) : b).toString(r)
	}, parse: function (a) { a = r.parse(a); var b = a.words; if (1398893684 == b[0] && 1701076831 == b[1]) { var c = s.create(b.slice(2, 4)); b.splice(0, 4); a.sigBytes -= 16 } return n.create({ ciphertext: a, salt: c }) }
}, a = d.SerializableCipher = l.extend({
	cfg: l.extend({ format: b }), encrypt: function (a, b, c, d) { d = this.cfg.extend(d); var l = a.createEncryptor(c, d); b = l.finalize(b); l = l.cfg; return n.create({ ciphertext: b, key: c, iv: l.iv, algorithm: a, mode: l.mode, padding: l.padding, blockSize: a.blockSize, formatter: d.format }) },
	decrypt: function (a, b, c, d) { d = this.cfg.extend(d); b = this._parse(b, d.format); return a.createDecryptor(c, d).finalize(b.ciphertext) }, _parse: function (a, b) { return "string" == typeof a ? b.parse(a, this) : a }
}), p = (p.kdf = {}).OpenSSL = { execute: function (a, b, c, d) { d || (d = s.random(8)); a = w.create({ keySize: b + c }).compute(a, d); c = s.create(a.words.slice(b), 4 * c); a.sigBytes = 4 * b; return n.create({ key: a, iv: c, salt: d }) } }, c = d.PasswordBasedCipher = a.extend({
	cfg: a.cfg.extend({ kdf: p }), encrypt: function (b, c, d, l) {
		l = this.cfg.extend(l); d = l.kdf.execute(d,
			b.keySize, b.ivSize); l.iv = d.iv; b = a.encrypt.call(this, b, c, d.key, l); b.mixIn(d); return b
	}, decrypt: function (b, c, d, l) { l = this.cfg.extend(l); c = this._parse(c, l.format); d = l.kdf.execute(d, b.keySize, b.ivSize, c.salt); l.iv = d.iv; return a.decrypt.call(this, b, c, d.key, l) }
})
}();
(function () {
for (var u = CryptoJS, p = u.lib.BlockCipher, d = u.algo, l = [], s = [], t = [], r = [], w = [], v = [], b = [], x = [], q = [], n = [], a = [], c = 0; 256 > c; c++)a[c] = 128 > c ? c << 1 : c << 1 ^ 283; for (var e = 0, j = 0, c = 0; 256 > c; c++) { var k = j ^ j << 1 ^ j << 2 ^ j << 3 ^ j << 4, k = k >>> 8 ^ k & 255 ^ 99; l[e] = k; s[k] = e; var z = a[e], F = a[z], G = a[F], y = 257 * a[k] ^ 16843008 * k; t[e] = y << 24 | y >>> 8; r[e] = y << 16 | y >>> 16; w[e] = y << 8 | y >>> 24; v[e] = y; y = 16843009 * G ^ 65537 * F ^ 257 * z ^ 16843008 * e; b[k] = y << 24 | y >>> 8; x[k] = y << 16 | y >>> 16; q[k] = y << 8 | y >>> 24; n[k] = y; e ? (e = z ^ a[a[a[G ^ z]]], j ^= a[a[j]]) : e = j = 1 } var H = [0, 1, 2, 4, 8,
	16, 32, 64, 128, 27, 54], d = d.AES = p.extend({
		_doReset: function () {
			for (var a = this._key, c = a.words, d = a.sigBytes / 4, a = 4 * ((this._nRounds = d + 6) + 1), e = this._keySchedule = [], j = 0; j < a; j++)if (j < d) e[j] = c[j]; else { var k = e[j - 1]; j % d ? 6 < d && 4 == j % d && (k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255]) : (k = k << 8 | k >>> 24, k = l[k >>> 24] << 24 | l[k >>> 16 & 255] << 16 | l[k >>> 8 & 255] << 8 | l[k & 255], k ^= H[j / d | 0] << 24); e[j] = e[j - d] ^ k } c = this._invKeySchedule = []; for (d = 0; d < a; d++)j = a - d, k = d % 4 ? e[j] : e[j - 4], c[d] = 4 > d || 4 >= j ? k : b[l[k >>> 24]] ^ x[l[k >>> 16 & 255]] ^ q[l[k >>>
				8 & 255]] ^ n[l[k & 255]]
		}, encryptBlock: function (a, b) { this._doCryptBlock(a, b, this._keySchedule, t, r, w, v, l) }, decryptBlock: function (a, c) { var d = a[c + 1]; a[c + 1] = a[c + 3]; a[c + 3] = d; this._doCryptBlock(a, c, this._invKeySchedule, b, x, q, n, s); d = a[c + 1]; a[c + 1] = a[c + 3]; a[c + 3] = d }, _doCryptBlock: function (a, b, c, d, e, j, l, f) {
			for (var m = this._nRounds, g = a[b] ^ c[0], h = a[b + 1] ^ c[1], k = a[b + 2] ^ c[2], n = a[b + 3] ^ c[3], p = 4, r = 1; r < m; r++)var q = d[g >>> 24] ^ e[h >>> 16 & 255] ^ j[k >>> 8 & 255] ^ l[n & 255] ^ c[p++], s = d[h >>> 24] ^ e[k >>> 16 & 255] ^ j[n >>> 8 & 255] ^ l[g & 255] ^ c[p++], t =
				d[k >>> 24] ^ e[n >>> 16 & 255] ^ j[g >>> 8 & 255] ^ l[h & 255] ^ c[p++], n = d[n >>> 24] ^ e[g >>> 16 & 255] ^ j[h >>> 8 & 255] ^ l[k & 255] ^ c[p++], g = q, h = s, k = t; q = (f[g >>> 24] << 24 | f[h >>> 16 & 255] << 16 | f[k >>> 8 & 255] << 8 | f[n & 255]) ^ c[p++]; s = (f[h >>> 24] << 24 | f[k >>> 16 & 255] << 16 | f[n >>> 8 & 255] << 8 | f[g & 255]) ^ c[p++]; t = (f[k >>> 24] << 24 | f[n >>> 16 & 255] << 16 | f[g >>> 8 & 255] << 8 | f[h & 255]) ^ c[p++]; n = (f[n >>> 24] << 24 | f[g >>> 16 & 255] << 16 | f[h >>> 8 & 255] << 8 | f[k & 255]) ^ c[p++]; a[b] = q; a[b + 1] = s; a[b + 2] = t; a[b + 3] = n
		}, keySize: 8
	}); u.AES = p._createHelper(d)
})();


/* Encryption Logic ends */
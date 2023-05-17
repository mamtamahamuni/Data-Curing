// Source: app.service.js
/* 
	
	Module :- App Service
	Author: Pankaj Patil
	Date: 18-06-2018	

*/

app.service('appService', ['$http', '$q', '$rootScope', '$location', '$window', 'COMMON_CONFIG', function ($http, $q, $rootScope, $location, $window, COMMON_CONFIG) {

	var aS = this;
	/*Enrypt/dycrypt Functionality code*/

	var key = CryptoJS.enc.Utf8.parse(COMMON_CONFIG.eDKey);
	var iv = CryptoJS.enc.Utf8.parse(COMMON_CONFIG.eDKey);
	$rootScope.encryptWithoutString = function (decrypted) {

		var encData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(decrypted), key,
			{
				keySize: 128 / 8,
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			});

		return encData.toString();
	}

	aS.checksome = function (params) {
		var SHA256 = CryptoJS.MD5(params).toString(CryptoJS.enc.HEX);
		return SHA256;
	}


	/*---------encrypt decrypt functionality for RBL PASA / FEDERAL PASA Key are same-----------
	  Key : 1234567812345678
      IV : 1234567887654321
      NOTE : For encryption used OPENSSL ENCRYPT method with cipher algo AES-128-CBC.
	*/

	$rootScope.decryptRBLPASA = function (encrypted) {
		var cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext: CryptoJS.enc.Base64.parse(encrypted) });

		var keyRBL = CryptoJS.enc.Utf8.parse('1234567812345678');
		var ivRBL = CryptoJS.enc.Utf8.parse('1234567887654321');

		return CryptoJS.AES.decrypt(cipherParams, keyRBL,
			{
				iv: ivRBL,
				padding: CryptoJS.pad.Pkcs7,
				mode: CryptoJS.mode.CBC
			}
		).toString(CryptoJS.enc.Utf8);
	}

	/*---------encrypt decrypt functionality for RBL PASA-----------*/
	var AESPasswordEncryptKey = CryptoJS.enc.Utf8.parse("5412364561234567");
	$rootScope.encrypt = function (decrypted) {

		var encData = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(decrypted)), AESPasswordEncryptKey,
			{
				keySize: 128 / 8,
				iv: iv,
				mode: CryptoJS.mode.CBC,
				padding: CryptoJS.pad.Pkcs7
			});

		return encData.toString();
	}

	$rootScope.decryptEncryptKey = function (encrypted) {
		var key = CryptoJS.MD5("AESPasswordEncryptKey");
		var iv = CryptoJS.MD5("5412364561234567");
		var cipherParams = CryptoJS.lib.CipherParams.create({
			ciphertext: CryptoJS.enc.Base64.parse(encrypted)
		});
		return CryptoJS.AES.decrypt(cipherParams, key,
			{
				iv: iv
			}).toString(CryptoJS.enc.Utf8);
	}

	// Common decrypt function
	$rootScope.decrypt = function (encrypted) {
		var decyencryptedpt = encrypted.split(' ').join('+');
		var cipherParams = CryptoJS.lib.CipherParams.create({
			ciphertext: CryptoJS.enc.Base64.parse(encrypted)
		});
		return CryptoJS.AES.decrypt(cipherParams, key,
			{
				iv: iv,
				padding: CryptoJS.pad.Pkcs7,
				mode: CryptoJS.mode.CBC
			}).toString(CryptoJS.enc.Utf8);
	}


	$rootScope.decryptAxisTeleSalesUrlParam = function (encrypted) {
		var key = CryptoJS.MD5("ABHIAPIEncryptionLID@12345678");
		var iv = CryptoJS.MD5("encryptionABHILID");
		var cipherParams = CryptoJS.lib.CipherParams.create({
			ciphertext: CryptoJS.enc.Base64.parse(encrypted)
		});
		return CryptoJS.AES.decrypt(cipherParams, key, { iv: iv }).toString(CryptoJS.enc.Utf8);
	}

	/*Enrypt/dycrypt Functionality code*/

	/* Get Service Integration */

	aS.getData = function (url, data, showLoader, config) {
		var defer = $q.defer();
		showLoader ? $rootScope.showLoader = angular.copy(showLoader) : "";
		var req = {
			method: 'GET',
			url: url,
			headers: config
		}
		$http(req)
			.then(function (data) {
				showLoader ? $rootScope.showLoader = false : "";
				if (data.data.ResponseCode == 401) {
					var apiActUrl = url.split('/api/');
					if (apiActUrl.length == 1) {
						return false;
					}
					var d = new Date();
					var m = d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
					var eventLabelData = sessionStorage.getItem('rid') + "-" + $location.$$path.substr(1) + "--" + apiActUrl[1] + "-" + m;
					$window.gtag('event', 'error-unauthorize', { 'event_category': 'buy-error', 'event_label': eventLabelData });
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true,
						"positiveFunction": function () {
							$location.url('pre-quote');
						}
					}
				} else {
					defer.resolve(data.data);
				}
				if (data.data.ResponseCode != 1 && data.data.ResponseCode != 2 && data.code != 1) {
					var apiActUrl = url.split('/api/');
					if (apiActUrl.length == 1) {
						return false;
					}
					var d = new Date();
					var m = d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
					var eventLabelData = sessionStorage.getItem('rid') + "-" + $location.$$path.substr(1) + "--" + apiActUrl[1] + "-" + m;
					$window.gtag('event', 'error-api', { 'event_category': 'buy-error', 'event_label': eventLabelData });
				}
			}, function (err) {
				var apiActUrl = url.split('/api/');
				if (apiActUrl.length == 1) {
					return false;
				}
				var d = new Date();
				var m = d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
				var eventLabelData = sessionStorage.getItem('rid') + "-" + $location.$$path.substr(1) + "--" + apiActUrl[1] + "-" + m;
				$window.gtag('event', 'error-network', { 'event_category': 'buy-error', 'event_label': eventLabelData });
				defer.reject(err);
			});
		return defer.promise;
	}

	/* End of get service integration */


	/* Post Service Integration */

	aS.postData = function (url, data, showLoader, config) {
		var defer = $q.defer();
		showLoader ? $rootScope.showLoader = angular.copy(showLoader) : "";
		var req = {
			method: 'POST',
			url: url,
			data: data,
			headers: config
		};
		$http(req)
			.then(function (data) {
				showLoader ? $rootScope.showLoader = false : "";
				if (data.data.ResponseCode == 401) {
					var apiActUrl = url.split('/api/');
					if (apiActUrl.length == 1) {
						return false;
					}
					var d = new Date();
					var m = d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
					var eventLabelData = sessionStorage.getItem('rid') + "-" + $location.$$path.substr(1) + "--" + apiActUrl[1] + "-" + m;
					$window.gtag('event', 'error-unauthorize', { 'event_category': 'buy-error', 'event_label': eventLabelData });
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.data.ResponseMessage,
						"showCancelBtn": false,
						"gtagPostiveFunction": "click-button,buy-online-gereric , service-fails[OK]",
						"gtagCrossFunction": "click-button, buy-online-gereric ,service-fails[X]",
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true,
						"positiveFunction": function () {
							$location.url('pre-quote');
						}
					}
				} else {
					defer.resolve(data.data);
				}
				if (data.data.ResponseCode != 1 && data.data.ResponseCode != 2 && data.code != 1) {
					var apiActUrl = url.split('/api/');
					if (apiActUrl.length == 1) {
						return false;
					}
					var d = new Date();
					var m = d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
					var eventLabelData = sessionStorage.getItem('rid') + "-" + $location.$$path.substr(1) + "--" + apiActUrl[1] + "-" + m;
					$window.gtag('event', 'error-api', { 'event_category': 'buy-error', 'event_label': eventLabelData });
				}
			}, function (err) {
				$rootScope.showLoader = false;
				var apiActUrl = url.split('/api/');
				if (apiActUrl.length == 1) {
					return false;
				}
				var d = new Date();
				var m = d.getDate() + "" + (d.getMonth() + 1) + "" + d.getFullYear() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
				var eventLabelData = sessionStorage.getItem('rid') + "-" + $location.$$path.substr(1) + "--" + apiActUrl[1] + "-" + m;
				$window.gtag('event', 'error-network', { 'event_category': 'buy-error', 'event_label': eventLabelData });
				defer.reject(err);
			});

		return defer.promise;
	}

	/* End of Post service integration */

	/*get service */

	aS.get = function (q) {
		$rootScope.showLoader = true;
		$http.defaults.headers.common['p2'] = 'website';
		return $http.get(q).then(function (results) {
			$rootScope.showLoader = false;
			if (results.data._resp == undefined) {
				return results.data;
			} else {
				return JSON.parse($rootScope.decrypt(results.data._resp));
			}
		}, function (error) {
			if (error.status == 401) {
				$rootScope.showLoader = false;
				logout();
			}
			$rootScope.showLoader = false;
		});
	};

	/*get service ends*/


	/* Service to trigger sokrati */

	aS.triggerSokrati = function (pageName) {
		var getdt = aS.getCurrDate();
		var leadId = sessionStorage.getItem('leadId');
		var pageName = $location.$$path.split('/')[1];
		var userParams = { client_id: 20307, lead_step: pageName, soksid: leadId, lead_timestamp: getdt, utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "" };
		/*if(window._sokClient){
			window._sokTrackLeadEvent(userParams, function(){
				console.log("Lead Details were successfully captured on "+pageName+" page");
			});
		} */
	}

	/* End of service to tigger sokrati */


	/* service to get curernt date and time  */

	aS.getCurrDate = function () {
		var dt = new Date();
		var strDate = dt.getFullYear() + "-" + (dt.getMonth() + 1) + "-" + dt.getDate();
		var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
		var CurrDate = strDate + " " + time;
		return CurrDate;
	}

	/* service to get curernt date and time  end */

}]);


/* 
	
	End of App Service
	Module :- App Service
	Author: Pankaj Patil
	Date: 18-06-2018	

*/
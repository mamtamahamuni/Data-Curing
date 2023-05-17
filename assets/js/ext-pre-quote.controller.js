/*
	Name: Ext-Pre Quote Controller
	Author: Pankaj Patil
	Date: 10-09-2018
*/


var preApp = angular.module("extPreQuoteApp", []);

preApp.controller("extPreQuote", ['$rootScope', 'appService', 'ABHI_CONFIG', '$location', '$routeParams', 'productValidationService', '$scope', '$timeout', '$window', function ($rootScope, appService, ABHI_CONFIG, $location, $routeParams, productValidationService, $scope, $timeout, $window) {


	/* Variable Inilization */

	const FEDIMDCODE = "2111987"; // FEDIMDCODE;
	const CITIIMDCODE = "2110545";
	const IDFCIMDCODE = "2115779";
	const HDFCIMDCODE = "2115622";


	var ePQA = this; // Current controller scope is stored in ePQA
	var aS = appService; // appService is stored in aS variable
	var leadCallService = 0; // As we allow lead service call thrice on failure so variable inilizae
	var productShortCode;
	ePQA.categories = []; // To stored catgrories data
	ePQA.showBuyBtn = true; // To show buy btn or not
	ePQA.familyConsturcts = []; // To store family construct
	ePQA.additionalMembers = []; // To store additional members
	ePQA.loadAddMemberSection = false; // To open add member popup or not flag
	ePQA.preQuote = {}; // Pre quote data object;
	$rootScope.ShowPopUp = false;
	var ProductCategory;
	var leadData;
	var gender;
	var imdCode = ($routeParams.IMDCode == undefined) ? $routeParams.imdcode : $routeParams.IMDCode;
	var imdSource;
	sessionStorage.removeItem('pageNoSeq'); // Removed pageNoSeq value from sessionStorage
	sessionStorage.removeItem('lastRouteVisted'); // Removed lastRouteVisited value from sessionStorage
	sessionStorage.removeItem('pName'); // Removed pName value from sessionStorage
	sessionStorage.removeItem('preExeDis'); // Removed preExeDis value from sessionStorage
	sessionStorage.removeItem('ut'); // Removed ut value from sessionStorage
	sessionStorage.removeItem('leadId'); // Removed ut value from sessionStorage
	ePQA.productDetail //motilal oswal detail;

	//space replace logic update for mutile
	function replaceDecryptIDFC(param) {
		if (param) {
			var decypt = param.split(' ').join('+');
			return $rootScope.decrypt(decypt);
		} else {
			return "";
		}
	}

	//space replace logic update 
	function replaceDecrypt(param) {
		if (param) {
			var decypt = param.split(' ').join('+');
			return $rootScope.decrypt(decypt);
		} else {
			return "";
		}
	}


	/* 
		If reference no is present in sessionStorage then we check prequotedata and map that data with prequotre object.
		If prequote data is not present then we clear sessionstorage.
		If its present then we mapp data as shown in else loop
		*/

	if (sessionStorage.getItem('rid')) {
		var prequoteData = JSON.parse(sessionStorage.getItem('prequoteData'));
		if (prequoteData == null) {
			sessionStorage.clear();
		} else {
			sessionStorage.setItem('continueJourney', 'Y');
			ePQA.preQuote = prequoteData.prequote;
			ePQA.coverTo = prequoteData.coverTo;
			ePQA.kidsObject = prequoteData.kidsObject;
			ePQA.selectedMembers = prequoteData.selectedMembers;
		}
	}

	/* End of variable inilization */

	if (!angular.isUndefined($rootScope.mobileNORefer)) {
		$routeParams.mobno = $rootScope.mobileNORefer;
	}
	/*------------------------moti lal oswal redirection-----------------------*/
	if ($routeParams.IMDCode == '2112349' || $routeParams.IMDCode == '2101599') {
		ePQA.productDetail = JSON.parse(sessionStorage.getItem('productDetail'));
	}
	/*------------------------motilal oswal redirection-----------------------*/

	/**  Defualt PA value */
	if($location.$$path == '/activ-secure-personal-accident-pre-quote'){
		ePQA.coverTo = 'Self';
	}


	/*----------RBL PASA requirement-----------*/
	/**
	 * RBL PASA == "2110895"
	 */

	if ($location.$$path == '/activ-assure-pre-quote' && Object.keys($routeParams).length != 0 &&
		($routeParams.IMD && $rootScope.decryptRBLPASA($routeParams.IMD.replace(" ", "+")) == "2110895")) {
		ePQA.rblIMDCode = $rootScope.decryptRBLPASA($routeParams.IMD.replace(" ", "+"));
		ePQA.annualInCome = $rootScope.decryptRBLPASA($routeParams.Annualincome.replace(" ", "+"));
		ePQA.eduQualification = $rootScope.decryptRBLPASA($routeParams.EduQualification.replace(" ", "+"));
		ePQA.rblGender = $rootScope.decryptRBLPASA($routeParams.Gender.replace(" ", "+"));
		ePQA.rblOccupation = $rootScope.decryptRBLPASA($routeParams.Occupation.replace(" ", "+"));
		ePQA.rblPincode = $rootScope.decryptRBLPASA($routeParams.Pincode.replace(" ", "+"));
		ePQA.rblDOB = $rootScope.decryptRBLPASA($routeParams.DOB.replace(" ", "+"));
		ePQA.si = $rootScope.decryptRBLPASA($routeParams.SumInsured.replace(" ", "+"));
		ePQA.rblIMDCode = $rootScope.decryptRBLPASA($routeParams.IMD.replace(" ", "+"));
		ePQA.preQuote.MobileNo = angular.isUndefined($routeParams.mobNo) ? $routeParams.mobno : $routeParams.mobNo;
		ePQA.preQuote.EmailId = angular.isUndefined($routeParams.emailId) ? $routeParams.emailid : $routeParams.emailId;
		var today = new Date();
		var todayMonth = today.getMonth() + 1;
		if (todayMonth < 10) {
			todayMonth = "0" + (today.getMonth() + 1);
		}
		var todayDay = today.getDate();
		if (todayDay < 10) {
			todayDay = "0" + today.getDate();
		}
		var currentYear = today.getFullYear();
		var TodayDate = today.getFullYear() + "" + todayMonth + "" + todayDay;
		var expDate = (ePQA.rblDOB.trim().includes("/") ? ePQA.rblDOB.trim().split('/') : ePQA.rblDOB.trim().split('-'));
		var PolicyExpDate = expDate[1] + "/" + expDate[0] + "/" + expDate[2];
		var PolicyExpDate1 = expDate[2] + "" + expDate[1] + "" + expDate[0];
		var m = today.getMonth() - expDate[1];
		var insuredPersonAge = today.getFullYear() - expDate[2];
		if (m < 0 || (m === 0 && today.getDate() < expDate[0])) {
			insuredPersonAge--;
		}

		ePQA.preQuote.Age = insuredPersonAge;
		ePQA.preQuote.preAge = ePQA.preQuote.Age;
		ePQA.validateAge = true;
		isAgePrePopulated = (ePQA.rblIMDCode == "2110895" && (ePQA.preQuote.Age != undefined || ePQA.preQuote.Age != "")) ? "Yes" : "No";
		// If gender present in queryparams then we are mapping it with gender variable
		($routeParams.gender == 'female') ? gender = 0 : gender = 1;
	}
	/*-------------RBL PASA requirement---------*/

	/*----------FEDERAL PASA requirement-----------*/
	/**
	 * FEDERAL PASA == "2113805"
	 * decryptRBLPASA - function used for dec becuase key and iv value, alg are same for both PASA
	 */



	if ($location.$$path == '/activ-assure-pre-quote' && Object.keys($routeParams).length != 0 &&
		($routeParams.IMD && replaceDecrypt($routeParams.IMD.replace(" ", "+")) == "2113805")) {

		//ePQA.fedIMDCode = replaceDecrypt($routeParams.IMD.replace(" ", "+"));
		ePQA.fedIMDCode = FEDIMDCODE;

		ePQA.fedIMDSource = replaceDecrypt($routeParams.SourceName.replace(" ", "+"));
		ePQA.fedAnnualInCome = replaceDecrypt($routeParams.Annualincome.replace(" ", "+"));
		ePQA.fedEduQualification = replaceDecrypt($routeParams.EduQualification.replace(" ", "+"));
		ePQA.fedGender = replaceDecrypt($routeParams.Gender.replace(" ", "+"));
		ePQA.fedOccupation = replaceDecrypt($routeParams.Occupation.replace(" ", "+"));
		ePQA.fedPincode = replaceDecrypt($routeParams.Pincode.replace(" ", "+"));
		ePQA.fedDOB = replaceDecrypt($routeParams.DOB.replace(" ", "+"));
		ePQA.fedSI = replaceDecrypt($routeParams.SumInsured.replace(" ", "+"));
		ePQA.preQuote.MobileNo = angular.isUndefined($routeParams.mobNo) ? $routeParams.mobno : $routeParams.mobNo;
		ePQA.preQuote.EmailId = angular.isUndefined($routeParams.emailId) ? $routeParams.emailid : $routeParams.emailId;
		sessionStorage.setItem('imdCode', ePQA.fedIMDCode)
		sessionStorage.setItem('imdSource', ePQA.fedIMDSource)
		var today = new Date();
		var todayMonth = today.getMonth() + 1;
		if (todayMonth < 10) {
			todayMonth = "0" + (today.getMonth() + 1);
		}
		var todayDay = today.getDate();
		if (todayDay < 10) {
			todayDay = "0" + today.getDate();
		}

		var currentYear = today.getFullYear();
		var TodayDate = today.getFullYear() + "" + todayMonth + "" + todayDay;
		var expDate = (ePQA.fedDOB.trim().includes("/") ? ePQA.fedDOB.trim().split('/') : ePQA.fedDOB.trim().split('-'));
		var PolicyExpDate = expDate[0] + "/" + expDate[1] + "/" + expDate[2];

		//change date formate to DD/MM/YYYY
		ePQA.fedDOB = PolicyExpDate;
		var PolicyExpDate1 = expDate[2] + "" + expDate[1] + "" + expDate[0];
		var m = today.getMonth() - expDate[1];
		var insuredPersonAge = today.getFullYear() - expDate[2];
		if (m < 0 || (m === 0 && today.getDate() < expDate[0])) {
			insuredPersonAge--;
		}

		ePQA.preQuote.Age = insuredPersonAge;
		ePQA.preQuote.preAge = ePQA.preQuote.Age;
		ePQA.validateAge = true;

		isAgePrePopulated = (ePQA.fedIMDCode == FEDIMDCODE && (ePQA.preQuote.Age != undefined || ePQA.preQuote.Age != "")) ? "Yes" : "No";
		// If gender present in queryparams then we are mapping it with gender variable
		gender = ($routeParams.gender == 'female') ? 0 : 1;
		console.log(gender);
	}
	/*-------------FEDERAL PASA requirement---------*/


	// /*-----------IDFC PASA requirement--------------*/
	if ($location.$$path == '/activ-assure-pre-quote' && Object.keys($routeParams).length != 0 &&
		($routeParams.IMD && $rootScope.decrypt($routeParams.IMD.replace(" ", "+")) == IDFCIMDCODE)) {

		ePQA.coverTo = 'Self';
		ePQA.idfcIMDCode = replaceDecryptIDFC($routeParams.IMD);
		ePQA.idfcIMDSource = replaceDecryptIDFC($routeParams.SourceName);
		ePQA.idfcGender = replaceDecryptIDFC($routeParams.Gender);
		ePQA.idfcFname = replaceDecryptIDFC($routeParams.fname);
		ePQA.idfcLname = replaceDecryptIDFC($routeParams.lname);
		ePQA.addr1 = replaceDecryptIDFC($routeParams.addr1);
		ePQA.addr2 = replaceDecryptIDFC($routeParams.addr2);
		ePQA.idfcPincode = replaceDecryptIDFC($routeParams.Pincode);
		ePQA.idfcDOB = replaceDecryptIDFC($routeParams.DOB);
		ePQA.idfcSI = replaceDecryptIDFC($routeParams.SumInsured);
		ePQA.idfcPAN = replaceDecryptIDFC($routeParams.pan);
		ePQA.MobileNo = replaceDecryptIDFC($routeParams.mobNo);
		let paramEmailId = replaceDecryptIDFC($routeParams.emailId); 
		ePQA.EmailId = (paramEmailId == "") ? 'test123@abhi.com' : paramEmailId;


		sessionStorage.setItem('idfcSI', ePQA.idfcSI);
		ePQA.preQuote.MobileNo = ePQA.MobileNo;
		ePQA.preQuote.EmailId = ePQA.EmailId;
		sessionStorage.setItem('imdCode', ePQA.idfcIMDCode)
		sessionStorage.setItem('imdSource', ePQA.idfcIMDSource)
		ePQA.isIDFCPasa = sessionStorage.getItem('imdCode') === IDFCIMDCODE ? true : false;
		var today = new Date();
		var todayMonth = today.getMonth() + 1;
		if (todayMonth < 10) {
			todayMonth = "0" + (today.getMonth() + 1);
		}
		var todayDay = today.getDate();
		if (todayDay < 10) {
			todayDay = "0" + today.getDate();
		}

		var currentYear = today.getFullYear();
		var TodayDate = today.getFullYear() + "" + todayMonth + "" + todayDay;
		var expDate = (ePQA.idfcDOB.trim().includes("/") ? ePQA.idfcDOB.trim().split('/') : ePQA.idfcDOB.trim().split('-'));
		var PolicyExpDate = expDate[0] + "/" + expDate[1] + "/" + expDate[2];

		//change date formate to DD/MM/YYYY
		ePQA.idfcDOB = PolicyExpDate;
		var PolicyExpDate1 = expDate[2] + "" + expDate[1] + "" + expDate[0];
		var m = today.getMonth() - expDate[1];
		var insuredPersonAge = today.getFullYear() - expDate[2];
		if (m < 0 || (m === 0 && today.getDate() < expDate[0])) {
			insuredPersonAge--;
		}

		ePQA.preQuote.Age = insuredPersonAge;
		ePQA.preQuote.preAge = ePQA.preQuote.Age;
		ePQA.validateAge = true;

		isAgePrePopulated = (ePQA.idfcIMDCode == IDFCIMDCODE && (ePQA.preQuote.Age != undefined || ePQA.preQuote.Age != "")) ? "Yes" : "No";
		// If gender present in queryparams then we are mapping it with gender variable
		gender = ($routeParams.gender == 'female') ? 0 : 1;
		console.log(gender);
	}
	// /*-----------IDFC PASA requirement-------------*/


	// /*----------- HDFC Bank D2C Crosssell--------------*/
	if ($location.$$path == '/activ-secure-cancer-secure-pre-quote' && Object.keys($routeParams).length != 0 &&
		($routeParams.IMDCode == HDFCIMDCODE)) {

		ePQA.hdfcIMDCode = $routeParams.IMDCode;
		ePQA.hdfcIMDSource = $routeParams.source;
		ePQA.hdfcGender = replaceDecrypt($routeParams.gender);
		ePQA.hdfcFname = replaceDecrypt($routeParams.fname);
		ePQA.hdfcLname = replaceDecrypt($routeParams.lname);
		ePQA.addr1 = replaceDecrypt($routeParams.addr1);
		ePQA.addr2 = replaceDecrypt($routeParams.addr2);
		ePQA.hdfcPincode = replaceDecrypt($routeParams.pincode);
		ePQA.hdfcDOB = replaceDecrypt($routeParams.dob);
		ePQA.hdfcSI = replaceDecrypt($routeParams.sumInsured);
		ePQA.MobileNo = replaceDecrypt($routeParams.mobNo);
		let paramEmailId = replaceDecrypt($routeParams.emailid);

		sessionStorage.setItem('hdfcSI', ePQA.hdfcSI);
		ePQA.preQuote.MobileNo = ePQA.MobileNo;
		ePQA.preQuote.EmailId = paramEmailId;
		sessionStorage.setItem('imdCode', ePQA.hdfcIMDCode)
		sessionStorage.setItem('imdSource', ePQA.hdfcIMDSource)
		ePQA.isHDFCD2CCrossSell = sessionStorage.getItem('imdCode') === HDFCIMDCODE ? true : false;
		var today = new Date();
		var todayMonth = today.getMonth() + 1;
		if (todayMonth < 10) {
			todayMonth = "0" + (today.getMonth() + 1);
		}
		var todayDay = today.getDate();
		if (todayDay < 10) {
			todayDay = "0" + today.getDate();
		}

		var currentYear = today.getFullYear();
		var TodayDate = today.getFullYear() + "" + todayMonth + "" + todayDay;
		var expDate = (ePQA.hdfcDOB.trim().includes("/") ? ePQA.hdfcDOB.trim().split('/') : ePQA.hdfcDOB.trim().split('-'));
		var PolicyExpDate = expDate[0] + "/" + expDate[1] + "/" + expDate[2];

		//change date formate to DD/MM/YYYY
		ePQA.hdfcDOB = PolicyExpDate;
		var PolicyExpDate1 = expDate[2] + "" + expDate[1] + "" + expDate[0];
		var m = today.getMonth() - expDate[1];
		var insuredPersonAge = today.getFullYear() - expDate[2];
		if (m < 0 || (m === 0 && today.getDate() < expDate[0])) {
			insuredPersonAge--;
		}

		ePQA.preQuote.Age = insuredPersonAge;
		ePQA.preQuote.preAge = ePQA.preQuote.Age;
		ePQA.validateAge = true;

		isAgePrePopulated = (ePQA.hdfcIMDCode == HDFCIMDCODE && (ePQA.preQuote.Age != undefined || ePQA.preQuote.Age != "")) ? "Yes" : "No";
		// If gender present in queryparams then we are mapping it with gender variable
		gender = ($routeParams.gender == 'female') ? 0 : 1;
	}
	// /*----------- HDFC Bank D2C Crosssell-------------*/


	/* Decide page product */

	if ($location.$$path == "/activ-health-pre-quote") {
		/* 
			If $location.$$path == "/activ-health-pre-quote"
			then productName should be "Health",
			and productShortCode should be "PL",
			and ProductCategory should be "HP",
		*/
		ePQA.productName = "Health";
		productShortCode = "PL";
		ProductCategory = "HP";
	} else if ($location.$$path == "/activ-assure-pre-quote") {
		/* 
			If $location.$$path == "/activ-assure-pre-quote"
			then productName should be "Activ-Assure",
			and productShortCode should be "DI",
			and ProductCategory should be "HP",
		*/
		ePQA.productName = "Activ-Assure";
		ProductCategory = "HP";
		productShortCode = "DI";
		if (!angular.isUndefined($routeParams.lifeRefNo)) {
			getPageData($routeParams.lifeRefNo.toString());
		}
	} else if ($location.$$path == "/super-health-plus-top-tp-plus-activ-assure") {
		/* 
			If $location.$$path == "/activ-assure-pre-quote"
			then productName should be "Activ-Assure",
			and productShortCode should be "DI",
			and ProductCategory should be "HP",
		*/
		ePQA.productName = "Super-topup";
		ProductCategory = "HP";
		productShortCode = "DI_ST";
		ePQA.ST = true;

	} else if ($location.$$path == "/corona-kavach-pre-quote") {
		/* 
			If $location.$$path == "/activ-assure-pre-quote"
			then productName should be "Activ-Assure",
			and productShortCode should be "DI",
			and ProductCategory should be "HP",
		*/
		ePQA.productName = "Corona-Kavach";
		ProductCategory = "HP";
		productShortCode = "CK";
		ePQA.CK = true;

	} else if ($location.$$path == "/activ-secure-personal-accident-pre-quote" || $location.$$path == "/activ-secure-personal-accident-pre-quote-v2") {
		/* 
			If $location.$$path == "/activ-secure-personal-accident-pre-quote"
			then productName should be "Activ-Secure-PA",
			and productShortCode should be "PA",
			and ProductCategory should be "PAA",
		*/
		ProductCategory = "PAA";
		productShortCode = "PA";
		ePQA.productName = "Activ-Secure-PA";
	} else if ($location.$$path == "/activ-secure-critical-illness-pre-quote") {
		/* 
			If $location.$$path == "/activ-secure-critical-illness-pre-quote"
			then productName should be "Activ-Secure-CI",
			and productShortCode should be "CI",
			and ProductCategory should be "PACI",
		*/
		ProductCategory = "PACI";
		productShortCode = "CI";
		ePQA.productName = "Activ-Secure-CI";
	} else if ($location.$$path == "/activ-secure-cancer-secure-pre-quote") {
		/* 
			If $location.$$path == "/activ-secure-critical-illness-pre-quote"
			then productName should be "Activ-Secure-CS",
			and productShortCode should be "CS",
			and ProductCategory should be "PAC",
		*/
		ProductCategory = "PAC";
		productShortCode = "CS";
		ePQA.productName = "Activ-Secure-CS";
	} else if ($location.$$path == "/activ-care-pre-quote") {
		/* 
			If $location.$$path == "/activ-secure-critical-illness-pre-quote"
			then productName should be "Activ-Secure-CS",
			and productShortCode should be "CS",
			and ProductCategory should be "PAC",
		*/
		ProductCategory = "SC";
		productShortCode = "AC";
		ePQA.productName = "Care";
		ePQA.preQuote.ProductCategory = ProductCategory;
	} else if ($location.$$path == "/arogya-sanjeevani-pre-quote") {
		ProductCategory = "HP";
		productShortCode = "AS";
		ePQA.productName = "Arogya-Sanjeevani";
		ePQA.AS = true;
	} else if ($location.$$path == "/activ-fit-pre-quote") {
		/* 
			If $location.$$path == "/activ-fit-pre-quote"
			then productName should be "Activ-Fit",
			and productShortCode should be "AF",
			and ProductCategory should be "HP",
		*/
		ePQA.productName = "Activ Fit";
		productShortCode = "FIT";
		ProductCategory = "HP";
	}


	/* End of deciding page product */

	/*get pre populated Value from life insurance service by passing refernce number to service*/
	function getPageData(param) {
		aS.postData(ABHI_CONFIG.apiUrl + "gen/GetLifeInsuranceData", {
			"LifeRefNo": param
		}, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				console.log(data)
				if (data.ResponseCode == 1) {
					var currentDate = new Date();
					var userDate = new Date(data.ResponseData.DOB)
					var dateDiff = currentDate - userDate;
					var userAge = Math.floor((dateDiff / 1000) / (60 * 60 * 24 * 365.25));
					ePQA.preQuote.Age = userAge
					ePQA.preQuote.MobileNo = data.ResponseData.Mobile; // Synced mobile with view variable i.e scope variable.
					ePQA.preQuote.EmailId = data.ResponseData.Email; // Synced EmailId with view variable i.e scope variable.
				}
			}, function (err) {
			});
	}
	/* het pre populated data from life insurance serice ends */

	/*Pre populate rakho poorak khayal value from Service */

	if ($routeParams.CrossSellID) {
		console.log('hellokdsdsd')
		aS.getData(ABHI_CONFIG.apiUrl + "GEN/CrossSellPolicyDetail?PolicyNumber=" + $routeParams.PolicyNo, "", true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					//aA.SumInsuredList = data.ResponseData;

					ePQA.preQuote.Age = data.ResponseData.Age
					ePQA.preQuote.MobileNo = data.ResponseData.Mobile; // Synced mobile with view variable i.e scope variable.
					ePQA.preQuote.EmailId = data.ResponseData.Email;
				} else {

				}
			}, function (err) {

			})
	}
	/*Pre populate rakho poorak khayal value from Service ends */



	/* 
		Following function is use to get lead data by getPortalLeadById service.
		Here leadType will always be portal and portalLeadId will be whatever
		leadId resent in queryparams.
	*/

	function toGetPortalLeadById(leadId) {
		aS.postData(ABHI_CONFIG.hServicesUrl + "HealthLeadform/getPortalLeadById", { // we are getting 405 error removing health insurance domain
			"leadType": "portal",
			"portalLeadId": leadId
		}, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.code == 1) {
					leadData = data.data[0]; // Stored data received from service into leadData service
					ePQA.preQuote.MobileNo = leadData.mobile; // Synced mobile with view variable i.e scope variable.
					ePQA.preQuote.EmailId = leadData.email; // Synced EmailId with view variable i.e scope variable.
					if ((leadData.source == "DNC_HDFC_Affiliate_Discount" || leadData.source == "DNC_DeustacheBankAG-Affiliate") && leadData.discount == "10.00" && leadData.imdCode != "") {
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Alert",
							"modalBodyText": "Congratulations! 10% employee discount will apply to the premium amount.",
							"showCancelBtn": false,
							"modalSuccessText": "Ok",
							"showAlertModal": true,
							"hideCloseBtn": true
						}
					}
				}
			}, function (err) {
			});
	}

	/* End of calling lead service */


	/* 
		To validate IMD 
		In following function we are validating IMDcode which we received from queryparams
	*/

	function toValidateIMD(imdCode) {
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/ValidateIMD", {
			"IMDCode": imdCode
		}, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					if (data.ResponseData.IsIMDValid) {
						/* 
							IF IMD is valid  then we are mapping mobile no and email id received from queryparams
							with scope MovileNo and EmailId variable. 
						*/
						if(ePQA.preQuote.MobileNo == undefined && ePQA.preQuote.MobileNo == ''){
							ePQA.preQuote.MobileNo = angular.isUndefined($routeParams.mobNo) ? $routeParams.mobno : $routeParams.mobNo;
						}
						if(ePQA.preQuote.EmailId == undefined && ePQA.preQuote.EmailId == ''){
							ePQA.preQuote.EmailId = angular.isUndefined($routeParams.emailId) ? $routeParams.emailid : $routeParams.emailId;
						}
						// If gender present in queryparams then we are mapping it with gender variable
						($routeParams.gender == 'female') ? gender = 0 : gender = 1;
					} else {
						/* If invalid IMD then we are showing alert */
						ePQA.showBuyBtn = false;
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Warning",
							"modalBodyText": "Invalid IMD Code.",
							"showCancelBtn": false,
							"modalSuccessText": "OK",
							"modalCancelText": "No",
							"showAlertModal": true
						}
					}
				} else {
					/* If invalid IMD then we are showing alert */
					ePQA.showBuyBtn = false;
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Warning",
						"modalBodyText": data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "OK",
						"modalCancelText": "No",
						"showAlertModal": true
					}

				}
			}, function (err) {
			});
	}

	/* ENd of validating IMD */


	/* To Check pre quote external flow */

	if ($routeParams.portalLeadId) { // Checking whether portalleadId present in queryparams or not
		toGetPortalLeadById($routeParams.portalLeadId);
	} else {
		/* 
			If portalleadId not present then we are checking imdcode 
			In if we are checking small letter imdCode in queryparam.
			In first else if we are checking capital imdcode
			In second else if we are checking there are no routeparams
			In else we are showing alert
		*/
		// if (!angular.isUndefined(ePQA.rblIMDCode)) {
		// 	imdCode = ePQA.rblIMDCode;
		// 	imdSource = $routeParams.source;
		// 	toValidateIMD(ePQA.rblIMDCode);
		// } else if (!angular.isUndefined(ePQA.rblIMDCode)) {
		// 	imdCode = ePQA.rblIMDCode;
		// 	imdSource = $routeParams.source;
		// 	toValidateIMD(ePQA.rblIMDCode);
		// } else if (Object.keys($routeParams).length == 0 || angular.isUndefined(ePQA.rblIMDCode)) {
		// 	imdCode = (imdCode == "" || imdCode == undefined) ? 5100003 : imdCode; // Default Imd code if its not received from url
		// 	imdSource = "Customer Portal"; // Default Imd source if its not received from url
		// 	toValidateIMD(imdCode); // Calling validateImd function
		// } 
		if (!angular.isUndefined($routeParams.imdcode)) {
			imdCode = $routeParams.imdcode;
			imdSource = $routeParams.source;
			toValidateIMD($routeParams.imdcode);
		} else if (!angular.isUndefined($routeParams.IMDCode)) {
			imdCode = $routeParams.IMDCode;
			imdSource = $routeParams.source;
			toValidateIMD($routeParams.IMDCode);
		} else if (ePQA.rblIMDCode) {
			imdCode = ePQA.rblIMDCode;
			imdSource = $routeParams.source;
			toValidateIMD(ePQA.rblIMDCode);
		} else if (ePQA.fedIMDCode) {
			imdCode = ePQA.fedIMDCode;
			imdSource = ePQA.fedIMDSource;
			toValidateIMD(ePQA.fedIMDCode);
		} else if (ePQA.idfcIMDCode) {
			imdCode = ePQA.idfcIMDCode;
			imdSource = ePQA.idfcIMDSource;
			toValidateIMD(ePQA.idfcIMDCode);
		} else if (ePQA.hdfcIMDCode) {
			imdCode = ePQA.hdfcIMDCode;
			imdSource = ePQA.hdfcIMDSource;
			toValidateIMD(ePQA.hdfcIMDCode);
		} else if (Object.keys($routeParams).length == 0 || angular.isUndefined($routeParams.IMDCode)) {
			imdCode = 5100003; // Default Imd code if its not received from url
			imdSource = "Customer Portal"; // Default Imd source if its not received from url
			toValidateIMD(5100003); // Calling validateImd function
		}
		else {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Error",
				"modalBodyText": "Invalid IMD Code",
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true
			}
		}
	}

	/* End of checking pre quote external flow */


	/* To Fetch Family Members */

	aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMaster", {
		"Name": "familyconstruct"
	}, false, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(function (data) {
			if (data.ResponseCode == 1) {
				ePQA.familyConsturcts = data.ResponseData;
			}
		}, function (err) {
		});

	/* End of fetching family members */


	/* To Fetch Family Members for active care */

	aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMaster", {
		"Name": "getACRelation"
	}, false, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(function (data) {
			ePQA.activeCareFamilyContruct = data.ResponseData; // Stored active care family construct inside pQA.activeCareFamilyContruct variable
		}, function (err) { })

	/* End of fetching family members active care */


	/* To Fetch Additional Members */

	aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMaster", {
		"Name": "additionalmembers"
	}, false, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(function (data) {
			if (data.ResponseCode == 1) {
				ePQA.additionalMembers = data.ResponseData;
				if (ePQA.productName == 'Activ-Assure' || ePQA.productName == 'Super-topup') {
					var familyconstruct = ePQA.additionalMembers.filter(item => (item != "Father-in-law" && item != "Mother-in-law"));
					ePQA.additionalMembers = familyconstruct;
				}
			}
		}, function (err) {
		});

	/* End of fetching additional members */





	/* To call lead insert API */

	function leadInsertCall(data) {
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/LeadInsert", {
			"ReferenceNumber": sessionStorage.getItem('rid'),
			'ProductCode': productShortCode
		}, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					sessionStorage.setItem('leadId', data.ResponseData.LeadId);
				} else {
					if (leadCallService < 3) {
						++leadCallService;
						leadInsertCall();
					}
				}
			}, function (err) {
			});
	}

	/* End of calling lead insert API */


	/* 
		To Validate Product Members 
		In below function with the help of productValidationservice we are validating product family construct.
		If its invalid then we are showing error popup and open add/update/delete member where user
		can add, update or delete member.
		If construct is valid then we are calling buy product function where we buy product.
	*/

	function validateProduct(event, actText) {
		var mySelectedProduct;
		switch (ePQA.productName) {
			case "Activ-Assure":
				sessionStorage.setItem('pName', "Activ Assure");
				ePQA.productType = "diamond";
				mySelectedProduct = "DI";
				ePQA.allErrors = productValidationService.diamondValidations(ePQA.membersDetails);
				break;
			case "Super-topup":
				sessionStorage.setItem('pName', "Activ Assure");
				ePQA.productType = "diamond";
				mySelectedProduct = "DI";
				ePQA.allErrors = productValidationService.diamondSTValidations(ePQA.membersDetails);
				break;
			case "Activ-Secure-CS":
				sessionStorage.setItem('pName', "Activ Secure Cancer Secure");
				ePQA.productType = "CS";
				mySelectedProduct = "CS";
				ePQA.allErrors = productValidationService.rFBValidations(ePQA.membersDetails, 18, 'CS');
				break;
			case "Super-topup":
				sessionStorage.setItem('pName', "Activ Assure");
				ePQA.productType = "diamond";
				mySelectedProduct = "DI";
				ePQA.allErrors = productValidationService.diamondSTValidations(ePQA.membersDetails);
				break;
			case "Corona-Kavach":
				sessionStorage.setItem('pName', "Corona Kavach");
				ePQA.productType = "CK";
				mySelectedProduct = "CK";
				ePQA.allErrors = productValidationService.cKValidations(ePQA.membersDetails, 18, 'CS');
				break;
			case "Activ-Secure-PA":
				sessionStorage.setItem('pName', "Activ Secure Personal Accident");
				ePQA.productType = "PA";
				mySelectedProduct = "PA";
				ePQA.allErrors = productValidationService.rFBValidations(ePQA.membersDetails, 5, 'PA');
				break;
			case "Activ-Secure-CI":
				sessionStorage.setItem('pName', "Activ Secure Critical Illness");
				ePQA.productType = "CI";
				mySelectedProduct = "CI";
				ePQA.allErrors = productValidationService.rFBValidations(ePQA.membersDetails, 5, 'CI');
				break;
			case "Health":
				sessionStorage.setItem('pName', "Activ Health");
				ePQA.productType = "platinum";
				mySelectedProduct = "PL";
				ePQA.allErrors = productValidationService.platinumValidations(ePQA.membersDetails);
				break;
			case "Care":
				sessionStorage.setItem('pName', "Activ Care");
				ePQA.productType = "AC";
				mySelectedProduct = "AC";
				ePQA.allErrors = productValidationService.activCareValidations(ePQA.membersDetails);
				break;
			case "Arogya-Sanjeevani":
				sessionStorage.setItem('pName', "Arogya Sanjeevani");
				ePQA.productType = "AS";
				mySelectedProduct = "AS";
				ePQA.allErrors = productValidationService.arogyaSanjeevaniValidations(ePQA.membersDetails, 25, 'AS');
				break;
			case "Activ Fit":
				sessionStorage.setItem('pName', "Activ Fit");
				ePQA.productType = "Plus";
				mySelectedProduct = "FIT";
				ePQA.allErrors = productValidationService.arogyaSanjeevaniValidations(ePQA.membersDetails);
				break;
		}
		if (ePQA.allErrors.individualSelectionError) {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Warning",
				"modalBodyText": (ePQA.allErrors.elligibleMembers.length == 1) ? "Individual Family Construct exists only for Self. Please change your family construct." : "This combination of family construct does not exist. Please select proper family construct.",
				"showCancelBtn": false,
				"modalSuccessText": "OK",
				"modalCancelText": "No",
				"showAlertModal": true
			}
			$rootScope.$apply();
			return false;
		}
		if (ePQA.allErrors.isProductElligible) {
			buyProduct(mySelectedProduct, event, actText);
		} else {
			event.target.disabled = false;
			event.target.innerHTML = actText;
			sessionStorage.removeItem('pName');
			$('#add-new-member-web').modal('show');
		}
	}

	/* End of validating product members */


	/* Function to push insured members in insuredDetails object */

	var finalSubmitData = {};
	function insuredDetailPush(gender, relation, relationType, age) {
		finalSubmitData.InsuredDetail.push({
			"Gender": gender,
			"RelationWithProposer": relation,
			"RelationType": relationType,
			"Age": age,
			"ProductCode": "NA",
			"DOB": ePQA.rblDOB,
			"SumInsured": ePQA.si,
		})
	}

	/* End of function to push insured members in insuredDetails object */


	/* Identifying relationwithproposer */

	function pushInsuredDetails(type) {
		switch (type) {
			case 'SELF':
				insuredDetailPush(1, 'Self', 'S', ePQA.preQuote.Age);
				break;
			case 'SPOUSE':
				insuredDetailPush(0, 'Spouse', 'SPO', ePQA.preQuote.spouseAge);
				break;
			case 'FATHER':
				insuredDetailPush(1, 'Father', 'F', ePQA.preQuote.fatherAge);
				break;
			case 'MOTHER':
				insuredDetailPush(0, 'Mother', 'M', ePQA.preQuote.motherAge);
				break;
			case 'FATHER-IN-LAW':
				insuredDetailPush(1, 'Father-in-law', 'FIL', ePQA.preQuote.fILAge);
				break;
			case 'MOTHER-IN-LAW':
				insuredDetailPush(0, 'Mother-in-law', 'MIL', ePQA.preQuote.mILAge);
				break;
			case 'BROTHER':
				insuredDetailPush(1, 'Brother', 'BRO', ePQA.preQuote.broAge);
				break;
			case 'SISTER-IN-LAW':
				insuredDetailPush(0, 'Sister-In-Law', 'SISL', ePQA.preQuote.sislAge);
				break;
			case 'SISTER':
				insuredDetailPush(0, 'Sister', 'SIS', ePQA.preQuote.sisAge);
				break;
			case 'BROTHER-IN-LAW':
				insuredDetailPush(1, 'Brother-In-Law', 'BIL', ePQA.preQuote.bilAge);
				break;
			case 'GRANDFATHER':
				insuredDetailPush(1, 'Grandfather', 'GF', ePQA.preQuote.gfAge);
				break;
			case 'GRANDMOTHER':
				insuredDetailPush(0, 'Grandmother', 'GM', ePQA.preQuote.gmAge);
				break;
			case 'UNCLE':
				insuredDetailPush(1, 'Uncle', 'UN', ePQA.preQuote.unAge);
				break;
			case 'AUNT':
				insuredDetailPush(0, 'Aunt', 'AU', ePQA.preQuote.auAge);
				break;
			case 'SON':
				insuredDetailPush(1, 'Son', 'SO', ePQA.preQuote.soAge);
				break;
			case 'DAUGHTER-IN-LAW':
				insuredDetailPush(0, 'Daughter-In-Law', 'DIL', ePQA.preQuote.dilAge);
				break;
			case 'SON-IN-LAW':
				insuredDetailPush(1, 'Son-In-Law', 'SIL', ePQA.preQuote.silAge);
				break;
			case 'DAUGHTER':
				insuredDetailPush(0, 'Daughter', 'DU', ePQA.preQuote.dulAge);
				break;
			case 'NEPHEW':
				insuredDetailPush(1, 'Nephew', 'NP', ePQA.preQuote.npAge);
				break;
			case 'NIECE-IN-LAW':
				insuredDetailPush(0, 'Niece-In-Law', 'NIL', ePQA.preQuote.nilAge);
				break;
			case 'NIECE':
				insuredDetailPush(0, 'Niece', 'NI', ePQA.preQuote.niAge);
				break;
			case 'NEPHEW-IN-LAW':
				insuredDetailPush(1, 'Nephew-In-Law', 'NPL', ePQA.preQuote.nplAge);
				break;
			case 'GRANDSON':
				insuredDetailPush(1, 'Grandson', 'GS', ePQA.preQuote.gsAge);
				break;
			case 'GRANDDAUGHTER-IN-LAW':
				insuredDetailPush(0, 'Granddaughter-In-Law', 'GDL', ePQA.preQuote.gdlAge);
				break;
			case 'GRANDDAUGHTER':
				insuredDetailPush(0, 'Granddaughter', 'GD', ePQA.preQuote.gdAge);
				break;
			case 'GRANDSON-IN-LAW':
				insuredDetailPush(1, 'Grandson-In-Law', 'GSL', ePQA.preQuote.gslAge);
				break;
			case 'Kids':
				for (i = 0; i < ePQA.preQuote.Kids; i++) {
					insuredDetailPush(1, 'KID', "KID" + (i + 1), ePQA.kidsObject[i].age);
				}
				break;
			default:
				return;
		}
	}

	/* End of identifying relationwithproposer */
	ePQA.getMemder = function (mobile, event) {
		ePQA.preQuote.Age = "33";
		ePQA.preQuote.MobileNo = mobile;
		ePQA.preQuote.EmailId = "ags@dhh.ajs";
		var actText = angular.copy(event.target.innerHTML);
		submitFormData(event, actText);
	}

	/* To Submit Form Data */

	function submitFormData(event, actText) {
		if (ePQA.rblIMDCode != undefined && (ePQA.rblIMDCode == "2110895")) {
			finalSubmitData = {
				"ProposerDetail": {
					"ProductCategory": ProductCategory,
					"Age": ePQA.preQuote.Age,
					"MobileNo": ePQA.preQuote.MobileNo,
					"EmailId": ePQA.preQuote.EmailId,
					"EducationQualification": ePQA.eduQualification,
					"IMDCode": ePQA.rblIMDCode, //IMDCODE 
					"IMDSource": ($routeParams.portalLeadId) ? leadData.source : $routeParams.source,
					"FirstName": ($routeParams.portalLeadId) ? leadData.name : $routeParams.fname,
					"LastName": ($routeParams.portalLeadId) ? "" : $routeParams.lname,
					"Branch": ePQA.rblPincode, //($routeParams.branch) ? $routeParams.branch : ""  ,
					"Keyword": ($routeParams.portalLeadId) ? leadData.Keyword : $routeParams.keyword,
					"AdGroup": ($routeParams.portalLeadId) ? leadData.Adgroup : $routeParams.adgroup,
					"Location": ($routeParams.location) ? "" : $routeParams.location,
					"VK_ID": ($routeParams.portalLeadId) ? "" : $routeParams.vkid,
					"VK_SSID": ($routeParams.portalLeadId) ? "" : $routeParams.spid,
					"VK_SecurityCode": ($routeParams.portalLeadId) ? "" : $routeParams.securitycode,
					"PortalLeadID": ($routeParams.portalLeadId) ? leadData.portalLeadId : "",
					"CRMLeadID": ($routeParams.portalLeadId) ? leadData.cpLeadId : "",
					"ProName": ($routeParams.portalLeadId) ? leadData.product : $routeParams.product,
					"ProCat": null,
					"Address": null,
					"PinCode": ePQA.rblPincode, //pincode blank 
					"SI_DI": ePQA.si,
					"DOB": ePQA.rblDOB, //($routeParams.dob) ? $routeParams.dob : "",
					"ProductCode": productShortCode,
					"ThirdPartyURL": window.location.href,
					"CustID": ($routeParams.custID) ? $routeParams.custID : "",
					"City": ($routeParams.city) ? $routeParams.city : "",
					"Income": ePQA.annualInCome, //($routeParams.income) ? $routeParams.income : "",
					"OccupationType": ePQA.rblOccupation, //($routeParams.occupation) ? $routeParams.occupation : "",
					"Gender": (gender == 0 || gender == 1) ? gender : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"ReferenceID": ($routeParams.urlKey) ? $routeParams.urlKey : "",
					"CrossSellID": ($routeParams.CrossSellID) ? $routeParams.CrossSellID : "",
					"LifeRefNo": ($routeParams.lifeRefNo) ? $routeParams.lifeRefNo : "",
					"LGCode": ePQA.lgCodeValue,
					"WhatsappConsent": ePQA.whatsappconcent,
				},
				"InsuredDetail": []
			}
		}
		else if (ePQA.fedIMDCode != undefined && (ePQA.fedIMDCode == FEDIMDCODE)) {
			finalSubmitData = {
				"ProposerDetail": {
					"ProductCategory": ProductCategory,
					"Age": ePQA.preQuote.Age,
					"MobileNo": ePQA.preQuote.MobileNo,
					"EmailId": ePQA.preQuote.EmailId,
					"EducationQualification": ePQA.fedEduQualification,
					"IMDCode": ePQA.fedIMDCode, //IMDCODE 
					"IMDSource": ePQA.fedIMDSource,
					"FirstName": ($routeParams.portalLeadId) ? leadData.name : $routeParams.fname,
					"LastName": ($routeParams.portalLeadId) ? "" : $routeParams.lname,
					"Branch": ($routeParams.branch) ? $routeParams.branch : "",
					"Keyword": ($routeParams.portalLeadId) ? leadData.Keyword : $routeParams.keyword,
					"AdGroup": ($routeParams.portalLeadId) ? leadData.Adgroup : $routeParams.adgroup,
					"Location": ($routeParams.location) ? "" : $routeParams.location,
					"VK_ID": ($routeParams.portalLeadId) ? "" : $routeParams.vkid,
					"VK_SSID": ($routeParams.portalLeadId) ? "" : $routeParams.spid,
					"VK_SecurityCode": ($routeParams.portalLeadId) ? "" : $routeParams.securitycode,
					"PortalLeadID": ($routeParams.portalLeadId) ? leadData.portalLeadId : "",
					"CRMLeadID": ($routeParams.portalLeadId) ? leadData.cpLeadId : "",
					"ProName": ($routeParams.portalLeadId) ? leadData.product : $routeParams.product,
					"ProCat": null,
					"Address": null,
					"PinCode": ePQA.fedPincode, //pincode blank 
					"SI_DI": ePQA.fedSI,
					"DOB": ePQA.fedDOB,
					"ProductCode": productShortCode,
					"ThirdPartyURL": window.location.href,
					"CustID": ($routeParams.custID) ? $routeParams.custID : "",
					"City": ($routeParams.city) ? $routeParams.city : "",
					"Income": ePQA.fedAnnualInCome, //($routeParams.income) ? $routeParams.income : "",
					"OccupationType": ePQA.fedOccupation, //($routeParams.occupation) ? $routeParams.occupation : "",
					"Gender": (gender == 0 || gender == 1) ? gender : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"ReferenceID": ($routeParams.urlKey) ? $routeParams.urlKey : "",
					"CrossSellID": ($routeParams.CrossSellID) ? $routeParams.CrossSellID : "",
					"LifeRefNo": ($routeParams.lifeRefNo) ? $routeParams.lifeRefNo : "",
					"WhatsappConsent": ePQA.whatsappconcent,
					"LGCode": ePQA.lgCodeValue
				},
				"InsuredDetail": []
			}
		}
		else if (ePQA.idfcIMDCode != undefined && (ePQA.idfcIMDCode == IDFCIMDCODE)) {
			finalSubmitData = {
				"ProposerDetail": {
					"ProductCategory": ProductCategory,
					"Age": ePQA.preQuote.Age,
					"MobileNo": ePQA.preQuote.MobileNo,
					"EmailId": ePQA.preQuote.EmailId,
					"EducationQualification": ePQA.idfcEduQualification,
					"IMDCode": ePQA.idfcIMDCode, //IMDCODE 
					"IMDSource": ePQA.idfcIMDSource,
					"FirstName": ePQA.idfcFname,
					"LastName": ePQA.idfcLname,
					"Branch": ($routeParams.branch) ? $routeParams.branch : "",
					"Keyword": ($routeParams.portalLeadId) ? leadData.Keyword : $routeParams.keyword,
					"AdGroup": ($routeParams.portalLeadId) ? leadData.Adgroup : $routeParams.adgroup,
					"Location": ($routeParams.location) ? "" : $routeParams.location,
					"VK_ID": ($routeParams.portalLeadId) ? "" : $routeParams.vkid,
					"VK_SSID": ($routeParams.portalLeadId) ? "" : $routeParams.spid,
					"VK_SecurityCode": ($routeParams.portalLeadId) ? "" : $routeParams.securitycode,
					"PortalLeadID": ($routeParams.portalLeadId) ? leadData.portalLeadId : "",
					"CRMLeadID": ($routeParams.portalLeadId) ? leadData.cpLeadId : "",
					"ProName": ($routeParams.portalLeadId) ? leadData.product : $routeParams.product,
					"ProCat": null,
					"Address": ePQA.addr1 + "#" + ePQA.addr2,
					"PinCode": ePQA.idfcPincode, //pincode blank 
					"SI_DI": ePQA.idfcSI,
					"DOB": ePQA.idfcDOB,
					"ProductCode": productShortCode,
					"ThirdPartyURL": window.location.href,
					"CustID": ($routeParams.custID) ? $routeParams.custID : "",
					"City": ($routeParams.city) ? $routeParams.city : "",
					"Income": "",
					"OccupationType": ePQA.idfcOccupation,
					"Gender": (gender == 0 || gender == 1) ? gender : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"ReferenceID": ($routeParams.urlKey) ? $routeParams.urlKey : "",
					"CrossSellID": ($routeParams.CrossSellID) ? $routeParams.CrossSellID : "",
					"LifeRefNo": ($routeParams.lifeRefNo) ? $routeParams.lifeRefNo : "",
					"WhatsappConsent": ePQA.whatsappconcent,
					"LGCode": ePQA.lgCodeValue,
					"PanNo":ePQA.idfcPAN
				},
				"InsuredDetail": []
			}
		}		
		else if (ePQA.hdfcIMDCode != undefined && (ePQA.hdfcIMDCode == HDFCIMDCODE)) {
			finalSubmitData = {
				"ProposerDetail": {
					"ProductCategory": ProductCategory,
					"Age": ePQA.preQuote.Age,
					"MobileNo": ePQA.preQuote.MobileNo,
					"EmailId": ePQA.preQuote.EmailId,
					"EducationQualification": ePQA.hdfcEduQualification,
					"IMDCode": ePQA.hdfcIMDCode, //IMDCODE 
					"IMDSource": ePQA.hdfcIMDSource,
					"FirstName": ePQA.hdfcFname,
					"LastName": ePQA.hdfcLname,
					"Branch": ($routeParams.branch) ? $routeParams.branch : "",
					"Keyword": ($routeParams.portalLeadId) ? leadData.Keyword : $routeParams.keyword,
					"AdGroup": ($routeParams.portalLeadId) ? leadData.Adgroup : $routeParams.adgroup,
					"Location": ($routeParams.location) ? "" : $routeParams.location,
					"VK_ID": ($routeParams.portalLeadId) ? "" : $routeParams.vkid,
					"VK_SSID": ($routeParams.portalLeadId) ? "" : $routeParams.spid,
					"VK_SecurityCode": ($routeParams.portalLeadId) ? "" : $routeParams.securitycode,
					"PortalLeadID": ($routeParams.portalLeadId) ? leadData.portalLeadId : "",
					"CRMLeadID": ($routeParams.portalLeadId) ? leadData.cpLeadId : "",
					"ProName": ($routeParams.portalLeadId) ? leadData.product : $routeParams.product,
					"ProCat": null,
					"Address": ePQA.addr1 + "#" + ePQA.addr2,
					"PinCode": ePQA.hdfcPincode, //pincode blank 
					"SumInsured": ePQA.hdfcSI,
					"DOB": ePQA.hdfcDOB,
					"ProductCode": productShortCode,
					"ThirdPartyURL": window.location.href,
					"CustID": ($routeParams.custID) ? $routeParams.custID : "",
					"City": ($routeParams.city) ? $routeParams.city : "",
					"Income": "",
					"OccupationType": ePQA.hdfcOccupation,
					"Gender": (gender == 0 || gender == 1) ? gender : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"ReferenceID": ($routeParams.urlKey) ? $routeParams.urlKey : "",
					"CrossSellID": ($routeParams.CrossSellID) ? $routeParams.CrossSellID : "",
					"LifeRefNo": ($routeParams.lifeRefNo) ? $routeParams.lifeRefNo : "",
					"WhatsappConsent": ePQA.whatsappconcent,
					"LGCode": ePQA.lgCodeValue,
					"PanNo":ePQA.hdfcPAN
				},
				"InsuredDetail": []
			}
		}
		else if ($routeParams.IMDCode == '2112349') {
			finalSubmitData = {
				"ProposerDetail": {
					"ProductCategory": ProductCategory,
					"Age": ePQA.preQuote.Age,
					"MobileNo": ePQA.preQuote.MobileNo,
					"EmailId": ePQA.preQuote.EmailId,
					"IMDCode": ($routeParams.portalLeadId) ? leadData.imdCode : imdCode,
					"IMDSource": ($routeParams.portalLeadId) ? leadData.source : $routeParams.source,
					"FirstName": ($routeParams.portalLeadId) ? leadData.name : $routeParams.fname,
					"LastName": ($routeParams.portalLeadId) ? "" : $routeParams.lname,
					"Branch": ($routeParams.branch) ? $routeParams.branch : "",
					"Keyword": ($routeParams.portalLeadId) ? leadData.Keyword : $routeParams.keyword,
					"AdGroup": ($routeParams.portalLeadId) ? leadData.Adgroup : $routeParams.adgroup,
					"Location": ($routeParams.location) ? "" : $routeParams.location,
					"VK_ID": ($routeParams.portalLeadId) ? "" : $routeParams.vkid,
					"VK_SSID": ($routeParams.portalLeadId) ? "" : $routeParams.spid,
					"VK_SecurityCode": ($routeParams.portalLeadId) ? "" : $routeParams.securitycode,
					"PortalLeadID": ($routeParams.portalLeadId) ? leadData.portalLeadId : "",
					"CRMLeadID": ($routeParams.portalLeadId) ? leadData.cpLeadId : "",
					"ProName": ($routeParams.portalLeadId) ? leadData.product : $routeParams.product,
					"ProCat": null,
					"Address": null,
					"PinCode": null,
					"DOB": ($routeParams.dob) ? $routeParams.dob : "",
					"ProductCode": productShortCode,
					"ThirdPartyURL": window.location.href,
					"CustID": ($routeParams.custID) ? $routeParams.custID : "",
					"City": ($routeParams.city) ? $routeParams.city : "",
					"Income": ($routeParams.income) ? $routeParams.income : "",
					"OccupationType": ($routeParams.occupation) ? $routeParams.occupation : "",
					"Gender": (gender == 0 || gender == 1) ? gender : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"ReferenceID": ($routeParams.urlKey) ? $routeParams.urlKey : "",
					"CrossSellID": ($routeParams.CrossSellID) ? $routeParams.CrossSellID : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"LifeRefNo": ($routeParams.lifeRefNo) ? $routeParams.lifeRefNo : "",
					"subchannel": ePQA.productDetail.channelName,
					"Location": ePQA.productDetail.location,
					"spcode": ePQA.productDetail.abhispCode,
					"partnercode": ePQA.productDetail.patnerCode,
					"employeecode": ePQA.productDetail.employeeCode,
					"abhismcode": ePQA.productDetail.abhiSMcode,
					"WhatsappConsent": ePQA.whatsappconcent,
				},
				"InsuredDetail": []
			}
		} 
		else if ($routeParams.IMDCode == '2101599') {
			finalSubmitData = {
				"ProposerDetail": {
					"ProductCategory": ProductCategory,
					"Age": ePQA.preQuote.Age,
					"MobileNo": ePQA.preQuote.MobileNo,
					"EmailId": ePQA.preQuote.EmailId,
					"IMDCode": ($routeParams.portalLeadId) ? leadData.imdCode : imdCode,
					"IMDSource": ($routeParams.portalLeadId) ? leadData.source : $routeParams.source,
					"FirstName": ($routeParams.portalLeadId) ? leadData.name : $routeParams.fname,
					"LastName": ($routeParams.portalLeadId) ? "" : $routeParams.lname,
					"Branch": ($routeParams.branch) ? $routeParams.branch : "",
					"Keyword": ($routeParams.portalLeadId) ? leadData.Keyword : $routeParams.keyword,
					"AdGroup": ($routeParams.portalLeadId) ? leadData.Adgroup : $routeParams.adgroup,
					"Location": ($routeParams.location) ? "" : $routeParams.location,
					"VK_ID": ($routeParams.portalLeadId) ? "" : $routeParams.vkid,
					"VK_SSID": ($routeParams.portalLeadId) ? "" : $routeParams.spid,
					"VK_SecurityCode": ($routeParams.portalLeadId) ? "" : $routeParams.securitycode,
					"PortalLeadID": ($routeParams.portalLeadId) ? leadData.portalLeadId : "",
					"CRMLeadID": ($routeParams.portalLeadId) ? leadData.cpLeadId : "",
					"ProName": ($routeParams.portalLeadId) ? leadData.product : $routeParams.product,
					"ProCat": null,
					"Address": null,
					"PinCode": null,
					"DOB": ($routeParams.dob) ? $routeParams.dob : "",
					"ProductCode": productShortCode,
					"ThirdPartyURL": window.location.href,
					"CustID": ($routeParams.custID) ? $routeParams.custID : "",
					"City": ($routeParams.city) ? $routeParams.city : "",
					"Income": ($routeParams.income) ? $routeParams.income : "",
					"OccupationType": ($routeParams.occupation) ? $routeParams.occupation : "",
					"Gender": (gender == 0 || gender == 1) ? gender : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"ReferenceID": ($routeParams.urlKey) ? $routeParams.urlKey : "",
					"CrossSellID": ($routeParams.CrossSellID) ? $routeParams.CrossSellID : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"LifeRefNo": ($routeParams.lifeRefNo) ? $routeParams.lifeRefNo : "",
					"AccountNumber": ePQA.productDetail.bankAccountNumber,
					"employeecode": ePQA.productDetail.sourcingEmployeeID,
					"PanNumber": ePQA.productDetail.pANNumber,
					"LoanAccNumber": ePQA.productDetail.loanAccountNumber,
					"WhatsappConsent": ePQA.whatsappconcent,
				},
				"InsuredDetail": []
			}
		}
		else {
			finalSubmitData = {
				"ProposerDetail": {
					"ProductCategory": ProductCategory,
					"Age": ePQA.preQuote.Age,
					"MobileNo": ePQA.preQuote.MobileNo,
					"EmailId": ePQA.preQuote.EmailId,
					"IMDCode": ($routeParams.portalLeadId) ? leadData.imdCode : imdCode,
					"IMDSource": ($routeParams.portalLeadId) ? leadData.source : $routeParams.source,
					"FirstName": ($routeParams.portalLeadId) ? leadData.name : $routeParams.fname,
					"LastName": ($routeParams.portalLeadId) ? "" : $routeParams.lname,
					"Branch": ($routeParams.branch) ? $routeParams.branch : "",
					"Keyword": ($routeParams.portalLeadId) ? leadData.Keyword : $routeParams.keyword,
					"AdGroup": ($routeParams.portalLeadId) ? leadData.Adgroup : $routeParams.adgroup,
					"Location": ($routeParams.location) ? "" : $routeParams.location,
					"VK_ID": ($routeParams.portalLeadId) ? "" : $routeParams.vkid,
					"VK_SSID": ($routeParams.portalLeadId) ? "" : $routeParams.spid,
					"VK_SecurityCode": ($routeParams.portalLeadId) ? "" : $routeParams.securitycode,
					"PortalLeadID": ($routeParams.portalLeadId) ? leadData.portalLeadId : "",
					"CRMLeadID": ($routeParams.portalLeadId) ? leadData.cpLeadId : "",
					"ProName": ($routeParams.portalLeadId) ? leadData.product : $routeParams.product,
					"ProCat": null,
					"Address": null,
					"PinCode": null,
					"DOB": ($routeParams.dob) ? $routeParams.dob : "",
					"ProductCode": productShortCode,
					"ThirdPartyURL": window.location.href,
					"CustID": ($routeParams.custID) ? $routeParams.custID : "",
					"City": ($routeParams.city) ? $routeParams.city : "",
					"Income": ($routeParams.income) ? $routeParams.income : "",
					"OccupationType": ($routeParams.occupation) ? $routeParams.occupation : "",
					"Gender": (gender == 0 || gender == 1) ? gender : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"ReferenceID": ($routeParams.urlKey) ? $routeParams.urlKey : "",
					"CrossSellID": ($routeParams.CrossSellID) ? $routeParams.CrossSellID : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"LifeRefNo": ($routeParams.lifeRefNo) ? $routeParams.lifeRefNo : "",
					"WhatsappConsent": ePQA.whatsappconcent,
				},
				"InsuredDetail": []
			}
		}

		if ($routeParams.imdcode == '2100019') {
			finalSubmitData.ProposerDetail.CustID = $rootScope.decrypt($routeParams.custID.replace(/ /g, "+"))
		}
		if (ePQA.preQuote.Cover == "S" || ePQA.preQuote.Cover == "SP" || ePQA.preQuote.Cover == "SPK" || ePQA.preQuote.Cover == "SK" || $location.$$path == '/activ-secure-personal-accident-pre-quote-v2' || $location.$$path == '/activ-secure-personal-accident-pre-quote') {
			insuredDetailPush(1, 'SELF', 'S', ePQA.preQuote.Age);
		}
		if (ePQA.preQuote.Cover == "SP" || ePQA.preQuote.Cover == "SPK" || ePQA.preQuote.Cover == "PK") {
			insuredDetailPush(0, 'SPOUSE', 'SPO', ePQA.preQuote.spouseAge);
		}
		if (ePQA.preQuote.Cover == "SK" || ePQA.preQuote.Cover == "SPK" || ePQA.preQuote.Cover == "PK") {
			for (i = 0; i < ePQA.preQuote.Kids; i++) {
				insuredDetailPush(1, 'KID', "KID" + (i + 1), ePQA.kidsObject[i].age);
			}
		}
		if (ePQA.preQuote.Cover == "D" || ePQA.preQuote.Cover == "SC") {
			angular.forEach(ePQA.selectedMembers, function (v, i) {
				if (ePQA.selectedMembers[i]) {
					pushInsuredDetails(i.toUpperCase());
				}
			});
		}

		if (finalSubmitData.ProposerDetail.IMDCode == '2100019') {
			finalSubmitData.ProposerDetail.IMDSource = "DNC_DEUTSCHE"
		}

		aS.postData(ABHI_CONFIG.apiUrl + "GEN/PreQuote", finalSubmitData, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					$rootScope.showLoader = true;
					$('#pan-card-modal').modal('hide');
					ePQA.loadAddMemberSection = true;
					sessionStorage.setItem('ut', data.ResponseData.ut);
					sessionStorage.setItem('rid', data.ResponseData.ReferenceNumber);
					sessionStorage.setItem('newJourney', true);
					sessionStorage.setItem('imdCode', finalSubmitData.ProposerDetail.IMDCode)
					sessionStorage.setItem('imdSource', finalSubmitData.ProposerDetail.IMDSource)
					if ($routeParams.leadId) {
						sessionStorage.setItem('leadId', $routeParams.leadId);
					} else if ($routeParams.portalLeadId) {
						sessionStorage.setItem('leadId', $routeParams.portalLeadId);
					} else {
						//leadInsertCall()
					}
					event.target.disabled = false;
					event.target.innerHTML = actText;

					/* After submitting form as this page is product level we call validateProduct function whether we can validate selected family contruct is valid or not. */

					if (ePQA.productName != "") {
						var toCallValidate = true;
						$scope.$watch(angular.bind(ePQA.membersDetails, function () {
							return ePQA.membersDetails;
						}), function (newVal, oldVal) {
							if (!angular.isUndefined(newVal) && toCallValidate) {
								$rootScope.showLoader = false;
								toCallValidate = false;
								validateProduct(event, actText);
							}
						});
					}
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "Yes",
						"modalCancelText": "No",
						"showAlertModal": true
					}
					event.target.disabled = false;
					event.target.innerHTML = actText;
				}
			}, function (err) {
				event.target.disabled = false;
				event.target.innerHTML = actText;
			});
	}

	/* End of submitting Form data */

	/* ----------------to check RBL PASA active assure product check------------------- */

	ePQA.checkActivAssureProducts = function (event) {
		var lemniskObj = {
			"email": ePQA.preQuote.EmailId
		};
		$rootScope.lemniskTrack("", "", lemniskObj);
		

		//Popup needs to open in case of RBL PASA 

		if ($location.$$path == '/activ-assure-pre-quote' && Object.keys($routeParams).length != 0 && (ePQA.rblIMDCode == "2110895")) {
			ePQA.validateLGcode = true;
			$('#pan-card-modal').modal({ backdrop: 'static', keyboard: false });
		} else {
			ePQA.checkProducts(event);
		}
	}

	/* -----------------to check RBL PASA active assure product check-------------------- */

	/* To check products */

	ePQA.checkProducts = function (event) {

		if ($location.$$path == '/activ-secure-personal-accident-pre-quote') {
			if(!ePQA.preQuote.MobileNo || !ePQA.preQuote.EmailId || !ePQA.preQuote.Age){
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": 'All the fields are required.',
					"showCancelBtn": false,
					"modalSuccessText": "OK",
					"showAlertModal": true,
				}
				return false;
			}
			 else if(ePQA.preQuote.MobileNo.length != 10 || (/^(\d)\1\1\1\1\1\1\1\1\1$/.test(ePQA.preQuote.MobileNo)) || (!/^[6-9]\d{9}$/.test(ePQA.preQuote.MobileNo))){
				$rootScope.callGtag('alert','pre-quote','prequote_correct-mobile-no-alert');
				$rootScope.alertConfiguration('E',"Please enter your correct mobile number.");
				return false;
			}
			else if (angular.isUndefined(ePQA.preQuote.EmailId) || ePQA.preQuote.EmailId == "" || !(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(ePQA.preQuote.EmailId))) {
				$rootScope.alertConfiguration('E', "Please enter valid email", "self_email_alert");
				return false;
			}
			else if (ePQA.preQuote.Age < 18 || ePQA.preQuote.Age > 65) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": 'Age should not be less than 18 and greater than 65',
					"showCancelBtn": false,
					"modalSuccessText": "OK",
					"showAlertModal": true,
				}
				return false;
			}

		}

		/* Email Field validation */

		if (angular.isUndefined(ePQA.preQuote.EmailId) || ePQA.preQuote.EmailId == "" || !(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(ePQA.preQuote.EmailId))) {
			$rootScope.alertConfiguration('E', "Please enter valid email", "self_email_alert");
			return false;
		}

		/* End of email field validation */


		/* To change text of Check Products button to Please wait .... */

		var actText = angular.copy(event.target.innerHTML);
		event.target.disabled = true;
		event.target.textContent = "Saving...";

		/* End of changing text of check products button to please wait */


		/* 
			Pre Quote Data storing in sessionStorage
			We are storing following data in sessionstorage so that when user goes from pre quote page to some another page and then
			from there he visits pre quote page again then his/her pre quota data shoud be pre populated

		*/

		var preQuoteData = {
			'selectCategory': ePQA.selectCategory,
			'coverTo': ePQA.coverTo,
			'prequote': ePQA.preQuote,
			'kidsObject': ePQA.kidsObject,
			'selectedMembers': ePQA.selectedMembers
		}

		sessionStorage.setItem('prequoteData', JSON.stringify(preQuoteData));

		/* End of storing pre quote data in sessionStorage */

		/* 
			To call duplicatecheck service so that we can check whether emailid and mobile no
			which user entered is present in database of not.
		*/
		if (ePQA.rblIMDCode != undefined && (ePQA.rblIMDCode == "2110895" || ePQA.rblIMDCode != "")) {
			finalSubmitData = {
				"ProposerDetail": {
					"ProductCategory": ProductCategory,
					"Age": ePQA.preQuote.Age,
					"MobileNo": ePQA.preQuote.MobileNo,
					"EmailId": ePQA.preQuote.EmailId,
					"EducationQualification": ePQA.eduQualification,
					"IMDCode": ePQA.rblIMDCode, //IMDCODE 
					"IMDSource": ($routeParams.portalLeadId) ? leadData.source : $routeParams.source,
					"FirstName": ($routeParams.portalLeadId) ? leadData.name : $routeParams.fname,
					"LastName": ($routeParams.portalLeadId) ? "" : $routeParams.lname,
					"Branch": ePQA.rblPincode, //($routeParams.branch) ? $routeParams.branch : ""  ,
					"Keyword": ($routeParams.portalLeadId) ? leadData.Keyword : $routeParams.keyword,
					"AdGroup": ($routeParams.portalLeadId) ? leadData.Adgroup : $routeParams.adgroup,
					"Location": ($routeParams.location) ? "" : $routeParams.location,
					"VK_ID": ($routeParams.portalLeadId) ? "" : $routeParams.vkid,
					"VK_SSID": ($routeParams.portalLeadId) ? "" : $routeParams.spid,
					"VK_SecurityCode": ($routeParams.portalLeadId) ? "" : $routeParams.securitycode,
					"PortalLeadID": ($routeParams.portalLeadId) ? leadData.portalLeadId : "",
					"CRMLeadID": ($routeParams.portalLeadId) ? leadData.cpLeadId : "",
					"ProName": ($routeParams.portalLeadId) ? leadData.product : $routeParams.product,
					"ProCat": null,
					"Address": null,
					"PinCode": ePQA.rblPincode, //pincode blank 
					"SI_DI": ePQA.si,
					"DOB": ePQA.rblDOB, //($routeParams.dob) ? $routeParams.dob : "",
					"ProductCode": productShortCode,
					"ThirdPartyURL": window.location.href,
					"CustID": ($routeParams.custID) ? $routeParams.custID : "",
					"City": ($routeParams.city) ? $routeParams.city : "",
					"Income": ePQA.annualInCome, //($routeParams.income) ? $routeParams.income : "",
					"OccupationType": ePQA.rblOccupation, //($routeParams.occupation) ? $routeParams.occupation : "",
					"Gender": (gender == 0 || gender == 1) ? gender : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"ReferenceID": ($routeParams.urlKey) ? $routeParams.urlKey : "",
					"CrossSellID": ($routeParams.CrossSellID) ? $routeParams.CrossSellID : "",
					"LifeRefNo": ($routeParams.lifeRefNo) ? $routeParams.lifeRefNo : "",
					"LGCode": ePQA.lgCodeValue,
				},

			}
		} else {
			finalSubmitData = {
				"ProposerDetail": {
					"ProductCategory": ProductCategory,
					"Age": ePQA.preQuote.Age,
					"MobileNo": ePQA.preQuote.MobileNo,
					"EmailId": ePQA.preQuote.EmailId,
					"IMDCode": ($routeParams.portalLeadId) ? leadData.imdCode : imdCode,
					"IMDSource": ($routeParams.portalLeadId) ? leadData.source : $routeParams.source,
					"FirstName": ($routeParams.portalLeadId) ? leadData.name : $routeParams.fname,
					"LastName": ($routeParams.portalLeadId) ? "" : $routeParams.lname,
					"Branch": ($routeParams.branch) ? $routeParams.branch : "",
					"Keyword": ($routeParams.portalLeadId) ? leadData.Keyword : $routeParams.keyword,
					"AdGroup": ($routeParams.portalLeadId) ? leadData.Adgroup : $routeParams.adgroup,
					"Location": ($routeParams.location) ? "" : $routeParams.location,
					"VK_ID": ($routeParams.portalLeadId) ? "" : $routeParams.vkid,
					"VK_SSID": ($routeParams.portalLeadId) ? "" : $routeParams.spid,
					"VK_SecurityCode": ($routeParams.portalLeadId) ? "" : $routeParams.securitycode,
					"PortalLeadID": ($routeParams.portalLeadId) ? leadData.portalLeadId : "",
					"CRMLeadID": ($routeParams.portalLeadId) ? leadData.cpLeadId : "",
					"ProName": ($routeParams.portalLeadId) ? leadData.product : $routeParams.product,
					"ProCat": null,
					"Address": null,
					"PinCode": null,
					"DOB": ($routeParams.dob) ? $routeParams.dob : "",
					"ProductCode": productShortCode,
					"ThirdPartyURL": window.location.href,
					"CustID": ($routeParams.custID) ? $routeParams.custID : "",
					"City": ($routeParams.city) ? $routeParams.city : "",
					"Income": ($routeParams.income) ? $routeParams.income : "",
					"OccupationType": ($routeParams.occupation) ? $routeParams.occupation : "",
					"Gender": (gender == 0 || gender == 1) ? gender : "",
					"ReferenceID": ($routeParams.urlKey) ? $routeParams.urlKey : "",
					"CrossSellID": ($routeParams.CrossSellID) ? $routeParams.CrossSellID : "",
					"lemniskId": sessionStorage.getItem('lemniskIdVal'),
					"LifeRefNo": ($routeParams.lifeRefNo) ? $routeParams.lifeRefNo : "",
				},

			}
		}
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/DuplicateCheck", finalSubmitData, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					/* 
						If ResponseMessage is 'NOT_EXIST' then we will call pre-quote service
						Else we show popup asking recod already exist do you wwantto conitnue
					*/
					if (data.ResponseMessage == "NOT_EXIST") {
						submitFormData(event, actText);
					} else {
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Alert",
							"modalBodyText": data.ResponseMessage,
							"showCancelBtn": true,
							"modalSuccessText": "Yes",
							"modalCancelText": "No",
							"showAlertModal": true,
							"hideCloseBtn": true,
							"positiveFunction": function () {
								/* 
									If user clicks yes then we first hit service to update IMD, where we sent reference no
									which we receive from duplicate check service and  IMDCode : 5100003 and IMDSource : Customer Portal
								*/

								if ($routeParams.portalLeadId) {
									imdCode = (leadData.imdCode) ? leadData.imdCode : "5100003";
									imdSource = (leadData.source) ? leadData.source : "Customer Portal";
								}
								aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateIMD", {
									"IMDCode": imdCode,
									"IMDSource": imdSource,
									"ReferenceNumber": data.ResponseData.ReferenceNumber
								}, true, {
									headers: {
										'Content-Type': 'application/json'
									}
								})
									.then(function (response) {
										if (response.ResponseCode == 1) {
											sessionStorage.setItem('ut', data.ResponseData.ut); // Store usertoken received from duplicatecheck service into session storage
											sessionStorage.setItem('rid', data.ResponseData.ReferenceNumber); // Store reference no received from duplicatecheck service into sessionstorage

											/* Service to receive crm lead id associated with existing lead id */

											aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetCRMLeadId", {
												"ReferenceNumber": data.ResponseData.ReferenceNumber
											}, true, {
												headers: {
													'Content-Type': 'application/json'
												}
											})
												.then(function (crmData) {
													if (response.ResponseCode == 1) {
														sessionStorage.setItem('leadId', crmData.ResponseData.LeadId); // Store leadId receive from getcrmleadid service into sessionStorage

														/* 
																	Following switch loop decides on which quote page to redirect 
																	based on data received from DuplicateCheck service
															*/

														switch (data.ResponseData.ProductCode) {
															case "CS":
																/* If product code is CS then redirect to 'cs-quote' page and store 'pName' value as Activ Secure Cancer Secure inside sessioStorage*/
																sessionStorage.setItem('pName', "Activ Secure Cancer Secure");
																$location.url('cs-quote');
																break;
															case "PA":
																/* If product code is PA then redirect to 'pa-quote' page and store 'pName' value as Activ Secure Personal Accident inside sessioStorage*/
																sessionStorage.setItem('pName', "Activ Secure Personal Accident");
																$location.url('pa-quote');
																break;
															case "CI":
																/* If product code is CI then redirect to 'ci-quote' page and store 'pName' value as Activ Secure Critical Illness inside sessioStorage*/
																sessionStorage.setItem('pName', "Activ Secure Critical Illness");
																$location.url('ci-quote');
																break;
															case "PL":
																/* If product code is PL then redirect to 'platinum-quote' page and store 'pName' value as Activ Health inside sessioStorage*/
																sessionStorage.setItem('pName', "Activ Health");
																$location.url('platinum-quote');
																break;
															case "DI":
																/* If product code is DI then redirect to 'diamond-quote' page and store 'pName' value as Activ Assure inside sessioStorage*/
																sessionStorage.setItem('pName', "Activ Assure");
																$location.url('diamond-quote');
																break;
															case "CK":
																/* If product code is DI then redirect to 'diamond-quote' page and store 'pName' value as Activ Assure inside sessioStorage*/
																sessionStorage.setItem('pName', "Corona Kavach");
																$location.url('corona-kavach-quote');
																break;
															case "AC":
																/* If product code is DI then redirect to 'diamond-quote' page and store 'pName' value as Activ Assure inside sessioStorage*/
																sessionStorage.setItem('pName', "Activ Care");
																$location.url('diamond-quote');
																break;
															case "AS":
																sessionStorage.setItem('pName', "Arogya Sanjeevani");
																$location.url('arogya-sanjeevani-quote');
																break;
														}
													} else {
														event.target.disabled = false;
														event.target.innerHTML = actText;
														$rootScope.alertData = {
															"modalClass": "regular-alert",
															"modalHeader": "Alert",
															"modalBodyText": "Something went wrong",
															"showCancelBtn": false,
															"modalSuccessText": "Yes",
															"showAlertModal": true,
														}
													}
												}, function (err) {
												});
										} else {
											event.target.disabled = false;
											event.target.innerHTML = actText;
											$rootScope.alertData = {
												"modalClass": "regular-alert",
												"modalHeader": "Alert",
												"modalBodyText": "Something went wrong",
												"showCancelBtn": false,
												"modalSuccessText": "Yes",
												"showAlertModal": true,
											}
										}
									}, function (err) { })

								/* End of service to receive crm lead id associated with existing lead id */

							},
							"negativeFunction": function () {
								submitFormData(event, actText);
							}
						}
					}
				} else {
					event.target.disabled = false;
					event.target.innerHTML = actText;
				}
			}, function (err) {
			});
	}

	/* End of checking products */


	/* To buy product after validation */

	ePQA.buyProduct = function (event) {
		var actText = angular.copy(event.target.innerHTML);
		event.target.disabled = true;
		event.target.textContent = "Buying...";
		validateProduct(event, actText);
	}

	/* End of to buy product after validation */


	/* Function to buy product */

	function buyProduct(ProductCode, event, actText) {
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/BuyProduct", {
			"ReferenceNumber": sessionStorage.getItem('rid'),
			"ProductCode": ePQA.ST ? 'DI' : ProductCode
		}, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					if (ProductCode == "DI") {
						sessionStorage.setItem('pageNoSeq', 2);
						if (ePQA.ST) {
							buySecondaryProduct('ST', finalSubmitData.InsuredDetail)
						}
						else {
							$timeout(function () {
								$location.url("diamond-quote");
							}, 200);
						}
					} else if (ProductCode == "CK") {
						sessionStorage.setItem('pageNoSeq', 2);
						$timeout(function () {
							$location.url("corona-kavach-quote");
						}, 200);
					} else if (ProductCode == "AS") {
						sessionStorage.setItem('pageNoSeq', 2);
						$timeout(function () {
							$location.url("arogya-sanjeevani-quote");
						}, 200);
					} else if (ProductCode == "CS") {
						sessionStorage.setItem('pageNoSeq', 2);
						$timeout(function () {
							$location.url("cs-quote");
						}, 200);
					}
					else if (ProductCode == "PA") {
						sessionStorage.setItem('pageNoSeq', 2);
						$timeout(function () {
							$location.url("pa-quote");
						}, 200);
					} else {
						sessionStorage.setItem('pageNoSeq', 1);
						$timeout(function () {
							$location.url('plans');
						}, 200);
					}
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "OK",
						"modalCancelText": "No",
						"showAlertModal": true
					}
				}
			}, function (err) {
				event.target.disabled = false;
			});
	}

	/* End of function to buy products */


	/* buy Secondary Product */
	function buySecondaryProduct(productCode, memberdetailList) {
		var memberedArray = [];
		sessionStorage.setItem('crossSell', true);
		for (var i = 0; i < memberdetailList.length; i++) {
			memberedArray.push(memberdetailList[i].RelationType)
		}

		aS.postData(ABHI_CONFIG.apiUrl + "GEN/BuyProduct", {
			"MemberList": memberedArray,
			"ReferenceNumber": sessionStorage.getItem('rid'),
			"ProductCode": productCode
		}, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				$timeout(function () {
					$location.url("/diamond-stp-quote");
				}, 200);
			})
	}
	/* buy secondary product ends */

	//  $rootScope.$on('$routeChangeStart', function (scope, next, current) {
	//     if ($location.$$path =='/pre-quote') {
	//         // Show here for your model, and do what you need**
	// 		if( productShortCode == 'DI'){
	// 			$location.url('activ-assure-pre-quote');
	// 		}
	// 		if( productShortCode =='AS'){
	// 			$location.url('arogya-sanjeevani-quote');
	// 		}
	//     }
	// });

}]);

/*
	End of controller
	Name: Pre Quote Controller
	Author: Pankaj Patil
	Date: 19-06-2018
*/
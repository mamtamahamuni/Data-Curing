/*
	Name: Pre Quote Controller
	Author: Pankaj Patil
	Date: 19-06-2018
*/


var preApp = angular.module("preQuoteApp", []);

preApp.controller("preQuoteApp", ['$rootScope', 'appService', 'ABHI_CONFIG', '$location', '$routeParams', '$scope', '$window', '$timeout', '$interval', function ($rootScope, appService, ABHI_CONFIG, $location, $routeParams, $scope, $window, $timeout, $interval) {

	/* Variable Initilization */

	var pQA = this; // Current controller scope is stored in pQA
	var aS = appService; // appService is stored in aS variable
	pQA.categories = []; // To stored catgrories data
	pQA.familyConsturcts = []; // To store family construct
	var leadCallService = 0; // As we allow lead service call thrice on failure so variable inilizae
	pQA.additionalMembers = []; // To store additional members
	pQA.preQuote = {}; // Pre quote data object
	var IMDCodeURL;
	var counter = 0; // check user is already logged in user
	pQA.otpexpireTime
	pQA.showNextPreviousBtn = false;
	pQA.showBuyBtn = false;
	pQA.whatsAppCall = false;

	var validateOTP = false;
	var sourceImd;
	console.log("prod")
	//pQA.showBuyBtn = true;
	var fname;
	//pQA.showNextPreviousBtn = true ;
	var lname;
	sessionStorage.removeItem('pageNoSeq'); // Removed pageNoSeq value from sessionStorage
	sessionStorage.removeItem('lastRouteVisted'); // Removed lastRouteVisited value from sessionStorage
	sessionStorage.removeItem('pName'); // Removed pName value from sessionStorage
	sessionStorage.removeItem('productCrmName'); // Removed productCrmName value from sessionStorage
	sessionStorage.removeItem('preExeDis'); // Removed preExeDis value from sessionStorage
	sessionStorage.removeItem('ut'); // Removed ut value from sessionStorage
	sessionStorage.removeItem('leadId'); // Removed ut value from sessionStorage
	sessionStorage.removeItem('mobNo');
	sessionStorage.removeItem("eKycStatus"); // Remove eKyc Status
	sessionStorage.removeItem("eKycDOB"); // Remove DOB found in eKyc

	if ($routeParams.source == 'whatsapp_lead') {
		var mobNoWhatsApp = $rootScope.decrypt($routeParams.mobNo);
	}

	/* 
		If reference no is present in sessionStorage then we check prequotedata and map that data with prequotre object.
		If prequote data is not present then we clear sessionstorage.
		If its present then we mapp data as shown in else loop
		  */

	/* Lead form request object */

	var LeadFormdetails = {
		"CRMLeadObject": {
			"LEADTYPE": "DigitalCampaign",
			"SALUTATION": "",
			"FIRSTNAME": "",
			"LASTNAME": "",
			"DATEOFBIRTH": "",
			"PortalSource": "web_portal",
			"INTERMEDIARYCODE": "",
			"SOURCE": $routeParams.source,
			"PAN": "",
			"PASSPORTNO": "",
			"AADHARNO": "",
			"DRIVINGLICENSENO": "",
			"EMAIL": "default@portalcall.com",
			"GENDER": "",
			"LEADSTAGE": "",
			"LEADSTATUS": "",
			"LEADREFERREDBY": "",
			"LEADREFERREDBYID": "",
			"MOBILE": mobNoWhatsApp,
			"RESIDENTPHONE": "",
			"ADDRESSLINE1": "",
			"ADDRESSLINE2": "",
			"CITY": "",
			"PINCODE": "",
			"STATE": "",
			"PREFERREDCONTACTIBLETIME": "",
			"PREFERREDMODEOFCONTACT": "",
			"NOTESDESCRIPTION": "",
			"NOTESTITLE": "",
			"ACTIVITYDESCRIPTION": "",
			"ACTIVITYSUBECT": "",
			"ACTIVITYTYPE": "",
			"GCLID": "",
			"PRODUCT": "Activ-Assure",
			"Keyword": "",
			"Adgroup": ""
		},
		"PortalLeadObject": {
			"name": "",
			"email": "default@portalcall.com",
			"mobile": mobNoWhatsApp,
			"employeeId": "",
			"PortalSource": "web_portal",
			"product": "Activ-Assure",
			"gclid": "",
			"source": $routeParams.source,
			"imdCode": "",
			"Keyword": "",
			"Adgroup": ""
		}
	}

	/* End of lead form request object */

	if (!angular.isUndefined($routeParams.imdcode)) {
		toValidateIMD($routeParams.imdcode)
	}



	/* 
To validate IMD 
In following function we are validating IMDCode which we received from queryparams
*/


			if($routeParams.source == 'whatsapp_lead'){
				pQA.preQuote.MobileNo = mobNoWhatsApp;
				pQA.whatsAppCall = true;
				$rootScope.alertData = {
			                    "modalClass": "regular-alert",
			                    "modalHeader": "Authorization",
			                    "modalBodyText": "I authorize ABHICL and associate partners to contact me through my email/call/SMS. This will override registry on the DNCR.",
			                    "showCancelBtn": false,
			                    "modalSuccessText": "I Authorize",
			                    "modalCancelText": "No",
			                    "hideCloseBtn" : true,
			                    "showAlertModal": true,
			                    "positiveFunction": function() {
	                                callCRMLeadSer();
	                                	
                            	}
			                }
			}
		
	
	/* 
}
To validate IMD 
In following function we are validating IMDCode which we received from queryparams
*/



	/* Crm Call Function */

	function callCRMLeadSer() {
		aS.postData(ABHI_CONFIG.hservicesv2 + "/HealthLeadform/postLeadFormtoPortal",
			LeadFormdetails
			, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})

			.then(function (response) {


				if (!angular.isUndefined(response['code']) && response['code'] == 1 && response['msg'] == "Success") {

					$rootScope.showLoader = false;
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "",
						"modalBodyText": "There seems to be a problem. Please try again after some time.",
						"showCancelBtn": false,
						"modalSuccessText": "OK",
						"modalCancelText": "No",
						"showAlertModal": true
					}

					$rootScope.showLoader = false;
				}



			});
	}


	/* Crm Call ends */
	/*if(!angular.isUndefined($routeParams.new)){
		pQA.showNextPreviousBtn = false;
		pQA.showBuyBtn = false;
	}*/

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
					} else {
						/* If invalid IMD then we are showing alert */
						pQA.showBuyBtn = false;
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
					pQA.showBuyBtn = false;
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
	if ($location.$$path == "/new-pre-quote") {
		console.log($routeParams)
		pQA.preQuote.MobileNo = $routeParams.mobNo;
		pQA.preQuote.EmailId = $routeParams.emailId;
		IMDCodeURL = (!angular.isUndefined($routeParams.imdcode)) ? $routeParams.imdcode : "5100003";
		sourceImd = (!angular.isUndefined($routeParams.source)) ? $routeParams.source : "Customer Portal";
		fname = (!angular.isUndefined($routeParams.fname)) ? $routeParams.fname : "";
		lname = (!angular.isUndefined($routeParams.lname)) ? $routeParams.lname : "";
	}
	else if ($location.$$path == "/pre-quote") {
		//console.log($routeParams)

		IMDCodeURL = (!angular.isUndefined($routeParams.imdcode)) ? $routeParams.imdcode : "5100003";
		sourceImd = (!angular.isUndefined($routeParams.source)) ? $routeParams.source : "Customer Portal";
		fname = (!angular.isUndefined($routeParams.fname)) ? $routeParams.fname : "";
		lname = (!angular.isUndefined($routeParams.lname)) ? $routeParams.lname : "";
	}
	else if ($routeParams.source == 'whatsapp_lead') {
		IMDCodeURL = "5100003"
		sourceImd = "whatsapp_lead"
	}
	else {
		IMDCodeURL = "5100003"
		sourceImd = "Customer Portal"
	}

	if (sessionStorage.getItem('rid')) {
		var prequoteData = JSON.parse(sessionStorage.getItem('prequoteData'));
		if (prequoteData == null) {
			sessionStorage.clear();
		} else {
			sessionStorage.setItem('continueJourney', 'Y');
			pQA.preQuote = prequoteData.prequote;
			pQA.previousSelectedCatogoryCode = prequoteData.selectCategory;
			pQA.coverTo = prequoteData.coverTo;
			pQA.kidsObject = prequoteData.kidsObject;
			pQA.selectCategory = prequoteData.selectCategory;
			pQA.selectedMembers = prequoteData.selectedMembers;
		}
	}

	/* End of variable inilization */


	/* To Fetch Categories */

	aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMaster", {
		"Name": "getcategory"
	}, false, {
		headers: {
			'Content-Type': 'application/json',
			"Access-Control-Allow-Origin": "*"
		}
	})
		.then(function (data) {
			pQA.categories = data.ResponseData;
			// if($window.innerWidth < 650){
			// 	angular.forEach(data.ResponseData , function(v , i ){
			// 		switch(v.CategoryCode){
			// 			/*case "CK":
			// 			pQA.categories[2] = v;
			// 			break;*/
			// 			case "SC":
			// 			pQA.categories[1] = v;
			// 			break;
			// 			case "HP":
			// 			pQA.categories[0] = v;
			// 			break;
			// 			case "PACI":
			// 			pQA.categories[2] = v;
			// 			break;
			// 			case "PAC":
			// 			pQA.categories[3] = v;
			// 			break;
			// 		}
			// 	})
			// }
			// else{
			// 	angular.forEach(data.ResponseData , function(v , i ){
			// 		switch(v.CategoryCode){
			// 			/*case "CK":
			// 			pQA.categories[2] = v;
			// 			break;*/
			// 			case "SC":
			// 			pQA.categories[1] = v;
			// 			break;
			// 			case "HP":
			// 			pQA.categories[0] = v;
			// 			break;
			// 			case "PACI":
			// 			pQA.categories[2] = v;
			// 			break;
			// 			case "PAC":
			// 			pQA.categories[3] = v;
			// 			break;
			// 		}
			// 	})
			// }
			angular.forEach(pQA.categories, function (v, i) {
				if (v.CategoryCode != 'SC') {
					v.Category = "Protection against" + " " + v.Category;
				}
			})
			/*f(data.ResponseCode == 1){
				pQA.categories = data.ResponseData; // Storaed catrgories inside pQA.categories data
			}*/
		}, function (err) { });

	/* End of fetch catgrories */


	/* To Fetch Family Members for active care */

	aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetMaster", {
		"Name": "getACRelation"
	}, false, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(function (data) {
			pQA.activeCareFamilyContruct = data.ResponseData; // Stored active care family construct inside pQA.activeCareFamilyContruct variable
		}, function (err) { })

	/* End of fetching family members active care */


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
				pQA.familyConsturcts = data.ResponseData;
			}
		}, function (err) {
		});

	/* End of fetching family members */


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
				pQA.additionalMembers = data.ResponseData;
			}
		}, function (err) {
		});

	/* End of fetching additional members */


	/* To call lead insert API */

	function leadInsertCall(data) {
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/LeadInsert", {
			"ReferenceNumber": sessionStorage.getItem('rid')
		}, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					/* If leadInsert service gets success then we store received leadId inside sessionStorage with name leadId */
					sessionStorage.setItem('leadId', data.ResponseData.LeadId);
				} else {
					/* 
						If leadinsert service gets failed then we call leadService util we get success
						Max attempts are 3.			
					*/
					if (leadCallService < 3) {
						++leadCallService;
						leadInsertCall();
					}
				}
			}, function (err) {
			});
	}

	/* End of calling lead insert API */

	/* email hint text logic */
	$(function () {
		var info = $('.info');

		$('#ques_7_email').mailtip({
			onselected: function (mail) {
				pQA.preQuote.EmailId = mail;
			}
		});
	});
	/* email hint text logic ends*/


	/* 
		Function to push insured members in insuredDetails object 
		This function is written to push members data inside insuredDetails object
	*/

	var finalSubmitData = {};
	function insuredDetailPush(gender, relation, relationType, age) {
		finalSubmitData.InsuredDetail.push({
			"Gender": gender,
			"RelationWithProposer": relation,
			"RelationType": relationType,
			"Age": age,
			"ProductCode": "NA" // As product isn't purchased at this moment we are keeping productcode as NA
		})
	}

	/* End of function to push insured members in insuredDetails object */

	/* close Memeber selection model */

	pQA.closeAcModel = function () {
		$('.activ-care').removeClass('showOpt-open')
		//$('.body-overlay').fadeOut();
		var oFC = $('.otherFamilyConstruct');
		oFC.hide().removeClass('ul-activ');
	}

	/* close Memeber selection model ends */

	/* Identifying relationwithproposer */

	function pushInsuredDetails(type) {
		/* 
			Following switch case matches type of the member and based on that calls insuredDetail function. 
			In InsuredDetailsPush function we pass 4 arguments.
			1st Argument is gender of member. 1 For Male and 0 For female
			2nd Argument is member type in capitalize case
			3rd argument is member type code which will always be uppercase
			4th Argument is age of the member which we taken from user.
		*/
		switch (type) {
			case 'SELF':
				insuredDetailPush(1, 'Self', 'S', pQA.preQuote.Age);
				break;
			case 'SPOUSE':
				insuredDetailPush(0, 'Spouse', 'SPO', pQA.preQuote.spouseAge);
				break;
			case 'FATHER':
				insuredDetailPush(1, 'Father', 'F', pQA.preQuote.fatherAge);
				break;
			case 'MOTHER':
				insuredDetailPush(0, 'Mother', 'M', pQA.preQuote.motherAge);
				break;
			case 'FATHER-IN-LAW':
				insuredDetailPush(1, 'Father-in-law', 'FIL', pQA.preQuote.fILAge);
				break;
			case 'MOTHER-IN-LAW':
				insuredDetailPush(0, 'Mother-in-law', 'MIL', pQA.preQuote.mILAge);
				break;
			case 'BROTHER':
				insuredDetailPush(1, 'Brother', 'BRO', pQA.preQuote.broAge);
				break;
			case 'SISTER-IN-LAW':
				insuredDetailPush(0, 'Sister-In-Law', 'SISL', pQA.preQuote.sislAge);
				break;
			case 'SISTER':
				insuredDetailPush(0, 'Sister', 'SIS', pQA.preQuote.sisAge);
				break;
			case 'BROTHER-IN-LAW':
				insuredDetailPush(1, 'Brother-In-Law', 'BIL', pQA.preQuote.bilAge);
				break;
			case 'GRANDFATHER':
				insuredDetailPush(1, 'Grandfather', 'GF', pQA.preQuote.gfAge);
				break;
			case 'GRANDMOTHER':
				insuredDetailPush(0, 'Grandmother', 'GM', pQA.preQuote.gmAge);
				break;
			case 'UNCLE':
				insuredDetailPush(1, 'Uncle', 'UN', pQA.preQuote.unAge);
				break;
			case 'AUNT':
				insuredDetailPush(0, 'Aunt', 'AU', pQA.preQuote.auAge);
				break;
			case 'SON':
				insuredDetailPush(1, 'Son', 'SO', pQA.preQuote.soAge);
				break;
			case 'DAUGHTER-IN-LAW':
				insuredDetailPush(0, 'Daughter-In-Law', 'DIL', pQA.preQuote.dilAge);
				break;
			case 'SON-IN-LAW':
				insuredDetailPush(1, 'Son-In-Law', 'SIL', pQA.preQuote.silAge);
				break;
			case 'DAUGHTER':
				insuredDetailPush(0, 'Daughter', 'DU', pQA.preQuote.dulAge);
				break;
			case 'NEPHEW':
				insuredDetailPush(1, 'Nephew', 'NP', pQA.preQuote.npAge);
				break;
			case 'NIECE-IN-LAW':
				insuredDetailPush(0, 'Niece-In-Law', 'NIL', pQA.preQuote.nilAge);
				break;
			case 'NIECE':
				insuredDetailPush(0, 'Niece', 'NI', pQA.preQuote.niAge);
				break;
			case 'NEPHEW-IN-LAW':
				insuredDetailPush(1, 'Nephew-In-Law', 'NPL', pQA.preQuote.nplAge);
				break;
			case 'GRANDSON':
				insuredDetailPush(1, 'Grandson', 'GS', pQA.preQuote.gsAge);
				break;
			case 'GRANDDAUGHTER-IN-LAW':
				insuredDetailPush(0, 'Granddaughter-In-Law', 'GDL', pQA.preQuote.gdlAge);
				break;
			case 'GRANDDAUGHTER':
				insuredDetailPush(0, 'Granddaughter', 'GD', pQA.preQuote.gdAge);
				break;
			case 'GRANDSON-IN-LAW':
				insuredDetailPush(1, 'Grandson-In-Law', 'GSL', pQA.preQuote.gslAge);
				break;
			case 'KIDS':
				for (i = 0; i < pQA.preQuote.Kids; i++) {
					insuredDetailPush(1, 'KID', "KID" + (i + 1), pQA.kidsObject[i].age);
				}
				break;
			default:
				return;
		}
	}

	/* End of identifying relationwithproposer */


	/* To Submit Form Data */
	// This function gets call when record doesnt exist in DB or user clicks no on duplicate check popup
	function submitFormData(event, actText) {
		finalSubmitData = {
			"ProposerDetail": {
				"ProductCategory": pQA.preQuote.ProductCategory, // ProductCategroy user selected from first dropdown
				"Age": pQA.preQuote.Age, // Age of the proposer
				"MobileNo": pQA.preQuote.MobileNo, // Mobile number entered by user
				"EmailId": pQA.preQuote.EmailId, // EmailID entered by user
				"IMDSource": sourceImd, // Read source from the URL
				"IMDCode": IMDCodeURL, // Read Imd Code from the url
				"FirstName": fname,
				"LastName": lname,
				"ThirdPartyURL": window.location.href, // Current url in browesers address bas

				"Branch": ($routeParams.branch) ? $routeParams.branch : "",
				"Keyword": ($routeParams.portalLeadId) ? leadData.Keyword : $routeParams.keyword,
				"AdGroup": ($routeParams.portalLeadId) ? leadData.Adgroup : $routeParams.adgroup,
				"Location": "",
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
				"ThirdPartyURL": window.location.href,
				"City": ($routeParams.city) ? $routeParams.city : "",
				"Income": ($routeParams.income) ? $routeParams.income : "",
				"OccupationType": ($routeParams.occupation) ? $routeParams.occupation : "",
				"lemniskId": sessionStorage.getItem('lemniskIdVal'),
				//"Gender":(gender == 0 || gender == 1) ? gender : "",
				"ReferenceID": ($routeParams.urlKey) ? $routeParams.urlKey : "",
				"WhatsappConsent": pQA.whatsappconcent,
			},
			"InsuredDetail": [] // Insured members array
		}

		if ($routeParams.imdcode == '2100019') {
			finalSubmitData.ProposerDetail.CustID = $rootScope.decrypt($routeParams.custID)
		}

		/*  If coverfor is self, self and spouse, self spouse kids or Self Kids that time we have to push self as insuredDetail  */

		if (pQA.preQuote.Cover == "S" || pQA.preQuote.Cover == "SP" || pQA.preQuote.Cover == "SPK" || pQA.preQuote.Cover == "SK") {
			insuredDetailPush(1, 'SELF', 'S', pQA.preQuote.Age);
		}

		/*  If coverfor is self and spouse, self spouse kids or Spouse Kids that time we have to push SPOUSE as insuredDetail  */

		if (pQA.preQuote.Cover == "SP" || pQA.preQuote.Cover == "SPK" || pQA.preQuote.Cover == "PK") {
			insuredDetailPush(0, 'SPOUSE', 'SPO', pQA.preQuote.spouseAge);
		}

		/*  If coverfor is self Kids, self spouse kids or Spouse Kids that time we have to push KIDS as insuredDetail  */

		if (pQA.preQuote.Cover == "SK" || pQA.preQuote.Cover == "SPK" || pQA.preQuote.Cover == "PK") {

			// For loop used as max kids can be 4
			for (i = 0; i < pQA.preQuote.Kids; i++) {
				insuredDetailPush(1, 'KID', "KID" + (i + 1), pQA.kidsObject[i].age);
			}
		}

		/* If coverfor is different family construct or activ care then we have to push all members into insured Details whickever user selected */

		if (pQA.preQuote.Cover == "D" || pQA.preQuote.Cover == "SC") {
			angular.forEach(pQA.selectedMembers, function (v, i) {
				if (pQA.selectedMembers[i]) {
					pushInsuredDetails(i.toUpperCase()); // The function where we are passing type of the member
				}
			});
		}

		/*  After forming object with all required data we pass that object to PreQuote Service. */

		var lemeiskData = angular.copy(finalSubmitData)
		delete lemeiskData.ProposerDetail.MobileNo
		delete lemeiskData.ProposerDetail.EmailId
		delete lemeiskData.ProposerDetail.DOB
		$rootScope.leminiskObj = lemeiskData
		$rootScope.lemniskCodeExcute($location.$$path)


		aS.postData(ABHI_CONFIG.apiUrl + "GEN/PreQuote", finalSubmitData, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					/* 
						If success 
						then we store usertoekn and reference number received from service into sessionStorage
						and then make leadInsertCall to get leadId.
						After than we redirect user to reco page.
					*/

					sessionStorage.setItem('newJourney', true);
					sessionStorage.setItem('imdCode', IMDCodeURL)
					sessionStorage.setItem('imdSource', sourceImd)
					sessionStorage.setItem('ut', data.ResponseData.ut);
					sessionStorage.setItem('rid', data.ResponseData.ReferenceNumber);
					sessionStorage.setItem('expireTime', data.ResponseData.OTPExpiresAT);
					pQA.otpexpireTime = data.ResponseData.OTPExpiresAT;
					pQA.isVerified = data.ResponseData.OTPVerified;
					//pQA.otpexpireTime = pQA.otpexpireTime != null ? pQA.otpexpireTime.substring(pQA.otpexpireTime.indexOf(' ') + 1) : pQA.otpexpireTime;
					//pQA.otpexpireTime = pQA.otpexpireTime != null ? pQA.otpexpireTime.substr(0, pQA.otpexpireTime.lastIndexOf(":")) : pQA.otpexpireTime;
					if (pQA.otpexpireTime != null) {
						var date = new Date()
						var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 )).toISOString().split("T")[0];
						var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
						var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
						var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
					    //var ampm = hours >= 12 ? 'PM' : 'AM';
						// hours = hours % 12;
						// hours = hours ? hours : 12; // the hour '0' should be '12'
						// minutes = minutes < 10 ? '0' + minutes : minutes;
						var strTime = dateString + " " +hours + ':' + minutes + ':' + seconds;
						//var timedifference = strTime - pQA.otpexpireTime;
						//var timedifference = diff(strTime, pQA.otpexpireTime);
					}
					if (strTime < pQA.otpexpireTime && pQA.isVerified == 'Y') {
						$('#pan-card-modal').modal('hide');
						$location.url('reco');
					} else {
						if (!validateOTP) {
							pQA.triggerOTP('send');
						}
					}

					//leadInsertCall()
					//$location.url('reco');
				} else {
					/* 
						If failure then,
						we show alert to user of failure
					*/
					$rootScope.alertConfiguration('E', data.ResponseMessage);
					event.target.disabled = false;
					event.target.innerHTML = actText;
				}
			}, function (err) {
				event.target.disabled = false;
				event.target.innerHTML = actText;
			});
	}

	/* End of submitting Form data */

	function diff(start, end) {
		start = start.split(":");
		end = end.split(":");
		var startDate = new Date(0, 0, 0, start[0], start[1], 0);
		var endDate = new Date(0, 0, 0, end[0], end[1], 0);
		var diff = endDate.getTime() - startDate.getTime();
		var hours = Math.floor(diff / 1000 / 60 / 60);
		diff -= hours * 1000 * 60 * 60;
		var minutes = Math.floor(diff / 1000 / 60);

		return (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
	}

	/* trigger otp function */
	pQA.triggerOTP = function (param) {

		aS.postData(ABHI_CONFIG.apiUrl + "GEN/RequestOTP", {
			"ReferenceNumber": sessionStorage.getItem('rid')
		}, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (response) {
				if (response.ResponseCode == 1) {
					pQA.otpResponse = response
					console.log(response)
					$('#pan-card-modal').modal({ backdrop: 'static', keyboard: false });
					if (param == 'resend') {
						$rootScope.alertConfiguration('E', "OTP resend successfully", "OTP error");
						pQA.numCount = 90;
						var intervalCount = $interval(function () {
							--pQA.numCount;
							pQA.hideTimer = false;
						}, 1000);
						$timeout(function () {
							$interval.cancel(intervalCount);
							pQA.hideTimer = true;
							i++;
						}, 90000);
					}
					if (param == 'send') {
						pQA.numCount = 90;
						var intervalCount = $interval(function () {
							--pQA.numCount;
							pQA.hideTimer = false;
						}, 1000);
						$timeout(function () {
							$interval.cancel(intervalCount);
							pQA.hideTimer = true;
							i++;
						}, 90000);
					}
					//$rootScope.$apply();
					//return false;
				}



			})

	}
	/* trigger OTP function ends */


	/*verify OTP Value */
	pQA.submitOTPVal = function () {

		if (angular.isUndefined(pQA.otpVal) || pQA.otpVal == '') {
			$rootScope.alertConfiguration('E', "Please enter OTP", "OTP error");
		}
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/VerifyOTP", {
			"ReferenceNumber": sessionStorage.getItem('rid'),
			"OTP": pQA.otpVal
		}, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (response) {

				if (response.ResponseCode == 1) {
					if(aS.checksome(pQA.otpVal) == response.ResponseData.Token){
						$('#pan-card-modal').modal('hide');
						$location.url('reco');
					}
					else{
					$rootScope.alertConfiguration('E', "Incorrect OTP", "OTP error");
					}
				}
				if (response.ResponseCode == 0 && response.ResponseMessage == 'Entered OTP is incorrect') {
					$rootScope.alertConfiguration('E', "Incorrect OTP", "OTP error");
				}

			})
	}
	/* submit OTP Value Ends */


	/* To check products */

	pQA.checkProducts = function (event) {

		/* Email Field validation */

		if (angular.isUndefined(pQA.preQuote.EmailId) || pQA.preQuote.EmailId == "" || !(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(pQA.preQuote.EmailId))) {
			$rootScope.alertConfiguration('E', "Please enter valid email", "self_email_alert");
			return false;
		}

		/* End of email field validation */


		/* To change text of Check Products button to Please wait .... */

		var actText = angular.copy(event.target.innerHTML);
		/*event.target.disabled = true;
		event.target.textContent = "Please wait.....";*/

		/* End of changing text of check products button to please wait */

		var lemniskObj = {
			"email": pQA.preQuote.EmailId
		};
		$rootScope.lemniskTrack("", "", lemniskObj);

		/* 
			Pre Quote Data storing in sessionStorage
			We are storing following data in sessionstorage so that when user goes from pre quote page to some another page and then
			from there he visits pre quote page again then his/her pre quota data shoud be pre populated

		*/

		var preQuoteData = {
			'selectCategory': pQA.selectCategory,
			'coverTo': pQA.coverTo,
			'prequote': pQA.preQuote,
			'kidsObject': pQA.kidsObject,
			'selectedMembers': pQA.selectedMembers
		}
		sessionStorage.removeItem('prequoteData');
		sessionStorage.setItem('prequoteData', JSON.stringify(preQuoteData));

		/* End of storing pre quote data in sessionStorage */


		/* 
			To call duplicatecheck service so that we can check whether emailid and mobile no
			which user entered is present in database of not.

		*/
		sessionStorage.setItem('mobNo', pQA.preQuote.MobileNo);

		aS.postData(ABHI_CONFIG.apiUrl + "GEN/DuplicateCheck", {
			"EmailID": pQA.preQuote.EmailId, // Emild ID entered by user
			"MobileNo": pQA.preQuote.MobileNo, // Mobile no entered by user
			"ProductCategory": pQA.preQuote.ProductCategory, // Product Category selected by user
			"Age": pQA.preQuote.Age, // Age of self
			"IMDSource": (sessionStorage.getItem('imdSource')) ? sessionStorage.getItem('imdSource') : "Customer Portal", // Read source from the URL
			"IMDCode": (sessionStorage.getItem('imdCode')) ? sessionStorage.getItem('imdCode') : "5100003", // Read Imd Code from the url
			//"IMDSource":sourceImd, // Read source from the URL
			//	"IMDCode": IMDCodeURL, // Read Imd Code from the url
			"ThirdPartyURL": window.location.href, // Storing current URL which is present in address bar
		}, true, {
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
							"hideCloseBtn": true,
							"gtagPostiveFunction": "click-button, pre-quote ,pre-quote_data-save[Yes]",
							"gtagCrossFunction": "click-button, pre-quote ,pre-quote_data-save[X]",
							"gtagNegativeFunction": "click-button, pre-quote ,pre-quote_data-save[No]",
							"showAlertModal": true,
							"positiveFunction": function () {
								/* 
									If user clicks yes then we first hit service to update IMD, where we sent reference no
									which we receive from duplicate check service and  IMDCode : 5100003 and IMDSource : Customer Portal
								*/
								imdCode = (sessionStorage.getItem('newJourney')) ? "XX" : "5100003";
								imdSource = (sessionStorage.getItem('newJourney')) ? "XX" : "Customer Portal";

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
											}, false, {
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
															case "AC":
																/* If product code is AC then redirect to 'activ-care-quote' page and store 'pName' value as Activ Care inside sessioStorage*/
																sessionStorage.setItem('pName', "Activ Care");
																$location.url('activ-care-quote');
																break;
															case "FIT":
															/* If product code is AC then redirect to 'activ-care-quote' page and store 'pName' value as Activ Care inside sessioStorage*/
															sessionStorage.setItem('pName', "Activ Fit");
															$location.url('fit-quote');
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

											/* End of service to receive crm lead id associated with existing lead id */

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
										event.target.disabled = false;
										event.target.innerHTML = actText;
									})
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
				event.target.disabled = false;
				event.target.innerHTML = actText;
			});
	}

	/* End of checking products */

}]);

/*	
	End of controller
	Name: Pre Quote Controller
	Author: Pankaj Patil
	Date: 19-06-2018
*/


/**
 * Mail autocomplete
 * Author: nuintun
 * $(selector).mailtip({
 *   mails: [], // mails
 *   onselected： function(mail){}, // callback on selected
 *   width: 'auto', // popup tip's width
 *   offsetTop: -1, // offset top relative default position
 *   offsetLeft: 0, // offset left relative default position
 *   zIndex: 10 // popup tip's z-index
 * });
 */

'use strict';

(function ($) {
	// invalid email char test regexp
	var INVALIDEMAILRE = /[^\u9fa5_a-zA-Z0-9]/;
	// is support oninput event
	var hasInputEvent = 'oninput' in document.createElement('input');
	// is ie 9
	var ISIE9 = /MSIE 9.0/i.test(window.navigator.appVersion || window.navigator.userAgent);

	/**
	 * is a number
	 * @param value
	 * @returns {boolean}
	 */
	function isNumber(value) {
		return typeof value === 'number' && isFinite(value);
	}

	/**
	 * create popup tip
	 * @param input
	 * @param config
	 * @returns {*}
	 */
	function createTip(input, config) {
		var tip = null;

		// only create tip and binding event once
		if (!input.data('data-mailtip')) {
			var wrap = input.parent();

			// set parent node position
			!/absolute|relative/i.test(wrap.css('position')) && wrap.css('position', 'relative');
			// off input autocomplete
			input.attr('autocomplete', 'off');

			var offset = input.offset();
			var wrapOffset = wrap.offset();

			tip = $('<ul class="mailtip" style="display: none; float: right; '
				+ 'padding: 0; z-index: '
				+ config.zIndex + '"></ul>');

			// insert tip after input
			input.after(tip);

			// set tip style
			tip.css({
				top: offset.top - wrapOffset.top + input.outerHeight() + config.offsetTop,
				left: offset.left - wrapOffset.left + config.offsetLeft,
				width: config.width === 'input' ? input.outerWidth() - tip.outerWidth() + tip.width() : config.width
			});

			// when width is auto, set min width equal input width
			if (config.width === 'auto') {
				tip.css('min-width', input.outerWidth() - tip.outerWidth() + tip.width());
			}

			// binding event
			tip.on('mouseenter mouseleave click', 'li', function (e) {
				var selected = $(this);

				switch (e.type) {
					case 'mouseenter':
						selected.addClass('hover');
						break;
					case 'click':
						var mail = selected.attr('title');

						input.val(mail).focus();
						config.onselected.call(input[0], mail);
						break;
					case 'mouseleave':
						selected.removeClass('hover');
						break;
					default:
						break;
				}
			});

			// when on click if the target element not input, hide tip
			$(document).on('click', function (e) {
				if (e.target === input[0]) return;

				tip.hide();
			});

			input.data('data-mailtip', tip);
		}

		return tip || input.data('data-mailtip');
	}

	/**
	 * create mail list item
	 * @param value
	 * @param mails
	 * @returns {*}
	 */
	function createItems(value, mails) {
		var mail;
		var domain;
		var items = '';
		var atIndex = value.indexOf('@');
		var hasAt = atIndex !== -1;

		if (hasAt) {
			domain = value.substring(atIndex + 1);
			value = value.substring(0, atIndex);
		}

		for (var i = 0, len = mails.length; i < len; i++) {
			mail = mails[i];

			if (hasAt && mail.indexOf(domain) !== 0) continue;

			items += '<li title="' + value + '@' + mail
				+ '" style="margin: 0; padding: 0; float: none;"><p>'
				+ value + '@' + mail + '</p></li>';
		}

		// active first item
		return items.replace('<li', '<li class="active"');
	}

	/**
	 * change list active state
	 * @param tip
	 * @param up
	 */
	function changeActive(tip, up) {
		var itemActive = tip.find('li.active');

		if (up) {
			var itemPrev = itemActive.prev();

			itemPrev = itemPrev.length ? itemPrev : tip.find('li:last');
			itemActive.removeClass('active');
			itemPrev.addClass('active');
		} else {
			var itemNext = itemActive.next();

			itemNext = itemNext.length ? itemNext : tip.find('li:first');
			itemActive.removeClass('active');
			itemNext.addClass('active');
		}
	}

	/**
	 * toggle tip
	 * @param tip
	 * @param value
	 * @param mails
	 */
	function toggleTip(tip, value, mails) {
		var atIndex = value.indexOf('@');
		var newValue = value + '@'

		// if user enter @then only show the email ids hints

		if (value.indexOf('@') != -1) {

			// if input text is empty or has invalid char or begin with @ or more than two @, hide tip
			if (!value
				|| atIndex === 0
				|| atIndex !== value.lastIndexOf('@')
			) {
				tip.hide();
			} else {
				var items = createItems(value, mails);

				// if has match mails show tip
				if (items) {
					tip.html(items).show();
				} else {
					tip.hide();
				}
			}
		} else {
			tip.hide();
		}
	}

	/**
	 * exports
	 * @param config
	 * @returns {*}
	 */
	$.fn.mailtip = function (config) {
		var defaults = {
			mails: [
				'gmail.com', 'rediffmail.com',
				'hotmail.com', 'yahoo.com', 'yahoo.co.in'
			],
			onselected: $.noop,
			width: 'auto',
			offsetTop: -1,
			offsetLeft: 0,
			zIndex: 10
		};

		config = $.extend({}, defaults, config);
		config.zIndex = isNumber(config.zIndex) ? config.zIndex : defaults.zIndex;
		config.offsetTop = isNumber(config.offsetTop) ? config.offsetTop : defaults.offsetTop;
		config.offsetLeft = isNumber(config.offsetLeft) ? config.offsetLeft : defaults.offsetLeft;
		config.onselected = $.isFunction(config.onselected) ? config.onselected : defaults.onselected;
		config.width = config.width === 'input' || isNumber(config.width) ? config.width : defaults.width;

		return this.each(function () {
			// input
			var input = $(this);
			// tip
			var tip = createTip(input, config);

			// binding key down event
			input.on('keydown', function (e) {
				// if tip is visible do nothing
				if (tip.css('display') === 'none') return;

				switch (e.keyCode) {
					// backspace
					case 8:
						// shit! ie9 input event has a bug, backspace do not trigger input event
						if (ISIE9) {
							input.trigger('input');
						}
						break;
					// tab
					case 9:
						tip.hide();
						break;
					// up
					case 38:
						e.preventDefault();
						changeActive(tip, true);
						break;
					// down
					case 40:
						e.preventDefault();
						changeActive(tip);
						break;
					// enter
					case 13:
						e.preventDefault();

						var mail = tip.find('li.active').attr('title');

						input.val(mail).focus();
						tip.hide();
						config.onselected.call(this, mail);
						break;
					default:
						break;
				}
			});

			// binding input or propertychange event
			if (hasInputEvent) {
				input.on('input', function () {
					toggleTip(tip, this.value, config.mails);
				});
			} else {
				input.on('propertychange', function (e) {
					if (e.originalEvent.propertyName === 'value') {
						toggleTip(tip, this.value, config.mails);
					}
				});
			}

			// shit! ie9 input event has a bug, backspace do not trigger input event
			if (ISIE9) {
				input.on('keyup', function (e) {
					if (e.keyCode === 8) {
						toggleTip(tip, this.value, config.mails);
					}
				});
			}
		});
	};
}(jQuery));
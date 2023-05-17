/*
		
	PA Quote Controller
	Author: Pankaj Patil
	Date: 28-06-2018

*/

var pAApp = angular.module("pAQuoteApp", []);

pAApp.controller("pAQuoteCtrl", ['$rootScope', 'appService', 'ABHI_CONFIG', '$location', '$timeout', 'productValidationService', '$filter', function ($rootScope, appService, ABHI_CONFIG, $location, $timeout, productValidationService, $filter) {

	/* Variable Inilization */

	var pA = this;
	var aS = appService;
	var selfData;
	pA.otherMember = [];
	pA.productType = "PA";
	pA.hideSubmitButton = true;
	pA.planName = "RFB";
	pA.initSlider = false;
	var pACalculatePremiumParams = {
		"ReferenceNumber": sessionStorage.getItem('rid'),
		"PA": {
			"PAPremiumList": []
		},
		"Savings": true
	}

	/* End of variable inilization */


	/* To Load Slick Slider */

	function loadOwlCarousel() {
		pA.initSlider = true;
		$timeout(function () {
			$("#pa-sum-isnured-slider").owlCarousel({
				items: 4,
				navigation: true,
				navigationText: ["", ""],
			});
			console.log(pA.quoteDetails.PAQuote.PAQuoteDetails,'owl called');
		}, 300);
	}

	/* Ending of loading slick slider */


	/* To trigger pixel code */

	var pixelCode = "<img src='http://www.intellectads.co.in/track/conversion.asp?cid=1150&conversionType=1&key=" + sessionStorage.getItem('leadId') + "&opt1=&opt2=&opt3=' height='1' width='1' />";
	pixelCode += "<img src='//ad.admitad.com/r?campaign_code=f01707dad6&action_code=1&payment_type=lead&response_type=img&uid=&tariff_code=1&order_id=" + sessionStorage.getItem('leadId') + "&position_id=&currency_code=&position_count=&price=&quantity=&product_id=' width='1' height='1' alt=''>";
	pixelCode += "<iframe src='https://adboulevard.go2cloud.org/aff_l?offer_id=278&adv_sub=" + sessionStorage.getItem('leadId') + "' scrolling='no' frameborder='0' width='1' height='1'></iframe>";
	pixelCode += "<img src='https://adboulevard.go2cloud.org/aff_l?offer_id=278&adv_sub=" + sessionStorage.getItem('leadId') + "' width='1' height='1' />";
	pixelCode += "<iframe src='https://adclickzone.go2cloud.org/aff_l?offer_id=496&adv_sub=" + sessionStorage.getItem('leadId') + "' scrolling='no' frameborder='0' width='1' height='1'></iframe>";
	pixelCode += "<iframe src='https://apoxymedia.net/p.ashx?o=74&e=8&t=" + sessionStorage.getItem('leadId') + "' height='1' width='1' frameborder='0'></iframe>";
	pixelCode += "<img src='https://opicle.go2cloud.org/aff_l?offer_id=5694&adv_sub=" + sessionStorage.getItem('leadId') + "' width='1' height='1' />";
	$(".pa-quote-section").append(pixelCode);

	/* End of triggering pixel code */


	/* To Fetch PA Quote Details */

	pA.fetchQuoteDetails = function () {
        var reqData = $rootScope.encrypt({
            "ReferenceNumber": sessionStorage.getItem('rid')
        });  
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetQuoteDetails", {
			"_data": reqData
		}, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				aS.triggerSokrati(); /* Triggering Sokrati */
				var data = JSON.parse($rootScope.decrypt(data._resp))
				if (data.ResponseCode == 1) {
					pA.quoteDetails = data.ResponseData;
					$rootScope.leminiskObj = data.ResponseData;
					$rootScope.lemniskCodeExcute();
					pA.tenureSelect = pA.quoteDetails.PAQuote.PAQuoteDetails[0].TENURE;
					pA.currentPlan = "pa1";
					pACalculatePremiumParams.PA.PAPremiumList = pA.quoteDetails.PAQuote.PAQuoteDetails;
					pA.quoteDetails.PAQuote.PAQuoteDetails[0].plan = '1';
					loadOwlCarousel();
					pA.calculatePremium();
					for (var i = 0; i < pA.quoteDetails.PAQuote.PAQuoteDetails.length; i++) {
						if (pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer == "SELF") {
							selfData = pA.quoteDetails.PAQuote.PAQuoteDetails[i];
							break;
						}
					}
					for (i = 0; i < pA.quoteDetails.PAQuote.PAQuoteDetails.length; i++) {
						pA.updateFamily(pA.quoteDetails.PAQuote.PAQuoteDetails[i], pA.quoteDetails.PAQuote.PAQuoteDetails[0].suminsured);
						if (pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer != 'KID' && pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer != 'SELF') {
							pA.otherMember = [];
							for (j = 0; j < pA.sumAmounts.length; j++) {
								if (parseInt(selfData.suminsured) >= parseInt(pA.sumAmounts[j].amount)) {
									pA.otherMember.push(pA.sumAmounts[j]);
								}

							}
						}
					}
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": "Some error ocurred.",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true
					}
				}
			}, function (err) {

			});
	}

	pA.fetchQuoteDetails();

	/* End of fetching quote details */


	/* To Fetch Sum Insured Data */

	aS.getData("assets/data/sum-insured.json", "", false, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(function (data) {
			if (data.ResponseCode == 1) {
				pA.sumAmounts = JSON.parse(JSON.stringify(data.ResponseData));
				pA.kidSumAmount = [];
				pA.sumAmounts.forEach(function (e) {
					if (e.amount <= 1500000) {
						pA.kidSumAmount.push(e);
					}
				});
				pA.sumAmounts.forEach(function (e) {
					if (e.amount <= 2500000) {
						pA.otherMember.push(e);
					}
				});

				// loadOwlCarousel();

			}
		}, function (err) {

		})

	/* End of fetching sum insured data */


	/* To delete particular member */

	pA.pADeleteMember = function (member, ind) {
		$rootScope.callGtag('click-icon-x', 'quote', 'pa-quote_plan[' + pA.quoteDetails.PAQuote.PAQuoteDetails[0].plan + ']_' + member.RelationType + '_delete-member');
		if (member.RelationWithProposer == "SELF") {
			$rootScope.alertConfiguration('E', "Self is Mandatory.", "self_mandatory_alert");
			return false;
		}
		if (pA.membersDetails.length == 2) {
			$rootScope.alertConfiguration('E', "You cannot delete this member.", "delete_member_alert");
			return false;
		}
		for (var i = 0; i < pA.membersDetails.length; i++) {
			if (member.RelationType == pA.membersDetails[i].RelationType) {
				pA.deleteMember(pA.membersDetails[i], ind);
				break;
			}
		}
	}

	/* End of deleting particular member */


	/* Update soft details data */

	pA.updateSoftDetails = function (type, member, index) {
		if (type == "DeleteMember" && member.RelationWithProposer != 'KID') {
			pA.initSlider = false;
			//pA.quoteDetails.PAQuote.PAQuoteDetails.splice(index,1);
			// var cnt = 1;
			// for(var i = 0; i<pA.quoteDetails.PAQuote.PAQuoteDetails.length;i++){
			// 	if(pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer == "KID"){
			// 		pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationType = "KID"+cnt;
			// 		cnt = cnt + 1;
			// 	}
			// }
			for (var i = 0; i < pA.quoteDetails.PAQuote.PAQuoteDetails.length; i++) {
				if (member.RelationType == pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationType) {
					pA.quoteDetails.PAQuote.PAQuoteDetails.splice(i, 1);
				}
			}
			pACalculatePremiumParams.PA.PAPremiumList = pA.quoteDetails.PAQuote.PAQuoteDetails;
			pA.calculatePremium();
			$timeout(function () {
				loadOwlCarousel();
			}, 300);
		} else if (type == 'DeleteMember' && member.RelationWithProposer == 'KID') {
			pA.initSlider = false;
			pA.fetchQuoteDetails();
		} else if (type == "UpdateMember") {
			pA.quoteDetails.PAQuote.PAQuoteDetails[index].AGE = member.Age;
			pA.calculatePremium();
		} else if (type == "AddMember") {
			pA.initSlider = false;
			var newMember = {
				"plan": selfData.plan,
				"TENURE": selfData.TENURE,
				"suminsured": (member.RelationWithProposer == "KID") ? "1500000" : "1500000",
				"AGE": member.Age,
				"BB_suminsured": "0",
				"BBB_suminsured": "0",
				"risk": "1",
				"TTD": "N",
				"TTD_Suminsured": "0",
				"BBB": "N",
				"CB": "N",
				"BB": "N",
				"AS": "N",
				"EMIP": "N",
				"EMIP_Suminsured": "0",
				"LP": "",
				"LP_Suminsured": "0",
				"WWEAS": "N",
				"HCIP": "N",
				"HCNIP": "N",
				"HCB": "N",
				"PDL": "0",
				"no_of_days": "0",
				"WELLNESS_COACH": "",
				"RelationType": member.RelationType,
				"RelationWithProposer": member.RelationWithProposer,
				"AnnualIncome": "0",
				"EarningNonEarning": ""
			}
			pA.quoteDetails.PAQuote.PAQuoteDetails.push(newMember);
			pA.calculatePremium();
			for (i = 0; i < pA.quoteDetails.PAQuote.PAQuoteDetails.length; i++) {
				pA.updateFamily(pA.quoteDetails.PAQuote.PAQuoteDetails[i], pA.quoteDetails.PAQuote.PAQuoteDetails[0].suminsured);
				if (pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer != 'KID' && pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer != 'SELF') {
					pA.otherMember = [];
					for (j = 0; j < pA.sumAmounts.length; j++) {
						if (parseInt(pA.quoteDetails.PAQuote.PAQuoteDetails[0].suminsured) >= parseInt(pA.sumAmounts[j].amount)) {
							pA.otherMember.push(pA.sumAmounts[j]);
							JSON.parse(JSON.stringify(pA.otherMember));
						}
					}
				}

			}
			$timeout(function () {
				loadOwlCarousel();
			}, 300);
		}
	}

	/* End of updating soft details data */


	/* To manage kids sum insured */

	function manageKidsSumInsured(sum, v) {
		if (parseInt(sum) < 1500000) {
			v.suminsured = sum;
		} else if (parseInt(sum) <= 2000000) {
			v.suminsured = 1000000;
		}
		else if (parseInt(sum) <= 3000000) {
			v.suminsured = 1500000;
		}
	}

	/* End of managing kids sum insured */


	/* To display popup whether person is earning or not */

	function isEarningPerson(member, sum, index) {
		$rootScope.alertData = {
			"modalClass": "regular-alert",
			"modalHeader": "Confirm",
			"modalBodyText": "<p>Is " + member + " an earning person?</p><p>If yes then please enter annual Income.</p>",
			"showCancelBtn": true,
			"modalSuccessText": "Yes",
			"modalCancelText": "No",
			"showAlertModal": true,
			"hideCloseBtn": true,
			"positiveFunction": function () {
				$timeout(function () {


					pA.quoteDetails.PAQuote.PAQuoteDetails[index].showAnnualIncome = true;
					pA.quoteDetails.PAQuote.PAQuoteDetails[index].EarningNonEarning = "Earning";

				}, 200);
			},
			"negativeFunction": function () {
				pA.quoteDetails.PAQuote.PAQuoteDetails[index].EarningNonEarning = "Non Earning";
				if (selfData.suminsured > 3000000) {
					pA.quoteDetails.PAQuote.PAQuoteDetails[index].suminsured = 1500000;
					pA.updateFamily(pA.quoteDetails.PAQuote.PAQuoteDetails[index], selfData.suminsured);
				} else {
					pA.quoteDetails.PAQuote.PAQuoteDetails[index].suminsured = 1500000;
				}
				pA.updateFamily(pA.quoteDetails.PAQuote.PAQuoteDetails[i], selfData.suminsured);

				pA.calculatePremium();
			}
		}
	}

	/* End of displaying popup whether person is earning or not */
	pA.updateFamily = function (insuredMember, sum) {
		// if((insuredMember.RelationWithProposer  == "SPOUSE"||insuredMember.RelationWithProposer == "FATHER"||insuredMember.RelationWithProposer == "MOTHER"||insuredMember.RelationWithProposer == "FATHER-IN_LAW"||insuredMember.RelationWithProposer == "MOTHER-IN_LAW") && (insuredMember.suminsured > parseInt(sum))){
		//  insuredMember.suminsured = sum;
		// }
		for (i = 0; i < pA.quoteDetails.PAQuote.PAQuoteDetails.length; i++) {
			if (pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer != 'KID' && pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer != 'SELF') {
				pA.otherMember = [];
				for (j = 0; j < pA.sumAmounts.length; j++) {
					if (parseInt(sum) >= parseInt(pA.sumAmounts[j].amount)) {
						pA.otherMember.push(pA.sumAmounts[j]);
						JSON.parse(JSON.stringify(pA.otherMember));
					}
				}
			}
		}
		for (var i = 0; i < pA.quoteDetails.PAQuote.PAQuoteDetails.length; i++) {
			if (pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer != "SELF" && pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer != "KID") {
				if (sum <= 1500000) {
					pA.quoteDetails.PAQuote.PAQuoteDetails[i].suminsured = 500000;
				} else if (sum < 3000000) {
					pA.quoteDetails.PAQuote.PAQuoteDetails[i].suminsured = 1000000;
				}
				else {
					pA.otherMember.forEach(function (e) {
						if (parseInt(e.amount) <= parseInt(sum / 2)) {
							pA.quoteDetails.PAQuote.PAQuoteDetails[i].suminsured = e.amount;
							// pA.quoteDetails.PAQuote.PAQuoteDetails[i].showAnnualIncome = false;
						} else if (sum >= 10000000) {
							pA.quoteDetails.PAQuote.PAQuoteDetails[i].suminsured = 3000000;
						}
					});

				}
			}
		}

	}
	/* Sum insured dropdown change event */
	pA.calculateSumInsured = function (member, sum, index) {
		var memberObj;
		if (member.toLowerCase() == "self") {
			pA.updateFamily(pA.quoteDetails.PAQuote.PAQuoteDetails[index], sum);
			if (sum < 3000001 || pA.quoteDetails.PAQuote.PAQuoteDetails[index].AnnualIncome != 0) {
				angular.forEach(pA.quoteDetails.PAQuote.PAQuoteDetails, function (v, i) {
					if (v.RelationWithProposer == "KID" && sum <= 3000001) {
						manageKidsSumInsured(sum, v);
					} else if (pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer == "SELF") {
						pA.quoteDetails.PAQuote.PAQuoteDetails[i].suminsured = sum;
					}
					if (v.RelationWithProposer == member) {
						memberObj = v;
					}
				})
				if (pA.quoteDetails.PAQuote.PAQuoteDetails[index].AnnualIncome != 0) {
					//$rootScope.alertConfiguration('E',"Sun insured is 12 times the annual income " , "");
					pA.changeAnnualIncome(memberObj, pA.quoteDetails.PAQuote.PAQuoteDetails[index].AnnualIncome);
					/*$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Confirm",
						"modalBodyText": "Since Sum Insured is 12 time the annual ",
						"showCancelBtn": true,
						"modalSuccessText" : "Yes",
						"modalCancelText" : "No",
						"showAlertModal": true,
						"hideCloseBtn": true,
						"positiveFunction" : function(){
							
						},
						"negativeFunction" : function(){

						},
					}*/
				}
				pA.updateFamily(pA.quoteDetails.PAQuote.PAQuoteDetails[i], sum);

			} else {

				angular.forEach(pA.quoteDetails.PAQuote.PAQuoteDetails, function (v, i) {
					if (v.RelationWithProposer == "SELF") {
						pA.otherSI = v.suminsured / 2;
					}
				});
				if (pA.otherSI <= sum || pA.otherSI > 3000000) {
					isEarningPerson(member, sum, index);
				}

			}
			$timeout(function () {
				pA.calculatePremium();
			}, 500);
		} else {
			var sumCriteria;
			selfData.suminsured > 3000000 ? sumCriteria = 3000000 : sumCriteria = selfData.suminsured;
			// if(parseInt(sum) > parseInt(sumCriteria)){
			// 	isEarningPerson(member,sum,index);
			// }
			angular.forEach(pA.quoteDetails.PAQuote.PAQuoteDetails, function (v, i) {
				if (v.RelationWithProposer == "SELF") {
					pA.otherSI = v.suminsured / 2;
				}
			});
			if (pA.otherSI <= sum || pA.otherSI > 3000000) {
				isEarningPerson(member, sum, index);
			}
			else {
				$timeout(function () {
					pA.calculatePremium();
				}, 500)
			}
		}
	}

	/* End of sum insured dropdown change event */


	/* Annual Income change event */

	pA.changeAnnualIncome = function (insuredMember, prevIncome) {
		var chkAnnualIncome = 24999;
		if (pA.currentPlan == "pa4") {
			chkAnnualIncome = 42000;
		} else if (pA.currentPlan == "pa5") {
			chkAnnualIncome = 84000;
		}
		pA.AnnualIncomeSelected = insuredMember.AnnualIncome;
		if (insuredMember.AnnualIncome > chkAnnualIncome) {
			var isProceed = true;
			var maxInsured;
			angular.forEach(pA.sumAmounts, function (v, i) {
				if (isProceed && v[pA.currentPlan]) {
					if (v.amount > (insuredMember.AnnualIncome * 12)) {
						isProceed = false;
					} else {
						maxInsured = i;
					}
				}
			});
			if (insuredMember.suminsured > (insuredMember.AnnualIncome * 12)) {

				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "Sum Insured eligibility is 12 times the Annual Income (" + $filter('INR')(pA.sumAmounts[maxInsured].amount) + ").",
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"positiveFunction": function () {
						insuredMember.suminsured = pA.sumAmounts[maxInsured].amount;
						if (insuredMember.RelationWithProposer == "SELF") {
							pA.calculateSumInsured(insuredMember.RelationWithProposer, insuredMember.suminsured, insuredMember.objIndex);
						}
					}
				}
			} else if (insuredMember.suminsured != pA.sumAmounts[maxInsured].amount && insuredMember.RelationWithProposer == 'SELF') {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "You are eligible for Sum Insured up to ₹​" + $filter('INR')(pA.sumAmounts[maxInsured].amount) + ". Do you wish to continue?",
					"showCancelBtn": true,
					"modalSuccessText": "Yes",
					"showAlertModal": true,
					"modalCancelText": "No",
					"positiveFunction": function () {
						insuredMember.suminsured = pA.sumAmounts[maxInsured].amount;
						for (i = 0; i < pA.quoteDetails.PAQuote.PAQuoteDetails.length; i++) {
							pA.updateFamily(pA.quoteDetails.PAQuote.PAQuoteDetails[i], insuredMember.suminsured);
							if (pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer != 'KID' && pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer != 'SELF' && pA.quoteDetails.PAQuote.PAQuoteDetails[i].AnnualIncome != 100000) {
								pA.otherMember = [];
								for (j = 0; j < pA.sumAmounts.length; j++) {
									if (parseInt(insuredMember.suminsured) >= parseInt(pA.sumAmounts[j].amount)) {
										pA.otherMember.push(pA.sumAmounts[j]);
									}
								}
							}

						}
						pA.calculatePremium();

					},
					"negativeFunction": function () {
						pA.updateFamily(pA.quoteDetails.PAQuote.PAQuoteDetails[i], insuredMember.suminsured);

						pA.calculatePremium();
					}
				}
			}
		} else {
			var errorAlert = "<div><p class='modal-bind-text'>You are not eligible for this product based on declared income.</p></div>";
			errorAlert = errorAlert + "<ul>";
			if (pA.currentPlan == "pa5") {
				errorAlert = errorAlert + "<li>Minimum Annual Income required for Personal Accident Plan 5 is 84,000.</li>";
			} else if (pA.currentPlan == "pa4") {
				errorAlert = errorAlert + "<li>Minimum Annual Income required for Personal Accident Plan 4 is 42,000.</li>";
			} else {
				errorAlert = errorAlert + "<li>Minimum Annual Income required for Personal Accident Plan 1/2/3 is 25,000.</li>";
			}
			if (pA.CI) {
				errorAlert = errorAlert + "<li>Minimum Annual Income required for Critical Illness is 25,000.</li>";
			}
			if (pA.CS) {
				errorAlert = errorAlert + "<li>Minimum Annual Income required for Cancer Secure is 42,000.</li>";
			}
			errorAlert = errorAlert + "</ul>";
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Alert",
				"modalBodyText": errorAlert,
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true,
				"hideCloseBtn": true,
				"positiveFunction": function () {
					insuredMember.AnnualIncome = "";
				}
			}
		}
	}

	/* End of annual income change event */


	/* To manage cross sell products */

	function manageCrossSellProducts(pAparams) {
	}

	/* End of managing cross sell products */

	/* To fetch nature of duty */

	aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetMaster",{
		"Name":"getNatureOfDuty"
	},false,{
		headers:{
			'Content-Type': 'application/json'
		}
	})
		.then(function(data){
			if(data.ResponseCode == 1){
				rID.natureDfDuty = data.ResponseData;
			}
		},function(err){
		});

/* End of fetching nature of duty */

	/* To calculate premium */

	pA.calculatePremium = function (data) {
		delete pA.quoteDetails.PremiumDetail;
		if (pA.crossSell) {
			manageCrossSellProducts(pACalculatePremiumParams);
		}
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", pACalculatePremiumParams, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					pA.quoteDetails.PremiumDetail = data.ResponseData;
					pA.quoteDetails.PremiumDetail.TotalPremium = 0;
					angular.forEach(pA.quoteDetails.PremiumDetail.ProductPremium, function (v, i) {
						if (parseInt(v.Premium) <= 0) {
							pA.hideSubmitButton = false;
						}
					})
					pA.tenureSaving = data.ResponseData.TenureSavings;
					for (var i = 0; i < pA.quoteDetails.PremiumDetail.ProductPremium.length; i++) {
						pA.quoteDetails.PremiumDetail.TotalPremium = parseInt(pA.quoteDetails.PremiumDetail.TotalPremium) + parseInt(pA.quoteDetails.PremiumDetail.ProductPremium[i].Premium);
					}
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true
					}
				}
			}, function (err) {

			});
	}

	/* End of calulating premium */


	/* Change event of tenure */

	pA.tenureChange = function () {
		$rootScope.callGtag('click-button', 'quote', 'pa-quote_plan[' + pA.quoteDetails.PAQuote.PAQuoteDetails[0].plan + ']_tenure[' + pA.tenureSelect + ']');
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateTenure", {
			"ReferenceNumber": sessionStorage.getItem('rid'),
			"Tenure": pA.tenureSelect
		}, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					for (var i = 0; i < pA.quoteDetails.PAQuote.PAQuoteDetails.length; i++) {
						pA.quoteDetails.PAQuote.PAQuoteDetails[i].TENURE = pA.tenureSelect;
					}
					pA.calculatePremium();
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true
					}
				}
			}, function (err) {

			});
	}

	/* End of change event of tenure */


	/* To Save Quote Details */

	function saveQuoteDetails(event, actText) {
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateQuoteDetails", {
			"ReferenceNumber": sessionStorage.getItem('rid'),
			"PAUpdateQuote": {
				"PAQuoteDetails": pA.quoteDetails.PAQuote.PAQuoteDetails
			}
		}, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					$location.url('rfb-proposer-details');
				} else {
					event.target.disabled = false;
					event.target.innerHTML = actText;
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Success",
						"modalBodyText": "Some error occurred!",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
					}
				}
			}, function (err) {
				event.target.disabled = false;
				event.target.innerHTML = actText;
			});
	}

	/* Ending of saving quote details */


	/* PA Quote save button event */

	pA.pAQuoteSubmit = function (event) {

		for (var i = 0; i < pA.quoteDetails.PAQuote.PAQuoteDetails.length; i++) {

			if (!angular.isUndefined(pA.quoteDetails.PAQuote.PAQuoteDetails[i].AnnualIncome) && pA.quoteDetails.PAQuote.PAQuoteDetails[i].EarningNonEarning == "Earning") {
				if (parseInt(pA.quoteDetails.PAQuote.PAQuoteDetails[i].AnnualIncome) * 12 < parseInt(pA.quoteDetails.PAQuote.PAQuoteDetails[i].suminsured)) {
					$rootScope.alertConfiguration('E', "Sum Insured of " + pA.quoteDetails.PAQuote.PAQuoteDetails[i].RelationWithProposer + " should be 12 times the annual income", "");
					return false;
				}
			}
		}

		var actText = angular.copy(event.target.innerHTML);
		event.target.disabled = true;
		event.target.textContent = "Submitting...";
		var errors = "<ul>";
		var errorsCount = 0;
		var chkAnnualIncome = 24999;
		if (pA.currentPlan == "pa4") {
			chkAnnualIncome = 42000;
		} else if (pA.currentPlan == "pa5") {
			chkAnnualIncome = 84000;
		}


		angular.forEach(pA.quoteDetails.PAQuote.PAQuoteDetails, function (v, i) {
			if ((v.suminsured >= 4000000 || v.EarningNonEarning == "Earning") && v.AnnualIncome < chkAnnualIncome) {
				errors = errors + "<li><p>Please enter valid Annual Income of " + v.RelationWithProposer + ".</p></li>";
				errorsCount = errorsCount + 1;
			}
		});
		if (errorsCount == 0) {
			saveQuoteDetails(event, actText);
		} else {
			errors = errors + "</ul>";
			event.target.disabled = false;
			event.target.innerHTML = actText;
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Errors",
				"modalBodyText": errors,
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true,
			}
		}
	}

	/* End of PA quote save button event */

}]);

/*

	End of controller
	PA Quote Controller
	Author: Pankaj Patil
	Date: 28-06-2018

*/
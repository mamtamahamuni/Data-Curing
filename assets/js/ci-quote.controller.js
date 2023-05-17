/*
	
	CI Quote Controller
	Author: Pankaj Patil
	Date: 05-07-2018

*/

var cIApp = angular.module("ciQuoteApp", []);

cIApp.controller("ciQuoteAppCtrl", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$location', '$timeout', function ($rootScope, appService, ABHI_CONFIG, $filter, $location, $timeout) {

	/* Variable Initlization */

	var cI = this;
	cI.productType = "CI";
	cI.initSlider = false;
	cI.planName = "RFB";
	cI.duplicatePDL = "";
	cI.productSelctedInCross = 'CI';
	cI.hideSubmitButton = true;
	cI.otherFamilyMember = [];
	cI.kidAmount = [];
	cI.otherFamilyConstruct = [];
	cI.duplicatenNOD = "";
	var aS = appService;
	var selfData = {
		'suminsured': 3000001
	};
	var quoteObjref = {};
	var cICalculatePremiumParams = {
		"ReferenceNumber": sessionStorage.getItem('rid'),
		"CI": {
			"CIPremiumList": []
		},
		"Savings": true
	}

	/* End of variable inilization */


	/* To Load Slick Slider */

	function loadOwlCarousel() {
		cI.initSlider = true;
		$timeout(function () {
			$(".ci-carousel").owlCarousel({
				items: 4,
				navigation: true,
				navigationText: ["", ""],
			});
		}, 300);
	}

	$('#content-hospital-cash-benefit').on('shown.bs.collapse', function () {
		$("#ci-hcb-isnured-slider").owlCarousel({
			items: 4,
			navigation: true,
			navigationText: ["", ""],
		});
	}); /* This event triggers we select HCB as YES */

	$('#content-hospital-cash-benefit').on('hidden.bs.collapse', function () {
		angular.forEach(cI.quoteDetails.CIQuote.CIQuoteDetails, function (v, i) {
			v.PDL = "0";
			v.No_Of_days = "0";
			v.HCB = "N";
		});
		cI.calculatePremium(cICalculatePremiumParams);
	}); /* This event triggers when we select HCB as no */

	/* Ending of loading slick slider */


	/* To trigger pixel code */

	var pixelCode = "<img src='http://www.intellectads.co.in/track/conversion.asp?cid=1150&conversionType=1&key=" + sessionStorage.getItem('leadId') + "&opt1=&opt2=&opt3=' height='1' width='1' />";
	pixelCode += "<img src='//ad.admitad.com/r?campaign_code=f01707dad6&action_code=1&payment_type=lead&response_type=img&uid=&tariff_code=1&order_id=" + sessionStorage.getItem('leadId') + "&position_id=&currency_code=&position_count=&price=&quantity=&product_id=' width='1' height='1' alt=''>";
	pixelCode += "<iframe src='https://adboulevard.go2cloud.org/aff_l?offer_id=278&adv_sub=" + sessionStorage.getItem('leadId') + "' scrolling='no' frameborder='0' width='1' height='1'></iframe>";
	pixelCode += "<img src='https://adboulevard.go2cloud.org/aff_l?offer_id=278&adv_sub=" + sessionStorage.getItem('leadId') + "' width='1' height='1' />";
	pixelCode += "<iframe src='https://adclickzone.go2cloud.org/aff_l?offer_id=496&adv_sub=" + sessionStorage.getItem('leadId') + "' scrolling='no' frameborder='0' width='1' height='1'></iframe>";
	pixelCode += "<iframe src='https://apoxymedia.net/p.ashx?o=74&e=8&t=" + sessionStorage.getItem('leadId') + "' height='1' width='1' frameborder='0'></iframe>";
	pixelCode += "<img src='https://opicle.go2cloud.org/aff_l?offer_id=5694&adv_sub=" + sessionStorage.getItem('leadId') + "' width='1' height='1' />";
	$(".cross-sell-bg").append(pixelCode);

	/* End of triggering pixel code */


	/* To Fetch CI Quote Details */

	cI.fetchQuoteDetails = function () {
        var reqData = $rootScope.encrypt({
            "ReferenceNumber": sessionStorage.getItem('rid')
        });  
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetQuoteDetails", {
			"_data": reqData
		}, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				aS.triggerSokrati(); /* Triggering Sokrati */
				var data = JSON.parse($rootScope.decrypt(data._resp))
				if (data.ResponseCode == 1) {
					cI.quoteDetails = data.ResponseData;
					$rootScope.leminiskObj = data.ResponseData
					$rootScope.lemniskCodeExcute();
					cI.currentPlan = "ci" + cI.quoteDetails.CIQuote.CIQuoteDetails[0].plan;
					cI.tenureSelect = cI.quoteDetails.CIQuote.CIQuoteDetails[0].TENURE;
					cI.hCBCollapse = cI.quoteDetails.CIQuote.CIQuoteDetails[0].HCB;
					if (cI.hCBCollapse == 'Y') {
						$('#content-hospital-cash-benefit').collapse('show');
					}
					cICalculatePremiumParams.CI.CIPremiumList = cI.quoteDetails.CIQuote.CIQuoteDetails;
					quoteObjref = cI.quoteDetails.CIQuote.CIQuoteDetails[0];
					cI.quoteDetails.CIQuote.CIQuoteDetails.forEach(function (e) {
						if (e.RelationWithProposer == "SELF") {
							selfData = e;
							quoteObjref = e;
						}
						else if (e.RelationWithProposer != "SELF" && e.RelationWithProposer != "KID" && e.AnnualIncome == '0') {
							cI.familyConstructSumInsured(e);
						}
					})
					//loadOwlCarousel();
					// quoteObjref = cI.quoteDetails.CIQuote.CIQuoteDetails[0];
					// for(var i = 0; i<cI.quoteDetails.CIQuote.CIQuoteDetails.length;i++){
					// 	if(cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer == "SELF"){
					// 		selfData = cI.quoteDetails.CIQuote.CIQuoteDetails[i];
					// 		quoteObjref = cI.quoteDetails.CIQuote.CIQuoteDetails[i];
					// 		break;
					// 	}
					// }
					// cI.calculatePremium();
					loadOwlCarousel();
					for (i = 0; i < cI.quoteDetails.CIQuote.CIQuoteDetails.length; i++) {
						cI.updateFamily(cI.quoteDetails.CIQuote.CIQuoteDetails[i], cI.quoteDetails.CIQuote.CIQuoteDetails[0].suminsured);
						if (cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer != 'KID' && cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer != 'SELF') {
							cI.otherFamilyConstruct = [];
							for (j = 0; j < cI.sumAmounts.length; j++) {
								if (parseInt(cI.quoteDetails.CIQuote.CIQuoteDetails[0].suminsured) >= parseInt(cI.sumAmounts[j].amount)) {
									cI.otherFamilyConstruct.push(cI.sumAmounts[j]);
								}
							}
						}
					}
					cI.calculatePremium();
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": "Some error ocurred.",
						"gtagPostiveFunction": "click-button, ci-quote , service-fails[GetQuoteDetails]",
						"gtagCrossFunction": "click-button,  ci-quote ,service-fails[GetQuoteDetails]",
						"gtagNegativeFunction": "click-button, ci-quote , service-fails[GetQuoteDetails]",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true
					}
				}
			}, function (err) {

			});
	}
	cI.familyConstructSumInsured = function (insuredMember) {
		insuredMember.suminsured = 1000000;
		cI.otherFamilyConstruct = [];
		var insuredMemberVal = angular.isObject(insuredMember);
		if (!insuredMemberVal) {
			cI.sumAmounts.forEach(function (e) {
				if (parseInt(e.amount) <= parseInt(insuredMember)) {
					cI.otherFamilyConstruct.push(e);
				}
			});
			for (var i = 0; i < cI.quoteDetails.CIQuote.CIQuoteDetails.length; i++) {
				if (cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer == "SPOUSE") {
					if (insuredMember == 2500000 || insuredMember == 1500000) {
						cI.otherFamilyConstruct.forEach(function (e) {
							if (parseInt(e.amount) < parseInt(insuredMember / 2)) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = e.amount;
							}
						});
					} else {
						cI.otherFamilyConstruct.forEach(function (e) {
							if (parseInt(e.amount) <= parseInt(insuredMember / 2)) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = e.amount;
							} else if (insuredMember >= 10000000) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = 3000000;
							} else if (insuredMember == 900000 || insuredMember == 700000) {
								cI.otherFamilyConstruct.forEach(function (e) {
									if (parseInt(e.amount) < parseInt(insuredMember / 2)) {
										cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = e.amount;
									}
								});
							}
							if (insuredMember < 1000000 && cI.currentPlan == "ci3") {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = 500000;
							} else if (insuredMember <= 500000) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = 300000;
							}
						});
					}
				}
				else if (cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer == "FATHER" || cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer == "FATHER-IN-LAW" || cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer == "MOTHER" || cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer == "MOTHER-IN-LAW") {
					if (insuredMember == 1500000 || insuredMember == 900000 || insuredMember == 700000) {
						cI.otherFamilyConstruct.forEach(function (e) {
							if (parseInt(e.amount) < parseInt(insuredMember / 2)) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = e.amount;
							}
						});
					} else {
						cI.otherFamilyConstruct.forEach(function (e) {
							if (parseInt(e.amount) <= parseInt(insuredMember / 2)) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = e.amount;
							} else if (insuredMember >= 10000000) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = 3000000;
							}
							else if (insuredMember < 1000000 && cI.currentPlan == "ci3") {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = 500000;
							} else if ((insuredMember <= 500000)) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = 300000;
							} else if ((insuredMember > 2000000)) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = 1000000;
							}
						});
					}
				}
				else if (cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer == "KID") {
					if (insuredMember <= 1500000) {
						cI.kidAmount = [];
						cI.sumAmounts.forEach(function (e) {
							if (parseInt(e.amount) <= insuredMember) {
								cI.kidAmount.push(e);
							}
						});
					}
					if (insuredMember == 2500000 || insuredMember == 1500000) {
						cI.kidAmount.forEach(function (e) {
							if (parseInt(e.amount) < parseInt(insuredMember / 2)) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = e.amount;
							}
						});
					}
					else {
						cI.otherFamilyConstruct.forEach(function (e) {
							if (parseInt(e.amount) <= parseInt(insuredMember / 2)) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = e.amount;
							} else if (insuredMember >= 3000000) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = 1500000;
							} else if (insuredMember == 900000 || insuredMember == 700000 || insuredMember == 500000 || insuredMember == 300000) {
								cI.kidAmount.forEach(function (e) {
									if (parseInt(e.amount) < parseInt(insuredMember / 2)) {
										cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = e.amount;
									}
								});
							}
							if (insuredMember < 1000000 && cI.currentPlan == "ci3") {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = 500000;
							} else if (insuredMember <= 500000) {
								cI.quoteDetails.CIQuote.CIQuoteDetails[i].suminsured = 300000;
							}
						});
					}
				}
			}
		}
		loadOwlCarousel();
	}

	cI.fetchQuoteDetails();

	/* End of fetching quote details */


	/* To calculate premium */

	cI.calculatePremium = function (data) {
		delete cI.quoteDetails.PremiumDetail;
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", cICalculatePremiumParams, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					cI.quoteDetails.PremiumDetail = data.ResponseData;
					cI.quoteDetails.PremiumDetail.TotalPremium = 0;
					angular.forEach(cI.quoteDetails.PremiumDetail.ProductPremium, function (v, i) {
						if (parseInt(v.Premium) <= 0) {
							cI.hideSubmitButton = false;
						}
					})
					cI.tenureSaving = data.ResponseData.TenureSavings;
					if (!angular.isUndefined(cI.CSPremium)) {
						cI.fetchPremiumsSecondary();
					}
					for (var i = 0; i < cI.quoteDetails.PremiumDetail.ProductPremium.length; i++) {
						cI.quoteDetails.PremiumDetail.TotalPremium = parseInt(cI.quoteDetails.PremiumDetail.TotalPremium) + parseInt(cI.quoteDetails.PremiumDetail.ProductPremium[i].Premium);
						if (cI.quoteDetails.PremiumDetail.ProductPremium[i].ProductCode == 'PA') {
							cI.paActPremium = cI.quoteDetails.PremiumDetail.ProductPremium[i].Premium;
						} else if (cI.quoteDetails.PremiumDetail.ProductPremium[i].ProductCode == 'CS') {
							cI.csActPremium = cI.quoteDetails.PremiumDetail.ProductPremium[i].Premium;
						}
					}
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.ResponseMessage,
						"gtagPostiveFunction": "click-button, ci-quote , service-fails[GetPremium]",
						"gtagCrossFunction": "click-button,  ci-quote ,service-fails[GetPremium]",
						"gtagNegativeFunction": "click-button, ci-quote , service-fails[GetPremium]",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true
					}
				}
			}, function (err) {

			});
	}

	/* End of calulating premium */


	/* To Fetch Sum Insured Data */

	aS.getData("assets/data/sum-insured.json", "", false, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(function (data) {
			if (data.ResponseCode == 1) {
				cI.sumAmounts = JSON.parse(JSON.stringify(data.ResponseData));
				cI.sumAmounts.forEach(function (e) {
					if (e.amount <= 1500000) {
						cI.kidAmount.push(e);
					}
				});
				cI.sumAmounts.forEach(function (e) {
					if (e.amount <= 2500000) {
						cI.otherFamilyConstruct.push(e);
					}
				});
				loadOwlCarousel();

			}
		}, function (err) {

		});

	/* End of fetching sum insured data */


	/* Update age of particular member */

	cI.updateAge = function (member, index) {
		cI.currentAge;
		for (var i = 0; i < cI.membersDetails.length; i++) {
			if (member.RelationType == cI.membersDetails[i].RelationType) {
				cI.previousUSerAge = cI.membersDetails[i].Age;
				cI.currentAge = angular.copy(cI.membersDetails[i].Age);
				cI.membersDetails[i].Age = member.AGE;
				cI.addUpdateMember(cI.membersDetails[i], index);
				break;
			}
		}
	}

	/* End of updating age of particular member */


	/* To delete particular member */

	cI.cIDeleteMember = function (member, ind) {
		$rootScope.callGtag('click-icon-x', 'quote', 'ci-quote_plan[' + cI.quoteDetails.CIQuote.CIQuoteDetails[0].plan + ']_' + member.RelationType + '_delete-member');
		if (cI.membersDetails.length == 2) {
			$rootScope.alertConfiguration('E', "You cannot delete this member.", "delete_member_alert");
			return false;
		}
		for (var i = 0; i < cI.membersDetails.length; i++) {
			if (member.RelationType == cI.membersDetails[i].RelationType) {
				cI.deleteMember(cI.membersDetails[i], ind);
				break;
			}
		}
	}

	/* End of deleting particular member */


	/* Update soft details data */

	cI.updateSoftDetails = function (type, member, index) {
		if (type == "DeleteMember" && member.RelationWithProposer != 'KID') {
			cI.initSlider = false;
			//cI.quoteDetails.CIQuote.CIQuoteDetails.splice(index,1);
			for (var i = 0; i < cI.quoteDetails.CIQuote.CIQuoteDetails.length; i++) {
				if (member.RelationType == cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationType) {
					cI.quoteDetails.CIQuote.CIQuoteDetails.splice(i, 1);
				}
			}
			cICalculatePremiumParams.CI.CIPremiumList = cI.quoteDetails.CIQuote.CIQuoteDetails;
			cI.calculatePremium(cICalculatePremiumParams);
			$timeout(function () {
				loadOwlCarousel();
			}, 300);
		} else if (type == 'DeleteMember' && member.RelationWithProposer == 'KID') {
			cI.initSlider = false;
			cI.fetchQuoteDetails();
		} else if (type == "UpdateMember") {
			cI.quoteDetails.CIQuote.CIQuoteDetails[index].AGE = member.Age;
			cI.calculatePremium(cICalculatePremiumParams);
		} else if (type == "AddMember") {
			cI.initSlider = false;
			var sumInsured;
			if (member.RelationWithProposer == "SELF") {
				sumInsured = 2500000;
			} else if (member.RelationWithProposer == "SPOUSE") {
				if (quoteObjref.suminsured <= 2500000) {
					sumInsured = 1000000;
				}
				if (quoteObjref.suminsured >= 3000000 && quoteObjref.suminsured <= 3500000) {
					sumInsured = 1500000;
				}
				if (quoteObjref.suminsured >= 4000000 && quoteObjref.suminsured <= 4500000) {
					sumInsured = 2000000;
				}
				if (quoteObjref.suminsured == 5000000) {
					sumInsured = 2500000;
				}
				if (quoteObjref.suminsured > 5000000) {
					sumInsured = 3000000;
				}
				if (quoteObjref.suminsured <= 1000000) {
					sumInsured = 500000;
				}
				if (quoteObjref.suminsured <= 800000) {
					sumInsured = 400000;
				}
				if (quoteObjref.suminsured <= 500000) {
					sumInsured = 300000;
				}

				// sumInsured = quoteObjref.suminsured;
			} else if (member.RelationWithProposer == "FATHER" || member.RelationWithProposer == "MOTHER" || member.RelationWithProposer == "FATHER-IN-LAW" || member.RelationWithProposer == "MOTHER-IN-LAW") {
				if (quoteObjref.suminsured >= 3000000 || quoteObjref.suminsured <= 2500000) {
					sumInsured = 1000000;
				}
				if (quoteObjref.suminsured <= 1000000) {
					sumInsured = 500000;
				}
				if (quoteObjref.suminsured <= 800000) {
					sumInsured = 400000;
				}
				if (quoteObjref.suminsured <= 500000) {
					sumInsured = 300000;
				}
				// sumInsured = toHandleParentSumInsured(quoteObjref.suminsured);
			} else if (member.RelationWithProposer == "KID") {
				sumInsured = manageKidsSumInsured(quoteObjref.suminsured);
			}
			var newMember = {
				"gender": "" + member.Gender + "",
				"TENURE": quoteObjref.TENURE,
				"suminsured": sumInsured,
				"WELL_Coach": quoteObjref.WELL_Coach,
				"No_Of_days": quoteObjref.No_Of_days,
				"AGE": member.Age,
				"SEO": quoteObjref.SEO,
				"HCB": quoteObjref.HCB,
				"PDL": quoteObjref.PDL,
				"RelationType": member.RelationType,
				"RelationWithProposer": member.RelationWithProposer,
				"AnnualIncome": "0",
				"EarningNonEarning": ""
			}
			cI.quoteDetails.CIQuote.CIQuoteDetails.push(newMember);
			cI.calculatePremium(cICalculatePremiumParams);
			for (i = 0; i < cI.quoteDetails.CIQuote.CIQuoteDetails.length; i++) {
				cI.updateFamily(cI.quoteDetails.CIQuote.CIQuoteDetails[i], cI.quoteDetails.CIQuote.CIQuoteDetails[0].suminsured);
				if (cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer != 'KID' && cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer != 'SELF') {
					cI.otherMember = [];
					for (j = 0; j < cI.sumAmounts.length; j++) {
						if (parseInt(cI.quoteDetails.CIQuote.CIQuoteDetails[0].suminsured) >= parseInt(cI.sumAmounts[j].amount)) {
							cI.otherMember.push(cI.sumAmounts[j]);
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

	function manageKidsSumInsured(sum) {
		if (sum >= 3000000) {
			return 1500000;
		} else if (sum == 2500000 || sum == 2000000) {
			return 1000000;
		} else if (sum == 1500000) {
			return 700000;
		} else if (sum == 1000000) {
			return 500000;
		} else if (sum < 1000000 && sum > 500000 && cI.currentPlan == "ci3") {
			return 500000;
		} else if ((sum == 900000 || sum == 800000) && cI.currentPlan != "ci3") {
			return 400000;
		} else if ((sum == 700000 || sum == 600000) && cI.currentPlan != "ci3") {
			return 300000;
		} else if ((sum == 500000 || sum == 400000) && cI.currentPlan != "ci3") {
			return 200000;
		} else if ((sum == 300000 || sum == 200000 || sum == 100000) && cI.currentPlan != "ci3") {
			return 100000;
		}
	}

	/* End of managing kids sum insured */


	/* Function to handle parent sum insured */

	function toHandleParentSumInsured(selfSumsinured) {
		var parentsSI = angular.copy(selfSumsinured / 2);
		if (parentsSI > 1000000) {
			return 1000000;
		} else if (parentsSI < 500000 && cI.currentPlan == 'ci3') {
			return 500000;
		} else if (selfSumsinured == 1500000) {
			return 700000;
		} else if (selfSumsinured == 900000) {
			return 400000;
		} else if (selfSumsinured == 700000) {
			return 300000;
		} else if (selfSumsinured == 500000) {
			return 200000;
		} else if (selfSumsinured == 300000 || selfSumsinured == 200000 || selfSumsinured == 100000) {
			return 100000;
		} else {
			return parentsSI;
		}
	}

	/* End of handling sum insured of paranet */


	/* To display popup whether person is earning or not */

	function isEarningPerson(member, sum, index) {
		if ((member !== "KID" && cI.quoteDetails.CIQuote.CIQuoteDetails[index].showAnnualIncome == false) || cI.quoteDetails.CIQuote.CIQuoteDetails[index].showAnnualIncome == undefined) {
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
						cI.quoteDetails.CIQuote.CIQuoteDetails[index].showAnnualIncome = true;
						cI.quoteDetails.CIQuote.CIQuoteDetails[index].EarningNonEarning = "Earning";
					}, 200);
				},
				"negativeFunction": function () {
					cI.quoteDetails.CIQuote.CIQuoteDetails[index].EarningNonEarning = "Non Earning";
					if (member == "SELF" || member == "SPOUSE") {
						if (quoteObjref.suminsured > 3000000) {
							cI.quoteDetails.CIQuote.CIQuoteDetails[index].suminsured = 2500000;
							cI.familyConstructSumInsured(quoteObjref.suminsured);
						} else {
							cI.quoteDetails.CIQuote.CIQuoteDetails[index].suminsured = 2500000;
							cI.familyConstructSumInsured(quoteObjref.suminsured);
						}
					} else if (member == "FATHER" || member == "MOTHER" || member == "FATHER-IN-LAW" || member == "MOTHER-IN-LAW") {
						cI.quoteDetails.CIQuote.CIQuoteDetails[index].suminsured = toHandleParentSumInsured(quoteObjref.suminsured);
					} else {
						cI.quoteDetails.CIQuote.CIQuoteDetails[index].suminsured = manageKidsSumInsured(quoteObjref.suminsured);
					}
					for (i = 0; i < cI.quoteDetails.CIQuote.CIQuoteDetails.length; i++) {
						cI.updateFamily(cI.quoteDetails.CIQuote.CIQuoteDetails[i], quoteObjref.suminsured);
						if (cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer != 'KID' && cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer != 'SELF') {
							cI.otherMember = [];
							for (j = 0; j < cI.sumAmounts.length; j++) {
								if (parseInt(quoteObjref.suminsured) >= parseInt(cI.sumAmounts[j].amount)) {
									cI.otherMember.push(cI.sumAmounts[j]);
								}
							}
						}
					}
					cI.calculatePremium(cICalculatePremiumParams);
				}
			}
		}
		else {
			cI.quoteDetails.CIQuote.CIQuoteDetails[index].suminsured = sum;
			cI.changeAnnualIncome(cI.quoteDetails.CIQuote.CIQuoteDetails[index]);
		}
	}
	/* End of displaying popup whether person is earning or not */


	/* Sum insured dropdown change event */

	/* Sum insured dropdown change event */
	cI.updateFamily = function (insuredMember, sum) {
		if ((insuredMember.RelationWithProposer == "SPOUSE" || insuredMember.RelationWithProposer == "FATHER" || insuredMember.RelationWithProposer == "MOTHER" || insuredMember.RelationWithProposer == "FATHER-IN_LAW" || insuredMember.RelationWithProposer == "MOTHER-IN_LAW") && (insuredMember.suminsured > parseInt(sum))) {
			insuredMember.suminsured = sum;
		}
	}
	cI.calculateSumInsured = function (member, sum, index) {
		if (member.toLowerCase() == "self") {
			cI.familyConstructSumInsured(sum);
			if (sum <= 3000000) {
				angular.forEach(cI.quoteDetails.CIQuote.CIQuoteDetails, function (v, i) {
					if (v.EarningNonEarning != 'Earning') {
						if (v.RelationWithProposer == "SPOUSE" || v.RelationWithProposer == "PROPOSER") {
							// v.suminsured = sum;
						} else if (v.RelationWithProposer == "FATHER" || v.RelationWithProposer == "MOTHER" || v.RelationWithProposer == "FATHER-IN-LAW" || v.RelationWithProposer == "MOTHER-IN-LAW") {
							//v.suminsured = toHandleParentSumInsured(sum);
							if (member.suminsured > 1000000) {
								isEarningPerson(member, sum, index);
							}
						} else if (v.RelationWithProposer == "KID") {
							//v.suminsured = manageKidsSumInsured(sum);
						}
					}
				})
			} else {
				// for(i=0;i<cI.quoteDetails.CIQuote.CIQuoteDetails.length;i++){
				//  cI.updateFamily(cI.quoteDetails.CIQuote.CIQuoteDetails[i],sum);
				//  if(cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer!='KID' && cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer!='SELF'  ){
				//      cI.otherMember = [];
				//      for(j=0;j<cI.sumAmounts.length;j++){
				//          if(parseInt(sum) >= parseInt(cI.sumAmounts[j].amount)){
				//              cI.otherMember.push(cI.sumAmounts[j]);
				//          }
				//      }
				//  }
				// }
				angular.forEach(cI.quoteDetails.CIQuote.CIQuoteDetails, function (v, i) {
					if (v.RelationWithProposer == "SELF") {
						cI.otherSI = v.suminsured / 2;
					}
				});
				if (cI.otherSI <= sum || cI.otherSI > 3000000) {
					isEarningPerson(member, sum, index);
				}

			}
			$timeout(function () {
				cI.calculatePremium(cICalculatePremiumParams);
			}, 500);
		} else {
			var sumCriteria;
			var sInsured;
			if (member == "FATHER" || member == "MOTHER" || member == "FATHER-IN-LAW" || member == "MOTHER-IN-LAW") {
				sInsured = toHandleParentSumInsured(quoteObjref.suminsured);
			} else if (member == "SPOUSE") {
				sInsured = 3000001;
			} else if (member == "KID") {
				sInsured = manageKidsSumInsured(quoteObjref.suminsured);;
			}
			(selfData.suminsured > sInsured) ? sumCriteria = sInsured : sumCriteria = selfData.suminsured;
			angular.forEach(cI.quoteDetails.CIQuote.CIQuoteDetails, function (v, i) {
				if (v.RelationWithProposer == "SELF") {
					cI.otherSI = v.suminsured / 2;
				}
			});
			if (cI.otherSI <= sum || cI.otherSI > 3000000) {
				isEarningPerson(member, sum, index);
			} else {
				$timeout(function () {
					cI.calculatePremium(cICalculatePremiumParams);
				}, 500)
			}
			// if(parseInt(sum) >= parseInt(sumCriteria)){
			//  isEarningPerson(member,sum,index);
			// }
		}
	}

	/* End of sum insured dropdown change event */


	/* Annual Income change event */

	cI.changeAnnualIncome = function (insuredMember) {
		var chkAnnualIncome = 24999;
		if (cI.currentPlan == "ci3" || cI.CS) {
			chkAnnualIncome = 42000;
		}
		cI.AnnualIncomeSelected = insuredMember.AnnualIncome;
		if (insuredMember.AnnualIncome > chkAnnualIncome) {
			var isProceed = true;
			var maxInsured;
			angular.forEach(cI.sumAmounts, function (v, i) {
				if (isProceed && v[cI.currentPlan]) {
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
					"modalBodyText": "Sum Insured eligibility is 12 times the Annual Income (" + $filter('INR')(cI.sumAmounts[maxInsured].amount) + ").",
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"positiveFunction": function () {
						insuredMember.suminsured = cI.sumAmounts[maxInsured].amount;
						cI.calculatePremium(cICalculatePremiumParams);
						if (insuredMember.RelationWithProposer == "SELF") {
							cI.calculateSumInsured(insuredMember.RelationWithProposer, insuredMember.suminsured, insuredMember.objIndex);
						}
					}
				}
			} else if (insuredMember.suminsured != cI.sumAmounts[maxInsured].amount && insuredMember.RelationWithProposer == "SELF") {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "You are eligible for Sum Insured up to ₹​ " + $filter('INR')(cI.sumAmounts[maxInsured].amount) + ". Do you wish to continue?",
					"showCancelBtn": true,
					"modalSuccessText": "Yes",
					"showAlertModal": true,
					"modalCancelText": "No",
					"positiveFunction": function () {
						insuredMember.suminsured = cI.sumAmounts[maxInsured].amount;
						cI.calculatePremium(cICalculatePremiumParams);
					},
					"negativeFunction": function () {
						for (i = 0; i < cI.quoteDetails.CIQuote.CIQuoteDetails.length; i++) {
							cI.updateFamily(cI.quoteDetails.CIQuote.CIQuoteDetails[i], cI.quoteDetails.CIQuote.CIQuoteDetails[0].suminsured);
							if (cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer != 'KID' && cI.quoteDetails.CIQuote.CIQuoteDetails[i].RelationWithProposer != 'SELF') {
								cI.otherMember = [];
								for (j = 0; j < cI.sumAmounts.length; j++) {
									if (parseInt(cI.quoteDetails.CIQuote.CIQuoteDetails[0].suminsured) >= parseInt(cI.sumAmounts[j].amount)) {
										cI.otherMember.push(cI.sumAmounts[j]);
									}
								}
							}
						}
						cI.calculatePremium(cICalculatePremiumParams);
					}
				}
			}

		} else {
			var errorAlert = "<div><p class='modal-bind-text'>You are not eligible for this product based on declared income.</p></div>";
			errorAlert = errorAlert + "<ul>";
			if (cI.currentPlan == "ci3") {
				errorAlert = errorAlert + "<li>Minimum Annual Income required for Critical Illness Plan 3 is 42,000.</li>";
			} else {
				errorAlert = errorAlert + "<li>Minimum Annual Income required for Critical Illness Plan 1/2 is 25,000.</li>";
			}
			if (cI.PA) {
				errorAlert = errorAlert + "<li>Minimum Annual Income required for Personal Accident is 25,000.</li>";
			}
			if (cI.CS) {
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


	/* Change event of tenure */

	cI.tenureChange = function () {
		$rootScope.callGtag('click-radio', 'quote', 'ci-quote_plan[' + cI.quoteDetails.CIQuote.CIQuoteDetails[0].plan + ']_tenure[' + cI.tenureSelect + ']');
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateTenure", {
			"ReferenceNumber": sessionStorage.getItem('rid'),
			"Tenure": cI.tenureSelect
		}, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					for (var i = 0; i < cI.quoteDetails.CIQuote.CIQuoteDetails.length; i++) {
						cI.quoteDetails.CIQuote.CIQuoteDetails[i].TENURE = cI.tenureSelect;
					}
					cI.calculatePremium(cICalculatePremiumParams);
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.ResponseMessage,
						"gtagPostiveFunction": "click-button, ci-quote , service-fails[UpdateTenure]",
						"gtagCrossFunction": "click-button,  ci-quote ,service-fails[UpdateTenure]",
						"gtagNegativeFunction": "click-button, ci-quote , service-fails[UpdateTenure]",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true
					}
				}
			}, function (err) {

			});
	}

	/* End of change event of tenure */


	/* Change event of daily cash limit in HCB */

	cI.changePDL = function (cashLimit, index) {
		if (cashLimit == "") {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Alert",
				"modalBodyText": "Hospital Cash Benefit for " + cI.quoteDetails.CIQuote.CIQuoteDetails[index].RelationWithProposer + " has been removed.",
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true
			}
			cI.quoteDetails.CIQuote.CIQuoteDetails[index].No_Of_days = "";
			cI.quoteDetails.CIQuote.CIQuoteDetails[index].HCB = "N";
			cI.calculatePremium(cICalculatePremiumParams);
		} else {
			cI.quoteDetails.CIQuote.CIQuoteDetails[index].HCB = "Y";
			$timeout(function () {
				(cI.quoteDetails.CIQuote.CIQuoteDetails[index].No_Of_days != "") ? cI.calculatePremium(cICalculatePremiumParams) : "";
			}, 600);
		}
	}

	/* End of Change event of daily cash limit in HCB */


	/* To change number of days in HCB */

	cI.changeDays = function (days, index) {
		if (days == "") {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Alert",
				"modalBodyText": "Please select proper days value.",
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true
			}
			cI.quoteDetails.CIQuote.CIQuoteDetails[index].HCB = "N";
			cI.quoteDetails.CIQuote.CIQuoteDetails[index].PDL = "";
			cI.calculatePremium(cICalculatePremiumParams);
		} else {
			angular.forEach(cI.quoteDetails.CIQuote.CIQuoteDetails, function (v, i) {
				if (v.PDL != "") {
					v.No_Of_days = days;
					v.HCB = "Y";
				}
			});
			$timeout(function () {
				cI.calculatePremium(cICalculatePremiumParams);
			}, 600);
		}
	}

	/* End of changing number of days in HCB */


	/* Removing Hospital Cash Benefit of Particular Member */

	cI.removeHCB = function (member) {
		$rootScope.alertData = {
			"modalClass": "regular-alert",
			"modalHeader": "Warning",
			"modalBodyText": "Are you sure you want to remove Hospital Cash Benefit for " + member.RelationWithProposer + " ?",
			"showCancelBtn": true,
			"modalSuccessText": "Yes",
			"modalCancelText": "No",
			"showAlertModal": true,
			"positiveFunction": function () {
				member.PDL = "";
				member.No_Of_days = "";
				member.HCB = "N";
				cI.calculatePremium(cICalculatePremiumParams);
			}
		}
	}

	/* End of removing hospital cash benefit of Particular Member */


	/* To duplicate HCB */

	cI.duplicateHCB = function () {
		if (angular.isUndefined(cI.duplicatePDL) || angular.isUndefined(cI.duplicatenNOD)) {
			return false;
		}
		angular.forEach(cI.quoteDetails.CIQuote.CIQuoteDetails, function (v, i) {
			v.PDL = cI.duplicatePDL;
			v.No_Of_days = cI.duplicatenNOD;
			v.HCB = "Y";
		});
		cI.calculatePremium(cICalculatePremiumParams);
	}

	/* End of duplicating HCB */


	/* To select particular checkbox section */

	cI.changeSection = function (val, param) {
		angular.forEach(cI.quoteDetails.CIQuote.CIQuoteDetails, function (v, i) {
			v[param] = val;
		});
		cI.calculatePremium(cICalculatePremiumParams);
	}

	/* End of selecting particular checkbox section */


	/* To Save Quote Details */

	function saveQuoteDetails() {
		var lemeiskData = cI.quoteDetails.CIQuote.CIQuoteDetails

		$rootScope.leminiskObj = {
			"memberArray": lemeiskData,
			"preminumObj": cI.quoteDetails.PremiumDetail.TotalPremium
		}


		$rootScope.lemniskCodeExcute($location.$$path);

		var lemniskObj = {
			"Selected Members": lemeiskData,
			"PlanName": cI.PlanName + ' ' + cI.productPlanName,
			"PolicyTenure": cI.quoteDetails.PolicyTenure,
			"PolicyType": cI.quoteDetails.PolicyType,
			"Premium Amount": cI.quoteDetails.PremiumDetail.TotalPremium
		};
		$rootScope.lemniskTrack("", "", lemniskObj);

		aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateQuoteDetails", {
			"ReferenceNumber": sessionStorage.getItem('rid'),
			"CIUpdateQuote": {
				"CIQuoteDetails": cI.quoteDetails.CIQuote.CIQuoteDetails
			}
		}, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					if (cI.crossSell) {
						if (cI.PA == 'Y') {
							cI.productSelctedInCross = cI.productSelctedInCross + '-PA'
						} if (cI.CS == 'Y') {
							cI.productSelctedInCross = cI.productSelctedInCross + '-CS'
						}
						sessionStorage.setItem('productSelctedInCross', cI.productSelctedInCross)
						$location.url('cross-sell-proposer-details?products=' + cI.productSelctedInCross);
					} else {
						$location.url('rfb-proposer-details');
					}
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.ResponseMessage,
						"gtagPostiveFunction": "click-button, ci-quote , service-fails[UpdateQuoteDetails]",
						"gtagCrossFunction": "click-button,  ci-quote ,service-fails[UpdateQuoteDetails]",
						"gtagNegativeFunction": "click-button, ci-quote , service-fails[UpdateQuoteDetails]",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true
					}
				}

			}, function (err) {

			});
	}

	/* Ending of saving quote details */


	/* CI Quote save button event */

	cI.cIQuoteSubmit = function () {
		var errors = "<ul>";
		var errorsCount = 0;
		var chkAnnualIncome = 24999;
		if (cI.currentPlan == "ci3" || cI.CS) {
			chkAnnualIncome = 42000;
		}
		var hcbPresent;
		angular.forEach(cI.quoteDetails.CIQuote.CIQuoteDetails, function (v, i) {
			if (v.HCB == "Y") {
				hcbPresent = true;
			}
			if ((v.suminsured >= 4000000 || v.EarningNonEarning == "Earning") && v.AnnualIncome < chkAnnualIncome) {
				errors = errors + "<li><p>Please enter valid Annual Income of " + v.RelationWithProposer + ".</p></li>";
				errorsCount = errorsCount + 1;
			}
			if (v.PDL != "" && v.No_Of_days == "") {
				errors = errors + "<li><p>Please select No. of days of " + v.RelationWithProposer + ".</p></li>";
				errorsCount = errorsCount + 1;
			}
		});
		if (cI.hCBCollapse == 'Y' && !hcbPresent) {
			errors = errors + "<li><p>Please select Hospital Cash Benefit for atleast one member.</p></li>";
			errorsCount = errorsCount + 1;
		}
		if (errorsCount == 0) {
			saveQuoteDetails();
		} else {
			errors = errors + "</ul>";
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

	/* End of CI quote save button event */


}]);

/*

	End of controller
	CI Quote Controller
	Author: Pankaj Patil
	Date: 05-07-2018

*/
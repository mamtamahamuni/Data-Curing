/*
	
	CS Quote Controller
	Author: Pankaj Patil
	Date: 05-07-2018

*/

var csApp = angular.module("csQuoteApp", []);

csApp.controller("csQuoteApp", ['$rootScope', 'appService', 'ABHI_CONFIG', '$location', '$timeout', function ($rootScope, appService, ABHI_CONFIG, $location, $timeout) {

	/* Variable Inilization */

	var cS = this;
	cS.productType = "CS";
	cS.initSlider = false;
	cS.planName = "RFB";
	cS.productSelctedInCross = 'CS'
	cS.hideSubmitButton = true;
	var aS = appService;
	cS.otherFamilyMember = [];
	cS.kidAmount = [];
	cS.otherFamilyConstruct = [];
	var selfData = {
		'suminsured': 3000001
	};
	var quoteObjref = {};
	var cSCalculatePremiumParams = {
		"ReferenceNumber": sessionStorage.getItem('rid'),
		"CS": {
			"CSPremiumList": []
		},
		"Savings": true
	}

	/* End of variable inilization */


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


	/* To Load Slick Slider */

	function loadOwlCarousel() {
		cS.initSlider = true;
		$timeout(function () {
			$(".cs-carousel").owlCarousel({
				items: 4,
				navigation: true,
				navigationText: ["", ""],
			});
		}, 300);
	}

	$('#content-hospital-cash-benefit').on('shown.bs.collapse', function () {
		$("#cs-hcb-isnured-slider").owlCarousel({
			items: 4,
			navigation: true,
			navigationText: ["", ""],
		});
	}); /* This event triggers we select HCB as YES */

	$('#content-hospital-cash-benefit').on('hidden.bs.collapse', function () {
		angular.forEach(cS.quoteDetails.CSQuote.CSQuoteDetails, function (v, i) {
			v.PDL = "0";
			v.No_Of_days = "0";
			v.HCB = "N";
		});
		cS.calculatePremium(cSCalculatePremiumParams);
	}); /* This event triggers when we select HCB as no */

	/* Ending of loading slick slider */


	/* To Fetch CS Quote Details */

	cS.fetchQuoteDetails = function () {
		cS.initSlider = false;
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
				var data = JSON.parse($rootScope.decrypt(data._resp))
				if (data.ResponseCode == 1) {
					aS.triggerSokrati(); /* Triggering Sokrati */
					cS.quoteDetails = data.ResponseData;
					$rootScope.leminiskObj = data.ResponseData
					$rootScope.lemniskCodeExcute();
					cS.tenureSelect = cS.quoteDetails.CSQuote.CSQuoteDetails[0].TENURE;
					cS.hCBCollapse = cS.quoteDetails.CSQuote.CSQuoteDetails[0].HCB;
					if (cS.hCBCollapse == 'Y') {
						$('#content-hospital-cash-benefit').collapse('show');
					}
					cSCalculatePremiumParams.CS.CSPremiumList = cS.quoteDetails.CSQuote.CSQuoteDetails;
					//loadOwlCarousel();
					quoteObjref = cS.quoteDetails.CSQuote.CSQuoteDetails[0];
					for (var i = 0; i < cS.quoteDetails.CSQuote.CSQuoteDetails.length; i++) {
						if (cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationWithProposer == "SELF") {
							selfData = cS.quoteDetails.CSQuote.CSQuoteDetails[i];
							quoteObjref = cS.quoteDetails.CSQuote.CSQuoteDetails[i];

						} else {
							if (cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationWithProposer != "SELF" && cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationWithProposer != "KID" && cS.quoteDetails.CSQuote.CSQuoteDetails[i].AnnualIncome == '0') {
								cS.familyConstructSumInsured(cS.quoteDetails.CSQuote.CSQuoteDetails[i]);
							}
						}
					}
					$timeout(function () {
						loadOwlCarousel();
					}, 300);
					for (i = 0; i < cS.quoteDetails.CSQuote.CSQuoteDetails.length; i++) {
						//cI.updateFamily(cI.quoteDetails.CIQuote.CIQuoteDetails[i],cI.quoteDetails.CIQuote.CIQuoteDetails[0].suminsured);
						if (cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationWithProposer != 'KID' && cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationWithProposer != 'SELF') {
							cS.otherFamilyConstruct = [];
							for (j = 0; j < cS.sumAmounts.length; j++) {
								if (parseInt(cS.quoteDetails.CSQuote.CSQuoteDetails[0].suminsured) >= parseInt(cS.sumAmounts[j].amount)) {
									cS.otherFamilyConstruct.push(cS.sumAmounts[j]);
								}
							}
						}
					}
					cS.calculatePremium();
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": "Some error ocurred.",
						"gtagPostiveFunction": "click-button, cs-quote , service-fails[GetQuoteDetails]",
						"gtagCrossFunction": "click-button,  cs-quote ,service-fails[GetQuoteDetails]",
						"gtagNegativeFunction": "click-button, cs-quote , service-fails[GetQuoteDetails]",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true
					}
				}
			}, function (err) {

			});
	}

	cS.fetchQuoteDetails();

	/* End of fetching quote details */

	cS.familyConstructSumInsured = function (insuredMember) {
		insuredMember.suminsured = 1000000;
		cS.otherFamilyConstruct = [];
		var insuredMemberVal = angular.isObject(insuredMember);
		if (!insuredMemberVal) {
			cS.sumAmounts.forEach(function (e) {
				if (parseInt(e.amount) <= parseInt(insuredMember)) {
					cS.otherFamilyConstruct.push(e);
				}
			});
			if (insuredMember <= 1500000) {
				cS.kidAmount = [];
				cS.sumAmounts.forEach(function (e) {
					if (parseInt(e.amount) <= insuredMember) {
						cS.kidAmount.push(e);
					}
				});
			}
			for (var i = 0; i < cS.quoteDetails.CSQuote.CSQuoteDetails.length; i++) {
				if (cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationWithProposer == "SPOUSE") {
					if (insuredMember == 2500000 || insuredMember == 1500000) {
						cS.otherFamilyConstruct.forEach(function (e) {
							if (parseInt(e.amount) < parseInt(insuredMember / 2)) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = e.amount;
							}
						});
					} else {
						cS.otherFamilyConstruct.forEach(function (e) {
							if (parseInt(e.amount) <= parseInt(insuredMember / 2)) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = e.amount;

							} else if (insuredMember >= 10000000) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = 3000000;

							} else if (insuredMember < 1000000) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = 500000;

							}
						});

					}
				}
				else if (cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationWithProposer == "FATHER" || cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationWithProposer == "FATHER-IN-LAW" || cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationWithProposer == "MOTHER" || cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationWithProposer == "MOTHER-IN-LAW") {
					if (insuredMember == 1500000) {
						cS.otherFamilyConstruct.forEach(function (e) {
							if (parseInt(e.amount) < parseInt(insuredMember / 2)) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = e.amount;
							}
						});
					} else {
						cS.otherFamilyConstruct.forEach(function (e) {
							if (parseInt(e.amount) <= parseInt(insuredMember / 2)) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = e.amount;

							} else if (insuredMember >= 10000000) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = 3000000;

							} else if (insuredMember < 1000000) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = 500000;

							} else if (insuredMember > 2000000) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = 1000000;

							}
						});

					}
				}
				else if (cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationWithProposer == "KID") {
					if (insuredMember <= 1500000) {
						cS.kidAmount = [];
						cS.sumAmounts.forEach(function (e) {
							if (parseInt(e.amount) <= insuredMember) {
								cS.kidAmount.push(e);
							}
						});
					}
					if (insuredMember == 2500000 || insuredMember == 1500000) {
						cS.otherFamilyConstruct.forEach(function (e) {
							if (parseInt(e.amount) < parseInt(insuredMember / 2)) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = e.amount;
							}
						});
					} else {
						cS.otherFamilyConstruct.forEach(function (e) {
							if (parseInt(e.amount) <= parseInt(insuredMember / 2)) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = e.amount;

							} else if (insuredMember >= 3000000) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = 1500000;

							} else if (insuredMember < 1000000) {
								cS.quoteDetails.CSQuote.CSQuoteDetails[i].suminsured = 500000;

							}
						});

					}
				}
			}
		}
	}

	/* To Fetch Sum Insured Data */

	aS.getData("assets/data/sum-insured.json", "", false, {
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(function (data) {
			if (data.ResponseCode == 1) {
				cS.sumAmounts = JSON.parse(JSON.stringify(data.ResponseData));
				cS.sumAmounts.forEach(function (e) {
					if (e.amount <= 1500000) {
						cS.kidAmount.push(e);
					}
				});
				cS.sumAmounts.forEach(function (e) {
					if (e.amount <= 2500000) {
						cS.otherFamilyConstruct.push(e);
					}
				});

				//loadOwlCarousel();
			}
		}, function (err) {

		})

	/* End of fetching sum insured data */


	/* Change gender event */

	cS.changeGender = function (member) {
		angular.forEach(cS.membersDetails, function (v, i) {
			if (v.RelationWithProposer == "SELF") {
				v.Gender = member.gender;
				cS.addUpdateMember(angular.copy(v), i - 1);
			} else if (v.RelationWithProposer == "SPOUSE") {
				(member.gender == "1") ? v.Gender = 0 : v.Gender = 1;
				cS.addUpdateMember(angular.copy(v), i - 1);
			}
		});
	}

	/* End of change gender event */


	/* Update age of particular member */

	cS.updateAge = function (member, index) {
		for (var i = 0; i < cS.membersDetails.length; i++) {
			if (member.RelationType == cS.membersDetails[i].RelationType) {
				cS.membersDetails[i].Age = member.AGE;
				cS.addUpdateMember(cS.membersDetails[i], index);
				break;
			}
		}
	}

	/* End of updating age of particular member */


	/* To delete particular member */

	cS.cSDeleteMember = function (member, ind) {
		if (cS.membersDetails.length == 2) {
			$rootScope.alertConfiguration('E', "You cannot delete this member.", "delete_member_alert");
			return false;
		}
		for (var i = 0; i < cS.membersDetails.length; i++) {
			if (member.RelationType == cS.membersDetails[i].RelationType) {
				cS.deleteMember(cS.membersDetails[i], ind);
				break;
			}
		}
	}

	/* End of deleting particular member */


	/* Update soft details data */

	cS.updateSoftDetails = function (type, member, index) {
		if (type == "DeleteMember" && member.RelationWithProposer != 'KID') {
			cS.initSlider = false;
			//cS.quoteDetails.CSQuote.CSQuoteDetails.splice(index,1);
			for (var i = 0; i < cS.quoteDetails.CSQuote.CSQuoteDetails.length; i++) {
				if (member.RelationType == cS.quoteDetails.CSQuote.CSQuoteDetails[i].RelationType) {
					cS.quoteDetails.CSQuote.CSQuoteDetails.splice(i, 1);
				}
			}
			cSCalculatePremiumParams.CS.CSPremiumList = cS.quoteDetails.CSQuote.CSQuoteDetails;
			cS.calculatePremium(cSCalculatePremiumParams);
			$timeout(function () {
				loadOwlCarousel();
			}, 300);
		} else if (type == 'DeleteMember' && member.RelationWithProposer == 'KID') {
			cS.initSlider = false;
			cS.fetchQuoteDetails();
		} else if (type == "UpdateMember") {
			cS.quoteDetails.CSQuote.CSQuoteDetails[index].AGE = member.Age;
			cS.calculatePremium(cSCalculatePremiumParams);
		} else if (type == "AddMember") {
			cS.initSlider = false;
			var sumInsured;
			if (member.RelationWithProposer == "SELF") {
				sumInsured = 2500000;
			} else if (member.RelationWithProposer == "SPOUSE") {
				if (quoteObjref.suminsured <= 2500000) {
					sumInsured = 1000000;
				}
				if (quoteObjref.suminsured <= 1000000) {
					sumInsured = 500000;
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
				// cS.familyConstructSumInsured(quoteObjref.suminsured);
			} else if (member.RelationWithProposer == "FATHER" || member.RelationWithProposer == "MOTHER" || member.RelationWithProposer == "FATHER-IN-LAW" || member.RelationWithProposer == "MOTHER-IN-LAW") {
				if (quoteObjref.suminsured >= 3000000 || quoteObjref.suminsured <= 2500000) {
					sumInsured = 1000000;
				}
				if (quoteObjref.suminsured <= 1000000) {
					sumInsured = 500000;
				}
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
			cS.quoteDetails.CSQuote.CSQuoteDetails.push(newMember);
			cS.calculatePremium(cSCalculatePremiumParams);
			$timeout(function () {
				loadOwlCarousel();
			}, 300);
		}
	}

	/* End of updating soft details data */


	/* To manage kids sum insured */

	function manageKidsSumInsured(sum) {
		if (sum < 1500000 && sum > 500000) {
			return 500000;
		} else if (sum < 3000000 && sum > 1500000) {
			return 1500000;
		} else {
			return 1500000;
		}
	}

	/* End of managing kids sum insured */


	/* To display popup whether person is earning or not */

	function isEarningPerson(member, sum, index) {
		if ((member !== "KID" && cS.quoteDetails.CSQuote.CSQuoteDetails[index].showAnnualIncome == false) || cS.quoteDetails.CSQuote.CSQuoteDetails[index].showAnnualIncome == undefined) {
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
						cS.quoteDetails.CSQuote.CSQuoteDetails[index].showAnnualIncome = true;
						cS.quoteDetails.CSQuote.CSQuoteDetails[index].EarningNonEarning = "Earning";

					}, 200);
				},
				"negativeFunction": function () {
					cS.quoteDetails.CSQuote.CSQuoteDetails[index].EarningNonEarning = "Non Earning";
					if (member == "SELF" || member == "SPOUSE") {
						if (quoteObjref.suminsured > 3000000) {
							cS.quoteDetails.CSQuote.CSQuoteDetails[index].suminsured = 1000000;
							cS.familyConstructSumInsured(quoteObjref.suminsured);
						} else {
							cS.quoteDetails.CSQuote.CSQuoteDetails[index].suminsured = 1000000;
							cS.familyConstructSumInsured(quoteObjref.suminsured);
						}
					} else if (member == "FATHER" || member == "MOTHER" || member == "FATHER-IN-LAW" || member == "MOTHER-IN-LAW") {
						var parentsSI = angular.copy(quoteObjref.suminsured / 2);
						if (parentsSI > 1000000) {
							cS.quoteDetails.CSQuote.CSQuoteDetails[index].suminsured = 1000000;
						} else if (parentsSI < 500000) {
							cS.quoteDetails.CSQuote.CSQuoteDetails[index].suminsured = 500000;
						}
					} else {
						cS.quoteDetails.CSQuote.CSQuoteDetails[index].suminsured = manageKidsSumInsured(quoteObjref.suminsured);
					}
					cS.calculatePremium(cSCalculatePremiumParams);
				}
			}
		} else {
			cS.quoteDetails.CSQuote.CSQuoteDetails[index].suminsured = sum;
			cS.changeAnnualIncome(cS.quoteDetails.CSQuote.CSQuoteDetails[index]);
		}
	}
	/* End of displaying popup whether person is earning or not */


	/* Sum insured dropdown change event */

	cS.calculateSumInsured = function (member, sum, index) {
		if (member.toLowerCase() == "self") {
			cS.familyConstructSumInsured(sum);
			if (sum < 3000000) {
				angular.forEach(cS.quoteDetails.CSQuote.CSQuoteDetails, function (v, i) {
					if (v.RelationWithProposer == "SPOUSE" || v.RelationWithProposer == "PROPOSER") {
						v.suminsured = sum;
					} else if (v.RelationWithProposer == "FATHER" || v.RelationWithProposer == "MOTHER" || v.RelationWithProposer == "FATHER-IN-LAW" || v.RelationWithProposer == "MOTHER-IN-LAW") {
						var parentsSI = angular.copy(sum / 2);
						if (member.suminsured > 1000000) {
							isEarningPerson(member, sum, index);
						}
						// if(parentsSI > 1000000){
						//     v.suminsured = 100000;
						// }
						// else if(parentsSI < 500000){
						//     v.suminsured = 500000;
					} else if (v.RelationWithProposer == "KID") {
						v = manageKidsSumInsured(sum);
					}
				})
			} else {
				angular.forEach(cS.quoteDetails.CSQuote.CSQuoteDetails, function (v, i) {
					if (v.RelationWithProposer == "SELF") {
						cS.otherSI = v.suminsured / 2;
					}
				});
				if (cS.otherSI <= sum || cS.otherSI > 3000000) {
					isEarningPerson(member, sum, index);
				}
			}
			$timeout(function () {
				cS.calculatePremium(cSCalculatePremiumParams);
			}, 500);
		} else {
			var sumCriteria;
			var sInsured;
			if (member == "FATHER" || member == "MOTHER" || member == "FATHER-IN-LAW" || member == "MOTHER-IN-LAW") {
				if (sum > 1000000) {
					isEarningPerson(member, sum, index);
				}
				var parentsSI = angular.copy(quoteObjref.suminsured / 2);
				if (parentsSI > 1000000) {
					cS.quoteDetails.CSQuote.CSQuoteDetails[index].suminsured = 1000000;
				} else if (parentsSI < 500000) {
					cS.quoteDetails.CSQuote.CSQuoteDetails[index].suminsured = 500000;
				}
			} else if (member == "SPOUSE") {
				sInsured = quoteObjref.suminsured;
			} else if (member == "KID") {
				sInsured = manageKidsSumInsured(quoteObjref.suminsured);
			}
			selfData.suminsured > sInsured ? sumCriteria = sInsured : sumCriteria = selfData.suminsured;
			if (parseInt(sum) > parseInt(sumCriteria)) {
				proposarSIequalTofamilyMemberSI(member, sum, index);
				//isEarningPerson(member,sum,index);
			} else {
				angular.forEach(cS.quoteDetails.CSQuote.CSQuoteDetails, function (v, i) {
					if (v.RelationWithProposer == "SELF") {
						cS.otherSI = v.suminsured / 2;
					}
				});
				if (cS.otherSI <= sum || cS.otherSI > 3000000) {
					isEarningPerson(member, sum, index);
				}
				// isEarningPerson(member,sum,index);
				$timeout(function () {
					cS.calculatePremium(cSCalculatePremiumParams);
				}, 500)
			}
		}
	}

	/* End of sum insured dropdown change event */

	/* To display family member should take SI is equal to proposar start*/
	function proposarSIequalTofamilyMemberSI(member, sum, index) {
		$rootScope.alertData = {
			"modalClass": "regular-alert",
			"modalHeader": "Confirm",
			"modalBodyText": "<p>Is " + member + " should take Sum Insurred equal to Proposar </p>",
			"showCancelBtn": false,
			"modalSuccessText": "OK",
			// "modalCancelText" : "No",
			"showAlertModal": true,
			"hideCloseBtn": true,
			"positiveFunction": function () {
				$timeout(function () {
					cS.quoteDetails.CSQuote.CSQuoteDetails[index].suminsured = 500000;
				}, 200);
			},
		}
	}
	/* To display family member should take SI is equal to proposar end*/


	/* Annual Income change event */

	cS.changeAnnualIncome = function (insuredMember) {
		if (insuredMember.AnnualIncome > 41663) {
			var isProceed = true;
			var maxInsured;
			angular.forEach(cS.sumAmounts, function (v, i) {
				if (isProceed && v[cS.productType]) {
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
					"modalBodyText": "Sum Insured eligibility is 12 times the Annual Income (" + $filter('INR')(cS.sumAmounts[maxInsured].amount) + ").",
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"positiveFunction": function () {
						insuredMember.suminsured = cS.sumAmounts[maxInsured].amount;
						if (insuredMember.RelationWithProposer == "SELF") {
							cS.calculateSumInsured(insuredMember.RelationWithProposer, insuredMember.suminsured, insuredMember.objIndex);
						}
					}
				}
			} else if (insuredMember.suminsured != cS.sumAmounts[maxInsured].amount) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "You are eligible for Sum Insured up to ₹​ " + $filter('INR')(cS.sumAmounts[maxInsured].amount) + ". Do you wish to continue?",
					"showCancelBtn": true,
					"modalSuccessText": "Yes",
					"showAlertModal": true,
					"modalCancelText": "No",
					"positiveFunction": function () {
						insuredMember.suminsured = cS.sumAmounts[maxInsured].amount;
						cS.calculatePremium(cSCalculatePremiumParams);
					},
					"negativeFunction": function () {
						cS.calculatePremium(cSCalculatePremiumParams);
					}
				}
			}

		} else {
			errorAlert = errorAlert + "<ul>";
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Success",
				"modalBodyText": "<div><p class='modal-bind-text'>You are not eligible for this product based on declared income.</p></div><ul><li>Minimum Annual Income required of Cancer Secure is 42,000.</li></ul>",
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

	/* To decide active member */

	function decideActiveMember(ProductInsuredDetail, calculatePremiumSubParam, rFBType) {
		for (var i = 0; i < ProductInsuredDetail.length; i++) {
			if (ProductInsuredDetail[i].ProductCode == rFBType) {
				calculatePremiumParams[rFBType][calculatePremiumSubParam] = ProductInsuredDetail[i].InsuredMembers;
				projectPlans[rFBType + "Plan"] = ProductInsuredDetail[i].Plan;
				for (var j = 0; j < calculatePremiumParams[rFBType][calculatePremiumSubParam].length; j++) {
					if (calculatePremiumParams[rFBType][calculatePremiumSubParam][j].RelationType == 'PROPOSER' || calculatePremiumParams[rFBType][calculatePremiumSubParam][j].RelationType == 'S') {
						selfObj[rFBType] = calculatePremiumParams[rFBType][calculatePremiumSubParam][j];
					}
					if (calculatePremiumParams[rFBType][calculatePremiumSubParam][j].RelationType == rID.activeMember) {
						currentActiveMember = calculatePremiumParams[rFBType][calculatePremiumSubParam][j];
						curActMember[rFBType] = calculatePremiumParams[rFBType][calculatePremiumSubParam][j];
					}
				}
				break;
			}
		}
	}

	/* End of decidinga active member */

	/* To calculate premium */

	cS.calculatePremium = function (data) {
		delete cS.quoteDetails.PremiumDetail;
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", cSCalculatePremiumParams, false, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					cS.quoteDetails.PremiumDetail = data.ResponseData;
					cS.quoteDetails.PremiumDetail.TotalPremium = 0;
					angular.forEach(cS.quoteDetails.PremiumDetail.ProductPremium, function (v, i) {
						if (parseInt(v.Premium) <= 0) {
							cS.hideSubmitButton = false;
						}
					})
					cS.tenureSaving = data.ResponseData.TenureSavings;
					if (!angular.isUndefined(cS.CSPremium)) {
						cS.fetchPremiumsSecondary();
					}
					for (var i = 0; i < cS.quoteDetails.PremiumDetail.ProductPremium.length; i++) {
						cS.quoteDetails.PremiumDetail.TotalPremium = parseInt(cS.quoteDetails.PremiumDetail.TotalPremium) + parseInt(cS.quoteDetails.PremiumDetail.ProductPremium[i].Premium);
						if (cS.quoteDetails.PremiumDetail.ProductPremium[i].ProductCode == 'CI') {
							cS.ciActPremium = cS.quoteDetails.PremiumDetail.ProductPremium[i].Premium;
						} else if (cS.quoteDetails.PremiumDetail.ProductPremium[i].ProductCode == 'PA') {
							cS.paActPremium = cS.quoteDetails.PremiumDetail.ProductPremium[i].Premium;
						}
					}
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.ResponseMessage,
						"modalBodyText": "Some error ocurred.",
						"gtagPostiveFunction": "click-button, cs-quote , service-fails[GetPremium]",
						"gtagCrossFunction": "click-button,  cs-quote ,service-fails[GetPremium]",
						"gtagNegativeFunction": "click-button, cs-quote , service-fails[GetPremium]",
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

	cS.tenureChange = function () {
		$rootScope.callGtag('click-radio', 'quote', 'cs-quote_tenure[' + cS.tenureSelect + ']');
		aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateTenure", {
			"ReferenceNumber": sessionStorage.getItem('rid'),
			"Tenure": cS.tenureSelect
		}, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				if (data.ResponseCode == 1) {
					for (var i = 0; i < cS.quoteDetails.CSQuote.CSQuoteDetails.length; i++) {
						cS.quoteDetails.CSQuote.CSQuoteDetails[i].TENURE = cS.tenureSelect;
					}
					cS.calculatePremium(cSCalculatePremiumParams);
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.ResponseMessage,
						"gtagPostiveFunction": "click-button, cs-quote , service-fails[UpdateTenure]",
						"gtagCrossFunction": "click-button,  cs-quote ,service-fails[UpdateTenure]",
						"gtagNegativeFunction": "click-button, cs-quote , service-fails[UpdateTenure]",
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

	cS.changePDL = function (cashLimit, index) {
		if (cashLimit == "") {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Alert",
				"modalBodyText": "Hospital Cash Benefit for " + cS.quoteDetails.CSQuote.CSQuoteDetails[index].RelationWithProposer + " has been removed.",
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true
			}
			cS.quoteDetails.CSQuote.CSQuoteDetails[index].No_Of_days = "";
			cS.quoteDetails.CSQuote.CSQuoteDetails[index].HCB = "N";
			cS.calculatePremium(cSCalculatePremiumParams);
		} else {
			cS.quoteDetails.CSQuote.CSQuoteDetails[index].HCB = "Y";
			$timeout(function () {
				(cS.quoteDetails.CSQuote.CSQuoteDetails[index].No_Of_days != "") ? cS.calculatePremium(cSCalculatePremiumParams) : "";
			}, 600);
		}
	}

	/* End of Change event of daily cash limit in HCB */


	/* To change number of days in HCB */

	cS.changeDays = function (days, index) {
		if (days == "") {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Alert",
				"modalBodyText": "Please select proper days value.",
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true
			}
			cS.quoteDetails.CSQuote.CSQuoteDetails[index].HCB = "N";
			cS.quoteDetails.CSQuote.CSQuoteDetails[index].PDL = "";
			cS.calculatePremium(cSCalculatePremiumParams);
		} else {
			angular.forEach(cS.quoteDetails.CSQuote.CSQuoteDetails, function (v, i) {
				if (v.PDL != "") {
					v.No_Of_days = days;
					v.HCB = "Y";
				}
			});
			$timeout(function () {
				cS.calculatePremium(cSCalculatePremiumParams);
			}, 600);
		}
	}

	/* End of changing number of days in HCB */


	/* Removing Hospital Cash Benefit of Particular Member */

	cS.removeHCB = function (member) {
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
				cS.calculatePremium(cSCalculatePremiumParams);
			}
		}
	}

	/* End of removing hospital cash benefit of Particular Member */


	/* To duplicate HCB */

	cS.duplicateHCB = function () {
		if (angular.isUndefined(cS.duplicatePDL) || angular.isUndefined(cS.duplicatenNOD)) {
			return false;
		}
		angular.forEach(cS.quoteDetails.CSQuote.CSQuoteDetails, function (v, i) {
			v.PDL = cS.duplicatePDL;
			v.No_Of_days = cS.duplicatenNOD;
			v.HCB = "Y";
		});
		cS.calculatePremium(cSCalculatePremiumParams);
	}

	/* End of duplicating HCB */


	/* To select particular checkbox section */

	cS.changeSection = function (val, param) {
		angular.forEach(cS.quoteDetails.CSQuote.CSQuoteDetails, function (v, i) {
			v[param] = val;
		});
		cS.calculatePremium(cSCalculatePremiumParams);
	}

	/* End of selecting particular checkbox section */


	/* To Save Quote Details */

	function saveQuoteDetails(event) {
		var lemeiskData = cS.quoteDetails.CSQuote.CSQuoteDetails

		$rootScope.leminiskObj = {
			"memberArray": lemeiskData,
			"preminumObj": cS.quoteDetails.PremiumDetail.TotalPremium
		}

		$rootScope.lemniskCodeExcute($location.$$path);

		var lemniskObj = {
			"Selected Members": cS.membersSelected,
			"PlanName": cS.planName,
			"PolicyTenure": cS.tenureSelect,
			//"PolicyType": cS.quoteDetails.CSQuote.PolicyType,
			"Premium Amount": cS.quoteDetails.PremiumDetail.TotalPremium
		};
		$rootScope.lemniskTrack("", "", lemniskObj);

		aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateQuoteDetails", {
			"ReferenceNumber": sessionStorage.getItem('rid'),
			"CSUpdateQuote": {
				"CSQuoteDetails": cS.quoteDetails.CSQuote.CSQuoteDetails
			}
		}, true, {
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then(function (data) {
				event.target.innerText = "Submit";
				event.target.disabled = false;
				if (data.ResponseCode == 1) {
					if (cS.crossSell) {
						if (cS.CI == 'Y') {
							cS.productSelctedInCross = cS.productSelctedInCross + '-CI'
						} if (cS.PA == 'Y') {
							cS.productSelctedInCross = cS.productSelctedInCross + '-PA'
						}
						sessionStorage.setItem('productSelctedInCross', cS.productSelctedInCross)
						$location.url('cross-sell-proposer-details?products=' + cS.productSelctedInCross);
					} else {
						$location.url('rfb-proposer-details');
					}
				} else {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Error",
						"modalBodyText": data.ResponseMessage,
						"gtagPostiveFunction": "click-button, cs-quote , service-fails[UpdateQuoteDetails]",
						"gtagCrossFunction": "click-button,  cs-quote ,service-fails[UpdateQuoteDetails]",
						"gtagNegativeFunction": "click-button, cs-quote , service-fails[UpdateQuoteDetails]",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true
					}
				}
			}, function (err) {
				event.target.innerText = "Submit";
				event.target.disabled = false;
			});
	}

	/* Ending of saving quote details */


	/* CS Quote save button event */

	cS.cSQuoteSubmit = function (event) {
		event.target.innerText = "Submitting...";
		event.target.disabled = true;
		var errors = "<ul>";
		var errorsCount = 0;
		var hcbPresent = false;
		angular.forEach(cS.quoteDetails.CSQuote.CSQuoteDetails, function (v, i) {
			console.log(v);
			if (v.HCB == "Y") {
				hcbPresent = true;
			}
			if ((v.suminsured >= 4000000 || v.EarningNonEarning == "Earning") && v.AnnualIncome < 42000) {
				errors = errors + "<li><p>Please enter valid Annual Income of " + v.RelationWithProposer + ".</p></li>";
				errorsCount = errorsCount + 1;
			}
			if (v.HCB == "Y" && v.No_Of_days == "") {
				errors = errors + "<li><p>Please select No. of days of " + v.RelationWithProposer + ".</p></li>";
				errorsCount = errorsCount + 1;
			}
			if (v.HCB == "Y" && v.PDL == "") {
				errors = errors + "<li><p>Please  of " + v.RelationWithProposer + ".</p></li>";
				errorsCount = errorsCount + 1;
			}
		});
		if (cS.hCBCollapse == 'Y' && !hcbPresent) {
			errors = errors + "<li><p>Please select Hospital Cash Benefit for atleast one member.</p></li>";
			errorsCount = errorsCount + 1;
		}
		if (errorsCount == 0) {
			saveQuoteDetails(event);
		} else {
			errors = errors + "</ul>";
			event.target.innerText = "Submit";
			event.target.disabled = false;
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

	/* End of CS quote save button event */


}]);
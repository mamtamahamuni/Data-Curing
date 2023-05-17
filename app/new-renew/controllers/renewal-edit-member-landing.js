/**   
	Module: Renewal Edit Member Details Landing Page Controller (This module enables user to edit policy member details (first name, last name, dob, etc.) )
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';

var renewalEditMemberLandingApp = angular.module("renewalEditMemberLandingModule", []);

renewalEditMemberLandingApp.controller("renewal-edit-member-landing", ['ABHI_CONFIG', '$scope', '$location', 'RenewService', '$sessionStorage', '$timeout', 'productValidationService', '$rootScope','appService', function (ABHI_CONFIG, $scope, $location, RenewService, $sessionStorage, $timeout, productValidationService, $rootScope,appService) {
    var aS = appService;
	$scope.retailRiderQuest=[];
	$scope.userpolicy = JSON.parse(sessionStorage.getItem("userData"));
	$scope.productSelected = $scope.userpolicy.ProductName.split(' ').join('');
	$scope.productSelectedArr = $scope.userpolicy.ProductName.split(' ').join('')+"Arr";
	$scope.productCode = "";
	$scope.isDisabled = true;
	$scope.userAge = "";
	$scope.underAge = true;
	$scope.oPDArray = [];
	for (var i = 5000; i <= 20000; i = i + 1000) {
        //var objVal = ''
        $scope.oPDArray.push({
            "key": String(i),
            "val":  String(i)
        })
    }
	$scope.currentUrl = $location.path();
	console.log($scope.currentUrl, "$scope.currentUrl");
	$scope.productJson={
		'ActivAssure': [ "isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isRelation", "isS-NCB", "isURSI", 'isGender', "isSI"], //isID "isRU", "isAHB",  "isCHB" JBDM-3448
		'ActivHealth': ["isProf", "isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isRelation", "isOccupation", "isDesignation", "isDuty", "isHazardous", "isSI", "isProfessional", "isGender"], //isID, "isME", "isOPDC", "isOpCovers","isCovers",
		'ActivHealthV2': ["isProf","isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isRelation", "isOccupation", "isDesignation", "isDuty", "isHazardous", "isSI", "isProfessional","isGender"], //isID,"isME", "isWMC", "isOPDC", "isOpCovers","isCovers",
		'ActivSecure': ["isProf", "isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile",  "isRelation", "isOccupation", "isDesignation", "isDuty", "isHazardous", "isSI", "isGender", "isCovers"], //isID, "isHCB"
		'SuperTopUp': ["isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile",  "isRelation","isSI", "isDeduct", "isGender", "isProf", "isOccupation", "isDesignation", "isDuty"], //isID
		'ActivCareV2': ["isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isRelation", "isGender", "isSI"],
		'GlobalHealthSecure-Revised': ["isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isMobile","isSI", "isGender", "isWaiting", "isCovers"],
		'ArogyaSanjeevaniPolicy':["isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isMobile","isSI", "isRelation","isPincode", "isPan", "isGender"],
		'POSActivSecure':["isProf", "isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile",  "isRelation", "isOccupation", "isDesignation", "isDuty", "isHazardous", "isSI", "isGender", "isDCB", "isCovers"], //isID, "isHCB"
		'POSActivAssure':[ "isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isRelation", "isS-NCB", "isURSI", 'isGender', "isSI"], //isID

		'ActivHealthArr':['Personal Accident Cover (AD, PTD)', 'Critical Illness Cover','International Coverage for major illnesses','Waiver of Mandatory Co-payment','Waiver of mandatory co-payment', 'OPD Expenses', 'Hospital cash Benefit', 'Maternity Expenses','PPN Discount'],
		'ActivHealthV2Arr':['Personal Accident Cover (AD, PTD)', 'Critical Illness Cover','International Coverage for major illnesses','Waiver of Mandatory Co-payment', 'Waiver of mandatory co-payment', 'OPD Expenses', 'Hospital cash Benefit', 'Maternity Expenses','PPN Discount'],
		'ActivAssureArr': ['Super NCB', 'Unlimited Reload of Sum Insured', 'AHB', 'Cancer Hospitalization Booster', 'Room Type'],
		'SuperTopUpArr': ['Personal Accident Cover (AD, PTD)', 'Critical Illness Cover', 'Cancer Hospitalization Booster'],
		'ActivSecureArr': ['Wellness Coach', 'Wellness coach','Second E opinion', 'Hospital cash Benefit', 'Days per Policy Year limit', 'Second E-Opinion on Critical Illnesses', 'Second E Opinion on major illnesses', 'Temporary Total Disablement (TTD)', 'Accidental in-patient Hospitalization Cover', 'Broken Bones Benefit', 'Coma Benefit', 'Burns Benefits', 'Accidental Medical Expenses','Adventure Sports Cover','Worldwide Emergency Assistance Services (including Air Ambulance)', 'EMI Protect', 'Loan Protect', 'Second E Opinion', 'Wellness Coach'],
		'POSActivSecureArr': ['Wellness Coach', 'Wellness coach','Second E opinion', 'Hospital cash Benefit', 'Days per Policy Year limit', 'Second E-Opinion on Critical Illnesses', 'Second E Opinion on major illnesses'],
		'POSActivAssureArr': ['Super NCB', 'Unlimited Reload of Sum Insured', 'AHB', 'Cancer Hospitalization Booster', 'Room Type'],
		'ActivCareV2Arr': []
	}

	$scope.setActivCareV2CoverArr = function(){
		const ACCArr = ["OC-RU","OC-PN","OC-NAH", "OC-LE", "OC-PME", "OC-AHC"]
		if($scope.currentUrl == "/renewal-edit-optional-covers" && $scope.productSelected =="ActivCareV2"){
				$scope.productJson[$scope.productSelected].push(...ACCArr);
				$scope.productJson[$scope.productSelectedArr] =['Room Type', 'Room Upgrade', 'Nursing at Home', 'Portable Medical Equipment', 'Portable medical equipment', 'Lifestyle support equipment', 'Advance Health Check-up']
		}
		else{
			for (let i = 0; i < $scope.productJson[$scope.productSelected].length; i++) {
				let index = ACCArr.indexOf($scope.productJson[$scope.productSelected][i]);
				if (index > -1) { // only splice array when item is found in ACCArr
					$scope.productJson[$scope.productSelectedArr].splice(index, 1); // 2nd parameter means remove one item only
				}
			}
			$scope.productJson[$scope.productSelectedArr] =[]
		}
	}

	$scope.getActivSecureCICode = function(SP) {
		switch (SP) {
			case "Plan 1":
				return "ci1"
		
	
			case "Plan 2":
				return "ci2"
	
	
			case "Plan 3":
				return "ci3"
		
			default:
				break;
		}
	}

	$scope.setOPForPA= function(){
		const APCArr = ["isDCB","OC-WC", "OC-TTDB", "OC-AIH", "OC-CB", "OC-BBB", "OC-BB", "OC-AS", "OC-AME", "OC-WEA", "OC-EMI-p", "OC-loan-p"];
		$scope.productJson[$scope.productSelected].push(...APCArr);
	}
	
	
	$scope.getActivSecurePACode = function(SP) {
		switch (SP) {
			case "Plan 1":
				return "PA1"
	
			case "Plan 2":
				return "PA2"
	
	
			case "Plan 3":
				return "PA3"
	
			case "Plan 4":
				$scope.setOPForPA();
				return "PA4"
	
			case "Plan 5":
				$scope.setOPForPA();
				return "PA5"
		
			default:
				break;
		}
	}

	$scope.getActivHealthCode =function() {
		let getCode = $scope.userpolicy.PlanName.split(" ")
		if(getCode[getCode.length - 1] != "Premiere"){
			$scope.productJson['ActivHealth'] = [...$scope.productJson['ActivHealth'],...['isPAC','isCIC','isICMI', "isHCB", "isOpCovers","isCovers","isWMC", "isRoom"]];
			$scope.productJson['ActivHealthV2'] = [...$scope.productJson['ActivHealthV2'],...['isPAC','isCIC','isICMI', "isHCB", "isOpCovers","isCovers", "isWMC", "isRoom"]];
		}
		
		if(getCode[getCode.length - 1] == "Premiere"){
			$scope.productJson['ActivHealth'] = [...$scope.productJson['ActivHealth'],...['isPAC','isCIC','isICMI', "isOpCovers","isCovers"]];
			$scope.productJson['ActivHealthV2'] = [...$scope.productJson['ActivHealthV2'],...['isPAC','isCIC','isICMI', "isOpCovers","isCovers"]];
			return getCode[getCode.length - 1].slice(0,getCode[getCode.length - 1].length-1)
		}
		return getCode[getCode.length - 1];
	}

	switch ($scope.productSelected) {
		case "SuperTopUp":
			$scope.productCode = "ST"
			break;
		
		case "ActivAssure":
			$scope.productCode = "DIAMOND"
			break;

		case "ActivHealthV2":
		case "ActivHealth":
			$scope.productCode = $scope.getActivHealthCode()
			$scope.pAPL = "PAPL"+$scope.productCode;
			$scope.cIPL = "CIPL"+$scope.productCode;
			$scope.iCMIPL = "ICMIPL"+$scope.productCode;
			break;
		
		case "ActivSecure":
			if($scope.userpolicy.ProductCode == "4218"){
				$scope.productCode = "CS";
				$scope.productJson[$scope.productSelected].push(...["isDCB","OC-WC", "OC-SP"]);
			}
			if($scope.userpolicy.ProductCode == "4111"){
				$scope.productCode = $scope.getActivSecurePACode($scope.userpolicy.PlanName);
			}
			else{
				$scope.productCode = $scope.getActivSecureCICode($scope.userpolicy.PlanName);
				$scope.productJson[$scope.productSelected].push(...["isDCB","OC-WC", "OC-SP"]);
			}
		break;

		case "ActivCareV2":
		$scope.setActivCareV2CoverArr();
		break;

	}


	if($scope.productSelected != 'ActivHealth' && $scope.productSelected != 'ActivHealthV2'){
		$scope.CBHAmtList = ["500", "1000", "2000", "3000", "4000", "5000", "10000"];
	}
	else{
		$scope.CBHAmtList = [];
		for (var i = 500; i <= 5000; i = i + 500) {
			//var objVal = ''
			$scope.CBHAmtList.push(String(i));
		}
	}

	$scope.TTDB_SIList = ["1000", "2000", "3000", "4000", "5000", "7500", "10000"];
	$scope.BBB_SIList = ["100000", "300000", "500000"];
	
	
	
	/*---- Page Redirection When $sessionStorage.refNo Not Available ----*/

	 /* To Fetch Sum Insured Data */

	 aS.getData("assets/data/sum-insured.json", "", false, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (data) {
            if (data.ResponseCode == 1) {
                $scope.sumAmounts = data.ResponseData;
            } else {

            }
        }, function (err) {

        })


    /* End of fetching sum insured data */

	if ($sessionStorage.refNo == null || $sessionStorage.refNo == 'undefined') {
		$location.path('renewal-renew-policy');
		return false;
	}

	/*---- End of Page Redirection When $sessionStorage.refNo Not Available ----*/
	
	/*---- Data Inilization ----*/
	var insuredMemberDetails = {} // To Store Perticular Insured Member Details
	var DOB = []
	$scope.insuredMemberDetails = {} // To Store Perticular Insured Member Details
	$scope.show = false;
	$scope.emailError = false;
	$scope.productName = $sessionStorage.productName;
	$scope.editMemberForm;
	$scope.occupationType = "Select Occupation"
	$scope.occupation = "";
	$scope.upsellFlag = $sessionStorage.upsellFlag;

	
	/* Occupation Dropdown */

    // $scope.occupationDrop = [{
    //     "PL": true,
    //     "CK": true,
    //     "AS": true,
    //     "key": "O107",
    //     "val": "Govt. Employee"
    // }, {
    //     "PL": true,
    //     "CK": true,
    //     "AS": true,
    //     "key": "O002",
    //     "val": "Private Service"
    // }, {
    //     "PL": true,
    //     "CK": true,
    //     "key": "O109",
    //     "val": "Business"
    // }, {
    //     "AS": true,
    //     "key": "O103",
    //     "val": "Business"
    // }, 
	// // {
    // //     "PL": false,
    // //     "CK": true,
    // //     "AS": true,
    // //     "key": "O005",
    // //     "val": "Retired"
    // // },
	
	// {
    //     "CK": true,
    //     "key": "O111",
    //     "val": "Other"
    // }, {
    //     "AS": true,
    //     "key": "O009",
    //     "val": "Others"
    // }, {
    //     "PL": false,
    //     "key": "O015",
    //     "val": "Architects"
    // }, {
    //     "PL": true,
    //     "key": "O052",
    //     "val": "Employee"
    // }, {
    //     "PL": false,
    //     "key": "O557",
    //     "val": "CA"
    // }, {
    //     "PL": false,
    //     "key": "O558",
    //     "val": "Business"
    // }, {
    //     "PL": true,
    //     "key": "O559",
    //     "val": "Doctor"
    // }, {
    //     "PL": true,
    //     "key": "O560",
    //     "val": "Lawyer"
    // }, {
    //     "PL": true,
    //     "key": "O561",
    //     "val": "Other"
    // }]

	$scope.occupationDrop = [{
        "PL": true,
        "CK": true,
        "AS": true,
        "key": "O108",
        "val": "Government Employee"
    }, {
        "PL": true,
        "CK": true,
        "AS": true,
        "key": "O002",
        "val": "Private Service"
    }, {
        "PL": true,
        "CK": true,
        "key": "O051",
        "val": "business"
    }, {
        "AS": true,
        "key": "O103",
        "val": "business1"
    }, 
	// {
    //     "PL": false,
    //     "CK": true,
    //     "AS": true,
    //     "key": "O005",
    //     "val": "Retired"
    // },
	
	{
        "CK": true,
        "key": "O561",
        "val": "Other"
    }, {
        "AS": true,
        "key": "O009",
        "val": "Others"
    }, {
        "PL": false,
        "key": "O060",
        "val": "Architects"
    }, 
	// {
    //     "PL": true,
    //     "key": "O052",
    //     "val": "Employee"
    // }, 
	{
        "PL": false,
        "key": "O557",
        "val": "CA"
    }, {
        "PL": false,
        "key": "O104",
        "val": "business2"
    }, {
        "PL": true,
        "key": "O057",
        "val": "Doctors"
    }, {
        "PL": true,
        "key": "O058",
        "val": "Lawyers"
    }, {
        "PL": true,
        "key": "O561",
        "val": "Other"
    }]

	$scope.getOptionalPayload = function () {
		$scope.optionalPayload = {
			"ReferenceNo":$sessionStorage.refNo,
			"PolicyNumber":$sessionStorage.policyNo,
			"MemberDetails":[
				{
				  "PACoverFlag": "N",
				  "PACoverSI": "N",
				  "PA_Occupation": "N",
				  "CICoverFlag": "N",
				  "CICoverSI": "N",
				  "ICMICoverFlag": "N",
				  "ICMICoverSI": "N",
				  "MemberID": "",
				  "Relation":"",
					'WOMCoPayment':"N",
				  "HCB": "N",
				  "HCBSI": "N",
				  "DCB": "N",
				  "DCBSI": "N",
				  "OPDExpense": "N",
				  "OPDExpenseSI": "N",
				  "MaternityExpense": "N",
				  "MaternityExpenseSI": "N",
				  "PPNDiscount": "N",
				  "SuperNCB": "N",
				  "UnlimitedReload": "N",
				  "UnlimitedReloadSI": "N",
				  "RoomCover": "N",
				  "CancerHospitalizationCover": "N",
				  "CancerHospitalizationCoverSI": "N",
				  "NursingAtHome": "N",
				  "NursingAtHomeSI": "N",
				  "PortableMedicalEquipment": "N",
				  "PortableMedicalEquipmentSI": "N",
				  "AdvanceHealthCheckup": "N",
				  "AdvanceHealthCheckupSI": "N",
				  "WellnessCoach": "N",
				  "WellnessCoachSI": "N",
				  "SecondOpinion": "N",
				  "SecondOpinionSI": "N",
				  "RoomTypeAnyRoom":"N",
				"RoomTypeSharedRoom":"N",
				"RoomTypesingleRoom":"N",
				  "AHB":"N",
				  "AHBSI":"",
				  "CHBFlag":"N",
				  "CHBSI":"",
				}
			]
			}
	}

	$scope.getOptionalPayload();

		$scope.deducAmounts=[];
	$scope.setDeductable = function (sumi) {
		switch (JSON.stringify(parseInt(sumi))) {
			case "8500000":
				$scope.deducAmounts=["1500000"]
				break
			case "9000000":
				$scope.deducAmounts=["1000000"]
				break
			case "9500000":
			case "500000":
				$scope.deducAmounts=["500000"]
				break
			case "500000":
				$scope.deducAmounts=["500000", "700000"]
				break
			default:
				$scope.deducAmounts=["500000", "700000", "1000000"]
				break
		}

		return $scope.deducAmounts[0];
	}



    /* End of Occupation Dropdown */

	$scope.insuredMember = {
		"ReferenceNo": $sessionStorage.refNo, //Mandatory
		"PolicyNumber": $sessionStorage.policyNo, // Mandatory
		"Salutation": "", // Mandatory
		"FirstName": "", // Mandatory
		"MiddleName": "",
		"LastName": "", // Mandatory
		"Mobile": "",
		"Email": "",
		"DOB": "", // Mandatory
		"day": "", // Mandatory
		"month": "", // Mandatory
		"year": "", // Mandatory
		"Age": "",
		"PanNo":"",
		"Height": "",
		"Weight": "",
		"Occupation": "",
		"Occupation_ID": "",
		"Designation":"",
		"MaritalStatus": "",
		"Gender": "",
		"Relation": "", // Mandatory
		"NomineeFirstName": "",
		"NomineeLastName": "",
		"NomineeDOB": "",
		"NomineeAddress": "",
		"NomineeContactNo": "",
		"NomineeRelation": "",
		"HomeAddress1": "",
		"HomeAddress2": "",
		"HomeAddress3": "",
		"HomeState": "",
		"HomeDistrict": "",
		"HomeCity": "",
		"HomePincode": "",
		"HomeZone": "",
		"Nationality": "Indian",
		"notIndianNational": "N",
		"InitialSumInsured": "",
		"SumInsured": $scope.userpolicy.SumInsured, // Mandatory
		"SumInsuredType": $scope.userpolicy.SumInsuredType,
		"UpSellSumInsured": "",
		"Deductible": "1000000",
		"Chronic": "",
		"CB": "",
		"IDType": "",
		"IDNo": "",
		"AlcoholYN": "N",
		"AlcoholQty": "",
		"SmokeQty": "",
		"PanmasalaQty": "",
		"Others": "",
		"SubstanceQty": "",
		"IsEIAavailable": "N",
		"ApplyEIA": "N",
		"UndergoneAnySurgery": "N",
		"EIAAccountNo": "",
		"PreviousPolicyNumberYN": "",
		"PreviousPolicySumInsured": "",
		"PreviousPolicyClaims": "",
		"PreviousPolicyRejectedYN": "",
		"PreviousPolicyRejectedDetails": "",
		"AnnualIncome":"",
		"NatureOfDuty":"",
		"OccupationNatur":"",
		"RoomType":"",
		
		"PAC":"",
		"CIC":"",
		"ICMI":"",
		"WMC":"",
		"OPDC":"",
		"HCB":"",
		"DCB":"",
		"ME":"",
		"PPN":"",
		"S_NCB":"",
		"URSI":"",
		"RU":"",
		"ABH":"",
		"CBH":"",

		"OC_TTDB":"",
		"OC_BBB":"",
		"OC_BB":"",
		"OC_EMI":"",
		"OC_Loan":"",

		"PAC_copy":"",
		"CIC_copy":"",
		"ICMI_copy":"",
		"WMC_copy":"",
		"OPDC_copy":"",
		"HCB_copy":"",
		"DCB_copy":"",
		"ME_copy":"",
		"PPN_copy":"",
		"S_NCB_copy":"",
		"RU_copy":"",
		"URSI_copy":"",
		"AHB_copy":"",
		"CHB_copy":"",

		"OC_TTDB_copy":"",
		"OC_BBB_copy":"",
		"OC_BB_copy":"",
		"OC_EMI_copy":"",
		"OC_Loan_copy":"",

		"optionalCoverages":[],

		"previousPolicy":"N",
		"previousTreatment":"N",
		"PreviousPolicyNumberYN":"",
		"PreviousPolicyBenefit":"",
		"PreviousPolicyClaims":"N",
		"PreviousPolicyRejectedYN":"N",
		"PreviousPolicyRejectedDetails": "",
		"PreviousPolicyName":"",

		"ChronicTab":"N",
		"diabetes":"N",
		"hypertension":"N",
		"pulmonary":"N",

		"OrganTab":"N",
		"Heart":"N",
		"Lung":"N",
		"ENT":"N",
		"Kidney":"N",
		"Brain":"N",

		"InsuredTab":"N",
		"regularMedical":'N',
		"Surgery":'N',
		"BloodTests":'N',

		"OtherTab":"N",
		"Cancer":"N",
		"Sexually":"N",
		"Disability":"N",
		"BloodDisorder":"N",
		"GeneticDisorder":"N",
		"BirthDefect":"N",
		"Paralysis":"N",
		"AccidentalInjury":"N",

	}

	/*---- End of Data Inilization ----*/

	


	// checkInclude starts
		$scope.checkInclude =function(field) {
			if(($scope.productSelected == "ActivHealth" || $scope.productSelected == "ActivHealthV2") && field == "isWMC" &&  $scope.productCode != "Essential"){
				return false; 
			}
			return $scope.productJson[$scope.productSelected].includes(field);
		}
	// checkInclude ends

	/*-------------------- fetch occupation ------------------------------ */

	 /* End of Occupation Dropdown */

	 $scope.roomArray = ["Single Private A/C Room", "Any Room", "Shared Room"];


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
				$scope.natureDfDuty = data.ResponseData;
			}
		},function(err){
		});

/* End of fetching nature of duty */

	/* Nature of duty functionality */

        /* To Open Nature of Duty Dropdown */

		$scope.openDropdown = function(){
			$('.nature-of-duty').addClass('open');
		}

		/* End of opening nayure of duty dropdown */

		$(document).click(function(event) { 
            if(!$(event.target).closest('.dropdown ').length) {
                if($('.nature-of-duty').hasClass('open')) {
                    $('.nature-of-duty').removeClass('open');
                }
            } 
        });

		/* Reset NOD search */

		$scope.resetNodSearch = function(){
			$timeout(function(){
				$scope.nOD = angular.copy($scope.insuredMember.NatureOfDuty);
				$scope.nODCopy = "";
			},2000);
		}

		/* End of resetting NOD search */

		/* Nature of duty search function */

		$scope.textSearch = function(){
			$scope.nODCopy = angular.copy($scope.nOD);
		}

	/* End of nature of duty search function */

	$scope.filterNatureOfDuty = function(natureDfDuty){
		if(natureDfDuty == 'House wife/husband'){
			natureDfDuty = "Housewife"
		}
		for (let i = 0; i < natureDfDuty.length; i++) {
			let duty = $scope.natureDfDuty[i].Nature_Of_Duty;
			$scope.natureDfDuty.forEach(i => {
				if(i.Nature_Of_Duty == natureDfDuty){
					$scope.selectNOD(i);
				}
			});
			// if($scope.natureDfDuty[i].Nature_Of_Duty == natureDfDuty){
			// 	$scope.selectNOD(natureDfDuty[i]);
			// }
		}
	}

	/* Nature of duty selection event */
	var Risk_class; // Variable to store risk class value
	$scope.selectNOD = function(natureDfDuty){
		$scope.insuredMember.NatureOfDuty = natureDfDuty.Nature_Of_Duty;
		$scope.nOD = natureDfDuty.Nature_Of_Duty;
		$scope.nODCopy = "";
		$('.nature-of-duty').removeClass('open');
		Risk_class = natureDfDuty.Risk_class;
		if($scope.PL && natureDfDuty.Risk_class != 4){
			for(var i = 0; i < $scope.quoteDetailOfProduct.MemberDetails.length ; i++){
			   if( $scope.quoteDetailOfProduct.MemberDetails[i].RelationType == $scope.activeMember && !$scope.quoteDetailOfProduct.MemberDetails[i].RelationType.includes('KID')){
					 $scope.quoteDetailOfProduct.MemberDetails[i].PACoverRiskClass = natureDfDuty.Risk_class ;
			   }
			}
			 UpdateQuoteDetails();
		}
		if(natureDfDuty.Risk_class == 4){
			 if($scope.PL){
				
					for(var i = 0; i < $scope.quoteDetailOfProduct.MemberDetails.length ; i++){

						if($scope.quoteDetailOfProduct.PlanName != 'Platinum - Premiere'){
							if($scope.quoteDetailOfProduct.MemberDetails[i].PACoverFlag == 'Y' && $scope.quoteDetailOfProduct.MemberDetails[i].RelationType == $scope.activeMember && !$scope.quoteDetailOfProduct.MemberDetails[i].RelationType.includes('KID') ){
								
									$rootScope.alertData = {
											"modalClass": "regular-alert",
											"modalHeader": "Alert",
											"modalBodyText": "Based on your profession selection, PA is not available for this member",
											"showCancelBtn": false,
											"gtagPostiveFunction": "click-button, platinum-quote , family-floater-platinum-quote",
											"gtagCrossFunction": "click-button,  platinum-quote ,family-floater-platinum-quote",
											"gtagNegativeFunction": "click-button, platinum-quote , family-floater-platinum-quote",
											"modalSuccessText": "Ok",
											"showAlertModal": true,
											"positiveFunction": function(){
												$scope.quoteDetailOfProduct.MemberDetails[i].PACoverFlag = 'N';
												UpdateQuoteDetails();
											}

										}
										$rootScope.$apply();
										return false;
							}
							else if($scope.quoteDetailOfProduct.MemberDetails[i].PACoverFlag == 'Y' && $scope.quoteDetailOfProduct.MemberDetails[i].RelationType == $scope.activeMember && $scope.quoteDetailOfProduct.MemberDetails[i].RelationType.includes('KID') ){
									$scope.quoteDetailOfProduct.MemberDetails[i].PACoverSI = '500000';
							}

						}
						else if($scope.quoteDetailOfProduct.PlanName == 'Platinum - Premiere'){
							if($scope.quoteDetailOfProduct.MemberDetails[i].PACoverFlag == 'Y' && $scope.quoteDetailOfProduct.MemberDetails[i].RelationType == $scope.activeMember && !$scope.quoteDetailOfProduct.MemberDetails[i].RelationType.includes('KID') ){
								$rootScope.alertData = {
											"modalClass": "regular-alert",
											"modalHeader": "Alert",
											"modalBodyText": "Based on your profession selection, PA is not available for this member",
											"showCancelBtn": false,
											"gtagPostiveFunction": "click-button, platinum-quote , family-floater-platinum-quote",
											"gtagCrossFunction": "click-button,  platinum-quote ,family-floater-platinum-quote",
											"gtagNegativeFunction": "click-button, platinum-quote , family-floater-platinum-quote",
											"modalSuccessText": "Ok",
											"showAlertModal": true,
											"positiveFunction": function(){
												$scope.quoteDetailOfProduct.MemberDetails[i].PACoverFlag = 'N';
												UpdateQuoteDetails();
											}

										}
										$rootScope.$apply();
										return false;
							}
							
						}
					}
				
				
					
				
			}else{
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "You are not elligible to buy policy as selected Nature of Duty is of Risk Type 4.",
					"showCancelBtn": false,
					"modalSuccessText" : "Ok",
					"showAlertModal": true,
					"positiveFunction": function(){
						$scope.nOD = ""
					}
				}   
			}
		}else if(natureDfDuty.Risk_class == 3 && $scope.PA && $scope.insuredDetails.MemberDetail.TTD == 'Y'){
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Warning",
				"modalBodyText": "Temporary & Total Disablement Optional Cover won't be applicable for your selected nature of duty. Are you sure you want to continue?",
				"showCancelBtn": true,
				"modalSuccessText": "Yes",
				"modalCancelText": "No",
				"showAlertModal": true,
				"positiveFunction": function(){
					curActMember.PA.TTD = "N";
					curActMember.PA.TTD_Suminsured = 0;
					$scope.insuredDetails.MemberDetail.TTD_Suminsured = 0;
					$scope.insuredDetails.MemberDetail.TTD = "N";
					curActMember.PA.risk = natureDfDuty.Risk_class;
					curActMember.PA.RiskType = natureDfDuty.Risk_class;
					calculatePremium();
					$rootScope.alertConfiguration('S',"Premium recalculated based on selected Nature of Duty." , "premium_recalculated_nature-of-duty_alert");
				},
				"negativeFunction": function(){
					$scope.insuredDetails.MemberDetail.NatureOfDuty = "";
					$scope.nOD = "";
					$scope.nODCopy = "";
					curActMember.PA.risk = "";
					curActMember.PA.RiskType = "";
					calculatePremium();
					$rootScope.alertConfiguration('S',"Premium recalculated based on selected Nature of Duty.",'premium_recalculated_nature-of-duty_alert');
				}
			}
		}
		if(!(natureDfDuty.Risk_class == 3 && $scope.insuredDetails.MemberDetail.TTD == 'Y') && natureDfDuty.Risk_class != 4 && $scope.PA){
			curActMember.PA.risk = natureDfDuty.Risk_class;
			curActMember.PA.RiskType = natureDfDuty.Risk_class;
			calculatePremium();
			$rootScope.alertConfiguration('S',"Premium recalculated based on selected Nature of Duty." , "premium_recalculated_nature-of-duty_alert");
		}
	}

/* End of nature od duty selection event */

$scope.parseIntString = function(sum){
	if(sum){
		return parseInt(sum);
	}
	else{
		return true;
	}
}


/*---------- To fetch sum insured data -----------------------*/

RenewService.getData('assets/data/sum-insured.json',
false
)
.then(function (data) {
if (data.ResponseCode == 1) {
	$scope.sumInsuredList = data.ResponseData;
}
})

/*---------- End of To fetch sum insured data -----------------------*/

/*-----------------To Change Sum Insued ---------------*/

$scope.changeSumInsured = function (sumi) {
$scope.insuredMember.SumInsured = sumi;
}

/*-----------------End of To Change Sum Insued ---------------*/


// select Optional Cover


$scope.selectCover = function(c_type, c_name){
	const cb = document.querySelector('#'+c_type);

	if(cb.checked){
					$scope.insuredMember.optionalCoverages.push(
						{
							"Coverage": c_name,
							"CoverSI":$scope.sumInsuredList[2].amount
						}
					)
					$scope.insuredMember[c_type]=$scope.sumInsuredList[2].amount;
				}
				else{
					for (let i = 0; i < $scope.insuredMember.optionalCoverages.length; i++) {
						if($scope.insuredMember.optionalCoverages[i].Coverage == c_name){
							$scope.insuredMember.optionalCoverages.splice(i, 1);
						}
					}
					$scope.insuredMember[c_type]= "";
				}

				console.log($scope.insuredMember.optionalCoverages, "covers");
}

$scope.selectCoverSI = function(c_type,c_name, value){
	for (let i = 0; i < $scope.insuredMember.optionalCoverages.length; i++) {
		if($scope.insuredMember.optionalCoverages[i].Coverage == c_name){
			$scope.insuredMember.optionalCoverages[i].CoverSI = value;
		}
	}
	$scope.insuredMember[c_type]=value;
	console.log($scope.insuredMember.optionalCoverages, "covers");
}


$scope.inItsetCoversSi = function (pCode) {
	let arry= []
	for (let i = 0; i < $scope.sumInsuredList.length; i++) {
			if($scope.sumInsuredList[i][pCode]){
				arry.push($scope.sumInsuredList[i])
			}
		}
		return arry
}



$scope.selectCoverUpdate = function(c_type, c_name, c_sum, c_code){
	const cb = document.querySelector('#'+c_type);

	if(cb.checked){
		
		$scope.optionalPayload.MemberDetails[0][c_name] = "Y";

		if(c_sum == "HCBSI" || c_sum == "DCBSI"){
			if(c_sum == 'HCBSI'){
				$scope.oplicyCover= true;
				$scope.UpdatePolicyLevelSIArr.push("HCBSI");
			}
			$scope.oplicyCover= true;
			$scope.optionalPayload.MemberDetails[0][c_sum] =$scope.CBHAmtList[1];
			$scope.optionalPayload.MemberDetails[0]["NO_Of_Days"] ="30";
			return;
		}

		if(c_type == "WMC"){
			$scope.oplicyCoverWMC = true;
			return;
		}

		if(c_sum == 'OPDExpenseSI'){
			$scope.optionalPayload.MemberDetails[0][c_sum] =$scope.oPDArray[1].val;
			return;
		}
		
		if(c_sum){
			$scope.optionalPayload.MemberDetails[0][c_sum] =c_code?$scope.inItsetCoversSi(c_code).length>0?$scope.inItsetCoversSi(c_code)[0].amount:c_code:$scope.sumInsuredList[2].amount;
		}
	}
	else{
		$scope.optionalPayload.MemberDetails[0][c_name] = "";
		$scope.optionalPayload.MemberDetails[0][c_sum] = "";

		if(c_sum == "HCBSI" || c_sum == "DCBSI"){
			$scope.oplicyCover= false;
			return;
		}
		if(c_type == "WMC"){
			$scope.oplicyCoverWMC = false;
		}
	}

	console.log($scope.optionalPayload.MemberDetails, "covers");
}

$scope.oplicyCover= false;
$scope.oplicyCoverWMC= false;
$scope.UpdatePolicyLevelSIArr = []
$scope.selectCoverSIupdate = function(c_sum, value){
	if(c_sum == 'HCBSI'){
		$scope.oplicyCover= true;
		$scope.UpdatePolicyLevelSIArr.push("HCBSI");
	}
	$scope.optionalPayload.MemberDetails[0][c_sum] =value;

	console.log($scope.optionalPayload.MemberDetails, "covers");
}
// $scope.dirOptions = {};
$scope.submitOptionalCovers = function(event, validForm){
	if($scope.productSelected == 'ActivCareV2' ){
		let memberdestailsJson = angular.copy($scope.optionalPayload.MemberDetails[0]);
		$scope.optionalPayload.MemberDetails= [];
		let memberWithOutProposer = angular.copy($scope.userpolicy.InsuredMembers).splice(1);
		for (let i = 0; i < memberWithOutProposer.length; i++) {
			memberdestailsJson.MemberID = angular.copy(memberWithOutProposer[i].MemberId);
			memberdestailsJson.Relation = angular.copy(memberWithOutProposer[i].RelationType);
			const pushData = {...memberdestailsJson}
			$scope.optionalPayload.MemberDetails[i] = pushData;
		}
	}

	if(($scope.productSelected == 'ActivHealth' || $scope.productSelected == 'ActivHealthV2') && ($scope.insuredMember.SumInsuredType == "Family Floater" && ($scope.oplicyCover || ($scope.oplicyCoverWMC && $scope.productCode == "Essential")))){
		let memberdestailsJson = angular.copy($scope.optionalPayload.MemberDetails[0]);
		// $scope.optionalPayload.MemberDetails= [];
		let memberWithOutProposer = angular.copy($scope.userpolicy.InsuredMembers).splice(1);
		let sampleArr = [];
		for (let i = 0; i < memberWithOutProposer.length; i++) {
			$scope.getOptionalPayload();
			
			if(sessionStorage.getItem('policyNewCover')){
				memberWithOutProposer[i].optionalCoverages  = [...JSON.parse(sessionStorage.getItem('policyNewCover')), ...memberWithOutProposer[i].optionalCoverages];
			}
			let getMemCoverPayLoad = {};
			if(memberdestailsJson.MemberID != memberWithOutProposer[i].MemberId){
				getMemCoverPayLoad = Object.assign({}, $scope.createCoversJson(memberWithOutProposer[i].optionalCoverages, true));
			}
			else{
				getMemCoverPayLoad = Object.assign({}, memberdestailsJson);
			}
			
			getMemCoverPayLoad.MemberID = angular.copy(memberWithOutProposer[i].MemberId);
			getMemCoverPayLoad.Relation = angular.copy(memberWithOutProposer[i].RelationType);
			if($scope.oplicyCover){
				
				for (let c = 0; c < $scope.UpdatePolicyLevelSIArr.length; c++) {
					getMemCoverPayLoad[$scope.UpdatePolicyLevelSIArr[c]] = memberdestailsJson[$scope.UpdatePolicyLevelSIArr[c]];
					getMemCoverPayLoad.HCB="Y"
				}
			}

			if($scope.oplicyCoverWMC && $scope.productCode == "Essential"){
				// getMemCoverPayLoad.WMC = "";
				getMemCoverPayLoad.WOMCoPayment = "Y";
			}
			
			sampleArr.push({...getMemCoverPayLoad});
			
		}
		 $scope.optionalPayload.MemberDetails = sampleArr;
	}
	RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpdateCoverDetail", $scope.optionalPayload,true)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					$scope.UpdatePolicyLevelSIArr = [];
					if($location.$$path =='/renewal-edit-member-landing'){
						$scope.submitMemberDetails(event, validForm);
					}
					else{
						// $scope.dirOptions.fetchUpdatedPolicy(data.ResponseData.premiumResponse.RenewGrossPremium);
						$scope.policyDetails.RenewalGrossPremium= data.ResponseData.premiumResponse.RenewGrossPremium;
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Alert",
							"modalBodyText": data.ResponseMessage,
							"showCancelBtn": false,
							"modalSuccessText": "Ok",
							"showAlertModal": true,
							"hideCloseBtn": true
						}
					}
				} else if (data.ResponseCode == 0) {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
				}
			})
}


// select Optional Cover
	$scope.fetchOccupdation = function () {

		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetOccupation", {},
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					$scope.occupationArray = data.ResponseData
				} else if (data.ResponseCode == 0) {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
				}
			})
	}

	

	$scope.fetchOccupdation()

	/*-------------------- End of fetch occupation ------------------------------ */
	
	/*-------------------- Edit Member Details ------------------------------ */

	$scope.membersDataList
	$scope.selectedMemberIndex;
	$scope.relationChangeDitech = function (member){
		if($scope.relationChange){
			$scope.relationChange = false;

			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Alert",
				"modalBodyText": "Change related to relation with proposer for current user will be revert back to " + $scope.insuredMemberDetails.personalDetails.RelationWithProposer,
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true,
				"hideCloseBtn": true,
				"positiveFunction": function () {
					let refMemberlist = ["SELF","SPOUSE","FATHER", "MOTHER", "FATHER-IN-LAW", "MOTHER-IN-LAW", "KID", "BROTHER", "SISTER", "GRANDFATHER", "GRANDMOTHER", "GRANDSON", "GRANDDAUGHTER",  "SON-IN-LAW", "DAUGHTER-IN-LAW", "BROTHER-IN-LAW", "SISTER-IN-LAW", "NEPHEW", "NIECE"]
					$scope.membersList.members[refMemberlist.indexOf($scope.insuredMemberDetails.personalDetails.RelationWithProposer.toUpperCase())].isSelected = true;
					$scope.membersList.members[refMemberlist.indexOf($scope.activeMember.toUpperCase())].isSelected = false;
					$scope.insuredMembers[$scope.selectedMemberIndex].RelationWithProposer =  $scope.insuredMemberDetails.personalDetails.RelationWithProposer;
					$scope.activeMember =  $scope.insuredMemberDetails.personalDetails.RelationWithProposer;
					$scope.insuredMember.Relation =  $scope.insuredMemberDetails.personalDetails.RelationWithProposer;
					$scope.insuredMember.RelationWithProposer = $scope.insuredMemberDetails.personalDetails.RelationWithProposer;
					$scope.insuredMember.RelationType =  $scope.insuredMemberDetails.personalDetails.RelationWithProposer;
					
					$scope.editMemberDetails(member);
				}
			}
		}
		else{
			$scope.editMemberDetails(member);
		}
	}
	$scope.editMemberDetails = function (member) {
		
		$scope.membersDataList = [];
		// reset optionalPayload covers
		for (const key in $scope.optionalPayload.MemberDetails[0]) {
			$scope.optionalPayload.MemberDetails[0][key] = ""
			console.log(`${key}: ${$scope.optionalPayload.MemberDetails[0][key]}`);
		}
		// reset optionalPayload covers
		$scope.insuredMember.day = "";
		$scope.insuredMember.month = "";
		$scope.insuredMember.year = "";

		/*-------------------- To Fetch Member Details ------------------------------*/
		$scope.memberData = {};
		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/GetInsuredMemberDetail", {
					"ReferenceNo": $sessionStorage.refNo,
					"PolicyNumber": $sessionStorage.policyNo,
					"MemberID": member.MemberId,
					"Relation": member.RelationWithProposer
				},
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					insuredMemberDetails = data.ResponseData;
					$scope.insuredMemberDetails = angular.copy(insuredMemberDetails);
					// ===============to display newly added cover at policy level ==============\\
					// if(sessionStorage.getItem('policyNewCover')){
					// 	$scope.insuredMemberDetails.personalDetails.optionalCoverages = [...$scope.insuredMemberDetails.personalDetails.optionalCoverages, ...JSON.parse(sessionStorage.getItem('policyNewCover'))];
					// }
					// ===============to display newly added cover at policy level ==============\\
					for (let i = 0; i < $scope.userpolicy.InsuredMembers.length; i++) {
						let memberdata ={
							"Age":$scope.userpolicy.InsuredMembers[i].Age,
							"DOB": "",
							"Gender":$scope.userpolicy.InsuredMembers[i].Gender,
							"ProductCode":$scope.userpolicy.InsuredMembers[i].ProductCode,
							"RelationType":$scope.userpolicy.InsuredMembers[i].RelationType?$scope.userpolicy.InsuredMembers[i].RelationType.toUpperCase():$scope.userpolicy.InsuredMembers[i].RelationWithProposer.toUpperCase(),
							"RelationWithProposer":$scope.userpolicy.InsuredMembers[i].RelationWithProposer.toUpperCase(),
							"SumInsured": $scope.userpolicy.InsuredMembers[i].SumInsured,
							"MemberID" :  $scope.userpolicy.InsuredMembers[i].MemberId,
						}
						
						$scope.membersDataList.push(memberdata);

						if($scope.userpolicy.InsuredMembers[i].MemberId == member.MemberId){
							$scope.selectedMemberIndex = i - 1;
							$scope.memberData = $scope.userpolicy.InsuredMembers[i];
						};

						if ($scope.productSelected == 'ActivHealthV2' && $scope.userpolicy.InsuredMembers[i].Age > 65) {
							$scope.underAge = false;
						}
						else {
							$scope.underAge = true;
						}
					}

					if(parseInt($scope.insuredMemberDetails.personalDetails.Suminsured)>=500000 && ($scope.productCode == 'PA1' || $scope.productCode == 'PA2' || $scope.productCode == 'PA3')){
						$scope.setOPForPA();
					}
					$scope.setinsuredMember($scope.insuredMemberDetails);
					$scope.setOptionCovers($scope.insuredMemberDetails.personalDetails.optionalCoverages);
					//console.log($scope.insuredMemberDetails, "$scope.insuredMemberDetails");
					$scope.show = true;
					$scope.activeMember = member.RelationWithProposer

					/*------------------ Date of Birth Mapping -----------------------*/
					DOB = $scope.insuredMemberDetails.personalDetails.DOB.split('/');
					$scope.insuredMember.day = DOB[0];
					$scope.insuredMember.month = DOB[1];
					$scope.insuredMember.year = DOB[2];
					$scope.insuredMember.AGE = $scope.calculate_age(new Date($scope.insuredMember.year, $scope.insuredMember.month, $scope.insuredMember.day))
					$scope.DOB = $scope.insuredMember.day + '/' + $scope.insuredMember.month + '/' + $scope.insuredMember.year;

					if ($rootScope.rfbProduct && $scope.activeMember == 'SELF') {
						$scope.occupationType = 'Salaried';
					} else {
						$scope.occupationType = "Select Occupation";
					}

					angular.forEach(insuredMemberDetails.personalDetails.optionalCoverages, function(cover, i){
						if(cover.Coverage != ''){
							$scope[cover.Coverage.replace(/-|\s/g,'')] = 'Y';
							if(cover.Coverage.replace(/-|\s/g,'').toLowerCase() == 'vaccinecover'){
								$scope.insuredMember.VaccineCoverSI = cover.coverSi;
							}
						}
						console.log(cover.Coverage.replace(/-|\s/g,''));
					});
					
					angular.forEach(insuredMemberDetails.personalDetails.Memberquestions, function(question, i){
						//console.log(question);
						$scope.insuredMember[question.Parent_question.trim()] = 'Y';
						if(question.Parent_question == 'Terminal_illness'){
							$scope.retailRiderQuest['TI'+question.Question] = question.Remark;
							if(question.Remark.indexOf('-') > 0){
								$scope.getDates(question.Remark, 'TI'+question.Question);
							}
						}
						if(question.Parent_question.trim() == 'Have_you_ever_been_diagnosed'){
							$scope.retailRiderQuest['DG'+question.Question] = question.Remark;
							if(question.Remark.indexOf('-') > 0){
								$scope.getDates(question.Remark, 'DG'+question.Question);
							}
						}
					});

					//console.log($scope.retailRiderQuest);

				} else if (data.ResponseCode == 0) {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "OK",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
				}
			})
		/*-------------------- End of To Fetch Member Details ------------------------------*/
		
		// $scope.optionalPayload.ReferenceNo = $sessionStorage.refNo;
		// $scope.optionalPayload.PolicyNumber =  $sessionStorage.policyNo;
		$scope.optionalPayload.MemberDetails[0].MemberID = member.MemberId;
		$scope.optionalPayload.MemberDetails[0].Relation = member.RelationWithProposer;
	}

	$scope.getDates = function(currentDate, dateFor){
		//console.log(currentDate + ' :: ' + dateFor);
		let modelName = dateFor.replace('TILast_Consultation_Date','TIconsultation').replace('TIDate_of_Diagnosis','TIdiagnosis').replace('TIEnd_date_Hospitalization','TIend').replace('TIStart_Date_Hospitalization','TIstart').replace('DGDate_of_Diagnosis', "DGdiagnosis").replace("DGLast_Consultation_Date","DGconsultation");
		$scope.retailRiderQuest[modelName+'Day'] = currentDate.split('-')[0];
		$scope.retailRiderQuest[modelName+'Month'] = currentDate.split('-')[1];
		$scope.retailRiderQuest[modelName+'Year'] = currentDate.split('-')[2];
		//console.log(modelName+'Day');
	}

	$scope.diseaseDate = function(day,month,year, modelName) {
		$scope.retailRiderQuest[modelName] = day+"-"+month+"-"+year;
		console.log($scope.retailRiderQuest[modelName]);
	}

	$scope.createCoversJson = function(covers, boolean){
		for (let i = 0; i < covers.length; i++) {
			if($scope.productJson[$scope.productSelectedArr].includes(covers[i].Coverage.trim())){
				$scope.insuredMember.optionalCoverages.push({
					"Coverage": covers[i].Coverage,
					"CoverSI":covers[i].coverSi,
				})

				switch (covers[i].Coverage.trim()) {
					case 'Personal Accident Cover (AD, PTD)':
					$scope.insuredMember.PAC = covers[i].coverSi;
					$scope.insuredMember.PAC_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].PACoverFlag = "Y";
					$scope.optionalPayload.MemberDetails[0].PA_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].PACoverSI = covers[i].coverSi;
					break;
					
					case 'Critical Illness Cover':
					$scope.insuredMember.CIC = covers[i].coverSi;
					$scope.insuredMember.CIC_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].CICoverFlag = "Y";
					$scope.optionalPayload.MemberDetails[0].CI_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].CICoverSI = covers[i].coverSi;
					break;

					case 'International Coverage for major illnesses':
						$scope.insuredMember.ICMI = covers[i].coverSi;
						$scope.insuredMember.ICMI_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].ICMICoverFlag = "Y";
					$scope.optionalPayload.MemberDetails[0].ICMI_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].ICMICoverSI = covers[i].coverSi;
					break;

					case 'Waiver of Mandatory Co-payment':
					case 'Waiver of mandatory co-payment':
						$scope.insuredMember.WMC = covers[i].coverSi;
						$scope.insuredMember.WMC_copy = covers[i].coverSi;
						$scope.optionalPayload.MemberDetails[0].WOMCoPayment = "Y";
						$scope.optionalPayload.MemberDetails[0].WOMCoPayment_NB = "Y";
					// $scope.optionalPayload.PACoverSI = covers[i].coverSi;
					break;

					case 'OPD Expenses':
						$scope.insuredMember.OPDC = covers[i].coverSi;
						$scope.insuredMember.OPDC_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].OPDExpense = "Y";
					$scope.optionalPayload.MemberDetails[0].OPDExpense_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].OPDExpenseSI = covers[i].coverSi;
					break;

					case 'Hospital cash Benefit':
						$scope.insuredMember.HCB = covers[i].coverSi;
						$scope.insuredMember.HCB_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].HCB = "Y";
					$scope.optionalPayload.MemberDetails[0].HCB_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].HCBSI = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].NO_Of_Days = covers[i].NO_Of_Days;
					break;

					case 'Days per Policy Year limit':
						$scope.insuredMember.DCB = covers[i].coverSi;
						$scope.insuredMember.DCB_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].DCB = "Y";
					$scope.optionalPayload.MemberDetails[0].DCB_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].DCBSI = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].NO_Of_Days = covers[i].NO_Of_Days;
					break;

					case 'Maternity Expenses':
						$scope.insuredMember.ME = covers[i].coverSi;
						$scope.insuredMember.ME_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].MaternityExpense = "Y";
					$scope.optionalPayload.MemberDetails[0].MaternityExpense_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].MaternityExpenseSI = covers[i].coverSi;
					break;

					case 'PPN Discount':
						$scope.insuredMember.PPN = covers[i].coverSi;
						$scope.insuredMember.PPN_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].PPNDiscount = "Y";
					$scope.optionalPayload.MemberDetails[0].PPNDiscount_NB = "Y";
					// $scope.optionalPayload.PACoverSI = covers[i].coverSi;
					break;

					case 'Super NCB':
						$scope.insuredMember.S_NCB = covers[i].coverSi;
						$scope.insuredMember.PPN_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].SuperNCB = "Y";
					$scope.optionalPayload.MemberDetails[0].SuperNCB_NB = "Y";
					// $scope.optionalPayload.PACoverSI = covers[i].coverSi;
					break;

					case 'Unlimited Reload of Sum Insured':
						$scope.insuredMember.URSI = covers[i].coverSi;
						$scope.insuredMember.URSI_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].UnlimitedReload = "Y";
					$scope.optionalPayload.MemberDetails[0].UnlimitedReloadSI_NB = "Y";
					// $scope.optionalPayload.PACoverSI = covers[i].coverSi;
					break;
					
					case 'Room Type':
					case 'Room Upgrade':
						$scope.insuredMember.RU = covers[i].coverSi;
						$scope.insuredMember.RU_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].RoomCover = "Y";
					$scope.optionalPayload.MemberDetails[0].RoomCover_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].RoomUpgrade = "Y";
					$scope.optionalPayload.MemberDetails[0].RoomUpgrade_NB = "Y";
					// $scope.optionalPayload.PACoverSI = covers[i].coverSi;
					break;

					case 'Nursing at Home':
					$scope.optionalPayload.MemberDetails[0].NursingAtHome = "Y";
					$scope.optionalPayload.MemberDetails[0].NursingAtHome_NB = "Y";
					// $scope.optionalPayload.PACoverSI = covers[i].coverSi;
					break;

					case 'Portable medical equipment':
					case 'Portable Medical Equipment':
					$scope.optionalPayload.MemberDetails[0].PortableMedicalEquipment = "Y";
					$scope.optionalPayload.MemberDetails[0].PortableMedicalEquipment_NB = "Y";
					// $scope.optionalPayload.PACoverSI = covers[i].coverSi;
					break;

					case 'Lifestyle support equipment':
					$scope.optionalPayload.MemberDetails[0].LifestyleQuipment = "Y";
					$scope.optionalPayload.MemberDetails[0].LifestyleQuipment_NB = "Y";
					// $scope.optionalPayload.PACoverSI = covers[i].coverSi;
					break;

					case 'Advance Health Check-up':
					$scope.optionalPayload.MemberDetails[0].AdvanceHealthCheckup = "Y";
					$scope.optionalPayload.MemberDetails[0].AdvanceHealthCheckup_NB = "Y";
					// $scope.optionalPayload.PACoverSI = covers[i].coverSi;
					break;

					case 'AHB':
					$scope.insuredMember.AHB = covers[i].coverSi;
					$scope.insuredMember.AHB_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].AHB = "Y";
					$scope.optionalPayload.MemberDetails[0].AHB_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].AHBSI = covers[i].coverSi;

					break;

					case 'Cancer Hospitalization Booster':
					$scope.insuredMember.CHB = covers[i].coverSi;
					$scope.insuredMember.CHB_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].CancerHospitalizationCover = "Y";
					$scope.optionalPayload.MemberDetails[0].CancerHospitalizationCover_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].CancerHospitalizationCoverSI = covers[i].coverSi;
					break;

					case 'Second E opinion':
					case 'Second E Opinion':
					case 'Second E-Opinion on Critical Illnesses':
					case 'Second E Opinion on major illnesses':
					$scope.optionalPayload.MemberDetails[0].SecondOpinion = "Y";
					$scope.optionalPayload.MemberDetails[0].SecondOpinion_NB = "Y";
					break;

					case 'Wellness coach':
					case 'Wellness Coach':
					$scope.optionalPayload.MemberDetails[0].WellnessCoach = "Y";
					$scope.optionalPayload.MemberDetails[0].WellnessCoach_NB = "Y";
					break;

					case 'Temporary Total Disablement (TTD)':
					$scope.insuredMember.OC_TTDB = covers[i].coverSi;
					$scope.insuredMember.OC_TTDB_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].Temporary_Total_Disablement = "Y";
					$scope.optionalPayload.MemberDetails[0].Temporary_Total_Disablement_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].Temporary_Total_DisablementSI = covers[i].coverSi;
					break;

					case 'Accidental in-patient Hospitalization Cover':
					$scope.optionalPayload.MemberDetails[0].Accidental_in_patient = "Y";
					$scope.optionalPayload.MemberDetails[0].Accidental_in_patient_NB = "Y";
					break;

					case 'Coma Benefit':
					$scope.optionalPayload.MemberDetails[0].Coma_Benefit = "Y";
					$scope.optionalPayload.MemberDetails[0].Coma_Benefit_NB = "Y";
					break;

					case 'Broken Bones Benefit':
					$scope.insuredMember.OC_BBB = covers[i].coverSi;
					$scope.insuredMember.OC_BBB_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].Broken_Bones_Benefit = "Y";
					$scope.optionalPayload.MemberDetails[0].Broken_Bones_Benefit_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].Broken_Bones_BenefitSI = covers[i].coverSi;
					break;

					case 'Adventure Sports Cover':
					$scope.optionalPayload.MemberDetails[0].Adventure_Sports_Cover = "Y";
					$scope.optionalPayload.MemberDetails[0].Adventure_Sports_Cover_NB = "Y";
					break;

					case 'Burns Benefits':
					$scope.insuredMember.OC_BB = covers[i].coverSi;
					$scope.insuredMember.OC_BB_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].Burns_Benefits = "Y";
					$scope.optionalPayload.MemberDetails[0].Burns_Benefits_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].Burns_BenefitsSI = covers[i].coverSi;
					break;

					case 'Accidental Medical Expenses':
					$scope.optionalPayload.MemberDetails[0].Accidental_Medical_Expenses = "Y";
					$scope.optionalPayload.MemberDetails[0].Accidental_Medical_Expenses_NB = "Y";
					break;

					case 'Worldwide Emergency Assistance Services (including Air Ambulance)':
					$scope.optionalPayload.MemberDetails[0].Worldwide_Emergency_Assistance = "Y";
					$scope.optionalPayload.MemberDetails[0].Worldwide_Emergency_Assistance_NB = "Y";
					break;

					case 'EMI Protect':
					$scope.insuredMember.OC_EMI = covers[i].coverSi;
					$scope.insuredMember.OC_EMI_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].EMI_Protect = "Y";
					$scope.optionalPayload.MemberDetails[0].EMI_Protect_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].EMI_ProtectSI = covers[i].coverSi;
					break;

					case 'Loan Protect':
					$scope.insuredMember.OC_Loan = covers[i].coverSi;
					$scope.insuredMember.OC_Loan_copy = covers[i].coverSi;
					$scope.optionalPayload.MemberDetails[0].Loan_Protect = "Y";
					$scope.optionalPayload.MemberDetails[0].Loan_Protect_NB = "Y";
					$scope.optionalPayload.MemberDetails[0].Loan_ProtectSI = covers[i].coverSi;
					break;

					default:
						break;
				}
			};
			
		}

		if(boolean){
			return $scope.optionalPayload.MemberDetails[0];
		}
	}
	
	$scope.setOptionCovers = function(covers){
		if($scope.productJson[$scope.productSelectedArr]){
			$scope.createCoversJson(covers, null);
			console.log($scope.optionalPayload,"set cover arry");
			console.log($scope.insuredMember,"set cover arry insuredMember");
		}
	}

	$scope.calculate_age = function(dob) { 
		var diff_ms = Date.now() - dob.getTime();
		var age_dt = new Date(diff_ms); 
	  
		return Math.abs(age_dt.getUTCFullYear() - 1970);
	}
	$scope.corversNav = false;	
	if($location.path() == "/renewal-edit-optional-covers"){
		$scope.editMemberDetails($scope.userpolicy.InsuredMembers[1])
		$scope.corversNav = true;
	}

	$scope.setinsuredMember = function(userData){
		$scope.insuredMember = {
			"ReferenceNo": userData.ReferenceNo, //Mandatory
			"PolicyNumber": userData.PolicyNumber, // Mandatory
			"Salutation": "", // Mandatory
			"FirstName": userData.personalDetails.FirstName, // Mandatory
			"MiddleName": userData.personalDetails.MiddleName,
			"LastName":userData.personalDetails.LastName, // Mandatory
			"Mobile": userData.personalDetails.MobileNumber,
			"Email": userData.personalDetails.Email,
			"DOB": userData.personalDetails.DOB, // Mandatory
			"Pan": userData.personalDetails.Pan,
			"Age": "",
			"Height": "",
			"Weight": "",
			"Occupation": userData.personalDetails.Occupation,
			"Occupation_ID": userData.occupation.OccupationCode,
			"Designation":userData.personalDetails.Designation,
			"MaritalStatus": "",
			"Gender": "",
			"Relation": userData.personalDetails.RelationWithProposer.toUpperCase(), // Mandatory
			"PanNo":userData.personalDetails.PanNo,
			"NomineeFirstName": "",
			"NomineeLastName": "",
			"NomineeDOB": "",
			"NomineeAddress": "",
			"NomineeContactNo": "",
			"NomineeRelation": "",
			"HomeAddress1": userData.addressDetails.AddressLine1,
			"HomeAddress2": userData.addressDetails.AddressLine2,
			"HomeAddress3": "",
			"HomeState": userData.addressDetails.State,
			"HomeDistrict": "",
			"HomeCity": userData.addressDetails.City,
			"HomePincode": userData.addressDetails.Pincode,
			"HomeZone": "",
			"Nationality": "Indian",
			"notIndianNational": "N",
			"InitialSumInsured": insuredMemberDetails.personalDetails.InitialSumInsured,
			"SumInsured": insuredMemberDetails.personalDetails.Suminsured, // Mandatory
			"SumInsuredType": $scope.userpolicy.SumInsuredType,
			"UpSellSumInsured": "",
			"Deductible": insuredMemberDetails.personalDetails.Deductible,
			"Chronic": "",
			"CB": "",
			"IDType": "",
			"IDNo": "",
			"AlcoholYN": "N",
			"AlcoholQty": "",
			"SmokeQty": "",
			"PanmasalaQty": "",
			"Others": "",
			"SubstanceQty": "",
			"IsEIAavailable": "N",
			"ApplyEIA": "N",
			"UndergoneAnySurgery": "N",
			"EIAAccountNo": "",
			"PreviousPolicyNumberYN": "",
			"PreviousPolicySumInsured": "",
			"PreviousPolicyClaims": "",
			"PreviousPolicyRejectedYN": "",
			"PreviousPolicyRejectedDetails": "",
			"AnnualIncome":"",
			"NatureOfDuty":userData.personalDetails.NatureOfDuty,
			"RelationWithProposer":userData.personalDetails.RelationWithProposer,
			"OccupationNatur":"",
			"RoomType":userData.personalDetails.RoomType,
			"optionalCoverages": userData.personalDetails.optionalCoverages,
			"PAC":"",
			"CIC":"",
			"ICMI":"",
			"WMC":"",
			"OPDC":"",
			"HCB":"",
			"DCB":"",
			"ME":"",
			"PPN":"",
			
			"optionalCoverages":[],
	
			"previousPolicy":"N",
			"previousTreatment":"N",
			"PreviousPolicyNumberYN":"",
			"PreviousPolicyBenefit":"",
			"PreviousPolicyClaims":"N",
			"PreviousPolicyRejectedYN":"N",
			"PreviousPolicyRejectedDetails": "",
			"PreviousPolicyName":"",
	
			"ChronicTab":"N",
			"diabetes":"N",
			"hypertension":"N",
			"pulmonary":"N",
	
			"OrganTab":"N",
			"Heart":"N",
			"Lung":"N",
			"ENT":"N",
			"Kidney":"N",
			"Brain":"N",
	
			"InsuredTab":"N",
			"regularMedical":'N',
			"Surgery":'N',
			"BloodTests":'N',
	
			"OtherTab":"N",
			"Cancer":"N",
			"Sexually":"N",
			"Disability":"N",
			"BloodDisorder":"N",
			"GeneticDisorder":"N",
			"BirthDefect":"N",
			"Paralysis":"N",
			"AccidentalInjury":"N",
	
		}

		let GetDOB = $scope.insuredMember.DOB.split("/");
		$scope.insuredMember.day = GetDOB[0];
		$scope.insuredMember.month = GetDOB[1];
		$scope.insuredMember.year = GetDOB[2];
		let dobEx = GetDOB[2]+"-"+GetDOB[1]+"-"+GetDOB[0];
		$scope.setDeductable(insuredMemberDetails.personalDetails.Suminsured)
		$scope.nOD= userData.personalDetails.NatureOfDuty;
		if(document.getElementById('insured-member-natureofduty')){
			document.getElementById('insured-member-natureofduty').value = userData.personalDetails.NatureOfDuty;
		}
		$scope.changePinCode(userData.addressDetails.Pincode , "inIt");
		userAgeCal(dobEx);
	}
	/*-------------------- End of Edit Member Details ------------------------------ */

	$scope.selectRoomType= function(room){
		if(room == "Single"){
			$scope.optionalPayload.MemberDetails[0].RoomTypeAnyRoom = "N";
			$scope.optionalPayload.MemberDetails[0].RoomTypeSharedRoom = "N";
			$scope.optionalPayload.MemberDetails[0].RoomTypesingleRoom = "Y";
		}
		else if(room == "SHARED"){
			$scope.optionalPayload.MemberDetails[0].RoomTypeAnyRoom = "N";
			$scope.optionalPayload.MemberDetails[0].RoomTypeSharedRoom = "Y";
			$scope.optionalPayload.MemberDetails[0].RoomTypesingleRoom = "N";
		}
		else{
			$scope.optionalPayload.MemberDetails[0].RoomTypeAnyRoom = "Y";
			$scope.optionalPayload.MemberDetails[0].RoomTypeSharedRoom = "N";
			$scope.optionalPayload.MemberDetails[0].RoomTypesingleRoom = "N";
		}
		$scope.insuredMember.RoomType = room;
	}


	/* Change Pincode and update State and City  Details */
	$scope.upgradeZ = false;
    $scope.changePinCode = function (validPinCode, param) {
        if (validPinCode) {
            // $scope.insuredMember.HomeCity = "";
            // $scope.insuredMember.HomeState = "";
            // $scope.insuredMember.HomeZone = "";
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/PinCode", {
                "PinCode": $scope.insuredMember.HomePincode,
				"Productcode": sessionStorage.getItem('productCode')
            }, false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (data) {
                    if (data.ResponseCode == 1) {
						
						if(param == "inIt"){ //for page inIt
							if(!$scope.userpolicy.Zone){
								$scope.userpolicy.Zone = data.ResponseData.Zone;
							}
							$scope.insuredMember.HomeCity  = data.ResponseData.City;
							$scope.insuredMember.HomeState = data.ResponseData.State;
							$scope.insuredMember.HomeZone = data.ResponseData.Zone;
							return;
						}
                        // if ($scope.userpolicy.ProductName == "Activ Health V2") {
                            var newZone = data.ResponseData.Zone.split("Z00");
                            var oldZone = $scope.userpolicy.Zone.split("Z00");
                            if (parseInt(oldZone[1]) >= parseInt(newZone[1])) {
								$scope.insuredMember.HomeCity  = data.ResponseData.City;
								$scope.insuredMember.HomeState = data.ResponseData.State;
								$scope.insuredMember.HomeZone = data.ResponseData.Zone;
								$scope.upgradeZ = true;
								// updateZone(data.ResponseData.Zone);
                            }
                            else {
								$rootScope.alertData = {
									"modalClass": "regular-alert",
									"modalHeader": "Alert",
									"modalBodyText": "If new pincode entered is of Upscale Zone or within the same Zone then it will allow to change the pincode",
									"showCancelBtn": false,
									"modalSuccessText": "Ok",
									"showAlertModal": true,
									"hideCloseBtn": true,
									"positiveFunction": function () {
										$scope.insuredMember.HomePincode = $scope.userpolicy.HomePincode;
										$scope.insuredMember.HomeCity  = $scope.userpolicy.HomeCity;
										$scope.insuredMember.HomeState = $scope.userpolicy.HomeState;
										$scope.insuredMember.HomeZone = $scope.userpolicy.Zone;
									}
								}
                            }
                        // }
						// else{
						// 	$scope.insuredMember.HomeCity  = data.ResponseData.City;
						// 	$scope.insuredMember.HomeState = data.ResponseData.State;
						// 	$scope.insuredMember.HomeZone = data.ResponseData.Zone;
						// }
                    } else {
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Alert",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "Ok",
                            "showAlertModal": true,
                            "hideCloseBtn": true,
                            "positiveFunction": function () {
                                $scope.insuredMember.HomePincode = "";
                            }
                        }

                    }
                }, function (err) {
                });
        }
    }

	


    /* End of change Pincode and update State and City  Details */

	/*---------  Back Button Function ------*/

	$scope.backbutton = function () {
		$scope.show = false;
		$scope.fetchInsuredMembers();
	}

	/*--------- End of Back Button Function ------*/

	/*------------ select occupation --------------*/

	$scope.selectOccupation = function (occVal) {
		$scope.occupation = occVal;
		$scope.occupationType = occVal.Occupation
	}

	/*------------ select Occupation ends ---------*/

	
    /* Productwise age validation */    

        function productWiseAgeValidtion(age , param){

            //var errorStatus = new Object();
             var errorStatus = param == null ? {} : new Object() ;
            var allErrors = new String();
			let policyType = $scope.insuredMember.SumInsuredType == "Family Floater"? "FF" : "MI";
            if($scope.productSelected == "ActivHealthV2" || $scope.productSelected == "ActivHealth"){
                // insuredCurrentMember.PL.Age = age;

                errorStatus.PL = productValidationService.platinumValidations($scope.membersDataList, $scope.insuredMember.RelationWithProposer, policyType);
                if(errorStatus.PL.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Activ Health eligibility Related Errors</h4>";
                    var pLUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.PL.allErrors,function(v,i){
                        if($scope.insuredMember.RelationWithProposer.toUpperCase() == v.RelationType){
                            pLUL = pLUL + "<li>"+v.message+"</li>";
                        }
                    });
                    pLUL = pLUL + "</ul>";
                    if(pLUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + pLUL;
                    }
                }
            }
            // if($scope.FIT){
            //     insuredCurrentMember.FIT.Age = age;
            //     errorStatus.FIT = productValidationService.activFitValidations(insuredObj.FIT,insuredCurrentMember.FIT.RelationType , $scope.insuredDetails.MemberDetail.PolicyType);
            //     if(errorStatus.FIT.allErrors.length > 0){
            //         allErrors = allErrors + "<h4 class='h4-class'>Activ Health eligibility Related Errors</h4>";
            //         var pLUL = "<ul class='ul-class'>";
            //         angular.forEach(errorStatus.FIT.allErrors,function(v,i){
            //             if(insuredCurrentMember.FIT.RelationType == v.RelationType){
            //                 pLUL = pLUL + "<li>"+v.message+"</li>";
            //             }
            //         });
            //         pLUL = pLUL + "</ul>";
            //         if(pLUL == "<ul class='ul-class'></ul>"){
            //                 allErrors = "";
            //         }else{
            //             allErrors = allErrors + pLUL;
            //         }
            //     }
            // }
            if($scope.productSelected == "SuperTopUp"){
                // insuredCurrentMember.DI.Age = age
				let sampleMembers = ['',$scope.insuredMembers[0], $scope.insuredMember]
				sampleMembers[1].RelationWithProposer = sampleMembers[1].RelationWithProposer.toUpperCase();
				sampleMembers[1].RelationType = sampleMembers[1].RelationType.toUpperCase();
                errorStatus.DI = productValidationService.STValidations(sampleMembers,$scope.insuredMember.RelationWithProposer, policyType);
                if(errorStatus.DI.allErrors.length > 0){
					allErrors = allErrors + "<h4 class='h4-class'>Super Top Up eligibility Related Errors</h4>";
                    var dIUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.DI.allErrors,function(v,i){
                        if($scope.insuredMember.RelationWithProposer.toUpperCase() == v.RelationType){
                                dIUL = dIUL + "<li>"+v.message+"</li>";

								$scope.insuredMember.day = "";
								$scope.insuredMember.month = "";
								$scope.insuredMember.year = "";
								$scope.insuredMember.DOB = "";
                            }
                    });
                    dIUL = dIUL + "</ul>";
                    if(dIUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + dIUL;
                    }
                    
                }
            }

			if($scope.productSelected == "ActivAssure"){
                // insuredCurrentMember.DI.Age = age
				let sampleMembers = ['',$scope.insuredMembers[0], $scope.insuredMember]
				sampleMembers[1].RelationWithProposer = sampleMembers[1].RelationWithProposer.toUpperCase();
				sampleMembers[1].RelationType = sampleMembers[1].RelationType.toUpperCase();
                errorStatus.DI = productValidationService.diamondValidations(sampleMembers,$scope.insuredMember.RelationWithProposer, policyType);
                if(errorStatus.DI.allErrors.length > 0){
					allErrors = allErrors + "<h4 class='h4-class'>Activ Assure eligibility Related Errors</h4>";
                    var dIUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.DI.allErrors,function(v,i){
                        if($scope.insuredMember.RelationWithProposer.toUpperCase() == v.RelationType){
                                dIUL = dIUL + "<li>"+v.message+"</li>";

								$scope.insuredMember.day = "";
								$scope.insuredMember.month = "";
								$scope.insuredMember.year = "";
								$scope.insuredMember.DOB = "";
                            }
                    });
                    dIUL = dIUL + "</ul>";
                    if(dIUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + dIUL;
                    }
                    
                }
            }
            // if($scope.PA){
            //     insuredCurrentMember.PA.Age = age;
            //     errorStatus.PA = productValidationService.rFBValidations(insuredObj.PA,5,"PA",insuredCurrentMember.PA.RelationType);
            //     if(errorStatus.PA.allErrors.length > 0){
            //         allErrors = allErrors + "<h4 class='h4-class'>Personal Accident eligibility Related Errors</h4>";
            //         var pAUL = "<ul class='ul-class'>";
            //         angular.forEach(errorStatus.PA.allErrors,function(v,i){
            //             if(insuredCurrentMember.PA.RelationType == v.RelationType){    
            //                     pAUL = pAUL + "<li>"+v.message+"</li>";
            //                 }
            //         });
            //         pAUL = pAUL + "</ul>";
            //         if(pAUL == "<ul class='ul-class'></ul>"){
            //                 allErrors = "";
            //         }else{
            //             allErrors = allErrors + pAUL;
            //         }
            //     }
            // }
            // if($scope.CI){
            //     insuredCurrentMember.CI.Age = age;
            //     (projectPlans.CIPlan == 3) ? errorStatus.CI = productValidationService.rFBValidations(insuredObj.CI,18,"CI",insuredCurrentMember.CI.RelationType) : errorStatus.CI = productValidationService.rFBValidations(insuredObj.CI,5,"CI",insuredCurrentMember.CI.RelationType);
            //     if(errorStatus.CI.allErrors.length > 0){
            //         allErrors = allErrors + "<h4 class='h4-class'>Critical Illness eligibility Related Errors</h4>";
            //         var cIUL = "<ul class='ul-class'>";
            //         angular.forEach(errorStatus.CI.allErrors,function(v,i){
            //             if(insuredCurrentMember.CI.RelationType == v.RelationType){      
            //                     cIUL = cIUL + "<li>"+v.message+"</li>";
            //                 }    
            //         });
            //         cIUL = cIUL + "</ul>";
            //         if(cIUL == "<ul class='ul-class'></ul>"){
            //                 allErrors = "";
            //         }else{
            //             allErrors = allErrors + cIUL;
            //         }
            //     }
            // }
            if($scope.productSelected == "ActivSecure"){
                // insuredCurrentMember.CS.Age = age;
				let sampleMembers = ['',$scope.insuredMembers[0], $scope.insuredMember]
				sampleMembers[1].RelationWithProposer = sampleMembers[1].RelationWithProposer.toUpperCase();
				sampleMembers[1].RelationType = sampleMembers[1].RelationType.toUpperCase();
				sampleMembers[2].RelationType = sampleMembers[2].RelationWithProposer.toUpperCase();
                errorStatus.CS = productValidationService.rFBValidations(sampleMembers,18,"CS",$scope.insuredMember.RelationWithProposer);
                if(errorStatus.CS.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Cancer Secure eligibility Related Errors</h4>";
                    var cSUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.CS.allErrors,function(v,i){
                        if($scope.insuredMember.RelationWithProposer.toUpperCase() == v.RelationType){ 
                                    cSUL = cSUL + "<li>"+v.message+"</li>";
                                }    
                    });
                    cSUL = cSUL + "</ul>";
                     if(cSUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + cSUL;
                    }
                }
            }
            // if($scope.CK){
            //     insuredCurrentMember.CK.Age = age;
            //     errorStatus.CK = productValidationService.cKValidations(insuredObj.CK,18,"CS",insuredCurrentMember.CK.RelationType , $scope.insuredDetails.MemberDetail.PolicyType);
            //     if(errorStatus.CK.allErrors.length > 0){
            //         allErrors = allErrors + "<h4 class='h4-class'>Corona Kavach eligibility Related Errors</h4>";
            //         var cSUL = "<ul class='ul-class'>";
            //         angular.forEach(errorStatus.CK.allErrors,function(v,i){
            //             if(insuredCurrentMember.CK.RelationType == v.RelationType){ 
            //                         cSUL = cSUL + "<li>"+v.message+"</li>";
            //                     }    
            //         });
            //         cSUL = cSUL + "</ul>";
            //          if(cSUL == "<ul class='ul-class'></ul>"){
            //                 allErrors = "";
            //         }else{
            //             allErrors = allErrors + cSUL;
            //         }
            //     }
            // }
            // if($scope.AS){
            //     insuredCurrentMember.AS.Age = age;
            //     errorStatus.AS = productValidationService.arogyaSanjeevaniValidations(insuredObj.AS,25,"AS",insuredCurrentMember.AS.RelationType , $scope.insuredDetails.MemberDetail.PolicyType);
            //     if(errorStatus.AS.allErrors.length > 0){
            //         allErrors = allErrors + "<h4 class='h4-class'>Arogya Sanjeevani eligibility Related Errors</h4>";
            //         var cSUL = "<ul class='ul-class'>";
            //         angular.forEach(errorStatus.AS.allErrors,function(v,i){
            //             if(insuredCurrentMember.AS.RelationType == v.RelationType){ 
            //                         cSUL = cSUL + "<li>"+v.message+"</li>";
            //                     }    
            //         });
            //         cSUL = cSUL + "</ul>";
            //          if(cSUL == "<ul class='ul-class'></ul>"){
            //                 allErrors = "";
            //         }else{
            //             allErrors = allErrors + cSUL;
            //         }
            //     }
            // }
            if($scope.productSelected == "ActivCareV2"){
            //  insuredCurrentMember.AC.Age = age;
                errorStatus.AC = productValidationService.activCareValidations($scope.membersDataList,$scope.insuredMember.RelationWithProposer);
                if(errorStatus.AC.allErrors.length > 0){
                    allErrors = allErrors + "<h4 class='h4-class'>Activ Care eligibility Related Errors</h4>";
                    var aCUL = "<ul class='ul-class'>";
                    angular.forEach(errorStatus.AC.allErrors,function(v,i){
                        if($scope.insuredMember.RelationWithProposer.toUpperCase() == v.RelationType){ 
                                aCUL = aCUL + "<li>"+v.message+"</li>";
                            }    
                    });
                    aCUL = aCUL + "</ul>";
                     if(aCUL == "<ul class='ul-class'></ul>"){
                            allErrors = "";
                    }else{
                        allErrors = allErrors + aCUL;
                    }

					let GetDOB = $scope.insuredMember.DOB.split("/");
					$scope.insuredMember.day = GetDOB[0];
					$scope.insuredMember.month = GetDOB[1];
					$scope.insuredMember.year = GetDOB[2];
                }
            }
            if(allErrors.length > 0){
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Errors",
                    "modalBodyText": allErrors,
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true,
                    "hideCloseBtn": true,
                    "positiveFunction": function(){
                        $scope.insuredMember.day = GetDOB[0];
						$scope.insuredMember.month = GetDOB[1];
						$scope.insuredMember.year = GetDOB[2];
                        $scope.DOB = GetDOB[0]+"/"+GetDOB[1]+"/"+GetDOB[2];
                    }
                }
                return false;
            }else{
                return true;
            }
        }

    /* End of productwise age validation */

	function UpdateDOB(data){
		// delete rID.insuredDetails.PremiumDetail;
		aS.postData(ABHI_CONFIG.apiUrl+"renew/UpdateDOB",data,false,{
			headers:{
				'Content-Type': 'application/json'
			}
		})
			.then(function(response){
				if(response.ResponseCode == 1){
					
					$scope.insuredMember.DOB = data.DOB;
					ModificationCall(data)
				}else{
					$rootScope.alertConfiguration('E',response.ResponseMessage);
				}
			},function(err){

			});
	}


	function ModificationCall(data){
		// delete rID.insuredDetails.PremiumDetail;
		aS.postData(ABHI_CONFIG.apiUrl+"renew/RenewModificationCall",{
			"ReferenceNumber":data.ReferenceNo,
			"PolicyNumber":data.PolicyNumber,
			}
		,false,{
			headers:{
				'Content-Type': 'application/json'
			}
		})
			.then(function(response){
				if(response.ResponseCode == 1){
					if(response.ResponseData.RenewGrossPremium){
						$scope.policyDetails.RenewalGrossPremium = response.ResponseData.RenewGrossPremium;
					}
				}else{
					$rootScope.alertConfiguration('E',response.ResponseMessage);
				}
			},function(err){

			});
	}

	 /* To Calulate Premium */

	 function calculatePremium(data){
		// delete rID.insuredDetails.PremiumDetail;
		aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetPremium",data,false,{
			headers:{
				'Content-Type': 'application/json'
			}
		})
			.then(function(response){
				if(response.ResponseCode == 1){
					// scope.policyDetails.RenewalGrossPremium = response.ResponseData;
					// rID.insuredDetails.PremiumDetail = response.ResponseData;
					// rID.insuredDetails.PremiumDetail.TotalPremium = 0;
					// angular.forEach(rID.insuredDetails.PremiumDetail.ProductPremium,function(v,i){
					// 	rID.insuredDetails.PremiumDetail.TotalPremium = parseInt(rID.insuredDetails.PremiumDetail.TotalPremium) + parseInt(v.Premium);
					// 	if(parseInt(v.Premium) <= 0 ){
					// 				rID.hideSubmitButton = false;
					// 			}
					// });
					// if(rID.insuredDetails.PremiumDetail.TotalPremium >= 100000 && !rID.insuredDetails.IsPAN){
					// 	if(panCardFlag){
					// 		$('#pan-card-modal').modal({backdrop: 'static', keyboard: false});
					// 	}
					// 	panCardFlag = false
					// }
				}else{
					$rootScope.alertConfiguration('E',response.ResponseMessage);
				}
			},function(err){

			});
	}

/* End of calulating premium */


	 /* Age difference validation */

	 function userAgeCal(date){
		var userDate = new Date(date);
		var currentDate = new Date();
		var dateDiff = currentDate - userDate;
		$scope.userAge = Math.floor((dateDiff/1000) / (60*60*24*365.25));
		if ($scope.productSelected == 'ActivHealthV2' && $scope.userAge > 65) {
			$scope.underAge = false;
		}
		else {
			$scope.underAge = true;
		}
	 }

	 function checkAgeDiff(date,param){
		userAgeCal(date);
		let calculatePremiumParams = {};

		$scope.insuredMember.Age = $scope.userAge;
		$scope.insuredMember.AGE = $scope.userAge;
		$scope.membersDataList[$scope.selectedMemberIndex + 1].Age = $scope.userAge
		
		calculatePremiumParams = {
			"ReferenceNo": $scope.insuredMemberDetails.ReferenceNo,
			"PolicyNumber": $scope.insuredMemberDetails.PolicyNumber,
			"MemberID":$scope.insuredMemberDetails.MemberId,
			"Relation":$scope.insuredMemberDetails.personalDetails.Relation,
			"DOB":param
		}

		if(!productWiseAgeValidtion($scope.userAge , '')){
			return false;
		}
		else{
			$scope.insuredMember.DOB = param; 
			// $scope.insuredMember.month + '/' + $scope.insuredMember.day + '/' + $scope.insuredMember.year;
		}

		
		// UpdateDOB(calculatePremiumParams);
	}

/* End of age difference validation */

	/*---------- End of To Check age difference & validate age */


	/*---------- Formation of DOB ------------*/

	$scope.changeDate = function (day, month, year) {
		$scope.insuredMember.day =  $scope.insuredMember.day.length > 1? $scope.insuredMember.day : '0'+$scope.insuredMember.day;
		$scope.insuredMember.month =  $scope.insuredMember.month.length > 1? $scope.insuredMember.month : '0'+$scope.insuredMember.month;
		$scope.DOB = $scope.insuredMember.day + '/' + $scope.insuredMember.month + '/' + $scope.insuredMember.year;
		let changed_DOB = month + '-' + day + '-' + year;
		$scope.calculatedDob = year + "-" + month + "-" + day;
		$scope.calculatedDob = year + "-" + month + "-" + day;
		$timeout(function () {
			if ($scope.editMemberForm.dob.$valid && year.length == 4) {
				checkAgeDiff($scope.calculatedDob, $scope.DOB);
			}
		}, 100);
	}

	/*------------- End of formation of DOB ----------*/

	/*---------------------- To Select Member -------------*/
	$scope.relationChange = false;
	$scope.selectMember = function (member) {

		$scope.insuredMember.day = "";
		$scope.insuredMember.month = "";
		$scope.insuredMember.year = "";
		$scope.DOB = "";
		$scope.ft = "";
		$scope.inches = "";
		
		let refMemberlist = ["SELF","SPOUSE","FATHER", "MOTHER", "FATHER-IN-LAW", "MOTHER-IN-LAW", "KID", "BROTHER", "SISTER", "GRANDFATHER", "GRANDMOTHER", "GRANDSON", "GRANDDAUGHTER",  "SON-IN-LAW", "DAUGHTER-IN-LAW", "BROTHER-IN-LAW", "SISTER-IN-LAW", "NEPHEW", "NIECE"]
			if($scope.parseIntString($scope.activeMember[$scope.activeMember.length-1])){
				$scope.activeMember = $scope.activeMember.substring(0,$scope.activeMember.length-1)
			}
			$scope.membersList.members[refMemberlist.indexOf($scope.activeMember.toUpperCase())].isSelected = false;
			$scope.membersList.members[refMemberlist.indexOf(member)].isSelected = true;
			$scope.insuredMembers[$scope.selectedMemberIndex].RelationWithProposer = member;
			$scope.activeMember = member;
			$scope.insuredMember.Relation = member;
			$scope.insuredMember.RelationWithProposer = member;
			$scope.insuredMember.RelationType = member;
			$scope.insuredMember.day = "";
			$scope.insuredMember.month = "";
			$scope.insuredMember.year = "";
			$scope.relationChange = true;
			$scope.membersDataList[$scope.selectedMemberIndex + 1].RelationWithProposer = member;
			$scope.membersDataList[$scope.selectedMemberIndex + 1].RelationType = member;

		

		$scope.insuredMember.Occupation = ''; $scope.insuredMember.Designation = '';

		if ($scope.insuredMember.Relation == 'FATHER' || $scope.insuredMember.Relation == 'FATHER-IN-LAW') {
			$scope.insuredMember.Salutation = 'Mr';
			$scope.insuredMember.Gender = 'Male';
		}

		if ($scope.insuredMember.Relation == 'SPOUSE' && $scope.userpolicy.InsuredMembers[0].Gender == 'F'){
			$scope.insuredMember.Salutation = 'Mr';
			$scope.insuredMember.Gender = 'Male';
		}
		if ($scope.insuredMember.Relation == 'SPOUSE' && $scope.userpolicy.InsuredMembers[0].Gender == 'M'){
			$scope.insuredMember.Salutation = 'Mrs';
			$scope.insuredMember.Gender = 'Female';
		}

		if ($scope.insuredMember.Relation == 'SPOUSE' || $scope.insuredMember.Relation == 'MOTHER' || $scope.insuredMember.Relation == 'MOTHER-IN-LAW') {
			$scope.insuredMember.Salutation = 'Mrs';
			$scope.insuredMember.Gender = 'Female';
		}

		if ($scope.insuredMember.Relation == 'KID') {
			$scope.insuredMember.Salutation = "";
			$scope.insuredMember.Gender = "";
		}

		

		if ($rootScope.rfbProduct && $scope.insuredMember.Relation == 'KID') {
			var rfbsuminsuredArray = [];
			var kidUpdsellFlagPlace

			if ($scope.suminsuredArray.length >= 1) {
				for (let i = 0; i < $scope.sumInsuredList.length; i++) {
					var halfVal = $scope.suminsuredArray[0] / 2;
					if (halfVal <= $scope.sumInsuredList[i].amount) {
						kidUpdsellFlagPlace = i;
						break;
					}

				}
				if(kidUpdsellFlagPlace){
					rfbsuminsuredArray.push($scope.sumInsuredList[kidUpdsellFlagPlace - 1].amount + '.00')
				}

				if ($scope.upsellFlag == 'Y' && $scope.insuredMembers[0].UpSellSumInsured != 0) {
					rfbsuminsuredArray.push($scope.sumInsuredList[kidUpdsellFlagPlace].amount + '.00')
				}

			}

			$scope.suminsuredArray = rfbsuminsuredArray;

		} else {
			$scope.suminsuredArray = $scope.suminsuredArrayCopy
		}

		if ($scope.insuredMember.Relation == 'SELF') {
			var DOB = [];

			$scope.insuredMember.FirstName = $scope.policyDetails.FirstName;
			$scope.insuredMember.MiddleName = $scope.policyDetails.MiddleName;
			$scope.insuredMember.LastName = $scope.policyDetails.LastName;
			$scope.insuredMember.Mobile = $scope.policyDetails.Mobile;
			$scope.insuredMember.Salutation = $scope.policyDetails.Salutation;

			if ($scope.policyDetails.Salutation == "Mr") {
				$scope.insuredMember.Gender = 'Male';
			}

			if ($scope.policyDetails.Salutation == "Mrs" || $scope.policyDetails.Salutation == "Ms") {
				$scope.insuredMember.Gender = 'Female';
			}

			DOB = $scope.policyDetails.DOB.split('/');
			$scope.insuredMember.day = DOB[0];
			$scope.insuredMember.month = DOB[1];
			$scope.insuredMember.year = DOB[2];
			$scope.DOB = $scope.insuredMember.day + '/' + $scope.insuredMember.month + '/' + $scope.insuredMember.year;

		}
	}

	/*---------------------- To Select Member Ends-------------*/

	/*-------------------- Submit Member Details ----------------------*/
	$scope.callCover = true;
	$scope.submitMemberDetails = function (event, validForm) {

		//  if(!(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.insuredMemberDetails.personalDetails.Email))){
		//        //$rootScope.alertConfiguration('E',"Please enter a valid email id");
		//        //$("html, body").animate({ scrollTop: $("#insured-member-details").offset().top - 80 }, 300);
		//         $scope.emailError = true
		// 		return false;
		//     }

		if (!validForm) {
			$scope.showErrors = true;
			$rootScope.alertConfiguration('E', "Please fill valid data");
			$("html, body").animate({
				scrollTop: $("#accordion").offset().top - 100
			}, 300);
			return false;
		}

		if ($scope.occupation != '') {
			$scope.insuredMemberDetails.occupation.Occupation = $scope.occupation.OccupationCode;
		}
		

		if ($scope.occupation == '' && $scope.insuredMemberDetails.relationWithProposer.RelationWithProposer == 'SELF' && $scope.occupationType == 'Salaried') {
			$scope.insuredMemberDetails.occupation.Occupation = 'O553';
		}

		if ($scope.insuredMember.Occupation == '' && ($scope.productSelected == "ActivHealth" || $scope.productSelected == "ActivHealthV2" || $scope.productSelected == "ActivSecure")) {
			$rootScope.alertConfiguration('E', "Please fill valid data");
			$("html, body").animate({
				scrollTop: $("#accordion").offset().top - 100
			}, 300);
			
			for (let i = 0; i < document.getElementsByClassName('errormsg').length; i++) {
				document.getElementsByClassName('errormsg')[i].style.display = 'block';
			}
			return false;
		}
		if(($scope.productSelected == "ActivHealth" || $scope.productSelected == "ActivHealthV2" || $scope.productSelected == "ActivSecure" || $scope.productSelected == "POSActivSecure") && $scope.callCover){
			$scope.callCover = false;
			$scope.submitOptionalCovers(event, validForm);
			return;
		}

		$scope.insuredMemberDetails.personalDetails.DOB = $scope.insuredMember.year + "-" + $scope.insuredMember.month + "-" + $scope.insuredMember.day;

		$scope.insuredMemberUpdatedDetails = angular.copy($scope.insuredMemberDetails);
		// delete $scope.insuredMemberUpdatedDetails.addressDetails;
		delete $scope.insuredMemberUpdatedDetails.relationWithProposer;
		delete $scope.insuredMemberUpdatedDetails.personalDetails.optionalCoverages;

		$scope.insuredMemberUpdatedDetails.personalDetails.FirstName = $scope.insuredMember.FirstName;
		$scope.insuredMemberUpdatedDetails.personalDetails.MiddleName = $scope.insuredMember.MiddleName;
		$scope.insuredMemberUpdatedDetails.personalDetails.LastName = $scope.insuredMember.LastName;
		$scope.insuredMemberUpdatedDetails.personalDetails.DOB = $scope.insuredMember.DOB;
		$scope.insuredMemberUpdatedDetails.personalDetails.Email = $scope.insuredMember.Email;
		$scope.insuredMemberUpdatedDetails.personalDetails.MobileNumber = $scope.insuredMember.Mobile;
		$scope.insuredMemberUpdatedDetails.personalDetails.Occupation = $scope.insuredMember.Occupation;
		$scope.insuredMemberUpdatedDetails.personalDetails.OccupationCode = $scope.insuredMember.Occupation_ID;
		$scope.insuredMemberUpdatedDetails.personalDetails.Designation = $scope.insuredMember.Designation;
		$scope.insuredMemberUpdatedDetails.personalDetails.NatureOfDuty = $scope.insuredMember.NatureOfDuty;
		$scope.insuredMemberUpdatedDetails.personalDetails.Hazardous_YN = $scope.insuredMember.Hazardous_YN;
		$scope.insuredMemberUpdatedDetails.personalDetails.RoomType = $scope.insuredMember.RoomType;
		$scope.insuredMemberUpdatedDetails.personalDetails.optionalCoverages = $scope.insuredMember.optionalCoverages;
		$scope.insuredMemberUpdatedDetails.personalDetails.Relation = $scope.insuredMember.RelationWithProposer;
		$scope.insuredMemberUpdatedDetails.personalDetails.RelationWithProposer = $scope.insuredMember.RelationWithProposer;
		$scope.insuredMemberUpdatedDetails.personalDetails.Gender = $scope.insuredMemberDetails.personalDetails.Gender;
		$scope.insuredMemberUpdatedDetails.personalDetails.Deductible = $scope.insuredMember.Deductible;

		$scope.insuredMemberUpdatedDetails.occupation.Occupation = $scope.insuredMember.Occupation;
		$scope.insuredMemberUpdatedDetails.occupation.OccupationCode = $scope.insuredMember.Occupation_ID;

		$scope.insuredMemberUpdatedDetails.addressDetails.Pincode = $scope.insuredMember.HomePincode;
		$scope.insuredMemberUpdatedDetails.addressDetails.City = $scope.insuredMember.HomeCity;
		$scope.insuredMemberUpdatedDetails.addressDetails.State = $scope.insuredMember.HomeState;


		
		
		// $scope.insuredMemberUpdatedDetails.personalDetails.optionalCoverages = $scope.insuredMember.optionalCoverages;

		/*-------------------- To Update member ------------------------------ */

		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpdateMember",
				$scope.insuredMemberUpdatedDetails,
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					if($scope.upgradeZ){
						updateZone($scope.insuredMember.HomeZone);
					}
					$rootScope.alertConfiguration('S', $scope.activeMember + " updated Successfully ");
					$scope.fetchInsuredMembers();
					//$scope.fetchPolicyDetails();
				} else if (data.ResponseCode == 0) {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
				}
			});

		/*-------------------- To Update member ENds------------------------------ */

	}
	
	/*-------------------- End of Submit Member Details ----------------------*/

	function updateZone(param) {

		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/UpgradeZone", {
					"ReferenceNo": $sessionStorage.refNo,
					"PolicyNumber": $sessionStorage.policyNo,
					"Zone": param
				},
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					$scope.userpolicy.HomePincode = $scope.insuredMember.HomePincode;
					$scope.userpolicy.HomeCity = $scope.insuredMember.HomeCity;
					$scope.userpolicy.HomeState = $scope.insuredMember.HomeState;
					$scope.userpolicy.HomeDistrict = $scope.insuredMember.HomeState;
					
					sessionStorage.setItem('userData', JSON.stringify($scope.userpolicy));
					$scope.policyDetails.RenewalGrossPremium= data.ResponseData.premiumResponse.RenewGrossPremium;
				} else if (data.ResponseCode == 0) {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": data.ResponseMessage,
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
				}
			})

	}
	
}]);
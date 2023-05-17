/**   
	Module: Renewal View Member Add User Page Controller (This module contains functionality and feature of adding new member in existing policy.)
	Author: Pandurang Sarje 
    Date: 11-07-2020
**/

'use strict';

var renewalViewMemberAddUserApp = angular.module("renewalViewMemberAddUserModule", []);

renewalViewMemberAddUserApp.controller("renewal-view-member-add-user", ['ABHI_CONFIG','$scope', '$rootScope', '$location', '$sessionStorage', '$window', '$timeout', 'productValidationService', 'RenewService', 'appService','$filter', function (ABHI_CONFIG, $scope, $rootScope, $location, $sessionStorage, $window, $timeout, productValidationService, RenewService, appService, $filter) {
    var aS = appService;
	
	/*---- Page Redirection When $sessionStorage.refNo Not Available ----*/

	if ($sessionStorage.refNo == null || $sessionStorage.refNo == 'undefined') {
		$location.path('renewal-renew-policy');
		return false;
	}

	$scope.oPDArray = [];
	for (var i = 5000; i <= 20000; i = i + 1000) {
        //var objVal = ''

        $scope.oPDArray.push({
            "key": String(i),
            "val":  String(i)
        })


    }

	/*---- End of Page Redirection When $sessionStorage.refNo Not Available ----*/
	
	/*---- Data Inilization ----*/
	$scope.userpolicy = JSON.parse(sessionStorage.getItem("userData"));
	console.log($scope.userpolicy, "userPolicy");
	$scope.day = "";
	$scope.month = "";
	$scope.year = "";
	$scope.DOB = "";
	$scope.addMemberForm;
	$scope.ft = "";
	$scope.inches = "";
	$scope.show = false;
	$scope.productName = $sessionStorage.productName;
	$scope.personalDetails = $sessionStorage.personalDetials;
	$scope.upsellFlag = $sessionStorage.upsellFlag;
	$scope.productSelected = $scope.userpolicy.ProductName.split(' ').join('');
	$scope.isDisabled = true;
	$scope.userAge = "";
	$scope.underAge = true;
	

	$scope.productJson= {
		'ActivHealth': ["isProf", "isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isCitizen", "isRelation", "isHeight", "isWeight", "isOccupation", "isDesignation", "isDuty", "isHazardous", "isIncome", "isGender",  "isSI", "isHelthLife", "isPrePolicy","isPolicyType",  "isAlcohol", "isMedi", "isED", "isDOD", "isLCD", "isDTG"],//isID "isPlan", "isME", "isPPN", 
		'ActivHealthV2': ["isProf", "isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isCitizen", "isRelation", "isHeight", "isWeight", "isOccupation", "isDesignation", "isDuty", "isHazardous", "isIncome", "isGender",  "isSI", "isHelthLife", "isPrePolicy","isPolicyType", "isAlcohol", "isMedi", "isED", "isDOD", "isLCD", "isDTG"], //isID "isPlan", "isME", "isPPN", 
		'ActivAssure': ["isProf", "isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isCitizen", "isRelation", "isHeight", "isWeight", "isOccupation", "isIncome", "isGender", "isRoom", "isPPN", "isSI", "isHelthLife", "isPrePolicy","isPolicyType",  "isPPN" ,"isCovers"], //isID "isPlan",
		'ActivSecure': ["isProf", "isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isCitizen", "isRelation", "isHeight", "isWeight", "isGender", "isOccupation", "isDesignation", "isDuty", "isHazardous", "isIncomeText", "isSI", "isHelthLife", "isBelow60", "isCough", "isPrePolicy", "isAlcohol", "isMedi", "isDOD", "isED", "isDTG", "isLCD"], //isID, "isHCB" 
		'SuperTopUp': ["isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isCitizen", "isRelation", "isHeight", "isWeight",  "isSI", "isHelthLife", "isPrePolicy", "isAlcohol", "isDeduct", "isGender", "isMedi", "isDOD", "isED", "isDTG", "isLCD"], //isID
		'ActivCareV2': ["isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isRelation", "isHeight", "isWeight", "isHelthLife", "isPrePolicy", "isAlcohol", "isPolicyType", "isID" ],
		'GlobalHealthSecure-Revised': ["isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isMobile","isSI", "isHelthLife", "isPrePolicy", "isCovers", "isWaiting","isRelation", "isSI"],
		'ArogyaSanjeevaniPolicy':["isFristName", "isMiddleName", "isLastName",  "isHeight", "isWeight", "isDOB", "isEmail", "isPincode", "isMobile","isSI", "isRelation", "isPan", "isHelthLife", "isPrePolicy", "isGender"],
		'POSActivSecure': ["isProf", "isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isCitizen", "isRelation", "isHeight", "isWeight", "isGender", "isOccupation", "isDesignation", "isDuty", "isHazardous", "isIncomeText", "isSI", "isHelthLife", "isBelow60", "isCough", "isPrePolicy", "isAlcohol","isCovers", "OC-SP", "OC-WC", "isDCB", "isMedi", "isDOD", "isED", "isDTG", "isLCD"], //isID, "isHCB"
		'POSActivAssure': ["isProf", "isFristName", "isMiddleName", "isLastName", "isDOB", "isEmail", "isPincode", "isMobile", "isCitizen", "isRelation", "isHeight", "isWeight", "isOccupation", "isIncome", "isGender", "isRoom", "isPPN", "isSI", "isHelthLife", "isPrePolicy","isPolicyType",  "isPPN" ,"isCovers"], //isID "isPlan",
	}

	$scope.setAlcohalCount = function(){
		switch ($scope.productSelected) {
			case "ActivSecure":
					$scope.AlcoholCount = 14;
					$scope.SmokeCount = 70;
					$scope.PanmasalaCount = 7;
				break;
		
			default:
				$scope.AlcoholCount = 14;
				$scope.SmokeCount = 140;
				$scope.PanmasalaCount = 70;
				break;
		}
	}

	$scope.setAlcohalCount();

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

	 /* To Fetch Plans */
	 $scope.productsPlans = {
		'ActivHealth': ['Platinum - Enhanced','Platinum - Essential','Platinum - Premiere'],
		'ActivHealthV2': ['Platinum - Enhanced','Platinum - Essential','Platinum - Premiere'],
		'ActivCareV2': ['Standard Plan','Classic Plan','Premier Plan'],
	}

	/* Retail Rider Questions and Sub-questions */
	//$scope.Terminal_illness, $scope.newMemberToInsure.Have_you_ever_been_diagnosed, $scope.Persons_is_pregnant_YN, $scope.Surgery_doneYN, $scope.Blood_X_ray ='';
	$scope.retailRiderQuestionArray = {
		"Terminal_illness" : ["TIName_of_Surgery","TIDisease_name","TIDate_of_Diagnosis","TILast_Consultation_Date","TIDetails_of_Treatment","TIDisability","TIStart_Date_Hospitalization","TIEnd_date_Hospitalization","TIAny_Other_information"],
		"Have_you_ever_been_diagnosed" : ["DGDisease_name","DGDisability","DGLast_Consultation_Date","DGDate_of_Diagnosis","DGName_of_Surgery","DGDetails_of_Treatment_given","DGOther_information"],
		"Persons_is_pregnant_YN" : ["Date_of_delivery", "PPExact_diagnosis", "PPDate_of_Diagnosis", "PPLastConsultation_Date", "PPDetails_Treatment", "PPDr_Name", "PPOther_information"],
		"Surgery_doneYN" : ["SDExact_diagnosis", "SDDate_diagnosis", "SDLast_consultation_date", "SDDetails_treatment", "SDDr_Name", "SDOtherdetails"],
		"Blood_X_ray" : ["BXExact_diagnosis", "BXDate_diagnosis", "BXconsultation_date", "BXDetails_treatment", "BXDr_name", "BXOther_Detail"]
	}

   	$scope.plans=$scope.productsPlans[$scope.productSelected];

   $scope.getActivHealthCode =function() {
	let getCode = $scope.userpolicy.PlanName.split(" ");
	if(getCode[getCode.length - 1] != "Premiere"){
		$scope.productJson['ActivHealth'] = [...$scope.productJson['ActivHealth'],...['isPAC','isCIC','isICMI',, 'isWMC',  'isHCB',"isCovers", 'isRoom']]; //'isOPDC',
		$scope.productJson['ActivHealthV2'] = [...$scope.productJson['ActivHealthV2'],...['isPAC','isCIC','isICMI', 'isWMC', 'isHCB', "isCovers", 'isRoom']];
	}
	
	if(getCode[getCode.length - 1] == "Premiere"){
		return getCode[getCode.length - 1].slice(0,getCode[getCode.length - 1].length-1)
	}
	return getCode[getCode.length - 1];
}

$scope.getRefIndex = function () {
	let list = document.getElementsByClassName("ref-index");
	let listM = document.getElementsByClassName("ref-index-m");
	  setTimeout(() => {
		for (let i_ref = 0; i_ref < list.length; i_ref++) { //for header Index
			
				list[i_ref].innerHTML = i_ref + 1;
				listM[i_ref].innerHTML = i_ref + 1;
				console.log(list[i_ref], "header Index");
		}
	}, 1000);   
  }

$scope.getRefIndex();

// if($scope.productSelected == 'ActivHealth' || $scope.productSelected == 'ActivHealthV2'){
// 	$scope.productSelected = $scope.productSelected + $scope.getActivHealthCode();
// }

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

$scope.PACover123 = false;
$scope.APCArr = ["isDCB","OC-WC", "OC-TTDB", "OC-AIH", "OC-CB", "OC-BBB", "OC-BB", "OC-AS", "OC-AME", "OC-WEA", "OC-EMI-p", "OC-loan-p"];
$scope.setOCForPA= function(){
	$scope.PACover123 = true;
	$scope.productJson[$scope.productSelected].push(...$scope.APCArr);
	$scope.getRefIndex();
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
			$scope.setOCForPA();
			return "PA4"

		case "Plan 5":
			$scope.setOCForPA();
			return "PA5"
	
		default:
			break;
	}
}
 
	switch ($scope.productSelected) {
		case "SuperTopUp":
			$scope.productCode = "ST"
			if($scope.userpolicy.PlanName == "Plan B"){
				$scope.productCode = "STPlan-B";
			}
			else{
				$scope.productCode = "STPlan-A";
			}
			console.log($scope.productCode, "STCode");
			break;
		
		case "ActivAssure":
			$scope.productCode = "DIAMOND"
			break;

		case "ActivHealthV2":
		case "ActivHealth":
			$scope.productCode = $scope.getActivHealthCode();
			$scope.pAPL = "PAPL"+$scope.productCode;
			$scope.cIPL = "CIPL"+$scope.productCode;
			$scope.iCMIPL = "ICMIPL"+$scope.productCode;
		break;
		
		case "ActivSecure":
			if($scope.userpolicy.ProductCode == "4218"){
				$scope.productCode = "CS";
				$scope.productJson[$scope.productSelected].push(...["isDCB","OC-WC", "OC-SP", "isCovers"]);
				$scope.PACover123 = true;
			}
			else if($scope.userpolicy.ProductCode == "4111"){
				$scope.productCode =  $scope.getActivSecurePACode($scope.userpolicy.PlanName);
			}
			else{
				$scope.productCode =  $scope.getActivSecureCICode($scope.userpolicy.PlanName);
				$scope.productJson[$scope.productSelected].push(...["isDCB","OC-WC", "OC-SP", "isCovers"]);
				$scope.PACover123 = true;
			}
		break;

		case "ArogyaSanjeevaniPolicy":
		$scope.productCode = "arogya-sanjeevani"
		break;
	}

	if($scope.productCode){
		sessionStorage.setItem('plPlan', $scope.productCode);
	}

	 /* To Fetch Sum Insured Data */

	 aS.getData("assets/data/sum-insured.json", "", false, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (data) {
            if (data.ResponseCode == 1) {
                $scope.sumAmounts = data.ResponseData;
				if($scope.productSelected == "ActivSecure"){
					$scope.secureSi("inIt");
				}
            } else {

            }
        }, function (err) {

        })


		$scope.inItsetCoversSi = function (pCode) {
			let arry= []
			for (let i = 0; i < $scope.sumInsuredList.length; i++) {
					if($scope.sumInsuredList[i][pCode]){
						arry.push($scope.sumInsuredList[i])
					}
				}
				return arry
		}


    /* End of fetching sum insured data */
	$scope.deducAmounts=[];
	$scope.setDeductable = function (sumi) {
		switch (sumi) {
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
			case "700000":
				$scope.deducAmounts=["500000", "700000"]
				if($scope.userpolicy.SumInsuredType =='Family Floater'){
					return $scope.userpolicy.InsuredMembers[1].Deductible;
				}
				break
			default:
				$scope.deducAmounts=["500000", "700000", "1000000"]
				if($scope.userpolicy.SumInsuredType =='Family Floater'){
					return $scope.userpolicy.InsuredMembers[1].Deductible;
				}
				break
		}

		return $scope.deducAmounts[0];
	}

	$scope.changeDeductible = function(sm){
		if($scope.newMemberToInsure.SumInsuredType =='Family Floater' && (parseInt($scope.userpolicy.InsuredMembers[1].Deductible) < parseInt(sm) || parseInt($scope.userpolicy.InsuredMembers[1].Deductible) > parseInt(sm))){
			let policyTypeMsg = sm + "Deductible will be applyed to all the member insured as this policy type is family floater, do you want to change deductible?";
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Confirm",
				"modalBodyText": "<p>"+policyTypeMsg+"</p>",
				"showCancelBtn": true,
				"modalSuccessText": "Yes",
				"modalCancelText": "No",
				"showAlertModal": true,
				"hideCloseBtn": true,
				"positiveFunction": function () {
						$scope.changeFFIS = $scope.newMemberToInsure.SumInsured;
						$scope.newMemberToInsure.Deductible = sm;
				},
				"negativeFunction": function () {
					$scope.newMemberToInsure.Deductible = $scope.userpolicy.InsuredMembers[1].Deductible;
				}
			}

		}
		else{
			$scope.newMemberToInsure.Deductible = sm;
		}
	}

	$scope.roundOffSI = function (params) {
		let num = ""+Math.round(params);
		let YZero = false;
		let SI = "";
		for (let i = 0; i < num.length; i++) {
			if(num[i]=="0"){
				YZero = true;
			}
			if(YZero && num[i]!="0"){
				SI = SI + "0";
			}
			else{
				SI = SI + num[i];
			}
			
		}
		return SI;
	}

	$scope.newMemberToInsure = {
		"ReferenceNo": $sessionStorage.refNo, //Mandatory
		"PolicyNumber": $sessionStorage.policyNo, // Mandatory
		"changePlan": $scope.userpolicy.PlanName,
		"Salutation": "", // Mandatory
		"FirstName": "", // Mandatory
		"MiddleName": "",
		"LastName": "", // Mandatory
		"Mobile": $scope.personalDetails.Mobile,
		"Email": $scope.personalDetails.Email,
		"DOB": "", // Mandatory
		"idNumber":"",

		"day":'',
		"month":'',
		"year":'',

		"dayDD":'',
		"monthDD":'',
		"yearDD":'',

		"dayLCD":'',
		"monthLCD":'',
		"yearLCD":'',

		"waitingPeriod":"",
		"Age": "",
		"Height": "",
		"ft":"",
		"inches":"",
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
		"InitialSumInsured": $scope.roundOffSI(parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured)> 0?$scope.userpolicy.InsuredMembers[1].InitialSumInsured:$scope.userpolicy.InsuredMembers[1].SumInsured),
		"SumInsured": $scope.roundOffSI($scope.userpolicy.InsuredMembers[1].SumInsured), // Mandatory
		"SumInsuredType": $scope.userpolicy.SumInsuredType == "Individual"?$scope.userpolicy.InsuredMembers.length > 1?"Multi Individual":"Individual":$scope.userpolicy.SumInsuredType,
		"UpSellSumInsured": "",
		"EarningNonEarning":"",
		"Deductible": $scope.setDeductable($scope.roundOffSI($scope.userpolicy.InsuredMembers[1].SumInsured)),
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
		"PreviousPolicyNumber":"",
		"PreviousPolicySumInsured": "",
		"PreviousPolicyClaims": "",
		"PreviousInsurerName": "",
		"PreviousPolicyRejectedYN": "",
		"PreviousPolicyRejectedDetails": "",
		"AnnualIncome":"",
		"NatureOfDuty":"",
		"OccupationNatur":"N",
		"RoomType":$scope.userpolicy.InsuredMembers[1].RoomType,
		"RoomTypeAnyRoom":"N",
		"RoomTypeSharedRoom":"N",
		"RoomTypesingleRoom":"N",
		"NO_Of_Days": "",
		"PAC":"",
		"CIC":"",
		"ICMI":"",
		"WMC":"",
		"OPDC":"",
		"HCB":"",
		"DCB":"",
		"ME":"",
		"PPN":"",

		"PAC_M":"",
		"CIC_M":"",
		"ICMI_M":"",
		"WMC_M":"",
		"OPDC_M":"",
		"HCB_M":"",
		"DCB_M":"",
		"ME_M":"",
		"PPN_M":"",

		"OC_TTDB":"",
		"OC_BBB":"",
		"OC_BB":"",
		"OC_EMI":"",
		"OC_Loan":"",
		"OC_AIH":"",
		"OC_CB":"",
		"OC_AS":"",
		"OC_AME":"",
		"OC_WEA":"",

		"DateofDiagnosis":"",
		"exactDiagnosis":"",
		"LastConsultationDate":"",
		"Detailsoftreatment":"",

		"optionalCoverages":[],

		"previousPolicy":"N",
		"previousTreatment":"N",
		"PreviousPolicyNumberYN":"",
		"PreviousPolicyNumber":"",
		"PreviousPolicyBenefit":"",
		"PreviousPolicyClaims":"N",
		"PreviousPolicyRejectedYN":"N",
		"PreviousPolicyRejectedDetails": "",
		"PreviousInsurerName": "",
		"PreviousPolicyName":"",

		"Below60Years":"N",
		"Diseases":"",

		"RecurrentCough":"N",

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
		"MembQuestions":[],
		"desktop":"D"
	}

	$scope.size = function(){
	$scope.vw = screen.width;
		if ($scope.vw <= 480) {
			$scope.newMemberToInsure.desktop = "M";
			
		}else{
			$scope.newMemberToInsure.desktop = "D";
			console.log("desktop");
		}
	}
	$scope.size();
	/*---- End of Data Inilization ----*/

	$scope.secureSi = function (params) {
		let ProposerSI = "";
		let SI = "";
		if(params = "inIt"){
			// for testing
			if(!$scope.userpolicy.InsuredMembers[0].ProposerAnnualIncome){
				$scope.userpolicy.InsuredMembers[0].ProposerAnnualIncome = "1250000";
			}
			// for testing

			
			if($scope.userpolicy.InsuredMembers[1].RelationWithProposer.toUpperCase() == "SELF"){
				SI =  parseInt($scope.roundOffSI(parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured)> 0?$scope.userpolicy.InsuredMembers[1].InitialSumInsured:$scope.userpolicy.InsuredMembers[1].SumInsured))/2;
			}
			else{
				ProposerSI = parseInt($scope.userpolicy.InsuredMembers[0].ProposerAnnualIncome)*12;
				SI =  ProposerSI/2;
			}

			$scope.newMemberToInsure.SumInsured = $scope.getSecureSi(SI);

			if($scope.productCode == 'PA1' || $scope.productCode == 'PA2' || $scope.productCode == 'PA3'){
				if(parseInt($scope.newMemberToInsure.SumInsured)>=500000){
					$scope.setOCForPA();
				}
			}
			
		}
		
	}

	$scope.getSecureSi = function (SI) {
		let maxSI = "";
		let MinSi = ""
		for (let sum = 0; sum < $scope.sumAmounts.length; sum++) {
			// console.log($scope.sumAmounts[sum][$scope.productCode], $scope.sumAmounts[sum].amount , ($scope.productSelected == 'ActivSecure' && $scope.parseIntString($scope.sumAmounts[sum].amount) <= $scope.parseIntString($scope.newMemberToInsure.InitialSumInsured))); 
			if(parseInt($scope.sumAmounts[sum].amount) <= SI && $scope.sumAmounts[sum][$scope.productCode]){
				maxSI = $scope.sumAmounts[sum].amount;
			}

			if($scope.sumAmounts[sum][$scope.productCode] && MinSi == ""){
				MinSi = $scope.sumAmounts[sum].amount;
			}
		}

		if(maxSI == ""){
			return MinSi;
		}

		return maxSI;
	}

	$scope.newMemberToInsure.HomePincode=$scope.userpolicy.HomePincode;

	/* Annual Income Dropdown */

    $scope.annulaIncomeDrop = [{
        "key": "500000",
        "val": "Up to 5 Lakhs"
    }, {
        "key": "1000000",
        "val": "5 Lakhs to 10 Lakhs"
    }, {
        "key": "2000000",
        "val": "10 Lakhs to 20 Lakhs"
    }, {
        "key": "2500000",
        "val": ">20 Lakhs"
    }]

    /* End of Annual Income Dropdown */

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
	//   {
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
        "ActivHealthV2": true,
        "ActivHealth": true,
        "CK": true,
        "ActivSecure": true,
        "key": "O108",
        "val": "Government Employee"
    }, {
        "ActivHealthV2": true,
        "ActivHealth": true,
        "CK": true,
        "ActivSecure": true,
        "key": "O002",
        "val": "Private Service"
    }, {
        "ActivHealthV2": true,
        "ActivHealth": true,
        "CK": true,
        "key": "O051",
        "val": "business"
    }, {
        "ActivSecure": true,
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
        "ActivSecure": true,
        "key": "O009",
        "val": "Others"
    }, {
        "ActivHealthV2": false,
        "ActivHealth": false,
        "key": "O060",
        "val": "Architects"
    },
	//  {
    //     "PL": true,
    //     "key": "O052",
    //     "val": "Employee"
    // }, 
	{
        "ActivHealthV2": false,
        "ActivHealth": false,
        "key": "O557",
        "val": "CA"
    }, {
        "ActivHealthV2": false,
        "ActivHealth": false,
        "key": "O104",
        "val": "business2"
    }, {
        "ActivHealthV2": true,
        "ActivHealth": true,
        "key": "O057",
        "val": "Doctors"
    }, {
        "ActivHealthV2": true,
        "ActivHealth": true,
        "key": "O058",
        "val": "Lawyers"
    }, {
        "ActivHealthV2": true,
        "ActivHealth": true,
        "key": "O561",
        "val": "Other"
    }]

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

// checkInclude starts
$scope.checkInclude =function(field) {
	// if(($scope.productSelected == "ActivHealth" || $scope.productSelected == "ActivHealthV2") && (field == "isDCB" || field == "isHCB") && $scope.productCode == "Premiere"){
	// 	return false; 
	// }
	if(($scope.productSelected == "ActivHealth" || $scope.productSelected == "ActivHealthV2") && field == "isWMC" &&  $scope.productCode != "Essential"){
		return false; 
	}
	return $scope.productJson[$scope.productSelected].includes(field);
}
// checkInclude ends

  
	/* Nature of duty functionality */
	$scope.planPayload;
	$scope.setChangePlanPayload = function(plan){
		$scope.planPayload = {
			"ReferenceNumber": $scope.userpolicy.ReferenceNo,
			"PolicyNumber": $scope.userpolicy.PolicyNumber,
			"PlanCode":"",
			"PlanName":plan,
			"ProductCode":""
		}

		$scope.newMemberToInsure.changePlan= plan;

	}

	$scope.policyTypeload;
	$scope.setPolicyTypePayload = function(type){
		
		if(type == 'Family Floater'){
			let FFTypeMsg="";
			let NonFFMembers = []
			let kicCount = 1;

			if($scope.newMemberToInsure.Relation == "SELF" || $scope.newMemberToInsure.Relation == "SPOUSE" || $scope.newMemberToInsure.Relation.indexOf("KID") > -1 || $scope.newMemberToInsure.Relation.indexOf("Kid") > -1){
				let members = angular.copy($scope.userpolicy.InsuredMembers).splice(1);
				let highSum = parseInt($scope.newMemberToInsure.SumInsured);
				for (let i = 0; i < members.length; i++) {
					if(members[i].RelationType == "KID"){
						kicCount++;
					}
					if(($scope.newMemberToInsure.diabetes == "Y" || $scope.newMemberToInsure.hypertension == "Y" || $scope.newMemberToInsure.pulmonary == "Y" || $scope.newMemberToInsure.hyperlipidemia == "Y") || members[i].ISMemberChronic == "Y"){

						let Relation = ($scope.newMemberToInsure.diabetes == "Y" || $scope.newMemberToInsure.hypertension == "Y" || $scope.newMemberToInsure.pulmonary == "Y" || $scope.newMemberToInsure.hyperlipidemia == "Y")? $scope.newMemberToInsure.Relation:members[i].RelationType.toUpperCase()=="KID" ? members[i].RelationType+kicCount : members[i].RelationType;
							$rootScope.alertData = {
								"modalClass": "regular-alert",
								"modalHeader": "Alert",
								"modalBodyText": Relation+" with Chronic conditions cannot be added in case of Family Floater policy type.",
								"showCancelBtn": false,
								"modalSuccessText": "Ok",
								"showAlertModal": true,
								"hideCloseBtn": true,
								"positiveFunction": function () {
									
								}
							}
							return false;
					}
					if(highSum < parseInt(members[i].SumInsured)){
						highSum =  parseInt(members[i].SumInsured);
					}
					if(members[i].RelationWithProposer.toUpperCase() != "SELF" && members[i].RelationWithProposer.toUpperCase() != "SPOUSE" && members[i].RelationWithProposer.indexOf("KID") < 0 && members[i].RelationWithProposer.indexOf("Kid") < 0){
						NonFFMembers.push(members[i].RelationWithProposer);
					}
				}
				if(NonFFMembers.length>0){
					FFTypeMsg = "Insured members "+NonFFMembers.toString()+" is not cover under family floater policy type";
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Alert",
							"modalBodyText": "<p>"+FFTypeMsg+"</p>",
							"showCancelBtn": false,
							"modalSuccessText" : "Ok",
							"showAlertModal": true,
							"positiveFunction": "",
						}
				}
				else{
					
					$scope.ApplySIToAll(highSum);
					$scope.newMemberToInsure.SumInsured = highSum;
					$scope.newMemberToInsure.SumInsuredType ='Family Floater';
					$scope.setCoverOnLoad();
					$scope.newMemberToInsure.RoomType = members[0].RoomType;
					// let cList = [...$scope.newMemberToInsure.optionalCoverages, ...members[0].optionalCoverages];
					// for (let i = 0; i < cList.length; i++) {
					// 	if((cList[i].Coverage == "Hospital cash Benefit" || (cList[i].Coverage == "Waiver of Mandatory Co-payment" && $scope.productCode == "Essential")) && ($scope.productSelected == "ActivHealth" || $scope.productSelected == "ActivHealthV2")){
					// 		$scope.newPolcyCover.push(cList[i]);
					// 	}
					// }
					$scope.policyTypeload = {
						"ReferenceNumber": $scope.userpolicy.ReferenceNo,
						"PolicyNumber": $scope.userpolicy.PolicyNumber,
						"PolicyType":$scope.newMemberToInsure.SumInsuredType,
					}
				}
			}
			else{
				FFTypeMsg = "Only Self, Spouse, Kid is insure under family floater policy type";
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Confirm",
					"modalBodyText": "<p>"+FFTypeMsg+"</p>",
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true,
					"positiveFunction": function () {
						// $scope.newMemberToInsure.SumInsuredType ='Multi Individual';
						// $scope.newMemberToInsure.day = "";
						// $scope.newMemberToInsure.month = "";
						// $scope.newMemberToInsure.year = "";
						// $scope.DOB = "";
						// $scope.newMemberToInsure.Relation = "";
						// $scope.newMemberToInsure.RelationWithProposer = "";
						// $scope.newMemberToInsure.SumInsured = $scope.userpolicy.InsuredMembers[1].InitialSumInsured;
						// $("html, body").animate({
						// 	scrollTop: $("#add-member").offset().top - 100
						// }, 300);
					},
					"negativeFunction": function () {}
				}
			}
		}
		else{
			let MITypeMsg = "";
			let kicCount = 1;
			let members = angular.copy($scope.userpolicy.InsuredMembers).splice(1);
				for (let i = 0; i < members.length; i++) {
					
					if(members[i].RelationType == "KID"){
						kicCount++;
					}

					
					if(members[i].Age < 5 || $scope.newMemberToInsure.Age < 5){
						let Relation = $scope.newMemberToInsure.Age < 5?$scope.newMemberToInsure.Relation : members[i].RelationType.toUpperCase()=="KID" ? members[i].RelationType+kicCount : members[i].RelationType;
						MITypeMsg = "Policy type cannot be change to Multi Individual as age of "+ Relation +" is below 5 years.";
						$rootScope.alertData = {
							"modalClass": "regular-alert",
							"modalHeader": "Confirm",
							"modalBodyText": "<p>"+MITypeMsg+"</p>",
							"showCancelBtn": false,
							"modalSuccessText": "Ok",
							"modalCancelText": "No",
							"showAlertModal": true,
							"hideCloseBtn": true,
							"positiveFunction": function () {
								$scope.newMemberToInsure.SumInsuredType ='Family Floater';
							},
							"negativeFunction": function () {}
						}
						return;
					}
				}
			// $scope.newPolcyCover = [];
			$scope.newMemberToInsure.SumInsuredType ='Multi Individual';
			$scope.policyTypeload = {
				"ReferenceNumber": $scope.userpolicy.ReferenceNo,
				"PolicyNumber": $scope.userpolicy.PolicyNumber,
				"PolicyType":$scope.newMemberToInsure.SumInsuredType,
			}
		}
	}

	$scope.updatePlan = function(event, validForm) {
		aS.postData(ABHI_CONFIG.apiUrl + "Renew/UpdatePlan", $scope.planPayload, true, {
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.then(function(data) {
				if (data.ResponseCode == 1) {
					$scope.planPayload = "";
					$scope.proceedButton(event, validForm);
				}
			}, function(err) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "Plan update fails",
					"showCancelBtn": false,
					"modalSuccessText" : "Ok",
					"showAlertModal": true,
					"positiveFunction": "",
				}
			});
		}

		$scope.updatePolicyType = function(event, validForm) {
			aS.postData(ABHI_CONFIG.apiUrl + "Renew/UpdatePolicyType", $scope.policyTypeload, true, {
					headers: {
						'Content-Type': 'application/json'
					}
				})
				.then(function(data) {
					if (data.ResponseCode == 1) {
						$scope.policyTypeload = "";
						$scope.proceedButton(event, validForm);
					}
				}, function(err) {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": "Policy type update fails",
						"showCancelBtn": false,
						"modalSuccessText" : "Ok",
						"showAlertModal": true,
						"positiveFunction": "",
					}
				});
			}

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
				$scope.nOD = angular.copy($scope.newMemberToInsure.NatureOfDuty);
				$scope.nODCopy = "";
			},2000);
		}

		/* End of resetting NOD search */

		$scope.parseIntString = function(sum){
			if(sum){
				return parseInt(sum);
			}
			else{
				return true;
			}
		}

		/* Nature of duty search function */

		$scope.textSearch = function(){
			$scope.nODCopy = angular.copy($scope.nOD);
		}

	/* End of nature of duty search function */

	$scope.selectRoomType= function(room){
		if(room == "Single"){
			$scope.newMemberToInsure.RoomTypeAnyRoom = "N";
			$scope.newMemberToInsure.RoomTypeSharedRoom = "N";
			$scope.newMemberToInsure.RoomTypesingleRoom = "Y";
		}
		else if(room == "SHARED"){
			$scope.newMemberToInsure.RoomTypeAnyRoom = "N";
			$scope.newMemberToInsure.RoomTypeSharedRoom = "Y";
			$scope.newMemberToInsure.RoomTypesingleRoom = "N";
		}
		else{
			$scope.newMemberToInsure.RoomTypeAnyRoom = "Y";
			$scope.newMemberToInsure.RoomTypeSharedRoom = "N";
			$scope.newMemberToInsure.RoomTypesingleRoom = "N";
		}
		$scope.newMemberToInsure.RoomType = room;
	}

	$scope.filterNatureOfDuty = function(natureDfDuty){
		if(natureDfDuty == 'House wife/husband'){
			natureDfDuty ="Housewife"
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
		$scope.newMemberToInsure.NatureOfDuty = natureDfDuty.Nature_Of_Duty;
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

	$scope.changePolicyTypeAlert= function(pType){
		if(pType == "Multi Individual"){
			let policyTypeMsg = "Only Self, Spouse, Kid is insure under family floater policy type. Do you want to change policy type to "+pType;
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Confirm",
				"modalBodyText": "<p>"+policyTypeMsg+"</p>",
				"showCancelBtn": true,
				"modalSuccessText": "Yes",
				"modalCancelText": "No",
				"showAlertModal": true,
				"hideCloseBtn": true,
				"positiveFunction": function () {
					$scope.setPolicyTypePayload(pType);
					$scope.newMemberToInsure.SumInsuredType = pType
					$scope.changeFFIS = undefined;
				},
				"negativeFunction": function () {

					$scope.newMemberToInsure.day = "";
					$scope.newMemberToInsure.month = "";
					$scope.newMemberToInsure.year = "";
					$scope.DOB = "";
				}
			}
		}
		else{
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Confirm",
				"modalBodyText": "<p>You can change policy type to family floater to add Kid below 5 years age, Do you want to change policy type to Family Floater</p>",
				"showCancelBtn": true,
				"modalSuccessText": "Yes",
				"modalCancelText": "No",
				"showAlertModal": true,
				"hideCloseBtn": true,
				"positiveFunction": function () {
					setTimeout(() => {
						$scope.setPolicyTypePayload(pType);
					}, 1000);
					$scope.newMemberToInsure.SumInsuredType = pType;
				},
				"negativeFunction": function () {

					$scope.newMemberToInsure.day = "";
					$scope.newMemberToInsure.month = "";
					$scope.newMemberToInsure.year = "";
					$scope.DOB = "";
				}
			}
		}
	}


	/* Productwise age validation */    

	function productWiseAgeValidtion(age , param, noOfDays){

		//var errorStatus = new Object();
		 var errorStatus = param == null ? {} : new Object();
		var allErrors = new String();
		let policyType = $scope.newMemberToInsure.SumInsuredType == "Family Floater"? "FF" : "MI";

		if($scope.productSelected == "ActivHealthV2" || $scope.productSelected == "ActivHealth"){
			// insuredCurrentMember.PL.Age = age;
			$scope.newMemberToInsure['RelationWithProposer'] = $scope.newMemberToInsure.Relation.toUpperCase();
			$scope.newMemberToInsure['RelationType'] = $scope.newMemberToInsure.Relation.toUpperCase();
			$scope.newMemberToInsure.Age = age;
			$scope.newMemberToInsure.noOfDays = noOfDays;
			let sampleMembers = ["",$scope.userpolicy.InsuredMembers[1], $scope.newMemberToInsure];
			sampleMembers[1].RelationWithProposer = sampleMembers[1].RelationWithProposer.toUpperCase();
			sampleMembers[1].RelationType = sampleMembers[1].RelationWithProposer.toUpperCase();
			errorStatus.PL = productValidationService.platinumValidations(sampleMembers, $scope.newMemberToInsure, policyType);
			if(errorStatus.PL.allErrors.length > 0){
				allErrors = allErrors + "<h4 class='h4-class'>Activ Health eligibility Related Errors</h4>";
				var pLUL = "<ul class='ul-class'>";
				angular.forEach(errorStatus.PL.allErrors,function(v,i){
					let errMsgarr = v.message.split(" ");
						if(errMsgarr.includes("is") && errMsgarr.includes("not") && (errMsgarr.includes("covered") || errMsgarr.includes("allowed")) && errorStatus.PL.allErrors.length == 1  && $scope.canBeMI){
							if($scope.newMemberToInsure.SumInsuredType == 'Family Floater'){
								$scope.changePolicyTypeAlert('Multi Individual');
							}
							return;
						}
						else if(errMsgarr.includes("5") && v.RelationType == "KID" && $scope.canBeFF){
							$scope.changePolicyTypeAlert('Family Floater');
							return;
						}
						pLUL = pLUL + "<li>"+v.message+"</li>";
					
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
			$scope.newMemberToInsure['RelationWithProposer'] = $scope.newMemberToInsure.Relation.toUpperCase();
			$scope.newMemberToInsure['RelationType'] = $scope.newMemberToInsure.Relation.toUpperCase();
			$scope.newMemberToInsure.Age = age;
			$scope.newMemberToInsure.noOfDays = noOfDays;
			let sampleMembers = ["",$scope.userpolicy.InsuredMembers[1], $scope.newMemberToInsure]
			sampleMembers[1].RelationWithProposer = sampleMembers[1].RelationWithProposer.toUpperCase();
			sampleMembers[1].RelationType = sampleMembers[1].RelationWithProposer.toUpperCase();
			errorStatus.DI = productValidationService.STValidations(sampleMembers, $scope.newMemberToInsure, policyType);
			if(errorStatus.DI.allErrors.length > 0){
				allErrors = allErrors + "<h4 class='h4-class'>Super Top Up eligibility Related Errors</h4>";
				var dIUL = "<ul class='ul-class'>";
				angular.forEach(errorStatus.DI.allErrors,function(v,i){
					
							dIUL = dIUL + "<li>"+v.message+"</li>";
						
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
			$scope.newMemberToInsure['RelationWithProposer'] = $scope.newMemberToInsure.Relation.toUpperCase();
			$scope.newMemberToInsure['RelationType'] = $scope.newMemberToInsure.Relation.toUpperCase();
			$scope.newMemberToInsure.Age = age;
			$scope.newMemberToInsure.noOfDays = noOfDays;
			let sampleMembers = ["",$scope.userpolicy.InsuredMembers[1], $scope.newMemberToInsure]
			sampleMembers[1].RelationWithProposer = sampleMembers[1].RelationWithProposer.toUpperCase();
			sampleMembers[1].RelationType = sampleMembers[1].RelationWithProposer.toUpperCase();
			errorStatus.DI = productValidationService.diamondValidations(sampleMembers, $scope.newMemberToInsure, policyType);
			if(errorStatus.DI.allErrors.length > 0){
				allErrors = allErrors + "<h4 class='h4-class'>Activ Assure eligibility Related Errors</h4>";
				var dIUL = "<ul class='ul-class'>";
				angular.forEach(errorStatus.DI.allErrors,function(v,i){
					
							dIUL = dIUL + "<li>"+v.message+"</li>";
						
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
			$scope.newMemberToInsure['RelationWithProposer'] = $scope.newMemberToInsure.Relation.toUpperCase();
			$scope.newMemberToInsure['RelationType'] = $scope.newMemberToInsure.Relation.toUpperCase();
			$scope.newMemberToInsure.Age = age;
			$scope.newMemberToInsure.noOfDays = noOfDays;
			let sampleMembers = ["",$scope.userpolicy.InsuredMembers[1], $scope.newMemberToInsure]
			sampleMembers[1].RelationWithProposer = sampleMembers[1].RelationWithProposer.toUpperCase();
			sampleMembers[1].RelationType = sampleMembers[1].RelationWithProposer.toUpperCase();
		    errorStatus.CS = productValidationService.rFBValidations(sampleMembers,18,"CS",$scope.newMemberToInsure.Relation) 
		    if(errorStatus.CS.allErrors.length > 0){
		        allErrors = allErrors + "<h4 class='h4-class'>Activ Secure eligibility Related Errors</h4>";
		        var cSUL = "<ul class='ul-class'>";
		        angular.forEach(errorStatus.CS.allErrors,function(v,i){
		            
		                        cSUL = cSUL + "<li>"+v.message+"</li>";
		                    
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
		//     //insuredCurrentMember.AS.Age = age;
		//     errorStatus.AS = productValidationService.arogyaSanjeevaniValidations(insuredObj.AS,25,"AS",$scope.newMemberToInsure.Relation, $scope.insuredDetails.MemberDetail.PolicyType);
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
		$scope.newMemberToInsure['RelationWithProposer'] = $scope.newMemberToInsure.Relation.toUpperCase();
		$scope.newMemberToInsure['RelationType'] = $scope.newMemberToInsure.Relation.toUpperCase();
		$scope.newMemberToInsure.Age = age;
		$scope.newMemberToInsure.noOfDays = noOfDays;
		let sampleMembers = ["",$scope.userpolicy.InsuredMembers[1], $scope.newMemberToInsure];
		sampleMembers[1].RelationWithProposer = sampleMembers[1].RelationWithProposer.toUpperCase();
			sampleMembers[1].RelationType = sampleMembers[1].RelationWithProposer.toUpperCase();
			errorStatus.AC = productValidationService.activCareValidations(sampleMembers,$scope.newMemberToInsure.Relation);
			if(errorStatus.AC.allErrors.length > 0){
				allErrors = allErrors + "<h4 class='h4-class'>Activ Care eligibility Related Errors</h4>";
				var aCUL = "<ul class='ul-class'>";
				angular.forEach(errorStatus.AC.allErrors,function(v,i){
					
							aCUL = aCUL + "<li>"+v.message+"</li>";
					
				});
				aCUL = aCUL + "</ul>";
				 if(aCUL == "<ul class='ul-class'></ul>"){
						allErrors = "";
				}else{
					allErrors = allErrors + aCUL;
				}
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
					$scope.newMemberToInsure.day = "";
					$scope.newMemberToInsure.month = "";
					$scope.newMemberToInsure.year = "";
					$scope.DOB = "";
				}
			}
			return false;
		}else{
			return true;
		}
	}

/* End of productwise age validation */

/* End of nature od duty selection event */

	/*---------------- To Check Age Differnece & validate age ----------------------*/

	// function checkAgeDiff(date, param) {
	// 	var userDate = new Date(date);
	// 	var currentDate = new Date();
	// 	var dateDiff = currentDate - userDate;
	// 	var userAge = Math.floor((dateDiff / 1000) / (60 * 60 * 24 * 365.25));
	// 	var noOfDays = Math.floor((dateDiff / 1000) / (60 * 60 * 24));
	// 	if (userAge < 0 && ($scope.productName == "Activ Assure" || $scope.productName == "Activ Health" || $scope.productName == "Activ Health V2")) {
	// 		$rootScope.alertConfiguration('E', $scope.newMemberToInsure.Relation + " age cannot be future date ");
	// 		$scope.newMemberToInsure.day = "";
	// 		$scope.newMemberToInsure.month = "";
	// 		$scope.newMemberToInsure.year = "";
	// 		$scope.DOB = "";

	// 		return false;
	// 	}

	// 	if (($scope.newMemberToInsure.Relation == 'SPOUSE' || $scope.newMemberToInsure.Relation == 'FATHER' || $scope.newMemberToInsure.Relation == 'MOTHER' || $scope.newMemberToInsure.Relation == 'FATHER-IN-LAW' || $scope.newMemberToInsure.Relation == 'MOTHER-IN-LAW' || $scope.newMemberToInsure.Relation == 'SELF') && (userAge < 18)) {
	// 		$rootScope.alertConfiguration('E', $scope.newMemberToInsure.Relation + " age should be greater than 18 years");
	// 		$scope.newMemberToInsure.day = "";
	// 		$scope.newMemberToInsure.month = "";
	// 		$scope.newMemberToInsure.year = "";
	// 		$scope.DOB = "";

	// 		return false;
	// 	}
	// 	if ($scope.newMemberToInsure.Relation == 'KID' && (userAge < 5) && $scope.policyDetails.SumInsuredType == "Individual" && ($scope.productName == "Activ Assure" || $scope.productName == "Active Assure"  || $scope.productName == "Activ Health V2" )) {
	// 		$rootScope.alertConfiguration('E', $scope.newMemberToInsure.Relation + " age should be greater than 5 years");
	// 		$scope.newMemberToInsure.day = "";
	// 		$scope.newMemberToInsure.month = "";
	// 		$scope.newMemberToInsure.year = "";
	// 		$scope.DOB = "";

	// 		return false;
	// 	}
	// 	if ($scope.newMemberToInsure.Relation == 'KID' && (noOfDays <= 90) && $scope.policyDetails.SumInsuredType == 'Family Floater' && ($scope.productName == "Activ Assure" || $scope.productName == "Active Assure" )) {
	// 		$rootScope.alertConfiguration('E', $scope.newMemberToInsure.Relation + " should be greater than 90 days");
	// 		$scope.newMemberToInsure.day = "";
	// 		$scope.newMemberToInsure.month = "";
	// 		$scope.newMemberToInsure.year = "";
	// 		$scope.DOB = "";

	// 		return false;
	// 	}
	// 	if ($scope.newMemberToInsure.Relation == 'KID' && (userAge > 25)) {
	// 		$rootScope.alertConfiguration('E', $scope.newMemberToInsure.Relation + " age should not greater than 25 years");
	// 		$scope.newMemberToInsure.day = "";
	// 		$scope.newMemberToInsure.month = "";
	// 		$scope.newMemberToInsure.year = "";
	// 		$scope.DOB = "";

	// 		return false;
	// 	}

	// 	if (($scope.newMemberToInsure.Relation == 'SPOUSE' || $scope.newMemberToInsure.Relation == 'FATHER' || $scope.newMemberToInsure.Relation == 'MOTHER' || $scope.newMemberToInsure.Relation == 'FATHER-IN-LAW' || $scope.newMemberToInsure.Relation == 'MOTHER-IN-LAW' || $scope.newMemberToInsure.Relation == 'SELF') && (userAge > 80) && ($scope.productName == 'Active Care V2' || $scope.productName == 'Activ Care')) {
	// 		$rootScope.alertConfiguration('E', $scope.newMemberToInsure.Relation + " cannot be greater than 80 years");
	// 		$scope.newMemberToInsure.day = "";
	// 		$scope.newMemberToInsure.month = "";
	// 		$scope.newMemberToInsure.year = "";
	// 		$scope.DOB = "";

	// 		return false;
	// 	}

	// 	if (($scope.newMemberToInsure.Relation == 'SPOUSE' || $scope.newMemberToInsure.Relation == 'FATHER' || $scope.newMemberToInsure.Relation == 'MOTHER' || $scope.newMemberToInsure.Relation == 'FATHER-IN-LAW' || $scope.newMemberToInsure.Relation == 'MOTHER-IN-LAW' || $scope.newMemberToInsure.Relation == 'SELF') && (userAge > 99)) {
	// 		$rootScope.alertConfiguration('E', $scope.newMemberToInsure.Relation + " cannot be greater than 99 years");
	// 		$scope.newMemberToInsure.day = "";
	// 		$scope.newMemberToInsure.month = "";
	// 		$scope.newMemberToInsure.year = "";
	// 		$scope.DOB = "";

	// 		return false;
	// 	}

	// 	if ((userAge < 55) && ($scope.productName == 'Active Care V2' || $scope.productName == 'Activ Care')) {

	// 		for (var i = 0; i < $scope.insuredMembers.length; i++) {
	// 			if ($scope.newMemberToInsure.Relation == 'SELF' && $scope.insuredMembers[i].RelationWithProposer == 'SPOUSE' && ($scope.insuredMembers[i].Age < 55)) {
	// 				$rootScope.alertConfiguration('E', "Age of " + $scope.newMemberToInsure.Relation + " should not be less than 55");
	// 				$scope.newMemberToInsure.day = "";
	// 				$scope.newMemberToInsure.month = "";
	// 				$scope.newMemberToInsure.year = "";
	// 				$scope.DOB = "";
	// 				return false;
	// 			}
	// 			if ($scope.newMemberToInsure.Relation == 'SPOUSE' && $scope.insuredMembers[i].RelationWithProposer == 'SELF' && ($scope.insuredMembers[i].Age < 55)) {
	// 				$rootScope.alertConfiguration('E', "Age of " + $scope.newMemberToInsure.Relation + " should not be less than 55");
	// 				$scope.newMemberToInsure.day = "";
	// 				$scope.newMemberToInsure.month = "";
	// 				$scope.newMemberToInsure.year = "";
	// 				$scope.DOB = "";
	// 				return false;
	// 			}
	// 			if ($scope.newMemberToInsure.Relation == 'FATHER' && $scope.insuredMembers[i].RelationWithProposer == 'MOTHER' && ($scope.insuredMembers[i].Age < 55)) {
	// 				$rootScope.alertConfiguration('E', "Age of " + $scope.newMemberToInsure.Relation + " should not be less than 55");
	// 				$scope.newMemberToInsure.day = "";
	// 				$scope.newMemberToInsure.month = "";
	// 				$scope.newMemberToInsure.year = "";
	// 				$scope.DOB = "";
	// 				return false;
	// 			}
	// 			if ($scope.newMemberToInsure.Relation == 'MOTHER' && $scope.insuredMembers[i].RelationWithProposer == 'FATHER' && ($scope.insuredMembers[i].Age < 55)) {
	// 				$rootScope.alertConfiguration('E', "Age of " + $scope.newMemberToInsure.Relation + " should not be less than 55");
	// 				$scope.newMemberToInsure.day = "";
	// 				$scope.newMemberToInsure.month = "";
	// 				$scope.newMemberToInsure.year = "";
	// 				$scope.DOB = "";
	// 				return false;
	// 			}
	// 			if ($scope.newMemberToInsure.Relation == 'FATHER-IN-LAW' && $scope.insuredMembers[i].RelationWithProposer == 'MOTHER-IN-LAW' && ($scope.insuredMembers[i].Age < 55)) {
	// 				$rootScope.alertConfiguration('E', "Age of " + $scope.newMemberToInsure.Relation + " should not be less than 55");
	// 				$scope.newMemberToInsure.day = "";
	// 				$scope.newMemberToInsure.month = "";
	// 				$scope.newMemberToInsure.year = "";
	// 				$scope.DOB = "";
	// 				return false;
	// 			}
	// 			if ($scope.newMemberToInsure.Relation == 'MOTHER-IN-LAW' && $scope.insuredMembers[i].RelationWithProposer == 'FATHER-IN-LAW' && ($scope.insuredMembers[i].Age < 55)) {
	// 				$rootScope.alertConfiguration('E', "Age of " + $scope.newMemberToInsure.Relation + " should not be less than 55");
	// 				$scope.newMemberToInsure.day = "";
	// 				$scope.newMemberToInsure.month = "";
	// 				$scope.newMemberToInsure.year = "";
	// 				$scope.DOB = "";
	// 				return false;
	// 			}
	// 		}
	// 	}

	// 	for (var i = 0; i < $scope.insuredMembers.length; i++) {
	// 		if ($scope.newMemberToInsure.Relation == 'SELF' && ($scope.insuredMembers[i].RelationWithProposer == 'FATHER' || $scope.insuredMembers[i].RelationWithProposer == 'MOTHER' || $scope.insuredMembers[i].RelationWithProposer == 'FATHER-IN-LAW' || $scope.insuredMembers[i].RelationWithProposer == 'MOTHER-IN-LAW') && ($scope.insuredMembers[i].Age < userAge)) {
	// 			$rootScope.alertConfiguration('E', "SELF cannot be greater than " + $scope.insuredMembers[i].RelationWithProposer);
	// 			$scope.newMemberToInsure.day = "";
	// 			$scope.newMemberToInsure.month = "";
	// 			$scope.newMemberToInsure.year = "";
	// 			$scope.DOB = "";

	// 			return false;
	// 		}

	// 		if ($scope.newMemberToInsure.Relation == 'SPOUSE' && ($scope.insuredMembers[i].RelationWithProposer == 'FATHER' || $scope.insuredMembers[i].RelationWithProposer == 'MOTHER' || $scope.insuredMembers[i].RelationWithProposer == 'FATHER-IN-LAW' || $scope.insuredMembers[i].RelationWithProposer == 'MOTHER-IN-LAW') && ($scope.insuredMembers[i].Age < userAge)) {

	// 			$rootScope.alertConfiguration('E', "SPOUSE cannot be greater than " + $scope.insuredMembers[i].RelationWithProposer);
	// 			$scope.newMemberToInsure.day = "";
	// 			$scope.newMemberToInsure.month = "";
	// 			$scope.newMemberToInsure.year = "";
	// 			$scope.DOB = "";

	// 			return false;

	// 		}

	// 		if ($scope.newMemberToInsure.Relation == 'KID' && ($scope.insuredMembers[i].RelationWithProposer == 'SELF' || $scope.insuredMembers[i].RelationWithProposer == 'SPOUSE' || $scope.insuredMembers[i].RelationWithProposer == 'FATHER' || $scope.insuredMembers[i].RelationWithProposer == 'MOTHER' || $scope.insuredMembers[i].RelationWithProposer == 'FATHER-IN-LAW' || $scope.insuredMembers[i].RelationWithProposer == 'MOTHER-IN-LAW') && ($scope.insuredMembers[i].Age < userAge)) {

	// 			$rootScope.alertConfiguration('E', "KID cannot be greater than " + $scope.insuredMembers[i].RelationWithProposer);
	// 			$scope.newMemberToInsure.day = "";
	// 			$scope.newMemberToInsure.month = "";
	// 			$scope.newMemberToInsure.year = "";
	// 			$scope.DOB = "";

	// 			return false;

	// 		}

	// 		if (($scope.newMemberToInsure.Relation == 'SELF' || $scope.newMemberToInsure.Relation == 'SPOUSE' || $scope.newMemberToInsure.Relation == 'FATHER' || $scope.newMemberToInsure.Relation == 'MOTHER' || $scope.newMemberToInsure.Relation == 'FATHER-IN-LAW' || $scope.newMemberToInsure.Relation == 'MOTHER-IN-LAW') && ($scope.insuredMembers[i].RelationType == 'KID') && (userAge < $scope.insuredMembers[i].Age)) {

	// 			$rootScope.alertConfiguration('E', 'Age of ' + $scope.newMemberToInsure.Relation + " can not be less than " + $scope.insuredMembers[i].RelationWithProposer);
	// 			$scope.newMemberToInsure.day = "";
	// 			$scope.newMemberToInsure.month = "";
	// 			$scope.newMemberToInsure.year = "";
	// 			$scope.DOB = "";

	// 			return false;
	// 		}

	// 		if (($scope.newMemberToInsure.Relation == 'FATHER' || $scope.newMemberToInsure.Relation == 'MOTHER' || $scope.newMemberToInsure.Relation == 'FATHER-IN-LAW' || $scope.newMemberToInsure.Relation == 'MOTHER-IN-LAW') && ($scope.insuredMembers[i].RelationWithProposer == 'SELF' || $scope.insuredMembers[i].RelationWithProposer == 'SPOUSE') && (userAge < $scope.insuredMembers[i].Age)) {

	// 			$rootScope.alertConfiguration('E', 'Age of ' + $scope.newMemberToInsure.Relation + " can not be less than " + $scope.insuredMembers[i].RelationWithProposer);
	// 			$scope.newMemberToInsure.day = "";
	// 			$scope.newMemberToInsure.month = "";
	// 			$scope.newMemberToInsure.year = "";
	// 			$scope.DOB = "";

	// 			return false;
	// 		}

	// 	}

	// 	$scope.newMemberToInsure.Age = userAge;

	// }



	function checkAgeDiff(date,param){
		var userDate = new Date(date);
		var currentDate = new Date();
		var dateDiff = currentDate - userDate;
		$scope.userAge = Math.floor((dateDiff/1000) / (60*60*24*365.25));
		var noOfDays = Math.floor((dateDiff/1000) / (60*60*24));
		if ($scope.productSelected == 'ActivHealthV2' && $scope.userAge > 65) {
			$scope.underAge = false;
		}
		else {
			$scope.underAge = true;
		}
		let calculatePremiumParams = {};
		
		// for(var i =0 ; i < $scope.insuredMembers.length ; i++){
		// 	if($scope.insuredMembers[i].RelationType == $scope.insuredMemberDetails.personalDetails.Relation.toUpperCase()){
		// 		$scope.insuredMembers[i].Age = userAge
		// 	}
		// }

		calculatePremiumParams = {
			"ReferenceNo": $scope.userpolicy.ReferenceNo,
			"PolicyNumber": $scope.userpolicy.PolicyNumber,
			"MemberID":$scope.insuredMembers.length + 1,
			"Relation":$scope.newMemberToInsure.Relation,
			"DOB":param
		}

		if(!productWiseAgeValidtion($scope.userAge , '', noOfDays)){
			return false;
		}
		
		// UpdateDOB(calculatePremiumParams);
	}


	function UpdateDOB(data){
		// delete rID.insuredDetails.PremiumDetail;
		aS.postData(ABHI_CONFIG.apiUrl+"renew/UpdateDOB",data,false,{
			headers:{
				'Content-Type': 'application/json'
			}
		})
			.then(function(response){
				if(response.ResponseCode == 1){
					scope.policyDetails.RenewalGrossPremium = response.ResponseData;
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
					UpdateDOB(data);
				}else{
					$rootScope.alertConfiguration('E',response.ResponseMessage);
				}
			},function(err){

			});
	}

	 /* To Calulate Premium */

	/*---------------- End of To Check Age Differnece & validate age ----------------------*/


	$scope.modifyTopParam = function(param){
		if($scope.newMemberToInsure[param]=="N"){
			$scope.newMemberToInsure[param]="Y"
		}else{
			$scope.newMemberToInsure[param]="N"
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

	$scope.ApplySIToAll = function (sumi) {
		if(parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured) < parseInt(sumi)){
			let policyTypeMsg = sumi + " Sum insure will be applyed to all the member insured as this policy type is family floater, do you want to change sum insure?";
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Confirm",
				"modalBodyText": "<p>"+policyTypeMsg+"</p>",
				"showCancelBtn": true,
				"modalSuccessText": "Yes",
				"modalCancelText": "No",
				"showAlertModal": true,
				"hideCloseBtn": true,
				"positiveFunction": function () {
						$scope.changeFFIS = sumi;
				},
				"negativeFunction": function () {
					$scope.newMemberToInsure.SumInsured = $scope.userpolicy.InsuredMembers[1].InitialSumInsured;
				}
			}

		}
	}

	/*-----------------To Change Sum Insued ---------------*/
	$scope.changeFFIS;
	$scope.changeSumInsured = function (sumi) {
		let maxSI = "";
		let ProposerSI="";
		if($scope.newMemberToInsure.SumInsuredType =='Family Floater' && parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured) < parseInt(sumi) ){
		$scope.ApplySIToAll(sumi);
		}
		// if($scope.newMemberToInsure.SumInsuredType =='Family Floater' && (parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured) < parseInt(sumi) || parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured) > parseInt(sumi))){
		// 	let policyTypeMsg = sumi + " Sum insure will be applyed to all the member insured as this policy type is family floater, do you want to change sum insure?";
		// 	$rootScope.alertData = {
		// 		"modalClass": "regular-alert",
		// 		"modalHeader": "Confirm",
		// 		"modalBodyText": "<p>"+policyTypeMsg+"</p>",
		// 		"showCancelBtn": true,
		// 		"modalSuccessText": "Yes",
		// 		"modalCancelText": "No",
		// 		"showAlertModal": true,
		// 		"hideCloseBtn": true,
		// 		"positiveFunction": function () {
		// 				$scope.changeFFIS = sumi;
		// 		},
		// 		"negativeFunction": function () {
		// 			$scope.newMemberToInsure.SumInsured = $scope.userpolicy.InsuredMembers[1].InitialSumInsured;
		// 		}
		// 	}

		// }

		if($scope.productCode == 'PA1' || $scope.productCode == 'PA2' || $scope.productCode == 'PA3'){
			$scope.PACover123 =false;
			if(parseInt(sumi)>=500000){
				$scope.setOCForPA();
			}
			else{
				$scope.PACover123 =false;
				for (let i = 0; i < $scope.productJson[$scope.productSelected].length; i++) {
					if($scope.APCArr.includes($scope.productJson[$scope.productSelected][i])){
						$scope.productJson[$scope.productSelected].splice(i, 1);
					};
				}
				$scope.newMemberToInsure.optionalCoverages = [];
			}
			$scope.getRefIndex();
		}
		
		if($scope.userpolicy.InsuredMembers[1].RelationWithProposer.toUpperCase() == "SELF"){
			ProposerSI = parseInt($scope.roundOffSI(parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured)> 0?$scope.userpolicy.InsuredMembers[1].InitialSumInsured:$scope.userpolicy.InsuredMembers[1].SumInsured));
			maxSI =  parseInt($scope.roundOffSI(parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured)> 0?$scope.userpolicy.InsuredMembers[1].InitialSumInsured:$scope.userpolicy.InsuredMembers[1].SumInsured))/2;
		}
		else{
			ProposerSI = parseInt($scope.userpolicy.InsuredMembers[0].ProposerAnnualIncome)*12;
			maxSI =  ProposerSI/2;
		}
		if($scope.productSelected == 'ActivSecure' && parseInt(sumi)> maxSI && parseInt(sumi)> 300000){
			
				let member = $scope.newMemberToInsure.Relation.toUpperCase();
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
							// cI.quoteDetails.CIQuote.CIQuoteDetails[index].showAnnualIncome = true;
							$scope.newMemberToInsure.EarningNonEarning = "Earning";
							$scope.newMemberToInsure.SumInsured = sumi;
						}, 200);
					},
					"negativeFunction": function () {
						$scope.newMemberToInsure.EarningNonEarning = "Non Earning";
					}
				}
			
		}
		else if($scope.productSelected == "SuperTopUp"){
			$scope.newMemberToInsure.Deductible = $scope.setDeductable(sumi);
			$scope.newMemberToInsure.SumInsured = sumi;
		}
		else{
			$scope.newMemberToInsure.SumInsured = sumi;
		}
	}

	/*-----------------End of To Change Sum Insued ---------------*/

	


	/* To change Annual Income */

    $scope.calculateAnnualIncome = function () {
		if($scope.productSelected != 'ActivSecure'){
			return;
		}
		var annualIncome = parseInt($scope.newMemberToInsure.AnnualIncome);
         $scope.chkAnnualIncome = 0;

		if($scope.productCode == "ci1" || $scope.productCode == "ci2"){
			 $scope.chkAnnualIncome = 9000;
		}
		else{
			 $scope.chkAnnualIncome = 42000;
		}
		let SecureProductSelected = $scope.productCode == "CS"?"Cancer Secure":"Critical Illness"
		let maxSI = "";
		let ProposerSI="";

		
		if($scope.userpolicy.InsuredMembers[1].RelationWithProposer.toUpperCase() == "SELF"){
			ProposerSI = parseInt($scope.roundOffSI(parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured)> 0?$scope.userpolicy.InsuredMembers[1].InitialSumInsured:$scope.userpolicy.InsuredMembers[1].SumInsured));
			maxSI =  parseInt($scope.roundOffSI(parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured)> 0?$scope.userpolicy.InsuredMembers[1].InitialSumInsured:$scope.userpolicy.InsuredMembers[1].SumInsured))/2;
		}
		else{
			ProposerSI = parseInt($scope.userpolicy.InsuredMembers[0].ProposerAnnualIncome)*12;
			maxSI =  ProposerSI/2;
		}

		var errorAlert = "<ul>";

		if($scope.newMemberToInsure.Occupation == 'Student' || $scope.newMemberToInsure.Occupation == 'Not employed' || $scope.newMemberToInsure.Occupation == 'Retired' || $scope.newMemberToInsure.Occupation == 'House wife/husband'){
			$scope.newMemberToInsure.EarningNonEarning = "Non Earning";
			$scope.newMemberToInsure.AnnualIncome = "";
			annualIncome = 0;

			if(maxSI < $scope.newMemberToInsure.SumInsured ){
				$scope.newMemberToInsure.SumInsured = $scope.getSecureSi(maxSI);
				errorAlert = errorAlert + "<li>Maximum Sum Insured is (" + $filter('INR')($scope.newMemberToInsure.SumInsured) + ") as you have selected non earning occupation.</li>";
				errorAlert = errorAlert + "</ul>";
				if (errorAlert != "<ul></ul>") {
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": errorAlert,
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true
					}
				}
			}
			return;
		}else{
			$scope.newMemberToInsure.EarningNonEarning = "Earning";
		}

       
        if (annualIncome >  $scope.chkAnnualIncome) {
            $scope.newMemberToInsure.EarningNonEarning = "Earning";
			
           
            
			if (parseInt($scope.newMemberToInsure.SumInsured) > (annualIncome * 12)) {
				if(maxSI > (annualIncome * 12)){
					$scope.newMemberToInsure.SumInsured = $scope.getSecureSi(maxSI);
				}
				else{
					$scope.newMemberToInsure.SumInsured = $scope.getSecureSi(annualIncome * 12);
				}
				errorAlert = errorAlert + "<li>Sum Insured eligibility is 12 times the Annual Income (" + $filter('INR')($scope.newMemberToInsure.SumInsured) + ") for " + SecureProductSelected + ".</li>";
			} else {
				
					if (parseInt($scope.getSecureSi(annualIncome * 12)) > ProposerSI && $scope.newMemberToInsure.SumInsured < ProposerSI) {
						$scope.newMemberToInsure.SumInsured = $scope.roundOffSI(parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured)> 0?$scope.userpolicy.InsuredMembers[1].InitialSumInsured:$scope.userpolicy.InsuredMembers[1].SumInsured);
						errorAlert = errorAlert + "<li>Maximum Sum Insured for " + SecureProductSelected + " product based on entered annual income is (" + $filter('INR')(ProposerSI) + ").</li>";
					}
				
			}

            
                errorAlert = errorAlert + "</ul>";
                if (errorAlert != "<ul></ul>") {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": errorAlert,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true
                    }
                }
            
        } else {
            // var errorAlert = "<ul><li>You are not eligible for this product based on declared income.</li>";
			if(maxSI < $scope.newMemberToInsure.SumInsured ){
				if ($scope.productCode == "CS" && $scope.productCode == "ci3") {
					errorAlert = errorAlert + "<li>Minimum Annual Income required for Critical Illness Plan 3 is 42,000.</li>";
				} else {
					errorAlert = errorAlert + "<li>Minimum Annual Income required for Critical Illness Plan 1/2 is 9,999.</li>";
				}
			}
            
            errorAlert = errorAlert + "</ul>";
            // errorAlert = errorAlert + "<div><p class='modal-bind-text'>Do you want to change Annual Income ?</p></div>";
            // $rootScope.alertData = {
            //     "modalClass": "regular-alert",
            //     "modalHeader": "Warning",
            //     "modalBodyText": errorAlert,
            //     "showCancelBtn": true,
            //     "modalSuccessText": "Yes",
            //     "modalCancelText": "No",
            //     "showAlertModal": true,
            //     "hideCloseBtn": true,
            //     "positiveFunction": function () {
            //         pDC.proposerDetails.ProposerDetail.AnnualIncome = "";
            //     },
            //     "negativeFunction": function () {
            //         pDC.proposerDetails.ProposerDetail.AnnualIncome = "";
            //         $location.url(pDC.quotePage);
            //     }
            // }
			if (errorAlert != "<ul></ul>") {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": errorAlert,
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true
				}
			}
        }
    }

    /* End of changing annual income */

	/*-------------------------- To Change Gender ----------------*/

	$scope.changeGender = function (gender) {

		if ($scope.newMemberToInsure.Relation == 'KID') {
			$scope.newMemberToInsure.Gender = gender;
			if ($scope.newMemberToInsure.Gender == 'Female') {
				$scope.newMemberToInsure.Salutation = 'Ms';
			}
			if ($scope.newMemberToInsure.Gender == 'Male') {
				$scope.newMemberToInsure.Salutation = 'Mr';
			}
		}
	}

	/*-------------------------- End of To Change Gender ----------------*/

	/*---------------------- To Select Member -------------*/

	$scope.selectMember = function (member) {


		// $scope.newMemberToInsure = {
		// 	"ReferenceNo": $sessionStorage.refNo, //Mandatory
		// 	"PolicyNumber": $sessionStorage.policyNo, // Mandatory
		// 	"Salutation": "", // Mandatory
		// 	"FirstName": "", // Mandatory
		// 	"MiddleName": "",
		// 	"LastName": "", // Mandatory
		// 	"Mobile": "",
		// 	"Email": $scope.personalDetails.Email,
		// 	"DOB": "", // Mandatory
		// 	"Age": "",
		// 	"Height": "",
		// 	"Weight": "",
		// 	"Occupation": "",
		// 	"MaritalStatus": "",
		// 	"Gender": "",
		// 	"Relation": "", // Mandatory
		// 	"NomineeFirstName": "",
		// 	"NomineeLastName": "",
		// 	"NomineeDOB": "",
		// 	"NomineeAddress": "",
		// 	"NomineeContactNo": "",
		// 	"NomineeRelation": "",
		// 	"HomeAddress1": "",
		// 	"HomeAddress2": "",
		// 	"HomeAddress3": "",
		// 	"HomeState": "",
		// 	"HomeDistrict": "",
		// 	"HomeCity": "",
		// 	"HomePincode": "",
		// 	"InitialSumInsured": "",
		// 	"SumInsured": "", // Mandatory
		// 	"SumInsuredType": $scope.userpolicy.SumInsuredType,
		// 	"UpSellSumInsured": "",
		// 	"Deductible": "",
		// 	"Chronic": "",
		// 	"CB": "",
		// 	"IDType": "",
		// 	"IDNo": "",
		// 	"AlcoholYN": "N",
		// 	"AlcoholQty": "",
		// 	"SmokeQty": "",
		// 	"PanmasalaQty": "",
		// 	"Others": "",
		// 	"SubstanceQty": "",
		// 	"IsEIAavailable": "N",
		// 	"ApplyEIA": "N",
		// 	"UndergoneAnySurgery": "N",
		// 	"EIAAccountNo": "",
		// 	"PreviousPolicyNumberYN": "",
		// 	"PreviousPolicySumInsured": "",
		// 	"PreviousPolicyClaims": "",
		// 	"PreviousPolicyRejectedYN": "",
		// 	"PreviousPolicyRejectedDetails": ""
		// }
		$scope.newMemberToInsure.day = "";
		$scope.newMemberToInsure.month = "";
		$scope.newMemberToInsure.year = "";
		$scope.DOB = "";
		$scope.ft = "";
		$scope.inches = "";

		$scope.newMemberToInsure.Relation = member;
		$scope.newMemberToInsure.Occupation = ''; $scope.newMemberToInsure.Designation = '';

		if ($scope.newMemberToInsure.Relation == 'FATHER' || $scope.newMemberToInsure.Relation == 'FATHER-IN-LAW' || $scope.newMemberToInsure.Relation == 'BROTHER' || $scope.newMemberToInsure.Relation == 'GRANDFATHER' || $scope.newMemberToInsure.Relation == 'GRANDSON' || $scope.newMemberToInsure.Relation == 'SON-IN-LAW' || $scope.newMemberToInsure.Relation == 'BROTHER-IN-LAW' || $scope.newMemberToInsure.Relation == 'NEPHEW') {
			$scope.newMemberToInsure.Salutation = 'Mr';
			$scope.newMemberToInsure.Gender = 'Male';
		}

		if ($scope.newMemberToInsure.Relation == 'SPOUSE' && $scope.userpolicy.InsuredMembers[0].Gender == 'F'){
			$scope.newMemberToInsure.Salutation = 'Mr';
			$scope.newMemberToInsure.Gender = 'Male';
		}
		if ($scope.newMemberToInsure.Relation == 'SPOUSE' && $scope.userpolicy.InsuredMembers[0].Gender == 'M'){
			$scope.newMemberToInsure.Salutation = 'Mrs';
			$scope.newMemberToInsure.Gender = 'Female';
		}

		if ($scope.newMemberToInsure.Relation == 'MOTHER' || $scope.newMemberToInsure.Relation == 'MOTHER-IN-LAW' || $scope.newMemberToInsure.Relation == 'SISTER' || $scope.newMemberToInsure.Relation == 'GRANDMOTHER' || $scope.newMemberToInsure.Relation == 'GRANDDAUGHTER' || $scope.newMemberToInsure.Relation == 'DAUGHTER-IN-LAW' || $scope.newMemberToInsure.Relation == 'SISTER-IN-LAW' || $scope.newMemberToInsure.Relation == 'NIECE') {
			$scope.newMemberToInsure.Salutation = 'Mrs';
			$scope.newMemberToInsure.Gender = 'Female';
		}

		if ($scope.newMemberToInsure.Relation == 'KID') {
			$scope.newMemberToInsure.Salutation = "";
			$scope.newMemberToInsure.Gender = "";
		}

		

		if ($rootScope.rfbProduct && $scope.newMemberToInsure.Relation == 'KID') {
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

		if ($scope.newMemberToInsure.Relation == 'SELF') {
			var DOB = [];

			$scope.newMemberToInsure.FirstName = $scope.policyDetails.FirstName;
			$scope.newMemberToInsure.MiddleName = $scope.policyDetails.MiddleName;
			$scope.newMemberToInsure.LastName = $scope.policyDetails.LastName;
			$scope.newMemberToInsure.Mobile = $scope.policyDetails.Mobile;
			$scope.newMemberToInsure.Salutation = $scope.policyDetails.Salutation;

			if ($scope.policyDetails.Salutation == "Mr") {
				$scope.newMemberToInsure.Gender = 'Male';
			}

			if ($scope.policyDetails.Salutation == "Mrs" || $scope.policyDetails.Salutation == "Ms") {
				$scope.newMemberToInsure.Gender = 'Female';
			}

			DOB = $scope.policyDetails.DOB.split('/');
			$scope.newMemberToInsure.day = DOB[0];
			$scope.newMemberToInsure.month = DOB[1];
			$scope.newMemberToInsure.year = DOB[2];
			$scope.DOB = $scope.newMemberToInsure.day + '/' + $scope.newMemberToInsure.month + '/' + $scope.newMemberToInsure.year;

		}
		
	}

	/*---------------------- To Select Member Ends-------------*/

	/*---------------- Change Aadhar Status -----------------*/

	$scope.changeIdType = function (type) {
		if ($scope.newMemberToInsure.IDType != type) {
			$scope.newMemberToInsure.IDNo = "";
			$scope.newMemberToInsure.IDType = type;
		}
	}

	/*---------------- End of change aadhar status -----------*/

	$scope.updateSIFF = function(event, validForm){
		let MArr = angular.copy($scope.userpolicy.InsuredMembers).splice(1)
		let memList = [];
		MArr.forEach(function (m) {
			let arr ={
				MemberID: m.MemberId,
				SumInsured: $scope.changeFFIS,
				Relation: m.RelationWithProposer,
				Deductible:$scope.newMemberToInsure.Deductible
			}
			memList.push(arr);
		});

		RenewService.postData(ABHI_CONFIG.apiUrl + "Renew/UpdateSumInsured", {
			"ReferenceNo": $sessionStorage.refNo,
			"PolicyNumber": $sessionStorage.policyNo,
			"memberDetails": memList
		}, true
		)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					$scope.changeFFIS = undefined;
					$scope.proceedButton(event, validForm);
				}
				else{
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

	/*---------------- To Subimit Add Member Form ---------------------------*/
	$scope.retailRiderQuest={}

	$scope.diseaseDate = function(day,month,year, modelName) {
		$scope.retailRiderQuest[modelName] = day+"-"+month+"-"+year;
		console.log($scope.retailRiderQuest[modelName]);
	}

	$scope.saveConfirm = function (event, validForm){
		if($scope.productSelected != "GlobalHealthSecure-Revised"){
			var chkBMI = $scope.calculateBMI();
		}

		/*----------- Form Validation --------------------*/
		if (!validForm) {
			$scope.showErrors = true;
			$rootScope.alertConfiguration('E', "Please fill valid data");
			$("html, body").animate({
				scrollTop: $("#add-member").offset().top - 100
			}, 300);
			return false;
		}
		/*----------- Form Validation Ends --------------------*/

		

		if($scope.productSelected == 'ActivCareV2' && $scope.userpolicy.InsuredMembers[1].optionalCoverages){
			for (let i = 0; i < $scope.userpolicy.InsuredMembers[1].optionalCoverages.length; i++) {
				$scope.newMemberToInsure.optionalCoverages.push(
					{
						"Coverage": $scope.userpolicy.InsuredMembers[1].optionalCoverages[i].Coverage,
						"coverSi": $scope.userpolicy.InsuredMembers[1].optionalCoverages[i].coverSi
					}
				)
				
			}
		}

		/*---------------- Occupation Validation ------------------------*/
		if ($scope.newMemberToInsure.Occupation == '' && ($scope.newMemberToInsure.Occupation != 'Housewife' || $scope.newMemberToInsure.Occupation != 'Not Employed' || $scope.newMemberToInsure.Occupation != 'Retired') && $scope.productSelected != 'SuperTopUp') {
			$scope.showErrors = true;
			$rootScope.alertConfiguration('E', "Please fill valid data");
			$("html, body").animate({
				scrollTop: $("#add-member").offset().top - 100
			}, 300);
			return false;
		}
		/*---------------- Occupation Validation Ends ------------------------*/

		/*---------------- Optional cover Validation for platinum premiere ------------------------*/
		// if (($scope.userpolicy.PlanName =='Platinum - Premiere' && $scope.underAge) && ($scope.newMemberToInsure.PAC == '' || ($scope.newMemberToInsure.CIC == '' && $scope.userAge >= 18) || $scope.newMemberToInsure.ICMI == '')) {
		// 	$scope.showErrors = true;
		// 	$rootScope.alertConfiguration('E', "Please fill valid data");
		// 	$("html, body").animate({
		// 		scrollTop: $("#add-member").offset().top - 100
		// 	}, 300); 
		// 	return false;
		// }
		/*---------------- Optional cover Validation for platinum premiere Ends ------------------------*/

		/*---------------- Sum Insured Validation -------------------*/
		if ($scope.newMemberToInsure.SumInsured == '') {
			$scope.showErrors = true;
			$rootScope.alertConfiguration('E', "Please fill valid data");
			$("html, body").animate({
				scrollTop: $("#add-member").offset().top - 100
			}, 300);
			return false;
		}
		/*---------------- Sum Insured Validation Ends -------------------*/

		/*--------------- ID Type Validation ------------------*/
		if ($scope.newMemberToInsure.Relation == 'SELF' && $scope.newMemberToInsure.IDType == '') {
			$scope.showErrors = true;
			$rootScope.alertConfiguration('E', "Please fill valid data");
			$("html, body").animate({
				scrollTop: $("#add-member").offset().top - 70
			}, 300);
			return false;
		}
		/*--------------- ID Type Validation Ends ------------------*/

		/*----------------- Gender Validation ----------------*/
		if ($scope.newMemberToInsure.Gender == '') {
			$scope.showErrors = true;
			$rootScope.alertConfiguration('E', "Please fill valid data");
			$("html, body").animate({
				scrollTop: $("#add-member").offset().top - 50
			}, 300);
			return false;
		}
		/*----------------- Gender Validation Ends ----------------*/

		/*----------- Height Validation --------------------*/
		if ($scope.ft && $scope.ft < 1) {
			$rootScope.alertConfiguration('E', "Please enter proper height");
			return false;
		}
		/*----------- Height Validation Ends --------------------*/

		/*----------- Weight Validation --------------------*/
		if ($scope.newMemberToInsure.Weight && $scope.newMemberToInsure.Weight < 1) {
			$rootScope.alertConfiguration('E', "Please enter proper weight");
			return false;
		}
		/*----------- Weight Validation Ends--------------------*/

		/*------------------ Alcohol/Smoke Validations --------------------*/
		
		if ($scope.newMemberToInsure.AlcoholYN == 'Y' && $scope.newMemberToInsure.AlcoholYN != 'N') {
			if (($scope.newMemberToInsure.AlcoholQty == "" || $scope.newMemberToInsure.AlcoholQty == null || $scope.newMemberToInsure.AlcoholQty == 0) && ($scope.newMemberToInsure.SmokeQty == "" || $scope.newMemberToInsure.SmokeQty == null || $scope.newMemberToInsure.SmokeQty == 0) && ($scope.newMemberToInsure.PanmasalaQty == "" || $scope.newMemberToInsure.PanmasalaQty == null || $scope.newMemberToInsure.PanmasalaQty == 0) && ($scope.newMemberToInsure.Others == "" || $scope.newMemberToInsure.Others == null) && (($scope.newMemberToInsure.SubstanceQty == "" || $scope.newMemberToInsure.SubstanceQty == null || $scope.newMemberToInsure.SubstanceQty == 0))) {
				$rootScope.alertConfiguration('E', "Please fill proposer Smoke/Alcohol or tabaco");
				return false;
			}else {
				if(parseInt($scope.newMemberToInsure.AlcoholQty) > $scope.AlcoholCount){
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": "Alcohol should not exceed " +$scope.AlcoholCount+ " pegs per week.",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
					
				return false;
				}
				if(parseInt($scope.newMemberToInsure.SmokeQty) > $scope.SmokeCount){
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": "Cigarette/bidi should not exceed " +$scope.SmokeCount+ " sticks per week.",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
				return false;
				}
				if(parseInt($scope.newMemberToInsure.PanmasalaQty)> $scope.PanmasalaCount){
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": "Pan Masala / Guthka should not exceed " +$scope.PanmasalaCount+ " pouches per week.",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
				return false;
				}
			}
			if (($scope.newMemberToInsure.SubstanceQty == "" || $scope.newMemberToInsure.SubstanceQty == null || $scope.newMemberToInsure.SubstanceQty == 0) && $scope.newMemberToInsure.Others) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "Please fill propoer Other Quantity",
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
				
				return false;
			}
			if (($scope.newMemberToInsure.Others == "" || $scope.newMemberToInsure.Others == null) && $scope.newMemberToInsure.SubstanceQty != 0 && $scope.newMemberToInsure.SubstanceQty) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "Please fill propoer Other name",
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
				return false;
			}
		}
		/*------------------ Alcohol/Smoke Validations Ends --------------------*/

		/*------------------ Pre-Existing Disease Validations --------------------*/
		if ($scope.newMemberToInsure.UndergoneAnySurgery == 'Y') {
			$rootScope.alertData = {
				"modalClass": "regular-alert",
				"modalHeader": "Alert",
				"modalBodyText": "Based on declaration, added member is not eligible to opt for this product currently at renewal.",
				"showCancelBtn": false,
				"modalSuccessText": "Ok",
				"showAlertModal": true,
				"hideCloseBtn": true,
				"positiveFunction": function () {
					$location.url('renewal-view-member-landing');
				}
			}
			return false;
		}
		/*------------------ Pre-Existing Disease Validations --------------------*/

		/*------------------ BMI Validations --------------------*/
		if($scope.productSelected != "ActivSecure"){
			if (chkBMI <= 14 || chkBMI >= 33) {
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "Based on declaration, added member is not eligible to opt for this product currently at renewal.",
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true,
					"positiveFunction": function () {
						$location.url('renewal-view-member-landing');
					}
				}
				return false;
			}
		}
		/*------------------ BMI Validations --------------------*/

		/*------------------ To Call Add Member --------------------------------*/
		$scope.newMemberToInsure.DOB = $scope.DOB;
		$scope.newMemberToInsure.Height = $scope.newMemberToInsure.ft+'.'+$scope.newMemberToInsure.inches;
		// var today = new Date();
		// var currentYear = today.getFullYear()
		// var year = ($scope.newMemberToInsure.DOB.trim().includes("/") ? $scope.newMemberToInsure.DOB.trim().split('/') : $scope.newMemberToInsure.DOB.trim().split('-'));
		// var age = parseInt(currentYear) - parseInt(year[2]);
		
		$scope.newMemberToInsure.Height = $scope.newMemberToInsure.ft + '.' + $scope.newMemberToInsure.inches;
		$scope.newMemberToInsure.InitialSumInsured = $scope.suminsuredArray[0];
		if ($scope.upsellFlag == 'Y' && $scope.insuredMembers[0].UpSellSumInsured != 0) {
			$scope.newMemberToInsure.UpSellSumInsured = $scope.suminsuredArray[1];
		}

		
		// "ChronicTab":"N",
		// "diabetes":"N",
		// "hypertension":"N",
		// "pulmonary":"N",

		// "OrganTab":"N",
		// "Heart":"N",
		// "Lung":"N",
		// "ENT":"N",
		// "Kidney":"N",
		// "Brain":"N",

		// "InsuredTab":"N",
		// "regularMedical":'N',
		// "Surgery":'N',
		// "BloodTests":'N',

		// "OtherTab":"N",
		// "Cancer":"N",
		// "Sexually":"N",
		// "Disability":"N",
		// "BloodDisorder":"N",
		// "GeneticDisorder":"N",
		// "BirthDefect":"N",
		// "Paralysis":"N",
		// "AccidentalInjury":"N",
		if($scope.newMemberToInsure.EarningNonEarning = "Earning" && parseInt($scope.newMemberToInsure.AnnualIncome) <  $scope.chkAnnualIncome && $scope.productSelected == "ActivSecure"){
			$scope.calculateAnnualIncome()
			return;
		}

		if($scope.newMemberToInsure.previousTreatment == "Y" && $scope.productSelected != 'ActivSecure'){
			
			if($scope.newMemberToInsure.diabetes == "Y" || $scope.newMemberToInsure.hypertension == "Y" || $scope.newMemberToInsure.pulmonary == "Y" || $scope.newMemberToInsure.hyperlipidemia == "Y" || $scope.newMemberToInsure.Heart == "Y" || $scope.newMemberToInsure.Lung == "Y" || $scope.newMemberToInsure.ENT == "Y" || $scope.newMemberToInsure.Kidney == "Y" || $scope.newMemberToInsure.Brain == "Y" || $scope.newMemberToInsure.regularMedical == "Y" || $scope.newMemberToInsure.Surgery == "Y" || $scope.newMemberToInsure.BloodTests == "Y" || $scope.newMemberToInsure.Cancer == "Y" || $scope.newMemberToInsure.Sexually == "Y" || $scope.newMemberToInsure.Disability == "Y" || $scope.newMemberToInsure.BloodDisorder == "Y" || $scope.newMemberToInsure.GeneticDisorder == "Y" || $scope.newMemberToInsure.BirthDefect == "Y" || $scope.newMemberToInsure.Paralysis == "Y" || $scope.newMemberToInsure.AccidentalInjury == "Y"){

			}
			else{
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "Please select atleast one pre-existing diesease from Chronic/Organ Related/Major/Other Conditions.",
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true,
					"positiveFunction": function () {
						
					}
				}
				return false;

			}
			if($scope.newMemberToInsure.SumInsuredType =='Family Floater' && ($scope.newMemberToInsure.diabetes == "Y" || $scope.newMemberToInsure.hypertension == "Y" || $scope.newMemberToInsure.pulmonary == "Y" || $scope.newMemberToInsure.hyperlipidemia == "Y")){
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": "Member with Chronic conditions cannot be added in case of Family Floater policy type.",
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true,
					"positiveFunction": function () {
						
					}
				}
				return false;
			}
		}
		else{
			$scope.newMemberToInsure.diabetes = "N"; $scope.newMemberToInsure.hypertension = "N"; $scope.newMemberToInsure.pulmonary = "N"; $scope.newMemberToInsure.hyperlipidemia = "N"; $scope.newMemberToInsure.Heart = "N"; $scope.newMemberToInsure.Lung = "N"; $scope.newMemberToInsure.ENT = "N"; $scope.newMemberToInsure.Kidney = "N"; $scope.newMemberToInsure.Brain = "N"; $scope.newMemberToInsure.regularMedical = "N"; $scope.newMemberToInsure.Surgery = "N"; $scope.newMemberToInsure.BloodTests = "N"; $scope.newMemberToInsure.Cancer = "N"; $scope.newMemberToInsure.Sexually = "N"; $scope.newMemberToInsure.Disability = "N"; $scope.newMemberToInsure.BloodDisorder = "N"; $scope.newMemberToInsure.GeneticDisorder = "N"; $scope.newMemberToInsure.BirthDefect = "N"; $scope.newMemberToInsure.Paralysis = "N"; $scope.newMemberToInsure.AccidentalInjury = "N";
		}

		$scope.newMemberToInsure.membQuestions = [];

		angular.forEach($scope.retailRiderQuestionArray, function(subQuest, mainQuest){
			if($scope.newMemberToInsure[mainQuest] == "Y"){
				angular.forEach(subQuest, function(quest){
					var questVal = $scope.retailRiderQuest[quest];
					var questAns = (questVal != '' && questVal != undefined) ? "1" : "0";
					if(questVal != undefined){
						$scope.newMemberToInsure.membQuestions.push({
							"Parent_question": mainQuest,
							"Question": quest.replace('TI','').replace('DG',''),
							"Question_Ans": questAns,
							"Remark": questVal
						})
					}
				})
				
				//console.log($scope.newMemberToInsure.membQuestions);
			}
		})
		//console.log($scope.retailRiderQuest);
		$rootScope.alertData = {
			"modalClass": "regular-alert",
			"modalHeader": "Confirm member details",
			"modalBodyText": "<p>Saved detail connot be edited, are you sure want to proceed?</p>",
			"showCancelBtn": true,
			"modalSuccessText": "Yes",
			"modalCancelText": "No",
			"showAlertModal": true,
			"hideCloseBtn": true,
			"positiveFunction": function () {
				$scope.proceedButton(event, validForm);
			},
			"negativeFunction": function () {
				
			}
		}
	}

	$scope.proceedButton = function (event, validForm) {
		

		$scope.addMemberPayload = {
			"ReferenceNo": $scope.policyDetails.ReferenceNo,
			"PolicyNumber": $scope.policyDetails.PolicyNumber,
			"MemberNo": $scope.userpolicy.InsuredMembers.length,
			"Salutation": $scope.newMemberToInsure.Salutation,
			"FirstName": $scope.newMemberToInsure.FirstName,
			"MiddleName": $scope.newMemberToInsure.MiddleName,
			"LastName": $scope.newMemberToInsure.LastName,
			"Mobile": $scope.newMemberToInsure.Mobile,
			"Email": $scope.newMemberToInsure.Email,
			"DOB": $scope.newMemberToInsure.DOB,
			"Age": $scope.newMemberToInsure.Age,
			"Height": $scope.newMemberToInsure.Height,
			"Weight": $scope.newMemberToInsure.Weight,
			"Occupation": $scope.newMemberToInsure.Occupation,
			"OccupationCode": $scope.newMemberToInsure.Occupation_ID,
			"MaritalStatus": "",
			"Gender": $scope.newMemberToInsure.Gender,
			"SumInsuredType": $scope.newMemberToInsure.SumInsuredType,
			"Relation": $scope.newMemberToInsure.Relation,
			"idNumber": $scope.newMemberToInsure.idNumber,
			"waitingPeriod": $scope.newMemberToInsure.waitingPeriod,
			"ModificationFlag": "",
			"Tenure": $scope.policyDetails.Tenure,
			"NomineeFirstName": $scope.policyDetails.NomineeName,
			"NomineeLastName": $scope.policyDetails.NomineeName,
			"NomineeDOB": "",
			"NomineeAddress": "",
			"NomineeContactNo": $scope.policyDetails.NomineeContactNo,
			"NomineeRelation": $scope.policyDetails.NomineeRelation,
			"HomeAddress1": $scope.policyDetails.HomeAddress1,
			"HomeAddress2": $scope.policyDetails.HomeAddress2,
			"HomeAddress3": $scope.policyDetails.HomeAddress3,
			"HomeState": $scope.newMemberToInsure.HomeState,
			"HomeDistrict": "",
			"HomeCity": $scope.newMemberToInsure.HomeCity,
			"HomePincode": $scope.newMemberToInsure.HomePincode,
			"SumInsured": $scope.newMemberToInsure.SumInsured,
			"SumInsuredType": $scope.newMemberToInsure.SumInsuredType,
			"Deductible": $scope.newMemberToInsure.Deductible,
			"InitialSumInsured": $scope.roundOffSI(parseInt($scope.userpolicy.InsuredMembers[1].InitialSumInsured)> 0?$scope.userpolicy.InsuredMembers[1].InitialSumInsured:$scope.userpolicy.InsuredMembers[1].SumInsured),
			"UpSellSumInsured": "",
			"Chronic": "",
			"CB": "",
			"IDType":$scope.productSelected == "ArogyaSanjeevaniPolicy"?"Pan Card":$scope.newMemberToInsure.IDType,
			"IDNo": $scope.newMemberToInsure.IDNo,
			"AlcoholYN":  $scope.newMemberToInsure.AlcoholYN,
			"AlcoholQty": $scope.newMemberToInsure.AlcoholQty,
			"SmokeQty": $scope.newMemberToInsure.SmokeQty,
			"PanmasalaQty": $scope.newMemberToInsure.PanmasalaQty,
			"Others": $scope.newMemberToInsure.Others,
			"SubstanceQty": $scope.newMemberToInsure.SubstanceQty,
			"IsEIAavailable": "",
			"ApplyEIA": "",
			"UndergoneANySurgery": "",
			"EIAAccountNo": "",
			"PreviousPolicyNumberYN": $scope.newMemberToInsure.previousPolicy,
			"PreviousPolicyNumber": $scope.newMemberToInsure.PreviousPolicyNumber,
			"PreviousPolicySumInsured": $scope.newMemberToInsure.PreviousPolicySumInsured,
			"PreviousPolicyClaims": $scope.newMemberToInsure.PreviousPolicyClaims,
			"PreviousInsurerName": $scope.newMemberToInsure.PreviousInsurerName,
			"PreviousPolicyRejectedYN": $scope.newMemberToInsure.PreviousPolicyRejectedYN,
			"PreviousPolicyRejectedDetails": $scope.newMemberToInsure.PreviousPolicyRejectedDetails,
			"Nationality": "Indian",
			"Designation": $scope.newMemberToInsure.Designation,
			"AnnualIncome": $scope.newMemberToInsure.AnnualIncome,
			"NatureOfDuty": $scope.newMemberToInsure.NatureOfDuty,
			"Hazardous_YN": $scope.newMemberToInsure.OccupationNatur,
			"RoomType": $scope.newMemberToInsure.RoomType,
			"RoomTypeAnyRoom":$scope.newMemberToInsure.RoomTypeAnyRoom,
			"RoomTypeSharedRoom":$scope.newMemberToInsure.RoomTypeSharedRoom,
			"RoomTypesingleRoom":$scope.newMemberToInsure.RoomTypesingleRoom,
			"optionalCoverages": $scope.newMemberToInsure.optionalCoverages,

			"DateofDiagnosis":$scope.newMemberToInsure.DateofDiagnosis,
			"exactDiagnosis":$scope.newMemberToInsure.exactDiagnosis,
			"LastConsultationDate":$scope.newMemberToInsure.LastConsultationDate,
			"Detailsoftreatment":$scope.newMemberToInsure.Detailsoftreatment,

			"PED": $scope.newMemberToInsure.previousTreatment,
			"DiseaseName": "",
			"Disability": "",
			"DateOfConsultaion": "",
			"Below60Years":$scope.newMemberToInsure.Below60Years,
			"Diseases":$scope.newMemberToInsure.Diseases,
			"RecurrentCough":$scope.newMemberToInsure.RecurrentCough,
			"ChronicDetails":{
 				"MemberID":$scope.userpolicy.InsuredMembers.length,
         		"Relation": $scope.newMemberToInsure.Relation,
				"Diabetes_YN": $scope.newMemberToInsure.diabetes,
				"BP_YN": $scope.newMemberToInsure.hypertension,
				"Asthama_YN": $scope.newMemberToInsure.pulmonary,
				"Cholestrol_YN": $scope.newMemberToInsure.hyperlipidemia,
				"HeartDisease": $scope.newMemberToInsure.Heart,
				"LungResp_YN": $scope.newMemberToInsure.Lung,
				"ENTDisease_YN": $scope.newMemberToInsure.ENT,
				"KidneyUrinary_YN": $scope.newMemberToInsure.Kidney,
				"BrainNervous_YN": $scope.newMemberToInsure.Brain,
				"UnderMedicalPrescription_YN": $scope.newMemberToInsure.regularMedical,
				"SurgerydoneOrAdvised": $scope.newMemberToInsure.Surgery,
				"AbnormalFindingsinXrayUSGMRI_YN": $scope.newMemberToInsure.BloodTests,
				"CancerTumour_YN": $scope.newMemberToInsure.Cancer,
				"SexualDisease_YN": $scope.newMemberToInsure.Sexually,
				"DisabilityMental_YN": $scope.newMemberToInsure.Disability,
				"AnemiaBlood_YN": $scope.newMemberToInsure.BloodDisorder,
				"GeneticDisorder_YN": $scope.newMemberToInsure.GeneticDisorder,
				"CongenetalBirthDefect_YN": $scope.newMemberToInsure.BirthDefect,
				"Paralysis": $scope.newMemberToInsure.Paralysis,
				"accidental_injury": $scope.newMemberToInsure.AccidentalInjury
			},
			"MembQuestions":$scope.newMemberToInsure.membQuestions
		  }

		//   if ($scope.newMemberToInsure.Relation == 'KID') {
		// 	if ($scope.newMemberToInsure.Gender == 'Female') {
		// 		$scope.addMemberPayload.Relation = "Dependent Daughter";
		// 		$scope.addMemberPayload.ChronicDetails.Relation = "Dependent Daughter";
		// 	}
		// 	if ($scope.newMemberToInsure.Gender == 'Male') {
		// 		$scope.addMemberPayload.Relation = "Dependent Son";
		// 		$scope.addMemberPayload.ChronicDetails.Relation = "Dependent Son";
		// 	}
		//   }
		  console.log($scope.addMemberPayload, "payload test");

		  if($scope.planPayload){
			$scope.updatePlan(event, validForm);
			return;
		}
		if($scope.policyTypeload){
			$scope.updatePolicyType(event, validForm);
			return;
		}

		/*----------- change in IS for family floater policy -----------*/
		if($scope.changeFFIS){
			$scope.updateSIFF(event, validForm);
			return false;
		}
	/*----------- change in IS for family floater policy -----------*/ 

		console.log("$scope.addMemberPayload");
		console.log($scope.addMemberPayload);
		RenewService.postData(ABHI_CONFIG.apiUrl+"Renew/AddMember",
				$scope.addMemberPayload,
				true
			)
			.then(function (data) {
				if (data.ResponseCode == 1) {
					//------------store policy level cover to display in all member for edit and optional cover section-------------//
					// if($scope.newPolcyCover.length > 0){
					// 	sessionStorage.setItem('policyNewCover', JSON.stringify($scope.newPolcyCover));
					// }
					//------------store policy level cover to display in all member for edit and optional cover section-------------//
					if($scope.upgradeZ){
						updateZone($scope.newMemberToInsure.HomeZone);
						}
					$rootScope.alertConfiguration('S', $scope.newMemberToInsure.Relation + " added Successfully ");
					$timeout(function () {
						$location.url('renewal-view-member-landing')
					}, 600);
				} else if (data.ResponseCode == 0) {
					// $scope.newMemberToInsure = {
					// 	"ReferenceNo": $sessionStorage.refNo, //Mandatory
					// 	"PolicyNumber": $sessionStorage.policyNo, // Mandatory
					// 	"Salutation": "", // Mandatory
					// 	"FirstName": "", // Mandatory
					// 	"MiddleName": "",
					// 	"LastName": "", // Mandatory
					// 	"Mobile": "",
					// 	"Email": $scope.personalDetails.Email,
					// 	"DOB": "", // Mandatory
					// 	"Age": "",
					// 	"Height": "",
					// 	"Weight": "",
					// 	"Occupation": "",
					// 	"MaritalStatus": "",
					// 	"Gender": "",
					// 	"Relation": "", // Mandatory
					// 	"NomineeFirstName": "",
					// 	"NomineeLastName": "",
					// 	"NomineeDOB": "",
					// 	"NomineeAddress": "",
					// 	"NomineeContactNo": "",
					// 	"NomineeRelation": "",
					// 	"HomeAddress1": "",
					// 	"HomeAddress2": "",
					// 	"HomeAddress3": "",
					// 	"HomeState": "",
					// 	"HomeDistrict": "",
					// 	"HomeCity": "",
					// 	"HomePincode": "",
					// 	"InitialSumInsured": $scope.userpolicy.InsuredMembers[1].InitialSumInsured,
					// 	"SumInsured": "", // Mandatory
					// 	"UpSellSumInsured": "",
					// 	"Deductible": "1000000",
					// 	"Chronic": "",
					// 	"CB": "",
					// 	"IDType": "",
					// 	"IDNo": "",
					// 	"AlcoholYN": "N",
					// 	"AlcoholQty": "",
					// 	"SmokeQty": "",
					// 	"PanmasalaQty": "",
					// 	"Others": "",
					// 	"SubstanceQty": "",
					// 	"IsEIAavailable": "N",
					// 	"ApplyEIA": "N",
					// 	"UndergoneAnySurgery": "N",
					// 	"EIAAccountNo": "",
					// 	"PreviousPolicyNumberYN": "",
					// 	"PreviousPolicySumInsured": "",
					// 	"PreviousPolicyClaims": "",
					// 	"PreviousPolicyRejectedYN": "",
					// 	"PreviousPolicyRejectedDetails": ""
					// }
					// $scope.newMemberToInsure.day = "";
					// $scope.newMemberToInsure.month = "";
					// $scope.newMemberToInsure.year = "";
					// $scope.DOB = "";
					// $scope.ft = "";
					// $scope.inches = "";
					// $("html, body").animate({
					// 	scrollTop: $("#add-member").offset().top - 100
					// }, 300);
					$rootScope.alertData = {
						"modalClass": "regular-alert",
						"modalHeader": "Alert",
						"modalBodyText": "Oops!, There seems to be a problem. Please try again.",
						"showCancelBtn": false,
						"modalSuccessText": "Ok",
						"showAlertModal": true,
						"hideCloseBtn": true
					}
				}
			})

		/*------------------ To Call Add Member Ends --------------------------------*/
	}

	/*---------------- End of To Subimit Add Member Form ---------------------------*/


	// future and past date validation

	

    //         window.onresize =  function() {
				
	// 			$scope.size();
				
    //         };
	$scope.DOD;
	$scope.DOD;
	$scope.dateValidation = function (day, month, year, label) {
		if(parseInt(day) && parseInt(month) > 0 && (parseInt(year) > 999)){
			var today = new Date().getTime(),
			userDate = new Date(parseInt(year), parseInt(month) - 1,  parseInt(day)).getTime();
			let userDOB = new Date(parseInt($scope.newMemberToInsure.year), parseInt($scope.newMemberToInsure.month) - 1,  parseInt($scope.newMemberToInsure.day)).getTime();
			let dateErr = "";
			if(label == "DD"){
				$scope.newMemberToInsure.DateofDiagnosis = day + '/' + month + '/' + year;
				if((today - userDate) < 0 ){
					$scope.newMemberToInsure.DateofDiagnosis = "";
					$scope.newMemberToInsure.dayDD = "";
					$scope.newMemberToInsure.monthDD = "";
					$scope.newMemberToInsure.yearDD = "";
					dateErr = "Date of diagnosis cannot be future date"
				}
				else if((userDate - userDOB) < 0 ){
					$scope.newMemberToInsure.DateofDiagnosis = "";
					$scope.newMemberToInsure.dayDD = "";
					$scope.newMemberToInsure.monthDD = "";
					$scope.newMemberToInsure.yearDD = "";
					dateErr = "Date of diagnosis should be greater than user DOB"
				}
				else if((new Date(parseInt($scope.newMemberToInsure.yearLCD), parseInt($scope.newMemberToInsure.monthLCD) - 1,  parseInt($scope.newMemberToInsure.dayLCD)).getTime() - userDate) < 0){
					$scope.newMemberToInsure.DateofDiagnosis = "";
					$scope.newMemberToInsure.dayDD = "";
					$scope.newMemberToInsure.monthDD = "";
					$scope.newMemberToInsure.yearDD = "";
					dateErr = "Date of diagnosis should not be greater than Last consultation date"
				}
				
			}
			else {
				$scope.newMemberToInsure.LastConsultationDate = day + '/' + month + '/' + year;
				if((today - userDate) < 0 ){
					$scope.newMemberToInsure.LastConsultationDate = "";
					$scope.newMemberToInsure.dayLCD = "";
					$scope.newMemberToInsure.monthLCD = "";
					$scope.newMemberToInsure.yearLCD = "";
					dateErr = "Last consultation date cannot be future date"
				}
				else if((userDate - userDOB) < 0 ){
					$scope.newMemberToInsure.LastConsultationDate = "";
					$scope.newMemberToInsure.dayLCD = "";
					$scope.newMemberToInsure.monthLCD = "";
					$scope.newMemberToInsure.yearLCD = "";
					dateErr = "Last consultation date should be greater than user DOB"
				}
				else if((userDate - new Date(parseInt($scope.newMemberToInsure.yearDD), parseInt($scope.newMemberToInsure.monthDD) - 1,  parseInt($scope.newMemberToInsure.dayDD)).getTime()) < 0){
					$scope.newMemberToInsure.LastConsultationDate = "";
					$scope.newMemberToInsure.dayLCD = "";
					$scope.newMemberToInsure.monthLCD = "";
					$scope.newMemberToInsure.yearLCD = "";
					dateErr = "Last consultation date should be greater than Date of diagnosis"
				}
				
			}
			
			if(dateErr){
				$rootScope.alertData = {
					"modalClass": "regular-alert",
					"modalHeader": "Alert",
					"modalBodyText": dateErr,
					"showCancelBtn": false,
					"modalSuccessText": "Ok",
					"showAlertModal": true,
					"hideCloseBtn": true
				}
			}
		}
		// return (today - userDate) < 0;
		
	}

	/*---------- Formation of DOB --------------*/

	$scope.changeDate = function (day, month, year) {
			$scope.DOB = day + '/' + month + '/' + year;
			let changed_DOB = month + '-' + day + '-' + year;
			$scope.calculatedDob = year + "-" + month + "-" + day;
			$scope.calculatedDob = year + "-" + month + "-" + day;
			$timeout(function () {
				if ($scope.addMemberForm.dob.$valid && year.length == 4) {
					checkAgeDiff($scope.calculatedDob, changed_DOB);
				}
			}, 100);
	}

	/*------------ End of formation of DOB ---------*/


	/* calculate BMI */
	$scope.calculateBMI = function () {
		var heightInMeters = ($scope.addMemberForm.heightfeet.$modelValue * 12 + parseInt($scope.addMemberForm.heightInch.$modelValue)) * .0254

		var BMIValue = $scope.addMemberForm.weight.$modelValue / (heightInMeters * heightInMeters)
		console.log("BMI: " + BMIValue);
		return BMIValue;
	}

	/* End of calculate BMI */

	/* Validate Alcohol */
		$scope.validAlcohol = function (alcoholQty) {
			if(alcoholQty > 14){
				$rootScope.alertConfiguration('E', "Person should consume maximum 14 pegs per week");
			}
		}

		/* End of calculate BMI */

		/* Change Pincode and update State and City  Details */
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
						$scope.userpolicy.HomePincode = $scope.insuredMemberDetails.addressDetails.Pincode;
						$scope.userpolicy.HomeCity = $scope.insuredMemberDetails.addressDetails.City;
						$scope.userpolicy.HomeState = $scope.insuredMemberDetails.addressDetails.State;
						$scope.userpolicy.HomeDistrict = $scope.insuredMemberDetails.addressDetails.State;
						
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
	
	$scope.upgradeZ = false;
    $scope.changePinCode = function (validPinCode, param) {
        if (validPinCode) {
            // $scope.newMemberToInsure.HomeCity = "";
            // $scope.newMemberToInsure.HomeState = "";
            // $scope.newMemberToInsure.HomeZone = "";
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/PinCode", {
                "PinCode": $scope.newMemberToInsure.HomePincode,
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
							$scope.newMemberToInsure.HomeCity  = data.ResponseData.City;
							$scope.newMemberToInsure.HomeState = data.ResponseData.State;
							$scope.newMemberToInsure.HomeZone = data.ResponseData.Zone;
							return;
						}
                        // if ($scope.userpolicy.ProductName == "Activ Health V2") {
                            var newZone = data.ResponseData.Zone.split("Z00");
                            var oldZone = $scope.userpolicy.Zone.split("Z00");
                            if (parseInt(oldZone[1]) >= parseInt(newZone[1])) {
								$scope.newMemberToInsure.HomeCity  = data.ResponseData.City;
								$scope.newMemberToInsure.HomeState = data.ResponseData.State;
								$scope.newMemberToInsure.HomeZone = data.ResponseData.Zone;
								calculatePremiumParams.Platinum.Zone = data.ResponseData.Zone;
								// updateZone(data.ResponseData.Zone);
								$scope.upgradeZ = true;
                                // $scope.calculatePremium();

                                // if (angular.isUndefined(param)) {
                                //     // zoneVal = data.ResponseData.Zone;
                                //     calculatePremiumParams.Platinum.Zone = data.ResponseData.Zone;
                                //     $scope.calculatePremium();
                                // }
                                // else {
								// 	$scope.newMemberToInsure.HomePincode = "";
								// 	$scope.newMemberToInsure.HomeCity = "";
								// 	$scope.newMemberToInsure.HomeState = "";
                                // }
                            }
                            else {
                                // zoneVal = $scope.userpolicy.Zone;
                                // calculatePremiumParams.Platinum.Zone = $scope.userpolicy.Zone;
								// $scope.calculatePremium();
								$rootScope.alertData = {
									"modalClass": "regular-alert",
									"modalHeader": "Alert",
									"modalBodyText": "If new pincode entered is of Upscale Zone or within the same Zone then it will allow to change the pincode",
									"showCancelBtn": false,
									"modalSuccessText": "Ok",
									"showAlertModal": true,
									"hideCloseBtn": true,
									"positiveFunction": function () {
										// $scope.newMemberToInsure.HomePincode = $scope.userpolicy.HomePincode;
										// $scope.newMemberToInsure.HomeCity  = $scope.userpolicy.City;
										// $scope.newMemberToInsure.HomeState = data.ResponseData.State;
										// $scope.newMemberToInsure.HomeZone = data.ResponseData.Zone;
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
                        // $rootScope.alertConfiguration('E',data.ResponseMessage);
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Alert",
                            "modalBodyText": data.ResponseMessage,
                            "showCancelBtn": false,
                            "modalSuccessText": "Ok",
                            "showAlertModal": true,
                            "hideCloseBtn": true,
                            "positiveFunction": function () {
                                $scope.newMemberToInsure.HomePincode = "";
                            }
                        }

                    }
                }, function (err) {
                });
        }
    }

	$scope.changePinCode($scope.userpolicy.HomePincode , "inIt");


    /* End of change Pincode and update State and City  Details */

	var calculatePremiumParams = {
        ReferenceNumber: $scope.userpolicy.ReferenceNo
    };

	if($scope.userpolicy.ProductName == "Activ Health" || $scope.userpolicy.ProductName == "Activ Health V2") {
        // pDC.PL = true;
        // pDC.productSelected = 'PL'
        calculatePremiumParams.Platinum = {
            'MemberDetails': []
        };
    }


// select Optional Cover
$scope.disHCB = false;
$scope.disWMC = false;
$scope.isPolicyLevel = false;

$scope.gotExistingMemberCover = function (params) {
	$scope.isPolicyLevel = false;
	for (let i = 0; i < $scope.membersCover.length; i++) {
		switch ($scope.membersCover[i].Coverage) {
			case 'Personal Accident Cover (AD, PTD)':
				if(params == "PAC"){
					return i;
				}
			break;
			case 'Critical Illness Cover':
				if(params == "CIC"){
					return i;
				}
			break;

			case 'International Coverage for major illnesses':
				if(params == "ICMI"){
					return i;
				}
			break;


			case 'Waiver of Mandatory Co-payment':
			case 'Waiver of mandatory co-payment':
				if(params == "WMC"){
					$scope.disWMC = true;
					return i;
				}
			break;

			case 'OPD Expenses':
				if(params == "OPDC"){
					return i;
				}
			break;

			case 'Hospital cash Benefit':
				if(params == "HCB"){
					$scope.disHCB = true;
					return i;
				}
			break;

			case 'Days per Policy Year limit':
				if(params == "DCB"){
					return i;
				}
			break;
			case 'Maternity Expenses':
				if(params == "ME"){
					return i;
				}
			break;

			case 'PPN Discount':
				if(params == "PPN"){
					return i;
				}
			break;

			case 'Cancer Hospitalization Booster':
				if(params == "OPDC"){
					return i;
				}
			break;

			case 'Second E opinion':
			case 'Second E Opinion':
			case 'Second E-Opinion on Critical Illnesses':
			case 'Second E Opinion on major illnesses':
				if(params == "OC-SP"){
					return i;
				}
			break;

			case 'Wellness coach':
			case 'Wellness Coach':
				if(params == "OC-WC"){
					return i;
				}
			break;

			case 'Temporary Total Disablement (TTD)':
				if(params == "OC_TTDB"){
					return i;
				}
			break;

			case 'Accidental in-patient Hospitalization Cover':
			if(params == "OC_AIH"){
				return i;
			}
			break;

			case 'Coma Benefit':
			if(params == "OC_CB"){
				return i;
			}
			break;

			case 'Broken Bones Benefit':
			if(params == "OC_BBB"){
				return i;
			}
			break;

			case 'Adventure Sports Cover':
			if(params == "OC_AS"){
				return i;
			}
			break;

			case 'Burns Benefits':
			if(params == "OC_BB"){
				return i;
			}
			break;

			case 'Accidental Medical Expenses':
			if(params == "OC_AME"){
				return i;
			}
			break;

			case 'Worldwide Emergency Assistance Services (including Air Ambulance)':
			if(params == "OC_WEA"){
				return i;
			}
			break;

			case 'EMI Protect':
			if(params == "OC_EMI"){
				return i;
			}
			break;

			case 'Loan Protect':
			if(params == "OC_Loan"){
				return i;
			}
			break;

			default:
				break;
		}
	}

	let policyCoverArr = ["HCB","WMC"]

	if((policyCoverArr.includes(params) && $scope.newMemberToInsure.SumInsuredType =='Family Floater')){
		$scope.isPolicyLevel = true;
	}
	return undefined;
}

// $scope.newPolcyCover = [];
$scope.selectCover = function(c_type, c_name, c_code){
	const cb = document.querySelector('#'+c_type);
	let onSI = ["Wellness Coach", "Second E opinion", "Waiver of Mandatory Co-payment","Worldwide Emergency Assistance Services (including Air Ambulance)","Accidental Medical Expenses","Adventure Sports Cover","Coma Benefit","Accidental in-patient Hospitalization Cover"];
	if(cb.checked || ($scope.disHCB && c_type == 'HCB') || ($scope.disWMC && c_type == 'WMC') ){
		if(c_type == 'waitingPeriod'){
			$scope.newMemberToInsure.optionalCoverages.push(
				{
					"Coverage": c_name[0],
					"Period": c_name[1]
				}
			)
			$scope.newMemberToInsure[c_type]= c_name[1];
			console.log($scope.newMemberToInsure.optionalCoverages, "covers");

			return;
		}

		if(c_type == 'HCB' || c_type == 'DCB'){

			let coverData = {
				"Coverage": c_name,
				"CoverSI":$scope.newMemberToInsure.SumInsuredType =='Family Floater'?$scope.gotExistingMemberCover(c_type) != undefined?$scope.membersCover[$scope.gotExistingMemberCover(c_type)].coverSi:$scope.CBHAmtList[1]: $scope.CBHAmtList[1],
				"NO_Of_Days": '30'
			}
			$scope.newMemberToInsure.optionalCoverages.push(
				coverData
			)
			$scope.newMemberToInsure[c_type] = coverData.CoverSI;
			$scope.newMemberToInsure["NO_Of_Days"]="30";
			
			//----storing data to set cover to all the member insured--------//
			// if(!$scope.gotExistingMemberCover(c_type) && $scope.isPolicyLevel){
			// 	let policyCover = {
			// 		Coverage: coverData.Coverage,
			// 		coverSi: coverData.CoverSI
			// 	}
			// 	if(sessionStorage.getItem('policyNewCover')){
			// 		$scope.newPolcyCover = JSON.parse(sessionStorage.getItem('policyNewCover')) 
			// 	}
			// 	$scope.newPolcyCover.push(policyCover);
			// }
			//----storing data to set cover to all the member insured--------//

			console.log($scope.newMemberToInsure.optionalCoverages, $scope.newMemberToInsure[c_type], "covers");

			return;
		}

		if(c_type == 'WMC'){
			let coverData = {
				"Coverage": c_name,
				"CoverSI":"",
			}
			$scope.newMemberToInsure.optionalCoverages.push(
				coverData
			)

			// if(!$scope.gotExistingMemberCover(c_type) && $scope.isPolicyLevel){
			// 	if(sessionStorage.getItem('policyNewCover')){
			// 		$scope.newPolcyCover = JSON.parse(sessionStorage.getItem('policyNewCover'));
			// 	}
			// 	$scope.newPolcyCover.push(coverData);
			// }

			return;
		}

		if(c_name == 'OPD Expenses'){
			$scope.newMemberToInsure[c_type]=$scope.oPDArray[2].val;
			console.log($scope.newMemberToInsure.optionalCoverages, "covers");

			$scope.newMemberToInsure.optionalCoverages.push(
				{
					"Coverage": c_name,
					"CoverSI":$scope.oPDArray[2].val
				}
			)
			return;
		}

		$scope.newMemberToInsure.optionalCoverages.push(
			{
				"Coverage": c_name,
				"CoverSI":onSI.includes(c_name)?"":c_code?$scope.inItsetCoversSi(c_code).length>0?$scope.inItsetCoversSi(c_code)[0].amount:c_code:$scope.sumInsuredList[2].amount
			}
		)
		
		$scope.newMemberToInsure[c_type]=c_code?$scope.inItsetCoversSi(c_code).length>0?$scope.inItsetCoversSi(c_code)[0].amount:c_code:$scope.sumInsuredList[2].amount;
	}
	else{
		for (let i = 0; i < $scope.newMemberToInsure.optionalCoverages.length; i++) {
			if(c_type == 'waitingPeriod'){
				c_name= c_name[0];
			}
			if($scope.newMemberToInsure.optionalCoverages[i].Coverage == c_name){
				$scope.newMemberToInsure.optionalCoverages.splice(i, 1);
			}
		}
		$scope.newMemberToInsure[c_type]= "";

		// for (let i = 0; i < $scope.newPolcyCover.length; i++) {
		// 	if($scope.newPolcyCover[i].Coverage == c_name){
		// 		$scope.newPolcyCover.splice(i, 1);
		// 	}
		// }
	}

	console.log($scope.newMemberToInsure.optionalCoverages, "covers");
}

$scope.selectCoverSI = function(c_type,c_name, value){
	for (let i = 0; i < $scope.newMemberToInsure.optionalCoverages.length; i++) {
		if($scope.newMemberToInsure.optionalCoverages[i].Coverage == c_name){
			if(c_type == 'waitingPeriod'){
				$scope.newMemberToInsure.optionalCoverages[i].Period = value;
			}
			else if(c_type == 'HCB' || c_type == 'DCB'){
				if(value.length <= 2){
					$scope.newMemberToInsure.optionalCoverages[i].NO_Of_Days = value;
					$scope.newMemberToInsure["NO_Of_Days"]=value;
				}
				else{
					$scope.newMemberToInsure.optionalCoverages[i].CoverSI = value;
					$scope.newMemberToInsure[c_type]=value;
				}
				// for (let index = 0; index < $scope.newPolcyCover.length; index++) {
				// 	if($scope.newPolcyCover[i].Coverage == c_name){
				// 		$scope.newPolcyCover[i].coverSi = value;
				// 	}
				// }
				
				return;
			}
			else{
				$scope.newMemberToInsure.optionalCoverages[i].CoverSI = value;
			}
			
		}
	}
	
	$scope.newMemberToInsure[c_type]=value;
	console.log($scope.newMemberToInsure.optionalCoverages, "covers");
}


//-------------------pre select covers call from header directive-----------------//
$scope.setCoverOnLoad = function() {
	if($scope.newMemberToInsure.SumInsuredType =='Family Floater' && ($scope.productCode == "Essential" || $scope.productCode == "Enhanced")){
		let preSelectedCoverArr = [];
		if($scope.productSelected == "ActivHealth" || $scope.productSelected == "ActivHealthV2"){
			preSelectedCoverArr = [['HCB', 'Hospital cash Benefit', null], ['WMC','Waiver of Mandatory Co-payment',null]]
		}
		for (let i = 0; i < preSelectedCoverArr.length; i++) {
			switch (preSelectedCoverArr[i][0]) {
				case "HCB":
					if($scope.gotExistingMemberCover("HCB") != undefined){
						$scope.disHCB = true;
						$scope.selectCover(preSelectedCoverArr[i][0], preSelectedCoverArr[i][1], preSelectedCoverArr[i][2]);
					}
					break;

				case "WMC":
					if($scope.productCode == "Essential" && ($scope.gotExistingMemberCover("WMC") != undefined)){
						$scope.disWMC = true;
						$scope.selectCover(preSelectedCoverArr[i][0], preSelectedCoverArr[i][1], preSelectedCoverArr[i][2]);
					}
					break;
			
				default:
					break;
			}
			
		}
	}
}

//-------------------pre select covers-----------------//


// select Optional Cover

	/* Get updated Prenium on age and salutation change */
	
    $scope.calculatePremium = function (data) {
        // delete pDC.proposerDetails.PremiumDetail;
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", calculatePremiumParams, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (response) {
                if (response.ResponseCode == 1) {
                    // pDC.proposerDetails.PremiumDetail = response.ResponseData;
					
                    // if (parseInt(pDC.proposerDetails.PremiumDetail.TotalPremium) >= 100000 && pDC.proposerDetails.ProposerDetail.IdType != "Pan Card") {
                    //     pDC.proposerDetails.ProposerDetail.IdType = "PAN Card"
                    //     pDC.proposerDetails.ProposerDetail.IdNumber = ""
                    //     pDC.showOtherId = true;
                    // }
                    // else {
                    //     pDC.showOtherId = false;
                    // }
                } else {
                    $rootScope.alertConfiguration('E', response.ResponseMessage);
                }
            }, function (err) {
            });
    }

    /* Get updated Prenium on age and salutation change */

	

	 /* Show error model on the question */

	 $scope.showRestrictModal = function () {
        $rootScope.alertData = {
            "modalClass": "regular-alert",
            "modalHeader": "Warning",
            "modalBodyText": "The policy cannot be bought online. Please contact our call center or the nearest branch for assistance",
            "showCancelBtn": false,
            "modalSuccessText": "OK",
            "modalCancelText": "No",
            "hideCloseBtn": true,
            "showAlertModal": true,
            "positiveFunction": function () {
				$scope.newMemberToInsure.notIndianNational='N'
				var elementI = document.getElementById("indianN");
				var nElementI = document.getElementById("nonIndianN");
				var spanElement = document.getElementById("nonIndianNSpan");
				elementI.classList.add("proposal-form-btn-yellow");
				nElementI.classList.remove("yes-btn-red");
				nElementI.classList.remove("show-answer");
				nElementI.classList.add("harmful-subtance-yes-btn");
				nElementI.classList.add("harmful-substance-show-answer");
				nElementI.classList.add("yes-btn-white");
				spanElement.classList.add("proposal-form-btn-txt");
				spanElement.classList.remove("proposal-form-btn-txt-red");
            }
        }
    }

    /* End of show error modal on the question */

}]);


/*--------- Aadhar card enter directive -------------------*/

renewalViewMemberAddUserApp.directive('aadharCard', function ($timeout) {
	return {
		require: '?ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			if (!ngModelCtrl) {
				return;
			}
			ngModelCtrl.$parsers.push(function (val) {
				if (val === undefined || val === null) {
					val = '';
				}
				var clean = val.toString().replace(/\D/g, "").split(/(?:([\d]{4}))/g).filter(function (s) {
					return s.length > 0;
				}).join("-");
				if (val !== clean) {
					ngModelCtrl.$setViewValue(clean);
					ngModelCtrl.$render();
				}
				return clean;
			});
			element.bind('keypress', function (e) {
				var code = e.keyCode || e.which;
				if (code === 101 || code === 32 || code === 109 || code === 45) {
					e.preventDefault();
				}
			});
		}
	};
});

/*--------- End of Aadhar card enter directive ------------*/

/*--------- Height-Weight Directive -----------------------*/

renewalViewMemberAddUserApp.directive('heightWeight',function($timeout){
	return {
		require: '?ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			if (!ngModelCtrl) {
				return;
			}
			ngModelCtrl.$parsers.push(function (val) {
				if (val === undefined || val === null) {
					val = '';
				}
				if(attrs.heightWeight == "feet"){
					var clean = val.toString().replace(/[^0-7]+/g, '');
				}else if(attrs.heightWeight == "inch"){
					var clean = val.toString().replace(/[^0-9]+/g, '');
					if(clean > 11){
						clean = 11;
					}
				}else if(attrs.heightWeight == "weight"){
					var clean = val.toString().replace(/[^0-9]+/g, '');
						if(clean > 199){
						clean = 199;
					}
				}
				if (val !== clean) {
					ngModelCtrl.$setViewValue(clean);
					ngModelCtrl.$render();
				}
				return clean;
			});
			element.bind('keypress', function (e) {
				var code = e.keyCode || e.which;
				if (code === 101 || code === 32 || code === 109 || code === 45) {
					e.preventDefault();
				}
			});
		}
	};

	
});

/*--------- End of Height-Weight Directive -----------------------*/
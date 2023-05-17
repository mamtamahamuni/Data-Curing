/*
    Post Payment Controller
    Author: Pankaj Patil
    Date: 29-08-2018

*/

var pPApp = angular.module("postPaymentApp", []);

pPApp.controller("postPaymentCtrl", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$location', '$timeout', function($rootScope, appService, ABHI_CONFIG, $filter, $location, $timeout) {

    var pPC = this;
    var aS = appService;
    pPC.insuredMembers = [];
    pPC.productName = sessionStorage.getItem('pName');
    var memberCount = 0;
    pPC.isInsulin = 'N';
    pPC.stProductAvail = false;
    var allDates = {};

    /* Route Change Start Function */

        $rootScope.$on('$routeChangeStart', function (event, next, prev) {
            if(angular.isUndefined(prev)){
                return false;
            }
            if(prev.$$route.controller == 'postPaymentCtrl' && (angular.isUndefined(next) || !(next.$$route.controller == 'thankYou'))){
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": "You are not authorized to go back.",
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true,
                }
                $rootScope.showWhiteLoader = false;
                event.preventDefault();
            }
        });

    /* End of change start function */


    /* To fetch insured members for post payment questions */

        function fetchMemberedArrayList(data) {
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPostPaymentQuestionMembers", {
                    "ReferenceNumber": sessionStorage.getItem('rid')
                }, false, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        $rootScope.showLoader = true;
                        angular.forEach(data.ResponseData, function(v, i) {
                            switch (v.RelationType) {
                                case "S":
                                    pPC.insuredMembers[0] = v;
                                    break;
                                case "SPO":
                                    pPC.insuredMembers[1] = v;
                                    break;
                                case "F":
                                    pPC.insuredMembers[2] = v;
                                    break;
                                case "M":
                                    pPC.insuredMembers[3] = v;
                                    break;
                                case "FIL":
                                    pPC.insuredMembers[4] = v;
                                    break;
                                case "MIL":
                                    pPC.insuredMembers[5] = v;
                                    break;
                                case "BRO":
                                    pPC.insuredMembers[6] = v;
                                    break;
                                case "SISL":
                                    pPC.insuredMembers[7] = v;
                                    break;
                                case "SIS":
                                    pPC.insuredMembers[8] = v;
                                    break;
                                case "BIL":
                                    pPC.insuredMembers[9] = v;
                                    break;
                                case "GF":
                                    pPC.insuredMembers[10] = v;
                                    break;
                                case "GM":
                                    pPC.insuredMembers[11] = v;
                                    break;
                                case "UN":
                                    pPC.insuredMembers[12] = v;
                                    break;
                                case "AU":
                                    pPC.insuredMembers[13] = v;
                                    break;
                                case "KID1":
                                    pPC.insuredMembers[14] = v;
                                    break;
                                case "KID2":
                                    pPC.insuredMembers[15] = v;
                                    break;
                                case "KID3":
                                    pPC.insuredMembers[16] = v;
                                    break;
                                case "KID4":
                                    pPC.insuredMembers[17] = v;
                                    break;
                                case "DU":
                                    pPC.insuredMembers[18] = v;
                                    break;
                                case "SO":
                                    pPC.insuredMembers[19] = v;
                                    break; 
                                default:
                                    break;
                            }
                        });
                        pPC.insuredMembers = pPC.insuredMembers.filter(Boolean);
                        getInsuredMemberQuestion(pPC.insuredMembers[0]);
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
                }, function(err) {
                });

        }

    /*  End of fetching insured members for health lifestyle questions */


    /* To Fetch Insured Members */

    var reqData = $rootScope.encrypt({
        "ReferenceNumber": sessionStorage.getItem('rid')
    });
        aS.postData(ABHI_CONFIG.apiUrl+"GEN/GetInsuredMembers",{
            "_data": reqData,
            },true,{
                headers:{
                    'Content-Type': 'application/json'
                }
            })
                .then(function(data){
                    var data = JSON.parse($rootScope.decrypt(data._resp))
                    aS.triggerSokrati(); /* Triggering Sokrati */
                    if(data.ResponseCode == 1){
                        $rootScope.showLoader = true;
                        pPC.allInsuredMembers = data.ResponseData.ProductInsuredDetail;
                        for(var i = 0 ; i < pPC.allInsuredMembers.length ; i++){
                            if(pPC.allInsuredMembers[i].ProductCode == 'ST'){
                                pPC.stProductAvail = true;
                            }
                        }
                        fetchMemberedArrayList();
                    }else{
                        $rootScope.alertData = {
                            "modalClass": "regular-alert",
                            "modalHeader": "Error",
                            "modalBodyText": "Some error ocurred.",
                            "showCancelBtn": false,
                            "modalSuccessText" : "Ok",
                            "showAlertModal": true
                        }
                    }
                },function(err){

                });

    /* End of fetching insured members */


    /* Function to split date */

        function dateSplit(date,revParam,actParam,day,month,year){
            if(date == null || date == "" || date == undefined){
                return false;
            }
            var userDateOfBirth = date.split('-');
            if(userDateOfBirth.length == 3){
               pPC[day] = (userDateOfBirth[2].length < 2) ? "0"+userDateOfBirth[2]:userDateOfBirth[2];;
               pPC[month] = (userDateOfBirth[1].length < 2) ? "0"+userDateOfBirth[1]:userDateOfBirth[1];
               pPC[year] = userDateOfBirth[0];
               pPC[actParam] = pPC[day]+"-"+pPC[month]+"-"+userDateOfBirth[0];
               pPC[revParam] = userDateOfBirth[0]+"-"+pPC[month]+"-"+pPC[day];
            }
        }

    /* End of function to split date */


    /* Populate post payment answers */

        function populateQuestionsAnswers(questionObj){
            pPC.exactDiagnosis = questionObj.EXACT_DIAGNOSIS_VALUE ? questionObj.EXACT_DIAGNOSIS_VALUE : questionObj.ExactDiagnosis;
            var subDate = questionObj.EXACT_DIAGNOSIS_DATE ? questionObj.EXACT_DIAGNOSIS_DATE : questionObj.DateOfDiagnosis;
            dateSplit(subDate,'DOBbs','DOB','day','month','year');
            pPC.treatmentDetails = questionObj.TREATMENT_DETAIL ? questionObj.TREATMENT_DETAIL : questionObj.DetailsOfTreatment;
            var subDate2 = questionObj.LAST_CONSULT_DATE ? questionObj.LAST_CONSULT_DATE : questionObj.LastConsultationDate;
            dateSplit(subDate2,'lastDOBbs','lastDOB','lastday','lastmonth','lastyear');      
        }

    /* End of post payment answers */


    /* To populate platinum question answers */

        function populatePlatinumQuestionsAnswers(){
           /* dateSplit(pPC.postPaymentQuestions.PLMemberPPQuestions.FIRST_DIAGNOSED_DIABITIES,'DIAGNOSED_DATEbs','DIAGNOSED_DATE','firstdiagnosedday','firstdiagnosedmonth','firstdiagnosedyear');
            if(pPC.postPaymentQuestions.PLMemberPPQuestions.INSULIN_DATE.length > 7){
                dateSplit(pPC.postPaymentQuestions.PLMemberPPQuestions.INSULIN_DATE,'INSULIN_DATEbs','INSULIN_DATE','firstInsulinday','firstInsulinmonth','firstInsulinyear');
                pPC.isInsulin = 'Y';
            }
            dateSplit(pPC.postPaymentQuestions.PLMemberPPQuestions.BLOOD_PRESSER_DATE,'BP_Datebs','BP_Date','firstBpDay','firstBpMonth','firstBpYear');
            dateSplit(pPC.postPaymentQuestions.PLMemberPPQuestions.History_Asthma_DATE,'History_Asthma_DATEbs','History_Asthma_DATE','firstAsthamaDay','firstAsthamaMonth','firstAsthamaYear');
            dateSplit(pPC.postPaymentQuestions.PLMemberPPQuestions.HIGH_CHOLESTEROL_DATE,'HIGH_CHOLESTEROL_DATEbs','HIGH_CHOLESTEROL_DATE','firsthCday','firsthCmonth','firsthCyear');*/
        }

    /* En dof populating platinum question answers */


    /* To check active member */

        function checkActiveMember(member){
            for(var i = 0;i < pPC.allInsuredMembers.length; i++){
                for(var j = 0;j<pPC.allInsuredMembers[i].InsuredMembers.length;j++){
                    if(pPC.allInsuredMembers[i].InsuredMembers[j].RelationType == member.RelationType){
                        pPC[pPC.allInsuredMembers[i].ProductCode] = true;
                        break;
                    }
                }
            }
        }

    /* End of check active member */

    /* To populate Arogya Sanjeevani Questions */

    var asarray = [
        {
            "Key" : "AccidentalInjury",
            "Val" : false,
            "Name": "Accidental Injury",
            "KeyDetails" : "AccidentalInjury_details" 
        },
        {
            "Key" : "Anaemia",
            "Val" : false,
            "Name": "Anaemia",
            "KeyDetails" : "Anaemia_details" 
        },
        {
            "Key" : "Aneurysm",
            "Val" : false,
            "Name": "Aneurysm",
            "KeyDetails" : "Aneurysm_details" 
        },
        {
            "Key" : "AnyFormOfHeartDisease",
            "Val" : false,
            "Name": "Any Form Of Heart Disease",
            "KeyDetails" : "AnyFormOfHeartDisease_details" 
        },
        {
            "Key" : "AnyRegularMedication",
            "Val" : false,
            "Name": "Any Regular Medication",
            "KeyDetails" : "AnyRegularMedication_details" 
        },
        {
            "Key" : "BirthDefect",
            "Val" : false,
            "Name": "Birth Defect",
            "KeyDetails" : "BirthDefect_details" 
        },
        {
            "Key" : "Cancer",
            "Val" : false,
            "Name": "Cancer",
            "KeyDetails": "Cancer_details"
        },
        {
            "Key" : "DateOfDelivery",
            "Val" : false,
            "Name": "Date Of Delivery",
            "KeyDetails" : "DateOfDelivery_details" 
        },
        {
            "Key" : "DiabetesHighBloodPressure",
            "Val" : false,
            "Name": "Diabetes High Blood Pressure",
            "KeyDetails" : "DiabetesHighBloodPressure_details"
        },
        {
            "Key" : "DiabeticFoot",
            "Val" : false,
            "Name": "Diabetic Foot",
            "KeyDetails" : "DiabeticFoot_details" 
        },
        {
            "Key" : "DiseaseOfEye",
            "Val" : false,
            "Name": "Disease Of Eye",
            "KeyDetails" : "DiseaseOfEye_details" 
        },
        {
            "Key" : "DiseaseOfKidney",
            "Val" : false,
            "Name": "Disease Of Kidney",
            "KeyDetails" : "DiseaseOfKidney_details" 
        },
        {
            "Key" : "DiseaseOfTheBrain",
            "Val" : false,
            "Name": "Disease of the Brain",
            "KeyDetails" : "DiseaseOfTheBrain_details" 
        },
        {
            "Key" : "EmploymentHealthCheck",
            "Val" : false,
            "Name": "Employment Health Check",
            "KeyDetails" : "EmploymentHealthCheck_details" 
        },
        {
            "Key" : "HIV",
            "Val" : false,
            "Name": "HIV",
            "KeyDetails" : "HIV_details" 
        },
        // {
        //     "Key" : "Insured",
        //     "Val" : false,
        //     "Name": "Insured",
        //     "KeyDetails" : "Insured_details" 
        // },
        {
            "Key" : "MalignantHypertension",
            "Val" : false,
            "Name": "Malignant Hypertension",
            "KeyDetails" : "MalignantHypertension_details" 
        },
        {
            "Key" : "MentalIllness",
            "Val" : false,
            "Name": "MentalIllness",
            "KeyDetails" : "MentalIllness_details" 
        },
        {
            "Key" : "Nephropathy",
            "Val" : false,
            "Name": "Nephropathy",
            "KeyDetails" : "Nephropathy_details" 
        },
        {
            "Key" : "Paralysis",
            "Val" : false,
            "Name": "Paralysis",
            "KeyDetails" : "Paralysis_details" 
        },
        {
            "Key" : "PeripheralVascular",
            "Val" : false,
            "Name": "Peripheral Vascular",
            "KeyDetails" : "PeripheralVascular_details" 
        },
        {
            "Key" : "Pheochromocytoma",
            "Val" : false,
            "Name": "Pheochromocytoma",
            "KeyDetails" : "Pheochromocytoma_details" 
        },
        {
            "Key" : "Polio",
            "Val" : false,
            "Name": "Polio",
            "KeyDetails" : "Polio_details" 
        },
        {
            "Key" : "PulmonaryDisease",
            "Val" : false,
            "Name": "Pulmonary Disease",
            "KeyDetails" : "PulmonaryDisease_details" 
        },
        {
            "Key" : "RenalArtery",
            "Val" : false,
            "Name": "Renal Artery",
            "KeyDetails" : "RenalArtery_details" 
        },
        {
            "Key" : "Retinopathy",
            "Val" : false,
            "Name": "Retinopathy",
            "KeyDetails" : "Retinopathy_details" 
        },
        {
            "Key" : "Stroke",
            "Val" : false,
            "Name": "Stroke",
            "KeyDetails" : "Stroke_details" 
        },
        // {
        //     "Key" : "Suffering",
        //     "Val" : false,
        //     "Name": "Suffering",
        //     "KeyDetails" : "Suffering_details" 
        // },
        {
            "Key" : "Surgery",
            "Val" : false,
            "Name": "Surgery",
            "KeyDetails" : "Surgery_details" 
        },
        {
            "Key" : "TB",
            "Val" : false,
            "Name": "TB",
            "KeyDetails" : "TB_details" 
        },
        //{
        //    "Key" : "UnderGoneAnyInvestigation",
        //    "Val" : false,
        //    "Name": "Under Gone Any Investigation",
        //    "KeyDetails" : "UnderGoneAnyInvestigation_details" 
        //},
    ]
        
    function populateASQuestion(questionArray){
        pPC.asQuestionarray = [];
        for(var i = 0 ; i < asarray.length ; i++){
            if(questionArray[asarray[i].Key] == 'Y')
                pPC.asQuestionarray.push({
                    "Key" : asarray[i].Key,
                    "Val":  true,
                    "Name": asarray[i].Name,
                    "DateOfDaignostic" : "",
                    "LastConsultationDate": "",
                    "Details":"",
                    "KeyDetails": asarray[i].KeyDetails
                })
        }
    }
    /* End of To populate Arogya Sanjeevani Questions */


    /* To fetch get insured members questions */

        function getInsuredMemberQuestion(insuredMember) {
            pPC.activeMember = insuredMember.RelationType;
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPostPaymentMemberQuestions", {
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "RelationType": insuredMember.RelationType,
                    "RelationWithProposer": insuredMember.RelationWithProposer
                }, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        pPC.postPaymentQuestions = data.ResponseData;
                        checkActiveMember(insuredMember);
                        if(pPC.postPaymentQuestions.RFBMemberPPQuestions == null){
                            pPC.PA = false;
                            pPC.CI = false;
                            pPC.CS = false;
                        }
                        if(pPC.PA || pPC.CI || pPC.CS){
                            pPC.gtagLabel = "rfb"
                            populateQuestionsAnswers(pPC.postPaymentQuestions.RFBMemberPPQuestions);
                        }
                        if(pPC.DI){
                            pPC.gtagLabel = "DI"
                            populateQuestionsAnswers(pPC.postPaymentQuestions.DIMemberPPQuestions);
                        }
                        if(pPC.PL){
                            pPC.gtagLabel = "PL"
                            populateQuestionsAnswers(pPC.postPaymentQuestions.PLMemberPPQuestions);
                            populatePlatinumQuestionsAnswers();
                        }
                        if(pPC.FIT){
                            pPC.gtagLabel = "FIT"
                            populateQuestionsAnswers(pPC.postPaymentQuestions.FITMemberPPQuestions);
                            populatePlatinumQuestionsAnswers();
                        }
                        if(pPC.AC){
                            pPC.gtagLabel = "AC"
                            populateQuestionsAnswers(pPC.postPaymentQuestions.ACMemberPPQuestions);
                            //populatePlatinumQuestionsAnswers();
                        }
                        if(pPC.AS){
                            populateASQuestion(pPC.postPaymentQuestions.ASMemberPPQuestions)
                        }
                        if((pPC.DI && (pPC.PA || pPC.CI || pPC.CS)) || (pPC.PA || pPC.CI || pPC.CS) && pPC.PL || (pPC.PA || pPC.CI || pPC.CS) && pPC.AC)
                        {
                            pPC.gtagLabel = "cross-sell"
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
                }, function(err) {
                });
        }

    /* End of fetching get insured members questions */


    /* To change member from tab */

        pPC.changeMember = function(index){
            memberCount = index;
            getInsuredMemberQuestion(pPC.insuredMembers[index]);
        }

    /* End of changing member from tab */


    /* Formation of DOB */

        pPC.changeDate = function(day,month,year,dateParam,relatedTo) {
            allDates[dateParam+"slash"] = {
                "date": year+"/"+month+"/"+day,
                "relatedTo": relatedTo
            };
            pPC[dateParam] = day+"-"+month+"-"+year;
            pPC[dateParam+"bs"] = year+"-"+month+"-"+day;
        }

    /* End of formation of DOB */
    // $scope.parseInt = parseInt;

    /* To reset form */

        function resetForm(){
            pPC.exactDiagnosis = "";
            pPC.DOB = "";
            pPC.DOBbs = "";
            pPC.lastDOB = "";
            pPC.lastDOBbs = "";
            pPC.day = "";
            pPC.month = "";
            pPC.year = "";
            pPC.lastday = "";
            pPC.lastmonth = "";
            pPC.lastyear = "";
            pPC.treatmentDetails = "";
            pPC.firstdiagnosedday = "";
            pPC.firstdiagnosedmonth = "";
            pPC.firstdiagnosedyear = "";
            pPC.DIAGNOSED_DATE = "";
            pPC.DIAGNOSED_DATEbs = "";
            pPC.firstInsulinday = "";
            pPC.firstInsulinmonth = "";
            pPC.firstInsulinyear = "";
            pPC.INSULIN_DATE = "";
            pPC.INSULIN_DATEbs = "";
            pPC.firstBpDay = "";
            pPC.firstBpMonth = "";
            pPC.firstBpYear = "";
            pPC.BP_Date = "";
            pPC.BP_Datebs = "";
            pPC.firstAsthamaDay = "";
            pPC.firstAsthamaMonth = "";
            pPC.firstAsthamaYear = "";
            pPC.History_Asthma_DATE = "";
            pPC.History_Asthma_DATEbs = "";
            pPC.firsthCday = "";
            pPC.firsthCmonth = "";
            pPC.firsthCyear = "";
            pPC.HIGH_CHOLESTEROL_DATE = "";
            pPC.HIGH_CHOLESTEROL_DATEbs = "";
        }

    /* End of resetting form */


    /* Saving post payment answers */

        function saveHealthMedicalQuestions(queObj){
            pPC.postPaymentQuestions[queObj].ExactDiagnosis = pPC.exactDiagnosis;
            pPC.postPaymentQuestions[queObj].DateOfDiagnosis = pPC.DOBbs;
            pPC.postPaymentQuestions[queObj].DetailsOfTreatment = pPC.treatmentDetails;
            pPC.postPaymentQuestions[queObj].LastConsultationDate = pPC.lastDOBbs;
            pPC.postPaymentQuestions[queObj].EXACT_DIAGNOSIS_VALUE = pPC.exactDiagnosis;
            pPC.postPaymentQuestions[queObj].EXACT_DIAGNOSIS_DATE = pPC.DOBbs;
            pPC.postPaymentQuestions[queObj].TREATMENT_DETAIL = pPC.treatmentDetails;
            pPC.postPaymentQuestions[queObj].LAST_CONSULT_DATE = pPC.lastDOBbs;
            /*if(pPC.PL){
                pPC.postPaymentQuestions[queObj].DateOfDiagnosis = pPC.DOB;
                pPC.postPaymentQuestions[queObj].LastConsultationDate = pPC.lastDOB;
                 pPC.postPaymentQuestions[queObj].LAST_CONSULT_DATE = pPC.lastDOB;
                  pPC.postPaymentQuestions[queObj].EXACT_DIAGNOSIS_DATE = pPC.DOB;
            }*/
        }

    /* End of saving payment answers */

    /* Saving post payment answers for Active Care */

        function saveHealthMedicalQuestionsAC(queObj){
            pPC.postPaymentQuestions[queObj].ExactDiagnosis = pPC.exactDiagnosis;
            pPC.postPaymentQuestions[queObj].DateOfDiagnosis = pPC.DOBbs;
            pPC.postPaymentQuestions[queObj].DetailsOfTreatment = pPC.treatmentDetails;
            pPC.postPaymentQuestions[queObj].LastConsultationDate = pPC.lastDOBbs;
        }

    /* End of saving payment answers for Active Care*/


    /* To save platinum post payment questions */

        function savePlatinumPostPaymentQuestions(){
            pPC.postPaymentQuestions.PLMemberPPQuestions.INSULIN_DATE = pPC.INSULIN_DATEbs;
            pPC.postPaymentQuestions.PLMemberPPQuestions.FIRST_DIAGNOSED_DIABITIES = pPC.DIAGNOSED_DATEbs;
            pPC.postPaymentQuestions.PLMemberPPQuestions.BLOOD_PRESSER_DATE = pPC.BP_Datebs;
            pPC.postPaymentQuestions.PLMemberPPQuestions.History_Asthma_DATE = pPC.History_Asthma_DATEbs;
            pPC.postPaymentQuestions.PLMemberPPQuestions.HIGH_CHOLESTEROL_DATE = pPC.HIGH_CHOLESTEROL_DATEbs;
        }

    /* End of saving post payment questions */

    /* To save Arogya Sanjeevani Questions */

    function saveHealthMedicalQuestionsAS(queObj){
        for(var i = 0 ; i < pPC.asQuestionarray.length; i++){
            if(pPC.postPaymentQuestions.ASMemberPPQuestions[pPC.asQuestionarray[i].Key] == 'Y'){
                pPC.postPaymentQuestions.ASMemberPPQuestions[pPC.asQuestionarray[i].KeyDetails] = 'diagnosisDate:'+pPC.asQuestionarray[i].DateOfDaignostic+';consultationDate:'+pPC.asQuestionarray[i].LastConsultationDate+';treatmentDetails:'+pPC.asQuestionarray[i].Details;
            }
        }
    }
    
    /* End of To save Arogya Sanjeevani Questions */

    /* Function to validate all dates */

        function dateValidations(){
            var alertMessage = "<ul>";
            angular.forEach(allDates,function(v,i){
                if(new Date(v.date) > new Date()){
                    alertMessage = alertMessage + "<li>"+v.relatedTo+" should not be greater than current date.</li>";
                }
            });
            if(!angular.isUndefined(allDates.DOBslash) && (!angular.isUndefined(allDates.lastDOBslash))){
                if(new Date(allDates.lastDOBslash.date) < new Date(allDates.DOBslash.date)){
                    alertMessage = alertMessage + "<li>"+allDates.DOBslash.relatedTo+" should not be greater than "+allDates.lastDOBslash.relatedTo+".</li>";
                }
            }
            if(!angular.isUndefined(allDates.DIAGNOSED_DATEslash) && (!angular.isUndefined(allDates.INSULIN_DATEslash))){
                if(new Date(allDates.INSULIN_DATEslash.date) < new Date(allDates.DIAGNOSED_DATEslash.date)){
                    alertMessage = alertMessage + "<li>"+allDates.DIAGNOSED_DATEslash.relatedTo+" should not be greater than "+allDates.INSULIN_DATEslash.relatedTo+".</li>";
                }
            }
            alertMessage = alertMessage + "</ul>";
            return alertMessage;
        }

    /* End of function to validate to all dates */


    /* Submit post payment questions */

        pPC.savePostPaymentQuestions = function(event,validStatus){
            pPC.showErrors = false;
            if(!validStatus){
                pPC.showErrors = true;
                $("html, body").animate({ scrollTop: $("#health-lifestyle-member-details").offset().top - 135 }, 300);
                $rootScope.alertConfiguration('E',"Please fill valid data", "valid_data_alert");
                return false;
            }
            var actText = angular.copy(event.target.innerHTML);
            event.target.innerText = "Saving...";
            event.target.disabled = true;
            if(pPC.PA || pPC.CI || pPC.CS){
                saveHealthMedicalQuestions('RFBMemberPPQuestions');
            }
            if(pPC.DI){
                saveHealthMedicalQuestions('DIMemberPPQuestions');
            }
            if(pPC.stProductAvail){
                saveHealthMedicalQuestions('STMemberPPQuestions');
            }
            if(pPC.AC){
                saveHealthMedicalQuestionsAC('ACMemberPPQuestions');
            }
            if(pPC.PL){
                saveHealthMedicalQuestions('PLMemberPPQuestions');
                //savePlatinumPostPaymentQuestions();
            }
            if(pPC.FIT){
                saveHealthMedicalQuestions('FITMemberPPQuestions');
                //savePlatinumPostPaymentQuestions();
            }
            if(pPC.AS){
                saveHealthMedicalQuestionsAS('ASMemberPPQuestions');
            }
            if(dateValidations() != "<ul></ul>"){
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Errors",
                    "modalBodyText": dateValidations(),
                    "showCancelBtn": false,
                    "modalSuccessText": "OK",
                    "modalCancelText": "No",
                    "showAlertModal": true
                }
                event.target.innerHTML = actText;
                event.target.disabled = false;
                return false;
            }
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdatePostPaymentMemberQuestions", pPC.postPaymentQuestions, false, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        if (pPC.insuredMembers.length - 1 > memberCount) {
                            event.target.innerHTML = actText;
                            event.target.disabled = false;
                            memberCount++;
                            resetForm();
                            getInsuredMemberQuestion(pPC.insuredMembers[memberCount]);
                            $("html, body").animate({ scrollTop: $("#health-lifestyle-member-details").offset().top - 135 }, 300);
                        }else{
                            if($location.$$url == "/cross-sell-post-payment"){
                                 $location.url('cross-sell-thank-you');
                            }
                            else if(pPC.PA || pPC.CI || pPC.CS){
                                $location.url('rfb-thank-you');
                            }else if(pPC.DI){
                                $location.url('diamond-thank-you');
                            }else if(pPC.AC){
                                $location.url('activ-care-thank-you');
                            }else if(pPC.AS){
                                $location.url('arogya-sanjeevani-thank-you');
                            }else{
                                $location.url('platinum-thank-you');
                            }
                        }
                    } else {
                        event.target.innerHTML = actText;
                        event.target.disabled = false;
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
                }, function(err) {
                });
        }

    /* End of submit post payment questions */

}]);

/* End of Post Payment Controller */
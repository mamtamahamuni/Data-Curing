var plaApp = angular.module("platinumQuote", []);

plaApp.controller("platinumQuote", ['$rootScope', 'appService', 'ABHI_CONFIG', '$filter', '$timeout', '$location', '$route', function($rootScope, appService, ABHI_CONFIG, $filter, $timeout, $location, $route) {

    /* Data initialization */

        var plA = this
        var aS = appService;
        plA.hideSubmitButton = true;
        var premiumVal = 0;
        plA.productSelctedInCross = "PL"
        plA.productType = "platinum";
        plA.planName = "platinum";

    /* End of data initialization */


    /* To fetch sum insured data */

        aS.getData("assets/data/sum-insured.json", "", false, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(data) {
                if (data.ResponseCode == 1) {
                    plA.SumInsuredList = data.ResponseData;
                } else {

                }
            }, function(err) {

            })

    /* End of fetching sum insured */


    /* To trigger pixel Code */

        var pixelCode = "<img src='http://www.intellectads.co.in/track/conversion.asp?cid=1150&conversionType=1&key="+sessionStorage.getItem('leadId')+"&opt1=&opt2=&opt3=' height='1' width='1' />";
        pixelCode += "<img src='//ad.admitad.com/r?campaign_code=f01707dad6&action_code=1&payment_type=lead&response_type=img&uid=&tariff_code=1&order_id="+sessionStorage.getItem('leadId')+"&position_id=&currency_code=&position_count=&price=&quantity=&product_id=' width='1' height='1' alt=''>";
        pixelCode += "<iframe src='https://adboulevard.go2cloud.org/aff_l?offer_id=278&adv_sub="+sessionStorage.getItem('leadId')+"' scrolling='no' frameborder='0' width='1' height='1'></iframe>";
        pixelCode += "<img src='https://adboulevard.go2cloud.org/aff_l?offer_id=278&adv_sub="+sessionStorage.getItem('leadId')+"' width='1' height='1' />";
        pixelCode += "<iframe src='https://adclickzone.go2cloud.org/aff_l?offer_id=496&adv_sub="+sessionStorage.getItem('leadId')+"' scrolling='no' frameborder='0' width='1' height='1'></iframe>";
        pixelCode += "<iframe src='https://apoxymedia.net/p.ashx?o=74&e=8&t="+sessionStorage.getItem('leadId')+"' height='1' width='1' frameborder='0'></iframe>";
        pixelCode += "<img src='https://opicle.go2cloud.org/aff_l?offer_id=5694&adv_sub="+sessionStorage.getItem('leadId')+"' width='1' height='1' />";
        $(".cross-sell-bg").append(pixelCode);

    /* End of triggering pixel code */


    /* To fetch Quote details */

        function fetchQuoteDetails(flag) {
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetQuoteDetails", {
                    "ReferenceNumber": sessionStorage.getItem('rid')
                }, flag, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    aS.triggerSokrati(); /* Triggering Sokrati */
                    var data = JSON.parse($rootScope.decrypt(data._resp))
                    if (data.ResponseCode == 1) {
                        plA.platinumQuoteDetails = data.ResponseData;
                         $rootScope.leminiskObj =  data.ResponseData
                            $rootScope.lemniskCodeExcute();
                        plA.PremiumDetail = plA.platinumQuoteDetails.PremiumDetail
                        angular.forEach(plA.PremiumDetail.ProductPremium ,function(v, i){
                            if(parseInt(v.Premium) <= 0 ){
                                plA.hideSubmitButton = false;
                            }
                        })  
                        plA.fetchInsuredMembers()
                        plA.appendedPlanName = plA.platinumQuoteDetails.PlatinumQuote.PlanName.toLowerCase();
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
                }, function(err) {

                })
        }

        fetchQuoteDetails(true);

    /* End of fetching quote details */


    /* To calculate premium */

        plA.calculatePremium = function() {
            delete plA.PremiumDetail;
            if (angular.isUndefined(plA.platinumQuoteDetails)) {
                var piPreminumObj = {
                    "Platinum": {},
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "Savings": true
                }
            }else {
                var piPreminumObj = {
                    "Platinum": {
                        "RoomType": plA.platinumQuoteDetails.PlatinumQuote.RoomType,
                        "SI": plA.platinumQuoteDetails.PlatinumQuote.SI,
                        "Zone": plA.platinumQuoteDetails.PlatinumQuote.Zone
                    },
                    "ReferenceNumber": sessionStorage.getItem('rid'),
                    "Savings": true
                }
            }
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/GetPremium", piPreminumObj, false, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        plA.PremiumDetail = data.ResponseData;
                        plA.PremiumDetail.TotalPremium = 0;
                         angular.forEach(plA.PremiumDetail.ProductPremium ,function(v, i){
                            if(parseInt(v.Premium) <= 0 ){
                                plA.hideSubmitButton = false;
                            }
                        })
                        plA.savingForTwoYears = data.ResponseData.TenureSavings.TotalTwoYearSaving;
                        plA.savingForThreeYears = data.ResponseData.TenureSavings.TotalThreeYearSaving;
                        if(!angular.isUndefined(plA.CSPremium)){
                            plA.fetchPremiumsSecondary();
                        }
                        for(var i = 0;i<plA.PremiumDetail.ProductPremium.length;i++){
                            plA.PremiumDetail.TotalPremium = parseInt(plA.PremiumDetail.TotalPremium) + parseInt(plA.PremiumDetail.ProductPremium[i].Premium);
                            if(plA.PremiumDetail.ProductPremium[i].ProductCode == 'PA'){
                                plA.paActPremium = plA.PremiumDetail.ProductPremium[i].Premium;
                            }else if(plA.PremiumDetail.ProductPremium[i].ProductCode == 'CI'){
                                plA.ciActPremium = plA.PremiumDetail.ProductPremium[i].Premium;
                            }else if(plA.PremiumDetail.ProductPremium[i].ProductCode == 'CS'){
                                plA.csActPremium = plA.PremiumDetail.ProductPremium[i].Premium;
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
                }, function(err) {

                });
        }

        plA.calculatePremium();

    /* End of calculating premium */


    /* Calculate premium based on action on UI */

        plA.calculatePlatPremium = function(SI) {
            plA.platinumQuoteDetails.PlatinumQuote.SI = SI;
            if (plA.platinumQuoteDetails.PlatinumQuote.SI < 800000 && plA.platinumQuoteDetails.PlatinumQuote.RoomType == "any_enhanced") {
                plA.platinumQuoteDetails.PlatinumQuote.RoomType = "single";
            }
            if (plA.platinumQuoteDetails.PlatinumQuote.SI > 499999 && (plA.platinumQuoteDetails.PlatinumQuote.RoomType == "shared_enhanced" || plA.platinumQuoteDetails.PlatinumQuote.RoomType == "shared_essential")) {
                plA.platinumQuoteDetails.PlatinumQuote.RoomType = "single";
            }
            plA.calculatePremium();
        }

    /* End of calculate premium based on action on UI */


    /* To change tenure */

        plA.changeTenure = function() {
            $rootScope.callGtag('quote','click-radio','platinum-quote_'+plA.platinumQuoteDetails.PlatinumQuote.PlanName+'_tenure-['+plA.platinumQuoteDetails.PlatinumQuote.Tenure+']');
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateTenure", {
                    "Tenure": plA.platinumQuoteDetails.PlatinumQuote.Tenure,
                    "ReferenceNumber": sessionStorage.getItem('rid')
                }, true, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(data) {
                    if (data.ResponseCode == 1) {
                        plA.calculatePremium();
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

    /* End of changing tenure */


    /* Check plan name */

        plA.matchRoomTypeValue = function(val) {
            if (!angular.isUndefined(plA.platinumQuoteDetails)) {
                return plA.platinumQuoteDetails.PlatinumQuote.RoomType == val + "" + plA.appendedPlanName;
            }
        }

    /* End of checking plan name */


    /* To save platinum quote */

        plA.submitPlatinumQuote = function(event) {
            event.target.disabled = true;
            event.target.innerText = "Proceeding...";

            var lemeiskData   = {
                                "PLUpdateQuote": {
                                   "preminumObj": plA.PremiumDetail.TotalPremium,
                                    "RoomType": plA.platinumQuoteDetails.PlatinumQuote.RoomType,
                                    "SI": plA.platinumQuoteDetails.PlatinumQuote.SI,
                                    "Zone": plA.platinumQuoteDetails.PlatinumQuote.Zone,
                                    "memberArray": plA.membersDetails,
                                },
                                "ReferenceNumber": sessionStorage.getItem('rid')
                            }
            
            $rootScope.leminiskObj =  lemeiskData
            
            $rootScope.lemniskCodeExcute($location.$$path);

            
            aS.postData(ABHI_CONFIG.apiUrl + "GEN/UpdateQuoteDetails", {
                "PLUpdateQuote": {
                    "RoomType": plA.platinumQuoteDetails.PlatinumQuote.RoomType,
                    "SI": plA.platinumQuoteDetails.PlatinumQuote.SI,
                    "Zone": plA.platinumQuoteDetails.PlatinumQuote.Zone
                },
                "ReferenceNumber": sessionStorage.getItem('rid')
            }, true, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(function(response) {
                event.target.disabled = false;
                event.target.innerText = "Proceed";
                if (response.ResponseCode == 1) {
                    if (plA.crossSell) {
                       if(plA.CI == 'Y'){
                            plA.productSelctedInCross = plA.productSelctedInCross+'-CI'
                        }if(plA.PA == 'Y'){
                             plA.productSelctedInCross = plA.productSelctedInCross+'-PA'
                        }if(plA.CS == 'Y'){
                             plA.productSelctedInCross = plA.productSelctedInCross+'-CS'
                        }
                        sessionStorage.setItem('productSelctedInCross' ,  plA.productSelctedInCross)
                        $location.url('cross-sell-proposer-details?products='+ plA.productSelctedInCross);
                    } else {
                        $location.url('platinum-proposer-details');
                    }
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": "Some error occurred!",
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                    }
                }
            }, function(err) {
                event.target.disabled = false;
                event.target.innerText = "Proceed";
            });
        }

    /* End of saving platinum quote */

}]);
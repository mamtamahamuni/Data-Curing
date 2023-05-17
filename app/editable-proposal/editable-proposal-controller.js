var acApp = angular.module("editableProposalApp", []);

acApp.controller("editableProposal", ['$scope', '$rootScope', 'ABHI_CONFIG', 'appService', '$filter', '$timeout', '$location', '$window', '$q', '$interval', function ($scope, $rootScope, ABHI_CONFIG, appService, $filter, $timeout, $location, $window, $q, $interval) {

    /* Data Inilization */
    var sampleObject = {
        name: 'angularjs',
        value: 1
    };

    /* declaration of required variable  */

    var ePF = this;
    var aS = appService;
    ePF.epfDetails = {};
    var fileContentInBtoa;
    ePF.FiledownloadPAth = '';
    ePF.prouctdropdown = ['Active Secure', 'Active Assure Diamond', 'Active Health', ' Active Health - Premier', ' Arogya Sanjeevani', 'GHS', 'Active Care', 'Corona Kavach', 'Corona Rakshak'];
    // ePF.prouctdropdown = ['Active Secure', 'Active Assure Diamond', 'Active Health', ' Active Health - Premier', ' Arogya Sanjeevani', 'GHS', 'Active Care', 'Corona Kavach', 'Corona Rakshak'];
    ePF.epfDetails.selectproductType = ePF.prouctdropdown[0];
    ePF.initSlider = false;
    $('#otp-modal').modal('hide'); // hide otp modal popup
    // ePF.filUpload = {
    //  ProductName = 'Active secure',
    //  productPdfName = 'AS',
    // }
    /* declaration of required variable end  */

    ePF.newProductObj = {
        "productArrat":[{
            "ProductName" : "Activ Secure",
            "PRoductCode" : "DI",
            "productPDFPath" : "assets/editable-proposal-form-pdf/Activ-Secure_Final-Proposal-Form.pdf"
        },{
            "ProductName" : "Active Assure Diamond",
            "PRoductCode" : "RFB",
            "productPDFPath" : "assets/editable-proposal-form-pdf/Activ-Assure-Diamond-Proposal-Form.pdf"
        },{
            "ProductName" : "Active Health",
            "PRoductCode" : "PL",
            "productPDFPath" : "assets/editable-proposal-form-pdf/Activ-Health _ Proposal-Form.pdf"
        },{
            "ProductName" : "Active Health - Premier",
            "PRoductCode" : "Platinum",
            "productPDFPath" : "assets/editable-proposal-form-pdf/Activ-Health-Premier-Proposal Form_Editable.pdf"
        },{
            "ProductName" : "Arogya Sanjeevani",
            "PRoductCode" : "AS",
            "productPDFPath" : "assets/editable-proposal-form-pdf/Arogya-Sanjeevani.pdf"
        },{
            "ProductName" : "GHS",
            "PRoductCode" : "GHS",
            "productPDFPath" : "assets/editable-proposal-form-pdf/Global-Health-Secure.pdf"
        },{
            "ProductName" : "Active Care",
            "PRoductCode" : "SC",
            "productPDFPath" : "assets/editable-proposal-form-pdf/Activ-Care_Proposal-Form.pdf"
        },{
            "ProductName" : "Corona Kavach",
            "PRoductCode" : "CK",
            "productPDFPath" : "assets/editable-proposal-form-pdf/Corona-Kavach.pdf"
        },{
            "ProductName" : "Corona Rakshak",
            "PRoductCode" : "CR",
            "productPDFPath" : "assets/editable-proposal-form-pdf/Corona-Rakshak-Policy.pdf"
        }],
     
    }
    // ePF.productType =  ePF.newProductObj.productArrat[0].ProductName;

      /* To validate document file */

      $(document).ready(function(){
        $('input[type="file"]').change(function(){
            var $this =  $(this);
            var index = $this.val().lastIndexOf('.');
            var fileExtention = $this.val().substring(index, $this.val().length);
            if(fileExtention == '.pdf'){
                if($this.prop('files')[0].size >= 8388608){
                    $(this).val('');
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Alert",
                        "modalBodyText": 'File size should be less than 8 MB.',
                        "showCancelBtn": false,
                        "modalSuccessText" : "Ok",
                        "showAlertModal": true,
                        "hideCloseBtn" : true
                    }
                    $rootScope.$apply();
                }
            }else{
                $(this).val('');
                $rootScope.alertData = {
                    "modalClass": "regular-alert",
                    "modalHeader": "Alert",
                    "modalBodyText": 'Only .pdf, file formats are allowed.',
                    "showCancelBtn": false,
                    "modalSuccessText" : "Ok",
                    "showAlertModal": true,
                    "hideCloseBtn" : true
                }
                $rootScope.$apply();
            }
        });
    });

    /* End of To validate document file */
   
    /* download proposal form end */

    /* validate form  */
    ePF.validateFormDetails = function () {
        if(ePF.epfDetails.mobno == undefined){
            $rootScope.alertConfiguration('E', "Please enter your mobile number.");
            return false;
        }
        else if (ePF.epfDetails.mobno.length != 10 || (/^(\d)\1\1\1\1\1\1\1\1\1$/.test(ePF.epfDetails.mobno)) ||(!/^[6-9]\d{9}$/.test(ePF.epfDetails.mobno))){
            $rootScope.alertConfiguration('E', "Please enter your correct mobile number.");
            return false;
        }
        else if ($rootScope.ValidateBlockNo(ePF.epfDetails.mobno)) {
            mobileErrorMessage = "Please enter Valid Mobile No";
            return false;
        }
        else if(ePF.epfDetails.chkval == undefined || ePF.epfDetails.chkval == "" || ePF.epfDetails.chkval == "N"){
            $rootScope.alertConfiguration('E', "Please accept terms and condition.");
            return false;
        }
        else if (filUpload.files.length == 0) {
            $rootScope.alertConfiguration('E', "Please upload documents files");
            return false;
        }
        else if (ePF.epfDetails.selectproductType == " " || ePF.epfDetails.selectproductType == undefined) {
            $rootScope.alertConfiguration('E', "Please select product type");
            return false;
        } else {
            return true;
        }
    }
    /* validate form end */

    /* generic function to get byte code  */
    ePF.fileUploadPdf = function () {
        var defer = $q.defer(); // this a promise object
        var reader = new FileReader();
        reader.onload = function (e) {
            fileContentInBtoa = btoa(e.target.result.toString());
            defer.resolve(fileContentInBtoa);

        }
        reader.readAsBinaryString(filUpload.files[0])
        return defer.promise;
    }
    /* generic function to get byte code end */

    /* get otp  */
    ePF.getOtp = function () {
        var validateformdetails = ePF.validateFormDetails()
        if (validateformdetails) {
            // var fileContentInBtoa
            ePF.fileUploadPdf().then(function () {

                var documentObject = {
                    "MobileNo": ePF.epfDetails.mobno,
                    "FileName": filUpload.files[0].name,
                    "ByteArray": fileContentInBtoa,
                    "ProductName": ePF.epfDetails.selectproductType
                }

                aS.postData(ABHI_CONFIG.apiUrl + "GEN/GenerateOTP", documentObject, true,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                    .then(function (data) {
                        if (data.ResponseCode == 1) {
                            ePF.quoteDetails = data;
                            ePF.epfDetails.otpVal = "";
                            $('#otp-modal').modal('show');
                            sessionStorage.setItem("ReferenceNumber", ePF.quoteDetails.ResponseData.ReferenceNo);
                            ePF.numCount = 90;
                            var intervalCount = $interval(function () {
                                --ePF.numCount;
                                ePF.hideTimer = false;
                            }, 1000);
                            $timeout(function () {
                                $interval.cancel(intervalCount);
                                ePF.hideTimer = true;
                                i++;
                            }, 90000);

                        } else {
                            $rootScope.alertData = {
                                "modalClass": "regular-alert",
                                "modalHeader": "Error",
                                "modalBodyText": data.ResponseMessage,
                                "gtagPostiveFunction": "click-button, cs-quote , service-fails[GetQuoteDetails]",
                                "gtagCrossFunction": "click-button,  cs-quote ,service-fails[GetQuoteDetails]",
                                "gtagNegativeFunction": "click-button, cs-quote , service-fails[GetQuoteDetails]",
                                "showCancelBtn": false,
                                "modalSuccessText": "Ok",
                                "showAlertModal": true
                            }
                            $('#otp-modal').modal('hide');
                        }
                    }, function (err) {

                    });

            });
        }
    }
    /* get otp end */

    /* Verify Otp  */
    ePF.varifyOTP = function () {
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/FormVerifyOTP", {
            "ReferenceNumber": sessionStorage.getItem('ReferenceNumber'),
            "OTP": ePF.epfDetails.otpVal,
        }, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    ePF.verifyOtpDetail = data;
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Success",
                        "modalBodyText":  "Thank you! We are processing your document. For further communication please note your reference number" + " " + ePF.verifyOtpDetail.ResponseData.ProposalNo,
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true,
                        "positiveFunction": function(){
                            $('#otp-modal').modal('hide');
                            ePF.epfDetails.mobno = "";
                            $("#filUpload").val('');
                            $('input[name=inputchk]').removeAttr('checked');
                            ePF.epfDetails.chkval = "N";
                            
                        },	
                    }
                   
                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": data.ResponseMessage,
                        "gtagPostiveFunction": "click-button, cs-quote , service-fails[GetQuoteDetails]",
                        "gtagCrossFunction": "click-button,  cs-quote ,service-fails[GetQuoteDetails]",
                        "gtagNegativeFunction": "click-button, cs-quote , service-fails[GetQuoteDetails]",
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true
                    }
                    $('#otp-modal').modal('hide');
                }
            }, function (err) {

            });
    }
    /* Verify Otp end */

    /* resend otp */
    ePF.resendOTP = function () {
        aS.postData(ABHI_CONFIG.apiUrl + "GEN/ResendOTP", {
            "ReferenceNumber": sessionStorage.getItem('ReferenceNumber'),
            "MobileNo": ePF.epfDetails.mobno,
        }, false, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(function (data) {
                if (data.ResponseCode == 1) {
                    ePF.resendOtpDetails = data;


                } else {
                    $rootScope.alertData = {
                        "modalClass": "regular-alert",
                        "modalHeader": "Error",
                        "modalBodyText": data.ResponseMessage,
                        "gtagPostiveFunction": "click-button, cs-quote , service-fails[GetQuoteDetails]",
                        "gtagCrossFunction": "click-button,  cs-quote ,service-fails[GetQuoteDetails]",
                        "gtagNegativeFunction": "click-button, cs-quote , service-fails[GetQuoteDetails]",
                        "showCancelBtn": false,
                        "modalSuccessText": "Ok",
                        "showAlertModal": true
                    }
                    $('#otp-modal').modal('hide');
                }
            }, function (err) {

            });
    }

    /* resend otp end*/
}])
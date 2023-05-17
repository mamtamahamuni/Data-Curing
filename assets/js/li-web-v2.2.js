/*Default config */
window.litmusLiConfig = { conversation_config: { trial_settings: [], dedup_delay: { actual_delay: 5184e6, initial_delay: 864e7 }, cookie: { salt: "tEsMk{wOzGx", name: "_lmtfdk_" } }, resource_params: { api_timeout_delay: 15e3, request_url: "", app_id: "", notify_channel: "none", is_generate_short_url: false, capture_event_api: "" }, trigger_settings: { basic: {}, advanced: [] }, callback_settings: { id: "", event: "" } };

/*Define an closure*/
var ltmsLiClosure = (function() {
    /*An object that is available for all private member of this closure */
    var ltmsLiGlobalObject = {};
    ltmsLiGlobalObject.eventName;
    ltmsLiGlobalObject.isExcludeFromDedup;
    ltmsLiGlobalObject.tokenPlaceHolder = "$@*#*@$";
    ltmsLiGlobalObject.feedbackRequestUrl = "https://staging.litmusworld.com/rateus/v2/" + ltmsLiGlobalObject.tokenPlaceHolder + "?utm_source=API&utm_medium=link&utm_term=custom&utm_content=feedback&utm_campaign=get_feedback";
    ltmsLiGlobalObject.currentPage = window.location.href;
    ltmsLiGlobalObject.isExternalIframeId = false;
    ltmsLiGlobalObject.isInternalCall = false;
    ltmsLiGlobalObject.customResponseUrl;

    /*Variable to hold initilization success object. e.g. long url, short url, etc. This will return in the callback of init method.*/
    var successResponse = {};

    /*Variable that is used to reference the litmus world feedback pop up modal.*/
    var feedbackPopupDiv, feedbackPopupIframe;

    /*Variable used to contains the feedback request data. This variable is used to create feedback request url for the user*/
    var feedbackRequestData = {};

    /*Variable used to contains the XMLHttpRequest object*/
    var ltmsHttpRequestObject;

    /*Variable used to contains the parameters that will return in the callback function. Defined with default values*/
    var returnInCallback = {
        "event_name": 'unknownEvent',
        "code": 520,
        "message": 'Unknown error occurred'
    };

    /*These are the public accessible member functions of the closure.*/

    return {
        /*Method to generate feedback request url for the user(if already not generated)based on the parameters send.
            @parameters:
                userDetails - User details like - name, phone number, email address, customer id,app id,transactional data like - txn_date, city,amount etc.
                feedbackRequestUrl - environment based url API url to generate feedback request for the user.
                params  - object that contains additional information other than user details.E.g. iframe id, event name,app id.
                cb  - callback function.

            Note: params is an optional parameter.
        */
        init: function(userDetails, feedbackRequestUrl, params, cb) {
            try {
                /*Reset feedback request data for each new call.*/
                feedbackRequestData = {};
                /*Set default event name for this function*/
                ltmsLiGlobalObject.eventName = "init";

                /*Check for user details.If user details found then make the isUserDetailsSend flag true. This flag is used to prepare feedbackRequestData*/
                // ltmsLiGlobalObject.isUserDetailsSend = (userDetails) ? true : false;

                /*Set XMLHttpRequest object*/
                if (window.XMLHttpRequest) {
                    ltmsHttpRequestObject = new XMLHttpRequest()
                } else {
                    ltmsHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP")
                }

                /*Check for feedbackRequestUrl. If found then overwrite the request_url of config.*/
                window.litmusLiConfig.resource_params.request_url = (feedbackRequestUrl) ? feedbackRequestUrl : window.litmusLiConfig.resource_params.request_url;

                /*Check for params.*/
                if (params) {
                    /*Check for event name send in params or not.*/
                    params["eventName"] = (params && params.hasOwnProperty("eventName") && params['eventName']) || (params && params.hasOwnProperty("event_name") && params['event_name']);
                    ltmsLiGlobalObject.eventName = params['eventName'] || 'init';

                    /*If external iframe id send then no need to generate feedback pop up modal and make flag isExternalIframeId true*/
                    if (params.hasOwnProperty("iframe_id") && params["iframe_id"]) {
                        ltmsLiGlobalObject.isExternalIframeId = true;
                    } else {
                        _dynamicallyGenerateFeedbackPopupModal();
                    }
                    /*Check for app id*/
                    if ((params.hasOwnProperty("app_id") && params["app_id"]) || (params.hasOwnProperty("appId") && params["appId"])) {
                        window.litmusLiConfig.resource_params.app_id = params["app_id"] || params["appId"];
                    }

                    /*Check for custom response url*/
                    if (params.hasOwnProperty("custom_response_url") && params["custom_response_url"]) {
                        ltmsLiGlobalObject.customResponseUrl = params["custom_response_url"];
                    }

                    /*Check for custom message listener function*/
                    if (params.hasOwnProperty("custom_listener_function") && params["custom_listener_function"]) {
                        ltmsLiGlobalObject.customListenerFunction = params["custom_listener_function"];
                        attachCustomListenerCallBack();
                    }

                    /*Set notify channel none . So that if user's phone or email passed in user details then user will not notify again and again for the same project.
                        Changed on 14/feb/2018 - if client specify the notify channel then overwrite.
                    */
                    window.litmusLiConfig.resource_params.notify_channel = (params.hasOwnProperty("notify_channel") && params["notify_channel"]) ? (params["notify_channel"]) : "none";
                    // set flag to generate sort url.
                    window.litmusLiConfig.resource_params.is_generate_short_url = (params.hasOwnProperty("is_generate_short_url") && params["is_generate_short_url"]) ? (params["is_generate_short_url"]) : false;
                } else {
                    _dynamicallyGenerateFeedbackPopupModal();
                }

                /*Call internal functions*/
                _applyAdvancedTriggerSetting();
                _applyBasicTriggerSetting();
                _applyCallbackSettings();

                /*Set default time out delay for API*/
                window.litmusLiConfig.resource_params.api_timeout_delay = (window.litmusLiConfig.resource_params.api_timeout_delay) ? window.litmusLiConfig.resource_params.api_timeout_delay : 15000;
                window.litmusLiConfig.conversation_config.cookie.name = (window.litmusLiConfig.conversation_config.cookie.name) ? window.litmusLiConfig.conversation_config.cookie.name : "_lmtfdk";

                /*Call method to prepare feedback request data, generate request url for the data and set responses in cookie.*/
                var cookieValue = JSON.parse(_getCookie(window.litmusLiConfig.conversation_config.cookie.name));
                _prepareFeedbackRequestDataAndSetCookie(userDetails, cookieValue, function(err, success) {
                    cb(err, success);
                });
            } catch (e) {
                console.warn("something went wrong [init] " + e);
                cb(e, false);
            }
        },

        /*Method to capture feedback from user.
            @parameters:
                excludeFromDedup - flag to identify whether dedup will applied or not.
                eventName - name of the event. E.g. logout, addToCart,etc.
                params  - object that contains additional information e.g. iframe id.

            Note: eventName and params are an optional parameter.
        */
        capture: function(excludeFromDedup, eventName, params) {
            try {
                /*Set default time out delay for API*/
                window.litmusLiConfig.resource_params.api_timeout_delay = (window.litmusLiConfig.resource_params.api_timeout_delay) ? window.litmusLiConfig.resource_params.api_timeout_delay : 15000;
                window.litmusLiConfig.conversation_config.cookie.name = (window.litmusLiConfig.conversation_config.cookie.name) ? window.litmusLiConfig.conversation_config.cookie.name : "_lmtfdk";

                /*Set default event name for this function*/
                ltmsLiGlobalObject.eventName = (eventName) ? eventName : 'capture';

                /*Overwrite flag with passed flag value.*/
                ltmsLiGlobalObject.isExcludeFromDedup = (excludeFromDedup) ? excludeFromDedup : false;

                /*Check for external iframe id*/
                if (params && params.hasOwnProperty("iframe_id") && params["iframe_id"]) {
                    feedbackPopupIframe = document.getElementById(params["iframe_id"]);
                    ltmsLiGlobalObject.isExternalIframeId = true;
                }

                /*Check for custom response url*/
                if (params && params.hasOwnProperty("custom_response_url") && params["custom_response_url"]) {
                    ltmsLiGlobalObject.customResponseUrl = params["custom_response_url"];
                }

                /*Check for custom message listener function*/
                if (params.hasOwnProperty("custom_listener_function") && params["custom_listener_function"]) {
                    ltmsLiGlobalObject.customListenerFunction = params["custom_listener_function"];
                    attachCustomListenerCallBack();
                }

                var cookieValue = JSON.parse(_getCookie(window.litmusLiConfig.conversation_config.cookie.name));

                /*Check for trial number of the current app id. If trial number not present then set 0 */
                if (cookieValue && cookieValue.hasOwnProperty(feedbackRequestData["app_id"]) && !cookieValue[feedbackRequestData["app_id"]].hasOwnProperty("t")) {
                    cookieValue[feedbackRequestData["app_id"]]["t"] = 0;
                }

                if (cookieValue && cookieValue[feedbackRequestData["app_id"]] && cookieValue[feedbackRequestData["app_id"]].hasOwnProperty("r")) {
                    /*Check dedup logic or not*/
                    if (excludeFromDedup) {
                        /*No need to check dedup*/
                        cookieValue[feedbackRequestData["app_id"]]["t"] = cookieValue[feedbackRequestData["app_id"]]["t"] + 1;
                        cookieValue[feedbackRequestData["app_id"]]["l"] = new Date().getTime();
                        __showFeedbackPopup(cookieValue);
                    } else {
                        var totalTrialToSent = window.litmusLiConfig.conversation_config.trial_settings.length;
                        if (cookieValue[feedbackRequestData["app_id"]]["r"] == 0) {
                            __internalExecute(totalTrialToSent);
                        } else if (cookieValue[feedbackRequestData["app_id"]]["r"] == 1) {
                            // _responseHandler(ltmsLiGlobalObject.eventName, 208, "Feedback response already submitted.");
                            // _setIframeSrc(_getIframeSrc().replace(ltmsLiGlobalObject.tokenPlaceHolder, cookieValue[feedbackRequestData["app_id"]]["u"]));
                            _setIframeSrc(cookieValue[feedbackRequestData["app_id"]]["u"]);
                        } else if (cookieValue[feedbackRequestData["app_id"]]["r"] == 2) {
                            // response status in waiting states, make an API call

                            /*Set XMLHttpRequest object*/
                            if (window.XMLHttpRequest) {
                                ltmsHttpRequestObject = new XMLHttpRequest()
                            } else {
                                ltmsHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP")
                            }

                            var handleTimeout = setTimeout(function() {
                                if (_isHidden(feedbackPopupDiv)) {
                                    ltmsHttpRequestObject.abort();
                                    _responseHandler(ltmsLiGlobalObject.eventName, 408, "Request Timeout.Please try after some time.");
                                }
                            }, window.litmusLiConfig.resource_params.api_timeout_delay);
                            _executeAjax('POST', window.litmusLiConfig.resource_params.request_url, feedbackRequestData, ltmsHttpRequestObject, function(xmlhttp) {
                                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                                    clearTimeout(handleTimeout);
                                    var response = JSON.parse(xmlhttp.responseText);
                                    if (response && response.data && response.data.code == 0) {
                                        if (response.data.has_responded) {
                                            cookieValue[feedbackRequestData["app_id"]]["r"] = 1;
                                            cookieValue[feedbackRequestData["app_id"]]["d"] = (response.data.is_duplicate || response.data.is_duplicate == "true") ? 1 : 0;
                                            cookieValue[feedbackRequestData["app_id"]]["u"] = response.data.long_url.substr((response.data.long_url.indexOf("v2/") + 3), 24);
                                            _checkTimeDifferenceAndUpdateCookie(cookieValue);
                                            // _responseHandler(ltmsLiGlobalObject.eventName, 208, "Feedback response already submitted.");
                                            // _setIframeSrc(_getIframeSrc().replace(ltmsLiGlobalObject.tokenPlaceHolder, cookieValue[feedbackRequestData["app_id"]]["u"]));
                                            _setIframeSrc(cookieValue[feedbackRequestData["app_id"]]["u"]);
                                        } else {
                                            __internalExecute(totalTrialToSent);
                                        }
                                    } else {
                                        _responseHandler(ltmsLiGlobalObject.eventName, response.data.code, response.data.error_message);
                                    }
                                } else if (xmlhttp.readyState === 4 && (xmlhttp.status === 500 || xmlhttp.status === 501 || xmlhttp.status === 502 || xmlhttp.status === 504)) {
                                    _responseHandler(ltmsLiGlobalObject.eventName, xmlhttp.status, xmlhttp.statusText);
                                }
                            });
                        } else {
                            // unknown status
                            _responseHandler(ltmsLiGlobalObject.eventName, 406, "Unknown response status present in cookie.");
                        }
                    }
                } else {
                    // property not present in cookie
                    _responseHandler(ltmsLiGlobalObject.eventName, 417, "Required parameter is not present in cookie.Please clear cache & cookie and try again.");
                }

                /*Private method of the function capture. Internally called two other method to check trial settings.*/
                function __internalExecute(totalTrialToSent) {
                    if (totalTrialToSent > 0) {
                        var trialCheckerResponse = __checkTrialSettings();
                        if (trialCheckerResponse && trialCheckerResponse.code == 0) {
                            var trialNumbersResponse = __checkTrialNumberAndShowPopup(trialCheckerResponse.trial_setting, trialCheckerResponse.type);
                            if (trialNumbersResponse && trialNumbersResponse.code == 0) {
                                __showFeedbackPopup(cookieValue);
                            } else {
                                _responseHandler(ltmsLiGlobalObject.eventName, trialNumbersResponse.code, trialNumbersResponse.message);
                            }
                        } else {
                            _responseHandler(ltmsLiGlobalObject.eventName, trialCheckerResponse.code, trialCheckerResponse.message);
                        }
                    } else {
                        cookieValue[feedbackRequestData["app_id"]]["t"] = cookieValue[feedbackRequestData["app_id"]]["t"] + 1;
                        cookieValue[feedbackRequestData["app_id"]]["l"] = new Date().getTime();
                        __showFeedbackPopup(cookieValue)
                    }
                }
                /*Private method of the capture. It is used inside __internalExecute method.*/
                function __checkTrialSettings() {
                    if (cookieValue[feedbackRequestData["app_id"]]["t"] < totalTrialToSent) {
                        var currentTrialSetting = window.litmusLiConfig.conversation_config.trial_settings[cookieValue[feedbackRequestData["app_id"]]["t"]];
                        if (currentTrialSetting && currentTrialSetting.based_on && currentTrialSetting.based_on == "request_date") {
                            if (currentTrialSetting.trigger_time && currentTrialSetting.trigger_time.type && currentTrialSetting.trigger_time.type == "relative") {
                                return {
                                    trial_setting: currentTrialSetting,
                                    type: "cd",
                                    code: 0
                                };
                            } else if (currentTrialSetting.trigger_time && currentTrialSetting.trigger_time.type && currentTrialSetting.trigger_time.type == "absolute") {
                                currentTrialSetting.trigger_time.delay = new Date(currentTrialSetting.trigger_time.delay).getTime();
                                return {
                                    trial_setting: currentTrialSetting,
                                    type: "cd",
                                    code: 0
                                };
                            } else {
                                return {
                                    trial_setting: currentTrialSetting,
                                    message: "Invalid trials trigger type setting.Error occurred for trial number " + (cookieValue[feedbackRequestData["app_id"]]["t"] + 1),
                                    code: 111
                                }
                            }
                        } else if (currentTrialSetting && currentTrialSetting.based_on && currentTrialSetting.based_on == "last_show_date") {
                            if (currentTrialSetting.trigger_time && currentTrialSetting.trigger_time.type && currentTrialSetting.trigger_time.type == "relative") {
                                return {
                                    trial_setting: currentTrialSetting,
                                    type: "l",
                                    code: 0
                                };
                            } else if (currentTrialSetting.trigger_time && currentTrialSetting.trigger_time.type && currentTrialSetting.trigger_time.type == "absolute") {
                                currentTrialSetting.trigger_time.delay = new Date(currentTrialSetting.trigger_time.delay).getTime();
                                return {
                                    trial_setting: currentTrialSetting,
                                    type: "l",
                                    code: 0
                                };
                            } else {
                                return {
                                    message: "Invalid trials trigger type setting.Error occurred for trial number " + (cookieValue[feedbackRequestData["app_id"]]["t"] + 1),
                                    code: 114
                                }
                            }
                        } else {
                            return {
                                message: "Invalid value/type found for key 'based_on' in trial settings.Error occurred for trial number " + (cookieValue[feedbackRequestData["app_id"]]["t"] + 1),
                                code: 113
                            }
                        }
                    } else {
                        // already showed number of trials configured in config
                        return {
                            message: "Already shown number of trials configured in config",
                            code: 112
                        }
                    }
                }
                /*Private method of the capture. It is used inside __internalExecute method*/
                function __checkTrialNumberAndShowPopup(currentTrialSetting, dateType) {
                    if (cookieValue[feedbackRequestData["app_id"]]["t"] > 0) {
                        if (_getDifferenceInMilliseconds(cookieValue[feedbackRequestData["app_id"]][dateType]) >= currentTrialSetting.trigger_time.delay) {
                            cookieValue[feedbackRequestData["app_id"]]["l"] = new Date().getTime();
                            cookieValue[feedbackRequestData["app_id"]]["t"] = cookieValue[feedbackRequestData["app_id"]]["t"] + 1;
                            return {
                                code: 0
                            };
                        } else {
                            return {
                                message: "Configured delay not matched to show feedback.",
                                code: 115
                            }
                        }
                    } else {
                        if (currentTrialSetting.trigger_time.delay || currentTrialSetting.trigger_time.delay == 0) {
                            if (dateType == "l") {
                                cookieValue[feedbackRequestData["app_id"]]["l"] = 0
                            }
                            if (cookieValue[feedbackRequestData["app_id"]][dateType] >= currentTrialSetting.trigger_time.delay) {
                                cookieValue[feedbackRequestData["app_id"]]["l"] = new Date().getTime();
                                cookieValue[feedbackRequestData["app_id"]]["t"] = cookieValue[feedbackRequestData["app_id"]]["t"] + 1;
                                return {
                                    code: 0
                                };
                            } else {
                                return {
                                    message: "Configured delay not matched to show feedback.",
                                    code: 116
                                }
                            }
                        } else {
                            return {
                                message: "Configured delay not matched to show feedback.",
                                code: 117
                            }
                        }
                    }
                }
                /*Private method of the capture.Used inside capture*/
                function __showFeedbackPopup(cookieValue) {
                    try {
                        if (ltmsLiGlobalObject.isExcludeFromDedup && (ltmsLiGlobalObject.isExcludeFromDedup == true || ltmsLiGlobalObject.isExcludeFromDedup == "true")) {
                            // make an API call and get response.
                            _getApiResponseAndUpdateCookie(cookieValue);
                        } else {
                            if (cookieValue[feedbackRequestData["app_id"]].hasOwnProperty("r")) {
                                if (cookieValue[feedbackRequestData["app_id"]]["r"] == 2) {
                                    // waiting state, make an api call
                                    _getApiResponseAndUpdateCookie(cookieValue);
                                } else {
                                    if (cookieValue[feedbackRequestData["app_id"]]["r"] == 0) {
                                        _checkTimeDifferenceAndUpdateCookie(cookieValue);
                                        // not responded state                                
                                        if (!feedbackPopupIframe.hasAttribute("src")) {
                                            if (ltmsLiGlobalObject.customResponseUrl) {
                                                feedbackPopupIframe.setAttribute('src', (ltmsLiGlobalObject.customResponseUrl).replace("{{REQUEST_FEEDBACK_TOKEN}}", cookieValue[feedbackRequestData["app_id"]]["u"]));
                                            } else {
                                                feedbackPopupIframe.setAttribute('src', _getIframeSrc().replace(ltmsLiGlobalObject.tokenPlaceHolder, cookieValue[feedbackRequestData["app_id"]]["u"]));
                                            }
                                            if (feedbackPopupIframe["id"] == "ltms-feedback-popup-iframe") {
                                                feedbackPopupDiv.style.display = "block";
                                                _disableEventsWhileOverlay();
                                            }
                                        } else {
                                            _responseHandler(ltmsLiGlobalObject.eventName, 302, "Iframe src is already setted.");
                                        }
                                    } else {
                                        // _responseHandler(ltmsLiGlobalObject.eventName, 208, "Feedback response already submitted.")
                                        // _setIframeSrc(_getIframeSrc().replace(ltmsLiGlobalObject.tokenPlaceHolder, cookieValue[feedbackRequestData["app_id"]]["u"]));
                                        _setIframeSrc(cookieValue[feedbackRequestData["app_id"]]["u"]);
                                    }
                                }
                            } else {
                                _responseHandler(ltmsLiGlobalObject.eventName, 417, "Required parameter not present in cookie.Please clear catch,cookie and try again.")
                            }
                        }
                    } catch (e) {
                        throw e;
                    }
                }
            } catch (e) {
                console.warn("something went wrong [capture] " + e);
                if (e.hasOwnProperty("message") && e.message == "decryptError") {
                    _responseHandler(ltmsLiGlobalObject.eventName, 422, "Error while decrypting cookie.Please clear cache,cookie and try again.");
                } else if (e.hasOwnProperty("message") && e.message.includes("hasAttribute")) {
                    if (ltmsLiGlobalObject.isExternalIframeId) {
                        _responseHandler(ltmsLiGlobalObject.eventName, 303, "Iframe not found. Please provide valid iframe id.");
                    } else {
                        e.message = (e.message) ? e.message : "Unknown error occurred."
                        _responseHandler(ltmsLiGlobalObject.eventName, 304, e.message);
                    }
                } else {
                    e.message = (e.message) ? e.message : "Unknown error occurred.";
                    _responseHandler(ltmsLiGlobalObject.eventName, 520, e.message);
                }
            }
        },

        /*Wrapper method that call init and capture method internally.
            @parameters:
                excludeFromDedup - flag to identify whether dedup will applied or not.
                eventName - name of the event. E.g. logout, addToCart,etc.
                params  - object that contains additional information e.g. iframe id,user details, request url, event name.
                txndata - same as user details. Option to send user details separately.
            
            Note: txndata is an optional parameter.
        */
        initiateAndCapture: function(excludeFromDedup, eventName, params, txndata) {
            try {
                var userDetails, feedbackRequestUrl;

                /*Overwrite flag with passed flag value.*/
                ltmsLiGlobalObject.isExcludeFromDedup = (excludeFromDedup) ? excludeFromDedup : false;

                /*Check for params*/
                if (params) {
                    /*Check for event name send in params or not.*/
                    params["eventName"] = (params && params.hasOwnProperty("eventName") && params['eventName']) || (params && params.hasOwnProperty("event_name") && params['event_name']);
                    ltmsLiGlobalObject.eventName = params['eventName'] || 'initiateAndCapture';

                    /*Check for user details in params*/
                    if ((params.hasOwnProperty("user_details") && params["user_details"]) || (params.hasOwnProperty("userDetails") && params["userDetails"])) {
                        userDetails = params["user_details"] || params["userDetails"];
                    }

                    /*Check for feedback request url */
                    if ((params.hasOwnProperty("request_url") && params["request_url"]) || (params.hasOwnProperty("requestUrl") && params["requestUrl"])) {
                        feedbackRequestUrl = params["request_url"] || params["requestUrl"];
                    }
                } else {
                    /*Make params as object*/
                    params = {};
                }

                /*Check for event name.If event name not send then assign default event name of this method.*/
                params["eventName"] = (eventName) ? eventName : "initiateAndCapture";
                ltmsLiGlobalObject.eventName = params["eventName"];

                /*Check for transactional data (txndata). If found then overwrite userDetails.*/
                if (txndata) {
                    userDetails = txndata;
                }

                /*Set flag true to identify that init is called by this wrapper method internally*/
                ltmsLiGlobalObject.isInternalCall = true;

                /*Call init method internally.On success of init method call capture*/
                ltmsLi.init(userDetails, feedbackRequestUrl, params, function(err, success) {
                    if (err) {
                        if (err.hasOwnProperty("message") && err.message == "decryptError") {
                            _responseHandler(ltmsLiGlobalObject.eventName, 422, "Error while decrypting cookie.Please clear cache & cookie and try again.");
                        } else if (!err.hasOwnProperty("code")) {
                            err.message = (err.message) ? err.message : "Unknown error occurred.";
                            _responseHandler(ltmsLiGlobalObject.eventName, 520, err.message);
                        } else {
                            _responseHandler(ltmsLiGlobalObject.eventName, err.code, err.error_message);
                        }
                    } else {
                        ltmsLi.capture(excludeFromDedup, eventName, params);
                    }
                });
            } catch (e) {
                console.warn(" something went wrong [init and capture] : " + e);
                e.message = (e.message) ? e.message : "Unknown error occurred.";
                _responseHandler(ltmsLiGlobalObject.eventName, 520, e.message);
            }
        },

        /*Method to save events in Litmus DB.
            @parameters:
                eventType   - string - type of event e.g. view, click, open, add_to_cart, login, logout, scroll_down,
                pageName    - string - name of the page where this events are performed.
                utmSocial   - string - social tag/data if user perform. e.g. FB share, FB login, share, etc.
                options      - object - any other info/key that needs to be sent. (e.g. error_msg, connection_type, utmSocial, etc.)
                Note : for now we ahve ard coded the value of utm_campaign,utm_content,.
        */
        captureUserEvent: function(apiUrl, eventType, pageName, utmSocial, options) {
            if (eventType && (pageName || utmSocial || options)) {
                pageName = (pageName) ? (pageName) : window.location.href;
                var cookieValue = JSON.parse(_getCookie(window.litmusLiConfig.conversation_config.cookie.name));
                var feedbackToken;
                if (cookieValue) {
                    feedbackToken = cookieValue[feedbackRequestData["app_id"]]["u"];
                    if (feedbackToken) {
                        var url = apiUrl ? apiUrl : window.litmusLiConfig.resource_params.capture_event_api + "?fid=" + feedbackToken + "&eid=" + eventType;
                        for (key in options) {
                            url = url + "&" + key.toString() + "=" + options[key];
                        }
                        url = url + "&page_name" + pageName + "&utm_source=API&utm_medium=link&utm_campaign=get_feedback&utm_content=feedback&utm_term=" + "trial_" + ((cookieValue[feedbackRequestData["app_id"]]["t"]) ? (cookieValue[feedbackRequestData["app_id"]]["t"]) : 1);
                        _executeAjax('GET', url, {}, ltmsLiGlobalObject.ltmsHttpRequestObject);
                    }
                }
            }
        }
    }

    /*Method to make Ajax call. Internally called by _getApiResponseAndUpdateCookie, _prepareFeedbackRequestDataAndSetCookie and capture method
        @parameters:
            method  - name of the method. e.g. GET, POST,PUT
            url     - API url
            data    - data required for the API to make a call success.
            ltmsxmlhttp - objects to interact with servers.
            cb      - callback function.
     */
    function _executeAjax(method, url, data, ltmsxmlhttp, cb) {
        try{
            ltmsxmlhttp.open(method, url, !0);
            ltmsxmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            ltmsxmlhttp.setRequestHeader("Accept", "application/json, text/plain, */*");
            if (cb) {
                ltmsxmlhttp.onreadystatechange = function() {
                    cb(ltmsxmlhttp)
                }
            }
            try{
                ltmsxmlhttp.send(JSON.stringify(data));
                return ltmsxmlhttp
            }
            catch(err){
                console.error("Error while calling send method in _executeAjax. Error: ", err.stack)
            }
        }
        catch(error){
            console.error("Error while calling _executeAjax. Error: ", error.stack)
        }
    }


    /*Method used in init. Used to prepare feedback request data. Also get an API response for prepared data and set that response in cookie*/
    function _prepareFeedbackRequestDataAndSetCookie(userDetails, cookieValue, cb) {
        /*If user details comes with PI then no need to generate customer id.*/
        if (userDetails && (userDetails.customerId || userDetails.customer_id || userDetails.userPhone || userDetails.user_phone || userDetails.userEmail || userDetails.user_email)) {
            for (var key in userDetails) {
                if (key == "appId" || key == "app_id") {
                    feedbackRequestData["app_id"] = userDetails[key]
                } else if (key == "name") {
                    feedbackRequestData["name"] = userDetails[key]
                } else if (key == "pageId" || key == "page_id") {
                    feedbackRequestData["tag_page_id"] = userDetails[key];
                    ltmsLiGlobalObject.currentPage = userDetails[key]
                } else if (key == "userPhone" || key == "user_phone") {
                    feedbackRequestData["user_phone"] = userDetails[key]
                } else if (key == "userEmail" || key == "user_email") {
                    feedbackRequestData["user_email"] = userDetails[key]
                } else if (key == "customerId" || key == "customer_id") {
                    feedbackRequestData["customer_id"] = userDetails[key]
                } else {
                    feedbackRequestData["tag_" + key] = userDetails[key]
                }
            }
            if (!cookieValue) {
                cookieValue = {}
            }
        } else {
            /*Check for cookie and customer id. If customer id not in cookie then generate new customer id else use previous one.*/
            if (!cookieValue) {
                cookieValue = {};
                feedbackRequestData["customer_id"] = _generateUniqueId();
                cookieValue["ci"] = feedbackRequestData["customer_id"];
            } else {
                feedbackRequestData = _getRequestParameters(cookieValue);
                if (feedbackRequestData && !feedbackRequestData.hasOwnProperty("customer_id")) {
                    feedbackRequestData["customer_id"] = _generateUniqueId();
                    cookieValue["ci"] = feedbackRequestData["customer_id"];
                }
            }
            /*In case user details contains keys other than PI.*/
            for (var key in userDetails) {
                if (key == "appId" || key == "app_id") {
                    feedbackRequestData["app_id"] = userDetails[key]
                } else if (key == "name") {
                    feedbackRequestData["name"] = userDetails[key]
                } else {
                    feedbackRequestData["tag_" + key] = userDetails[key]
                }
            }
        }

        /*Check for app id in feedbackRequestData, if not found then set default app id from config (if present)*/
        feedbackRequestData["app_id"] = (feedbackRequestData["app_id"]) ? (feedbackRequestData["app_id"]) : window.litmusLiConfig.resource_params.app_id;
        /*add notify channel and is generate short ur flag*/
        feedbackRequestData["notify_channel"] = window.litmusLiConfig.resource_params.notify_channel;
        feedbackRequestData["is_generate_short_url"] = window.litmusLiConfig.resource_params.is_generate_short_url;

        /*In case of multiple app id, it is possible that current app id is not present in cookie. So making object for that app id*/
        if (!cookieValue.hasOwnProperty(feedbackRequestData["app_id"])) {
            cookieValue[feedbackRequestData["app_id"]] = {};
        }
        /*Check response status and feedback request token of the user for the current app id. If keys are present then no need to call API */
        if (!cookieValue[feedbackRequestData["app_id"]].hasOwnProperty("r") && !cookieValue[feedbackRequestData["app_id"]].hasOwnProperty("u")) {
            _executeAjax('POST', window.litmusLiConfig.resource_params.request_url, feedbackRequestData, ltmsHttpRequestObject, function(xmlhttp) {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    var response = JSON.parse(xmlhttp.responseText);
                    if (response && response.data && response.data.code == 0) {
                        cookieValue[feedbackRequestData["app_id"]]["r"] = (response.data.has_responded || response.data.has_responded == "true") ? 1 : 0;
                        cookieValue[feedbackRequestData["app_id"]]["d"] = (response.data.is_duplicate || response.data.is_duplicate == "true") ? 1 : 0;
                        cookieValue[feedbackRequestData["app_id"]]["u"] = response.data.long_url.substr((response.data.long_url.indexOf("v2/") + 3), 24);
                        _checkTimeDifferenceAndUpdateCookie(cookieValue);
                        successResponse = {
                            "long_url": response.data.long_url,
                            "short_url": response.data.short_url,
                            "success": true
                        };
                        cb(null, successResponse);
                        // cb(null, true);
                    } else {
                        cb(response.data, false);
                    }
                } else if (xmlhttp.readyState === 4 && (xmlhttp.status === 500 || xmlhttp.status === 501 || xmlhttp.status === 502 || xmlhttp.status === 504)) {
                    cb({ 'code': xmlhttp.status, error_message: xmlhttp.statusText }, false);
                }
            });
        } else {
            // cb(null, true);
            successResponse = {
                "long_url": _getIframeSrc().replace(ltmsLiGlobalObject.tokenPlaceHolder, cookieValue[feedbackRequestData["app_id"]]["u"]),
                "success": true
            };
            cb(null, successResponse);
        }
    }

    /*Method to get request parameters from the passed object. currently customer id is returned. Called from _prepareFeedbackRequestDataAndSetCookie*/
    function _getRequestParameters(jsonObject) {
        var obectToReturn = {};
        if (jsonObject && jsonObject.hasOwnProperty("ci") && jsonObject["ci"]) {
            obectToReturn.customer_id = jsonObject["ci"]
        }
        return obectToReturn
    }

    /*Method used to generate unique customer id. Used inside init function*/
    function _generateUniqueId() {
        return _s4() + _s4() + '-' + _s4() + _s4() + '-' + _s4() + '-' + _s4() + '-' + _s4() + _s4()
    }

    function _s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }

    /*Method that is call from each end point. This method internally call callback method to return control back to client.*/
    function _responseHandler(eName, code, msg) {
        returnInCallback["event_name"] = (eName) ? eName : returnInCallback["event_name"];
        returnInCallback["code"] = (code) ? code : returnInCallback["code"];
        returnInCallback["message"] = (msg) ? msg : returnInCallback["message"];
        onFeedbackWindowClosed(returnInCallback);
    }

    /*Method used to check element is currently displayed/bocked or not in DOM. Internally called in _getApiResponseAndUpdateCookie and capture method*/
    function _isHidden(el) {
        try {
            var style = window.getComputedStyle(el);
            return (style.display === 'none')
        } catch (e) {
            return true;
        }
    }

    /*Method to get API response for feedbackRequestData and update the cookie with response. Internally called by __showFeedbackPopup method*/
    function _getApiResponseAndUpdateCookie(cookieValue) {
        try {
            window.litmusLiConfig.resource_params.api_timeout_delay = (window.litmusLiConfig.resource_params.api_timeout_delay) ? window.litmusLiConfig.resource_params.api_timeout_delay : 15000;

            /*Set XMLHttpRequest object*/
            if (window.XMLHttpRequest) {
                ltmsHttpRequestObject = new XMLHttpRequest()
            } else {
                ltmsHttpRequestObject = new ActiveXObject("Microsoft.XMLHTTP")
            }
            var xmlHttpTimeout = setTimeout(function() {
                if (_isHidden(feedbackPopupDiv)) {
                    ltmsHttpRequestObject.abort();
                    _responseHandler(ltmsLiGlobalObject.eventName, 408, "Request Timeout.Please try after some time.");
                }
            }, window.litmusLiConfig.resource_params.api_timeout_delay);
            _executeAjax('POST', window.litmusLiConfig.resource_params.request_url, feedbackRequestData, ltmsHttpRequestObject, function(xmlhttp) {
                if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                    clearTimeout(xmlHttpTimeout);
                    var resp = JSON.parse(xmlhttp.responseText);
                    if (resp && resp.data && resp.data.code == 0) {
                        if (resp.data.has_responded) {
                            cookieValue[feedbackRequestData["app_id"]]["r"] = 1;
                            cookieValue[feedbackRequestData["app_id"]]["d"] = (resp.data.is_duplicate || resp.data.is_duplicate == "true") ? 1 : 0;
                            cookieValue[feedbackRequestData["app_id"]]["u"] = resp.data.long_url.substr((resp.data.long_url.indexOf("v2/") + 3), 24);
                            _checkTimeDifferenceAndUpdateCookie(cookieValue);
                            // _responseHandler(ltmsLiGlobalObject.eventName, 208, "Feedback response already submitted.");
                            // _setIframeSrc(_getIframeSrc().replace(ltmsLiGlobalObject.tokenPlaceHolder, cookieValue[feedbackRequestData["app_id"]]["u"]));
                            _setIframeSrc(cookieValue[feedbackRequestData["app_id"]]["u"]);
                        } else {
                            cookieValue[feedbackRequestData["app_id"]]["u"] = resp.data.long_url.substr((resp.data.long_url.indexOf("v2/") + 3), 24);
                            _checkTimeDifferenceAndUpdateCookie(cookieValue);
                            if (!feedbackPopupIframe.hasAttribute("src")) {
                                if (ltmsLiGlobalObject.customResponseUrl) {
                                    feedbackPopupIframe.setAttribute('src', (ltmsLiGlobalObject.customResponseUrl).replace("{{REQUEST_FEEDBACK_TOKEN}}", cookieValue[feedbackRequestData["app_id"]]["u"]));
                                } else {
                                    feedbackPopupIframe.setAttribute('src', _getIframeSrc().replace(ltmsLiGlobalObject.tokenPlaceHolder, cookieValue[feedbackRequestData["app_id"]]["u"]));
                                }
                                if (feedbackPopupIframe["id"] == "ltms-feedback-popup-iframe") {
                                    feedbackPopupDiv.style.display = "block";
                                    _disableEventsWhileOverlay();
                                }
                            } else {
                                _responseHandler(ltmsLiGlobalObject.eventName, 302, "Iframe src is already setted.");
                            }
                        }
                    } else {
                        _responseHandler(ltmsLiGlobalObject.eventName, resp.data.code, resp.data.error_message);
                    }
                } else if (xmlhttp.readyState === 4 && (xmlhttp.status === 500 || xmlhttp.status === 501 || xmlhttp.status === 502 || xmlhttp.status === 504)) {
                    _responseHandler(ltmsLiGlobalObject.eventName, xmlhttp.status, xmlhttp.statusText);
                }
            });
        } catch (e) {
            throw e;
        }
    }

    /*Method to set iframe source (src) when external iframe id is send and user has already responded.Internally called from _getApiResponseAndUpdateCookie and capture method.*/
    function _setIframeSrc(token) {
        try {
            if (ltmsLiGlobalObject.isExternalIframeId) {
                if (!feedbackPopupIframe.hasAttribute("src")) {
                    if (ltmsLiGlobalObject.customResponseUrl) {
                        feedbackPopupIframe.setAttribute("src", (ltmsLiGlobalObject.customResponseUrl).replace("{{REQUEST_FEEDBACK_TOKEN}}", token));
                    } else {
                        feedbackPopupIframe.setAttribute("src", _getIframeSrc().replace(ltmsLiGlobalObject.tokenPlaceHolder, token));
                    }
                } else {
                    _responseHandler(ltmsLiGlobalObject.eventName, 302, "Iframe src is already setted.");
                }
            } else {
                _responseHandler(ltmsLiGlobalObject.eventName, 208, "Feedback response already submitted.");
            }
        } catch (e) {
            console.warn("something went wrong [_setIframeSrc] : " + e);
            if (e.hasOwnProperty("message") && e.message.includes("hasAttribute")) {
                _responseHandler(ltmsLiGlobalObject.eventName, 303, "Iframe not found. Please provide valid iframe id.");
            } else {
                e.message = (e.message) ? e.message : "Unknown error occurred."
                _responseHandler(ltmsLiGlobalObject.eventName, 304, e.message);
            }
        }
    }

    /*Method to get environment based source url. Internally called by __showFeedbackPopup, _getApiResponseAndUpdateCookie,_setIframeSrc*/
    function _getIframeSrc() {
        if (window.litmusLiConfig.resource_params.request_url.includes("/demo.")) {
            ltmsLiGlobalObject.feedbackRequestUrl = ltmsLiGlobalObject.feedbackRequestUrl.replace("/staging.", "/demo.");
            ltmsLiGlobalObject.feedbackRequestUrl = (ltmsLiGlobalObject.feedbackRequestUrl.includes("/rateus/")) ? (ltmsLiGlobalObject.feedbackRequestUrl.replace("/rateus/", "/")) : ltmsLiGlobalObject.feedbackRequestUrl;
        } else if (window.litmusLiConfig.resource_params.request_url.includes("/app.")) {
            ltmsLiGlobalObject.feedbackRequestUrl = ltmsLiGlobalObject.feedbackRequestUrl.replace("/staging.", "/app.");
        } else if (window.litmusLiConfig.resource_params.request_url.includes("/app-india.")) {
            ltmsLiGlobalObject.feedbackRequestUrl = ltmsLiGlobalObject.feedbackRequestUrl.replace("/staging.", "/app-india.");
        } else if (window.litmusLiConfig.resource_params.request_url.includes("/localhost:")) {
            ltmsLiGlobalObject.feedbackRequestUrl = "https://app-india.litmusworld.com/v2/" + ltmsLiGlobalObject.tokenPlaceHolder + "?utm_source=API&utm_medium=link&utm_term=custom&utm_content=feedback&utm_campaign=get_feedback";
        } else {
            ltmsLiGlobalObject.feedbackRequestUrl = ltmsLiGlobalObject.feedbackRequestUrl.replace("/staging.", "/staging.");
        }
        return ltmsLiGlobalObject.feedbackRequestUrl;
    }

    function _disableEventsWhileOverlay() {
        document.getElementsByTagName("body")[0].classList.add('ltmsli-hide-body-over-flow');
    }

    /*Method to get cookie. Internally called by init, capture, _dynamicallyCreateFeedbackPopupModal*/
    function _getCookie(cookieName) {
        var name = cookieName + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) == 0) {
                if (window.litmusLiConfig.conversation_config.cookie.salt) {
                    decodedCookie = c.substring(name.length, c.length);
                    return _decript(decodedCookie, window.litmusLiConfig.conversation_config.cookie.salt);
                } else {
                    return c.substring(name.length, c.length)
                }
            }
        }
        return null
    }

    /*Method to set cookie value. Internally called by _prepareFeedbackRequestDataAndSetCookie, _getApiResponseAndUpdateCookie, _dynamicallyCreateFeedbackPopupModal and __showFeedbackPopup
        @parameter:
            cookieName  - name of the cookie whose value needs to save.
            cookieValue - value of the cookie which will save against cookieName.
            expairyTimeInMilliSecond - when cookie will get expire, (time in milliseconds)
            cookiePath  - path of website where cookie will be store. 
    */
    function _setCookie(cookieName, cookieValue, expairyTimeInMilliSecond, cookiePath) {
        var expires = "";
        cookieValue = JSON.stringify(cookieValue);
        if (window.litmusLiConfig.conversation_config.cookie.salt) {
            cookieValue = _encript(cookieValue, window.litmusLiConfig.conversation_config.cookie.salt);
        }
        var cookie = cookieName + "=" + cookieValue + ";";
        if (expairyTimeInMilliSecond) {
            var date = new Date();
            date.setTime(date.getTime() + expairyTimeInMilliSecond);
            expires = "; expires=" + date.toUTCString();
            cookie += expires
        }
        if (cookiePath) {
            cookie += "path=" + cookiePath + ";"
        } else {
            cookie += ";path=/"
        }
        document.cookie = cookie
    }

    /* Method to encrypt the cookie values by given salt. Internally called by _getCookie method*/
    function _encript(cookieValue, salt) {
        try {
            cookieValue = JSON.stringify(cookieValue).split('');
            for (var i = 0, l = cookieValue.length; i < l; i++)
                if (cookieValue[i] == '{')
                    cookieValue[i] = '}';
                else if (cookieValue[i] == '}')
                cookieValue[i] = '{';
            return encodeURIComponent(salt + cookieValue.join(''));
        } catch (e) {
            throw e;
        }
    }

    /* Method to decrypt the cookie values by given salt. Internally called by _setCookie method*/
    function _decript(cookieValue, salt) {
        try {
            cookieValue = decodeURIComponent(cookieValue);
            if (salt && cookieValue.indexOf(salt) != 0)
                throw new Error('decryptError');
            cookieValue = cookieValue.substring(salt.length).split('');
            for (var i = 0, l = cookieValue.length; i < l; i++)
                if (cookieValue[i] == '{')
                    cookieValue[i] = '}';
                else if (cookieValue[i] == '}')
                cookieValue[i] = '{';
            return JSON.parse(cookieValue.join(''));
        } catch (e) {
            throw e;
        }
    }

    /*Method to update the cookie expiry time. This method is called each time whenever cookie values needs to update.*/
    function _checkTimeDifferenceAndUpdateCookie(cookieValue) {
        if (!cookieValue.hasOwnProperty("cd")) {
            cookieValue["cd"] = new Date().getTime();
        }
        if (!cookieValue[feedbackRequestData["app_id"]].hasOwnProperty("cd")) {
            cookieValue[feedbackRequestData["app_id"]]["cd"] = new Date().getTime();
        }
        var expairyTimeOfCookie;
        if (cookieValue[feedbackRequestData["app_id"]]['r'] == 1) {
            expairyTimeOfCookie = window.litmusLiConfig.conversation_config.dedup_delay.actual_delay;
        } else {
            var diffInMilliseconds = _getDifferenceInMilliseconds(cookieValue["cd"]);
            expairyTimeOfCookie = window.litmusLiConfig.conversation_config.dedup_delay.initial_delay;
            if (diffInMilliseconds != 0) {

                expairyTimeOfCookie = expairyTimeOfCookie - diffInMilliseconds;
            }
        }
        _setCookie(window.litmusLiConfig.conversation_config.cookie.name, cookieValue, expairyTimeOfCookie, null);
    }

    /*Method to delete the cookie. currently this method is not used.*/
    function _deleteCookie(cookieName) {
        _setCookie(cookieName, "", null, null, null, 1)
    }

    /*Method to add/attach event listener to passed object.*/
    function _attachEvent(object, event, cb) {
        if (object.addEventListener) {
            object.addEventListener(event, cb, !1)
        } else if (object.attachEvent) {
            object.attachEvent('on' + event, cb, !1)
        }
    }

    /*Method to get time difference in milliseconds for passed date*/
    function _getDifferenceInMilliseconds(previousDate) {
        return Math.abs(new Date().getTime() - previousDate)
    }

    /*Method to set callback settings for the available config. Internally called by init method*/
    function _applyCallbackSettings() {
        if (window.litmusLiConfig.callback_settings && window.litmusLiConfig.callback_settings.id && window.litmusLiConfig.callback_settings.event) {
            var callback_element = document.getElementById(window.litmusLiConfig.callback_settings.id);
            if (callback_element) {
                _attachEvent(callback_element, window.litmusLiConfig.callback_settings.event, function(e) {
                    e = e || window.event;
                    var target = e.target || e.srcElement;
                    var text = target.textContent || text.innerText;
                    _responseHandler(ltmsLiGlobalObject.eventName, 226, "Explicit callback requested by user.")
                });
            }
        }
    }
    /*Method to set basic settings for the available config. internally callback by init method*/
    function _applyBasicTriggerSetting() {
        if (window.litmusLiConfig.trigger_settings.basic && window.litmusLiConfig.trigger_settings.basic.feedback_link) {
            setTimeout(function() {
                var btnDiv = document.createElement("div");
                var floatingButton = document.createElement('button');
                floatingButton.setAttribute('id', 'litmus-feedback-floating-button');
                if (window.litmusLiConfig.trigger_settings.basic.feedback_link.text) {
                    floatingButton.innerHTML = window.litmusLiConfig.trigger_settings.basic.feedback_link.text
                }
                if (window.litmusLiConfig.trigger_settings.basic.feedback_link.logo) {
                    floatingButton.style.src = window.litmusLiConfig.trigger_settings.basic.feedback_link.text
                }
                if (window.litmusLiConfig.trigger_settings.basic.feedback_link.type) {
                    if (window.litmusLiConfig.trigger_settings.basic.feedback_link.type == "round") {
                        floatingButton.classList.add('litmus-button-feedback-round');
                        if (window.litmusLiConfig.trigger_settings.basic.feedback_link.position) {
                            floatingButton.classList.add('litmus-' + window.litmusLiConfig.trigger_settings.basic.feedback_link.position + "-round")
                        }
                        if (window.litmusLiConfig.trigger_settings.basic.feedback_link.img) {
                            floatingButton.style.background = "url('" + window.litmusLiConfig.trigger_settings.basic.feedback_link.img + "') no-repeat top center"
                            floatingButton.style.backgroundSize = "55px 55px"
                        }
                    } else {
                        floatingButton.classList.add('litmus-button-feedback-square');
                        if (window.litmusLiConfig.trigger_settings.basic.feedback_link.position) {
                            floatingButton.classList.add('litmus-' + window.litmusLiConfig.trigger_settings.basic.feedback_link.position + "-square")
                        }
                        if (window.litmusLiConfig.trigger_settings.basic.feedback_link.background) {
                            floatingButton.style.backgroundColor = window.litmusLiConfig.trigger_settings.basic.feedback_link.background
                        }
                        if (window.litmusLiConfig.trigger_settings.basic.feedback_link.font_weight) {
                            floatingButton.style.fontWeight = window.litmusLiConfig.trigger_settings.basic.feedback_link.font_weight
                        }
                        if (window.litmusLiConfig.trigger_settings.basic.feedback_link.border) {
                            floatingButton.style.border = window.litmusLiConfig.trigger_settings.basic.feedback_link.border
                        }
                    }
                }
                _attachEvent(floatingButton, window.litmusLiConfig.trigger_settings.basic.feedback_link.event_type, function() {
                    ltmsLi.capture(window.litmusLiConfig.trigger_settings.basic.feedback_link.exclude_from_dedup, "feedback_btn", { "iframe_id": window.litmusLiConfig.trigger_settings.basic.feedback_link.iframe_id });
                });
                btnDiv.appendChild(floatingButton);
                document.getElementsByTagName('body')[0].appendChild(btnDiv)
            }, window.litmusLiConfig.trigger_settings.basic.feedback_link.delay)
        }
    }
    /*Method to set advanced settings for the available config. internally callback by init method*/
    function _applyAdvancedTriggerSetting() {
        if (window.litmusLiConfig.trigger_settings.advanced && window.litmusLiConfig.trigger_settings.advanced.length > 0) {
            for (var i = 0; i < window.litmusLiConfig.trigger_settings.advanced.length; i++) {
                if (window.litmusLiConfig.trigger_settings.advanced[i].is_domain_level == "true" || window.litmusLiConfig.trigger_settings.advanced[i].is_domain_level == true) {
                    if (window.litmusLiConfig.trigger_settings.advanced[i].name == window.location.hostname) {
                        _bindEvents(window.litmusLiConfig.trigger_settings.advanced[i])
                    }
                } else if (window.litmusLiConfig.trigger_settings.advanced[i].name == ltmsLiGlobalObject.currentPage) {
                    _bindEvents(window.litmusLiConfig.trigger_settings.advanced[i])
                }
            }
        }
    }

    /*Method to bind events for the passed object. Internally called from _applyAdvancedTriggerSetting method*/
    function _bindEvents(pageInfo) {
        if ((pageInfo).hasOwnProperty('event_type')) {
            if (pageInfo.event_type == "onload") {
                /*No need to attach event on load. because this method is called only if init method s called. 
                And init method mostly called once window loaded. So capture method called after specified time delay.
                */
                setTimeout(function() {
                    ltmsLi.capture(pageInfo.exclude_from_dedup, pageInfo.event_type, { "iframe_id": pageInfo.iframe_id });
                }, pageInfo.delay);
            } else if (pageInfo.event_type == "click") {
                var targetElement = _getTargetElement(pageInfo);
                if (targetElement && targetElement != undefined && targetElement != null) {
                    _attachEvent(targetElement, pageInfo.event_type, function() {
                        ltmsLi.capture(pageInfo.exclude_from_dedup, pageInfo.event_type, { "iframe_id": pageInfo.iframe_id });
                    })
                }
            } else if (pageInfo.event_type == "scroll") {
                _attachEvent(window, pageInfo.event_type, function() {
                    _amountscrolled(pageInfo.delay, pageInfo.exclude_from_dedup, pageInfo.event_type, { "iframe_id": pageInfo.iframe_id });
                })
            } else if (pageInfo.event_type == "mouseleave") {
                if (pageInfo.target_type == "body") {
                    _attachEvent(document.body, 'mouseleave', function(event) {
                        if (event.offsetY - (window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop) < 0) {
                            ltmsLi.capture(pageInfo.exclude_from_dedup, pageInfo.event_type, { "iframe_id": pageInfo.iframe_id });
                        }
                    })
                }
            }
        }
    }
    /*Method to get DOM element for the passed object. Internally called from _bindEvents method*/
    function _getTargetElement(pageInfo) {
        try {
            var targetTag;
            var htmlTags;
            if (pageInfo.target_type == "id") {
                targetTag = document.getElementById(pageInfo.target_value)
            } else if (pageInfo.target_type == "class") {
                targetTag = document.getElementsByClassName(pageInfo.target_value)[0]
            } else {
                htmlTags = document.getElementsByTagName(pageInfo.target_type);
                for (var i = 0; i < htmlTags.length; i++) {

                    if (htmlTags[i].textContent == pageInfo.target_value) {
                        targetTag = htmlTags[i];
                        break
                    }
                }
            }
            return targetTag
        } catch (e) {
            return null
        }
    }

    /*Method to get scrolled percentage of the page.Internally called by _bindEvents method.*/
    function _getDocHeight() {
        var D = document;
        return Math.max(D.body.scrollHeight, D.documentElement.scrollHeight, D.body.offsetHeight, D.documentElement.offsetHeight, D.body.clientHeight, D.documentElement.clientHeight)
    }

    function _amountscrolled(scrollDownValue, excludeFromDedup, eName, obj) {
        var winheight = window.innerHeight || (document.documentElement || document.body).clientHeight
        var docheight = _getDocHeight()
        var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
        var trackLength = docheight - winheight
        var pctScrolled = Math.floor(scrollTop / trackLength * 100)
        if (pctScrolled > scrollDownValue) {
            ltmsLi.capture(excludeFromDedup, eName, obj);
        }
    }

    /*Method to generate feedback pop up modal dynamically. Internally called by init*/
    function _dynamicallyGenerateFeedbackPopupModal() {
        /*Create outer div of the feedback pop up modal*/
        feedbackPopupDiv = document.createElement('div');
        feedbackPopupDiv.setAttribute('id', 'ltms-feedback-modal-div');
        feedbackPopupDiv.setAttribute('class', 'ltms-rating-modal');
        /*Create inner div of the feedback pop up modal*/
        var modalContentDiv = document.createElement('div');
        modalContentDiv.setAttribute('id', 'modal-content-div');
        modalContentDiv.setAttribute('class', 'ltms-rating-modal-content');
        /*Create body div of the feedback pop up modal*/
        var modalBodyDiv = document.createElement('div');
        modalBodyDiv.setAttribute('id', 'modal-body-div');
        modalBodyDiv.setAttribute('class', 'ltms-rating-modal-body');
        var modalHeaderDiv = document.createElement('div');
        modalHeaderDiv.setAttribute('id', 'modal-header-div');
        modalHeaderDiv.setAttribute('class', 'ltms-rating-modal-header');
        var modalFooterDiv = document.createElement('div');
        modalFooterDiv.setAttribute('id', 'modal-footer-div');
        modalFooterDiv.setAttribute('class', 'ltms-rating-modal-footer');
        /*Create cross button for the feedback pop up modal*/
        var modalCloseButton = document.createElement('div');
        modalCloseButton.classList.add('close-img-container');
        modalCloseButton.setAttribute('title', 'Close');
        /*Create an iframe for the feedback pop up modal*/
        feedbackPopupIframe = document.createElement('iframe');
        feedbackPopupIframe.setAttribute('id', 'ltms-feedback-popup-iframe');
        feedbackPopupIframe.setAttribute('align', 'middle');
        feedbackPopupIframe.setAttribute('height', window.innerWidth >= 750 ? '550px' : window.innerHeight - 100 + "px");
        feedbackPopupIframe.setAttribute('scrolling', 'no');
        feedbackPopupIframe.setAttribute('class', 'ltms-modal-iframe');
        var innerDivForIframe = document.createElement('div');
        innerDivForIframe.appendChild(modalCloseButton);
        innerDivForIframe.appendChild(feedbackPopupIframe);
        modalBodyDiv.appendChild(innerDivForIframe);
        modalContentDiv.appendChild(modalBodyDiv);
        modalContentDiv.appendChild(modalFooterDiv)
        feedbackPopupDiv.appendChild(modalContentDiv);
        /*Attach an event to the close/cross button. when this button is clicked an API call happened and callback returned to client.*/
        _attachEvent(modalCloseButton, 'click', function() {
            feedbackPopupDiv.style.display = "none";
            feedbackPopupIframe.removeAttribute("src");
            window.litmusLiConfig.conversation_config.cookie.name = (window.litmusLiConfig.conversation_config.cookie.name) ? window.litmusLiConfig.conversation_config.cookie.name : "_lmtfdk";
            var latestCookieValue = JSON.parse(_getCookie(window.litmusLiConfig.conversation_config.cookie.name));
            if (latestCookieValue) {
                /*Set response status as in waiting stats*/
                latestCookieValue[feedbackRequestData["app_id"]]["r"] = 2;
                _checkTimeDifferenceAndUpdateCookie(latestCookieValue);
                /*Make API call and get response status and update cookie accordingly.*/
                _executeAjax('POST', window.litmusLiConfig.resource_params.request_url, feedbackRequestData, ltmsHttpRequestObject, function(xmlhttp) {
                    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                        var response = JSON.parse(xmlhttp.responseText);
                        if (response && response.data && response.data.code == 0 && response.data.has_responded) {
                            latestCookieValue[feedbackRequestData["app_id"]]["r"] = 1;
                            latestCookieValue[feedbackRequestData["app_id"]]["d"] = (response.data.is_duplicate || response.data.is_duplicate == "true") ? 1 : 0;
                            latestCookieValue[feedbackRequestData["app_id"]]["u"] = response.data.long_url.substr((response.data.long_url.indexOf("v2/") + 3), 24);
                            _checkTimeDifferenceAndUpdateCookie(latestCookieValue);
                        }
                    }
                });
            }
            document.getElementsByTagName("body")[0].classList.remove('ltmsli-hide-body-over-flow');
            _responseHandler(ltmsLiGlobalObject.eventName, 200, "Feedback popup closed.");
        });
        document.getElementsByTagName('body')[0].appendChild(feedbackPopupDiv)
    }

    /*Method to set user session cookie. currently this method is not used */
    function _checkAndSetUserSession() {
        if (window.litmusLiConfig.conversation_config.cookie.session_cookie.name) {
            if (window.litmusLiConfig.conversation_config.cookie.session_cookie.level && window.litmusLiConfig.conversation_config.cookie.session_cookie.level == "page") {
                _setCookie(window.litmusLiConfig.conversation_config.cookie.session_cookie.name, new Date().getTime(), null, window.location.pathname)
            } else {
                _setCookie(window.litmusLiConfig.conversation_config.cookie.session_cookie.name, new Date().getTime(), null, null)
            }
        }
    }
    /*Method to check user session time in page. currently this method is not used */
    function _checkUserSessionTime() {
        var startTime = _getCookie(window.litmusLiConfig.conversation_config.cookie.session_cookie.name);
        if (startTime) {
            var timeDifference = Math.abs(startTime - new Date().getTime());
            if (timeDifference >= window.litmusLiConfig.conversation_config.cookie.session_cookie.delay) {
                ltmsLi.capture(window.litmusLiConfig.conversation_config.cookie.session_cookie.exclude_from_dedup, "userSession")
            }
        }
    }

    /*Method to check object is empty or not. currently this method is not used*/
    function _isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return !1
        }
        return !0
    }

    /*Method to attach evet listener to the custom function defined in the client side.
     */
    function attachCustomListenerCallBack() {
        if (ltmsLiGlobalObject.customListenerFunction) {
            window.addEventListener("message", ltmsLiGlobalObject.customListenerFunction, false);
        }
    }

});

/*Polly fill to support object.assign in IE.*/
if (typeof Object.assign != 'function') {
    Object.assign = function(target, varArgs) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object')
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey]
                    }
                }
            }
        }
        return to
    }
}
/*Polly fill to support includes method in IE.*/
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

/*call/init the closure function*/
try {
    var ltmsLi = ltmsLiClosure();
    if (!window.ltmsLi) {
        window.ltmsLi = ltmsLi || {};
    } else {
        Object.assign(window.ltmsLi, ltmsLi);
    }
} catch (e) {
    if (onFeedbackWindowClosed) {
        onFeedbackWindowClosed({ "event_name": "unknownEvent", "code": 520, "message": e.message });
    } else {
        console.error("Unknown Error _____" + e);
    }
}
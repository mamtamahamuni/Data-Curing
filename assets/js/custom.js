
function litmusCode(memberid,type,user_details,module_type,module_name) {
   /* if (window.addEventListener) {
      window.addEventListener("message", onMessage(), false);
    }
    else if (window.attachEvent) {
      window.attachEvent("onmessage", onMessage(), false);
    }*/
    
    
    var userDetails = {
       // "appId": "g3wj_touchpoint", //currently points to staging. Needs to be changed for production.  
        "appId": "dl9m_touchpoint", 
        "user_type" : "First Time", //”First Time” or “Regular”
        "name" : user_details.name, //optional
        "userEmail":user_details.email,
        "userPhone":user_details.mobile,
        "tag_policy_type":user_details.policy_type,
				"tag_intermediary_name": null,
				"tag_sum_insured":user_details.sum_insured,
				"tag_PolicyNumber":user_details.PolicyNumber,
        "transaction_date" : "2016-Jun-24", //optional
       // "city": "Bangalore", //optional
        "tag_customer_id":memberid,
        "trigger_name":type,
        'request_source':"Website",
        'is_request_dedupe_enable' :false
        };

        var event_name="myEvent";

        var efd = true;

        var params ={
          "event_name":"myEvent"
          };

          // if(module_type == 'policy_details'){
          //   userDetails["policy_details"] = module_name;
          // }
          // else if(module_type == 'endorsement_activity'){
          //   userDetails["endorsement_activity"] = module_name;
          // }
          // else if(module_type == 'claim_intimation'){
          //   userDetails["claim_intimation"] = module_name;
          // }
          // else if(module_type == 'appointment_type'){
          //   userDetails["appointment_type"] = module_name;
          // }
          // else if(module_type == 'claim_status'){
          //   userDetails["claim_status"] = module_name;
          // }
          // else if(module_type == 'home_page'){
          //   userDetails["home_page"] = module_name;
          // }

    if (typeof ltmsLi !== 'undefined') {
        /*Use any one. uncomment commented lines and comment out uncommented line(s).*/
        ltmsLi.init(userDetails , feedbackRequestURL , params, function(err, success) {
        if (err) {
        /*Here you will not get the code. if error occured then no need to call capture method.*/
        console.log('____', err);
        } else {
        ltmsLi.capture(efd, event_name, params);
        }
        });
        } else {
        console.log("LW library not defined. Please continue with your other functionality.");
        }
        
  }

  function onMessage(event) {
    // Check sender origin to be trusted
    if (event.origin !== "https://app-india.litmusworld.com/rateus/api/feedbackrequests/generate_customer_feedback_url") return;
    var data = event.data;
    if (typeof (window[data.func]) == "function") {
    window[data.func].call(null, data.message);
    }
  }
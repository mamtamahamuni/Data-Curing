// Source: app.filter.js
/*
	Name: Common Filter 
	Date: 26-06-2018
*/

	app.filter('splitFilter', function() {
	  	return function(input) {
	    	var arr = JSON.parse(input);
	    	return arr;
	  	};
	});
	

	/* Indian Rupee Filter */

		app.filter('INR', function () {        
		    return function (input) {
		        if (! isNaN(input) && input != null) {
		            var result = input.toString().split('.');
		            var lastThree = result[0].substring(result[0].length - 3);
		            var otherNumbers = result[0].substring(0, result[0].length - 3);
		            if (otherNumbers != '')
		                lastThree = ',' + lastThree;
		            var output = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
		            if (result.length > 1) {
		                output += "." + result[1];
		            }            
		            return output;
		        }
		    }
		});

	/* End of Indian Rupee Filter */



	app.filter('unique', function () {
		  return function (collection, field) {
		    const output = [];
		    const keys = [];
		    const fields = field && field.split('.');
		    angular.forEach(collection, function (item) {
		      const key = fields ? fields.reduce((key, field) => key[field], item) : item;
		      if (!keys.some(prev => angular.equals(prev, key))) {
		        keys.push(key);
		        output.push(item);
		      }
		    });
		    return output;
		  };
		});


	/* Capitalize Filter */

		app.filter('capitalize', function() {
		    return function(input) {
		      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
		    }
		});

	/* End of capitalize filter */


	/* Product Full Name Filter */

		app.filter('productFilter', function() {
		    return function(input) {
				console.log("filter: " + input);
			    switch(input){
			    	case 'CI':
			      	return "Critical Illness";
			    	break;
			    	case 'CS':
			      	return "Cancer Secure";
			    	break;
			    	case 'PA':
			      	return "Personal Accident";
			    	break;
			    	case 'PLATINUM - ESSENTIAL':
			      	return "Platinum - Essential";
			    	break;
			    	case 'PLATINUM - ENHANCED':
			      	return "Platinum - Enhanced";
			    	break;
			    	case 'PLATINUM - PREMIERE':
			      	return "Platinum - Premiere";
			    	break;
			    	case 'DIAMOND':
			      	return "Diamond";
			    	break;
			    	case 'AC':
			      	return "Activ - Care";
			    	break;
			    	case 'CK':
			      	return "Corona-Kavach";
			    	break;
			    	case 'ST':
			      	return "Super Top-up";
			      	break
					case 'FIT':
					return "Activ Fit";
					break
					case 'AS':
					return "Arogya Sanjeevani";
					break
			    	default:
						input
			    	break;
			    }
			}
		});

	/* End of product full name filter */


	/* Trust As HTML Filter */

		app.filter('trustAsHTML', ['$sce', function($sce) {
	        return function(val) {
	            return $sce.trustAsHtml(val);
	        };
	    }]);

	/* End of trust as html filters */


/* End of common filter */
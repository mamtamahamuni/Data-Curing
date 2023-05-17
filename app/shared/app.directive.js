// Source: app.directive.js
/*
	Name: Common Directive folder
	Author: Pankaj Patil
	Date: 19-06-2018
*/	

	/* Variable Declaration */
	
		var ulIndex = 0;

	/* End of variable declaration */


	/*Date Directive */
				app.directive("dateDirective", function() {
			        return {
			            require: "?ngModel",
			            link: function(scope, element, attrs, ngModelCtrl) {
			                ngModelCtrl && (ngModelCtrl.$parsers.push(function(val) {
			                    null == val && (val = "");
			                    for (var clean = val.toString().replace(/[^0-9]+/g, ""), i = 0; i < clean.length; i++) {
			                        if (2 == i)
			                            clean = clean[0] + "" + clean[1] + "/" + clean.substr(2);
			                        if (6 == i)
			                            clean = clean.substr(0, 5) + "/" + clean.substr(5)
			                    }
			                    return val !== clean && (ngModelCtrl.$setViewValue(clean),
			                    ngModelCtrl.$render()),
			                    clean
			                }),
			                element.bind("keypress", function(e) {
			                    var code = e.keyCode || e.which;
			                    101 !== code && 32 !== code && 109 !== code && 45 !== code || e.preventDefault()
			                }))
			            }
			        }
			    })

	/* Date Directive ends */

	
	/* Directive for dropdown on pre quote page */

		app.directive('dropdown',function(){
			return {
		        restrict: 'A',
		        require: '?ngModel',
		        scope:{
		        	dropdownVal : "=dropdown"
		        },
		        link: function(scope, element,attrs,ngModelCtrl) {
		            var $parentDiv = element.closest('.q-input');
		            var $ul = $parentDiv.children('ul').first();
		            var $overlay = $parentDiv.children('.reg-overlay');
		            var totalLi;
		            element.on('click',function(){
		            	totalLi = $ul.find('li').length;
		            	$ul.show();
		            	$ul.addClass('ul-activ');
		            	$overlay.show();
		              	$parentDiv.addClass('showOpt-open');
		            });

		            $overlay.on('click',function(){
						$ul.hide();
		            	$ul.removeClass('ul-activ');
		            	ulIndex = 0;
		              	$parentDiv.removeClass('showOpt-open');
		            });

		            $ul.on('click','li',function(){
		            	var liVal = $(this).text();
		            	ngModelCtrl.$setViewValue(liVal);
		                ngModelCtrl.$render();
		                scope.dropdownVal = $(this).data('val');
		                $ul.hide();
		            	$ul.removeClass('ul-activ');
		              	$parentDiv.removeClass('showOpt-open'); 
		            	ulIndex = 0;
		            });
		        }
		    };
		});

	/* End of dropdown directive */


	/* Directive to button dropdown */

		app.directive('buttonDropdown',function($timeout){
			return {
		        restrict: 'A',
		        scope:{
		        	dropdownVal : "=buttonDropdown"
		        },
		        link: function(scope, element,attrs) {
		        	var dropdownElement = element.closest('.dropdown');
		        	element.on('click',function(){
		        		$('.dropdown').removeClass('open ul-activ');
		        		dropdownElement.addClass('open ul-activ');
		        	});

		        	dropdownElement.on('click','.li-item-text-change',function(){
		        		var $this = $(this);
		        		$timeout(function(){
			        		scope.$apply(function(){
						      	scope.dropdownVal = $this.data('val');
		            			ulIndex = 0;
						    });
			        		dropdownElement.removeClass('open ul-activ');
		        		},300);
		        		scope.$apply();
		        	});

		        	$(document).click(function(event) { 
	                    if(!$(event.target).closest('.dropdown ').length) {
	                        if(dropdownElement.hasClass('open')) {
	                            dropdownElement.removeClass('open ul-activ');
		            			ulIndex = 0;
	                        }
	                    } 
	                });
		        }
		    };
		});

	/* End of directive to button dropdown */


	/* Valid Number directive */

	    app.directive('validNumber', function () {
	        return {
	            require: '?ngModel',
	            link: function (scope, element, attrs, ngModelCtrl) {
	                if (!ngModelCtrl) {
	                    return;
	                }
	                if($(window).width() < 768){
	                	element.attr('type','tel');
	                }
	                ngModelCtrl.$parsers.push(function (val) {
	                    if (val === undefined || val === null) {
	                        val = '';
	                    }
	                    var clean = val.toString().replace(/[^0-9]+/g, '');              
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

	/* End of valid number directive */

	/* Valid Number directive */

	    app.directive('validNumbertext', function () {
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
	                    var clean = val.toString().replace(/[^0-9]+/g, '');              
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

	/* End of valid number directive */


	/* Directive to accept only alphabets */

		app.directive('validName', function () {
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
	                    var clean = val.toString().replace(/[^a-zA-Z_ ]+/g, '');
                        if (val !== clean) {
	                        ngModelCtrl.$setViewValue(clean);
	                        ngModelCtrl.$render();
	                    }
	                    return val;
	                });
	                element.bind('keypress', function (evt) {
	                	
	                });
	            }
	        };
	    });

	/* End of directive to accept only alphabets */


	/* Directive to accept valid Address  */

		app.directive('validAdd', function () {
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
	                    var clean = val.toString().replace(/[^a-zA-Z0-9 ,-./]+/g, '');
                        if (val !== clean) {
	                        ngModelCtrl.$setViewValue(clean);
	                        ngModelCtrl.$render();
	                    }
	                    return val;
	                });
	                element.bind('keypress', function (evt) {
	                	
	                });
	            }
	        };
	    });

	/* Directive to accept valid Address ends */


	/* Sticky Directive */

		app.directive('sticky',function(){
			return {
		        restrict: 'A',
		        link: function(scope, element,attrs) {
		        	$(window).scroll(function(){
		              	var sticky = $('.sticky'),
		                scroll = $(window).scrollTop();
						if (scroll >= 100) sticky.addClass('fixed');
		              	else sticky.removeClass('fixed');
		            });
		        }
		    };
		});

	/* End of sticky directive */


	/* Accordion Directive */

		app.directive('accordion',function($timeout){
			return {
		        restrict: 'A',
		        link: function(scope, element,attrs) {
		        	var accordionAnchor = element.find('.accordion-toggle').first();
		        	var accordionCollapse = element.find('.panel-collapse').first();
		        	accordionAnchor.on('click',function(){
		        		var $this = $(this);
		        		if(attrs.accordion == 'openClose' && !accordionAnchor.hasClass('collapsed')){
		        			$('.accordion-toggle').removeClass('collapsed');
		        			$('.panel-collapse').removeClass('in').slideUp();
		        		}
		        		$timeout(function(){
			        		$this.toggleClass('collapsed');
			        		accordionCollapse.slideToggle();
			        		accordionCollapse.toggleClass("in",500);
		        		},30);
		        	})
		        }
		    };
		});

	/* End of accordion directive */

	/* Accordion Directive */

		app.directive('accord',function($timeout){
			return {
		        restrict: 'A',
		        link: function(scope, element,attrs) {
		        	var accordAnchor = element.find('.inner-accord').first();
		        	var accordCollapse = element.find('.inner-pannel').first();
		        	accordAnchor.on('click',function(){
		        		var $this = $(this);
		        		if(attrs.accord == 'openClose' && !accordAnchor.hasClass('collapsed')){
		        			$('.inner-accord').removeClass('collapsed');
		        			$('.inner-pannel').removeClass('in').slideUp();
		        		}
		        		$timeout(function(){
			        		$this.toggleClass('collapsed');
			        		accordCollapse.slideToggle();
			        		accordCollapse.toggleClass("in",500);
		        		},30);
		        	})
		        }
		    };
		});

	/* End of accordion directive */


	/* Move to next input field directive */

	    app.directive("moveNextOnMaxlength", function() {
	        return {
	            restrict: "A",
	            link: function($scope, element) {
	            	var ele = element.find('input');
	                element.on("input", function(e) {
	                    if(element.val().length == element.attr("maxlength")) {
	                        var $nextElement = element.closest('div').next().find('input');
	                        if($nextElement.length) {
	                            $nextElement[0].focus();
	                        }
	                    }
	                });
	            }
	        }
	    });

	/* End of move to next input field directive */


	/* Collapse Question Directive */

		app.directive('collapseQuestion',function($timeout){
			return {
		        restrict: 'A',
		        scope:{
		        	collapseQueVal : "=collapseQuestion"
		        },
		        link: function(scope, element,attrs) {
		        	var answerBtn = element.children('.yes-no-question-section').find('.yes-no-btn');
		        	var answerCollapseSection = element.find('.yes-no-collapse-section:first-child');
		        	answerBtn.on('click',function(){
		        		var $this = $(this);
		        		answerBtn.removeClass('selected');
		        		$this.addClass('selected');
		        		if($this.hasClass('yes-answer')){
		        			scope.collapseQueVal = "Y";
		        		}else if($this.hasClass('no-answer')){
		        			scope.collapseQueVal = "N";
		        		}
		        		if(answerCollapseSection.length && $this.hasClass('yes-answer')){
		        			answerCollapseSection.slideDown();
		        		}else if(answerCollapseSection.length && $this.hasClass('no-answer')){
		        			answerCollapseSection.slideUp();
		        		}
		        		scope.$apply();
		        	});
		        }
		    };
		});

	/* End of accordion directive */


	/* Directive for Popover */
	
		var i = 0;
		app.directive("customPopover", function($timeout) {
	        return {
	            restrict: "A",
	            link: function($scope, element) {
					i = i + 1;
	            	element.attr('popover-num',i);
	            	var currentElement = $("[popover-num="+i+"]");
	                currentElement.find('img').on("click", function(e) {
	                	if(currentElement.find('.custom-tooltip-text').css('display') == "block" ){
	                		currentElement.find('.custom-tooltip-text').hide();
	                	}
	                	else{
	                		$timeout(function(){
	                    	currentElement.find('.custom-tooltip-text').show();
	                	},300);
	                	}
	                	
	                });
	                currentElement.find('.pop-close').on('click',function(){
	                	currentElement.find('.custom-tooltip-text').hide();
	                });
	                $(document).click(function(event) { 
	                    if(!$(event.target).closest(currentElement).length) {
	                       currentElement.find('.custom-tooltip-text').hide();
	                    }
	                });
	            }
	        }
	    });

	/* End of directive to popover */


	/* Key Up and Down Event on document */

		/*$(document).keydown(function(e){
			if($('.ul-activ').length) {
				var ulLength = $('.ul-activ li').length;
				$('.ul-activ li').removeClass('active');
              	if(e.originalEvent.which == 38){
              		ulIndex = ulIndex - 1;
              		if(ulIndex == 0){
              			ulIndex = ulLength;
              		}
	              	$('.ul-activ li:nth-child('+ulIndex+')').addClass('active');
              	}
              	if(e.originalEvent.which == 40){
              		ulIndex = ulIndex + 1;
              		if(ulIndex > ulLength){
              			ulIndex = 1;
              		}
              		$('.ul-activ li:nth-child('+ulIndex+')').addClass('active');
              	}
              	if(e.originalEvent.which == 13){
              		setTimeout(function(){
              			if($('.ul-activ li:nth-child('+ulIndex+')').find('a').length){
              				$('.ul-activ li:nth-child('+ulIndex+') a').click();
              			}else{
              				$('.ul-activ li:nth-child('+ulIndex+')').click();
              			}
              		},400);
              	}
            } 
		});*/

	/* End of key up and down event on dropdown */

	
/*
	End of directive
	Name: Common Directive folder
	Author: Pankaj Patil
	Date: 19-06-2018
*/
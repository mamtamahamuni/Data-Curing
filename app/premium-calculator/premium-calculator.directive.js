/*
	Name: Pre Quote Directive
	Description : This directive is used to manipulate pre quote questions section
	Author: Sunny Khattri
	Date: 08-04-2019
*/
var app = angular.module('preCalcDirective', []);

app.directive('preCalc', ['$timeout', '$rootScope', function($timeout, $rootScope) {
    return {
        scope: {
            pQController: "=preCalc"
        },
        link: function(scope, element, attrs, $location, $anchorScroll) {

            console.log("directive called ")


            /* 
	          		Switch Particular Section 
	          		Below function accepts 4 arguments.
	          		First argument is current active section.
	          		Second argument is next section to made active
	          		Third argument is netx step count.
	          		Forth agrument is whether goindBack or not indicator
	          	*/

            function switchSection(screenBox, nextSection, count, goingBack) {

                /* 
                	If next step count is 4 and productCategory is SC i.e Activ Care
                	Then validate member age configuration
                	As for activ care minimum age of atleast on member should be 55 so that we validate it by using validateSCfunction()
                	If its isnt valid then we should alert to user otherwise we allow him to proceed
                */

                if (count == 4 && scope.pQController.ProductCategory == 'SC') {
                    if (validateSCfunction() == 'N') {
                        $rootScope.alertConfiguration('E', "Atleaset one member should have age above 55 years", "sc-member-age_alert");
                        return false;
                    }
                }

                /* End */

                /* 
                	If next step count is greater than 1 then we show 'back to previous' icon otherwise we hide
                	'back to previous' icon.
                */

                var countSpan = $('.q-count span'); // Instance of span tag which holds step count 
                (count != 1) ? $('.backToPrevious').show(): $('.backToPrevious').hide(); // Whether to show backtoprevious icon or not
                countSpan.text(count + "/4"); // Stored count value recived from argument of this function
                scope.pQController.count = count; // Stored count value recived from argument on scope

                /* End */

                /* If going back is false then we are updateing data-prev attibute value of nextSection with the data-section attribute value of current active section */

                if (!goingBack) {
                    nextSection.attr('data-prev', screenBox.attr('data-section'));
                }

                /* End */

                /* 
                	To hide current section (screenBox) and to show next section with animation we perform following operations 
                	First we add folloing classes to next Section
                	"screen-Active screen-scroll current-activ" and then remove same classes from current active section (screenBox)
                	after that we remove 'showOpt-open' call from q-input
                	then we slideUp(500) current activ section(screenBox) i.e hide current active section(screenBox) with animation
                	then we slideDown next section i.e show next section with animation
                */

                nextSection.addClass('screen-Active screen-scroll current-activ');
                screenBox.removeClass('screen-Active screen-scroll current-activ');
                screenBox.find('.q-input').removeClass('.showOpt-open');
                screenBox.slideUp(500);
                nextSection.slideDown(500);
                nextSection.find('input').focus();

                /* End */

                /* 
                	If value of 'data-setion' attribute of next section is 'question-6' 
                	then we focus input with id '#ques_kid_1_age' as there can be more than one input
                	Else
                	we just focus on single input available in nextSection
                */

                /*if(nextSection.attr('data-section') == 'question-6'){
                	$timeout(function(){
                		$('#ques_kid_1_age').focus();
                	},200);
                }else{
                	nextSection.find('input').focus();
                }*/

                /* End */

                scope.$apply(); // Apply there change

            }

            /* End of switching particular section */



            /* close the other member pop up */

            $('.close-other-family-construct').on('click', function() {
                console.log("directive")
                $('.otherFamilyConstruct').hide().removeClass('ul-activ'); // Hiding other family construct dropdown
                $('.reg-overlay').fadeOut(); // Hiding overlay div
                $('.q-input').removeClass('showOpt-open'); // Removing showOpt-open class
            });

            /* close the other member pop up */
            /* 
            	Go to previous section 
            	Following is click event on backToPrevious icon
            */


            $('.backToPrevious').on('click', function() {
                scope.pQController.showForward = true;
                var $this = $(this); // Stored current instance of backToPrevious
                var screenBox = $('.current-activ'); // Taken current active sections class instance
                var nextSection = $('.screen-box[data-section="' + screenBox.attr('data-prev') + '"]'); // Taken instance of next section to be made active. On every current active section we store classname of previous section in data-prev attribute
                $rootScope.callGtag('click-icon', 'pre-quote', 'prequote_back-to_[' + nextSection.attr('data-type') + ']'); // Calling gtag
                if (!angular.isUndefined(nextSection.attr('data-scroll'))) {
                    switchSection(screenBox, nextSection, nextSection.attr('data-scroll'), true);
                }
                //switchSection(screenBox,nextSection,nextSection.attr('data-scroll'),true); // Calling switchSection function
            });

            /* End of going to previous section */




            /* 
            	Click event of dropdown list-item 
            	Following is click event on dropdown <li> tag
            */

            $('.popOpt').on('click', 'li', function() {
                var $this = $(this); // Stored instance of li into $this.

                /* 
                	If 'data-val' attributes value present on <li> is 'D'
                	then we are opening otherFamilyConbstruct popup
                	Else
                	If 'data-val' attributes value present on <li> is 'SC' and 'data-cnt' value present on current active section is 3 then we are opening otherFamilyConstruct popup of activ care.
                	Else we just calling switcsection function so that nextSection call be displyed and current section can be hidden. 
                */

                if ($this.attr('data-val') == "D") {
                    $timeout(function() {
                        $('.li-other-construct').attr('data-val', 'D');
                        $('.q-input').removeClass('showOpt-open');
                        $this.closest('.q-input').addClass('showOpt-open');
                        $('.otherFamilyConstruct').show().addClass('ul-activ');
                        //
                    }, 100);
                }
            });

            /* End of click event of dropdown list-item */


            /* Enter event of on page */

            $(document).off('keydown'); // To stop replicating keydown event multiple times we first off keydown event from DOM
            $(document).on('keydown', function(e) {
                var $this = $(this); // Stored current instance
                var screenActive = $('.screen-box.screen-Active'); // Stored instance of current active section class
                /* 
                	This functions actual execution starts if we have e.which = 13 which describes enter event is pressed 
                	and no popup is open 
                */
                if (e.which == 13 && screenActive.length && (!$('.ul-activ').length || scope.pQController.ProductCategory == 'SC')) {
                    var inp = screenActive.find('.pre-input'); // Stored instance of input tag present in current active section
                    var eventCat = ""; // Inilize eventCat

                    /* 
                    	Following switch case checks id value 
                    */

                    switch (inp.attr('id')) {

                        case 'ques_1_age': // If id is 'ques_1_age' that means we are changing age of self   
                            selfAgeChange($('#ques_1_age'));
                            eventCat = "self-age-change";
                            break;
                        case 'ques_4_age': // If id is 'ques_4_age' that means we are changing age of spouse
                            spuseAgeChange($('#ques_4_age'));
                            eventCat = "spouse-age-change";
                            break;
                        case 'ques_4_1_age': // If id is 'ques_4_1_age' that means we are changing age of father
                            familyMemberChange($('#ques_4_1_age'), 'fatherAge', 'father', 18, 99, 4);
                            eventCat = "father-age-change";
                            break;
                        case 'ques_4_2_age': // If id is 'ques_4_2_age' that means we are changing age of mother
                            familyMemberChange($('#ques_4_2_age'), 'motherAge', 'mother', 18, 99, 5);
                            eventCat = "mother-age-change";
                            break;
                        case 'ques_4_3_age': // If id is 'ques_4_3_age' that means we are changing age of father in law
                            familyMemberChange($('#ques_4_3_age'), 'fILAge', 'father-in-law', 18, 99, 6);
                            eventCat = "fil-age-change";
                            break;
                        case 'ques_4_4_age': // If id is 'ques_4_4_age' that means we are changing age of mother in law
                            familyMemberChange($('#ques_4_4_age'), 'mILAge', 'mother-in-law', 18, 99, 7);
                            eventCat = "mil-age-change";
                            break;
                        case 'ques_4_5_age': // If id is 'ques_4_5_age' that means we are changing age of brother
                            familyMemberChange($('#ques_4_5_age'), 'broAge', 'brother', 18, 80, 8);
                            break;
                        case 'ques_4_6_age': // If id is 'ques_4_6_age' that means we are changing age of sister in law
                            familyMemberChange($('#ques_4_6_age'), 'sislAge', 'sister-in-law', 18, 80, 9);
                            break;
                        case 'ques_4_7_age': // If id is 'ques_4_7_age' that means we are changing age of sister
                            familyMemberChange($('#ques_4_7_age'), 'sisAge', 'sister', 18, 80, 10);
                            break;
                        case 'ques_4_8_age': // If id is 'ques_4_8_age' that means we are changing age of brother-in-law
                            familyMemberChange($('#ques_4_8_age'), 'bilAge', 'brother-in-law', 18, 80, 11);
                            break;
                        case 'ques_4_9_age': // If id is 'ques_4_9_age' that means we are changing age of grandfather
                            familyMemberChange($('#ques_4_9_age'), 'gfAge', 'grandfather', 18, 80, 12);
                            break;
                        case 'ques_4_10_age': // If id is 'ques_4_10_age' that means we are changing age of grandmother
                            familyMemberChange($('#ques_4_10_age'), 'gmAge', 'grandmother', 18, 80, 13);
                            break;
                        case 'ques_4_11_age': // If id is 'ques_4_11_age' that means we are changing age of uncle
                            familyMemberChange($('#ques_4_11_age'), 'unAge', 'uncle', 18, 80, 14);
                            break;
                        case 'ques_4_12_age': // If id is 'ques_4_12_age' that means we are changing age of aunt
                            familyMemberChange($('#ques_4_12_age'), 'auAge', 'aunt', 18, 80, 15);
                            break;
                        case 'ques_4_13_age': // If id is 'ques_4_13_age' that means we are changing age of son
                            familyMemberChange($('#ques_4_13_age'), 'soAge', 'son', 18, 80, 16);
                            break;
                        case 'ques_4_14_age': // If id is 'ques_4_14_age' that means we are changing age of daughter-in-law
                            familyMemberChange($('#ques_4_14_age'), 'dilAge', 'daughter-in-law', 18, 80, 17);
                            break;
                        case 'ques_4_15_age': // If id is 'ques_4_15_age' that means we are changing age of daughter
                            familyMemberChange($('#ques_4_15_age'), 'dulAge', 'daughter', 18, 80, 18);
                            break;
                        case 'ques_4_16_age': // If id is 'ques_4_16_age' that means we are changing age of son-in-law
                            familyMemberChange($('#ques_4_16_age'), 'silAge', 'son-in-law', 18, 80, 19);
                            break;
                        case 'ques_4_17_age': // If id is 'ques_4_17_age' that means we are changing age of nephew
                            familyMemberChange($('#ques_4_17_age'), 'npAge', 'nephew', 18, 80, 20);
                            break;
                        case 'ques_4_18_age': // If id is 'ques_4_18_age' that means we are changing age of niece-in-law
                            familyMemberChange($('#ques_4_18_age'), 'nilAge', 'niece-in-law', 18, 80, 21);
                            break;
                        case 'ques_4_19_age': // If id is 'ques_4_19_age' that means we are changing age of niece
                            familyMemberChange($('#ques_4_19_age'), 'niAge', 'niece', 18, 80, 22);
                            break;
                        case 'ques_4_20_age': // If id is 'ques_4_20_age' that means we are changing age of nephew-in-law
                            familyMemberChange($('#ques_4_20_age'), 'nplAge', 'nephew-in-law', 18, 80, 23);
                            break;
                        case 'ques_4_21_age': // If id is 'ques_4_21_age' that means we are changing age of grandson
                            familyMemberChange($('#ques_4_21_age'), 'gsAge', 'grandson', 18, 80, 24);
                            break;
                        case 'ques_4_22_age': // If id is 'ques_4_22_age' that means we are changing age of granddaughter-in-law
                            familyMemberChange($('#ques_4_22_age'), 'gdlAge', 'granddaughter-in-law', 18, 80, 25);
                            break;
                        case 'ques_4_23_age': // If id is 'ques_4_23_age' that means we are changing age of granddaughter
                            familyMemberChange($('#ques_4_23_age'), 'gdAge', 'granddaughter', 18, 80, 26);
                            break;
                        case 'ques_4_24_age': // If id is 'ques_4_24_age' that means we are changing age of grandson-in-law
                            familyMemberChange($('#ques_4_24_age'), 'gslAge', 'grandson-in-law', 18, 80, 27);
                            break;
                        case 'ques_5_age': // If id is 'ques_4_24_age' that means we are selecting kids counnt
                            selectNunberOfKids(true);
                            eventCat = "select-kids";
                            break;
                        case 'ques_7_mobile': // If id is 'ques_7_mobile' that means we are entering mobile
                            mobileChange($('#ques_7_mobile'));
                            eventCat = "enter-mobile";
                            break;
                        case 'ques_7_email': // If id is 'ques_7_email' that means we are entering email
                            $('#check-products').click();
                            break;
                        default:

                            /* 
                            	First we check whether we are changing age of dhild 
                            	Otherwise we are checking whether dropdown is open or
                            	not based on that we open dropdown if dropdown is already open then we use switchSection
                            */

                            if (inp.hasClass('child-age-change')) {
                                lastChildAgeChange(inp);
                                eventCat = "kids-age-change";
                            } else {
                                /* 
                                	This block comes in this else condition only when active section is of dropdown.
                                	If selected value from dropdown is empty in then we manually entering click event of input
                                	so that dropdown will get open.
                                	Else value is selected of dropdown then we move to next section which is written in else block. 
                                */
                                if (inp.val() == "") {
                                    inp.click();
                                } else {
                                    var screenBox = inp.closest('.screen-box');
                                    var nextSection = $(".screen-box[data-section='question-" + screenBox.attr('data-cnt') + "']");
                                    switchSection(screenBox, nextSection, screenBox.attr('data-cnt'));
                                }
                            }
                            break;
                    }
                    /* IF eventcat is prsennt then callGtag function will get trigger. */
                    /*if(eventCat != ""){
                    	$rootScope.callGtag(eventType,'pre-quote','prequote_'+eventCat);
                    }
                    eventType = 'enter'; /* Resetting evetnt Type to enter again */
                }
            });

            /* End of enter event on page */




            /* 
            			Spouse age change function 
            			Following is spouse age change section.
            		*/

            function spuseAgeChange($this) {
                var maxAgeValid = 99; // Maximum age allowed for all categories except SC
                /*if(scope.pQController.ProductCategory == 'SC' && scope.pQController.selectedMembers.Self){
                	maxAgeValid = 80; // Maximum age allowed for SC category
                }*/
                if (scope.pQController.Cover == "PK" || scope.pQController.Cover == "SPK") {
                    if (scope.pQController.Kids > 4) {
                        // If kidscount is greater than 4 then show alert
                        $rootScope.alertConfiguration('E', "Maximum 4 kids are allowed.", "maximum-kids-limit-alert");
                        $rootScope.$apply();
                        return false;
                    } else if (angular.isUndefined(scope.pQController.Kids) || scope.pQController.Kids == "" || scope.pQController.Kids == null || scope.pQController.Kids == '0') {
                        // If kidscount is not entered then show alert
                        $rootScope.alertConfiguration('E', "Please enter number of kids", "kids_age_alert");
                        $rootScope.$apply();
                        return false;
                    }
                }
                if (angular.isUndefined(scope.pQController.spouseAge) || scope.pQController.spouseAge == "" || isNaN(scope.pQController.spouseAge)) { // If spuse isn't selected then show alert
                    $rootScope.alertConfiguration('E', "Please enter Spouse age", "spouse_age_alert");
                } else if (scope.pQController.spouseAge < 18 || scope.pQController.spouseAge > maxAgeValid) {
                    // If spuse age isn't as per valid age
                    $rootScope.alertConfiguration('E', "Age should not be less than 18 and greater than " + maxAgeValid, "spouse_correct-age_alert");
                } else if (scope.pQController.Cover == "PK") {
                    // If family construct selected is PK the next section to be open is of taking kids count
                    selectNunberOfKids(false);
                    var screenBox = $this.closest('.screen-box');
                    var nextSection = $(".screen-box[data-section='question-6']");
                    switchSection(screenBox, nextSection, 3);
                } else if (scope.pQController.Cover == "SP") {
                    // If family construct selected is SP the next section to be open is of mobile number
                    scope.pQController.showForward = false;
                    /*var screenBox = $this.closest('.screen-box');
							var nextSection = $(".screen-box[data-section='question-7']");
					       	switchSection(screenBox,nextSection,4);*/
                } else if (scope.pQController.Cover == "SPK") {
                    // If family construct selected is SP the next section to be open is of taking kids count
                    selectNunberOfKids(false);
                    var screenBox = $this.closest('.screen-box');
                    var nextSection = $(".screen-box[data-section='question-6']");
                    switchSection(screenBox, nextSection, 3);
                } else if (scope.pQController.Cover == "D" || scope.pQController.Cover == "SC") {
                    // If family construct selected is D then next section to be open is decided by differentfamily construct function
                    differentConstruct($this, 3);
                }
                scope.$apply();
            }

            /* Following click event is on right arrow icon which is near spouse age enter section */
            $('.q-sposeAge').on('click', function() {
                $rootScope.callGtag('click-icon', 'pre-quote', 'prequote-next-arrow_[spouse-age-change]');
                spuseAgeChange($('#ques_4_age'))
            });

            /* End of Spouse age change function */

            /* 
            			Family Member change funciton 
            			Following function takes care of age change of all members except kids, self and spouse.
            			It takes 5 parameters,
            			$this :- Current active section.
            			member :- family member.
            			memberText :- RelationwithProposer
            			minAge :- valid minAge for member.
            			maxAge :- Valid maxAge for member
            			step :- number of next step.
            		*/

            function familyMemberChange($this, member, memberText, minAge, maxAge, step) {
                if (scope.pQController.ProductCategory == 'SC' && scope.pQController.selectedMembers.Self) {
                    maxAgeValid = 80;
                }
                if (angular.isUndefined(scope.pQController.selfAge) || scope.pQController.selfAge == "") {
                    $rootScope.alertConfiguration('E', "Please enter Self Age First", "self age error");
                    scope.$apply();
                    return false;
                }
                if (angular.isUndefined(scope.pQController[member]) || scope.pQController[member] == "" || isNaN(scope.pQController[member])) {
                    $rootScope.alertConfiguration('E', "Please enter " + memberText + "'s age", memberText + "_age_alert");
                } else if (scope.pQController[member] < minAge || scope.pQController[member] > maxAge) {
                    $rootScope.alertConfiguration('E', "Age should not be less than " + minAge + " and greater than " + maxAge, memberText + "_correct-age_alert");
                } else if ((scope.pQController[member] <= scope.pQController.selfAge) && scope.pQController.Cover != "SC") {
                    $rootScope.alertConfiguration('E', "Age of " + memberText + " should not be lesser than self.", memberText + "_correct-age_alert");
                } else {
                    differentConstruct($this, step);
                }
                scope.$apply();
            }

            /* End of family member change function */




            /* Other Construct Of Senior citizen age change function click event on right arroe near age change input */

            $('.q-fatherAge').on('click', function(e) {
                familyMemberChange($('#ques_4_1_age'), 'fatherAge', 'father', 18, 99, 4);
                $rootScope.callGtag('click-icon', 'pre-quote', 'prequote-next-arrow_[father-age-change]');
            })

            $('.q-motherAge').on('click', function() {
                familyMemberChange($('#ques_4_2_age'), 'motherAge', 'mother', 18, 99, 5);
                $rootScope.callGtag('click-icon', 'pre-quote', 'prequote-next-arrow_[mother-age-change]');
            });

            $('.q-fILAge').on('click', function(e) {
                familyMemberChange($('#ques_4_3_age'), 'fILAge', 'father-in-law', 18, 99, 6);
                $rootScope.callGtag('click-icon', 'pre-quote', 'prequote-next-arrow_[fil-age-change]');
            });

            $('.q-mILage').on('click', function() {
                familyMemberChange($('#ques_4_4_age'), 'mILAge', 'mother-in-law', 18, 99, 7);
                $rootScope.callGtag('click-icon', 'pre-quote', 'prequote-next-arrow_[mil-age-change]');
            });

            /* Other Construct Of Senior citizen age change function click event on right arroe near age change input  ends */



            /* 
					Next event of different constuct 
					In this section we are passing instance of current active section and flag value.
					Flag value decides which next section to make active
				*/

            function differentConstruct($this, flag) {
                scope.pQController.showForward = true
                if (scope.pQController.selectedMembers.Spouse && flag < 3) {
                    /* 
                    	If 'scope.pQController.selectedMembers.Spouse' is true and flag value is less that 3
                    	then we are activating next section as spouse age enter section.
                    */
                    var screenBox = $this.closest('.screen-box');
                    var nextSection = $(".screen-box[data-section='question-4']");
                    switchSection(screenBox, nextSection, 3);
                } else if (scope.pQController.selectedMembers.Father && flag < 4) {
                    /* 
								If 'scope.pQController.selectedMembers.Father' is true and flag value is less that 4
								then we are activating next section as father age enter section.
							*/
                    var screenBox = $this.closest('.screen-box');
                    var nextSection = $(".screen-box[data-section='question-4_1']");
                    switchSection(screenBox, nextSection, 3);
                } else if (scope.pQController.selectedMembers.Mother && flag < 5) {
                    /* 
								If 'scope.pQController.selectedMembers.Mother' is true and flag value is less that 5
								then we are activating next section as mother age enter section.
							*/
                    var screenBox = $this.closest('.screen-box');
                    var nextSection = $(".screen-box[data-section='question-4_2']");
                    switchSection(screenBox, nextSection, 3);
                } else if ((scope.pQController.selectedMembers['Father-in-law'] || scope.pQController.selectedMembers['Father-In-Law']) && flag < 6) {
                    /* 
								If 'scope.pQController.selectedMembers['Father-in-law']' is true and flag value is less that 6
								then we are activating next section as Father-in-law age enter section.
							*/
                    var screenBox = $this.closest('.screen-box');
                    var nextSection = $(".screen-box[data-section='question-4_3']");
                    switchSection(screenBox, nextSection, 3);
                } else if ((scope.pQController.selectedMembers['Mother-in-law'] || scope.pQController.selectedMembers['Mother-In-Law']) && flag < 7) {
                    /* 
								If 'scope.pQController.selectedMembers['Mother-in-law']' is true and flag value is less that 7
								then we are activating next section as Mother-in-law age enter section.
							*/
                    var screenBox = $this.closest('.screen-box');
                    var nextSection = $(".screen-box[data-section='question-4_4']");
                    switchSection(screenBox, nextSection, 3);
                } else if (scope.pQController.selectedMembers['Kids'] && flag < 8) {
                    /* 
								If 'scope.pQController.selectedMembers['Kids']' is true and flag value is less that 8
								then we are activating next section as Kids age enter section.
							*/
                    selectNunberOfKids(false)
                    var screenBox = $this.closest('.screen-box');
                    var nextSection = $(".screen-box[data-section='question-6']");
                    switchSection(screenBox, nextSection, 3);
                } else {
                    /* 
								If 'scope.pQController.selectedMembers['Kids']' is true and flag value is less that 8
								then we are activating next section as Kids age enter section.
							*/
                    scope.pQController.showForward = false;
                    /*var screenBox = $this.closest('.screen-box');
							var nextSection = $(".screen-box[data-section='question-7']");
					       	switchSection(screenBox,nextSection,4);*/
                }
            }

            /* End of next event of different constuct */



            /* Select number of kids */

            function selectNunberOfKids(param) {
                if (scope.pQController.Kids > 4) {
                    // If kidscount is greater than 4 then show alert
                    $rootScope.alertConfiguration('E', "Maximum 4 kids are allowed.", "maximum-kids-limit-alert");
                    $rootScope.$apply();
                } else if (angular.isUndefined(scope.pQController.Kids) || scope.pQController.Kids == "" || scope.pQController.Kids == null || scope.pQController.Kids == '0') {
                    // If kidscount is not entered then show alert
                    $rootScope.alertConfiguration('E', "Please enter number of kids", "kids_age_alert");
                    $rootScope.$apply();
                }

                // IF kids count is entered and previous kidsObject length is not equal to current count selected by user then only execute following block
                if (angular.isUndefined(scope.pQController.kidsObject) || scope.pQController.kidsObject.length != scope.pQController.Kids) {
                    scope.pQController.kidsObject = [];
                    for (var i = 0; i < scope.pQController.Kids; i++) {
                        scope.pQController.kidsObject.push({
                            id: (i + 1),
                            age: ""
                        })
                    }
                }
                // Next section to made active

            }

            $('.kidsChange').on('click', function() {
                $rootScope.callGtag('click-icon', 'pre-quote', 'prequote-next-arrow_[select-no-kids]');
                selectNunberOfKids($('#ques_5_age'));
            });

            /* End of selecting number of kids */




            /* show and hide Member selction */

            scope.pQController.familyConstructSubmit = function(selectedMember) {
                console.log(selectedMember);
                var memberSelectedArray = {};
                if (angular.isUndefined(selectedMember) || selectedMember == {}) { // if selectedMember is undefined then show alert
                    $rootScope.alertConfiguration('E', "Please select member", "select-member_alert");
                    return false;
                } else {

                    //$rootScope.callGtag('click-button','pre-quote','prequote_different-family-construct-submit');
                    var keepGoing = selectedMember;

                    $('.otherFamilyConstruct').hide().removeClass('ul-activ'); // Hiding other family construct dropdown
                    $('.reg-overlay').fadeOut(); // Hiding overlay div
                    $('.q-input').removeClass('showOpt-open'); // Removing showOpt-open class
                    angular.forEach(selectedMember, function(v, i) {
                        if (i == "Kids") {
                            scope.pQController.showKidsCount = true;
                        }
                    })
                    angular.forEach(keepGoing, function(v, i) {

                        switch (i) {
                            case "Self":
                                memberSelectedArray[0] = i
                                break;
                            case "Spouse":
                                memberSelectedArray[1] = i
                                break;
                            case "Father":
                                memberSelectedArray[2] = i
                                break;
                            case "Mother":
                                memberSelectedArray[3] = i
                                break;
                            case "Father-in-law":
                                memberSelectedArray[4] = i
                                break;
                            case "Mother-in-law":
                                memberSelectedArray[5] = i
                                break;
                            case "Kids":
                                memberSelectedArray[6] = i
                                break;
                        }


                    })

                    for (var i = 0; i < 7; i++) {
                        if (!angular.isUndefined(memberSelectedArray[i])) {
                            if (memberSelectedArray[i] == "Spouse") {
                                $('.screen-4').removeClass('hide-on-load')
                                $('.screen-4').addClass('screen-Active')
                                $('.screen-4_1').addClass('hide-on-load')
                                $('.screen-4_1').removeClass('screen-Active')
                                $('.screen-4_2').addClass('hide-on-load')
                                $('.screen-4_2').removeClass('screen-Active')
                                $('.screen-4_3').addClass('hide-on-load')
                                $('.screen-4_3').removeClass('screen-Active')
                                $('.screen-4_4').addClass('hide-on-load')
                                $('.screen-4_4').removeClass('screen-Active')

                            } else if (memberSelectedArray[i] == "Father") {
                                $('.screen-4_1').removeClass('hide-on-load')
                                $('.screen-4_1').addClass('screen-Active')
                                $('.screen-4').addClass('hide-on-load')
                                $('.screen-4').removeClass('screen-Active')

                            } else if (memberSelectedArray[i] == "Mother") {
                                $('.screen-4_2').removeClass('hide-on-load')
                                $('.screen-4_2').addClass('screen-Active')
                                $('.screen-4').addClass('hide-on-load')
                                $('.screen-4').removeClass('screen-Active')

                            } else if (memberSelectedArray[i] == "Father-in-law") {
                                $('.screen-4_3').removeClass('hide-on-load')
                                $('.screen-4_3').addClass('screen-Active')
                                $('.screen-4').addClass('hide-on-load')
                                $('.screen-4').removeClass('screen-Active')

                            } else if (memberSelectedArray[i] == "Mother-in-law") {
                                $('.screen-4_4').removeClass('hide-on-load')
                                $('.screen-4-4').addClass('screen-Active')
                                $('.screen-4').addClass('hide-on-load')
                                $('.screen-4').removeClass('screen-Active')

                            } else if (memberSelectedArray[i] == "Kids") {
                                scope.pQController.showKidsCount = true
                                $('.screen-4').addClass('hide-on-load')
                                $('.screen-4').removeClass('screen-Active')
                                $('.screen-4_1').addClass('hide-on-load')
                                $('.screen-4_1').removeClass('screen-Active')
                                $('.screen-4_2').addClass('hide-on-load')
                                $('.screen-4_2').removeClass('screen-Active')
                                $('.screen-4_3').addClass('hide-on-load')
                                $('.screen-4_3').removeClass('screen-Active')
                                $('.screen-4_4').addClass('hide-on-load')
                                $('.screen-4_4').removeClass('screen-Active')
                            }
                            if (memberSelectedArray[i] != "Self") {
                                break;
                            }

                        }
                    }
                    //console.log(memberSelectedArray[3]);
                }

            }


            /* show and hide Member selction ends */



            /* incase of Self and Kids only */

            scope.pQController.kidsCountNo = function(param) {
                console.log(scope.pQController.Cover)
                if (scope.pQController.Cover == "SK") {
                    $('.screen-6').removeClass('hide-on-load')
                    $('.screen-6').addClass('screen-Active')
                    $('.screen-4').addClass('hide-on-load')
                    $('.screen-4').removeClass('screen-Active')
                    $('.screen-4_1').addClass('hide-on-load')
                    $('.screen-4_1').removeClass('screen-Active')
                    $('.screen-4_2').addClass('hide-on-load')
                    $('.screen-4_2').removeClass('screen-Active')
                    $('.screen-4_3').addClass('hide-on-load')
                    $('.screen-4_3').removeClass('screen-Active')
                    $('.screen-4_4').addClass('hide-on-load')
                    $('.screen-4_4').removeClass('screen-Active')
                   
                }
                selectNunberOfKids(false)
                console.log(param);
            }

        }
    };

}]);
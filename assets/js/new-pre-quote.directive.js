/*
	Name: Pre Quote Directive
	Description : This directive is used to manipulate pre quote questions section
	Author: Pankaj Patil
	Date: 19-06-2018
*/

var app = angular.module('preQuoteDirective',[]);

app.directive('preQuote',['$timeout','$rootScope',function ($timeout,$rootScope) {
	return {
		scope:{
			pQController : "=preQuote"
		},
		link: function (scope, element, attrs,$location,$anchorScroll){
			  
			  /* 
				  Switch Particular Section 
				  Below function accepts 4 arguments.
				  First argument is current active section.
				  Second argument is next section to made active
				  Third argument is netx step count.
				  Forth agrument is whether goindBack or not indicator
			  */
				
				function switchSection(screenBox,nextSection,count,goingBack){

					/* 
						If next step count is 4 and productCategory is SC i.e Activ Care
						Then validate member age configuration
						As for activ care minimum age of atleast on member should be 55 so that we validate it by using validateSCfunction()
						If its isnt valid then we should alert to user otherwise we allow him to proceed
					*/

						if(count == 4 && scope.pQController.preQuote.ProductCategory == 'SC'){
							if(validateSCfunction() == 'N'){
								$rootScope.alertConfiguration('E',"Atleast one member should have age above 55 and less than 80 years" , "sc-member-age_alert");
								return false;
							}
						}

					/* End */

					/* 
						If next step count is greater than 1 then we show 'back to previous' icon otherwise we hide
						'back to previous' icon.
					*/

						var countSpan = $('.q-count span'); // Instance of span tag which holds step count 
						(count != 1) ? $('.backToPrevious').show() : $('.backToPrevious').hide(); // Whether to show backtoprevious icon or not
						countSpan.text(count+"/4"); // Stored count value recived from argument of this function
						scope.pQController.count = count; // Stored count value recived from argument on scope

					/* End */

					/* If going back is false then we are updateing data-prev attibute value of nextSection with the data-section attribute value of current active section */

						if(!goingBack){
							nextSection.attr('data-prev',screenBox.attr('data-section'));
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

					/* End */

					/* 
						If value of 'data-setion' attribute of next section is 'question-6' 
						then we focus input with id '#ques_kid_1_age' as there can be more than one input
						Else
						we just focus on single input available in nextSection
					*/

						if(nextSection.attr('data-section') == 'question-6'){
							$timeout(function(){
								$('#ques_kid_1_age').focus();
							},200);
						}else{
							nextSection.find('input').focus();
						}

					/* End */

					scope.$apply(); // Apply there change
				}

			/* End of switching particular section */


			/* 
				Go to previous section 
				Following is click event on backToPrevious icon
			*/

				$('.backToPrevious').on('click',function(){
					var $this = $(this); // Stored current instance of backToPrevious
					var screenBox = $('.current-activ'); // Taken current active sections class instance
					var nextSection = $('.screen-box[data-section="'+screenBox.attr('data-prev')+'"]'); // Taken instance of next section to be made active. On every current active section we store classname of previous section in data-prev attribute
					$rootScope.callGtag('click-icon','pre-quote','prequote_back-to_['+nextSection.attr('data-type')+']'); // Calling gtag
					switchSection(screenBox,nextSection,nextSection.attr('data-scroll'),true); // Calling switchSection function
				});

			/* End of going to previous section */


			/* 
				Go to Next section 
				Click event on next section icon
			*/

				var eventType = 'enter'; // Defaulr eventType is enter
				$('.backToNext').on('click',function(){
					eventType = 'click-icon'; // When user clicks on backtonext icon then we are storing eventType value as clickIcon this is because we need to pass event value in gtag function
					$(document).trigger(jQuery.Event('keydown', {which: 13})); // Here we tiggering enter btn using javascript, this will in turn call enter event function 
				});

			/* End of going to previous section */


			/* 
				Click event of dropdown list-item 
				Following is click event on dropdown <li> tag
			*/

				$('.popOpt').on('click','li',function(){
					var $this = $(this); // Stored instance of li into $this.

					/* 
						If 'data-val' attributes value present on <li> is 'D'
						then we are opening otherFamilyConbstruct popup
						Else
						If 'data-val' attributes value present on <li> is 'SC' and 'data-cnt' value present on current active section is 3 then we are opening otherFamilyConstruct popup of activ care.
						Else we just calling switcsection function so that nextSection call be displyed and current section can be hidden. 
					*/

					if($this.attr('data-val') == "D"){
						$timeout(function(){
							$('.li-other-construct').attr('data-val','D');
							$this.closest('.q-input').addClass('showOpt-open');
							$('.otherFamilyConstruct').show().addClass('ul-activ');
						},100);
					}else{
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-"+screenBox.attr('data-cnt')+"']");
						if($this.attr('data-val') == "SC" && screenBox.attr('data-cnt') == "3" ){
							$this.closest('.q-input').addClass('showOpt-open');
							$('.otherFamilyConstruct').show().addClass('ul-activ');
						}else{
							switchSection(screenBox,nextSection,screenBox.attr('data-cnt'));
						}
					}
				});

			/* End of click event of dropdown list-item */


			/* Enter event of on page */

				$(document).off('keydown'); // To stop replicating keydown event multiple times we first off keydown event from DOM
				$(document).on('keydown',function(e){
					var $this = $(this); // Stored current instance
					var screenActive = $('.screen-box.screen-Active'); // Stored instance of current active section class
					/* 
						This functions actual execution starts if we have e.which = 13 which describes enter event is pressed 
						and no popup is open 
					*/
					if(e.which == 13 && screenActive.length && (!$('.ul-activ').length || scope.pQController.preQuote.ProductCategory == 'SC')){
						var inp = screenActive.find('.pre-input'); // Stored instance of input tag present in current active section
						var eventCat = ""; // Inilize eventCat

						/* 
							Following switch case checks id value 
						*/

						switch(inp.attr('id')){

							case 'ques_1_age': // If id is 'ques_1_age' that means we are changing age of self   
								selfAgeChange($('#ques_1_age'));
								eventCat = "self-age-change";
							break;
							case 'ques_4_age': // If id is 'ques_4_age' that means we are changing age of spouse
								spuseAgeChange($('#ques_4_age'));
								eventCat = "spouse-age-change";
							break;
							case 'ques_4_1_age': // If id is 'ques_4_1_age' that means we are changing age of father
								familyMemberChange($('#ques_4_1_age'),'fatherAge','father',18,99,4);
								eventCat = "father-age-change";
							break;
							case 'ques_4_2_age': // If id is 'ques_4_2_age' that means we are changing age of mother
								familyMemberChange($('#ques_4_2_age'),'motherAge','mother',18,99,5);
								eventCat = "mother-age-change";
							break;
							case 'ques_4_3_age': // If id is 'ques_4_3_age' that means we are changing age of father in law
								familyMemberChange($('#ques_4_3_age'),'fILAge','father-in-law',18,99,6);
								eventCat = "fil-age-change";
							break;
							case 'ques_4_4_age': // If id is 'ques_4_4_age' that means we are changing age of mother in law
								familyMemberChange($('#ques_4_4_age'),'mILAge','mother-in-law',18,99,7);
								eventCat = "mil-age-change";
							break;
							case 'ques_4_5_age': // If id is 'ques_4_5_age' that means we are changing age of brother
								familyMemberChange($('#ques_4_5_age'),'broAge','brother',18,80,8);
							break;
							case 'ques_4_6_age': // If id is 'ques_4_6_age' that means we are changing age of sister in law
								familyMemberChange($('#ques_4_6_age'),'sislAge','sister-in-law',18,80,9);
							break;
							case 'ques_4_7_age': // If id is 'ques_4_7_age' that means we are changing age of sister
								familyMemberChange($('#ques_4_7_age'),'sisAge','sister',18,80,10);
							break;
							case 'ques_4_8_age': // If id is 'ques_4_8_age' that means we are changing age of brother-in-law
								familyMemberChange($('#ques_4_8_age'),'bilAge','brother-in-law',18,80,11);
							break;
							case 'ques_4_9_age': // If id is 'ques_4_9_age' that means we are changing age of grandfather
								familyMemberChange($('#ques_4_9_age'),'gfAge','grandfather',18,80,12);
							break;
							case 'ques_4_10_age': // If id is 'ques_4_10_age' that means we are changing age of grandmother
								familyMemberChange($('#ques_4_10_age'),'gmAge','grandmother',18,80,13);
							break;
							case 'ques_4_11_age': // If id is 'ques_4_11_age' that means we are changing age of uncle
								familyMemberChange($('#ques_4_11_age'),'unAge','uncle',18,80,14);
							break;
							case 'ques_4_12_age': // If id is 'ques_4_12_age' that means we are changing age of aunt
								familyMemberChange($('#ques_4_12_age'),'auAge','aunt',18,80,15);
							break;
							case 'ques_4_13_age': // If id is 'ques_4_13_age' that means we are changing age of son
								familyMemberChange($('#ques_4_13_age'),'soAge','son',18,80,16);
							break;
							case 'ques_4_14_age':  // If id is 'ques_4_14_age' that means we are changing age of daughter-in-law
								familyMemberChange($('#ques_4_14_age'),'dilAge','daughter-in-law',18,80,17);
							break;
							case 'ques_4_15_age': // If id is 'ques_4_15_age' that means we are changing age of daughter
								familyMemberChange($('#ques_4_15_age'),'dulAge','daughter',18,80,18);
							break;
							case 'ques_4_16_age': // If id is 'ques_4_16_age' that means we are changing age of son-in-law
								familyMemberChange($('#ques_4_16_age'),'silAge','son-in-law',18,80,19);
							break;
							case 'ques_4_17_age': // If id is 'ques_4_17_age' that means we are changing age of nephew
								familyMemberChange($('#ques_4_17_age'),'npAge','nephew',18,80,20);
							break;
							case 'ques_4_18_age': // If id is 'ques_4_18_age' that means we are changing age of niece-in-law
								familyMemberChange($('#ques_4_18_age'),'nilAge','niece-in-law',18,80,21);
							break;
							case 'ques_4_19_age': // If id is 'ques_4_19_age' that means we are changing age of niece
								familyMemberChange($('#ques_4_19_age'),'niAge','niece',18,80,22);
							break;
							case 'ques_4_20_age': // If id is 'ques_4_20_age' that means we are changing age of nephew-in-law
								familyMemberChange($('#ques_4_20_age'),'nplAge','nephew-in-law',18,80,23);
							break;
							case 'ques_4_21_age': // If id is 'ques_4_21_age' that means we are changing age of grandson
								familyMemberChange($('#ques_4_21_age'),'gsAge','grandson',18,80,24);
							break;
							case 'ques_4_22_age': // If id is 'ques_4_22_age' that means we are changing age of granddaughter-in-law
								familyMemberChange($('#ques_4_22_age'),'gdlAge','granddaughter-in-law',18,80,25);
							break;
							case 'ques_4_23_age': // If id is 'ques_4_23_age' that means we are changing age of granddaughter
								familyMemberChange($('#ques_4_23_age'),'gdAge','granddaughter',18,80,26);
							break;
							case 'ques_4_24_age': // If id is 'ques_4_24_age' that means we are changing age of grandson-in-law
								familyMemberChange($('#ques_4_24_age'),'gslAge','grandson-in-law',18,80,27);
							break;
							case 'ques_5_age': // If id is 'ques_4_24_age' that means we are selecting kids counnt
								selectNunberOfKids($('#ques_5_age'));
								eventCat = "select-kids";
							break;
							case 'ques_7_mobile': // If id is 'ques_7_mobile' that means we are entering mobile
								mobileChange($('#ques_7_mobile'));
								eventCat = "enter-mobile";
							break;
							case 'ques_7_email':  // If id is 'ques_7_email' that means we are entering email
								$('#check-products').click();
							break;
							default:

								/* 
									First we check whether we are changing age of dhild 
									Otherwise we are checking whether dropdown is open or
									not based on that we open dropdown if dropdown is already open then we use switchSection
								*/	

								if(inp.hasClass('child-age-change')){
									lastChildAgeChange(inp);
									eventCat = "kids-age-change";
								}else{
									/* 
										This block comes in this else condition only when active section is of dropdown.
										If selected value from dropdown is empty in then we manually entering click event of input
										so that dropdown will get open.
										Else value is selected of dropdown then we move to next section which is written in else block. 
									*/
									if(inp.val() == ""){
										inp.click();
									}else{
										var screenBox = inp.closest('.screen-box');
										var nextSection = $(".screen-box[data-section='question-"+screenBox.attr('data-cnt')+"']");
										if(nextSection.length != 0){
											switchSection(screenBox,nextSection,screenBox.attr('data-cnt'));
										}
										//switchSection(screenBox,nextSection,screenBox.attr('data-cnt'));
									}
								}
							break;
						}
						/* IF eventcat is prsennt then callGtag function will get trigger. */
						if(eventCat != ""){
							$rootScope.callGtag(eventType,'pre-quote','prequote_'+eventCat);
						}
						eventType = 'enter'; /* Resetting evetnt Type to enter again */
					}
				});

			/* End of enter event on page */


			/* 
				Submit function of family construct submit 
				This is the click event on 'Done' button of other family construct
			*/

				$('.close-other-family-construct').on('click',function(){
					$('.otherFamilyConstruct').hide().removeClass('ul-activ'); // Hiding other family construct dropdown
					$('.reg-overlay').fadeOut(); // Hiding overlay div
					$('.q-input').removeClass('showOpt-open'); // Removing showOpt-open class

					/* 
						IN below if-else we are checking whether user has selected any memmber from otherFamilyConstruct popup
						if 'scope.pQController.selectedMembers' this variable is undefined then we are setting j = 0;
						Else we are checing whether selectedMember has all false value or not if all are false then we are showing alert.
					*/

					if(angular.isUndefined(scope.pQController.selectedMembers)){
						var j = 0;
					}else{
						var j = Object.keys(scope.pQController.selectedMembers).length; // Assigned scope.pQController.selectedMembers length in j
						angular.forEach(scope.pQController.selectedMembers,function(v,i){
							if(!v){
								--j;
							}
						});
					}
					if(j == 0){
						scope.pQController.coverTo = "";
						scope.pQController.preQuote.Cover = "";
						scope.$apply();
					}
				});

				scope.pQController.familyConstructSubmit = function(selectedMember){
					if(angular.isUndefined(selectedMember)){ // if selectedMember is undefined then show alert
						$rootScope.alertConfiguration('E',"Please select member" , "select-member_alert");
					}else{
						var j = Object.keys(selectedMember).length; // Assigned j value to the selectedMember length
						angular.forEach(selectedMember,function(v,i){ // Then checking whether particular selcted member value is selected or not
							if(!v){
								--j;
							}
						});
						if(j == 0){ // If j = 0 then show alert
							$rootScope.alertConfiguration('E',"Please select member" , "select-member_alert");
						}else if(j == 1 && scope.pQController.selectedMembers['Kids']){ // If only kids selected then show alert
							$rootScope.alertConfiguration('E',"Please select other family member alongside kids" , "only-kids-construct_alert");
						}else{ // Else hide OtherFamilyConstruct section and then hiding overlay and activating next section
							$rootScope.callGtag('click-button','pre-quote','prequote_different-family-construct-submit');
							$('.reg-overlay').fadeOut();
							var oFC = $('.otherFamilyConstruct');								
							oFC.hide().removeClass('ul-activ');
							var screenBox = oFC.closest('.screen-box');
							var nextSection = $(".screen-box[data-section='question-3']");
							switchSection(screenBox,nextSection,3);
						}
					}
				}

			/* End of submit function of family construct submit */


			/* 
				To validate activ care relationtypes 
				As in Active care we can select relationships in marital pairs then in below function we are checking whether select relationship
				pair is as per valid relationships or not.
			*/

				function validateActiveCareRelationships(coverTo){
					if(!(coverTo == "Self & Spouse" || coverTo == "Father & Mother" || coverTo == "Father-In-Law & Mother-In-Law" || coverTo == "Brother & Sister-In-Law" || coverTo == "Sister & Brother-In-Law" || coverTo == "Grandfather & Grandmother" || coverTo == "Uncle & Aunt" || coverTo == "Son & Daughter-In-Law" || coverTo == "Daughter & Son-In-Law" || coverTo == "Nephew & Niece-In-Law" || coverTo == "Niece & Nephew-In-Law" || coverTo == "Grandson & Granddaughter-In-Law" || coverTo == "Granddaughter & Grandson-In-Law" || coverTo == "Spouse & Self" || coverTo == "Mother & Father" || coverTo == "Mother-In-Law & Father-In-Law" || coverTo == "Sister-In-Law & Brother" || coverTo == "Brother-In-Law & Sister" || coverTo == "Grandmother & Grandfather" || coverTo == "Aunt & Uncle" || coverTo == "Daughter-In-Law & Son" || coverTo == "Son-In-Law & Daughter" || coverTo == "Niece-In-Law & Nephew" || coverTo == "Nephew-In-Law & Niece" || coverTo == "Granddaughter-In-Law & Grandson" || coverTo == "Grandson-In-Law & Granddaughter")){
						return "invalid";
					}
				}	

			/* End of validating activ care relationtypes */


			/* 
				Submitting the active care family construct 
				Just like different family construct below function validates activ care family constructs
			*/

				scope.pQController.submitActiveCareFamilycontruct = function(selectedMember){
					scope.pQController.coverTo = "";
					if(angular.isUndefined(selectedMember)){
						$rootScope.alertConfiguration('E',"Please select member" , "select-member_alert");
					}else{
						var j = Object.keys(selectedMember).length;
						angular.forEach(selectedMember,function(v,i){
							if(!v){
								--j;
							}else{
								if(scope.pQController.coverTo == ""){
									scope.pQController.coverTo = scope.pQController.coverTo + i;
								}else{
									scope.pQController.coverTo = scope.pQController.coverTo+" & "+i;
								}
							}
						});
						if(j == 0){
							$rootScope.alertConfiguration('E',"Please select member" , "select-member_alert");
						}else if(j > 2){
							$rootScope.alertConfiguration('E',"You can select maximum 2 members." , "select-ac-member_alert");
						}else{
							if(j == 2){
								if(validateActiveCareRelationships(scope.pQController.coverTo) == "invalid"){
									$rootScope.alertConfiguration('E',"Only Spouses are allowed to select" , "select-ac-spouses_alert");
									return false;
								}
							}
							
							$('.ac-overlay').fadeOut();
							var oFC = $('.otherFamilyConstruct');								
							oFC.hide().removeClass('ul-activ');
							var screenBox = oFC.closest('.screen-box');
							var nextSection = $(".screen-box[data-section='question-3']");
							switchSection(screenBox,nextSection,3);
						}
					}
				}

			/* Submitting the active care family construct ends*/


			/* 
				Next event of different constuct 
				In this section we are passing instance of current active section and flag value.
				Flag value decides which next section to make active
			*/

				function differentConstruct($this,flag){
					if(scope.pQController.selectedMembers.Spouse && flag < 3){
						/* 
							If 'scope.pQController.selectedMembers.Spouse' is true and flag value is less that 3
							then we are activating next section as spouse age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers.Father && flag < 4){
						/* 
							If 'scope.pQController.selectedMembers.Father' is true and flag value is less that 4
							then we are activating next section as father age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_1']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers.Mother && flag < 5){
						/* 
							If 'scope.pQController.selectedMembers.Mother' is true and flag value is less that 5
							then we are activating next section as mother age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_2']");
						   switchSection(screenBox,nextSection,3);
					}else if((scope.pQController.selectedMembers['Father-in-law'] || scope.pQController.selectedMembers['Father-In-Law']) && flag < 6){
						/* 
							If 'scope.pQController.selectedMembers['Father-in-law']' is true and flag value is less that 6
							then we are activating next section as Father-in-law age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_3']");
						   switchSection(screenBox,nextSection,3);
					}else if((scope.pQController.selectedMembers['Mother-in-law'] || scope.pQController.selectedMembers['Mother-In-Law']) && flag < 7){
						/* 
							If 'scope.pQController.selectedMembers['Mother-in-law']' is true and flag value is less that 7
							then we are activating next section as Mother-in-law age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_4']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Brother'] && flag < 8){
						/* 
							If 'scope.pQController.selectedMembers['Brother']' is true and flag value is less that 8
							then we are activating next section as Brother age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_5']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Sister-In-Law'] && flag < 9){
						/* 
							If 'scope.pQController.selectedMembers['Sister-In-Law']' is true and flag value is less that 9
							then we are activating next section as Sister-In-Law age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_6']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Sister'] && flag < 10){
						/* 
							If 'scope.pQController.selectedMembers['Sister']' is true and flag value is less that 10
							then we are activating next section as Sister age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_7']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Brother-In-Law'] && flag < 11){
						/* 
							If 'scope.pQController.selectedMembers['Brother-In-Law']' is true and flag value is less that 11
							then we are activating next section as Brother-In-Law age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_8']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Grandfather'] && flag < 12){
						/* 
							If 'scope.pQController.selectedMembers['Grandfather']' is true and flag value is less that 12
							then we are activating next section as Grandfather age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_9']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Grandmother'] && flag < 13){
						/* 
							If 'scope.pQController.selectedMembers['Grandmother']' is true and flag value is less that 13
							then we are activating next section as Grandmother age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_10']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Uncle'] && flag < 14){
						/* 
							If 'scope.pQController.selectedMembers['Uncle']' is true and flag value is less that 14
							then we are activating next section as Grandmother age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_11']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Aunt'] && flag < 15){
						/* 
							If 'scope.pQController.selectedMembers['Aunt']' is true and flag value is less that 15
							then we are activating next section as Aunt age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_12']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Son'] && flag < 16){
						/* 
							If 'scope.pQController.selectedMembers['Son']' is true and flag value is less that 16
							then we are activating next section as Son age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_13']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Daughter-In-Law'] && flag < 17){
						/* 
							If 'scope.pQController.selectedMembers['Daughter-In-Law']' is true and flag value is less that 17
							then we are activating next section as Daughter-In-Law age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_14']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Daughter'] && flag < 18){
						/* 
							If 'scope.pQController.selectedMembers['Daughter']' is true and flag value is less that 18
							then we are activating next section as Daughter age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_15']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Son-In-Law'] && flag < 19){
						/* 
							If 'scope.pQController.selectedMembers['Son-In-Law']' is true and flag value is less that 19
							then we are activating next section as Son-In-Law age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_16']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Nephew'] && flag < 20){
						/* 
							If 'scope.pQController.selectedMembers['Nephew']' is true and flag value is less that 20
							then we are activating next section as Nephew age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_17']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Niece-In-Law'] && flag < 21){
						/* 
							If 'scope.pQController.selectedMembers['Niece-In-Law']' is true and flag value is less that 21
							then we are activating next section as Niece-In-Law age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_18']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Niece'] && flag < 22){
						/* 
							If 'scope.pQController.selectedMembers['Niece']' is true and flag value is less that 22
							then we are activating next section as Niece age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_19']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Nephew-In-Law'] && flag < 23){
						/* 
							If 'scope.pQController.selectedMembers['Nephew-In-Law']' is true and flag value is less that 23
							then we are activating next section as Nephew-In-Law age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_20']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Grandson'] && flag < 24){
						/* 
							If 'scope.pQController.selectedMembers['Grandson']' is true and flag value is less that 24
							then we are activating next section as Grandson age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_21']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Granddaughter-In-Law'] && flag < 25){
						/* 
							If 'scope.pQController.selectedMembers['Granddaughter-In-Law']' is true and flag value is less that 25
							then we are activating next section as Granddaughter-In-Law age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_22']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Granddaughter'] && flag < 26){
						/* 
							If 'scope.pQController.selectedMembers['Granddaughter']' is true and flag value is less that 26
							then we are activating next section as Granddaughter age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_23']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Grandson-In-Law'] && flag < 27){
						/* 
							If 'scope.pQController.selectedMembers['Grandson-In-Law']' is true and flag value is less that 27
							then we are activating next section as Grandson-In-Law age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-4_24']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.selectedMembers['Kids'] && flag < 8){
						/* 
							If 'scope.pQController.selectedMembers['Kids']' is true and flag value is less that 8
							then we are activating next section as Kids age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-5']");
						   switchSection(screenBox,nextSection,3);
					}else{
						/* 
							If 'scope.pQController.selectedMembers['Kids']' is true and flag value is less that 8
							then we are activating next section as Kids age enter section.
						*/
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-7']");
						   switchSection(screenBox,nextSection,4);
					}
				}

			/* End of next event of different constuct */


			/* 
				To Validate SC age 
				In following function we validate age of selected members in activ care category
			*/

				function validateSCfunction(){
					var preQuoteAge = angular.copy(scope.pQController.preQuote);
					delete preQuoteAge.Cover;
					delete preQuoteAge.EmailId;
					delete preQuoteAge.MobileNo;
					delete preQuoteAge.ProductCategory;
					var isAgeValid = false;
					if(scope.pQController.selectedMembers.Self){
						if(parseInt(preQuoteAge.Age) >= 55 || parseInt(preQuoteAge.spouseAge) >= 55 ){
							isAgeValid = true;
						}
					}else{
						delete preQuoteAge.Age;
						angular.forEach(preQuoteAge,function(v,i){
							if(parseInt(v) >= 55){
								isAgeValid = true;
							}
						});
					}
					if(!isAgeValid){
						return "N";
					}
				}

			/* End of validating SC age */


			/* 
				Self age change 
				Below function gets trigger when we are changing self age.
			*/

				function selfAgeChange($this){
					var maxAgeValid = 99; // Maximum age allowed for self is 99
					if(scope.pQController.preQuote.ProductCategory == 'SC' && scope.pQController.selectedMembers.Self){
						maxAgeValid = 80; // If selected product catrgeoy is SC and self is insured member then max age for self is 80.
					}
					if(angular.isUndefined(scope.pQController.preQuote.Age) || scope.pQController.preQuote.Age == "" || isNaN(scope.pQController.preQuote.Age)){ // If selft age isn't selected then we are showing alert to select age
						$rootScope.alertConfiguration('E',"Please enter age","self_age_alert");
					}else if(scope.pQController.preQuote.Age < 18 || scope.pQController.preQuote.Age > maxAgeValid){
						// If age is less then 18 and greater than maximum age then showing alert related to that
						$rootScope.alertConfiguration('E',"Age should not be less than 18 and greater than "+maxAgeValid,"self_correct-age_age");
					}else{
						/* Now we are checking selected family conrtcut configuration */
						switch(scope.pQController.preQuote.Cover) {
							case 'S': // If 'S' then we are directly activating next section as mobile section
								   var screenBox = $this.closest('.screen-box');
								var nextSection = $(".screen-box[data-section='question-7']");
								   switchSection(screenBox,nextSection,4);
								break;
							case 'SP': // IF 'SP' then we are directly activating next section as spouse age enter section
								   var screenBox = $this.closest('.screen-box');
								var nextSection = $(".screen-box[data-section='question-4']");
								   switchSection(screenBox,nextSection,3);
								break;
							case 'SK': // IF 'SK' then we are directly activating next section as kids age enter section
								   var screenBox = $this.closest('.screen-box');
								var nextSection = $(".screen-box[data-section='question-5']");
								   switchSection(screenBox,nextSection,3);
								break;
							case 'SPK': // IF 'SPK' then we are directly activating next section as spouse age enter section
								   var screenBox = $this.closest('.screen-box');
								var nextSection = $(".screen-box[data-section='question-4']");
								   switchSection(screenBox,nextSection,3);
								break;
							case 'PK': // IF 'PK' then we are directly activating next section as spouse age enter section
								   var screenBox = $this.closest('.screen-box');
								var nextSection = $(".screen-box[data-section='question-4']");
								   switchSection(screenBox,nextSection,3);
								break;
							case 'D': // IF 'D' then we are directly activating next section as per following function
								differentConstruct($this,2);
								break;
							case 'SC': // IF 'SC' then we are directly activating next section as per following function
								differentConstruct($this,2);
								break;
							default:
							return;
						}
					}
					scope.$apply();
				}

				/* Following click event is on right arrow icon which is near self age enter section */
				$('.q-enternextAge').on('click',function(){
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[self-age-change]');
					selfAgeChange($('#ques_1_age'));
				});

			/* End of self age change */


			/* 
				Spouse age change function 
				Following is spouse age change section.
			*/

				function spuseAgeChange($this){
					var maxAgeValid = 99; // Maximum age allowed for all categories except SC
					if(scope.pQController.preQuote.ProductCategory == 'SC' && scope.pQController.selectedMembers.Self){
						maxAgeValid = 80; // Maximum age allowed for SC category
					}
					if(angular.isUndefined(scope.pQController.preQuote.spouseAge) || scope.pQController.preQuote.spouseAge == "" || isNaN(scope.pQController.preQuote.spouseAge)){ // If spuse isn't selected then show alert
						$rootScope.alertConfiguration('E',"Please enter Spouse age","spouse_age_alert");
					}else if(scope.pQController.preQuote.spouseAge < 18 || scope.pQController.preQuote.spouseAge > maxAgeValid){
						// If spuse age isn't as per valid age
						$rootScope.alertConfiguration('E',"Age should not be less than 18 and greater than "+maxAgeValid , "spouse_correct-age_alert");
					}else if(scope.pQController.preQuote.Cover == "PK"){
						// If family construct selected is PK the next section to be open is of taking kids count
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-5']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.preQuote.Cover == "SP"){
						// If family construct selected is SP the next section to be open is of mobile number
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-7']");
						   switchSection(screenBox,nextSection,4);
					}else if(scope.pQController.preQuote.Cover == "SPK"){
						// If family construct selected is SP the next section to be open is of taking kids count
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-5']");
						   switchSection(screenBox,nextSection,3);
					}else if(scope.pQController.preQuote.Cover == "D" || scope.pQController.preQuote.Cover == "SC"){
						// If family construct selected is D then next section to be open is decided by differentfamily construct function
						differentConstruct($this,3);
					}
					scope.$apply();
				}

				/* Following click event is on right arrow icon which is near spouse age enter section */
				$('.q-sposeAge').on('click',function(){
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[spouse-age-change]');
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

				function familyMemberChange($this,member,memberText,minAge,maxAge,step){
					if(scope.pQController.preQuote.ProductCategory == 'SC' && scope.pQController.selectedMembers.Self){
						maxAgeValid = 80;
					}
					if(angular.isUndefined(scope.pQController.preQuote[member]) || scope.pQController.preQuote[member] == "" || isNaN(scope.pQController.preQuote[member])){
						$rootScope.alertConfiguration('E',"Please enter "+memberText+"'s age" , memberText+"_age_alert");
					}else if(scope.pQController.preQuote[member] < minAge || scope.pQController.preQuote[member] > maxAge){
						$rootScope.alertConfiguration('E',"Age should not be less than "+minAge+" and greater than "+maxAge , memberText+"_correct-age_alert");
					}else if((scope.pQController.preQuote[member] <= scope.pQController.preQuote.Age) && scope.pQController.preQuote.Cover != "SC"){
						$rootScope.alertConfiguration('E',"Age of "+memberText+" should not be lesser than self.",memberText+"_correct-age_alert");
					}else{
						differentConstruct($this,step);
					}
					scope.$apply();
				}

			/* End of family member change function */


			/* Other Construct Of Senior citizen age change function click event on right arroe near age change input */

				$('.q-fatherAge').on('click',function(e){
					familyMemberChange($('#ques_4_1_age'),'fatherAge','father',18,99,4);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[father-age-change]');
				})

				$('.q-motherAge').on('click',function(){
					familyMemberChange($('#ques_4_2_age'),'motherAge','mother',18,99,5);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[mother-age-change]');
				});

				$('.q-fILAge').on('click',function(e){
					familyMemberChange($('#ques_4_3_age'),'fILAge','father-in-law',18,99,6);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[fil-age-change]');
				});

				$('.q-mILage').on('click',function(){
					familyMemberChange($('#ques_4_4_age'),'mILAge','mother-in-law',18,99,7);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[mil-age-change]');
				});

				$('.q-broage').on('click',function(){
					familyMemberChange($('#ques_4_5_age'),'broAge','brother',18,80,8);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[bro-age-change]');
				});

				$('.q-sislage').on('click',function(){
					familyMemberChange($('#ques_4_6_age'),'sislAge','sister-in-law',18,80,9);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[sisl-age-change]');
				});

				$('.q-sisage').on('click',function(){
					familyMemberChange($('#ques_4_7_age'),'sisAge','sister',18,80,10);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[sis-age-change]');
				});

				$('.q-bilage').on('click',function(){
					familyMemberChange($('#ques_4_8_age'),'bilAge','brother-in-law',18,80,11);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[bil-age-change]');
				});

				$('.q-gfage').on('click',function(){
					familyMemberChange($('#ques_4_9_age'),'gfAge','grandfather',18,80,12);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[gf-age-change]');
				});

				$('.q-gmage').on('click',function(){
					familyMemberChange($('#ques_4_10_age'),'gmAge','grandmother',18,80,13);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[gm-age-change]');
				});

				$('.q-unage').on('click',function(){
					familyMemberChange($('#ques_4_11_age'),'unAge','uncle',18,80,14);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[un-age-change]');
				});

				$('.q-auage').on('click',function(){
					familyMemberChange($('#ques_4_12_age'),'auAge','aunt',18,80,15);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[au-age-change]');
				});

				$('.q-soage').on('click',function(){
					familyMemberChange($('#ques_4_13_age'),'soAge','son',18,80,16);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[so-age-change]');
				});

				$('.q-dilage').on('click',function(){
					familyMemberChange($('#ques_4_14_age'),'dilAge','daughter-in-law',18,80,17);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[dil-age-change]');
				});

				$('.q-dulage').on('click',function(){
					familyMemberChange($('#ques_4_15_age'),'dulAge','daughter',18,80,18);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[dul-age-change]');
				});

				$('.q-silage').on('click',function(){
					familyMemberChange($('#ques_4_16_age'),'silAge','son-in-law',18,80,19);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[sil-age-change]');
				});

				$('.q-npage').on('click',function(){
					familyMemberChange($('#ques_4_17_age'),'npAge','nephew',18,80,20);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[np-age-change]');
				});

				$('.q-nilage').on('click',function(){
					familyMemberChange($('#ques_4_18_age'),'nilAge','niece-in-law',18,80,21);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[nil-age-change]');
				});

				$('.q-niage').on('click',function(){
					familyMemberChange($('#ques_4_19_age'),'niAge','niece',18,80,22);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[ni-age-change]');
				});

				$('.q-nplage').on('click',function(){
					familyMemberChange($('#ques_4_20_age'),'nplAge','nephew-in-law',18,80,23);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[npl-age-change]');
				});

				$('.q-gsage').on('click',function(){
					familyMemberChange($('#ques_4_21_age'),'gsAge','grandson',18,80,24);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[gs-age-change]');
				});

				$('.q-gdlage').on('click',function(){
					familyMemberChange($('#ques_4_22_age'),'gdlAge','granddaughter-in-law',18,80,25);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[gdl-age-change]');
				});

				$('.q-gdage').on('click',function(){
					familyMemberChange($('#ques_4_23_age'),'gdAge','granddaughter',18,80,26);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[gd-age-change]');
				});

				$('.q-gslage').on('click',function(){
					familyMemberChange($('#ques_4_24_age'),'gslAge','grandson-in-law',18,80,27);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[gsl-age-change]');
				});
						
			/* Other Construct Of Senior citizen age change function */


			/* Select number of kids */

				function selectNunberOfKids($this){
					if(scope.pQController.preQuote.Kids > 4){
						// If kidscount is greater than 4 then show alert
						$rootScope.alertConfiguration('E',"Maximum 4 kids are allowed." ,"maximum-kids-limit-alert");
						$rootScope.$apply();
					}else if(angular.isUndefined(scope.pQController.preQuote.Kids) || scope.pQController.preQuote.Kids == "" || scope.pQController.preQuote.Kids == null || scope.pQController.preQuote.Kids == '0'){
						// If kidscount is not entered then show alert
						$rootScope.alertConfiguration('E',"Please enter number of kids", "kids_age_alert");
						$rootScope.$apply();
					}else{
						// IF kids count is entered and previous kidsObject length is not equal to current count selected by user then only execute following block
						if(angular.isUndefined(scope.pQController.kidsObject) || scope.pQController.kidsObject.length != scope.pQController.preQuote.Kids){
							scope.pQController.kidsObject = [];
							for(var i = 0; i < scope.pQController.preQuote.Kids;i++){
								scope.pQController.kidsObject.push({
									id: (i+1),
									age: ""
								})
							}
						}
						// Next section to made active
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-6']");
						switchSection(screenBox,nextSection,3);
					}
				}

				$('.kidsChange').on('click',function(){
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[select-no-kids]');
					selectNunberOfKids($('#ques_5_age'));
				});

			/* End of selecting number of kids */


			/* Change event of last child value */

				function lastChildAgeChange($this){
					var isProceed = true;
					var errors = "<ul>";
					var errorsCount = 0;
					var supText;
					angular.forEach(scope.pQController.kidsObject,function(v,i){
						if(i == 0){
							supText = "first";
						}else if( i == 1){
							supText = "second";
						}else if(i == 2){
							supText = "third";
						}else{
							supText = "forth";
						}
						if(v.age == "" || v.age == null || angular.isUndefined(v.age)){
							errors = errors+"<li><p>Please enter age of "+supText+" child. </p></li>";
							errorsCount = errorsCount + 1;								
						}
						if(parseInt(v.age) >= parseInt(scope.pQController.preQuote.Age)){
							errors = errors+"<li><p>Age of "+supText+" child should not be greater than self age.</p></li>";
							errorsCount = errorsCount + 1;			
						}
					});
					if(errorsCount == 0){
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-7']");
						   switchSection(screenBox,nextSection,4);
					}else{
						$rootScope.alertConfiguration('E',errors , "kids_age_alert");
					}
					scope.$apply();
				}

				$(document).on('click','.q-kidsAge',function(){
					var $this = $(this);
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[kids-age-change]');
					lastChildAgeChange($this.closest('.sonsdaugh-xs').find('.child-age-change'));
				});

			/* End of change event of last child value */


			/* Mobile number change functions */

				function mobileChange($this){
					var mobileNumber = $this.val();
					var mobileErrorMessage = "";
					// if(mobileNumber.length != 10){
					// 	mobileErrorMessage = "<p>Please enter valid mobile number.</p><p>Mobile number should contain minimum & maximum 10 digits.</p>";
					// }else if(/^(\d)\1\1\1\1\1\1\1\1\1$/.test(mobileNumber)){
					// 	mobileErrorMessage = "<p>Please enter valid mobile number.</p><p>All digits should not be same.</p>";
					// }else if(!/^[6-9]\d{9}$/.test(mobileNumber)){
					// 	mobileErrorMessage = "<p>Please enter valid mobile number.</p><p>Mobile number should start from 6,7,8,9</p>";
					// }

					if(mobileNumber.length != 10 || (/^(\d)\1\1\1\1\1\1\1\1\1$/.test(mobileNumber)) || (!/^[6-9]\d{9}$/.test(mobileNumber))){
						mobileErrorMessage = "<p>Please enter your correct mobile number.</p>";
						$rootScope.callGtag('alert','pre-quote','prequote_correct-mobile-no-alert');
					}
					if(mobileErrorMessage == ""){
						var screenBox = $this.closest('.screen-box');
						var nextSection = $(".screen-box[data-section='question-8']");
						   switchSection(screenBox,nextSection,4);
					}else{
						$rootScope.alertConfiguration('E',mobileErrorMessage);
					}
					scope.$apply();
				}

				$('.q-mobileNo').on('click',function(){
					$rootScope.callGtag('click-icon','pre-quote','prequote-next-arrow_[mobile-no-change]');
					mobileChange($('#ques_7_mobile'));
				});

			/* End of mobile number change functions */

		}     
	};
}]);

/* End of PRe Quote directive */

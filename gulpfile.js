var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var gutil = require('gulp-util');
var concat = require('gulp-concat-util');
var htmlmin = require('gulp-htmlmin');

gulp.task('html', function() {
    return gulp.src([ 
      
        "app/header/header.html",
        "app/pre-quote/pre-quote.html",
        "app/refer-friend/refer-friend.html",
        "app/refer-friend-new/refer-friend-new.html",
        "app/new-prod-test/new-pre-quote.html",
        "app/ext-pre-quote/ext-pre-quote.html",
        "app/pa-quote/pa-v2-quote.html",
        "app/new-product-Quote-page/product-pre-quote.html",
        "app/new-hili/new-hili.html",
        "app/whats-app-call/whats-app-call.html",
        "app/alert-modal/alertModal.component.html",
        "app/reco/reco.html",
        "app/plans/plans.html",
        "app/aa-quote/aa-quote.html",
        "app/platinum-quote/platinum-quote.html",
        "app/platinum-quote-v2/platinum-quote-v2.html",
        "app/ci-quote/ci-quote.html",
        "app/cs-quote/cs-quote.html",
        "app/pa-quote/pa-quote.html",
        "app/pa-customize-quote/pa-customize-quote.html",
        "app/shared-template/add-member.html",
        "app/proposer-details/proposer-details.html",
        "app/insured-detail/insured-detail.html",
        "app/health-lifestyle/health-lifestyle.html",
        "app/health-lifestyle-new/health-lifestyle-new.html",
        "app/declaration/declaration.html",
        "app/shared-template/payment-processing.html",
        "app/cross-sell-quote/cross-sell-quote.html",
        "app/url-process/url-processing.html",
        "app/thank-you/thank-you.html",
        "app/post-payment/post-payment.html",
        "app/payment-done/payment-done.html",
        "app/shared-template/activ-care-add-member.html",
        "app/activ-care/activ-care-quote.html",
        "app/corona-kavach/corona-kavach-quote.html",
        "app/diamond-quote/diamond-quote.html",
        "app/sales-preminum-cal/sales-preminum-cal.html",
        "app/arogya-sanjeevani/arogya-sanjeevani-quote.html",
        "app/calculate-premium/calculate-preminum.html",
        // "app/citi-processing/citi-processing.html",
        // "app/tax-tool/tax-tool.html",
        // "app/tax-tool/tax-tool-detail.html",
        "app/web-agg/web-agg.html",
          /* VIL Html Files */
          "app/vil/vil-login/vil-login.html",
          "app/vil/vil-raise-track/vil-raise-track.html",
          "app/vil/vil-raise/vil-raise.html",
          "app/vil/vil-track/vil-track.html",
          /* End of VIL Html Files */
          /* editable-proposal form */
        "app/editable-proposal/editable-proposal.html",
        /* editable-proposal form */
        /* product detail form */
        "app/product-details/product-detail.html",
        "app/product-details/idfc-pasa.html",
        /* product detail form */
        /*IDFC PASA*/
        "app/product-details/idfc-pasa.html",

        "app/counter-offer/counter-offer-login/counter-offer-login.html",
        "app/counter-offer/counter-offer-quote/counter-offer-quote.html",

        /*New Renew Html Files */
        "app/new-renew/partials-work/renewal-renew.html",
        "app/new-renew/partials-work/new-renewal-landing.html",
        "app/new-renew/partials-work/renewal-view-member-landing.html",
        "app/new-renew/partials-work/renewal-edit-optional-covers.html",
        "app/new-renew/partials-work/renewal-edit-member-landing.html",
        "app/new-renew/partials-work/renewal-view-member-add-user.html",
        "app/new-renew/partials-work/renewal-edit-nominee-details-landing.html",
        "app/new-renew/partials-work/renewal-increase-policy-tenure-landing.html",
        "app/new-renew/partials-work/renewal-increase-sum-insured-landing.html",
        "app/new-renew/partials-work/renewal-upgrade-zone-landing.html",
        "app/new-renew/partials-work/renewal-change-address-details.html",
        "app/new-renew/partials-work/renewal-renew-thank-you.html",
        "app/new-renew/partials-work/renewal-payment-processing.html",
        "app/new-renew/partials-work/renewal-url-processing.html",
        "app/new-renew/partials-work/renewal-renew-dropout.html",
        "app/new-renew/directives/header-details.directive.html",
        /*End of New Renew Html Files */

        /* Axis Telesales Renew Html Files */
        "app/axis-telesales-renew/axis-telesales-renew-policy/axis-telesales-renew-policy.html",
        /* End of Axis Telesales Renew Html Files */
        // Part Payment Html Files
        "app/part-pay/part-pay.html",
        /* Part Payment Html Files*/
        "app/part-payment/partials-work/pp-login.html",
         /* End of Part Payment Html Files*/
        "app/activ-fit-quote/activ-fit-quote.html",
        "app/jus-pay-status/jus-pay-status.html",
        "app/profile-update/customer-profile.html",
        "app/pharmeasy/pharmeasy.html",
        "app/terms-conditions/terms-conditions.html",
        "app/group-activ-travel/group-activ-travel.html"
    ],{'partials-work': 'partials-work'})
    .pipe(htmlmin({collapseWhitespace: true,ignoreCustomComments:true}))
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('partials'));
});

gulp.task('js',async function(){
    gulp.src([
        /*"node_modules/jquery/dist/jquery.min.js",*/
        "node_modules/jquery/dist/jquery.min.js",
        // "node_modules/jquery-ui-dist/jquery-ui.min.js",
        "node_modules/bootstrap/dist/js/bootstrap.js",
        "node_modules/countup/countUp.js",
        "node_modules/angular/angular.js",
        "node_modules/angular-route/angular-route.min.js",
        "assets/js/ngStorage.min.js",
        "node_modules/countup/angular-countUp.js",
        "node_modules/oclazyload/dist/ocLazyLoad.min.js",
        'app.module.js',
        'app/shared/app.service.js',
        'app/shared/productValidation.service.js',
        'app/shared/app.directive.js',
        'app/shared/help-to-buy.controller.js',
        'app/alert-modal/alertModal.component.js',
        'app/shared/app.filter.js',
        /*New Renew Js Files */
        "app/new-renew/services/renew.service.js",
        /*End of New Renew Js Files */
    ])
    .pipe(concat.scripts('all.js'))
    /*.pipe(uglify({ mangle: false }))*/
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(gulp.dest('assets/js/'));
});

gulp.task('js-min',async function(){
    gulp.src([
        "node_modules/owlcarousel/owl-carousel/owl.carousel.js",
        "node_modules/slick-carousel/slick/slick.js",
        "node_modules/angular-slick-carousel/dist/angular-slick.min.js",
        "app/pre-quote/pre-quote.controller.js",
        "app/refer-friend/refer-friend.controller.js",
        "app/refer-friend-new/refer-friend-new.controller.js",
        "app/new-prod-test/new-pre-quote.controller.js",
         "app/new-hili/new-hili.controller.js",
        "app/ext-pre-quote/ext-pre-quote.controller.js",
        
        "app/whats-app-call/whats-app-call.controller.js",
        "app/new-product-Quote-page/product-pre-quote.js",
        "app/pre-quote/pre-quote.directive.js",
        "app/refer-friend/refer-friend.directive.js",
        // "app/refer-friend-new/refer-friend-new.directive.js",
        "app/new-prod-test/new-pre-quote.directive.js",
        "app/reco/reco.controller.js",
        "app/plans/plans.controller.js",
        "app/aa-quote/aa-quote.controller.js",
        "app/platinum-quote/platinum-quote.controller.js",
        "app/platinum-quote-v2/platinum-quote-v2.controller.js",
        "app/ci-quote/ci-quote.controller.js",
        "app/cs-quote/cs-quote.controller.js",
        "app/pa-quote/pa-quote.controller.js",
        "app/pa-customize-quote/pa-cust-quote.controller.js",
        "app/shared/addMember.directive.js",
        "app/proposer-details/proposer-details.controller.js",
        "app/insured-detail/insured-details.controller.js",
        "app/health-lifestyle/health-lifestyle.controller.js",
        "app/health-lifestyle-new/health-lifestyle-new.controller.js",
        "app/declaration/declaration.controller.js",
        "app/shared/payment-processing.controller.js",
        "app/cross-sell-quote/cross-sell-quote.js",
        "app/url-process/url-processing.controller.js",
        "app/thank-you/thank-you.controller.js",
        "app/post-payment/post-payment.controller.js",
        "app/payment-done/payment-done.controller.js",
        "app/shared/aCAddMember.directive.js",
        "app/activ-care/activ-care-quote.controller.js",
        "app/calculate-premium/calculate-preminum.controller.js",
        "app/calculate-premium/calculate-preminum.directive.js",
        // "app/citi-processing/citi-processing.controller.js",
        "app/corona-kavach/corona-kavach-quote.controller.js",
        "app/diamond-quote/diamond-quote.controller.js",
        "app/sales-preminum-cal/sales-preminum-cal.controller.js",
        "app/arogya-sanjeevani/arogya-sanjeevani-quote.controller.js",
        // "app/tax-tool/tax-tool.controller.js",
        // "app/tax-tool/tax-tool-detail.controller.js",
        "app/web-agg/web-agg.controller.js",
         /*editable proposal Js Files */
         "app/product-details/product-detail.controller.js",
        /*editable proposal Js Files */
        /*editable proposal Js Files */
        "app/editable-proposal/editable-proposal-controller.js",
        /*editable proposal Js Files */
         /* VIL Js Files */
         "app/vil/vil-login/vil-login.controller.js",
         "app/vil/vil-raise-track/vil-raise-track.controller.js",
         "app/vil/vil-raise/vil-raise.controller.js",
         "app/vil/vil-track/vil-track.controller.js",
         /* End of VIL Js Files */

         "app/counter-offer/counter-offer-login/counter-offer-login.controller.js",
         "app/counter-offer/counter-offer-quote/counter-offer-quote.controller.js",
         "app/counter-offer/counter-offer-payment/cfr-payment-processing.controller.js",


        /*New Renew Js Files */
        "app/new-renew/controllers/renewal-renew.js",
        "app/new-renew/controllers/new-renewal-landing.js",
        "app/new-renew/controllers/renewal-view-member-landing.js",
        "app/new-renew/controllers/renewal-edit-member-landing.js",
        "app/new-renew/controllers/renewal-view-member-add-user.js",
        "app/new-renew/controllers/renewal-edit-nominee-details-landing.js",
        "app/new-renew/controllers/renewal-increase-policy-tenure-landing.js",
        "app/new-renew/controllers/renewal-increase-sum-insured-landing.js",
        "app/new-renew/controllers/renewal-upgrade-zone-landing.js",
        "app/new-renew/controllers/renewal-change-address-details.js",
        "app/new-renew/controllers/renewal-renew-thank-you.js",
        "app/new-renew/controllers/renewal-payment-processing.js",
        "app/new-renew/controllers/renewPaymentProcess.js",
        "app/new-renew/controllers/renewal-url-processing.js",
        "app/new-renew/controllers/renewal-renew-dropout.js",
        "app/new-renew/directives/header-details.directive.js",
        /*End of New Renew Js Files */

        /* Axis Telesales Renew Js Files */
        "app/axis-telesales-renew/axis-telesales-renew-policy/axis-telesales-renew-policy.controller.js",
        /* End of Axis Telesales Renew Js Files */
        // Part Payment Html Files
        "app/part-pay/part-pay.controller.js",
        // Enf of Part Payment Html Files


        /* Part Payment Js Files*/
        "app/part-payment/controllers/pp-login.js",
        "app/part-payment/controllers/part-payment-processing.controller.js",
        "app/part-payment/controllers/partPaymentProcess.js",
         /* End of Part Payment Js Files*/
        "app/activ-fit-quote/activ-fit-quote.controller.js",
        "app/jus-pay-status/jus-pay-status.controller.js",
        "app/profile-update/customer-profile.controller.js",
        "app/pharmeasy/pharmeasy.controller.js",
        "app/terms-conditions/terms-conditions.controller.js",
        "app/group-activ-travel/group-activ-travel.controller.js"      
    ])

   /*.pipe(uglify({ mangle: false }))*/
   .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
   .pipe(gulp.dest('assets/js/'))
});

gulp.task('css',async function(){
   gulp.src([
        "node_modules/bootstrap/dist/css/bootstrap.min.css",
        "node_modules/font-awesome/css/font-awesome.min.css",
        "assets/css/fonts.css",

        "assets/css/pretty.css",
        "assets/css/custom.css",
        "assets/css/new-hindi.css"
      ])
   .pipe(concat('all.css'))
   .pipe(minify({ keepSpecialComments: 1, processImport: false }))
   .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
   .pipe(gulp.dest('assets/css/'));
});

gulp.task('css-min',async function(){
   gulp.src([
      "node_modules/owlcarousel/owl-carousel/owl.carousel.css",
      "node_modules/slick-carousel/slick/slick.css",
      "node_modules/slick-carousel/slick/slick-theme.css",
      "app/pre-quote/pre-quote.css",
      "app/refer-friend/refer-friend.css",
      "app/refer-friend-new/refer-friend-new.css",
      "app/new-hili/new-hili.css",

      "app/new-prod-test/new-pre-quote.css",
      "app/reco/reco.css",
      "app/plans/plans.css",
      "app/aa-quote/aa-quote.css",
      "app/platinum-quote/platinum-quote.css",
      "app/platinum-quote-v2/platinum-quote-v2.css",
      "app/ci-quote/ci-quote.css",
      "app/cs-quote/cs-quote.css",
      "app/pa-quote/pa-quote.css",
      "app/proposer-details/proposer-details.css",
      "app/insured-detail/insured-detail.css",
      "app/health-lifestyle/health-lifestyle.css",
      "app/health-lifestyle-new/health-lifestyle-new.css",
      "app/declaration/declaration.css",
      "app/post-payment/post-payment.css",
      "app/thank-you/thank-you.css",
      "app/activ-care/activ-care-add-modal.css",
      "app/activ-care/activ-care-quote.css",
      "app/corona-kavach/corona-kavach-quote.css",
      "app/diamond-quote/diamond-quote.css",
      "app/sales-preminum-cal/sales-preminum-cal.css",
      "app/arogya-sanjeevani/arogya-sanjeevani-quote.css",
      // "app/tax-tool/tax-tool.css",
      "app/calculate-premium/calculate-preminum.css",
      /*New Renew Css Files */
      "app/new-renew/css/renewal-new-quick-renew.css",
      "app/new-renew/css/new-renewal.css",
      /*End of New Renew Css Files */

      /* editable-proposal form */
      "app/editable-proposal/editable-proposal.css",
      /* editable-proposal form */
      /* VIL Css Files */
        "app/vil/vil-login/vil-login.css",
        "app/vil/vil-raise-track/vil-raise-track.css",
        "app/vil/vil-raise/vil-raise.css",
        "app/vil/vil-track/vil-track.css",
     /* End of VIL Css Files */
      /* product detail form */
      "app/product-details/product-detail.css",
      /* product detail form */
      /* Axis Telesales Renew Css Files */
      "app/axis-telesales-renew/axis-telesales-renew-policy/axis-telesales-renew-policy.css",
      /* End of Axis Telesales Renew Css Files */

      // Part Payment cssHtml Files
      "app/part-pay/part-pay.css",
      // Enf of Part Payment css Files

     /*Part Payment Css Files */
      "app/part-payment/css/part-payment.css",
      /*End of Part Payment Css Files */
      "app/activ-fit-quote/activ-fit-quote.css",
      "app/jus-pay-status/jus-pay-status.css",
      "app/profile-update/customer-profile.css",
      "app/pharmeasy/pharmeasy.css",
      "app/terms-conditions/terms-conditions.css",
      "app/counter-offer/counter-offer.css",
      "app/group-activ-travel/group-activ-travel.css",
    ])
   .pipe(minify({ keepSpecialComments: 1, processImport: false }))
   .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
   .pipe(gulp.dest('assets/css-min/'));
});

gulp.task('default',gulp.series('html','js','css','js-min','css-min'),function(){
});

gulp.task('watch', function() {
    gulp.watch([
        "node_modules/jquery/dist/jquery.min.js",
        "node_modules/countup/countUp.js",
        "node_modules/angular/angular.js",
        "node_modules/angular-route/angular-route.min.js",
        "node_modules/countup/angular-countUp.js",
        "node_modules/oclazyload/dist/ocLazyLoad.min.js",
        'app.module.js',
        'app/shared/app.service.js',
        'app/shared/productValidation.service.js',
        'app/shared/help-to-buy.controller.js',
        'app/shared/app.directive.js',
        'app/alert-modal/alertModal.component.js',
        'app/shared/app.filter.js',
        /*New Renew Js Files */
        "app/new-renew/services/renew.service.js",
        /*End of New Renew Js Files */
    ], gulp.series('js'));
    gulp.watch([
        "node_modules/owlcarousel/owl-carousel/owl.carousel.js",
        "node_modules/slick-carousel/slick/slick.js",
        "node_modules/angular-slick-carousel/dist/angular-slick.min.js",
        "app/pre-quote/pre-quote.controller.js",
        "app/refer-friend/refer-friend.controller.js",
        "app/refer-friend-new/refer-friend-new.controller.js",

        "app/new-prod-test/new-pre-quote.controller.js",
         "app/new-hili/new-hili.controller.js",
        "app/ext-pre-quote/ext-pre-quote.controller.js",
        "app/whats-app-call/whats-app-call.controller.js",
        "app/new-product-Quote-page/product-pre-quote.js",
        "app/pre-quote/pre-quote.directive.js",
         "app/refer-friend/refer-friend.directive.js",
        //  "app/refer-friend-new/refer-friend-new.directive.js",

        "app/new-prod-test/new-pre-quote.directive.js",
        "app/reco/reco.controller.js",
        "app/plans/plans.controller.js",
        "app/aa-quote/aa-quote.controller.js",
        "app/platinum-quote/platinum-quote.controller.js",
        "app/platinum-quote-v2/platinum-quote-v2.controller.js",
        "app/ci-quote/ci-quote.controller.js",
        "app/cs-quote/cs-quote.controller.js",
        "app/pa-quote/pa-quote.controller.js",
        "app/pa-customize-quote/pa-cust-quote.controller.js",
        "app/shared/addMember.directive.js",
        "app/proposer-details/proposer-details.controller.js",
        "app/insured-detail/insured-details.controller.js",
        "app/health-lifestyle/health-lifestyle.controller.js",
        "app/health-lifestyle-new/health-lifestyle-new.controller.js",
        "app/declaration/declaration.controller.js",
        "app/shared/payment-processing.controller.js",
        "app/cross-sell-quote/cross-sell-quote.js",
        "app/url-process/url-processing.controller.js",
        "app/thank-you/thank-you.controller.js",
        "app/post-payment/post-payment.controller.js",
        "app/sales-preminum-cal/sales-preminum-cal.controller.js",
        "app/payment-done/payment-done.controller.js",
         /*editable proposal Js Files */
        "app/editable-proposal/editable-proposal-controller.js",
         /*editable proposal Js Files */
         /*editable proposal Js Files */
        "app/product-details/product-detail.controller.js",
        /*editable proposal Js Files */
        "app/shared/aCAddMember.directive.js",
        "app/activ-care/activ-care-quote.controller.js",
        "app/calculate-premium/calculate-preminum.controller.js",
        "app/calculate-premium/calculate-preminum.directive.js",
        // "app/citi-processing/citi-processing.controller.js",
        "app/corona-kavach/corona-kavach-quote.controller.js",
        "app/diamond-quote/diamond-quote.controller.js",
        "app/arogya-sanjeevani/arogya-sanjeevani-quote.controller.js",
        // "app/tax-tool/tax-tool.controller.js",
        // "app/tax-tool/tax-tool-detail.controller.js",
        "app/web-agg/web-agg.controller.js",
         /* VIL Js Files */
         "app/vil/vil-login/vil-login.controller.js",
         "app/vil/vil-raise-track/vil-raise-track.controller.js",
         "app/vil/vil-raise/vil-raise.controller.js",
         "app/vil/vil-track/vil-track.controller.js",
         /* End of VIL Js Files */

         "app/counter-offer/counter-offer-login/counter-offer-login.controller.js",
         "app/counter-offer/counter-offer-quote/counter-offer-quote.controller.js",
         "app/counter-offer/counter-offer-payment/cfr-payment-processing.controller.js",

        /*New Renew Js Files */
        "app/new-renew/controllers/renewal-renew.js",
        "app/new-renew/controllers/new-renewal-landing.js",
        "app/new-renew/controllers/renewal-view-member-landing.js",
        "app/new-renew/controllers/renewal-edit-member-landing.js",
        "app/new-renew/controllers/renewal-view-member-add-user.js",
        "app/new-renew/controllers/renewal-edit-nominee-details-landing.js",
        "app/new-renew/controllers/renewal-increase-policy-tenure-landing.js",
        "app/new-renew/controllers/renewal-increase-sum-insured-landing.js",
        "app/new-renew/controllers/renewal-upgrade-zone-landing.js",
        "app/new-renew/controllers/renewal-change-address-details.js",
        "app/new-renew/controllers/renewal-renew-thank-you.js",
        "app/new-renew/controllers/renewal-payment-processing.js",
        "app/new-renew/controllers/renewPaymentProcess.js",
        "app/new-renew/controllers/renewal-url-processing.js",
        "app/new-renew/controllers/renewal-renew-dropout.js",
        "app/new-renew/directives/header-details.directive.js",
        /*End of New Renew Js Files */

        /* Axis Telesales Renew Js Files */
        "app/axis-telesales-renew/axis-telesales-renew-policy/axis-telesales-renew-policy.controller.js",
        /* End of Axis Telesales Renew Js Files */
        // Part Payment js Files
        "app/part-pay/part-pay.controller.js",
        // Enf of Part Payment js Files

        /* Part Payment Js Files*/
        "app/part-payment/controllers/pp-login.js",
        "app/part-payment/controllers/part-payment-processing.controller.js",
        "app/part-payment/controllers/partPaymentProcess.js",
        "app/activ-fit-quote/activ-fit-quote.controller.js",
        "app/jus-pay-status/jus-pay-status.controller.js",
        "app/profile-update/customer-profile.controller.js",
        "app/pharmeasy/pharmeasy.controller.js",
        "app/terms-conditions/terms-conditions.controller.js",        
         /* End of Part Payment Js Files*/
         "app/group-activ-travel/group-activ-travel.controller.js"
    ],gulp.series('js-min'));
    gulp.watch([
      "node_modules/bootstrap/dist/css/bootstrap.min.css",
      "node_modules/font-awesome/css/font-awesome.min.css",
      "assets/css/fonts.css",
      "assets/css/pretty.css",
      "assets/css/custom.css",
      "assets/css/new-hindi.css"
    ],gulp.series('css'));
    gulp.watch([
      "node_modules/owlcarousel/owl-carousel/owl.carousel.css",
      "node_modules/slick-carousel/slick/slick.css",
      "node_modules/slick-carousel/slick/slick-theme.css",
      "app/pre-quote/pre-quote.css",
      "app/refer-friend/refer-friend.css",
      "app/refer-friend-new/refer-friend-new.css",
      "app/new-hili/new-hili.css",

      "app/new-prod-test/new-pre-quote.css",
      "app/reco/reco.css",
      "app/plans/plans.css",
      "app/aa-quote/aa-quote.css",
      "app/platinum-quote/platinum-quote.css",
      "app/platinum-quote-v2/platinum-quote-v2.css",
      "app/ci-quote/ci-quote.css",
      "app/cs-quote/cs-quote.css",
      "app/pa-quote/pa-quote.css",
      "app/proposer-details/proposer-details.css",
      "app/insured-detail/insured-detail.css",
      "app/health-lifestyle/health-lifestyle.css",
      "app/health-lifestyle-new/health-lifestyle-new.css",
      "app/declaration/declaration.css",
      "app/post-payment/post-payment.css",
      "app/thank-you/thank-you.css",
      "app/activ-care/activ-care-add-modal.css",
      "app/activ-care/activ-care-quote.css",
      "app/corona-kavach/corona-kavach-quote.css",
      "app/diamond-quote/diamond-quote.css",
      "app/arogya-sanjeevani/arogya-sanjeevani-quote.css",
      // "app/tax-tool/tax-tool.css",
      "app/sales-preminum-cal/sales-preminum-cal.css",
      "app/calculate-premium/calculate-preminum.css",
      /* product detail form */
      "app/product-details/product-detail.css",
      /* product detail form */    
      /*New Renew Css Files */
      "app/new-renew/css/renewal-new-quick-renew.css",
      "app/new-renew/css/new-renewal.css",
      /*End of New Renew Css Files */

      /* editable-proposal form */
      "app/editable-proposal/editable-proposal.css",
      /* editable-proposal form */
      /* Axis Telesales Renew Css Files */
      "app/axis-telesales-renew/axis-telesales-renew-policy/axis-telesales-renew-policy.css",
      /* End of Axis Telesales Renew Css Files */

      // Part Payment css Files
      "app/part-pay/part-pay.css",
      // Enf of Part Payment css Files

      "app/activ-fit-quote/activ-fit-quote.css",
      "app/jus-pay-status/jus-pay-status.css",
      "app/profile-update/customer-profile.css",
      "app/pharmeasy/pharmeasy.css",
      "app/terms-conditions/terms-conditions.css",
      "app/counter-offer/counter-offer.css",
      "app/group-activ-travel/group-activ-travel.css"
    ],gulp.series('css-min'));

    gulp.watch([
        "app/header/header.html",
        "app/pre-quote/pre-quote.html",
        "app/refer-friend/refer-friend.html",
        "app/refer-friend-new/refer-friend-new.html",
        
        "app/new-prod-test/new-pre-quote.html",
        "app/ext-pre-quote/ext-pre-quote.html",
        "app/pa-quote/pa-v2-quote.html",
        "app/new-product-Quote-page/product-pre-quote.html",
        "app/new-hili/new-hili.html",
        "app/whats-app-call/whats-app-call.html",
        "app/alert-modal/alertModal.component.html",
        "app/reco/reco.html",
        "app/plans/plans.html",
        "app/aa-quote/aa-quote.html",
        "app/platinum-quote/platinum-quote.html",
        "app/platinum-quote-v2/platinum-quote-v2.html",
        "app/ci-quote/ci-quote.html",
        "app/cs-quote/cs-quote.html",
        "app/pa-quote/pa-quote.html",
        "app/pa-customize-quote/pa-customize-quote.html",
        "app/shared-template/add-member.html",
        "app/proposer-details/proposer-details.html",
        "app/insured-detail/insured-detail.html",
        "app/health-lifestyle/health-lifestyle.html",
        "app/health-lifestyle-new/health-lifestyle-new.html",
        "app/declaration/declaration.html",
        "app/shared-template/payment-processing.html",
        "app/cross-sell-quote/cross-sell-quote.html",
        "app/url-process/url-processing.html",
        "app/thank-you/thank-you.html",
        "app/post-payment/post-payment.html",
        "app/payment-done/payment-done.html",
        "app/shared-template/activ-care-add-member.html",
        "app/activ-care/activ-care-quote.html",
        "app/corona-kavach/corona-kavach-quote.html",
        "app/diamond-quote/diamond-quote.html",
        "app/arogya-sanjeevani/arogya-sanjeevani-quote.html",
        "app/calculate-premium/calculate-preminum.html",
        // "app/citi-processing/citi-processing.html",
        // "app/tax-tool/tax-tool.html",
        // "app/tax-tool/tax-tool-detail.html",
        "app/web-agg/web-agg.html",
        "app/sales-preminum-cal/sales-preminum-cal.html",
        /* editable-proposal form */
       "app/editable-proposal/editable-proposal.html",
       /* editable-proposal form */
         /* product detail form */
         "app/product-details/product-detail.html",
         "app/product-details/idfc-pasa.html",
         /* product detail form */        
        /*IDFC PASA*/
        "app/product-details/idfc-pasa.html",
          /* VIL Html Files */
          "app/vil/vil-login/vil-login.html",
          "app/vil/vil-raise-track/vil-raise-track.html",
          "app/vil/vil-raise/vil-raise.html",
          "app/vil/vil-track/vil-track.html",
          /* End of VIL Html Files */

         "app/counter-offer/counter-offer-login/counter-offer-login.html",
         "app/counter-offer/counter-offer-quote/counter-offer-quote.html",

        /*New Renew Html Files */
        "app/new-renew/partials-work/renewal-renew.html",
        "app/new-renew/partials-work/new-renewal-landing.html",
        "app/new-renew/partials-work/renewal-view-member-landing.html",
        "app/new-renew/partials-work/renewal-edit-member-landing.html",
        "app/new-renew/partials-work/renewal-edit-optional-covers.html",
        "app/new-renew/partials-work/renewal-view-member-add-user.html",
        "app/new-renew/partials-work/renewal-edit-nominee-details-landing.html",
        "app/new-renew/partials-work/renewal-increase-policy-tenure-landing.html",
        "app/new-renew/partials-work/renewal-increase-sum-insured-landing.html",
        "app/new-renew/partials-work/renewal-upgrade-zone-landing.html",
        "app/new-renew/partials-work/renewal-change-address-details.html",
        "app/new-renew/partials-work/renewal-renew-thank-you.html",
        "app/new-renew/partials-work/renewal-payment-processing.html",
        "app/new-renew/partials-work/renewal-url-processing.html",
        "app/new-renew/partials-work/renewal-renew-dropout.html",
        "app/new-renew/directives/header-details.directive.html",
        /*End of New Renew Html Files */

        /* Axis Telesales Renew Html Files */
        "app/axis-telesales-renew/axis-telesales-renew-policy/axis-telesales-renew-policy.html",
        /* End of Axis Telesales Renew Html Files */
        // Part Payment Html Files
        "app/part-pay/part-pay.html",
        // Enf of Part Payment Html Files

        /* Part Payment Html Files*/
        "app/part-payment/partials-work/pp-login.html",
         /* End of Part Payment Html Files*/
         "app/activ-fit-quote/activ-fit-quote.html",
        "app/jus-pay-status/jus-pay-status.html",
         "app/profile-update/customer-profile.html",
         "app/pharmeasy/pharmeasy.html",
         "app/terms-conditions/terms-conditions.html",
         "app/group-activ-travel/group-activ-travel.html"
        ], gulp.series('html'));
    });
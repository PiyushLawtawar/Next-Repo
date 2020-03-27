/**
 * scripts.JS (turnTo)  minitied manually. 
 */
var Host = window.location.hostname;
var isPDPPage = (typeof window.locationHref ==='string' && window.locationHref.indexOf("/pdp/") > -1)?true:false;


  if(ChartBotFlag)
	{  
				! function (t, e) {
			"use strict";
			window.lpTag = window.lpTag || {};
			var r = function (t) {
				try {
					var r = e.head || e.getElementsByTagName("head")[0],
						a = e.createElement("script");
					a.setAttribute("type", "text/javascript"),a.setAttribute("async", "true"), a.setAttribute("src", t), r.appendChild(a);
				} catch (t) {}
			};
		t.NDSId = "local", r("https://liverpool.nearshoremx.com/api/js/launcher.js");
		}(window, document);

	}
  



function localGetLoginStatusFunction(callbackFn) {
    callbackFn({
        user_auth_token: authToken
    })
}

function localGetUserInfoFunction(callbackFn) {
    var obj = {};
    obj.user_auth_token = authToken.auth_token, obj.first_name = authToken.first_name, obj.last_name = authToken.last_name, obj.email = authToken.email, obj.email_confirmed = authToken.email_confirmed, obj.issued_at = authToken.issued_at, callbackFn(obj, authToken.signature)
}

function localLogoutFunction(callbackFn) {
    document.logoutTurnTo.submit(), callbackFn()
}

function clickReviewsTabFromTeaser() {
    var qaTabPos = TurnTojQuery("#TurnToReviewsContent");
    window.scrollTo(0, qaTabPos.offset().top)
}

function hiddenOrBlockSwogobox(){
	try {
		let allSwogoBox = document.getElementsByClassName("swogo-box");
		let swogoBox = document.getElementsByClassName('o-product__swogo');
		let swogoContent = document.getElementsByClassName('o-product__swogocontent');
		if(allSwogoBox[1].childNodes.length <= 1){
			for (let i = 0; i < swogoBox.length; i++) {
				swogoBox[i].classList.add('-hidden');
				swogoContent[i].classList.remove('mt-5');
			}
		} else {
      for (let i = 0; i < swogoBox.length; i++) {
				swogoBox[i].classList.remove('-hidden');
			}
		}
	} catch(e) {
		console.error(e);
	}
}

function customReviewsTeaserDisplay(data) {
    var iteasers = TurnTojQuery(".TurnToReviewsTeaser"),
        rating = Math.round(100 * (TurnToItemData.counts.ar + .25)) / 100;
    rating = rating.toString();
    var decimal = parseInt(rating.substring(2, 3)),
        html = '<div class="RRBox">';
    html += '<div class="TT2left TTratingBox TTrating-' + (rating = rating.substring(0, 1) + "-" + (decimal >= 5 ? "5" : "0")) + '"><a href="#ratings"></a></div>', 0 == TurnToItemData.counts.r ? html += '<div class="RRWriteR"><a class="TTwriteReview TTFWR" href="javascript:void(0);">(Sé el primero en opinar)</a></div>' : 1 == TurnToItemData.counts.r ? html += '<div class="RRReadR"><a class="TTreadReviews RROneR" href="javascript:void(0);"> ' + TurnToItemData.counts.r + ' opinión</a> <a class="TTwriteReview TTWR" href="javascript:void(0)">Escribe una opinión</a></div><div class="TTclear"></div>' : html += '<div class="RRMoreR"> <a class="TTreadReviews RRPLUS" href="javascript:void(0)"> ' + TurnToItemData.counts.r + ' opiniones</a> <a class="TTwriteReview TTWR2" href="javascript:void(0)">Escribe una opinión</a></div><div class="TTclear"></div>', html += "</div>", iteasers.html(html), iteasers.find(".TTreadReviews").click(clickReviewsTabFromTeaser), iteasers.find(".TTwriteReview").click(function() {
        TurnTo.writeReview()
    })
}
if ("localhost" == window.location.hostname && (Host = "localhost:3000"), window._mfq = window._mfq || [], function() {
       // var mf = document.createElement("script");
        //mf.type = "text/javascript", mf.defer = !0, mf.src = "//cdn.mouseflow.com/projects/ab2c90eb-0ce8-4da9-87ed-971baf81bd44.js", document.getElementsByTagName("head")[0].appendChild(mf)
    }(), "undefined" != typeof PageName && "PDP" == PageName || "undefined" != typeof PageName && "Login" == PageName || isPDPPage) {
    var turnToConfig = {
        siteKey: TRUNTO_KEY,
        locale: locale,
        reviewsSetupType: "dynamicEmbed",
        paginationReviewsShownInitially: 2,
        reviewsTeaserFunc: customReviewsTeaserDisplay,
        registration: {
            localGetLoginStatusFunction: localGetLoginStatusFunction,
            localRegistrationUrl: localRegistrationUrl,
            localGetUserInfoFunction: localGetUserInfoFunction,
            localLogoutFunction: localLogoutFunction
        }
    };
    ! function() {
        var tt = document.createElement("script");
        tt.type = "text/javascript", tt.defer = !0, tt.src = document.location.protocol + "//static.www.turnto.com/traServer4_3/trajs/" + turnToConfig.siteKey + "/tra.js/" + turnToConfig.locale;
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(tt, s)
    }();

	  // Delete dots and change text on helpful [WEB y Mobile]
		try {
			console.log(' :::::::::::: TT & SWOGO ::::::::::::::::: ');
			setTimeout(function(){
				
				var config = { attributes: true, childList: true, characterData: true };

				var targetTurnToReviewsContent = document.getElementById('TurnToReviewsContent');
				var observerTurnToReviewsContent = new MutationObserver(function(mutations) {
		      mutations.forEach(function(mutation) {
		      	let reviewsTitle = document.getElementsByClassName("TTreviewTitle");
				    let reviewsBody = document.getElementsByClassName("TTreviewBody");
				    _lenArrTT = reviewsTitle.length;
				    var flgTT = false;
				    for (let i = 0; i < _lenArrTT; i++) {
				      if(reviewsTitle[i].innerText.trim() == '.'){
				        reviewsTitle[i].innerText = '';
				        flgTT = true;
				      }
				      if(reviewsBody[i].innerText.trim() == '.'){
				        reviewsBody[i].innerText = '';
				        flgTT = true;
				      }
				      if(flgTT){
				        // WEB
				        reviewsTitle[i].parentNode.children[reviewsTitle[i].parentNode.children.length-1].children[0].childNodes[0].nodeValue = '¿Esta calificación fué útil?';
				        // Mobile
				        reviewsTitle[i].parentNode.parentNode.children[reviewsTitle[i].parentNode.parentNode.children.length-2].children[0].childNodes[0].nodeValue = '¿Esta calificación fué útil?';
				        flgTT = false;
				      }
				    }
			      });    
			   });
			  observerTurnToReviewsContent.observe(targetTurnToReviewsContent, config);
			  
			  // ----------------------------------------------- Set ratings without Title and Comment ---------------------------------------------------
				// ================================================================== WEB ================================================================== 
			  var targetTTtraLayout = document.getElementById('TTtraLayout');
		    var observerTTtraLayout = new MutationObserver(function(mutations) {
		      mutations.forEach(function(mutation) {
		      	document.getElementById("TTreviewTitle").setAttribute("maxlength", 140);
		        document.getElementById("TTreviewText").setAttribute("maxlength", 500);
		        
		        document.getElementById("TTsubmitReview").parentNode.addEventListener("click", function(e){
		          if(document.getElementById("TTreviewText").innerText == "" ){
		            document.getElementById("TTreviewText").innerHTML = ".";
		            observerTTtraLayout.disconnect();
		          }
		        },true);
		      });    
		    });
		    observerTTtraLayout.observe(targetTTtraLayout, config);

		    // ================================================================ Mobile =================================================================   
		    var txtArea = document.getElementsByTagName("textarea");
			    if(txtArea.length > 0){
			      txtArea[0].setAttribute("maxlength", 400);
			      txtArea[1].setAttribute("maxlength", 140);
			      txtArea[1].setAttribute("placeholder", 'Su impresión general (140 caracteres máximo)');
			      txtArea[1].innerHTML = ""
			      document.getElementById("TTrateItSubmitBtn").parentNode.addEventListener("click", function(e){
			        if(txtArea[0].innerText == ""){
			          txtArea[0].innerHTML = ".";
			        }
			      },true);
			    }

			  //  ============================ Hidde swogo Box. when is empty  ==================================
			  hiddenOrBlockSwogobox();
			  let allSwogoBox = document.getElementsByClassName('swogo-box');
				let lenAllSwogoBox = allSwogoBox.length;
				let targetSwogo, observerSwogo;
				let configObs = { attributes: true, childList: true, characterData: true };
				for (let i = 0; i < lenAllSwogoBox; i++) {
					targetSwogo = document.getElementById(allSwogoBox[i].id);
			    observerSwogo = new MutationObserver(function(mutations) {
			      mutations.forEach(function(mutation) {
			        // observerSwogo.disconnect();
			        hiddenOrBlockSwogobox();
			      });    
			    });
			  	observerSwogo.observe(targetSwogo, configObs);
				}

			}, 4000)

		} catch(e) {
		  console.error(e);
		}

    
}
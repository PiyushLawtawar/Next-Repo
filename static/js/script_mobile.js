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
var turnToConfig = {
        siteKey: TRUNTO_KEY,
        setupType: "mobileTT",
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
    },
    S = turnToConfig;
S.host = S.host || "www.turnto.com", S.staticHost = S.staticHost || "static.www.turnto.com";
var _params = getParameters();

function getParameters() {
    var vars = [],
        name, value;
    if (window.location.href.indexOf("?") > 0)
        for (var hashes = window.location.href.slice(window.location.href.indexOf("?") + 1).split("&"), i = 0; i < hashes.length; i++) name = hashes[i].substring(0, hashes[i].indexOf("=")), value = hashes[i].substring(hashes[i].indexOf("=") + 1), vars.push(name), vars[name] = value;
    return vars
}
TurnToItemSku = decodeURIComponent(_params.turntosku), TurnToPartnerCurl = _params.curl, turnToConfig.reviews = !!_params.reviews;
var traFileName = "tra.js";

function insertTra(fileName) {
    var tt = document.createElement("script");
    tt.type = "text/javascript", tt.defer = !0, tt.src = "//" + this.S.staticHost + "/traServer4_3/trajs/" + turnToConfig.siteKey + "/" + fileName;
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(tt, s)
}
turnToConfig.locale && (traFileName += "/" + turnToConfig.locale), insertTra(traFileName);
// Delete dots and change text on helpful [WEB y Mobile]
try {
  setTimeout(function(){
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
  },4000);
} catch(e) {
  console.error(e);
}

// ----------------------------------------------- Set ratings without Title and Comment ---------------------------------------------------
// ================================================================== WEB ================================================================== 
try {
  setTimeout(function(){
    var target = document.getElementById('TTtraLayout');
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        document.getElementById("TTsubmitReview").parentNode.addEventListener("click", function(e){
          if(document.getElementById("TTreviewText").innerText == "" ){
            document.getElementById("TTreviewText").innerHTML = ".";
            observer.disconnect();
          }
        },true);
      });    
    });
    var config = { attributes: true, childList: true, characterData: true };
    observer.observe(target, config);
  },4000);
} catch(e) {
  // console.log(e);
}
// ================================================================ Mobile =================================================================   
try {
  setTimeout(function(){
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
  },4000);
} catch(e) {
  console.error(e);
}
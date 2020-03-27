/**
 * GTM script  minitied manually.
 */
var process = {}
process.env = JSON.parse(document.getElementById("envVar").value)
var locationHref = this.location.href,
    sendKey = "";
// locationHref.indexOf("liverpool") > 0 ? sendKey = "GTM-K4M5VFN" : locationHref.indexOf("williams-sonoma") > 0 ? sendKey = "GTM-PRJL2D" : locationHref.indexOf("potterybarn") > 0 ? sendKey = "GTM-KHJC6L" : locationHref.indexOf("potterybarnkids") > 0 ? sendKey = "GTM-TB95D2" : locationHref.indexOf("pbteens") > 0 ? sendKey = "GTM-52R4FR" : locationHref.indexOf("westelm") > 0 && (sendKey = "GTM-MGXXT9"),

locationHref.indexOf("liverpool") > 0 ? sendKey = process.env.GTMLP || "GTM-K4M5VFN" :
    locationHref.indexOf("williams-sonoma") > 0 ? sendKey = process.env.GTMWS || "GTM-PRJL2D" :
            locationHref.indexOf("potterybarnkids") > 0 ? sendKey = process.env.GTMPBK || "GTM-TB95D2" :
                locationHref.indexOf("potterybarn") > 0 ? sendKey = process.env.GTMPB || "GTM-KHJC6L" :
                    locationHref.indexOf("pbteen") > 0 ? sendKey = process.env.GTMPBT || "GTM-52R4FR" :
                        locationHref.indexOf("westelm") > 0 && (sendKey = process.env.GTMWEL || "GTM-MGXXT9"),

    function (w, d, s, l, i) {w[l] = w[l] || [], w[l].push({
            "gtm.start": (new Date).getTime(),
            event: "gtm.js"
        });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = "";
        j.async = !0, j.src = "https://www.googletagmanager.com/gtm.js?id=" + i, f.parentNode.insertBefore(j, f)
    }(window, document, "script", "dataLayer", sendKey);

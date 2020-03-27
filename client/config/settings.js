const 
    coherenceCacheEnble = true,
    devCacheEndPoints = {},
    sitCacheEndPoints ={
        "lp_EA_HTML_Content":"172.16.213.134:9077",
        "ms_EA_HTML_Content":"172.16.213.134:9177"
    },
    commonCacheEndPoints ={
        "lp_EA_HTML_Content":"IPADDRESS:9077", 
        "ms_EA_HTML_Content":"IPADDRESS:9177", 
        "lp_BCC_Content":"IPADDRESS:9499",
        "lp_thirdparty_Content":"IPADDRESS:9599",
        "lp_Endeca_NonPDP":"IPADDRESS:9099", 
        "lp_Endeca_PLP":"IPADDRESS:9199", 
        "lp_Endeca_Search":"IPADDRESS:9299", 
        "lp_Endeca_PDP":"IPADDRESS:9399", 
        "ms_Endeca_NonPDP":"IPADDRESS:9088",
        "ms_Endeca_PLP":"IPADDRESS:9188",
        "ms_Endeca_Search":"IPADDRESS:9288",
        "ms_Endeca_PDP":"IPADDRESS:9388"
    },
    cacheNames ={
        "LP_CONTENT":"lp_EA_HTML_Content",
        "MS_CONTENT":"ms_EA_HTML_Content",
        "LP_BCC":"lp_BCC_Content",
        "LP_THIRDPARTY":"lp_thirdparty_Content",
        "LP_NON_PDP":"lp_Endeca_NonPDP",
        "LP_PDP":"lp_Endeca_PDP",
        "LP_SEARCH":"lp_Endeca_Search",
        "LP_PLP":"lp_Endeca_PLP",
        "MS_NON_PDP":"ms_Endeca_NonPDP",
        "MS_PDP":"ms_Endeca_PDP",
        "MS_SEARCH":"ms_Endeca_Search",
        "MS_PLP":"ms_Endeca_PLP"
    },
    listofServicesForCoherence={
        "header":true,
        "footer":true,
        "staticlabel":true,
        "configuration":true,
        "departments":true,
        "carousel":true,
        "limitedPiece":true,
        "endecaSearchService":true,
        "staticPages":true,
        "homePage":true,
        "allFlags":true,
        "PDP":true,
        "CollectionPDP":true,

    }
;



module.exports = {
    'development':{
        coherenceEndPoints : commonCacheEndPoints,
        cacheNames:cacheNames,
        listofServicesForCoherence:listofServicesForCoherence,
        swogoEndPoint:'https://ui.swogo.net/bundles/v4/liverpoolComMx/swogo.js'
    },
    'prod':{
        coherenceEndPoints : commonCacheEndPoints,
        cacheNames:cacheNames,
        listofServicesForCoherence:listofServicesForCoherence,
        swogoEndPoint:'https://ui.swogo.net/liverpoolComMx/swogo.js'
    },
    'qa':{
        coherenceEndPoints : commonCacheEndPoints,
        cacheNames:cacheNames,
        listofServicesForCoherence:listofServicesForCoherence,
        swogoEndPoint:'https://ui.swogo.net/bundles/v4/liverpoolComMx/swogo.js'
    },
    'sit': {
        coherenceEndPoints : commonCacheEndPoints,
        cacheNames:cacheNames,
		listofServicesForCoherence:listofServicesForCoherence,
        swogoEndPoint:'https://ui.swogo.net/bundles/v4/liverpoolComMx/swogo.js'
    },
    'prod': {
        coherenceEndPoints : commonCacheEndPoints,
        cacheNames:cacheNames,
        listofServicesForCoherence:listofServicesForCoherence,
        swogoEndPoint:'https://ui.swogo.net/bundles/v4/liverpoolComMx/swogo.js'
    }
}
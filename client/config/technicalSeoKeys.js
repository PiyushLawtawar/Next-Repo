export const TechnicalSEO = {
    "TECHNICAL_SEO_PAGE_RELOAD":"true",
    "PWA_TECH_SEO_EVERY_PAGE":"PWA-TECH-SEO-EVERY-PAGE",
    "PWA_TECH_SEO_HOME_PAGE":"PWA-TECH-SEO-HOME-PAGE",
    "everyPage":{
            "name":"PWA_TECH_SEO_EVERY_PAGE_NAME",
            "url":"PWA_TECH_SEO_EVERY_PAGE_URL",
            "email":"PWA_TECH_SEO_EVERY_PAGE_EMAIL",
            "logo":"PWA_TECH_SEO_EVERY_PAGE_LOGO",
            "telephone":"PWA_TECH_SEO_EVERY_PAGE_TELEPHONE",
            "sameAs":"PWA_TECH_SEO_EVERY_PAGE_SAMEAS", // use "|" for multiple object splits
            "target":"PWA_TECH_SEO_EVERY_PAGE_TARGET",
            "queryInput":"PWA_TECH_SEO_EVERY_PAGE_QUERY_INPUT",
            "resourceOpt":"PWA_TECH_SEO_RESOURCE_OPT"
    },
    "homePage":{
            "name":"PWA_TECH_SEO_HOME_PAGE_NAME",
            "url":"PWA_TECH_SEO_HOME_PAGE_URL",
            "description":"PWA_TECH_SEO_HOME_PAGE_DESC"            
    },
    "software":{
        "name": "PWA_TECH_SEO_SOFT_NAME", // use "|" for multiple object splits
        "operatingSystem": "PWA_TECH_SEO_SOFT_SYSTEM", // use "|" for multiple object splits
        "applicationCategory": "PWA_TECH_SEO_SOFT_CATEGORY", // use "|" for multiple object splits
        "fileSize": "PWA_TECH_SEO_SOFT_FILESIZE", // use "|" for multiple object splits
        "softwareVersion":"PWA_TECH_SEO_SOFT_VERSION", // use "|" for multiple object splits
        "ratingValue":"PWA_TECH_SEO_SOFT_RATINGVALUE",
        "ratingCount":"PWA_TECH_SEO_SOFT_RATINGCOUNT",
        "price":"PWA_TECH_SEO_SOFT_PRICE"
    },
    "everyPageDefaultJSON":{
        "@context": "http://schema.org", 
        "@type": "Organization", 
        "name" : "", 
        "url": "", 
        "email":"", 
        "logo": "", 
        "telephone": "", 
        "sameAs": [ ], 
        "potentialAction": { }
    },
    "potentialAction": { 
        "@type": "SearchAction", 
        "target": "", 
        "query-input": "" 
    },
    "homePageWebPageDefaultJSON":{
        "@context": "http://schema.org", 
        "@type": "WebPage", 
        "name":"",
         "url":"",
         "description":""   
    },
    "homePageSoftwareDefaultJSON":{
        "@context": "http://schema.org", 
        "@type": "SoftwareApplication", 
        "name":"",
        "operatingSystem":"",
        "applicationCategory":"" ,
        "fileSize": "", 
        "softwareVersion":"", 
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "", "ratingCount": "" }, 
        "offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "MXN" }  
    },
    "breadcrumbDefaultJSON":{
        "@context": "http://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement":[]
    },
    "breadcrumbItem":{ 
        "@type": "ListItem", 
        "position": 1,
        "item":{}
    },
    "item":{ 
        "@id": "", "name": ""
     } ,
    "leftNavigationDefaultJSON":{
        "@context":"http://schema.org",
        "@type":"ItemList",
        "itemListElement":[]
    },
    "SiteNavigationElement":{
        "@type":"SiteNavigationElement",
        "position":1, 
        "name": "", 
        "url":""
    },
    "BLPCLPBreadCrumbDefaultJSON":{ 
        "@context": "http://schema.org", 
        "@type": "WebPage", 
        "breadcrumb": "",
        "name":"", 
        "url":"" 
    },
    "CLPItemList":{
        "@context": "http://schema.org",
        "@type": "ItemList",
         "name": "Categorías de ", 
         "url": "",
        "itemListElement": []
    },
    "CLPListItem":{
        "@type": "ListItem",
        "position":"1", 
        "image": "", 
        "url": "", 
        "name": ""
    },
    "PLPMainDefaultJSON":{ 
        "@context": "http://schema.org", 
        "@type": "ItemList", 
        "url": "", 
        "numberOfItems": "0", 
        "itemListElement": []
    },
    "PLPListItemDefaultJSON":{ 
        "@type": "ListItem", 
        "position": 1, 
        "item": { 
            "@type": "Product", 
            "name": "", 
            "url":"", 
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": 0, "reviewCount": 0 } 
        } 
   },
   "PLPMarketListItemDefaultJSON":{ 
       "@type": "ListItem", 
       "position": 1, 
       "item": {  } 
  },
  "PLPItem":{     
    "@type": "Product", 
    "name": "", 
    "url":"", 
    "aggregateRating":  {},
    "Offers":{}
} ,
"PLPAggregateRating":{ "@type": "AggregateRating", "ratingValue": 0, "reviewCount": 0 },
"PLPOffers":{ "seller": { "@type":"Organization", "name":"" } },
    "GeneralPDPDefaultJSON": { 
            "@context": "http://schema.org", 
            "@type": "Product", 
            "name": "", 
            "sku": "", 
            "image": [ ], 
            "description": "", 
            "brand": { "@type": "Thing", "name": "" }, 
            "aggregateRating": { "@type": "AggregateRating", "ratingValue":0 , "reviewCount": 0 }, 
            "offers": {      }
    }, 
    "PDPoffers": { 
        "@type": "Offer", "priceCurrency": "MXN", "price": 0, "priceValidUntil": "31/12/2030", "url":"", 
        "itemCondition": "http://schema.org/NewCondition", "availability": "https://schema.org/InStock" 
    }, 
    "PDPVariantoffers": { 
        "@type": "AggregateOffer", "priceCurrency": "MXN", "lowPrice": 0,"highPrice": 0, "priceValidUntil": "31/12/2030", "url":"", 
        "itemCondition": "http://schema.org/NewCondition", "availability": "https://schema.org/InStock" 
    },
    "PDPVariantDefaultJSON": { 
            "@context": "http://schema.org", 
            "@type": "Product", 
            "name": "", 
            "sku": "", 
            "image": [ ], 
            "description": "", 
            "brand": { "@type": "Thing", "name": "" }, 
            "aggregateRating": { "@type": "AggregateRating", "ratingValue":0 , "reviewCount": 0 }, 
            "offers": {   }
    },
    "DigitalPDPDefaultJSON": { 
            "@context": "http://schema.org", 
            "@type": "Product", 
            "name": "", 
            "sku": "", 
            "image": [ ], 
            "description": "", 
            "brand": { "@type": "Thing", "name": "" }, 
            "category":"Producto Descargable",
            "Material":"Digital",
            "aggregateRating": { "@type": "AggregateRating", "ratingValue":0 , "reviewCount": 0 }, 
            "offers": {          }
    },
    "collectionPDPDefaultJSON": { 
            "@context": "http://schema.org", 
            "@type": "Product", 
            "name": "", 
            "sku": "", 
            "image": [ ], 
            "description": "", 
            "brand": { "@type": "Thing", "name": "" }, 
            "offers":[]
    },
    "collectionOffer":{
        "@type": "Offer", 
        "sku": "", 
        "name": "", 
        "price": 0,
        "priceCurrency": "MXN",
        "priceValidUntil": "31/12/2020",
        "aggregateRating": {  },
        "availability": "https://schema.org/InStock", "url":""
    },
    "collectionaggregateRating": {
    "@type": "AggregateRating", "ratingValue": 0, "reviewCount": 0
    },
     "marketPlacePDPDefaultJSON":{ 
         "@context": "http://schema.org", 
         "@type": "Product", 
         "name": "", 
         "sku": "", 
         "image": [], 
         "description": "", 
         "brand": { "@type": "Thing", "name": "" }, 
        "aggregateRating": { }, 
        "offers": {  } 
    }, 
    "marketPDPoffers": { "@type": "Offer", "priceCurrency": "MXN", "price": 0.0, "url":"", "priceValidUntil": "31/12/2030", 
                "itemCondition": "http://schema.org/NewCondition", 
                "seller": { "@type": "Organization", "name":"" }, 
                "availability": "http://schema.org/InStock" } ,
    "sellerReview":{ 
        "@type": "Review", 
        "author": "", 
        "datePublished": "", 
        "name": "Escrito por ",
         "reviewBody": "", 
         "reviewRating": {}
    },
    "reviewRating":{ "@type": "Rating", "ratingValue": "" } ,
    "sellerDefaultJSON":{
        "@context": "http://schema.org", 
        "@type": "WebPage", 
        "name":" en Market Place Liverpool",
         "description": "Encuantra lo mejor de ## sólo en Liverpool ", 
         "url":"", 
         "mainEntity":{   }
    },
    "sellerMainEntity":{ 
        "@type": "Store", 
        "name": "", 
        "image": "", 
        "aggregateRating": {  }, 
        "review": []
    }
    
}
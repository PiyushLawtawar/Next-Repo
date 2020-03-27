export const CollectionData = {
    alert: {
        type: '-alert',
        text: "",
        pClass: 'a-alert__text',
        iconType: 'a-alert__icon icon-error'
    },
    warning: {
        type: '-warning',
        text: 'Este es un mensaje de warning',
        pClass: 'a-alert__text',
        iconType: 'a-alert__icon icon-warning'
    },
    success: {
        type: '-success',
        text: 'Se ha copiado el link del artículo',
        pClass: 'a-alert__text',
        iconType: 'a-alert__icon icon-done'
    },
    modalEdd: {
        modalId: "select-product-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "select-product-modal",
        modalDialogClass: "modal-dialog modal-dialog-centered",
        modalContentClass: "modal-content"
    }
}


/* data for  ProductInformationCollection.js file - start*/
export const ProductInformationCollectionData = {
    characteristics: {
        hText: '',
        hType: 'h2',
        btnModalAttributes: {
            "data-toggle": "modal",
            "data-target": "#specs-modal",
            "id": "a-characteristics__btn"
        },
        iconClass: 'icon-arrow_right',
        divClass: 'm-characteristics-container -small',
        btnText: 'Características',
        btnClass: 'a-btn a-btn--action ripple'
    },

    offers: {
        hText: '',
        hType: 'h2',
        btnModalAttributes: {
            "data-toggle": "modal",
            "data-target": "#promo-modal",
            "id": "a-offers__btn"
        },
        iconClass: 'icon-arrow_right',
        divClass: 'm-characteristics-container -small',
        btnText: 'Ofertas especiales y promociones',
        btnClass: 'a-btn a-btn--action ripple'
    },

    modalProductPolitics: {
        modalId: "politics-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "politics-modal",
        modalDialogClass: "modal-dialog modal-dialog-centered",
        modalContentClass: "modal-content"
    },
    modalProductPromo: {
        modalId: "promo-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "promo-modal",
        modalDialogClass: "modal-dialog modal-dialog-centered",
        modalContentClass: "modal-content"
    },


    pdpDownloadable: {
        aHref: '#',
        aClass: 'a-product__anchorProductDownloadCode',
        anchorAttributes: {
            "data-toggle": "modal",
            "data-target": "#download-modal"
        },
        iconClass: 'icon-help a-pdpHybrid_icon',
        spanText: '¿Cómo funcionan los códigos de descarga?',
        spanClass: 'm0',
        iconPosition: 'right'
    },

}
/* data for  ProductInformationCollection.js file - start*/

/* data for ProductCollectionDetail.js file Content Component - start */
export const ProductCollectionDetailData = {

    modalProductSocialShare: {
        modalId: "social-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "social-modal",
        modalDialogClass: "modal-dialog modal-sm modal-dialog-centered modal-small",
        modalContentClass: "modal-content"
    },
    information: {
        title: "",
        productCode: "",
        ratings: 'true',
        price: 'true',
        offerPrice: 'single',
        downloadable: 'false',
        colors: 'true',
        sizes: 'true',
        descTitle: 'false',
        description: 'false',
        moreInfo: 'false',
        share: 'false',
        headlineTitle: 'h2',
        modals: true,
        typePage: "pdp-collection"
    },
    settings: {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        className: "m-carousel sticky__product__gallery",
    },
    productSocialShare: {
        txtFacebook: "",
        txtTwitter: "",
        txtEmail: "",
        txtCopy: "",
        txtWhatsapp: "",
        pageUrl: ""
    },
    modalProductSocialEmail: {
        modalId: "share-email-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "share-email-modal",
        modalDialogClass: "modal-dialog modal-dialog-centered",
        modalContentClass: "modal-content"
    },
}

/* data for ProductCollectionDetail.js file Content Component - end */

/*  data for ProductInfoCollection.js file Content Component - start  */
export const ProductInfoCollectionData = {
    modalEdd: {
        modalId: "edd-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "edd-modal",
        modalDialogClass: "modal-dialog modal-dialog-centered",
        modalContentClass: "modal-content"
    },

    modalItr: {
        modalId: "itr-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "itr-modal",
        modalDialogClass: "modal-dialog modal-dialog-centered",
        modalContentClass: "modal-content"
    },

    modalSelecState: {
        modalId: "select-state-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "2",
        modalAriaLabelledBy: "select-state-modal",
        modalDialogClass: "modal-dialog modal-dialog-centered",
        modalContentClass: "modal-content"
    },

    modalAvailability: {
        modalId: "availability-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "availability-modal",
        modalDialogClass: "modal-dialog modal-dialog-centered",
        modalContentClass: "modal-content"
    },

    modalAvailabilityItr: {
        modalId: "availability-modal-itr",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "availability-modal-itr",
        modalDialogClass: "modal-dialog modal-dialog-centered",
        modalContentClass: "modal-content"
    },

    modalQty: {
        modalId: "qty-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "qty-modal",
        modalDialogClass: "modal-dialog modal-sm modal-dialog-centered modal-small",
        modalContentClass: "modal-content"
    },
    modalGiftPurchase: {
        modalId: "giftPurchase-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "giftPurchase-modal",
        modalDialogClass: "modal-dialog modal-dialog-centered",
        modalContentClass: "modal-content"
    },
    modalGiftRegistry: {
        modalId: "giftRegistry-modal",
        modalClass: "o-product__modal modal fade",
        modalTabIndex: "1",
        modalAriaLabelledBy: "giftRegistry-modal",
        modalDialogClass: "modal-dialog modal-dialog-centered",
        modalContentClass: "modal-content"
    },
    optionsButtonHeadlineIcon: {
        hText: '',
        hType: 'h2',
        btnModalAttributes: {
            "data-toggle": "modal",
            "data-target": "#giftRegistry-modal",
            "id": "a-giftRegistry-modal__btn"
        },
        iconClass: 'icon-arrow_right',
        divClass: 'm-product__giftRegistry-container d-none d-lg-block',
        btnText: 'Agregar a mi mesa de regalos',
        btnClass: 'a-btn a-btn--action'
    },
    optionsButtonIcon: {
        btnClass: 'a-btn a-btn--tertiaryAlternative btn-giftRegistry__add mb-3 d-block d-lg-none',
        btnText: 'Agregar a mi mesa de regalos',
        btnAttributes: {
            "data-toggle": "modal",
            "data-target": "#giftRegistry-modal",
            "id": "a-giftRegistry-modal__btn"
        },
        iconClass: "icon-arrow_right"
    },
}
/*  data forProductInfoCollection.js file Content Component - end  */




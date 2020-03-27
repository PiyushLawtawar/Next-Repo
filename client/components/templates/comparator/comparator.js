import React from 'react';
import get from 'lodash/get';
import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import PlpComparator from '../../organisms/BodyPlp/PlpComparator';
import Breadcrumb from '../../molecules/Breadcrumb/Breadcrumb';
import { CompareCard } from "../../molecules/Card/Card";
import { Utility } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import Modal from '../../../helpers/modal/modal';
import { parentContext } from '../../../contexts/parentContext';
import Header from '../../organisms/Header/Header';
import Footer from '../headerFooter/headerFooter';
import Link from '../../atoms/Link/Link';
import Icons from '../../atoms/Icons/Icons';
import Router from 'next/router';
import ComparatorOfferYPromotions from '../../molecules/Modals/ComparatorOfferYPromotions';
import Alert from "../../molecules/Alert/Alert";

const getCompareCardsInArrayFormate = (compareSummary) => {
    const compareCardsArray = [];
    for (var i in compareSummary) {
        if(i!=='compareAttributes')
        compareCardsArray.push(compareSummary[i]);
    }
    return compareCardsArray;
}

export default class Comparator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showOnlyDifferences: false,
            compareCardsArray: [],
            tableKeys: [],
            tabs:{
                tab1: true,
                tab2: false
            },
            alert_status: false,
            alert_message: '',
            alert_Type: 'alert',
            staticLabels: {},
            lpPromotions_pwa: [],
            otherPromotions_pwa: []
        }
    }

    componentDidMount(){
        this.getComparatorList()
    }
    getComparatorList = () => {
        Utility(Path.getComparatorList, 'GET').then(response => {
            if(response && response.data){
                if(response.data.s==0){
                    const compareSummary = (response.data && response.data.compareSummary) || {};
                    const compareCardsArray = compareSummary ? getCompareCardsInArrayFormate(compareSummary) : [];
                    const tableKeys = compareSummary.compareAttributes || [];

                    this.setState({compareCardsArray, tableKeys }, () => {
                        this.getStaticLabels();

                    });

                }else if(response.data.s==="1" && response.data.err){
                    this.getStaticLabels();
                    this.show_alert(response.data.err)
                }
            }
        },(error)=>{
            console.error("Error ==== :: ",error);
        });
    }

    getStaticLabels = () => {

        const staticLabelURL = Path.staticLabelsFetch + '?pageName=PWA-COMPARE-PAGE';
        Utility(staticLabelURL, 'GET').then(response => {
            const staticLabels = get(response, 'data.staticLabelValues[0].keyValues', {});
            this.setState({ staticLabels });
            try {
                let notAvailableErrText = '';
                if(compareCardsArray.length === 0 && tableKeys.length === 0){
                    notAvailableErrText = staticLabels['pwaComparePage-productData-and-attributesData-not-avail'] || 'pwaComparePage-productData-and-attributesData-not-avail';
                } else if(compareCardsArray.length === 0 ) {
                    notAvailableErrText = staticLabels['pwaComparePage-productData-not-avail'] || 'pwaComparePage-productData-not-avail';
                } else if(tableKeys.length === 0) {
                    notAvailableErrText = staticLabels['pwaComparePage-attributesData-not-avail'] || 'pwaComparePage-attributesData-not-avail';
                }
                if(notAvailableErrText !== '' ){
                    this.show_alert(notAvailableErrText, 'alert', 10000);
                    window.scrollTo(0, 0);
                }
            }catch(e){}

        }, (error) => {
            //console.log("Compare page staticLabel call error: ", error);
        });
    }
    handleShowOnlyDiff = (e) => {
        this.setState((prevState) => {
            return {
                showOnlyDifferences: !prevState.showOnlyDifferences
            }
        })
    }

    removeProductFromCompare = (card) => {
        Utility(Path.lpdeleteproduct, 'POST', { "productID": card.product.id } ).then(response => {
            if(response.status === 200){
                let { compareCardsArray } = this.state;
                compareCardsArray = compareCardsArray.filter((obj) => { if (obj.product.id !== card.product.id) return obj; })
                this.setState({ compareCardsArray });
            }
        },(error)=>{
           // console.log("Error ==== :: ",error);
        });
    }

    goBack = () => {
        Utility(Path.clearList, 'GET').then(response => {
            if(response.status === 200){
                Router.back();
            }
        },(error)=>{
            Router.back();
            //console.log("Error ==== :: ",error);
        });
    }

    addItemToCart = (data) => {

        const isPresale = get(data, 'product.isPresale', "false");
        const isSpecialSale = get(data, 'product.isSpecialSale', "false");

        let isSpecialSaleItem = 'false';
        if(isPresale === true || isPresale === 'true' || isSpecialSale === true || isSpecialSale === 'true') {
            isSpecialSaleItem = 'true';
        }

        const payload = {
            "quantity": 1,
            "catalogRefIds": data.skuId,
            "itemToGift": "false",
            "isSpecialSaleItem": isSpecialSaleItem,
            "skipInventory": "false",
            "productId": data.product.id,
            "productType": data.product.productType
        }

        const isMarketPlace = data.isMarketPlace || false;
        if (isMarketPlace === "true" || isMarketPlace === true) {

            try {
                Utility(Path.alloffers + payload.productId, 'GET').then(response => {

                    if (response && response.status === 200 && response.data && response.data.s === '0') {
                        const skuOffers = get(response.data, 'skuOffers', {});
                        let selectedSkuOffer = {};
                        map(skuOffers, (item, index) => {
                            if (item.skuId === payload.catalogRefIds) {
                                selectedSkuOffer = item;
                            }
                        })

                        if (!isEmpty(selectedSkuOffer)) {
                            const { bestSeller = '', sellerId, sellerSkuId, sellerOperatorId, offerId } = selectedSkuOffer;
                            payload.sellerId = sellerId;
                            payload.sellerSkuId = sellerSkuId;
                            payload.sellerName = bestSeller;
                            payload.sellerOperatorId = sellerOperatorId;
                            payload.offerId = offerId;
                        }

                        this.addToCartCall(payload);
                    }
                });

            } catch(e){}

        } else {
            this.addToCartCall(payload);
        }
    }

    addToCartCall = (payload) => {
        let cartresposedate = {};
        Utility(Path.addpdpitemtocart, 'POST', payload).then(response => {
            if (response.status === 200 && response.data && response.data.s === '0') {
                cartresposedate = response.data
                if (response.status === 200 && response.data.s === '0') {
                    
                    if (response.data.quantity) {
                        this.props.updateCartHeaderDetails(response.data);
                    }
                    if (cartresposedate && cartresposedate.cartCount && cartresposedate.cartCount.cartHeaderDetails) {
                        response.data["cartHeaderDetails"] = cartresposedate.cartCount.cartHeaderDetails;
                    }
                    const successTxt = this.state.staticLabels['pwaComparePage-addToCart-success-message'] || 'pwaComparePage-addToCart-success-message';
                    this.show_alert(successTxt, "success")
                    window.scrollTo(0, 0);
                }
                else {
                   // console.log("Error on Comparator Addtocart: ", response.data.error, response.data.message)
                }
               /*  Utility(Path.mybagListCount, 'GET').then(response => {
                    if (response.status === 200) {
                        if (response && response.data && response.data.s === '0') {
                            if (response.data.quantity && cartresposedate && cartresposedate.cartCount && cartresposedate.cartCount.cartHeaderDetails) {
                                response.data["cartHeaderDetails"] = cartresposedate.cartCount.cartHeaderDetails;
                                this.props.updateCartHeaderDetails(response.data);
                            }
                            const successTxt = this.state.staticLabels['pwaComparePage-addToCart-success-message'] || 'pwaComparePage-addToCart-success-message';
                            this.show_alert(successTxt, "success")
                            window.scrollTo(0, 0);
                        }
                    }
                    else {
                        //console.log(response.data.error, response.data.message)
                    }
                }); */

            }
            else {
                if (response.status === 200) {
                    if (response && response.data && response.data["0"]) {
                        this.show_alert(response.data["0"].err)
                        window.scrollTo(0, 0);
                    }
                }
            }
        }, (error) => {
        });
    }

    goToPdpPage = (data) => {
        if(data && data.product){
            let productName = data.product.displayName || '';
            productName = productName.toLowerCase().replace(/\s/g, '-').replace(/#/g, '');
            const path = '/tienda/pdp/'+ productName +'/'+data.product.id;
            Router.push(path,path);
        }
    }

    assignModalData = (data = {}) => {
        const { lpPromotions_pwa, otherPromotions_pwa } = data.productPriceInfo || {};
        this.setState({ lpPromotions_pwa, otherPromotions_pwa });
    }

    switchTab = (key) => {
        const tabs = {};
        tabs[key] = true;
        this.setState({tabs})
    }

    dismiss_alert = () => {
        clearTimeout(this.alertTimeoutSession);
        this.setState({ alert_status: false })
    }

    show_alert = (alert_message, alert_Type = "alert", time) => {
        clearTimeout(this.alertTimeoutSession);
        this.setState({ alert_status: true, alert_message, alert_Type });
        this.alertTimeoutSession = setTimeout(() => {
            this.setState({ alert_status: false });
        }, time || 3000)
    }

    render(){
        const headerContent = this.props.headerContent && this.props.headerContent[0];
        const header = {
            pageName:"pageName",
            downarrow: "icon-arrow_down"
        }
        const staticLabels = this.state.staticLabels || {};

        const {
            showOnlyDifferences,
            compareCardsArray,
            tableKeys,
            tabs,
            lpPromotions_pwa,
            otherPromotions_pwa,
            alert_message,
            alert_status,
            alert_Type,
        } = this.state;

        const visibleCloseBtn = compareCardsArray.length >= 3 ? true : false;
        const renderCards = compareCardsArray.map((card, index) => <CompareCard
                                                            data={card || {}}
                                                            key={index}
                                                            visibleCloseBtn={visibleCloseBtn}
                                                            showMorePaymentPromotions={this.showMorePaymentPromotions}
                                                            assignModalData={this.assignModalData}
                                                            showOnlyDifferences={showOnlyDifferences}
                                                            addItemToCart={this.addItemToCart}
                                                            goToPdpPage={this.goToPdpPage}
                                                            removeProductFromCompare={this.removeProductFromCompare} />);

        const breadcrumbInfo = {
            "label": (staticLabels['pwaComparePage-breadcrumb-label'] || 'pwaComparePage-breadcrumb-label'),
            "breadcrumbData": [],
            "searchTerm": null
        }
        let tableDetails = []
        for(let j in tableKeys){
            let key = tableKeys[j];
            let obj = { differences: true, name: key };
            obj.td = [];
            for(let i in compareCardsArray){
                let Attrs = compareCardsArray[i].productAttributes || [];
                if(Attrs[key] && obj.td.indexOf(Attrs[key])!==-1){
                    obj.differences = false;
                }
                obj.td.push(Attrs[key] || '')
            }
            tableDetails.push(obj);
        };
        const modalEdd = {
            modalId: "edd-modal",
            modalClass: "o-product__modal modal fade",
            modalTabIndex: "1",
            modalAriaLabelledBy: "edd-modal",
            modalDialogClass: "modal-dialog modal-dialog-centered",
            modalContentClass: "modal-content"
        };
        return(
            <parentContext.Consumer>
                {({ handleMobileMenu, showMobileMenu, showTypehead, handleTypeheadShow, handleTypeheadHide, loginDetails, showModal, headerData, SelectedModelData }) => {
                    return (

                    <React.Fragment>
                            <div className={showModal['comparatorOfferYPromotions'] ? 'modal-backdrop show' : ''}></div>
                            {showModal.comparatorOfferYPromotions === true ?
                                <Modal modalDetails={modalEdd} showModalpopUp={"comparatorOfferYPromotions"}>
                                    <ComparatorOfferYPromotions
                                        lpPromotions_pwa={lpPromotions_pwa || []}
                                        otherPromotions_pwa={otherPromotions_pwa || []}
                                        ModalpopUp={"comparatorOfferYPromotions"}
                                        tabs={tabs}
                                        switchTab={this.switchTab}
                                    />
                                </Modal>
                                : null
                            }
                        <Header
                            loginDetails={loginDetails}
                            handleTypeheadHide={handleTypeheadHide}
                            handleTypeheadShow={handleTypeheadShow}
                            handleMobileMenu={handleMobileMenu}
                            showMobileMenu={showMobileMenu}
                            showTypehead={showTypehead}
                            data={header}
                            headerData={headerContent || headerData}
                            pageName="comparator"
                            />

                        <main>
                            <Alert {...this.props}
                                alertTopClass={"m-alert__container mdc-snackbar -alertCheckout -step1 -" + alert_Type}
                                iconType={"a-alert__icon icon-" + alert_Type}
                                text={alert_message}
                                alert_status={alert_status}
                                dismiss_alert={this.dismiss_alert}
                            />
                            <div className="organism container-fluid o-main-container o-one-column">
                                <div className="container p-0">
                                    <div className="row d-none d-lg-block">
                                        <Breadcrumb breadcrumbInfo={breadcrumbInfo}/>
                                        <div className="col my-3">
                                            <Link className="a-offerList-anchor" href="" asInfo="" onClick={this.goBack}>
                                                <Icons className="icon-arrow_left" />{staticLabels['pwaComparePage-return-label'] || 'pwaComparePage-return-label'}
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="row m-0">
                                        <div className="col">
                                            <PlpComparator {...this.props}
                                                tableDetails={tableDetails}
                                                staticLabels={staticLabels}
                                                renderCards={renderCards}
                                                handleShowOnlyDiff={this.handleShowOnlyDiff}
                                                showOnlyDifferences={showOnlyDifferences}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <div className={showModal['showModal13'] ? 'modal-backdrop show' : ''}></div>

                        <Footer loginDetails={loginDetails} />

                    </React.Fragment>

                    )}
                }
            </parentContext.Consumer>
        )
    }
}

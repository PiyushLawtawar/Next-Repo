import React from 'react';
import { H6 } from '../../atoms/HeadLines/Headlines';
import Button from "../../atoms/Button/Button";
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import get from 'lodash/get';
import Modal from '../../../helpers/modal/modal';
import ModalHeader from './ModalHeader';
import ProductImage from '../ProductImage/ProductImage';
import EddProductDetail from '../ProductEdd/EddProductDetail';
import EddAddress from '../ProductEdd/EddAddress';
import EddClickAndCollect from '../ProductEdd/EddClickAndCollect';
import { parentContext } from '../../../contexts/parentContext';
import { Utility, logError, logDebug, UserAgentDetails } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';


const address = { "s": "0", "records": [{ "lastName": "PA", "country": "MX", "address3": null, "city": "asdasd", "address2": null, "address1": "asdasdd", "nickName": "New_Adress_Venki", "stateId": null, "postalCode": "02110", "building": null, "neighborhoodId": "0000000000024", "firstName": "Venkatesh", "phoneNumber": "123-1234567", "interiorNumber": null, "delegationMunicipality": "AZCAPOTZALCO", "maternalName": null, "exteriorNumber": "9880255655", "neighbourhood": "ECOLOGICA NOVEDADES IMPACTO", "cellular": null, "repositoryId": "3312417135", "delegationMunicipalityId": "00002", "middleName": null, "state": "DISTRITO FEDERAL", "businessPhoneNumber": null }, { "lastName": "dfsgdfg", "country": "Mexico", "address3": null, "city": "Hebbal", "address2": "Street 2nd cross", "address1": "K PO", "nickName": "Hemath", "stateId": "01", "postalCode": "24500", "building": null, "neighborhoodId": "0000000000027", "firstName": "Gowda", "phoneNumber": "232-2345345", "interiorNumber": null, "delegationMunicipality": "CAMPECHE", "maternalName": "Swamy", "exteriorNumber": "8888888888", "neighbourhood": "BECAN", "cellular": null, "repositoryId": "3291169317", "delegationMunicipalityId": "00003", "middleName": null, "state": "AGUASCALIENTES", "businessPhoneNumber": null }], "defaultShippingAddressId": "3291169317" };

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: false
        }
    }

    getPostalCodeAddress = (selectedAddress, eddRes, closeModal, collectionSkuId) => {
        let storeName = '';

        // service addresssearch change GET from POST method :: Start
        let payLoad = '?action=EMA&cp=' + selectedAddress;
        Utility(Path.addresssearch + payLoad, 'GET').then(response => {
            // service addresssearch change GET from POST method :: End

            if (response && response.data && response.data.s == "0" && response.data.addrSearchResponse) {
                let { addrSearchResponse: { municipality = "", state = "" } = "" } = response.data;
                let postalCodeState = "C.P." + selectedAddress + "," + municipality[0].split(":")[1] + "," + state[0].split(":")[1]
                eddRes.stateDetails = postalCodeState
                if (eddRes && eddRes.EDDErrorMessages && isEmpty(eddRes.EDDErrorMessages) && !eddRes.estimatedDeliveryDate) { // removed not empty condition for 24153
                    eddRes.EDDErrorMessages = { [collectionSkuId || this.props.productSizeId]: "Por ahora no es posible mostrar la fecha de entrega", stateDetails: storeName }
                }
                this.props.estimatedDate(eddRes)
                closeModal('showModal1')
            }
            else if (response && response.data && response.data.s == "1") {
                let { addrSearchResponse: { municipality = "", state = "" } = "" } = response.data;
                let postalCodeState = "C.P." + selectedAddress
                eddRes.stateDetails = postalCodeState
                if (eddRes && eddRes.EDDErrorMessages && isEmpty(eddRes.EDDErrorMessages)) { // removed not empty condition for 24153
                    eddRes.EDDErrorMessages = { [collectionSkuId || this.props.productSizeId]: "Por ahora no es posible mostrar la fecha de entrega", stateDetails: storeName }
                }
                this.props.estimatedDate(eddRes)
                closeModal('showModal1')
            }
        }).catch(e => {
            console.error("edd service", e)
        })
    }

    getEdd = (selectedAddress, closeModal, selectedState, fromPostal, addressId) => {

        let allproduct = get(this.props, 'fullCollectionData.productsInfo', {});
        let productInfo = {}
        let collectionSkuId = "";
        let collectionProductType = "";
        //let Qty = get(this.props, 'qtyDropdownInfo.pdpQty', '');
        let isCollection = (this.props.isCollection === true) ? get(this.props, 'SelectedEdd.props.modalProductDetails.ProductCode', '') : this.props.modalProductDetails.ProductCode
        let Qty = this.props.isCollection === true ? get(this.props, 'SelectedEdd.props.qtyDropdownInfo.pdpQty', '1') : get(this.props, 'qtyDropdownInfo.pdpQty', '1')  /* modified for bug id 23723 */
        for (let product in allproduct) {
            if (isCollection == product) {
                productInfo = allproduct[product]
                collectionSkuId = productInfo && productInfo.productVarientsInfo && productInfo.productVarientsInfo.skuAttributeMap && Object.keys(productInfo.productVarientsInfo.skuAttributeMap)[0] || ""
                collectionProductType = productInfo && productInfo.productType && productInfo.productType[0] || ""
                // Qty = qtyDropdownInfo
            }
        }
        const { isMarketPlace = 'false', alloffers } = this.props.marketPlaceInfo || {};
        try {
            if (isMarketPlace === 'true') {
                const leadtimeForSLOrCnC = get(alloffers, 'leadtimeForSL', '');
                if (fromPostal == true) {
                    const marketPlaceInfoTmp = { isMarketPlace, leadtimeForSLOrCnC, stateDetails: "" };
                    this.getPostalCodeAddress(selectedAddress, marketPlaceInfoTmp, closeModal, collectionSkuId)
                    // this.props.estimatedDate(marketPlaceInfoTmp)
                    // closeModal('showModal1');
                }
                else {
                    const marketPlaceInfoTmp = { isMarketPlace, leadtimeForSLOrCnC, stateDetails: selectedState };
                    this.props.estimatedDate(marketPlaceInfoTmp)
                    closeModal('showModal1');
                }

            } else {
                let productTypeText = '';
                if (!this.props.hybridDigital) {
                    productTypeText = 'Soft Line'
                } else if (isEmpty(allproduct)) {
                    productTypeText = this.props.productType || '';
                }
                /*changes made for bug id 24153 -- start */
                if (this.props.isCollection === true) {
                    if (isEmpty(allproduct)) {
                        productTypeText = this.props.productType || '';
                    } else {
                        productTypeText = collectionProductType || this.props.productType && this.props.productType[0] || this.props.productType;
                    }
                }

                /*changes made for bug id 24153 -- end */


                if (!this.props.pdpOfferList || typeof this.props.pdpOfferList === 'undefined') {
                    Utility(Path.estimatedDeliveryDate, 'POST', {
                        "zipCode": selectedAddress,
                        "quantity": Qty ? Qty != "0" ? Qty : "1" : this.props.pdpQty && this.props.pdpQty != "0" ? this.props.pdpQty : "1",  /*changes made for bug id 24153 */
                        "pageName": "pdp",
                        "skuId": collectionSkuId || this.props.productSizeId,
                        "productType": productTypeText
                    }).then(response => {

                        response && response.data ? response.data.stateDetails = selectedState : response.data.stateDetails = "";
                        let eddRes = response.data;


                        eddRes.config = response && response.config
                        eddRes.addressId = addressId || "";
                        if (fromPostal == true) {

                            this.getPostalCodeAddress(selectedAddress, eddRes, closeModal, collectionSkuId)

                            // Utility(Path.addresssearch, 'POST', {
                            //     "action": "EMA",
                            //     "cp": selectedAddress
                            // }).then(response => {
                            //     if (response && response.data && response.data.s == "0" && response.data.addrSearchResponse) {
                            //         let { addrSearchResponse: { municipality = "", state = "" } = "" } = response.data;
                            //         let postalCodeState = "C.P." + selectedAddress + "," + municipality[0].split(":")[1] + "," + state[0].split(":")[1]
                            //         eddRes.stateDetails = .stateDetails = postalCodeState;
                            //         this.props.estimatedDate(eddRes)
                            //         closeModal('showModal1')
                            //     }
                            //     else if (response && response.data && response.data.s == "1") {
                            //         let postalCodeState = "C.P." + selectedAddress
                            //         if (fromPostal == true) eddRes.stateDetails = postalCodeState;
                            //         this.props.estimatedDate(eddRes)
                            //         closeModal('showModal1');
                            //     }
                            // }).catch(e => {
                            //     console.log("edd service", e)
                            // })
                        }
                        else {
                            this.props.estimatedDate(response.data)
                            closeModal('showModal1')
                        }

                        //this.setState({ listedAddress })
                    }).catch((err) => {

                        this.getPostalCodeAddress(selectedAddress, { "s": "0", "EDDErrorMessages": { [collectionSkuId || this.props.productSizeId]: "Por ahora no es posible mostrar la fecha de entrega" } }, closeModal)
                        closeModal('showModal1')
                    });
                } else {
                    closeModal('showModal1')
                }

            }
        } catch (e) { logError("Error while on get Edd: ", e) }
    }

    fetchStates = (selectedAddress, closeModal) => {
        //const staticState = ;


        if (selectedAddress.fromAddress == true) {

            let selectedState = "";
            let stateName = "";
            let municipality = "";
            let nickName = "";
            for (let address of selectedAddress.address) {
                if (address.addressId == selectedAddress.selectedAddressid) { stateName = address.state; nickName = address.nickName; municipality = address.delegationMunicipality }
            }
            selectedState = nickName + ":" + municipality + "," + stateName
            let postalCode = selectedAddress.address.filter((eachAddress) => eachAddress.addressId == selectedAddress.selectedAddressid)
            const selectedAddressInfo = postalCode && postalCode[0] || {};
            postalCode = postalCode && postalCode[0] && postalCode[0].postalCode;
            /* if (this.props.set_postal_zip_code) { // We need to refer postal code from selected address info.
                this.props.set_postal_zip_code(postalCode);
                closeModal('showModal1');
            } */
            if (this.props.setSelectedAddressInfo) {
                this.props.setSelectedAddressInfo(selectedAddressInfo);
                this.getEdd(postalCode, closeModal, selectedState, false, selectedAddress.selectedAddressid);
            }

            //this.getStates({postalCode,selectedAddress})
            //this.props.addressList({ "stateList": staticState.estados, "selectedAddressId": selectedAddress })




        } else {
            this.getEdd(selectedAddress.postCode, closeModal, "", true);

            //this.getStates({postalCode:selectedAddress.postCode,selectedAddress:""})
            //this.props.addressList({ "stateList": staticState.estados, "selectedAddressId": "" })
        }

        // this.setState({
        //     statesList:staticState.estados
        // })
    }
    // componentDidMount(){
    //     // 
    //     // window.removeEventListener('scroll', this.props.handleScroll)
    // }
    componentWillReceiveProps(nextprops) {

        //  window.removeEventListener('scroll', this.props.handleScroll)
    }
    componentWillUnmount() {

        document.getElementsByTagName('body')[0].className.replace(/modal-open/g, "")
    }

    componentDidMount() {
        const { isMobile } = UserAgentDetails(window);
        this.setState({ isMobile })
    }

    render() {
        const { isMobile } = this.state;
        const modalHeader = {
            title: this.props.staticLabels && this.props.staticLabels['pdpPage.estimatedDeliveydatePopup.label'] || 'pdpPage.estimatedDeliveydatePopup.label', /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
            titleType: 'h4',
            headlineAttributes: {
                "id": "edd-modal"
            },
            close: true,
            buttonClass: 'close a-eddBox__closeButton',
            buttonAttributes: {
                "type": "button",
                "data-dismiss": "modal",
                "aria-label": "Close"
            },
            requireArrow: false
        };

        const productImage = get(this.props, 'modalProductDetails.productImage', '');
        const imgDetails = {
            imgAlt: 'PDP Demo',
            imgTitle: 'Tenis Under Armour Showstopper 2.0 entrenamiento para caballero',
            imgSrc: productImage
        };

        const overflowStyle = {
            overflowX: 'hidden',
            overflowY: 'auto',
            padding: this.props.forcePadding === true ? "1rem" : 0
        }
        return (
            <React.Fragment>
                <ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} />
                <div className="modal-body" style={isMobile ? overflowStyle : {}}>
                    {/*                
                        <div className="m-product__eddDate" data-target="#edd-modal" data-toggle="modal" onClick={() => OpenModal('showModal3')}>
                            Hi Bakesh
                        </div>
                   */}
                    <div className="row">
                        <div className="col-4">
                            <ProductImage options={imgDetails} />
                        </div>
                        <div className="col-8">
                            <EddProductDetail skuRecords={this.props.skuRecords} spanText={this.props.spanText} priceToShow={this.props.priceToShow} modalProductDetails={this.props.modalProductDetails} {... this.props} />
                        </div>
                        <div className="col-12">
                            <parentContext.Consumer>{({ closeModal, loginDetails }) => (

                                <EddAddress staticLabels={this.props.staticLabels} addressList={address} stateDetails={(e) => this.fetchStates(e, closeModal)} selectedAddId={this.props.selectedAddId} set_postal_zip_code={this.props.set_postal_zip_code} selectedAddressInfo={this.props.selectedAddressInfo} loginDetails={loginDetails} /> /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
                            )
                            }</parentContext.Consumer>
                            <EddClickAndCollect />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

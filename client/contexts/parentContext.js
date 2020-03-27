import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { UserAgentDetails } from '../helpers/utilities/utility';
export const parentContext = React.createContext();
const _tohtml = (content) => {
    return { __html: content };
}

const getCookie = (name) => {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    }
    else {
        begin += 2;
        var end = document.cookie.indexOf(";", begin);
        if (end == -1) {
            end = dc.length;
        }
    }
    // because unescape has been deprecated, replaced with decodeURI
    //return unescape(dc.substring(begin + prefix.length, end));
    return decodeURI(dc.substring(begin + prefix.length, end));
}


class ParentProvider extends React.Component {
    constructor(props) {
        super(props);
        let cartHeaderResponse = {};
        let LoggedInSession = false;
        if (props.router.query && props.router.query.data) {
            cartHeaderResponse = props.router.query.data.cartHeader || {};
            LoggedInSession = (cartHeaderResponse.cartHeaderDetails && cartHeaderResponse.cartHeaderDetails.isLoggedIn) || false;
        }
        this.state = {
            snbfooterData: (props.router.query && props.router.query.data && props.router.query.data.footerContent && props.router.query.data.footerContent[0]) || {},
            headerData: (props.router.query && props.router.query.data && props.router.query.data.headerContent && props.router.query.data.headerContent[0]) || {},
            data: (props.router.query && props.router.query.data) || {},
            showMobileHeaderMenu: false,
            showTypehead: false,
            LoggedInSession,
            cartHeaderResponse,
            cartHeaderProcessCompleted: false,
            SelectedModelData: '',
            SelectedEdd: "",
            selectedCollProductId: "",
            modalState: {
                showModal1: false,
                showModal2: false,
                showModal3: false,
                showModal4: false,
                showAvailabilityItr: false,
                showModal6: false,
                showModal7: false,
                showModal8: false,
                showModal9: false,
                showModal10: false,
                showModal11: false,
                showModal12: false,
                showModal13: false,
                showModal14: false,
                showModal15: false,
                wishListSanta: false,
                MyBagGRModal: false,
                MyBagGRModal2: false,
                MyBagGRModal3: false,
                PromotionModal: false,
                deleteModal: false,
                QtyModelPromotion: false,
                billingModel: false,
                billingInnerModel: false,
                comparatorOfferYPromotions: false,
                removeAddressAlertModal: false,
                MyBagGiftWrap: false,
                // Custom Products functionality START
                selectProductModal: false,
                showModalPersonalization: false,
                // Custom Products functionality END
            },
            breadCrumbDataForBackEvent: {},
            ccclassName: true,
            ppclassName: false,
            ctclassName: false,
            isCashSelected: true,
            isSpieSelected: false,
            isCieSelected: false,
            selectedPaymentType: 'cash',
            checkoutHeaderFooterData: {},
            maxPrice: '',
            minPrice: '',
            searchbarClicked: false,
            leftNavData: [],
            dropdownMenu: false,
            showCreditPropertyFields: false,
            showPhysicalOrMoralPersonFields: true,
            showForeignFields: false,
            staticState: {},
            configurationData: (props.router.query && props.router.query.data && props.router.query.data.configurationData && props.router.query.data.configurationData) || {},
            departmentData: (props.router.query && props.router.query.data && props.router.query.data.departmentData && props.router.query.data.departmentData) || {},
            plpListView: false,
            labelData: (props.router.query && props.router.query.data && props.router.query.data.staticLabelValues && props.router.query.data.staticLabelValues) || {},
            limitedPiecesSkusData: (props.router.query && props.router.query.data && props.router.query.data.limitedPiecesSkusData && props.router.query.data.limitedPiecesSkusData) || {},
            checkoutHeaderData: (props.router.query && props.router.query.data && props.router.query.data.checkoutHeaderData) || null,
            checkoutFooterData: (props.router.query && props.router.query.data && props.router.query.data.checkoutFooterData) || null,
            activeTab: 'mdc-tab-1'
        };
    }
    componentDidMount(){
        window.onhashchange = () => {
            if(window.location.hash !== '#/Modal')
            this.closeAllModals();
        }        
    }
    closeAllModals = () => {
        const modalState = {
                showModal1: false,
                showModal2: false,
                showModal3: false,
                showModal4: false,
                showAvailabilityItr: false,
                showModal6: false,
                showModal7: false,
                showModal8: false,
                showModal9: false,
                showModal10: false,
                showModal11: false,
                showModal12: false,
                showModal13: false,
                showModal14: false,
                showModal15: false,
                wishListSanta: false,
                MyBagGRModal: false,
                MyBagGRModal2: false,
                MyBagGRModal3: false,
                PromotionModal: false,
                deleteModal: false,
                QtyModelPromotion: false,
                billingModel: false,
                billingInnerModel: false,
                comparatorOfferYPromotions: false,
                removeAddressAlertModal: false,
                MyBagGiftWrap: false,
                // Custom Products functionality START
                selectProductModal: false,
                showModalPersonalization: false,
                // Custom Products functionality END
            }
        this.setState({modalState});
    }
    onChangeBillingCTPayment = (paymentType) => {
        if (paymentType === 'spei') {
            this.setState({
                isCashSelected: false,
                isSpieSelected: true,
                isCieSelected: false,
                selectedPaymentType: 'spei'
            })
        } else if (paymentType === 'cash') {
            this.setState({
                isSpieSelected: false,
                isCieSelected: false,
                isCashSelected: true,
                selectedPaymentType: 'cash'
            })

        } else {
            this.setState({
                isCieSelected: true,
                isSpieSelected: false,
                isCashSelected: false,
                selectedPaymentType: 'cie'
            })
        }
    }

    selectedPaymentMethod = (tabType) => {
        if (tabType === 'creditCard') {
            this.setState({
                ccclassName: true,
                ppclassName: false,
                ctclassName: false
            });
        }
        if (tabType === 'paypal') {
            this.setState({
                ccclassName: false,
                ppclassName: true,
                ctclassName: false
            })
        }
        if (tabType === 'cash') {
            this.setState({
                ccclassName: false,
                ppclassName: false,
                ctclassName: true
            })
        }
    }
    selectInvoiceTab = (tabType) => {
        if (tabType === 'showPhysicalOrMoralPersonFields') {
            this.setState({ showCreditPropertyFields: false, showPhysicalOrMoralPersonFields: true, showForeignFields: false })
        }
        if (tabType === 'showCreditPropertyFields') {
            this.setState({ showCreditPropertyFields: true, showPhysicalOrMoralPersonFields: false, showForeignFields: false })
        }
        if (tabType === 'showForeignFields') {
            this.setState({ showCreditPropertyFields: false, showPhysicalOrMoralPersonFields: false, showForeignFields: true })
        }
    }
    showTabContent = (activeTab) => {
        this.setState({ activeTab });
    }
    setBreadCrumbDataForBackEvent = (data) => {
        this.setState({ breadCrumbDataForBackEvent: data });
    }
    start_login_status = () => {
        this.setState({
            cartHeaderProcessCompleted: false
        })
    }
    check_login_status = (cartHeaderResponse = {}) => {
        this.setState({
            LoggedInSession: cartHeaderResponse.cartHeaderDetails ? cartHeaderResponse.cartHeaderDetails.isLoggedIn : false,
            cartHeaderResponse,
            cartHeaderProcessCompleted: true
        })
    }
    setCheckoutHeaderFooterData = (key, data) => {
        const { checkoutHeaderFooterData } = this.state;
        checkoutHeaderFooterData[key] = data;
        this.setState({ checkoutHeaderFooterData })
    }
    updateCartHeaderDetails = (cartHeaderResponse = {}) => {

        if (!isEmpty(cartHeaderResponse)) {
            this.setState({ cartHeaderResponse })
        }
    }

    updateCartCount = (count) => {
        const { cartHeaderResponse } = this.state;
        if (cartHeaderResponse && cartHeaderResponse.cartHeaderDetails) {
            cartHeaderResponse.cartHeaderDetails.cartCount = count
        }
        this.setState({ cartHeaderResponse });
    }

    handleMobileHeaderMenu = () => {
        this.setState(prevState => {
            return {
                showMobileHeaderMenu: !prevState.showMobileHeaderMenu,
                showTypehead: false
            }
        }, () => {
            if (this.state.showMobileHeaderMenu) {
                document.getElementsByTagName('body')[0].setAttribute('style', 'position:fixed !important;width: 100%');
            } else {
                document.getElementsByTagName('body')[0].removeAttribute('style');
            }
        }
        );
    }

    handleTypeheadShow = () => {
        this.setState({
            showTypehead: true
        });
        try {
            const { isIpad, isPortrait } = UserAgentDetails(window);
            if (isIpad && isPortrait) {
                document.getElementsByTagName('html')[0].setAttribute('style', 'overflow:hidden');
                document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden');
            }
        } catch (e) { }
    }

    handleTypeheadHide = () => {

        this.setState({
            showTypehead: false,
            searchbarClicked: false,
            dropdownMenu: false
        });
        try {
            const { isIpad, isPortrait } = UserAgentDetails(window);
            /*commented for bug id 19884 - start */
            // if (isIpad && isPortrait) {
            //     document.getElementsByTagName('html')[0].removeAttribute('style');
            //     document.getElementsByTagName('body')[0].removeAttribute('style');
            // }
            /*commented for bug id 19884 - end */
        } catch (e) { }
    }

    OpenModal = (selectedModal, modalToClose) => {
        window.location.hash = "#/";
        window.location.hash = "#/Modal";
        if (selectedModal != undefined && selectedModal != "" && selectedModal != null) {
            let modalState = this.state.modalState;
            modalState[selectedModal] = true;
            if (!isEmpty(modalToClose)) {
                modalState[modalToClose] = false;
            }
            this.setState({ modalState: modalState });
        }

        //document.getElementsByTagName('body')[0].className += ' modal-open'
        const { isMobile, isIpad, isPortrait } = UserAgentDetails(window);
        let padWidth = window.innerWidth;

        if (selectedModal == "showModal1" || selectedModal == "showModal2" || selectedModal == "showModal7" || selectedModal == "showModal8" || selectedModal == "showModal9" || selectedModal == "showModal11" || selectedModal == "billingInnerModel" || selectedModal == "billingmodel") {
            document.getElementsByTagName('html')[0].setAttribute('style', 'overflow:hidden !important');
            if (isMobile || (isIpad && isPortrait)) {
                document.getElementsByTagName('body')[0].setAttribute('style', 'overflow:hidden; height:100%');  /*fixes for 19884 -- added to work in safari */
            }
        }

        //document.getElementByTag("").add
    }
    updateSelectedState = (SelectedState) => {
        this.setState({
            SelectedModelData: SelectedState
        })
    }
    selectedEddState = (SelectedEdd) => {
        this.setState({
            SelectedEdd
        })
    }
    updateCollProductId = (SelectedState) => {
        this.setState({
            selectedCollProductId: SelectedState
        })
    }
    updateCollectionMobileData = (SelectedState) => {
        this.setState({
            selectProductModalData: SelectedState
        })
    }
    closeModal = (selectedModal, modalToOpen) => {

        if (selectedModal != undefined && selectedModal != "" && selectedModal != null) {

            let modalState = this.state.modalState;
            if (typeof selectedModal == "object" && selectedModal.length > 1) {
                selectedModal.map(modalName => modalState[modalName] = false)
            }
            else {
                modalState[selectedModal] = false;
                if (!isEmpty(modalToOpen)) {
                    modalState[modalToOpen] = true;
                }
            }
            this.setState({ modalState: modalState });

        }
        else {

            let modalState = this.state.modalState;
            for (var modal in modalState) {
                modalState[modal] = false
            }
            this.setState({ modalState })
        }
        if (selectedModal == "showModal1" || selectedModal == "showModal2" || selectedModal == "showModal7" || selectedModal == "showModal8" || selectedModal == "showModal9" || selectedModal == "showModal11" || selectedModal == "billingInnerModel" || selectedModal == "billingmodel" || isEmpty(modalToOpen)) {
            document.getElementsByTagName('html')[0].removeAttribute('style');
            document.getElementsByTagName('body')[0].removeAttribute('style'); /*fixes for 19884 -- added to work in safari */
            // if (selectedModal == "showModal11") {
            //     document.getElementsByTagName('body')[0].removeAttribute('style');
            // }

        }
    }

    stopPropagationToChild = (e) => {
        e.stopPropagation();
    }

    setMinMaxPriceInPlp = (value, id) => {
        if (id === 'min-price-filter') {
            this.setState({ minPrice: value });
        } else {
            this.setState({ maxPrice: value });
        }
    }

    handleSearchBarShow = (e) => {
        e.stopPropagation();
        this.setState({ searchbarClicked: true, showTypehead: true });
    }

    handleSearchBarHide = () => {
        this.setState({ searchbarClicked: false });
    }

    handleleftNavData = (data) => {
        this.setState({ leftNavData: data });
    }
    handleStaticMetaData = (data) => {
        this.setState({ staticMetaTags: data });
    }
    onDropdownToggle = (e) => {
        if (typeof e !== 'undefined') {
            e.preventDefault();
            e.stopPropagation();
        }
        this.setState({ dropdownMenu: !this.state.dropdownMenu })
    }
    invoiceConfirmationData = (data) => {
        this.setState({ invoiceSubmitData: data })
    }
    invoiceTrackingNumber = (data) => {
        this.setState({ invoiceTrackingNumberData: data })
    }

    invoiceResponseCon = (data) => {
        this.setState({ invoiceResponse: data })
    }

    setFooterData = (data) => {
        this.setState({ snbfooterData: data });
    }

    setConfigurationData = (data) => {
        this.setState({ configurationData: data });
    }

    setDepartmentData = (data) => {
        this.setState({ departmentData: data });
    }

    togglePlpListView = (value) => {
        this.setState({ plpListView: value });
    }

    render() {
        const {
            headerData,
            showMobileHeaderMenu,
            showTypehead,
            modalState,
            LoggedInSession,
            cartHeaderProcessCompleted,
            cartHeaderResponse,
            data,
            SelectedModelData,
            SelectedEdd,
            selectedCollProductId,
            breadCrumbDataForBackEvent,
            ccclassName,
            ppclassName,
            ctclassName,
            isCieSelected,
            isSpieSelected,
            isCashSelected,
            selectedPaymentType,
            checkoutHeaderFooterData,
            minPrice,
            maxPrice,
            searchbarClicked,
            leftNavData,
            dropdownMenu,
            showCreditPropertyFields,
            showPhysicalOrMoralPersonFields,
            showForeignFields,
            invoiceSubmitData,
            invoiceTrackingNumberData,
            invoiceResponse,
            snbfooterData,
            selectProductModalData,
            configurationData,
            departmentData,
            plpListView,
            labelData,
            limitedPiecesSkusData,
            checkoutHeaderData,
            checkoutFooterData,
            activeTab
        } = this.state;
        const { domainName } = this.props;

        const detail = {
            data: data,
            headerData,
            showMobileMenu: showMobileHeaderMenu,
            handleMobileMenu: this.handleMobileHeaderMenu,
            handleTypeheadShow: this.handleTypeheadShow,
            handleTypeheadHide: this.handleTypeheadHide,
            showTypehead,
            showModal: modalState,
            OpenModal: this.OpenModal,
            closeModal: this.closeModal,
            updateSelectedState: this.updateSelectedState,
            selectedEddState: this.selectedEddState,
            updateCollProductId: this.updateCollProductId,
            updateCollectionMobileData: this.updateCollectionMobileData,
            SelectedModelData: SelectedModelData,
            SelectedEdd,
            selectedCollProductId: selectedCollProductId,
            selectProductModalData: selectProductModalData,
            stopPropagationToChild: this.stopPropagationToChild,
            loginDetails: {
                LoggedInSession,
                cartHeaderResponse,
                check_login_status: this.check_login_status,
                cartHeaderProcessCompleted,
                start_login_status: this.start_login_status,
            },
            updateCartHeaderDetails: this.updateCartHeaderDetails,
            updateCartCount: this.updateCartCount,
            domainName: domainName,
            updateState: (stateKay, value) => {
                this.setState({ metaTag: value })
            },
            backEvent: {
                setBreadCrumbData: this.setBreadCrumbDataForBackEvent,
                data: breadCrumbDataForBackEvent
            },
            ccclassName,
            ppclassName,
            ctclassName,
            selectedPaymentMethod: this.selectedPaymentMethod,
            isCieSelected,
            isSpieSelected,
            isCashSelected,
            selectedPaymentType,
            onChangeBillingCTPayment: this.onChangeBillingCTPayment,
            checkoutHeaderFooterData: checkoutHeaderFooterData,
            setCheckoutHeaderFooterData: this.setCheckoutHeaderFooterData,
            minPrice,
            maxPrice,
            setMinMaxPriceInPlp: this.setMinMaxPriceInPlp,
            handleSearchBarShow: this.handleSearchBarShow,
            handleSearchBarHide: this.handleSearchBarHide,
            searchbarClicked,
            handleleftNavData: this.handleleftNavData,
            leftNavData: leftNavData,
            invoiceConfirmationData: this.invoiceConfirmationData,
            invoiceTrackingNumber: this.invoiceTrackingNumber,
            invoiceResponseCon: this.invoiceResponseCon,
            invoiceSubmitData: invoiceSubmitData,
            invoiceTrackingNumberData: invoiceTrackingNumberData,
            invoiceResponse: invoiceResponse,
            dropdownMenu,
            onDropdownToggle: this.onDropdownToggle,
            selectInvoiceTab: this.selectInvoiceTab,
            showCreditPropertyFields,
            showPhysicalOrMoralPersonFields,
            showForeignFields,
            setFooterData: this.setFooterData,
            snbfooterData,
            setConfigurationData: this.setConfigurationData,
            configurationData,
            departmentData,
            setDepartmentData: this.setDepartmentData,
            plpListView,
            togglePlpListView: this.togglePlpListView,
            labelData,
            limitedPiecesSkusData,
            checkoutHeaderData,
            checkoutFooterData,
            showTabContent: this.showTabContent,
            activeTab,
            closeAllModals: this.closeAllModals
        };
        return (
            <parentContext.Provider value={detail}>
                {this.props.children}
            </parentContext.Provider>
        )
    }
}

export default ParentProvider;

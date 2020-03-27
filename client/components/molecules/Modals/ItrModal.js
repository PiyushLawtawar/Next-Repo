import React from 'react';
import get from 'lodash/get';
import ModalHeader from './ModalHeader';
import ProductImage from '../ProductImage/ProductImage';
import EddProductDetail from '../ProductEdd/EddProductDetail';
import ItrStates from '../ProductItr/ItrStates';
import { Utility,logError,logDebug, UserAgentDetails } from '../../../helpers/utilities/utility';
import { Path } from '../../../helpers/config/config';
import isEmpty from 'lodash/isEmpty'

export default class extends React.Component {
    constructor() {
        super()
        this.state = { stateList: {}, ErrMessage: "", isMobile: false };
    }
    getStates = () => {
        
        Utility(Path.getListOfStates+"ITR", 'GET').then(response => {

            if (response.data && response.data != null) {
                if (response.data.s == "0") {
                    this.setState({ stateList: response.data });
                }
                else {
                    this.setState({ ErrMessage: response.data.err })
                }

            }
            else {
                logError("No Response from getListOfStates in ItrModal")
            }
        });
    }
    componentDidMount() {
        this.getStates()
        const { isMobile } = UserAgentDetails(window);
        this.setState({isMobile})
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
       // this.getStates()
    }
    componentWillUnmount(){
        document.getElementsByTagName('body')[0].className.replace(/modal-open/g, "")
    }
    render() {
        const { isMobile } = this.state;
        const modalHeader = {
            title: this.props.staticLabels && this.props.staticLabels['pdpPage.ITR.DisplayInPDP.label'] || 'pdpPage.ITR.DisplayInPDP.label', /*changes made for Pdp staticlabel issue --  addedd s to staticlabel */
            titleType: 'h4',
            headlineAttributes: {
                "id": "itr-modal"
            },
            close: true,
            buttonClass: 'close',
            buttonAttributes: {
                "type": "button",
                "data-dismiss": "modal",
                "aria-label": "Close"
            }
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
            padding: this.props.forcePadding === true ? "1rem": 0
        }
        return (
            <React.Fragment>
                <ModalHeader modalHeader={modalHeader} ModalpopUp={this.props.ModalpopUp} />
                <div className="modal-body" style={isMobile ? overflowStyle : {}}>
                    <div className="row">
                        <div className="col-4">
                            <ProductImage options={imgDetails} />
                        </div>
                        <div className="col-8">
                            <EddProductDetail skuRecords={this.props.skuRecords} spanText={this.props.spanText} priceToShow={this.props.priceToShow} modalProductDetails={this.props.modalProductDetails} {... this.props} />
                        </div>
                        <div className="col-12 p-0" style={{padding:"0px !important"}}>
                            {!isEmpty(this.state.stateList) && <ItrStates stateList={this.state.stateList.estados} ErrMessage={this.state.ErrMessage} modalProductDetails={this.props.modalProductDetails} />}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}